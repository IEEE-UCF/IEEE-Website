"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An area chart with a legend"

export function Areachart() {

const chartConfig = {
  general: {
    label: "General Events",
    color: "var(--ieee-black)",
  },
  technical: {
    label: "Technical Workshops",
    color: "var(--ieee-dark-yellow)",
  },
  prodev: {
    label: "Professional Development Workshops",
    color: "var(--ieee-bright-yellow)",
  },
  social: {
    label: "Social Events",
    color: "var(--ieee-grey)",
  },
  service: {
    label: "Service Events",
    color: "var(--ieee-light-grey)",
  },
  project: {
    label: "Project Events",
    color: "white",
  }
} satisfies ChartConfig

const monthOrder = {
    January: 0,
    February: 1,
    March: 2,
    April: 3,
    May: 4,
    June: 5,
    July: 6,
    August: 7,
    September: 8,
    October: 9,
    November: 10,
    December: 11
};

interface ChartData {
    general: number;
    technical: number;
    prodev: number;
    social: number;
    service: number;
    project: number;

}

let chartHashTable: ChartData[] = Array.from({ length: 12 });

const [chartData, setChartData] = useState<ChartData[]>([]);

useEffect(() => {
    fetchChartData();
    
}, []);

const fetchChartData = async () => {
    const res = await fetch("/api/events", {method: "GET"});
    const events = await res.json();

    events.data.forEach((event: any) => {
        const eventDate = new Date(event.time);

        const monthIndex = eventDate.getMonth();

        let chartData: ChartData = {
            general: 0,
            technical: 0,
            prodev: 0,
            social: 0,
            service: 0,
            project: 0
        }

        switch(event.committee) {
            case "General":
                chartData.general+=1;
                break;

            case "Workshop":
                chartData.technical+=1;
                break;

            case "Professional Development":
                chartData.prodev+=1;
                break;

            case "Social":
                chartData.social+=1;
                break;

            case "Service":
                chartData.service+=1;
                break;

            case "Project":
                chartData.project+=1;
                break;

        }

        chartHashTable[monthIndex]=chartData;

    });

    setChartData(chartHashTable);

}
  return (
    <Card>
      <CardHeader>
        <CardTitle>Area Chart - Legend</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
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
              dataKey="general"
              type="natural"
              fill="#ffc72c" 
              fillOpacity={1.0}
              stroke="#ffc72c"
              stackId="a"

            />
            <Area
              dataKey="technical"
              type="natural"
              fill="#4e4637"
              fillOpacity={1.0}
              stroke="#4e4637"
              stackId="a"
            />
            <Area
              dataKey="prodev"
              type="natural"
              fill="#E87722"
              fillOpacity={1.0}
              stroke="#E87722"
              stackId="a"
            />
            <Area
              dataKey="social"
              type="natural"
              fill="#0c54d4"
              fillOpacity={1.0}
              stroke="#0c54d4"
              stackId="a"
            />
            <Area
              dataKey="service"
              type="natural"
              fill="var(--ieee-light-grey)"
              fillOpacity={1.0}
              stroke="var(--ieee-light-grey)"
              stackId="a"
            />
            <Area
              dataKey="project"
              type="natural"
              fill="#00B5E2"
              fillOpacity={1.0}
              stroke="#00B5E2"
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
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
