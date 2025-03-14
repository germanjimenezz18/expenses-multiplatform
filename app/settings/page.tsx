import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SideNavbar from "@/components/SideNav";
import { ModeToggleButtons } from "@/components/ModeToggleButtons";
import Header from "@/components/Header";
import ButtonConnectToBank from "@/components/button-connect-to-bank";

export default function SettingsPage() {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40 lg:max-h-screen lg:overflow-hidden">
        <SideNavbar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <Header />
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
            <div className="mx-auto grid w-full max-w-6xl gap-2">
              <h1 className="text-3xl font-semibold">Settings</h1>
            </div>
            <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
              <nav
                className="grid gap-4 text-sm text-muted-foreground"
                x-chunk="dashboard-04-chunk-0"
              >
                <Link href="#" className="font-semibold text-primary">
                  General
                </Link>
                <Link href="#">Integrations</Link>
                <Link href="#">Support</Link>
              </nav>
              <div className="grid gap-6">
                <Card x-chunk="dashboard-04-chunk-1">
                  <CardHeader>
                    <CardTitle>Theme</CardTitle>
                    <CardDescription>
                      Select between dark or light mode
                    </CardDescription>
                    <ModeToggleButtons />
                  </CardHeader>
                </Card>
                <Card x-chunk="dashboard-04-chunk-2">
                  <CardHeader>
                    <CardTitle>Integrations</CardTitle>
                    <CardDescription>
                      Manage third-party bank integrations
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ButtonConnectToBank />

                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-04-chunk-3">
                  <CardHeader>
                    <CardTitle>Support</CardTitle>
                    <CardDescription>
                      Get help  from our support team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button variant={'destructive'}>
                        Reset Account Data
                      </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
