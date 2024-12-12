import Link from "next/link";
import { Circle, Globe, ArrowLeftRight, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedTabs } from '../../components/AnimatedTabs';
import { TextGenerateEffectExample } from '../../components/text-generate-effect';

export default function LandingPage() {
  const features = [
    "Track Expenses",
    "Manage Budget",
    "Gain Insights",
    "Multiplatform",
    "Simplify Finances",
    "Cloud Sync",
  ];

  return (
    <div className="flex flex-col min-h-screen">

      <header className="px-4 lg:px-6 h-14 flex items-center justify-end  w-full gap-x-6 bg-white dark:bg-background bo">
        <Link className="flex items-center justify-center " href="#">
          <span className="sr-only ">Expenses Multiplatform</span>
        </Link>
        <Link className="flex items-center justify-center" href="/sign-in">
          <span className="text-primary/40 hover:text-primary/90 transition-all">
            Login
          </span>
        </Link>
        <Link className="flex items-center  mr-4" href="/sign-up">
          <span className="text-primary/40 hover:text-primary/90 transition-all ">
            Register
          </span>
        </Link>
      </header>
      <main className="flex-1">

        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <Link className="flex items-center justify-center" href="#">
                <Badge
                  variant="outline"
                  className="text-muted-foreground select-none hover:text-primary/60 hover:border-primary/50 whitespace-nowrap"
                >
                  Expenses
                  <Globe className="size-5 mx-1" />
                  Multiplatform
                </Badge>
                <span className="sr-only">Expenses Multiplatform</span>
              </Link>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Simplify Your Finances
                </h1>
                  <TextGenerateEffectExample/>
                {/* <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-200">
                  Open Source Track your expenses, manage your budget, and gain insights
                </p> */}
              </div>
              <div className="space-x-4 items-center flex justify-center flex-col gap-y-6 ">
                <Link href={"dashboard"} className="">
                  <button className="group relative grid overflow-hidden rounded-xl px-4 py-2 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
                    <span>
                      <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-xl [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                    </span>
                    <span className="backdrop absolute inset-px rounded-[11px] bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
                    <span className="z-10 text-sm font-medium text-neutral-400 flex items-center">Get Started <ArrowRight className="ml-1 size-4"/></span>
                  </button>
                </Link>

                <AnimatedTabs />
              </div>
            </div>
          </div>


        </section>

        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 ">
              Simple Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3  gap-8">
              <Card className="md:col-start-2">
                <CardHeader>
                  <CardTitle>Full Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">$0.00</div>
                  <p className="text-gray-500 mb-4">per month</p>
                  <ul className="space-y-2">
                    <li>
                      iOS & Android App
                      <Badge variant="outline" className="text-primary ml-2">
                        featuring
                      </Badge>
                    </li>
                    <li>
                      AI Insights
                      <Badge variant="outline" className="text-primary ml-2">
                        featuring
                      </Badge>
                    </li>
                    <li>Free Monthly Reports</li>
                    <li>Unlimited Accounts</li>
                    <li>Custom Categorization</li>
                    <li>Cloud Sync</li>
                    <li>CSV Import/Export</li>
                  </ul>
                  <Link href={"/dashboard"}>
                    <Button className="w-full mt-4">Choose Plan</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-center flex-col py-6">
              <a href="https://buymeacoffee.com/germanjimenez" target="_blank">
                <img
                  src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                  alt="Buy Me A Coffee"
                  style={{ height: "50px", width: "auto" }}
                />
              </a>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 ">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              What Our Users Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="pt-4">
                  <p className="mb-4">
                    &ldquo;Expenses Multiplatform has revolutionized how I
                    manage my finances. The cross-platform sync is a
                    game-changer!&ldquo;
                  </p>
                  <p className="font-semibold">
                    - Sarah J., Small Business Owner
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <p className="mb-4">
                    &ldquo;The custom reports have given me insights into my
                    spending habits that I never had before. Highly
                    recommended!&ldquo;
                  </p>
                  <p className="font-semibold">- Mark T., Freelancer</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
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
