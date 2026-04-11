import { Router } from "express";
import { db } from "@workspace/db";
import { attendanceTable, registrationsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  MarkAttendanceBody,
  ListAttendanceQueryParams,
} from "@workspace/api-zod";

export const attendanceRouter = Router();

attendanceRouter.get("/attendance", async (req, res): Promise<void> => {
  const query = ListAttendanceQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let dbQuery = db.select().from(attendanceTable).$dynamic();

  if (query.data.eventId) {
    dbQuery = dbQuery.where(eq(attendanceTable.eventId, query.data.eventId));
  }

  const attendance = await dbQuery;
  res.json(attendance);
});

attendanceRouter.post("/attendance", async (req, res): Promise<void> => {
  const body = MarkAttendanceBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [registration] = await db
    .select()
    .from(registrationsTable)
    .where(eq(registrationsTable.qrCode, body.data.qrCode));

  if (!registration) {
    res.status(404).json({ error: "QR code not found" });
    return;
  }

  if (registration.eventId !== body.data.eventId) {
    res.status(400).json({ error: "QR code does not match this event" });
    return;
  }

  await db
    .update(registrationsTable)
    .set({ attended: true })
    .where(eq(registrationsTable.id, registration.id));

  const [record] = await db
    .insert(attendanceTable)
    .values({
      registrationId: registration.id,
      eventId: registration.eventId,
      studentName: registration.studentName,
    })
    .returning();

  res.status(201).json(record);
});
