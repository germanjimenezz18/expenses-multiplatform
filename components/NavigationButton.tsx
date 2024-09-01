
import Link from "next/link"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
type Props = {
    name: string
    icon: React.ElementType
    href: string
    isActive?: boolean
}
export default function NavigationButton({ name, icon, href, isActive }: Props) {
    const Icon = icon

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Link
                    href={href}
                    className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                        isActive ? "text-primary hover:text-primary " : ""
                    )}
                >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{name}</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{name}</TooltipContent>
        </Tooltip>)
}
