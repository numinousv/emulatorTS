import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Button8 } from "@/components/ui/8bit/button";
import { Spinner } from "@/components/ui/spinner";
import { useConsoles } from "@/hooks/useGames";
import { FiGithub } from "react-icons/fi";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data: consoles, isLoading } = useConsoles();

  return (
    <div className="relative min-h-screen w-full">
      <div className="relative z-10 container mx-auto px-4 pt-20 pb-8 sm:pt-24">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 sm:mb-16"
          >
            <h1 className="text-3xl leading-tight sm:text-5xl md:text-7xl font-bold mb-4 break-words bg-linear-to-r from-amber-500 to-amber-300 bg-clip-text text-transparent">
              Emulator-TS Retro Library
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mb-8">
              Enjoy a nostalgic collection of games from your favorite retro
              consoles. Click and play, utilizing RetroArch through EmulatorJS.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button8
                size="lg"
                className="px-5 py-4 text-sm sm:px-8 sm:py-6 sm:text-lg bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-400"
                asChild
              >
                <Link to="/console">🎮 Launch Emulator</Link>
              </Button8>

              <Button
                size="icon-lg"
                variant="outline"
                className="rounded-xl h-14 w-14 border-4 bg-amber-700 hover:bg-amber-600"
                asChild
              >
                <a
                  href="https://github.com/404"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View source on GitHub"
                >
                  <FiGithub className="size-6" />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-6 text-muted-foreground border-b pb-2">
              Available Consoles
            </h2>

            {isLoading ? (
              <div className="flex justify-center py-12" role="status">
                <Spinner />
                <span className="sr-only">Loading consoles…</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {consoles?.map((console) => (
                  <Link
                    key={console.id}
                    to="/console/$consoleId"
                    params={{ consoleId: console.id }}
                    className="block rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <div className="border-2 border-border text-muted-foreground rounded-lg p-4 sm:p-6 hover:shadow-lg transition-all hover:-translate-y-1 bg-card">
                      <div className="text-3xl sm:text-4xl mb-3" aria-hidden="true">{console.icon}</div>
                      <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-1">
                        {console.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {console.count} games
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {console.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
