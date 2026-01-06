import { z } from 'zod';
import { insertFrameworkSchema, insertComplianceItemSchema, insertPublicationSchema, frameworks, complianceItems, publications } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  frameworks: {
    list: {
      method: 'GET' as const,
      path: '/api/frameworks',
      responses: {
        200: z.array(z.custom<typeof frameworks.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/frameworks/:id',
      responses: {
        200: z.custom<typeof frameworks.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  complianceItems: {
    list: {
      method: 'GET' as const,
      path: '/api/compliance-items',
      input: z.object({
        frameworkId: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof complianceItems.$inferSelect>()),
      },
    },
  },
  publications: {
    list: {
      method: 'GET' as const,
      path: '/api/publications',
      responses: {
        200: z.array(z.custom<typeof publications.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/publications',
      input: insertPublicationSchema,
      responses: {
        201: z.custom<typeof publications.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
