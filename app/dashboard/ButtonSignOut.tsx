"use client"
import { signOut } from "next-auth/react"

export default function ButtonSignOut() {
    return (
        <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {signOut()}}>
            Cerrar sesión
        </button>
    )
}
