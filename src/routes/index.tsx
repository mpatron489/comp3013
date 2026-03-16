import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getPosts = createServerFn({ method: "GET" }).handler(async () => {
  console.log("Server function was called");
  return fetch("https://jsonplaceholder.typicode.com/todos").then((response) =>
    response.json(),
  ) as Promise<{ id: number; title: string }[]>;
});

export const Route = createFileRoute("/")({
  component: App,
  loader: async () => {
    const posts = await getPosts();
    return posts;
  },
});
function App() {
  const posts = Route.useLoaderData();
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <div className="mt-8 grid gap-3">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-lg border border-(--line) px-4 py-3"
          >
            <h2>{post.title}</h2>
          </article>
        ))}
      </div>
    </main>
  );
}
