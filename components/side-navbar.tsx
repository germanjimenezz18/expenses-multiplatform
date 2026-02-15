"use client";
import {
  ArrowLeftRight,
  ChartColumnStacked,
  Globe,
  Home,
  LineChart,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/components/ui/tooltip";
import NavigationButton from "./navigation-button";

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
];

const settingRoute = { name: "Settings", icon: Settings, href: "/settings" };
const firstRoute = { name: "Expenses Multiplatform", href: "/dashboard" };

export default function SideNavbar() {
  const pathname = usePathname();

  return (
    <TooltipProvider>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-lg text-primary-foreground md:h-8 md:w-8 md:text-base"
            href={firstRoute.href}
          >
            <Globe className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">{firstRoute.name}</span>
          </Link>

          {/* mainRoutes */}
          {routes.map((route) => (
            <NavigationButton
              href={route.href}
              icon={route.icon}
              isActive={pathname === route.href}
              key={route.href}
              name={route.name}
            />
          ))}
        </nav>

        {/* Settings */}
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <NavigationButton
            {...settingRoute}
            isActive={pathname === settingRoute.href}
          />
        </nav>
      </aside>
    </TooltipProvider>
  );
}
