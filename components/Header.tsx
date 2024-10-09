import Link from "next/link";
import {
  ArrowLeftRight,
  ChartColumnStacked,
  Globe,
  Home,
  LineChart,
  Loader2,
  Package,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import BreadcrumbLoco from "./breadcrumb";
import { Badge } from "./ui/badge";
import Filters from "./filters";

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
  ];

  return (
    <header className=" sticky top-0 z-30 flex h-14 items-center gap-4 bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6  ">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Globe className="h-5 w-5 transition-all group-hover:scale-110" />
              <span className="sr-only">Acme Inc</span>
            </Link>

            {routes.map((route: any) => (
              <SheetClose asChild key={route.name}>
                <Link
                  href={route.href}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <route.icon className="h-5 w-5" />
                  {route.name}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <BreadcrumbLoco />

      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>

      {/* Clerk button */}
      <ClerkLoaded>
        <UserButton afterSignOutUrl="/sign-in" />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="size-7 text-primary animate-spin" />
      </ClerkLoading>
      <Filters />

      <div className=" hidden lg:flex absolute left-1/2 top-5  -translate-x-1/2 -translate-y-1/2">
        <Badge
          variant="outline"
          className="text-muted-foreground select-none hover:text-primary/60 hover:border-primary/50 whitespace-nowrap"
        >
          Expenses
          <Globe className="size-5 mx-1" />
          Multiplatform
        </Badge>
      </div>
    </header>
  );
}
