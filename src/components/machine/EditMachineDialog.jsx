import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

function EditMachineDialog({
  open,
  onOpenChange,
  machine,
  onConfirm,
  onOpenChangeParent,
}) {
  const [formData, setFormData] = useState({
    name: "",
    productId: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (machine && open) {
      setFormData({
        name: machine.name || "",
        productId: machine.productId || "",
      });
    }
  }, [machine, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.productId.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(machine.id, formData);
      onOpenChange(false);
      onOpenChangeParent(false);
    } catch (error) {
      console.error("Error editing machine:", error);
      alert(error.message || "Failed to edit machine");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Machine</DialogTitle>
          <DialogDescription>
            Update the machine information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Product ID</Label>
            <Input
              id="productId"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              placeholder="e.g., MACHINE-001"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Machine Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Assembly Line A"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditMachineDialog;
