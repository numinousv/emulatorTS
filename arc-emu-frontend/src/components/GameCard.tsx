import { memo } from "react";
import { Game } from "@/types/game";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GameCardProps {
  game: Game;
  onSelect: (id: string) => void;
  color?: string;
}
//memoization for optimization moved from consoleId to components
export const GameCard = memo(
  ({ game, onSelect, color = "" }: GameCardProps) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      // Native buttons activate on Enter (keydown) and Space (keyup)
      if (e.key === "Enter") {
        e.preventDefault();
        onSelect(game.id);
      } else if (e.key === " " && !e.repeat) {
        // Prevent page scroll; activation happens on keyup like a button
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        onSelect(game.id);
      }
    };

    return (
      <Card
        className={`
        relative overflow-hidden cursor-pointer group
        border-2 hover:border-primary transition-all
        w-full max-w-6xl mx-auto
        focus-visible:border-primary focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary
      `}
        style={{ background: color || undefined }}
        onClick={() => onSelect(game.id)}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        tabIndex={0}
        role="button"
        aria-label={`Play ${game.name} on ${game.core}`}
      >
        <CardHeader>
          <CardTitle className="text-white break-words">{game.name}</CardTitle>
          <CardDescription>{game.core}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-white max-w-3xl mx-auto">
            {game.description || "Click to play!"}
          </p>
        </CardContent>
      </Card>
    );
  },
);

GameCard.displayName = "GameCard";
