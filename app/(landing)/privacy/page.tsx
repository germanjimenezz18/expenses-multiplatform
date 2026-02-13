import { Globe } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 w-full items-center justify-center gap-x-6 px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="/">
          <Badge
            className="select-none whitespace-nowrap text-muted-foreground hover:border-primary/50 hover:text-primary/60"
            variant="outline"
          >
            Expenses
            <Globe className="mx-1 size-5" />
            Multiplatform
          </Badge>
          <span className="sr-only">Expenses Multiplatform</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <p>privacy here</p>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-gray-500 text-xs dark:text-gray-400">
          © 2024 Expenses Multiplatform. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link
            className="text-xs underline-offset-4 hover:underline"
            href="terms-of-service"
          >
            Terms of Service
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
