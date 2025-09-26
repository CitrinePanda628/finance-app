import { db } from "@/src/db";
import { accounts } from "@/src/schema";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono";

const app = new Hono();

app.get("/", async (c) => {
  const user = await currentUser();
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const data = await db
    .select({
      id: accounts.id,
      name: accounts.name,
    })
    .from(accounts)
    .where(eq(accounts.userId, user.id));

  return c.json({ data });
});

app.get("/:id", async (c) => {
  const user = await currentUser();
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");

  const [data] = await db
    .select({
      id: accounts.id,
      name: accounts.name,
    })
    .from(accounts)
    .where(and(eq(accounts.id, id), eq(accounts.userId, user.id)));

  if (!data) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json(data);
});

app.post("/", async (c) => {
  const user = await currentUser();
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const { name } = await c.req.json();

  const data = await db
    .insert(accounts)
    .values({
      id: crypto.randomUUID(),
      userId: user.id, // ✅ tie account to logged-in user
      name,
    })
    .returning();

  return c.json({ data });
});

app.delete("/:id", async (c) => {
  const user = await currentUser();
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");

  const data = await db
    .delete(accounts)
    .where(and(eq(accounts.id, id), eq(accounts.userId, user.id)))
    .returning();

  if (data.length === 0) {
    return c.json({ error: "Not found" }, 404);
  }

  return c.json({ success: true });
});

app.post("/bulk-delete", async (c) => {
  const user = await currentUser();
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const values = await c.req.json();

  const data = await db
    .delete(accounts)
    .where(
      and(
        eq(accounts.userId, user.id),
        inArray(accounts.id, values.ids)
      )
    )
    .returning({
      id: accounts.id,
    });

  return c.json({ data });
});

app.patch("/:id", async (c) => {
  const user = await currentUser();
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");
  const values = await c.req.json();

  if (!id) {
    return c.json({ error: "Missing Id" }, 400);
  }

  const data = await db
    .update(accounts)
    .set(values)
    .where(and(eq(accounts.id, id), eq(accounts.userId, user.id)))
    .returning();

  if (data.length === 0) {
    return c.json({ error: "Not found or not yours" }, 404);
  }

  return c.json(data);
});

export default app;
