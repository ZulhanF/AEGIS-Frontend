import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

// Format date helper
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get priority badge variant
const getPriorityVariant = (priority) => {
  switch (priority?.toUpperCase()) {
    case "HIGH":
      return "destructive";
    case "MEDIUM":
      return "warning";
    case "LOW":
      return "success";
    default:
      return "secondary";
  }
};

// Get status badge variant
const getStatusVariant = (status) => {
  switch (status?.toUpperCase()) {
    case "OPEN":
      return "info";
    case "IN_PROGRESS":
      return "purple";
    case "RESOLVED":
      return "success";
    default:
      return "secondary";
  }
};

function OverviewRecentTickets({ tickets, isLoading }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Tickets</CardTitle>
              <CardDescription>
                Latest maintenance tickets created
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/tickets/view")}
              className="hover:cursor-pointer"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : !tickets?.length ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent tickets
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{ticket.id}</span>
                      <Badge
                        variant={getStatusVariant(ticket.status)}
                        className="text-xs"
                      >
                        {ticket.status?.replace("_", " ")}
                      </Badge>
                      <Badge
                        variant={getPriorityVariant(ticket.priority)}
                        className="text-xs"
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {ticket.problem}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-xs ml-4">
                    <Clock className="h-3 w-3" />
                    {formatDate(ticket.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default OverviewRecentTickets;
