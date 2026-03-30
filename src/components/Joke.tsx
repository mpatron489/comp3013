import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { db } from '../db'
import { likes } from "#/db/schema"
import { auth } from "#/auth"
import type { JokeData } from "../types"

const voteOnJoke = createServerFn({ method: 'POST' })
  .inputValidator((data: unknown) => {
    const parsed = data as Record<string, unknown>
    if (typeof parsed?.jokeId !== 'string' || typeof parsed?.liked !== 'boolean') {
      throw new Error('Invalid vote data')
    }
    return { jokeId: parsed.jokeId, liked: parsed.liked }
  })
  .handler(async ({ data }: { data: { jokeId: string; liked: boolean } }) => {
    const request = getRequest()
    const session = await auth.api.getSession({ headers: request.headers })

    if (!session?.user) {
      throw new Error('You must be logged in to vote')
    }

      await db.insert(likes).values({
        id: crypto.randomUUID(),
        likeUserId: session.user.id,
        jokeId: data.jokeId,
        liked: data.liked,
      })
  })

export default function Joke({ joke, onVoted }: { joke: JokeData; onVoted?: () => void }) {
  const handleVote = async (liked: boolean) => {
    await voteOnJoke({ data: { jokeId: joke.id, liked } })
    onVoted?.()
  }

  return (
    <article className="rounded-lg border border-(--line) px-4 py-3">
      <p className="text-sm text-gray-500">Posted by {joke.userName}</p>
      <h2 className="mt-1 text-lg">{joke.jokeContent}</h2>
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleVote(true)}
          className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm transition ${
            joke.upvotes > 0
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-green-50'
          }`}
        >
          ▲ {joke.upvotes}
        </button>
        <button
          type="button"
          onClick={() => handleVote(false)}
          className={`flex items-center gap-1 rounded-md px-3 py-1 text-sm transition ${
            joke.downvotes > 0
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-red-50'
          }`}
        >
          ▼ {joke.downvotes}
        </button>
      </div>
    </article>
  )
}
