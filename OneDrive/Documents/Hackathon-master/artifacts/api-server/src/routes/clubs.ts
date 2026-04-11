import { Router } from "express";
import { db } from "@workspace/db";
import { clubsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateClubBody,
  GetClubParams,
} from "@workspace/api-zod";

export const clubsRouter = Router();

clubsRouter.get("/clubs", async (_req, res): Promise<void> => {
  const clubs = await db.select().from(clubsTable);
  res.json(clubs);
});

clubsRouter.post("/clubs", async (req, res): Promise<void> => {
  const body = CreateClubBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [club] = await db
    .insert(clubsTable)
    .values({
      name: body.data.name,
      description: body.data.description,
      logoUrl: body.data.logoUrl,
      category: body.data.category,
    })
    .returning();

  res.status(201).json(club);
});

clubsRouter.get("/clubs/:id", async (req, res): Promise<void> => {
  const params = GetClubParams.safeParse({ id: Number(req.params.id) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [club] = await db
    .select()
    .from(clubsTable)
    .where(eq(clubsTable.id, params.data.id));

  if (!club) {
    res.status(404).json({ error: "Club not found" });
    return;
  }

  res.json(club);
});
