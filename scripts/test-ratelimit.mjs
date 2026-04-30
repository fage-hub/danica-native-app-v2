import postgres from "postgres"
const sql = postgres(process.env.DATABASE_URL)

const key = "test:" + Date.now()
const now = new Date()
const windowStart = new Date(now.getTime() - 60_000)

const result = await sql`
  INSERT INTO rate_limit_buckets (key, count, window_start)
  VALUES (${key}, 1, ${now})
  ON CONFLICT (key) DO UPDATE SET
    count = CASE
      WHEN rate_limit_buckets.window_start < ${windowStart} THEN 1
      ELSE rate_limit_buckets.count + 1
    END,
    window_start = CASE
      WHEN rate_limit_buckets.window_start < ${windowStart} THEN ${now}
      ELSE rate_limit_buckets.window_start
    END
  RETURNING count, window_start
`
console.log("RESULT:", result)
console.log("type:", typeof result, Array.isArray(result), result.length)
console.log("[0]:", result[0])

await sql.end()
