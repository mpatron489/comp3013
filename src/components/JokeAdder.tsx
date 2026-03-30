import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { db } from '../db'
import { jokes } from "#/db/schema"
import { auth } from "#/auth"

const addJoke = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    const parsed = data as Record<string, unknown>
    if (typeof parsed?.jokeContent !== 'string' || !parsed.jokeContent.trim()) {
      throw new Error('Joke content is required')
    }
    return { jokeContent: parsed.jokeContent.trim() }
  })
  .handler(async ({ data }: { data: { jokeContent: string } }) => {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      throw new Error('You must be logged in to add a joke')
    }

    await db.insert(jokes).values({
      id: crypto.randomUUID(),
      jokeContent: data.jokeContent,
      jokeUserId: session.user.id,
    })
  })

export default function JokeAdder({ onJokeAdded }: { onJokeAdded?: () => void }) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const jokeContent = formData.get('content')?.toString() || ''
        await addJoke({ data: { jokeContent } })
        e.currentTarget.reset()
        onJokeAdded?.()
      }}
      className="flex gap-2"
    >
      <input
        name="content"
        type="text"
        placeholder="Add a joke..."
        className="flex-1 rounded-lg border border-(--line) px-4 py-2"
        required
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
      >
        Add Joke
      </button>
    </form>
  )
}
