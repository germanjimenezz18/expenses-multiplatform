"use client"
import { Skeleton } from "@/components/ui/skeleton";
import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2, BanknoteIcon } from "lucide-react";
import Link from "next/link";
import { FaBackward } from "react-icons/fa";

function page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full lg:flex flex-col items-center justify-start px-4">
          <Link href={"/"} className="w-full text-primary flex flex-row items-center gap-x-2 mt-4 ">
            <FaBackward /> Go Back
          </Link>

        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignIn  path="/sign-in" />
          </ClerkLoaded>
          <ClerkLoading>
            <Skeleton className="w-full h-full flex flex-col items-center justify-center">
                <Loader2 size={128} />
                <h1 className="text-2xl mt-4">Loading...</h1>
            </Skeleton>

          </ClerkLoading>
        </div>
      </div>

      <div className="h-full  hidden lg:flex items-center justify-center animated-background">
        <video autoPlay loop muted className="h-full w-full object-cover">
          <source src="https://videocdn.cdnpk.net/videos/1c3d22b8-9921-41b7-a719-284b4f940da1/horizontal/previews/clear/large.mp4?token=exp=1731787324~hmac=fd2b3b2126abb599d79eb67d97b1288713516e1b3a727f3cd133d81899b445aa" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default page;

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
