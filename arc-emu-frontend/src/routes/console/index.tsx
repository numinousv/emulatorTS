import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Particles } from "@/components/ui/particles";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button8 } from "@/components/ui/8bit/button";
import { Spinner } from "@/components/ui/spinner";
import { useConsoles } from "@/hooks/useGames";

export const Route = createFileRoute("/console/")({
  component: HomePage,
});

function HomePage() {
  const { data: consoles, isLoading } = useConsoles();

  return (
    <div className="relative min-h-screen w-full">
      <Particles
        className="absolute inset-0"
        color="#666666"
        ease={20}
        quantity={120}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 container mx-auto px-4 pt-24 pb-8"
      >
        <div className="text-center mb-8 sm:mb-12 px-2">
          <Button8 className="text-sm sm:text-xl md:text-2xl font-bold mb-6 sm:mb-8 text-center max-w-full whitespace-normal break-words">
            SELECT CONSOLE
          </Button8>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Choose your console and dive into a personal collection of classic
            games
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12" role="status">
            <Spinner />
            <span className="sr-only">Loading consoles…</span>
          </div>
        ) : (
          <Carousel
            opts={{ align: "center", loop: true }}
            className="w-full max-w-6xl mx-auto"
            aria-label="Console selection carousel"
          >
            <CarouselContent>
              {consoles?.map((console) => (
                <CarouselItem
                  key={console.id}
                  className="basis-[85%] sm:basis-1/2 lg:basis-1/3"
                >
                  <Link
                    to="/console/$consoleId"
                    params={{ consoleId: console.id }}
                    className="block rounded-lg focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <Card
                      className={`
                      relative overflow-hidden cursor-pointer group
                      border-2 hover:border-primary transition-all
                      w-full max-w-6xl mx-auto
                    `}
                      style={{ background: console.color }}
                    >
                      <CardHeader className="relative">
                        <div className="text-5xl sm:text-6xl mb-2" aria-hidden="true">{console.icon}</div>
                        <CardTitle className="text-xl sm:text-2xl font-bold text-white break-words">
                          {console.name}
                        </CardTitle>
                        <CardDescription className="text-white/80">
                          {console.count} Games Available
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="relative">
                        <p className="text-white/90 text-sm">
                          {console.description}
                        </p>
                      </CardContent>

                      <CardFooter className="relative">
                        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-white h-full transition-all group-hover:w-full"
                            style={{
                              width: `${Math.min(100, console.count)}%`,
                            }}
                          />
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 sm:left-2 md:-left-12" />
            <CarouselNext className="right-1 sm:right-2 md:-right-12" />
          </Carousel>
        )}
      </motion.div>
    </div>
  );
}
