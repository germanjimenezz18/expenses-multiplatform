import { ModeToggle } from "@/components/ModeToggle";
import Link from "next/link";
import { MountainIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Expenses Multiplatform</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href={"/dashboard"}>Ir a inicio</Link>

          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#testimonials"
          >
            Testimonials
          </Link>

          <ModeToggle />
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Expenses Across All Platforms
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Simplify your financial tracking with Expenses Multiplatform.
                  One app for all your devices.
                </p>
              </div>
              <div className="space-x-4">
                <Button>
                  <a href={"dashboard"}>Get Started</a>
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Cross-Platform Sync</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Seamlessly sync your expenses across all your devices in
                    real-time.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Smart Categorization</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Automatically categorize your expenses for effortless
                    tracking and insights.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Custom Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Generate detailed, customizable reports to gain deeper
                    financial insights.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Simple Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">$9.99</div>
                  <p className="text-gray-500 mb-4">per month</p>
                  <ul className="space-y-2">
                    <li>Up to 100 expenses/month</li>
                    <li>Basic categorization</li>
                    <li>Monthly reports</li>
                  </ul>
                  <Button className="w-full mt-4">Choose Plan</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Pro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">$19.99</div>
                  <p className="text-gray-500 mb-4">per month</p>
                  <ul className="space-y-2">
                    <li>Unlimited expenses</li>
                    <li>Smart categorization</li>
                    <li>Weekly reports</li>
                    <li>Data export</li>
                  </ul>
                  <Button className="w-full mt-4">Choose Plan</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold mb-2">Custom</div>
                  <p className="text-gray-500 mb-4">Contact us for pricing</p>
                  <ul className="space-y-2">
                    <li>All Pro features</li>
                    <li>Dedicated support</li>
                    <li>Custom integrations</li>
                    <li>Team management</li>
                  </ul>
                  <Button className="w-full mt-4">Contact Sales</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="testimonials"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
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
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
