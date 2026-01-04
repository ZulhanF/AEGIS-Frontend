import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

function UpdateStatusDialog({
  open,
  onOpenChange,
  ticket,
  onConfirm,
}) {
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (ticket) {
      setSelectedStatus(ticket.status);
    }
  }, [ticket]);

  const handleConfirm = () => {
    if (selectedStatus && ticket) {
      onConfirm(ticket.id, selectedStatus);
      onOpenChange(false);
    }
  };

  const statusOptions = [
    { value: "OPEN", label: "Open" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
  ];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Update Ticket Status</AlertDialogTitle>
          <AlertDialogDescription>
            Change the status for ticket ID: {ticket?.id}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Label htmlFor="status" className="mb-2 block">
            New Status
          </Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default UpdateStatusDialog;
