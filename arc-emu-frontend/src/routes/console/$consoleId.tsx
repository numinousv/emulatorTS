import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { MoveLeftIcon } from "lucide-react";
import { GameCard } from "@/components/GameCard";
import { Spinner } from "@/components/ui/spinner";
import { useConsole } from "@/hooks/useGames";
import { Button8 } from "@/components/ui/8bit/button";
import { useGameStore } from "@/stores/gameStore";

const Emulator = lazy(() =>
  import("@/components/Emulator").then((module) => ({
    default: module.Emulator,
  })),
);

export const Route = createFileRoute("/console/$consoleId")({
  component: ConsolePage,
});

function ConsolePage() {
  const { consoleId } = Route.useParams();
  const { selectedGameId, setSelectedGame, addRecentGame } = useGameStore();
  const { data: consoleData, isLoading, error } = useConsole(consoleId);
  const game = consoleData?.games.find((g) => g.id === selectedGameId);

  const handleGameSelect = (id: string) => {
    setSelectedGame(id);
    addRecentGame(id);
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen w-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !consoleData) {
    return (
      <div className="relative min-h-screen w-full">
        <div className="relative z-10 container mx-auto px-4 pt-24 pb-8 text-center">
          <h1 className="text-2xl font-bold text-red-500">Console not found</h1>
          <Link to="/console" className="mt-4 inline-block">
            <Button8 variant="outline">Return to Consoles</Button8>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative z-10 container mx-auto px-4 pt-24 pb-8"
      >
        {!game ? (
          <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-8 text-muted-foreground">
              <Link to="/console" className="self-start">
                <Button8
                  variant="outline"
                  className="flex items-center text-muted-foreground mx-auto"
                  aria-label="Back to all consoles"
                >
                  <MoveLeftIcon className="h-2 w-2 text-muted-foreground border-t-foreground" />{" "}
                  All Consoles
                </Button8>
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-orange-300 retro break-words">
                  {consoleData.name}
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg">
                  {consoleData.description}
                </p>
              </div>
            </div>

            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto"
              role="list"
              aria-label={`${consoleData.name} games`}
            >
              {consoleData.games.map((g) => (
                <div key={g.id} role="listitem">
                  <GameCard
                    game={g}
                    onSelect={handleGameSelect}
                    color={consoleData.color}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center max-w-5xl mx-auto">
            <div className="w-full mb-4 flex items-center">
              <Button8
                variant="outline"
                onClick={() => setSelectedGame(null)}
                className="flex items-center text-muted-foreground text-xs mx-auto"
                aria-label={`Back to ${consoleData.name} games`}
              >
                <MoveLeftIcon className="h-2 w-2" /> Back to {consoleData.name}{" "}
                Games
              </Button8>
            </div>

            <Suspense
              fallback={
                <div
                  className="w-full max-w-5xl bg-black/20 rounded-lg p-8 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <div className="animate-pulse bg-linear-to-r">
                    Loading emulator...
                  </div>
                </div>
              }
            >
              <div className="w-full max-w-5xl bg-black/20 rounded-lg p-2 sm:p-4">
                <Emulator
                  romUrl={game.url}
                  core={game.core}
                  gameName={game.name}
                  gameId={game.id}
                />
              </div>
            </Suspense>
          </div>
        )}
      </motion.div>
    </div>
  );
}
