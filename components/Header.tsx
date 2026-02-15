"use client";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import {
  ArrowLeftRight,
  ChartColumnStacked,
  Globe,
  Home,
  LineChart,
  Loader2,
  PanelLeft,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Filters from "./filters";
import { Badge } from "./ui/badge";

export default function Header() {
  const routes = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Accounts", icon: UserRound, href: "/dashboard/accounts" },
    {
      name: "Categories",
      icon: ChartColumnStacked,
      href: "/dashboard/categories",
    },
    {
      name: "Transactions",
      icon: ArrowLeftRight,
      href: "/dashboard/transactions",
    },
    { name: "Analytics", icon: LineChart, href: "/dashboard/analytics" },
    { name: "Settings", icon: Settings, href: "/settings" },
  ] as const;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button className="sm:hidden" size="icon" variant="outline">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent className="sm:max-w-xs" side="left">
          <nav className="grid gap-6 font-medium text-lg">
            <Link
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-lg text-primary-foreground md:text-base"
              href="#"
            >
              <Globe className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>

            {routes.map((route) => (
              <SheetClose asChild key={route.name}>
                <Link
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  href={route.href}
                >
                  <route.icon className="h-5 w-5" />
                  {route.name}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="hidden lg:flex">
        <Badge
          className="select-none whitespace-nowrap text-muted-foreground hover:border-primary/50 hover:text-primary/60"
          variant="outline"
        >
          Expenses
          <Globe className="mx-1 size-5" />
          Multiplatform
        </Badge>
      </div>

      <Suspense
        fallback={
          <div className="relative ml-auto hidden w-[200px] md:flex">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <Filters className="relative ml-auto hidden md:flex" />
      </Suspense>

      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
          placeholder="Search..."
          type="search"
        />
      </div>

      {/* Clerk button */}
      <ClerkLoaded>
        <UserButton afterSignOutUrl="/sign-in" />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="size-7 animate-spin text-primary" />
      </ClerkLoading>
    </header>
  );
}
