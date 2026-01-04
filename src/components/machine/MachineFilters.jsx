import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, X, Search } from "lucide-react";

export function MachineFilters({ filters, onFiltersChange, onExport, totalResults }) {
  const handleSearchChange = (value) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleClearFilters = () => {
    onFiltersChange({ search: "" });
  };

  const activeFiltersCount = filters.search ? 1 : 0;

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by machine name or product ID..."
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
        <div className="flex flex-wrap gap-2 items-center">
          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <Button
              onClick={handleClearFilters}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Clear filter
            </Button>
          )}

          {/* Results Count */}
          {totalResults !== undefined && (
            <div className="text-sm text-muted-foreground ml-auto">
              Found <span className="font-semibold">{totalResults}</span>{" "}
              {totalResults === 1 ? "machine" : "machines"}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
