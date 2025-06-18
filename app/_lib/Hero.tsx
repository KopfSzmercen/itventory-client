import { Button } from "@/components/ui/button";
import { Badge, ArrowRight } from "lucide-react";
import React from "react";

const Hero = () => {
  return (
    <section className="container py-24 md:py-32 mx-auto">
      <div className="mx-auto max-w-4xl text-center">
        <Badge className="mb-4">Zaufało nam wiele firm</Badge>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6">
          Przyspiesz swój biznes dzięki naszym{" "}
          <span className="text-primary">rozwiązaniom.</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Zarządzaj zapasami, biurami i zespołami dzięki naszej kompleksowej
          platformie zarządzania biznesem. Zwiększ efektywność, obniż koszty i
          skaluj swoje operacje bezproblemowo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="text-lg px-8">
            Rozpocznij
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8">
            Oglądnij demo
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Darmowe demo i 14-dniowy okres próbny bez karty kredytowej.
        </p>
      </div>
    </section>
  );
};

export default Hero;
