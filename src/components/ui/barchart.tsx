import { Bar, BarChart } from "recharts"
 
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"

import { CartesianGrid, XAxis } from "recharts"

import { ChartTooltip } from "@/components/ui/chart"

import { type ChartConfig } from "@/components/ui/chart"

import { useState, useEffect } from "react"

const chartConfig = {
  technical: {
    label: "Technical",
    color: "#FFD100",
  },
  interpersonal: {
    label: "Interpersonal",
    color: "#75787B",
  },
} satisfies ChartConfig

export function Barchart() {

    interface ChartData {
        month: keyof typeof monthOrder;
        technical: number;
        interpersonal: number;

    }

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

    const [chartData, setChartData] = useState<ChartData[]>([]);
    
    useEffect( () => {
        fetchChartData();

    }, []);

    const fetchChartData = async () => {
        const res = await fetch("/api/events", { method: "GET" });
        const events = await res.json();
      
        const groupedData: { [key: string]: { technical: number; interpersonal: number } } = {};
      
        events.data.forEach((event: any) => {
          const eventDate = new Date(event.time);
          const month = eventDate.toLocaleString("default", { month: "long" }); 
      
          if (!groupedData[month]) {
            groupedData[month] = { technical: 0, interpersonal: 0 };
          }
      
          if (event.type === "Technical") {
            groupedData[month].technical += 1;
          } else if (event.type === "Interpersonal") {
            groupedData[month].interpersonal += 1;
          }
        });
      
        const transformedData: ChartData[] = Object.keys(groupedData).map((month) => ({
          month: month as keyof typeof monthOrder,
          technical: groupedData[month].technical,
          interpersonal: groupedData[month].interpersonal,
        }));
        
        transformedData.sort((a, b) => {
            return monthOrder[a.month] - monthOrder[b.month];

        });

        setChartData(transformedData);
    };

    return (
        <div className="flex flex-col p-20 text-white w-1/2 items-center align-middle justify-center">
            <div className="font-[body-font] text-white text-lg">QUANTITY AND TYPE OF EVENTS (2024-2025)</div>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="technical" fill="var(--color-technical)" radius={4} />
                    <Bar dataKey="interpersonal" fill="var(--color-interpersonal)" radius={4} />
                </BarChart>
            </ChartContainer>

        </div>

    );
};