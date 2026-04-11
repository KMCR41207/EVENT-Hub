import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, registrationsTable, attendanceTable, clubsTable } from "@workspace/db";
import { eq, sql, and, gte } from "drizzle-orm";
import {
  CreateEventBody,
  UpdateEventBody,
  GetEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetEventFeaturedImageParams,
  ListEventsQueryParams,
} from "@workspace/api-zod";

export const eventsRouter = Router();

eventsRouter.get("/events", async (req, res): Promise<void> => {
  const query = ListEventsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { category, upcoming, limit } = query.data;

  const registeredCounts = db
    .select({
      eventId: registrationsTable.eventId,
      regCount: sql<number>`count(*)::int`.as("reg_count"),
    })
    .from(registrationsTable)
    .groupBy(registrationsTable.eventId)
    .as("reg_counts");

  const attendedCounts = db
    .select({
      eventId: attendanceTable.eventId,
      attCount: sql<number>`count(*)::int`.as("att_count"),
    })
    .from(attendanceTable)
    .groupBy(attendanceTable.eventId)
    .as("att_counts");

  let baseQuery = db
    .select({
      id: eventsTable.id,
      title: eventsTable.title,
      description: eventsTable.description,
      date: eventsTable.date,
      location: eventsTable.location,
      category: eventsTable.category,
      capacity: eventsTable.capacity,
      imageUrl: eventsTable.imageUrl,
      clubId: eventsTable.clubId,
      clubName: clubsTable.name,
      createdAt: eventsTable.createdAt,
      registeredCount: sql<number>`coalesce(${registeredCounts.regCount}, 0)`.as("registeredCount"),
      attendedCount: sql<number>`coalesce(${attendedCounts.attCount}, 0)`.as("attendedCount"),
    })
    .from(eventsTable)
    .leftJoin(clubsTable, eq(eventsTable.clubId, clubsTable.id))
    .leftJoin(registeredCounts, eq(eventsTable.id, registeredCounts.eventId))
    .leftJoin(attendedCounts, eq(eventsTable.id, attendedCounts.eventId))
    .$dynamic();

  if (category) {
    baseQuery = baseQuery.where(eq(eventsTable.category, category));
  }

  if (upcoming) {
    baseQuery = baseQuery.where(gte(eventsTable.date, new Date()));
  }

  if (limit) {
    baseQuery = baseQuery.limit(limit);
  }

  const events = await baseQuery;
  res.json(events);
});

eventsRouter.post("/events", async (req, res): Promise<void> => {
  const body = CreateEventBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [event] = await db
    .insert(eventsTable)
    .values({
      title: body.data.title,
      description: body.data.description,
      date: new Date(body.data.date),
      location: body.data.location,
      category: body.data.category,
      capacity: body.data.capacity,
      imageUrl: body.data.imageUrl,
      clubId: body.data.clubId,
    })
    .returning();

  res.status(201).json({
    ...event,
    registeredCount: 0,
    attendedCount: 0,
    clubName: null,
  });
});

eventsRouter.get("/events/:id", async (req, res): Promise<void> => {
  const params = GetEventParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const registeredCounts2 = db
    .select({
      eventId: registrationsTable.eventId,
      regCount: sql<number>`count(*)::int`.as("reg_count"),
    })
    .from(registrationsTable)
    .groupBy(registrationsTable.eventId)
    .as("reg_counts2");

  const attendedCounts2 = db
    .select({
      eventId: attendanceTable.eventId,
      attCount: sql<number>`count(*)::int`.as("att_count"),
    })
    .from(attendanceTable)
    .groupBy(attendanceTable.eventId)
    .as("att_counts2");

  const [event] = await db
    .select({
      id: eventsTable.id,
      title: eventsTable.title,
      description: eventsTable.description,
      date: eventsTable.date,
      location: eventsTable.location,
      category: eventsTable.category,
      capacity: eventsTable.capacity,
      imageUrl: eventsTable.imageUrl,
      clubId: eventsTable.clubId,
      clubName: clubsTable.name,
      createdAt: eventsTable.createdAt,
      registeredCount: sql<number>`coalesce(${registeredCounts2.regCount}, 0)`.as("registeredCount"),
      attendedCount: sql<number>`coalesce(${attendedCounts2.attCount}, 0)`.as("attendedCount"),
    })
    .from(eventsTable)
    .leftJoin(clubsTable, eq(eventsTable.clubId, clubsTable.id))
    .leftJoin(registeredCounts2, eq(eventsTable.id, registeredCounts2.eventId))
    .leftJoin(attendedCounts2, eq(eventsTable.id, attendedCounts2.eventId))
    .where(eq(eventsTable.id, params.data.id));

  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.json(event);
});

eventsRouter.patch("/events/:id", async (req, res): Promise<void> => {
  const params = UpdateEventParams.safeParse({ id: Number(req.params.id) });
  const body = UpdateEventBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  const updateData: Partial<typeof eventsTable.$inferInsert> = {};
  if (body.data.title) updateData.title = body.data.title;
  if (body.data.description) updateData.description = body.data.description;
  if (body.data.date) updateData.date = new Date(body.data.date);
  if (body.data.location) updateData.location = body.data.location;
  if (body.data.category) updateData.category = body.data.category;
  if (body.data.capacity !== undefined) updateData.capacity = body.data.capacity;
  if (body.data.imageUrl !== undefined) updateData.imageUrl = body.data.imageUrl;

  const [event] = await db
    .update(eventsTable)
    .set(updateData)
    .where(eq(eventsTable.id, params.data.id))
    .returning();

  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.json({ ...event, registeredCount: 0, attendedCount: 0, clubName: null });
});

eventsRouter.delete("/events/:id", async (req, res): Promise<void> => {
  const params = DeleteEventParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await db.delete(eventsTable).where(eq(eventsTable.id, params.data.id));
  res.status(204).send();
});

eventsRouter.get("/events/:id/featured-image", async (req, res): Promise<void> => {
  const params = GetEventFeaturedImageParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [event] = await db
    .select({ imageUrl: eventsTable.imageUrl })
    .from(eventsTable)
    .where(eq(eventsTable.id, params.data.id));

  if (!event) {
    res.status(404).json({ error: "Event not found" });
    return;
  }

  res.json({ url: event.imageUrl ?? "" });
});
