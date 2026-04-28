import { auth } from "@/auth"
import { db } from "@/lib/db"
import { tickets } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"

export default async function SupportPage() {
  const session = await auth()
  const myTickets = await db.select().from(tickets).where(eq(tickets.userId, session!.user.id)).orderBy(desc(tickets.createdAt))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Support</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">Tickets and conversation history.</p>
        </div>
      </div>

      {myTickets.length === 0 ? (
        <div className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] p-10 text-center">
          <p className="text-sm text-[var(--color-muted-foreground)]">No tickets yet.</p>
          <p className="text-xs text-[var(--color-muted-foreground)] mt-2">
            For urgent issues email <a className="text-[var(--color-accent)] hover:underline" href="mailto:support@danica.it">support@danica.it</a>.
          </p>
        </div>
      ) : (
        <ul className="rounded-[var(--radius-lg)] border bg-[var(--color-card)] divide-y">
          {myTickets.map(t => (
            <li key={t.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{t.subject}</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">{t.priority} priority · created {new Date(t.createdAt).toLocaleDateString()}</p>
              </div>
              <span className="text-xs">{t.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
