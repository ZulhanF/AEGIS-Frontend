import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell, Pie, PieChart, Legend } from "recharts";

// Chart colors
const COLORS = {
  open: "#3b82f6",
  inProgress: "#f59e0b",
  resolved: "#22c55e",
  low: "#22c55e",
  medium: "#eab308",
  high: "#ef4444",
};

const ticketStatusChartConfig = {
  open: { label: "Open", color: COLORS.open },
  inProgress: { label: "In Progress", color: COLORS.inProgress },
  resolved: { label: "Resolved", color: COLORS.resolved },
};

const ticketPriorityChartConfig = {
  low: { label: "Low", color: COLORS.low },
  medium: { label: "Medium", color: COLORS.medium },
  high: { label: "High", color: COLORS.high },
};

function OverviewCharts({ overview, isLoading }) {
  const totalTickets = overview?.tickets?.total || 0;

  const ticketStatusChartData = useMemo(
    () => [
      { name: "Open", value: overview?.tickets?.status?.open || 0, fill: COLORS.open },
      { name: "In Progress", value: overview?.tickets?.status?.inProgress || 0, fill: COLORS.inProgress },
      { name: "Resolved", value: overview?.tickets?.status?.resolved || 0, fill: COLORS.resolved },
    ],
    [overview]
  );

  const ticketPriorityChartData = useMemo(
    () => [
      { name: "Low", value: overview?.tickets?.priority?.low || 0, fill: COLORS.low },
      { name: "Medium", value: overview?.tickets?.priority?.medium || 0, fill: COLORS.medium },
      { name: "High", value: overview?.tickets?.priority?.high || 0, fill: COLORS.high },
    ],
    [overview]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Ticket by Status - Pie Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tickets by Status</CardTitle>
            <CardDescription>Distribution of ticket statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[280px] flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">
                  Loading chart...
                </div>
              </div>
            ) : totalTickets === 0 ? (
              <div className="h-[280px] flex items-center justify-center">
                <p className="text-muted-foreground">No tickets data available</p>
              </div>
            ) : (
              <ChartContainer
                config={ticketStatusChartConfig}
                className="h-[280px] w-full"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
                  <Pie
                    data={ticketStatusChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={3}
                    strokeWidth={2}
                    stroke="hsl(var(--background))"
                  >
                    {ticketStatusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    iconSize={10}
                    formatter={(value, entry) => (
                      <span className="text-foreground text-sm ml-1">
                        {value} ({entry.payload.value})
                      </span>
                    )}
                  />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Ticket by Priority - Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tickets by Priority</CardTitle>
            <CardDescription>Distribution of ticket priorities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[280px] flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">
                  Loading chart...
                </div>
              </div>
            ) : totalTickets === 0 ? (
              <div className="h-[280px] flex items-center justify-center">
                <p className="text-muted-foreground">No tickets data available</p>
              </div>
            ) : (
              <ChartContainer
                config={ticketPriorityChartConfig}
                className="h-[280px] w-full"
              >
                <BarChart
                  data={ticketPriorityChartData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={70}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "hsl(var(--foreground))",
                      fontSize: 13,
                      fontWeight: 500,
                    }}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={32}>
                    {ticketPriorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default OverviewCharts;
