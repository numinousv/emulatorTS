import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Header } from "@/components/header";
import appCss from "../styles.css?url";
import { Particles } from "@/components/ui/particles";
export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Retro Game Library / Arcade",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      // { rel: "stylesheet", href: "/src/components/ui/8bit/styles/retro.css" },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Particles
        className="absolute inset-0"
        color="#666666"
        ease={20}
        quantity={120}
      />
    </>
  );
}
