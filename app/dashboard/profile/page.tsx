"use client"
import { useSession } from "next-auth/react"

export default function ProfilePage() {
    const { data: session, status, update } = useSession()
    if (status === 'loading') return <div>loading...</div>

  return (
    <div>
    <h1>profile</h1>
    </div>
  )
}
