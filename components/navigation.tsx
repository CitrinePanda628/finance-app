"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMedia } from "react-use";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { NavButton } from "./ui/nav-button";

export const routes = [
  {
    href: "/",
    label: "Overview",
  },
  {
    href: "/transactions",
    label: "Transactions",
  },
  {
    href: "/categories",
    label: "Categories",
  },
  {
    href: "/accounts",
    label: "Accounts",
  }
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMedia("(max-width: 1024px)", false);

  const onClick = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="font-normal bg-white/20 hover:bg-white/30 text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none transition"
            >
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="px-4">
                <SheetHeader>
                <SheetTitle className="text-left">Menu</SheetTitle>
                <SheetDescription className="text-left">
                  Navigation menu options
                </SheetDescription>
              </SheetHeader>
            <nav className="flex flex-col gap-y-2 pt-6">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  variant={route.href === pathname ? "secondary" : "ghost"}
                  onClick={() => onClick(route.href)}
                  className="w-full justify-start"
                >
                  {route.label}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      ) : (
        <nav className="flex text-2xl items-center gap-x-4">
          {routes.map((route) => (
            <NavButton
              key={route.href}
              href={route.href}
              label={route.label}
              isActive={pathname === route.href}
            />
          ))}
        </nav>
      )}
    </>
  );
};