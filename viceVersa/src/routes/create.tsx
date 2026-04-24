import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { CreateTournament } from '../components/CreateTournament'
import type { TournamentFormData } from '../types'

export const Route = createFileRoute('/create')({
  component: CreateTournamentRoute,
})

// eslint-disable-next-line react-refresh/only-export-components
function CreateTournamentRoute() {
  const navigate = useNavigate()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreate = async (data: TournamentFormData) => {
    setIsSubmitting(true)

    try {
      console.log('Sending payload to backend:', data)

      await new Promise((resolve) => setTimeout(resolve, 1000))

      navigate({ to: '/' })
    } catch (error) {
      console.error("Failed to create tournament:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <CreateTournament
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}