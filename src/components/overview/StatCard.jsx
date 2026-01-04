import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend,
  trendValue,
  variant = "default",
  className,
  isLoading = false,
}) {
  const variants = {
    default: "bg-card border-border",
    success: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800",
    warning: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800",
    danger: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800",
  };

  const iconVariants = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400",
    warning: "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400",
    danger: "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400",
    info: "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400",
  };

  const valueVariants = {
    default: "text-foreground",
    success: "text-green-700 dark:text-green-300",
    warning: "text-yellow-700 dark:text-yellow-300",
    danger: "text-red-700 dark:text-red-300",
    info: "text-blue-700 dark:text-blue-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl border p-6 shadow-sm transition-all hover:shadow-md",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded bg-muted" />
          ) : (
            <p className={cn("text-3xl font-bold", valueVariants[variant])}>
              {value}
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-muted-foreground"
            )}>
              {trend === "up" && "↑"}
              {trend === "down" && "↓"}
              {trendValue}
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn(
            "rounded-lg p-3",
            iconVariants[variant]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default StatCard;
