import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getRequest } from "@tanstack/react-start/server"
import { auth } from "../auth"
import JokeBin from "../components/JokeBin"

const getSession = createServerFn({ method: 'GET' }).handler(async () => {
  const request = getRequest()
  const session = await auth.api.getSession({ headers: request.headers })
  return session
})

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await getSession()
    if (!session?.user) {
      throw redirect({ to: '/signin' })
    }
  },
  component: App,
})

function App() {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <JokeBin />
    </main>
  )
}
