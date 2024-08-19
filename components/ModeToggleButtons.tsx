"use client"
import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import clsx from "clsx"

export function ModeToggleButtons() {
    const { setTheme, theme } = useTheme()
    console.log(theme)
    return (
        <div className="flex flex-row gap-3">
            <Button variant={"outline"} onClick={() => setTheme("light")}
                className={clsx(
                    theme === "light" ? " border-green-500" : ""
                )}
            >
                <Sun size={16} />
                Light
            </Button>
            <Button variant={"outline"}
                className={clsx(
                    theme === "dark" ? " border-green-500" : ""
                )}
                onClick={() => setTheme("dark")}>
                <Moon size={16} />
                Dark
            </Button>
            <Button variant={"outline"}
                className={clsx(
                    theme === "system" ? " border-green-500" : ""
                )}
                onClick={() => setTheme("system")}>
                System
            </Button>
        </div>
    )
}
