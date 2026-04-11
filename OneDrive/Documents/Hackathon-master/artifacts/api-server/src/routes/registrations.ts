import { Router } from "express";
import { db } from "@workspace/db";
import { registrationsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import crypto from "crypto";
import {
  CreateRegistrationBody,
  GetRegistrationParams,
  GetRegistrationQrParams,
  ListRegistrationsQueryParams,
} from "@workspace/api-zod";

export const registrationsRouter = Router();

registrationsRouter.get("/registrations", async (req, res): Promise<void> => {
  const query = ListRegistrationsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let dbQuery = db.select().from(registrationsTable).$dynamic();

  if (query.data.eventId) {
    dbQuery = dbQuery.where(eq(registrationsTable.eventId, query.data.eventId));
  }

  const registrations = await dbQuery;
  res.json(registrations);
});

registrationsRouter.post("/registrations", async (req, res): Promise<void> => {
  const body = CreateRegistrationBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const qrCode = `REG-${body.data.eventId}-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;

  const [registration] = await db
    .insert(registrationsTable)
    .values({
      eventId: body.data.eventId,
      studentName: body.data.studentName,
      studentEmail: body.data.studentEmail,
      qrCode,
      attended: false,
    })
    .returning();

  res.status(201).json(registration);
});

registrationsRouter.get("/registrations/:id", async (req, res): Promise<void> => {
  const params = GetRegistrationParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [registration] = await db
    .select()
    .from(registrationsTable)
    .where(eq(registrationsTable.id, params.data.id));

  if (!registration) {
    res.status(404).json({ error: "Registration not found" });
    return;
  }

  res.json(registration);
});

registrationsRouter.get("/registrations/:id/qr", async (req, res): Promise<void> => {
  const params = GetRegistrationQrParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [registration] = await db
    .select()
    .from(registrationsTable)
    .where(eq(registrationsTable.id, params.data.id));

  if (!registration) {
    res.status(404).json({ error: "Registration not found" });
    return;
  }

  res.json({ qrCode: registration.qrCode, registrationId: registration.id });
});
