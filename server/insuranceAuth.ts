import * as argon2 from "argon2";
import { db } from "./db";
import { insuranceOperators, insuranceOperatorSessions } from "@shared/schema";
import { eq } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";

const INACTIVITY_MS = 15 * 60 * 1000;

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}

export async function seedDemoOperators() {
  const demoPassword = "Pinnacle2026!";
  const guestPassword = "ViewOnly";
  const demoHash = await hashPassword(demoPassword);
  const guestHash = await hashPassword(guestPassword);

  const demos = [
    { operatorId: "op-mccoy-000",   fullName: "Robert McCoy",   title: "Managing Director / System Owner", role: "ADMIN",    email: "robert.mccoy@pinnacleins.demo",   licenseNumber: "IN-1000001", avatarInitials: "RM", hash: demoHash },
    { operatorId: "op-marsh-001",   fullName: "David Marsh",    title: "Agency Principal / Administrator", role: "ADMIN",    email: "david.marsh@pinnacleins.demo",    licenseNumber: "IN-2847561", avatarInitials: "DM", hash: demoHash },
    { operatorId: "op-whitfield-002", fullName: "Karen Whitfield", title: "Senior Account Manager",        role: "APPROVER", email: "karen.whitfield@pinnacleins.demo", licenseNumber: "IN-3195842", avatarInitials: "KW", hash: demoHash },
    { operatorId: "op-jennings-003", fullName: "Tom Jennings",  title: "Document Specialist",             role: "OPERATOR", email: "tom.jennings@pinnacleins.demo",   licenseNumber: "IN-4028736", avatarInitials: "TJ", hash: demoHash },
    { operatorId: "op-viewer-004",  fullName: "Demo Viewer",    title: "Read-Only Observer",              role: "VIEWER",   email: "viewer@pinnacleins.demo",          licenseNumber: null,          avatarInitials: "DV", hash: demoHash },
    { operatorId: "op-guest-005",   fullName: "Guest",          title: "Demo Guest",                      role: "VIEWER",   email: "guest@pinnacleins.demo",           licenseNumber: null,          avatarInitials: "GU", hash: guestHash },
  ];

  for (const demo of demos) {
    const { hash, ...fields } = demo;
    const existing = await db.select().from(insuranceOperators)
      .where(eq(insuranceOperators.operatorId, fields.operatorId));

    if (existing.length === 0) {
      await db.insert(insuranceOperators).values({
        ...fields,
        passwordHash: hash,
        totpSecret: null,
        totpEnrolled: false,
        isActive: true,
      });
    } else {
      await db.update(insuranceOperators)
        .set({ passwordHash: hash, email: fields.email, fullName: fields.fullName, title: fields.title })
        .where(eq(insuranceOperators.operatorId, fields.operatorId));
    }
  }
}

export async function loginOperator(
  email: string,
  password: string,
  sessionId: string,
  ipAddress: string
): Promise<{ success: true; operator: { operatorId: string; fullName: string; role: string; title: string; licenseNumber: string | null; avatarInitials: string } } | { success: false; error: string }> {
  const rows = await db.select().from(insuranceOperators)
    .where(eq(insuranceOperators.email, email));

  if (!rows[0]) return { success: false, error: "Invalid credentials" };
  const op = rows[0];

  if (!op.isActive) return { success: false, error: "Account is deactivated" };
  if (!op.passwordHash) return { success: false, error: "Account not configured" };

  const passwordOk = await verifyPassword(op.passwordHash, password);
  if (!passwordOk) return { success: false, error: "Invalid credentials" };

  await db.insert(insuranceOperatorSessions).values({
    sessionId,
    operatorId: op.operatorId,
    ipAddress,
  });

  return {
    success: true,
    operator: {
      operatorId: op.operatorId,
      fullName: op.fullName,
      role: op.role,
      title: op.title,
      licenseNumber: op.licenseNumber ?? null,
      avatarInitials: op.avatarInitials ?? op.fullName.slice(0, 2),
    },
  };
}

export async function logoutOperator(sessionId: string) {
  await db.update(insuranceOperatorSessions)
    .set({ endedAt: new Date(), endReason: "LOGOUT" })
    .where(eq(insuranceOperatorSessions.sessionId, sessionId));
}

export async function touchSession(sessionId: string): Promise<boolean> {
  const rows = await db.select().from(insuranceOperatorSessions)
    .where(eq(insuranceOperatorSessions.sessionId, sessionId));

  if (!rows[0] || rows[0].endedAt) return false;

  const lastActivity = new Date(rows[0].lastActivityAt!).getTime();
  if (Date.now() - lastActivity > INACTIVITY_MS) {
    await db.update(insuranceOperatorSessions)
      .set({ endedAt: new Date(), endReason: "TIMEOUT" })
      .where(eq(insuranceOperatorSessions.sessionId, sessionId));
    return false;
  }

  await db.update(insuranceOperatorSessions)
    .set({ lastActivityAt: new Date() })
    .where(eq(insuranceOperatorSessions.sessionId, sessionId));

  return true;
}

declare module "express-session" {
  interface SessionData {
    insuranceOperator?: {
      operatorId: string;
      fullName: string;
      role: string;
      title: string;
      licenseNumber: string | null;
      avatarInitials: string;
    };
    insuranceSessionId?: string;
  }
}

export function requireInsuranceAuth(req: Request, res: Response, next: NextFunction) {
  const op = req.session.insuranceOperator;
  const sid = req.session.insuranceSessionId;
  if (!op || !sid) return res.status(401).json({ error: "Not authenticated" });

  touchSession(sid).then(active => {
    if (!active) {
      req.session.insuranceOperator = undefined;
      req.session.insuranceSessionId = undefined;
      return res.status(401).json({ error: "Session expired" });
    }
    next();
  }).catch(() => res.status(500).json({ error: "Session check failed" }));
}
