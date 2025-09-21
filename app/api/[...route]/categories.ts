import { db } from "@/src/db";
import { categories } from "@/src/schema";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono"


const app = new Hono()

.get("/", async (c) => {

// const auth = getAuth(c)

        const data = await db
        .select({
            id: categories.id,
            name: categories.name,
            plaidId: categories.plaidId,
            userId: categories.userId
        })
        .from(categories)
        // .where(eq(accounts.userId, auth.userId))
        return c.json({ data });
})
.get("/:id" , async (c) => {

        const id = c.req.param("id")

        const [data] = await db
        .select({
            id:categories.id,
            name: categories.name,
            plaidId: categories.plaidId,
            userId: categories.userId
        })
        .from(categories)
        .where(eq(categories.id, id))
        
        return c.json(data)

})

.post("/", async (c) => {

    const {name} = await c.req.json()

    const data = await db.insert(categories).values({
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        name: name
    }).returning()

    return c.json({data})
})



.delete("/:id", async (c) => {

    const id = c.req.param("id")
    await db.delete(categories).where(eq(categories.id,id))
    return c.json({success: true})

    
})

.post("/bulk-delete", async (c ) => {

    const values = await c.req.json()

    const data = await db 
        .delete(categories)
        .where(
            and(
                // eq(accounts.userId, auth.userId)
                inArray(categories.id, values.ids)
            )
        )
        .returning ({
            id: categories.id
        })
        return c.json({data})

})

.patch("/:id", async (c) => {

    const id = c.req.param("id");
    const values = await c.req.json();

    if(!id) {
        return c.json({error: "Missing Id"}, 400)
    }

    const data = await db
    .update(categories)
    .set(values)  
    .where(eq(categories.id, id))  
    .returning()

    if(!data) {
        return c.json({error: "Missing Data"}, 400)
    }

    return c.json(data)
})

export default app;

