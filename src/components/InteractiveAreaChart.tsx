"use client";

import React, { useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Receipt } from "lucide-react";

interface TransactionItem {
  _id?: string;
  type: "in" | "out";
  amount: number;
  transactionDate: string | Date;
  [key: string]: any;
}

interface InteractiveAreaChartProps {
  transactions?: TransactionItem[];
}

const chartConfig = {
  incoming: {
    label: "Incoming Revenue",
    color: "#10b981", 
  },
  outgoing: {
    label: "Outgoing Expenses",
    color: "#FF7A3C", 
  },
} satisfies ChartConfig;

export default function InteractiveAreaChart({ transactions = [] }: InteractiveAreaChartProps) {
  const [timeRange, setTimeRange] = useState("30d");

  const aggregatedData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const dateMap: Record<string, { date: string; incoming: number; outgoing: number; timestamp: number }> = {};

    transactions.forEach((tx) => {
      const dateObj = new Date(tx.transactionDate);
      if (isNaN(dateObj.getTime())) return;

      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      const dateKey = `${year}-${month}-${day}`;
      
      const timestamp = new Date(year, dateObj.getMonth(), dateObj.getDate()).getTime();

      if (!dateMap[dateKey]) {
        dateMap[dateKey] = { date: dateKey, incoming: 0, outgoing: 0, timestamp };
      }

      if (tx.type === "in") {
        dateMap[dateKey].incoming += Number(tx.amount) || 0;
      } else if (tx.type === "out") {
        dateMap[dateKey].outgoing += Number(tx.amount) || 0;
      }
    });

    const sortedData = Object.values(dateMap).sort((a, b) => a.timestamp - b.timestamp);

    if (sortedData.length === 1) {
      const singleItem = sortedData[0];
      const prevDate = new Date(singleItem.timestamp);
      prevDate.setDate(prevDate.getDate() - 1);
      
      const pYear = prevDate.getFullYear();
      const pMonth = String(prevDate.getMonth() + 1).padStart(2, "0");
      const pDay = String(prevDate.getDate()).padStart(2, "0");
      const prevDateKey = `${pYear}-${pMonth}-${pDay}`;

      return [
        { date: prevDateKey, incoming: 0, outgoing: 0, timestamp: prevDate.getTime() },
        singleItem,
      ];
    }

    return sortedData;
  }, [transactions]);

  const filteredData = useMemo(() => {
    if (aggregatedData.length === 0) return [];

    const latestTimestamp = Math.max(...aggregatedData.map(d => d.timestamp));
    const referenceDate = new Date(latestTimestamp);

    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return aggregatedData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate;
    });
  }, [aggregatedData, timeRange]);

  return (
    <Card className="bg-card border-border shadow-xs rounded-2xl overflow-hidden pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-border py-5 px-6 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-base font-bold tracking-tight text-foreground">
            Cash Flow Trends — Area Analytics
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Showing dynamic incoming revenue vs. outgoing expenses over time
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-xl bg-card border-border text-xs cursor-pointer hidden sm:flex"
            aria-label="Select a time range"
          >
            <SelectValue placeholder="Last 30 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl bg-card text-card-foreground border border-border shadow-md">
            <SelectItem value="90d" className="rounded-lg text-xs cursor-pointer">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg text-xs cursor-pointer">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg text-xs cursor-pointer">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {transactions.length === 0 ? (
          <div className="h-[280px] w-full flex flex-col items-center justify-center text-center space-y-2 text-muted-foreground">
            <Receipt className="w-8 h-8 opacity-40 mb-1" />
            <p className="text-sm font-semibold text-foreground">No transaction trends found</p>
            <p className="text-xs">Record incoming or outgoing ledger entries to visualize trends.</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] sm:h-[320px] w-full"
          >
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="fillIncoming" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-incoming)"
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-incoming)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
                <linearGradient id="fillOutgoing" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-outgoing)"
                    stopOpacity={0.7}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-outgoing)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.15} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                minTickGap={32}
                className="text-[11px] fill-muted-foreground"
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value >= 1000 ? `${value / 1000}k` : value}`}
                className="text-[11px] fill-muted-foreground"
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                    formatter={(value) => `PKR ${Number(value).toLocaleString()}`}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="outgoing"
                type="natural"
                fill="url(#fillOutgoing)"
                stroke="var(--color-outgoing)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="incoming"
                type="natural"
                fill="url(#fillIncoming)"
                stroke="var(--color-incoming)"
                strokeWidth={2}
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}