import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import LogoBadge from "@/components/logo-badge";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mt-6">
        <LogoBadge href={"/"} />
      </div>
      <div className="mt-8 flex flex-1 items-center justify-center">
        <ClerkLoaded>
          <SignUp path="/sign-up" />
        </ClerkLoaded>
        <ClerkLoading>
          <Loader2 className="h-12 w-12 animate-spin text-white" />
        </ClerkLoading>
      </div>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-2 border-t bg-white px-4 py-6 sm:flex-row md:px-6 dark:bg-background">
        <p className="text-gray-500 text-xs dark:text-gray-400">
          © 2024 Expenses Multiplatform. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link
            className="text-xs underline-offset-4 hover:underline"
            href="/terms-of-service"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs underline-offset-4 hover:underline"
            href="/privacy"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
