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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, AlertCircle, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

function EditTicket({ ticket, open, onOpenChange, machines = [], onEditTicket }) {
  const PRIORITY_OPTIONS = [
    {
      value: "LOW",
      label: "Low",
      icon: Clock,
      color: "text-green-600 dark:text-green-400",
    },
    {
      value: "MEDIUM",
      label: "Medium",
      icon: AlertCircle,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    {
      value: "HIGH",
      label: "High",
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
    },
  ];

  const formSchema = z.object({
    problem: z
      .string()
      .min(1, "Problem is required")
      .min(5, "Problem must be at least 5 characters"),
    machine: z.string().min(1, "Machine ID is required"),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
      required_error: "Please select a priority level",
    }),
    problemDetail: z
      .string()
      .min(1, "Detail is required")
      .min(10, "Detail must be at least 10 characters"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problem: ticket?.problem || "",
      machine: ticket?.machine?.productId || "",
      priority: ticket?.priority || "LOW",
      problemDetail: ticket?.problemDetail || "",
    },
  });

  // Update form values ketika ticket berganti
  useEffect(() => {
    if (ticket) {
      form.reset({
        problem: ticket.problem || "",
        machine: ticket.machine?.productId || "",
        priority: ticket.priority || "LOW",
        problemDetail: ticket.problemDetail || "",
      });
    }
  }, [ticket, form]);

  // Reset form saat dialog ditutup
  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const handleEditTicket = async (data) => {
    try {
      // Format data sesuai API structure
      const ticketData = {
        productId: data.machine,
        priority: data.priority,
        problem: data.problem,
        problemDetail: data.problemDetail,
      };
      await onEditTicket(ticket.id, ticketData);
      onOpenChange(false);  
    } catch (error) {
      console.error("Error editing ticket:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleEditTicket)}>
            <DialogHeader>
              <DialogTitle>Edit Ticket</DialogTitle>
              <DialogDescription>
                Make changes to your ticket here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 my-5">
              <FormField
              control={form.control}
              name="problem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Problem <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={ticket?.problem || "N/A"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="machine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Machine <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={ticket?.machine.productId || "N/A"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {machines.map((machine) => (
                        <SelectItem
                          key={machine.productId}
                          value={machine.productId}
                        >
                          {machine.productId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Priority <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={ticket?.priority || "N/A"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PRIORITY_OPTIONS.map((priority) => {
                        const Icon = priority.icon;
                        return (
                          <SelectItem
                            key={priority.value}
                            value={priority.value}
                          >
                            <span className={`inline-flex items-center gap-2 ${priority.color}`}>
                              <Icon className="w-4 h-4" />
                              <span>{priority.label}</span>
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="problemDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Detail <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={ticket?.problemDetail || "N/A"}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default EditTicket;
