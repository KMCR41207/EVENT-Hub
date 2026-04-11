import { Router } from "express";
import { db } from "@workspace/db";
import { eventsTable, registrationsTable, attendanceTable, clubsTable } from "@workspace/db";
import { eq, gte, sql } from "drizzle-orm";
import { GetUpcomingEventsQueryParams } from "@workspace/api-zod";

export const dashboardRouter = Router();

dashboardRouter.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const [eventStats] = await db
    .select({ count: sql<number>`count(*)::int`.as("count") })
    .from(eventsTable);

  const [regStats] = await db
    .select({ count: sql<number>`count(*)::int`.as("count") })
    .from(registrationsTable);

  const [attStats] = await db
    .select({ count: sql<number>`count(*)::int`.as("count") })
    .from(attendanceTable);

  const [clubStats] = await db
    .select({ count: sql<number>`count(*)::int`.as("count") })
    .from(clubsTable);

  const [upcomingStats] = await db
    .select({ count: sql<number>`count(*)::int`.as("count") })
    .from(eventsTable)
    .where(gte(eventsTable.date, new Date()));

  const totalRegistrations = regStats?.count ?? 0;
  const totalAttendance = attStats?.count ?? 0;
  const attendanceRate = totalRegistrations > 0 ? (totalAttendance / totalRegistrations) * 100 : 0;

  res.json({
    totalEvents: eventStats?.count ?? 0,
    totalRegistrations,
    totalAttendance,
    totalClubs: clubStats?.count ?? 0,
    upcomingEventsCount: upcomingStats?.count ?? 0,
    attendanceRate: Math.round(attendanceRate * 10) / 10,
  });
});

dashboardRouter.get("/dashboard/upcoming-events", async (req, res): Promise<void> => {
  const query = GetUpcomingEventsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

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

  let dbQuery = db
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
    .where(gte(eventsTable.date, new Date()))
    .$dynamic();

  if (query.data.limit) {
    dbQuery = dbQuery.limit(query.data.limit);
  }

  const events = await dbQuery;
  res.json(events);
});

dashboardRouter.get("/dashboard/event-stats", async (_req, res): Promise<void> => {
  const events = await db.select().from(eventsTable);

  const stats = await Promise.all(
    events.map(async (event) => {
      const [regCount] = await db
        .select({ count: sql<number>`count(*)::int`.as("count") })
        .from(registrationsTable)
        .where(eq(registrationsTable.eventId, event.id));

      const [attCount] = await db
        .select({ count: sql<number>`count(*)::int`.as("count") })
        .from(attendanceTable)
        .where(eq(attendanceTable.eventId, event.id));

      return {
        eventId: event.id,
        eventTitle: event.title,
        registered: regCount?.count ?? 0,
        attended: attCount?.count ?? 0,
      };
    }),
  );

  res.json(stats);
});

dashboardRouter.get("/dashboard/category-breakdown", async (_req, res): Promise<void> => {
  const breakdown = await db
    .select({
      category: eventsTable.category,
      count: sql<number>`count(*)::int`.as("count"),
    })
    .from(eventsTable)
    .groupBy(eventsTable.category);

  res.json(breakdown);
});
