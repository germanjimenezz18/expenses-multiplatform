"use client";
import { signOut } from "next-auth/react";

export default function ButtonSignOut() {
  return (
    <button
      className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
      onClick={() => {
        signOut();
      }}
    >
      Cerrar sesión
    </button>
  );
}
