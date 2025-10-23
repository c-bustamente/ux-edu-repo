"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

export function Navigation() {
  const pathname = usePathname();

  const sections = [
    { href: "/", label: "Home" },
    { href: "/principles", label: "UX Principles" },
    { href: "/patterns", label: "Pattern Repository" },
    { href: "/generator", label: "Recommendations" },
    { href: "/community", label: "Community" },
    { href: "/resources", label: "Technical Resources" },
  ];

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* 🔹 Logo + subtítulo */}
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">UX Repository</h1>
            <p className="text-muted-foreground hidden sm:block">
              Educational Platform
            </p>
          </div>

          {/* 🔹 Menú de navegación */}
          <nav className="flex space-x-2">
            {sections.map((section) => {
              const isActive =
                pathname === section.href ||
                (pathname.startsWith(section.href) && section.href !== "/");

              return (
                <Link key={section.href} href={section.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={cn(
                      "text-sm transition-colors",
                      isActive ? "font-semibold" : "text-muted-foreground"
                    )}
                  >
                    {section.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
