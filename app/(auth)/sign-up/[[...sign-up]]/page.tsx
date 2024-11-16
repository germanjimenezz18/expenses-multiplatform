import { SignUp, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import Image from "next/image";

function page() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="h-full  lg:flex flex-col items-center justify-start px-4">
        <div className="flex items-center justify-center mt-8">
          <ClerkLoaded>
            <SignUp path="/sign-up" />
          </ClerkLoaded>
          <ClerkLoading>
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </ClerkLoading>
        </div>
      </div>

      <div className="h-full  hidden lg:flex items-center justify-center animated-background">
        <video autoPlay loop muted className="h-full w-full object-cover">
          <source
            src="https://videocdn.cdnpk.net/videos/1c3d22b8-9921-41b7-a719-284b4f940da1/horizontal/previews/clear/large.mp4?token=exp=1731787324~hmac=fd2b3b2126abb599d79eb67d97b1288713516e1b3a727f3cd133d81899b445aa"
            type="video/webm"
          />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default page;
