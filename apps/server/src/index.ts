import { env } from "@tehs-aerial-images/env/server";
import { createDbFromBinding } from "@tehs-aerial-images/db";
import { eventLogs } from "@tehs-aerial-images/db/schema/index";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { fetchLocationsFromSanity } from "./lib/sanity-client";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

app.get("/locations/sync", async (c) => {
  const locations = await fetchLocationsFromSanity();
  const db = createDbFromBinding(c.env.DB);
  const count = Array.isArray(locations) ? locations.length : 0;

  await db.insert(eventLogs).values({
    eventType: "sanity.sync",
    payload: JSON.stringify({ count }),
  });

  return c.json({ ok: true, synced: count });
});

export default app;
