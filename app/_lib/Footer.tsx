import { Building2 } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50 w-full flex items-center justify-center backdrop-blur supports-[backdrop-filter]:bg-muted/30">
      <div className="container py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-6 w-6" />
              <span className="font-bold text-xl">InventoryPro</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Usprawnij swoje operacje biznesowe dzięki naszej kompleksowej
              platformie zarządzania.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Produkt</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Funkcje
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Cennik
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Integracje
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  API
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Firma</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  O nas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Kariera
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Wsparcie</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground">
                  Centrum pomocy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Dokumentacja
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Status
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground">
                  Prywatność
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} InventoryPro. Wszelkie prawa
            zastrzeżone.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
