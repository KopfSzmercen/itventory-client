import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Package,
  Building2,
  BarChart3,
  Users,
  Shield,
  Zap
} from "lucide-react";
import React from "react";

const LandingFeatures = () => {
  return (
    <section id="features" className="container py-24 w-full mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">
          Wszystko, czego potrzebujesz do zarządzania swoim biznesem
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Od śledzenia zapasów po zarządzanie biurem – mamy wszystkie narzędzia,
          których potrzebuje Twój rozwijający się biznes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <Package className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Zarządzanie zapasami</CardTitle>
            <CardDescription>
              Śledź poziomy zapasów, zarządzaj dostawcami i automatyzuj ponowne
              zamówienia dzięki bieżącym danym o stanie magazynu.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <Building2 className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Zarządzanie biurem</CardTitle>
            <CardDescription>
              Koordynuj wiele lokalizacji, zarządzaj obiektami i optymalizuj
              wykorzystanie przestrzeni we wszystkich biurach.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <BarChart3 className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Analityka i raportowanie</CardTitle>
            <CardDescription>
              Uzyskaj praktyczne informacje dzięki kompleksowym panelom
              kontrolnym i konfigurowalnym raportom, do podejmowania decyzji
              opartych na danych.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <Users className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Współpraca zespołowa</CardTitle>
            <CardDescription>
              Umożliwia płynną współpracę dzięki dostępowi opartemu na rolach,
              zarządzaniu zadaniami i narzędziom komunikacji zespołowej.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <Shield className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Bezpieczeństwo i zgodność</CardTitle>
            <CardDescription>
              Bezpieczeństwo klasy korporacyjnej ze zgodnością SOC 2,
              szyfrowaniem danych i kompleksowymi ścieżkami audytu.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardHeader>
            <Zap className="h-12 w-12 text-primary mb-4" />
            <CardTitle>Automatyzacja</CardTitle>
            <CardDescription>
              Automatyzuj rutynowe zadania, ustawiaj inteligentne alerty i twórz
              niestandardowe przepływy pracy, aby zwiększyć produktywność.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
};

export default LandingFeatures;
