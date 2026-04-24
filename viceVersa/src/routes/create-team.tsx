/* eslint-disable react-refresh/only-export-components */
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {CreateTeamForm, type TeamFormData} from "../components/CreateTeam.tsx";


export const Route = createFileRoute('/create-team')({
  component: CreateTeamRoute,
})

function CreateTeamRoute() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateTeam = async (data: TeamFormData) => {
    setIsSubmitting(true)
    try {
      console.log('Saving Team to DB:', data)

      await new Promise((resolve) => setTimeout(resolve, 1000))


      navigate({ to: '/' })
    } catch (error) {
      console.error("Failed to create team:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md mb-6">
        <Link
          to="/"
          className="text-pink-500 hover:text-pink-400 font-bold text-sm tracking-widest uppercase inline-block"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <CreateTeamForm
        onSubmit={handleCreateTeam}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}