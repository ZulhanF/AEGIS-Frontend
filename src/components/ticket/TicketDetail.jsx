import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { StatusBadge, PriorityBadge } from "@/components/ticket/StatusBadge";

export function TicketDetailDialog({ ticket, open, onOpenChange }) {
  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Ticket Detail - {ticket.id}
          </DialogTitle>
          <div className="flex gap-2 mt-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
          <DialogDescription>
            Ticket details and information
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="font-semibold">Problem</Label>
            <p className="text-sm">{ticket.problem || "N/A"}</p>
          </div>
          
          <div className="grid gap-2">
            <Label className="font-semibold">Description</Label>
            <p className="text-sm">{ticket.problemDetail || "N/A"}</p>
          </div>

          <div className="grid gap-2">
            <Label className="font-semibold">Machine ID</Label>
            <p className="text-sm font-mono">{ticket.machine?.productId}</p>
          </div>

          <div className="grid gap-2">
            <Label className="font-semibold">Created At</Label>
            <p className="text-sm">{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            }) : "N/A"}</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
