import { auth } from "@/auth"
import { db } from "@/lib/db"
import { apiKeys } from "@/lib/db/schema"
import { eq, desc, isNull } from "drizzle-orm"

export default async function ApiKeysPage() {
  const session = await auth()
  const keys = await db.select().from(apiKeys)
    .where(eq(apiKeys.userId, session!.user.id))
    .orderBy(desc(apiKeys.createdAt))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">API Keys</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">Use these keys to call Danica AI from your application.</p>
      </div>

      <div className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-5">
        {keys.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)] py-6 text-center">
            No API keys yet. (Key generation UI ships in the next iteration.)
          </p>
        ) : (
          <ul className="divide-y">
            {keys.map(k => (
              <li key={k.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium">{k.label}</p>
                  <p className="font-mono text-xs text-[var(--color-muted-foreground)]">{k.keyPrefix}…</p>
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {k.revokedAt ? "revoked" : k.lastUsedAt ? `last used ${new Date(k.lastUsedAt).toLocaleDateString()}` : "never used"}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
