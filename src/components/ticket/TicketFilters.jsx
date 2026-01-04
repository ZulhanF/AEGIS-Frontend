import React from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, X, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

export function TicketFilters({
  filters,
  onFiltersChange,
  onExport,
  totalResults,
}) {
  const handleSearchChange = (value) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (value) => {
    onFiltersChange({ ...filters, status: value });
  };

  const handlePriorityChange = (value) => {
    onFiltersChange({ ...filters, priority: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      status: "all",
      priority: "all",
    });
  };

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.status !== "all" ? 1 : 0) +
    (filters.priority !== "all" ? 1 : 0);

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by problem, machine ID, or ticket ID..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          {onExport && (
            <Button
              onClick={onExport}
              variant="outline"
              size="icon"
              data-export-button
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-2">
          {/* Status Filter */}
          <Select value={filters.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="RESOLVED">Resolved</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Priority Filter */}
          <Select value={filters.priority} onValueChange={handlePriorityChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              onClick={handleClearFilters}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear {activeFiltersCount} filter
              {activeFiltersCount > 1 ? "s" : ""}
            </Button>
          )}
        </div>

        {/* Results Count */}
        {totalResults !== undefined && (
          <div className="text-sm text-muted-foreground">
            Found <span className="font-semibold">{totalResults}</span>{" "}
            {totalResults === 1 ? "ticket" : "tickets"}
          </div>
        )}
      </div>
    </Card>
  );
}
