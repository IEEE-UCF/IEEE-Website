"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { useState, useEffect } from "react";

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

interface EventData {
  _id: string; 
  committee: string;
  title: string;
  time: Date;
  address: string;
  description?: string;
  flyer?: string;
  rsvp?: string;
  photos?: {
    type?: string;
    [key: string]: unknown; 
  };
}

export function Linechart() {
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
        month: keyof typeof monthOrder;
        general: number;
        technical: number;
        prodev: number;
        social: number;
        service: number;
        project: number;

    }

    const [chartData, setChartData] = useState<ChartData[]>([]);

    useEffect(() => {
        fetchChartData();
    
    }, []);

    const fetchChartData = async () => {
        const res = await fetch("/api/events", {method: "GET"});
        const events = await res.json();

        const eventData: { 
            [key: string]: 
            {
                general: number;
                technical: number;
                prodev: number;
                social: number;
                service: number; 
                project: number;
            }
        } = {};
        
        events.data.forEach((event: EventData) => {
            const eventDate = new Date(event.time);
            const month = eventDate.toLocaleString("default", { month: "long" }); 

            if(!eventData[month]) {
                eventData[month] = {
                    general: 0,
                    technical: 0,
                    prodev: 0,
                    social: 0,
                    service: 0,
                    project: 0
                };
            }

            switch(event.committee) {
                case "General":
                    eventData[month].general+=1;
                    break;

                case "Workshop":
                    eventData[month].technical+=1;
                    break;

                case "Professional Development":
                    eventData[month].prodev+=1;
                    break;

                case "Social":
                    eventData[month].social+=1;
                    break;

                case "Service":
                    eventData[month].service+=1;
                    break;

                case "Project":
                    eventData[month].project+=1;
                    break;

            }

        });

        const eventDataArray: ChartData[] = Object.keys(eventData).map((month) => ({
            month: month as keyof typeof monthOrder,
            general: eventData[month].general,
            technical: eventData[month].technical,
            prodev: eventData[month].prodev,
            social: eventData[month].social,
            service: eventData[month].service,
            project: eventData[month].project,
        }));

        setChartData(
            eventDataArray.sort(
                (a, b) => monthOrder[a.month] - monthOrder[b.month]
            )
        );
    }

  return (
    
      <div className="flex flex-col p-20 text-white w-1/2 items-center align-middle justify-center">
            <div className="font-[body-font] text-white text-lg">QUANTITY AND TYPE OF EVENTS (2024-2025)</div>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
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
              cursor={true}
              content={<ChartTooltipContent indicator="dot" className="opacity-83" />}
              wrapperStyle={{ top: -100, left: -100}} // shifts the tooltip 40px to the right 
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
          </AreaChart>
        </ChartContainer>
      </div>
  )
}
