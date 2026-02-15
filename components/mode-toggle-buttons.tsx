"use client";
import clsx from "clsx";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggleButtons() {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex flex-row gap-3">
      <Button
        className={clsx(theme === "light" ? "border-green-500" : "")}
        onClick={() => setTheme("light")}
        variant={"outline"}
      >
        <Sun size={16} />
        Light
      </Button>
      <Button
        className={clsx(theme === "dark" ? "border-green-500" : "")}
        onClick={() => setTheme("dark")}
        variant={"outline"}
      >
        <Moon size={16} />
        Dark
      </Button>
      <Button
        className={clsx(theme === "system" ? "border-green-500" : "")}
        onClick={() => setTheme("system")}
        variant={"outline"}
      >
        System
      </Button>
    </div>
  );
}
