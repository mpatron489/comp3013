import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from '../db'

const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  console.log("Server function was called");
  return fetch("https://jsonplaceholder.typicode.com/todos").then((response) =>
    response.json(),
  ) as Promise<{ id: number; title: string }[]>;
});

const getJokes = createServerFn({ method: 'GET' }).handler(async ()=>{
  const jokes = await db.query.jokes.findMany({
    with: {
      
    }
  });
  return jokes;
})

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const jokes = await getJokes();
    return jokes;
  },
});

function App() {
  const jokes = Route.useLoaderData();
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="mt-8 grid gap-3">
        {jokes.map((joke) => (
          <article
            key={joke.id}
            className="rounded-lg border border-(--line) px-4 py-3"
          >
            <h2>{joke.jokeContent}</h2>
          </article>
        ))}
      </div>
    </main>
  );
}
