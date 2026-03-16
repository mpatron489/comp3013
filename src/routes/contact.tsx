import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getUsers = createServerFn({ method: "GET" }).handler(async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  const data = await response.json();
  return data;
});
export const Route = createFileRoute("/contact")({
  component: RouteComponent,
  loader: async () => {
    return getUsers();
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
