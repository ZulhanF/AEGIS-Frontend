import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  AlertTriangle,
  HeartPulse,
  TrendingUp,
  Activity,
  Clock,
} from "lucide-react";

function AIAnalysisDialog({ open, onOpenChange, analysis, machineName }) {
  if (!analysis) return null;

  const healthScore = analysis.healthScore ?? 0;
  const riskProbability = analysis.riskProbability ?? 0;

  const getStatusColor = (status) => {
    switch (status) {
      case "CRITICAL":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800";
      case "WARNING":
        return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800";
      case "NORMAL":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700";
    }
  };

  const getHealthColor = (score) => {
    if (score <= 35) return "bg-red-500";
    if (score <= 60) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getRiskColor = (risk) => {
    if (risk >= 60) return "bg-red-500";
    if (risk >= 35) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Analysis Report
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis and recommendations for {machineName || "this machine"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Anomaly Alert */}
          {analysis.isAnomaly && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
              <div>
                <p className="font-semibold text-red-700 dark:text-red-300">
                  Anomaly Detected
                </p>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Immediate attention required for this machine
                </p>
              </div>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" />
                <p className="text-xs text-muted-foreground font-medium">
                  Status
                </p>
              </div>
              <Badge className={`${getStatusColor(analysis.status)} border`}>
                {analysis.status}
              </Badge>
            </div>

            {/* Health Score */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <HeartPulse className="w-4 h-4 text-pink-500" />
                <p className="text-xs text-muted-foreground font-medium">
                  Health Score
                </p>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold">{healthScore}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <Progress
                value={healthScore}
                className="h-2"
                indicatorClassName={getHealthColor(healthScore)}
              />
            </div>

            {/* Risk Probability */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <p className="text-xs text-muted-foreground font-medium">
                  Failure Risk
                </p>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-2xl font-bold">
                  {riskProbability.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">%</span>
              </div>
              <Progress
                value={riskProbability}
                className="h-2"
                indicatorClassName={getRiskColor(riskProbability)}
              />
            </div>

            {/* Diagnosis */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-blue-500" />
                <p className="text-xs text-muted-foreground font-medium">
                  Diagnosis
                </p>
              </div>
              <p className="text-lg font-semibold">
                {analysis.diagnosis || "N/A"}
              </p>
            </div>
          </div>

          {/* AI Recommendation */}
          {analysis.llmResponse && (
            <div className="p-5 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-purple-500" />
                <p className="text-base font-semibold">AI Recommendation</p>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <div className="text-sm whitespace-pre-wrap leading-relaxed text-foreground">
                  {analysis.llmResponse}
                </div>
              </div>
            </div>
          )}

          {/* Analysis Timestamp */}
          {analysis.createdAt && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>
                Analysis generated on{" "}
                {new Date(analysis.createdAt).toLocaleString("id-ID", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AIAnalysisDialog;
