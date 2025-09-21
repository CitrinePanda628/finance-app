import { db } from "@/src/db";
import { accounts } from "@/src/schema";
import { and, eq, inArray } from "drizzle-orm";
import { Hono } from "hono"


const app = new Hono()

.get("/",
    
    // clerkMidleware(),
    async (c) => {

// const auth = getAuth(c)

        const data = await db
        .select({
            id: accounts.id,
            name: accounts.name
        })
        .from(accounts)
        // .where(eq(accounts.userId, auth.userId))
        return c.json({ data });
})
.get("/:id" , async (c) => {

        const id = c.req.param("id")

        const [data] = await db
        .select({
            id:accounts.id,
            name: accounts.name
        })
        .from(accounts)
        .where(eq(accounts.id, id))
        
        return c.json(data)

})

.post("/", async (c) => {

    const {name} = await c.req.json()

    const data = await db.insert(accounts).values({
        id: crypto.randomUUID(),
        userId: crypto.randomUUID(),
        name: name
    }).returning()

    return c.json({data})
})



.delete("/:id", async (c) => {

    const id = c.req.param("id")
    await db.delete(accounts).where(eq(accounts.id,id))
    return c.json({success: true})

    
})

.post("/bulk-delete", async (c ) => {

    const values = await c.req.json()

    const data = await db 
        .delete(accounts)
        .where(
            and(
                // eq(accounts.userId, auth.userId)
                inArray(accounts.id, values.ids)
            )
        )
        .returning ({
            id: accounts.id
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
    .update(accounts)
    .set(values)  
    .where(
        and(
            eq(accounts.id, id)
        )
    )  
    .returning()

    if(!data) {
        return c.json({error: "Missing Data"}, 400)
    }

    return c.json(data)
})

export default app;

