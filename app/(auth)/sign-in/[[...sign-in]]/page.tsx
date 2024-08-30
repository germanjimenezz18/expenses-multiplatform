import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs"
import { Loader2 } from "lucide-react"
import Image from "next/image"

function page() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full  lg:flex flex-col items-center justify-start px-4">
                <div className="text-center space-y-4 pt-16">
                    <h1 className="font-bold text-3xl text-green-300">Welcome Back!</h1>
                </div>

                <div className="flex items-center justify-center mt-8">
                    <ClerkLoaded>
                        <SignIn path="/sign-in" />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="w-12 h-12 text-white animate-spin" />

                    </ClerkLoading>


                </div>
            </div>

            <div className="h-full bg-green-950 hidden lg:flex items-center justify-center">
                <Image src={'/logo.svg'} alt="logo" width={200} height={200} />
            </div>
        </div>
    )
}

export default page