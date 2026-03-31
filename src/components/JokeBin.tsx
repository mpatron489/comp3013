import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { db } from '#/db'
import { jokes } from '#/db/schema'
import { auth } from '#/auth'
import { useState, useEffect} from 'react'
import type { JokeData } from '#/types'
import Joke from './Joke'

const getJokes = createServerFn({ method: 'GET' }).handler(async (): Promise<JokeData[]> => {
  const request = getRequest()
  let currentUserId: string | null = null
  try {
    const session = await auth.api.getSession({ headers: request.headers })
    currentUserId = session?.user?.id ?? null
  } catch {
    // not authenticated
  }

  const result = await db.query.jokes.findMany({
    with: {
      user: { columns: { name: true } },
      likes: true,
    }
  })
  return result.map((joke) => ({
    id: joke.id,
    jokeContent: joke.jokeContent,
    jokeUserId: joke.jokeUserId,
    userName: joke.user.name,
    upvotes: joke.likes.filter((l) => l.liked === true).length,
    downvotes: joke.likes.filter((l) => l.liked === false).length,
    currentUserVote: currentUserId
      ? joke.likes.find((l) => l.likeUserId === currentUserId)?.liked ?? null
      : null,
    isOwner: currentUserId === joke.jokeUserId,
  }))
})

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
    });


  })

export default function JokeBin() {
  const [jokeList, setJokeList] = useState<JokeData[]>([])
  const [inputValue, setInputValue] = useState('');

  const fetchJokes = async () => {
    const data = await getJokes()
    setJokeList(data)
  }

  useEffect(() => {
    fetchJokes()
  }, [fetchJokes])

  return (
    <div>
      <h1 className="m-4">Joke Bin</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          setInputValue('')
          const jokeContent = formData.get('content')?.toString() || ''
          await addJoke({ data: { jokeContent } })
          e.currentTarget.reset()
          await fetchJokes()
        }}
        className="flex gap-2 pb-4"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          name="content"
          type="text"
          placeholder="Add a joke..."
          className="flex-1 rounded-lg border border-(--line) px-4 py-2"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 cursor-pointer px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Add Joke
        </button>
      </form>
      <div className="jokeContainer">
        {jokeList.sort((a, b) => b.upvotes - a.upvotes).map((joke, index) => (
          <div>
            {(index < 3) ? <span>Number {index+1} Joke</span> : ''}
            <Joke key={joke.id} joke={joke} onVoted={fetchJokes} />
          </div>
        ))}
      </div>
    </div>
  )
}
