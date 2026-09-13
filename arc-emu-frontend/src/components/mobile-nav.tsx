import { cn } from "@/lib/utils";
import React from "react";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/components/header";
import { XIcon, MenuIcon } from "lucide-react";
import { Link, useLocation } from "@tanstack/react-router";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const firstItemRef = React.useRef<HTMLAnchorElement>(null);
  const location = useLocation();

  // Close the menu whenever the route changes
  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Move focus into the menu on open, back to the trigger on close
  const wasOpen = React.useRef(false);
  React.useEffect(() => {
    if (open) {
      wasOpen.current = true;
      firstItemRef.current?.focus();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      triggerRef.current?.focus();
    }
  }, [open ]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open ]);

  return (
    <div className="md:hidden">
      <Button
        ref={triggerRef}
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? "Close menu" : "Open menu"}
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop onClick={() => setOpen(false)} />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
              "size-full p-4",
            )}
            data-slot={open ? "open" : "closed"}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <nav aria-label="Mobile" className="grid gap-y-2">
              {navLinks.map((link, i) => (
                <Button
                  asChild
                  className="justify-start py-6 text-base"
                  key={link.to}
                  variant="outline"
                >
                  <Link
                    to={link.to}
                    ref={i === 0 ? firstItemRef : undefined}
                    onClick={() => setOpen(false)}
                    aria-current={
                      location.pathname === link.to ? "page" : undefined
                    }
                  >
                    <span className="flex items-center gap-3">
                      {link.label}
                      <span>{link.text}</span>
                    </span>
                  </Link>
                </Button>
              ))}
            </nav>
          </div>
        </Portal>
      )}
    </div>
  );
}
