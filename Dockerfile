# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 – Builder
# Install all dependencies and compile frontend + backend
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install build tools needed by some native node modules
RUN apk add --no-cache python3 make g++

# Copy manifests first for layer caching
COPY package*.json ./
RUN npm ci --include=dev

# Copy all source code
COPY . .

# Build frontend (Vite) + backend (esbuild) → dist/
RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 – Runner (lean production image)
# ─────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy built artefacts from builder
COPY --from=builder /app/dist ./dist

# Copy any static assets served at runtime
COPY --from=builder /app/attached_assets ./attached_assets
COPY --from=builder /app/public ./public

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

CMD ["node", "dist/index.cjs"]
