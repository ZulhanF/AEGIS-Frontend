import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";


export function MachineStatusChart({ statusHistory = [], isLoading = false }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!statusHistory || statusHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status History</CardTitle>
          <CardDescription>No status history available</CardDescription>
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center text-muted-foreground">
          <p>No data to display</p>
        </CardContent>
      </Card>
    );
  }

  // Format data untuk chart
  const chartData = statusHistory
    .map((status) => {
      const dateString = status.recordedAt || status.createdAt;
      const date = new Date(dateString);
      const timestamp = isNaN(date.getTime()) 
        ? "Invalid Date" 
        : date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
      
      return {
        timestamp,
        airTemp: parseFloat(status.airTemperature) || 0,
        processTemp: parseFloat(status.processTemperature) || 0,
        rotationalSpeed: parseFloat(status.rotationalSpeed) || 0,
        torque: parseFloat(status.torque) || 0,
        toolWear: parseFloat(status.toolWear) || 0,
      };
    })
    .reverse(); // Reverse to show oldest first

  // Calculate trend for latest vs previous
  const getTrend = (key) => {
    if (chartData.length < 2) return null;
    const latest = chartData[chartData.length - 1][key];
    const previous = chartData[chartData.length - 2][key];
    
    // Handle division by zero
    if (previous === 0) {
      if (latest === 0) {
        return { icon: Minus, text: "Stable", color: "text-gray-500" };
      }
      return { icon: TrendingUp, text: "New", color: "text-blue-500" };
    }
    
    const diff = ((latest - previous) / previous) * 100;

    if (Math.abs(diff) < 1) return { icon: Minus, text: "Stable", color: "text-gray-500" };
    if (diff > 0) return { icon: TrendingUp, text: `+${diff.toFixed(1)}%`, color: "text-red-500" };
    return { icon: TrendingDown, text: `${diff.toFixed(1)}%`, color: "text-green-500" };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const airTempTrend = getTrend('airTemp');
  const processTempTrend = getTrend('processTemp');
  const speedTrend = getTrend('rotationalSpeed');
  const torqueTrend = getTrend('torque');
  const toolWearTrend = getTrend('toolWear');

  return (
    <div className="space-y-4">
      {/* Temperature Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Temperature Monitoring</CardTitle>
          <CardDescription className="flex items-center gap-4">
            <span>Air and Process Temperature over time</span>
            {airTempTrend && (
              <span className={`flex items-center gap-1 text-xs ${airTempTrend.color}`}>
                <airTempTrend.icon className="w-3 h-3" />
                Air: {airTempTrend.text}
              </span>
            )}
            {processTempTrend && (
              <span className={`flex items-center gap-1 text-xs ${processTempTrend.color}`}>
                <processTempTrend.icon className="w-3 h-3" />
                Process: {processTempTrend.text}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorAirTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProcessTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                className="text-xs"
                tick={{ fontSize: 11 }}
              />
              <YAxis className="text-xs" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area
                type="monotone"
                dataKey="airTemp"
                name="Air Temp (K)"
                stroke="#3b82f6"
                fill="url(#colorAirTemp)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="processTemp"
                name="Process Temp (K)"
                stroke="#ef4444"
                fill="url(#colorProcessTemp)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Speed and Torque Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Speed & Torque</CardTitle>
          <CardDescription className="flex items-center gap-4">
            <span>Rotational speed and torque measurements</span>
            {speedTrend && (
              <span className={`flex items-center gap-1 text-xs ${speedTrend.color}`}>
                <speedTrend.icon className="w-3 h-3" />
                Speed: {speedTrend.text}
              </span>
            )}
            {torqueTrend && (
              <span className={`flex items-center gap-1 text-xs ${torqueTrend.color}`}>
                <torqueTrend.icon className="w-3 h-3" />
                Torque: {torqueTrend.text}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                className="text-xs"
                tick={{ fontSize: 11 }}
              />
              <YAxis className="text-xs" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Line
                type="monotone"
                dataKey="rotationalSpeed"
                name="Speed (rpm)"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="torque"
                name="Torque (Nm)"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tool Wear Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tool Wear</CardTitle>
          <CardDescription className="flex items-center gap-4">
            <span>Tool wear progression over time</span>
            {toolWearTrend && (
              <span className={`flex items-center gap-1 text-xs ${toolWearTrend.color}`}>
                <toolWearTrend.icon className="w-3 h-3" />
                {toolWearTrend.text}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorToolWear" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="timestamp"
                className="text-xs"
                tick={{ fontSize: 11 }}
              />
              <YAxis className="text-xs" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Area
                type="monotone"
                dataKey="toolWear"
                name="Tool Wear (min)"
                stroke="#8b5cf6"
                fill="url(#colorToolWear)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
