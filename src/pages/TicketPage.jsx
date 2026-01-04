import React from "react";
import { motion } from "framer-motion";
import DataTableDemo from "@/components/ticket/TicketTable";
import { TicketDetailDialog } from "@/components/ticket/TicketDetail";
import HeaderText from "@/components/HeaderText";
import { TicketFilters } from "@/components/ticket/TicketFilters";
import { filterStorage } from "@/utils/storage";
import { exportTicketsToCSV } from "@/utils/export";
import { Card, CardContent } from "@/components/ui/card";
import { FileX } from "lucide-react";

function TicketPage({ tickets, loading, onDeleteTicket, machines = [], onEditTicket }) {
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [selectedTicket, setSelectedTicket] = React.useState(null);
  
  const [filters, setFilters] = React.useState(() => 
    filterStorage.loadTicketFilters()
  );

  React.useEffect(() => {
    filterStorage.saveTicketFilters(filters);
  }, [filters]);

  const filteredTickets = React.useMemo(() => {
    if (!tickets) return [];

    return tickets.filter((ticket) => {
      // Search filter (problem, machine ID, ticket ID)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchSearch =
          ticket.problem?.toLowerCase().includes(searchLower) ||
          ticket.problemDetail?.toLowerCase().includes(searchLower) ||
          ticket.productId?.toLowerCase().includes(searchLower) ||
          ticket.machine?.productId?.toLowerCase().includes(searchLower) ||
          ticket.id?.toString().includes(searchLower);

        if (!matchSearch) return false;
      }

      // Status filter
      if (filters.status !== "all" && ticket.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== "all" && ticket.priority !== filters.priority) {
        return false;
      }

      return true;
    });
  }, [tickets, filters]);

  const handleViewDetails = (ticket) => {
    setSelectedTicket(ticket);
    setDetailOpen(true);
  };

  const handleExport = () => {
    exportTicketsToCSV(filteredTickets);
  };

  return (
    <motion.div
      className="flex-1 w-full p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-5xl mx-auto">
        <HeaderText
          title="View Tickets"
          subtitle="Manage and track your maintenance requests"
        />

        {/* Filters */}
        <TicketFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
          totalResults={filteredTickets.length}
        />

        {loading ? (
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center">
                <p className="text-muted-foreground">Loading tickets...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex flex-col items-center justify-center text-center">
                <FileX className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  {tickets.length === 0
                    ? "No tickets have been created yet. Create your first ticket to get started."
                    : "No tickets match your current filters. Try adjusting your search criteria."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <DataTableDemo
            tickets={filteredTickets}
            onViewDetails={handleViewDetails}
            onDeleteTicket={onDeleteTicket}
            machines={machines}
            onEditTicket={onEditTicket}
          />
        )}

        {/* Ticket Detail Modal */}
        <TicketDetailDialog
          ticket={selectedTicket}
          open={detailOpen}
          onOpenChange={setDetailOpen}
        />
      </div>
    </motion.div>
  );
}

export default TicketPage;
