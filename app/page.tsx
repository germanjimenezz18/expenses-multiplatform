import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
      <h1>Landing Page aqui</h1>
      <Link href={"/dashboard"}>Ir a inicio</Link>
      <ModeToggle/>

      </div>
    </main>
  );
}

