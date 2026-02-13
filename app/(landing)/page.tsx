import { ArrowRight, Globe } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { AnimatedTabs } from "../../components/AnimatedTabs";
import { TextGenerateEffectExample } from "../../components/text-generate-effect";

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
    <div className="flex min-h-screen flex-col">
      <header className="bo flex h-14 w-full items-center justify-end gap-x-6 bg-white px-4 lg:px-6 dark:bg-background">
        <Link className="flex items-center justify-center" href="#">
          <span className="sr-only">Expenses Multiplatform</span>
        </Link>
        <Link className="flex items-center justify-center" href="/sign-in">
          <span className="text-primary/40 transition-all hover:text-primary/90">
            Login
          </span>
        </Link>
        <Link className="mr-4 flex items-center" href="/sign-up">
          <span className="text-primary/40 transition-all hover:text-primary/90">
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
                  className="select-none whitespace-nowrap text-muted-foreground hover:border-primary/50 hover:text-primary/60"
                  variant="outline"
                >
                  Expenses
                  <Globe className="mx-1 size-5" />
                  Multiplatform
                </Badge>
                <span className="sr-only">Expenses Multiplatform</span>
              </Link>
              <div className="space-y-2">
                <h1 className="font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Simplify Your Finances
                </h1>
                <TextGenerateEffectExample />
                {/* <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-200">
                  Open Source Track your expenses, manage your budget, and gain insights
                </p> */}
              </div>
              <div className="flex flex-col items-center justify-center gap-y-6 space-x-4">
                <Link className="mt-6" href={"dashboard"}>
                  <button className="group relative grid overflow-hidden rounded-xl px-4 py-2 shadow-[0_1000px_0_0_hsl(0_0%_20%)_inset] transition-colors duration-200">
                    <span>
                      <span className="spark mask-gradient absolute inset-0 h-[100%] w-[100%] animate-flip overflow-hidden rounded-xl [mask:linear-gradient(white,_transparent_50%)] before:absolute before:aspect-square before:w-[200%] before:rotate-[-90deg] before:animate-rotate before:bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] before:content-[''] before:[inset:0_auto_auto_50%] before:[translate:-50%_-15%]" />
                    </span>
                    <span className="backdrop absolute inset-px rounded-[11px] bg-neutral-950 transition-colors duration-200 group-hover:bg-neutral-900" />
                    <span className="z-10 flex items-center font-medium text-neutral-400 text-sm">
                      Get Started <ArrowRight className="ml-1 size-4" />
                    </span>
                  </button>
                </Link>

                <AnimatedTabs />
              </div>
            </div>
          </div>
        </section>
        {/* 
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
        </section> */}
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t bg-white px-4 py-6 sm:flex-row md:px-6 dark:bg-background">
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
