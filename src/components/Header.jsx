import React from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Laptop } from "lucide-react";

// imports created by shadcn-ui generator
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { theme, setTheme } = useTheme();

  const Icon = () => {
    if (theme === "light") return <Sun className="h-5 w-5" />;
    if (theme === "dark") return <Moon className="h-5 w-5" />;
    return <Laptop className="h-5 w-5" />;
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <h1 className="text-lg font-semibold">Weather App</h1>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Change theme">
            <Icon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" /> Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" /> Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Laptop className="mr-2 h-4 w-4" /> System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
