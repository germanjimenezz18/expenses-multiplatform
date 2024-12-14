"use client"
import LogoBadge from "@/components/logo-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="mt-6">
        <LogoBadge href={'/'} />
      </div>
      <div className="flex items-center justify-center  flex-1">
        <ClerkLoaded>
          <SignIn path="/sign-in" />
        </ClerkLoaded>
        <ClerkLoading>
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </ClerkLoading>
      </div>
      <footer className="border-2 flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-background">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Expenses Multiplatform. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:underline underline-offset-4"
            href="/terms-of-service"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:underline underline-offset-4"
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
`}</style>
