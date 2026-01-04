import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, X, Search } from "lucide-react";

export function UserFilters({ filters, onFiltersChange, onExport, totalResults }) {
  const handleSearchChange = (value) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleRoleChange = (value) => {
    onFiltersChange({ ...filters, role: value });
  };

  const handleVerifiedChange = (value) => {
    onFiltersChange({ ...filters, verified: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({
      search: "",
      role: "all",
      verified: "all",
    });
  };

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.role !== "all" ? 1 : 0) +
    (filters.verified !== "all" ? 1 : 0);

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, username, or email..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>
          {onExport && (
            <Button onClick={onExport} variant="outline" size="icon" data-export-button>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap gap-2">
          {/* Role Filter */}
          <Select value={filters.role} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="ENGINEER">Engineer</SelectItem>
            </SelectContent>
          </Select>

          {/* Verified Filter */}
          <Select value={filters.verified} onValueChange={handleVerifiedChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
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
              Clear {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}
            </Button>
          )}
        </div>

        {/* Results Count */}
        {totalResults !== undefined && (
          <div className="text-sm text-muted-foreground">
            Found <span className="font-semibold">{totalResults}</span>{" "}
            {totalResults === 1 ? "user" : "users"}
          </div>
        )}
      </div>
    </Card>
  );
}
