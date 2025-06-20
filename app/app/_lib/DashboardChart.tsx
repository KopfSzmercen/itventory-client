"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";

export const description = "An area chart with a legend";

const chartData = [
  { month: "Styczeń", desktop: 186, mobile: 80 },
  { month: "Luty", desktop: 305, mobile: 200 },
  { month: "Marzec", desktop: 237, mobile: 120 },
  { month: "Kwiecień", desktop: 73, mobile: 190 },
  { month: "Maj", desktop: 209, mobile: 130 },
  { month: "Czerwiec", desktop: 214, mobile: 140 }
];

const chartConfig = {
  desktop: {
    label: "Komputer",
    color: "var(--chart-1)"
  },
  mobile: {
    label: "Telefon",
    color: "var(--chart-2)"
  }
} satisfies ChartConfig;

export function ChartAreaLegend() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wykres obszarowy - Legenda</CardTitle>
        <CardDescription>
          Wyświetlanie łącznej liczby odwiedzających w ciągu ostatnich 6
          miesięcy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="var(--color-mobile)"
              fillOpacity={0.4}
              stroke="var(--color-mobile)"
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 leading-none font-medium">
              Tendencja wzrostowa o 5,2% w tym miesiącu{" "}
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Styczeń - Czerwiec 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
