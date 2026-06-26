import { eq } from 'drizzle-orm'
import { auth } from '@/auth'
import { db } from '@/db'
import { users, type User } from '@/db/schema'

export async function getCurrentUser(): Promise<User | null> {
  const session = await auth()
  if (!session?.user?.id) return null

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id)
  })

  return user ?? null
}
