import React from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/overview/StatCard";
import {
  Server,
  Ticket,
  AlertTriangle,
  Users,
  Activity,
  MessageSquare,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function OverviewStats({ overview, isLoading }) {
  const healthScore = overview?.health?.avgScore || 0;
  const anomalyCount = overview?.machines?.anomaly || 0;
  const unverifiedCount = overview?.users?.unverified || 0;

  const getHealthVariant = () => {
    if (healthScore >= 80) return "success";
    if (healthScore >= 50) return "warning";
    return "danger";
  };

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Machines"
            value={overview?.machines?.total || 0}
            icon={Server}
            description={`${overview?.machines?.anomaly || 0} anomaly detected`}
            variant="info"
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Tickets"
            value={overview?.tickets?.total || 0}
            icon={Ticket}
            description={`${overview?.tickets?.active || 0} active tickets`}
            variant="default"
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Users"
            value={overview?.users?.total || 0}
            icon={Users}
            description={`${overview?.users?.admin || 0} admin, ${overview?.users?.engineer || 0} engineer`}
            variant="success"
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Health Score"
            value={`${Math.round(healthScore)}%`}
            icon={Activity}
            description={`${overview?.health?.failuresDetected || 0} failures detected`}
            variant={getHealthVariant()}
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>

      {/* Secondary Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Anomaly Machines"
            value={anomalyCount}
            icon={AlertTriangle}
            description={`${overview?.machines?.noStatus || 0} without status`}
            variant={anomalyCount > 0 ? "danger" : "success"}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Unverified Users"
            value={unverifiedCount}
            icon={Users}
            description="Pending verification"
            variant={unverifiedCount > 0 ? "warning" : "success"}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Chat Messages"
            value={overview?.messages?.total || 0}
            icon={MessageSquare}
            description="Total conversations"
            variant="info"
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default OverviewStats;
