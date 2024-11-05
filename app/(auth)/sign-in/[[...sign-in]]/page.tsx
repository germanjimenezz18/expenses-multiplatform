import { SignIn, ClerkLoading, ClerkLoaded } from "@clerk/nextjs"
import { Globe, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

function page() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full  lg:flex flex-col items-center justify-start px-4">
                <div className="bg-white">
                    <Link href={'/'}>Volver Atras</Link>
                </div>
                <div className="text-center space-y-4 pt-16">
                    <h1 className=" text-xl text-primary">Welcome!</h1>
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

                {/* <Image src={'/logo.svg'} alt="logo" width={200} height={200} /> */}
                <Globe className="h-6 w-6 text-foreground" />
            </div>
        </div>
    )
}

export default page