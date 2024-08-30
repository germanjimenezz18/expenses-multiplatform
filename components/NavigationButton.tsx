
import Link from "next/link"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${isActive ? "bg-red-500 text-white" : ""}`}
                >
                    <Icon className="h-5 w-5" />
                    <span className="sr-only">{name}</span>
                </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{name}2</TooltipContent>
        </Tooltip>)
}
