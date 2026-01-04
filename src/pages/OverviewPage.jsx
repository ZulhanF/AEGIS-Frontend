import React from "react";
import { motion } from "framer-motion";
import HeaderText from "@/components/HeaderText";
import { useOverview } from "@/hooks/useOverview";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OverviewStats from "@/components/overview/OverviewStats";
import OverviewCharts from "@/components/overview/OverviewCharts";
import OverviewRecentTickets from "@/components/overview/OverviewRecentTickets";

function OverviewPage() {
  const { overview, isLoading, error, refetch } = useOverview();

  if (error) {
    return (
      <div className="flex-1 w-full p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
              <p className="text-destructive font-medium">
                Failed to load overview data
              </p>
              <p className="text-muted-foreground text-sm">{error}</p>
              <Button onClick={refetch} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      className="flex-1 w-full p-6 overflow-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <HeaderText
            title="Overview"
            subtitle="Track and analyze your machines data"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <OverviewStats overview={overview} isLoading={isLoading} />

        {/* Charts */}
        <OverviewCharts overview={overview} isLoading={isLoading} />

        {/* Recent Tickets */}
        <OverviewRecentTickets
          tickets={overview?.recent?.tickets}
          isLoading={isLoading}
        />
      </div>
    </motion.div>
  );
}

export default OverviewPage;
