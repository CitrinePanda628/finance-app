import { db } from "@/src/db";
import { accounts, categories, insertTransactionsSchema, transactions } from "@/src/schema";
import { and, eq, gte, inArray, lte, sql , desc} from "drizzle-orm";
import { Hono } from "hono"
import z, { date } from "zod";
import { zValidator } from "@hono/zod-validator";
import { parse, subDays } from "date-fns";
import { tr } from "zod/v4/locales";


const app = new Hono()

.get(
    "/",
    zValidator("query", z.object({
        from: z.string().optional(),
        to: z.string().optional(),
        accountId: z.string().optional(),
    })),
    // clerkMidleware(),
     async (c) => {

// const auth = getAuth(c)

        const { from, to, accountId } = c.req.valid("query");
        
        const defaultTo = new Date()
        const defaultFrom = subDays(defaultTo, 30)
        
        const startDate = from 
            ? parse(from ?? "", "yyyy-MM-dd", new Date())
            : defaultFrom;

        const endDate = to 
            ? parse(to ?? "", "yyyy-MM-dd", new Date())
            : defaultTo;


        const data = await db
        .select({
            id: transactions.id,
            category: categories.name,
            categoryId: transactions.categoryId,
            payee: transactions.payee,
            amount: transactions.amount,
            notes: transactions.notes,
            account: accounts.name,
            accountId: transactions.accountId,
            date: transactions.date,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id)) 
        .leftJoin(categories, eq(transactions.categoryId, categories.id))
        .where(
            and(
                accountId ? eq(transactions.accountId, accountId) : undefined,
                // eq(accounts.userId, auth.userId),
                gte(transactions.date, startDate),
                lte(transactions.date, endDate)
            )
        )
        .orderBy(desc(transactions.date))

        return c.json({ data });
})




.get("/:id" , 
    
//     zValidator("params", z.object({
//         id: z.string().optional()
//     }))
// ,
    async (c) => {

        const id = c.req.param("id")
        //  const {id} = c.req.valid("params")
        //const auth = getAuth(c)
        const [data] = await db
        .select({
            id: transactions.id,
            categoryId: transactions.categoryId,
            payee: transactions.payee,
            amount: transactions.amount,
            notes: transactions.notes,
            accountId: transactions.accountId,
            date: transactions.date,
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id)) 
        .where(eq(transactions.id, id))
        
        return c.json(data)

})

.post("/", 
    // zValidator("json", insertTransactionsSchema.omit({
    //     id: true,
    // })) ,

async (c) => {


    const body = await c.req.json();
    
    const data = await db.insert(transactions).values({
      id: crypto.randomUUID(),
      date: new Date(body.date),
      accountId: body.accountId,
      categoryId: body.categoryId || null,
      payee: body.payee,
      amount: body.amount,
      notes: body.notes || null
    }).returning()


    return c.json({ data }, 201);
})


.post(
    "/bulk-create",
    async (c) => {
            const body = await c.req.json();
            
            // if (!Array.isArray(body)) {
            //     return c.json({ error: "Expected an array of transactions" }, 400);
            // }

            const transactionsWithIds = body.map(transaction => {

                const amountInCents = Math.round(transaction.amount * 100);
                
                return {
                    id: crypto.randomUUID(),
                    amount: amountInCents,
                    payee: transaction.payee,
                    date: new Date(transaction.date),
                    accountId: transaction.accountId,
                    categoryId: transaction.categoryId || null,
                    notes: transaction.notes || null,
                };
            });

            const data = await db
                .insert(transactions)
                .values(transactionsWithIds)
                .returning();

            return c.json({ data }, 201);
    }
)


.delete("/:id", async (c) => {

    const id = c.req.param("id")


    const transactionToDelete = db.$with("transactions_to_delete").as(
        db.select({ id: transactions.id }).from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(
            eq(transactions.id, id),
            // eq(accounts.userId, auth.userId)
        ))
    )

    const data = await db
    .with(transactionToDelete )
    .delete(transactions)
    .where(
        inArray(
            transactions.id,
            sql`(select id from ${transactionToDelete})`
        )
    )   
    .returning({
        id: transactions.id
    })

    return c.json({success: true})

})

.post("/bulk-delete", async (c ) => {

    const values = await c.req.json()

    const transactionToDelete = db.$with("transactions_to_delete").as(
        db.select({ id: transactions.id }).from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(
            inArray(transactions.id, values.ids),
            // eq(accounts.userId, auth.userId)
        ))
    )
 
    const data = await db 
        .with(transactionToDelete)
        .delete(transactions)
        .where(
            inArray(transactions.id, 
                sql`(select id from ${transactionToDelete})`)
        )
        .returning({
            id: transactions.id
        })

        return c.json({data})
 
})

.patch("/:id", async (c) => {

    const id = c.req.param("id");
    const rawvalues = await c.req.json();

    if(!id) {
        return c.json({error: "Missing Id"}, 400)
    }

    const values = {
        ...rawvalues,
        date: new Date(rawvalues.date),
    }


    const transactionToUpdate = db.$with("transactions_to_update").as(
        db.select({ id: transactions.id }).from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(
            eq(transactions.id, id),
            // eq(accounts.userId, auth.userId)
        ))
    )



    const data = await db
    .with(transactionToUpdate)
    .update(transactions)
    .set(values)
    .where(
        inArray(transactions.id, 
            sql`(select id from ${transactionToUpdate})`)
    )
    .returning() 

    if(!data) {
        return c.json({error: "Missing Data"}, 400)
    }

    return c.json(data)
})

export default app;


