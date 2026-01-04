import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { StatusBadge, PriorityBadge } from "@/components/ticket/StatusBadge";
import { Badge } from "@/components/ui/badge";

// Funsi untuk sorting kolom yg dikirim
const handleSort = (column) => {
  const currentSort = column.getIsSorted();
  column.toggleSorting(currentSort ? currentSort === "asc" : true);
};

const CreateColumns = (handleDeleteClick, handleViewDetails, handleEditClick, handleUpdateStatusClick) => [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => handleSort(column)}>
          Ticket ID <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "machineId",
    header: "Machine ID",
    cell: ({ row }) => <div>{row.original.machine?.productId}</div>,
    filterFn: (row, value) => {
      return row.original.machine?.productId?.toLowerCase().includes(value.toLowerCase());
    },
  },
  {
    accessorKey: "priority",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => handleSort(column)}>
          Priority <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue("priority");
      return <PriorityBadge priority={priority} />;
    },
    sortingFn: (rowA, rowB) => {
      const priorityOrder = {
        HIGH: 3,
        MEDIUM: 2,
        LOW: 1,
      };
      const priorityA = priorityOrder[rowA.getValue("priority")] || 0;
      const priorityB = priorityOrder[rowB.getValue("priority")] || 0;
      return priorityA - priorityB;
    },
  },
  {
    accessorKey: "status",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => handleSort(column)}>
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <StatusBadge status={status} />;
    },
    sortingFn: (rowA, rowB) => {
      const statusOrder = {
        OPEN: 3,
        IN_PROGRESS: 2,
        RESOLVED: 1,
      };
      const statusA = statusOrder[rowA.getValue("status")] || 0;
      const statusB = statusOrder[rowB.getValue("status")] || 0;
      return statusA - statusB;
    },
  },
  {
    accessorKey: "problem",
    header: "Problem",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">{row.getValue("problem")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    enableSorting: true,
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => handleSort(column)}>
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("createdAt");
      const formatted = date
        ? new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";
      return <div>{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const ticket = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(ticket.id);
                toast.success("Ticket ID copied to clipboard!", {
                  duration: 3000,
                });
              }}
            >
              Copy ticket ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewDetails(ticket)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleUpdateStatusClick(ticket)}>
              Update status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditClick(ticket.id)}>Edit ticket</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600"
              onClick={() => handleDeleteClick(ticket.id)}
            >
              Delete ticket
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default CreateColumns;
