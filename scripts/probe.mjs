const probes = [
  ["/api/products", "GET"],
  ["/", "GET"],
  ["/api/contact", "POST", JSON.stringify({ name: "T", email: "t@ex.com", message: "hello world test 1234" })],
  ["/api/cron/renewals", "GET"],
  ["/api/paymongo/webhook", "POST", "{}"],
]
for (const [path, method, body] of probes) {
  const r = await fetch(`https://danica-app.vercel.app${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body,
  })
  const text = await r.text()
  console.log(`${method} ${path} → ${r.status} ${text.slice(0, 200)}`)
}
