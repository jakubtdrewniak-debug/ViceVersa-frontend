import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/match/$matchId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/match/$matchId"!</div>
}
