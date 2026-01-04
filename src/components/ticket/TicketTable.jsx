import * as React from "react";
import { motion } from "framer-motion";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import ConfirmDialog from "../ConfirmDialog";
import CreateColumns from "./ColumnTicketTable";
import EditTicket from "./EditTicket";
import UpdateStatusDialog from "./UpdateStatusDialog";

function DataTableDemo({
  tickets = [],
  machines = [],
  onViewDetails,
  onDeleteTicket,
  onEditTicket,
}) {
  const data = React.useMemo(() => tickets || [], [tickets]);
  const [sorting, setSorting] = React.useState([{ id: "id", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [updateStatusDialogOpen, setUpdateStatusDialogOpen] = React.useState(false);
  const [selectedTicketId, setSelectedTicketId] = React.useState(null);
  const [selectedTicket, setSelectedTicket] = React.useState(null);

  const handleDeleteClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTicketId) {
      toast.promise(onDeleteTicket(selectedTicketId), {
        loading: "Deleting ticket...",
        success: "Ticket deleted successfully! 🗑️",
        error: (err) => {
          err.message || "Failed to delete ticket";
        },
      });

      setDeleteDialogOpen(false);
      setSelectedTicketId(null);
    }
  };

  const handleEditClick = (ticketId) => {
    setSelectedTicketId(ticketId);
    setEditDialogOpen(true);
  };

  const handleConfirmEdit = async (ticketId, updatedTicket) => {
    if (ticketId) {
      try {
        toast.promise(onEditTicket(ticketId, updatedTicket), {
          loading: "Updating ticket...",
          success: "Ticket updated successfully! ✏️",
          error: (err) => err?.message || "Failed to update ticket",
        });
        setEditDialogOpen(false);
        setSelectedTicketId(null);
      } catch (error) {
        console.error("Error updating ticket:", error);
      }
    }
  };

  const handleUpdateStatusClick = (ticket) => {
    setSelectedTicket(ticket);
    setUpdateStatusDialogOpen(true);
  };

  const handleConfirmUpdateStatus = async (ticketId, newStatus) => {
    if (ticketId && newStatus) {
      try {
        // Sesuaikan data dengan body API
        const ticketData = {
          productId: selectedTicket.machine?.productId || selectedTicket.productId,
          priority: selectedTicket.priority,
          status: newStatus,
          problem: selectedTicket.problem,
          problemDetail: selectedTicket.problemDetail,
        };
        
        toast.promise(onEditTicket(ticketId, ticketData), {
          loading: "Updating ticket status...",
          success: "Ticket status updated successfully! ✅",
          error: (err) => err?.message || "Failed to update ticket status",
        });
        setUpdateStatusDialogOpen(false);
        setSelectedTicket(null);
      } catch (error) {
        console.error("Error updating ticket status:", error);
      }
    }
  };

  const columns = CreateColumns(
    handleDeleteClick,
    onViewDetails,
    handleEditClick,
    handleUpdateStatusClick
  );

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Confirmation"
        description={`Are you sure you want to delete ticket with ID ${selectedTicketId}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <EditTicket
        ticket={tickets.find((t) => t.id === selectedTicketId)}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        machines={machines}
        onEditTicket={handleConfirmEdit}
      />
      <UpdateStatusDialog
        ticket={selectedTicket}
        open={updateStatusDialogOpen}
        onOpenChange={setUpdateStatusDialogOpen}
        onConfirm={handleConfirmUpdateStatus}
      />
      <div className="w-full">
        <div className="overflow-hidden rounded-md border text-center">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="text-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                    }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-center">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataTableDemo;
