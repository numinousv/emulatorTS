"use client";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { AnimatedThemeToggler } from "./ui/animated-theme-toggler";
import { MobileNav } from "@/components/mobile-nav";
import { Link, useLocation } from "@tanstack/react-router";
import { Home, Clock } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { useGames } from "@/hooks/useGames";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export const navLinks = [
  { label: <Home size={32} className="size-6" />, text: "Home", to: "/" },
  { label: "Emulator", text: "", to: "/console" },
] as const;

export function Header() {
  const scrolled = useScroll(10);
  const location = useLocation();
  const { recentGames } = useGameStore();
  const { data: allGames } = useGames();

  const gamesList = Array.isArray(allGames) ? allGames : [];
  const gameMap = new Map(gamesList.map((g) => [g.id, g]));

  const recentGameItems = recentGames
    .map((id) => gameMap.get(id))
    .filter((g): g is NonNullable<typeof g> => g != null);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-gray-600/7 border-b transition-all",
        scrolled && "border-amber-500 bg-background/5 backdrop-blur-sm",
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4"
      >
        <Link
          to="/"
          className="rounded-md px-2 py-1 text-lg font-bold tracking-tight whitespace-nowrap hover:bg-muted"
          aria-label="Arcade home"
        >
          <span aria-hidden="true">🕹️ </span>
          <span className="hidden min-[400px]:inline">Arcade</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Button
              key={link.to}
              size="lg"
              variant={location.pathname === link.to ? "default" : "outline"}
              asChild
              className={
                location.pathname === link.to
                  ? "text-md font-bold px-8 py-6"
                  : "text-md px-8 py-6 text-gray-500"
              }
              aria-label={`Navigate to ${link.text} page`}
            >
              <Link
                to={link.to}
                aria-current={
                  location.pathname === link.to ? "page" : undefined
                }
              >
                {link.label}
              </Link>
            </Button>
          ))}
        </div>

        {recentGameItems.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                aria-label="Recent games"
              >
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="hidden sm:inline">Recent</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {recentGameItems.map((game) => (
                <DropdownMenuItem key={game.id} asChild>
                  <Link
                    to="/console/$consoleId"
                    params={{ consoleId: game.core }}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{game.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {game.core.toUpperCase()}
                      </span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <div className="flex px-4 place-items-end">
          <AnimatedThemeToggler />
        </div>
        <MobileNav />
      </nav>
    </header>
  );
}
