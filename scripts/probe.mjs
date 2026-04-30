const BASE = "https://danica-app.vercel.app"

async function call(method, path, body, headers = {}) {
  const r = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body,
  })
  const text = await r.text()
  return { status: r.status, body: text.slice(0, 200) }
}

const checks = []

// Public — should 200
checks.push(["home", await call("GET", "/")])
checks.push(["products", await call("GET", "/api/products")])

// Contact — new endpoint, should 200 with valid body
checks.push([
  "contact valid",
  await call("POST", "/api/contact", JSON.stringify({
    name: "Probe Test",
    email: `probe-${Date.now()}@example.com`,
    message: "Hello world this is a probe test message",
  })),
])

// Contact — invalid → 400
checks.push(["contact invalid", await call("POST", "/api/contact", "{}")])

// Webhook — no signature → 401
checks.push(["webhook unsigned", await call("POST", "/api/paymongo/webhook", "{}")])

// Webhook — bogus signature → 401
checks.push(["webhook bogus sig", await call("POST", "/api/paymongo/webhook", "{}", {
  "Paymongo-Signature": "t=1700000000,te=deadbeef",
})])

// Webhook — body-size cap (use 70KB)
const huge = "x".repeat(70 * 1024)
checks.push(["webhook oversize", await call("POST", "/api/paymongo/webhook", huge, {
  "Content-Length": String(huge.length),
})])

// Cron — no auth → 401
checks.push(["cron no auth", await call("GET", "/api/cron/renewals")])
checks.push(["cron wrong auth", await call("GET", "/api/cron/renewals", null, {
  Authorization: "Bearer wrong-secret-12345",
})])

// AI chat — no body → 400 (Zod)
checks.push(["ai-chat empty", await call("POST", "/api/ai-chat", "{}")])

// Checkout — no auth → 401
checks.push(["checkout anon", await call("POST", "/api/paymongo/checkout", "{}")])

// /api/me/* — no auth → 401
checks.push(["me overview anon", await call("GET", "/api/me/overview")])
checks.push(["me orders anon", await call("GET", "/api/me/orders")])

// Register — invalid → 400
checks.push(["register empty", await call("POST", "/api/auth/register", "{}")])

// Register — short password → 400
checks.push(["register weak pw", await call("POST", "/api/auth/register", JSON.stringify({
  email: "a@b.com", password: "short", name: "x",
}))])

// Register — dupe (run twice with same email)
const dupeEmail = `dupe-${Date.now()}@example.com`
checks.push(["register first", await call("POST", "/api/auth/register", JSON.stringify({
  email: dupeEmail, password: "Strong123!", name: "First",
}))])
checks.push(["register dupe", await call("POST", "/api/auth/register", JSON.stringify({
  email: dupeEmail, password: "Strong123!", name: "Second",
}))])

// Register — case-insensitive dupe
checks.push(["register case dupe", await call("POST", "/api/auth/register", JSON.stringify({
  email: dupeEmail.toUpperCase(), password: "Strong123!", name: "Third",
}))])

console.log(`\n${"endpoint".padEnd(22)} | status | body`)
console.log("─".repeat(80))
for (const [name, r] of checks) {
  const statusColor = r.status >= 200 && r.status < 300 ? "✓" : (r.status === 401 || r.status === 400 || r.status === 409 || r.status === 413 || r.status === 429) ? "·" : "✗"
  console.log(`${statusColor} ${name.padEnd(20)} |  ${r.status}  | ${r.body}`)
}
