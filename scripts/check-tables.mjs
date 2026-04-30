import postgres from "postgres"
const sql = postgres(process.env.DATABASE_URL)
const rows = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`
console.log(rows.map(r => r.table_name).join("\n"))
await sql.end()
