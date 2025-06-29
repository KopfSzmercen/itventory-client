import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import Link from "next/link";

const Header = async () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm px-2 md:px-4">
      <div className="flex h-16 items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6" />
            <span className="font-bold text-xl">ItVentory</span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a
              href="#features"
              className="transition-colors hover:text-foreground/80"
            >
              Funkcje
            </a>
            <a
              href="#pricing"
              className="transition-colors hover:text-foreground/80"
            >
              Ceny
            </a>
            <a
              href="#about"
              className="transition-colors hover:text-foreground/80"
            >
              O nas
            </a>
          </nav>
          <ThemeToggle />
          <Link href="/login">
            <Button variant="outline" size="sm" className="cursor-pointer">
              Zaloguj się
            </Button>
          </Link>

          <Link href="/register">
            <Button size="sm" className="hidden md:block cursor-pointer">
              Rozpocznij
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
