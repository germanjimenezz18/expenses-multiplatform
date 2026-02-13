"use client";
import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import LogoBadge from "@/components/logo-badge";

function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mt-6">
        <LogoBadge href={"/"} />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <ClerkLoaded>
          <SignIn path="/sign-in" />
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

export default Page;

<style jsx>{`
  @keyframes gradientBackground {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  .animated-background {
    background: linear-gradient(270deg, #00c6ff, #0072ff);
    background-size: 400% 400%;
    animation: gradientBackground 15s ease infinite;
  }
`}</style>;
