"use client"
import Link from "next/link";
import { TooltipProvider } from "@/components/ui/tooltip"
import { ArrowLeftRight, ChartColumnStacked, Home, LineChart, Package, Package2, Settings, ShoppingCart, UserRound, Users2 } from "lucide-react";
import NavigationButton from "./NavigationButton";
import { usePathname } from "next/navigation";

const routes = [
    { name: "Dashboard", icon: Home, href: "/dashboard" },
    { name: "Accounts", icon: UserRound, href: "/dashboard/accounts" },
    { name: "Categories", icon: ChartColumnStacked, href: "/dashboard/categories" },
    { name: "Transactions", icon: ArrowLeftRight, href: "/dashboard/transactions" },
    { name: "Analytics", icon: LineChart, href: "#" },
]

const settingRoute = { name: "Settings", icon: Settings, href: "/settings" }
const firstRoute = { name: "Expenses Multiplatform", href: "dashboard" }

export default function SideNavbar() {
    const pathname = usePathname()
    console.log(pathname);

    return (
        <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                        href={firstRoute.href}
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
                        <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                        <span className="sr-only">{firstRoute.name}</span>
                    </Link>

                    {/* mainRoutes */}
                    {
                        routes.map((route, index) => (
                            <NavigationButton key={index}
                                href={route.href}
                                name={route.name}
                                icon={route.icon}
                                isActive={pathname === route.href}
                            />
                        ))
                    }
                </nav>

                {/* Settings */}
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <NavigationButton  {...settingRoute} isActive={pathname === settingRoute.href}
                    />
                </nav>
            </aside>
        </TooltipProvider>
    )
} 