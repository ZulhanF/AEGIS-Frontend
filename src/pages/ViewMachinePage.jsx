import React, { useState } from "react";
import MachineCard from "@/components/machine/MachineCard";
import MachineDetailDialog from "@/components/machine/MachineDetailDialog";
import HeaderText from "@/components/HeaderText";
import { MachineFilters } from "@/components/machine/MachineFilters";
import { filterStorage } from "@/utils/storage";
import { exportMachinesToCSV } from "@/utils/export";
import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { motion } from "framer-motion";
import { machineContainerVariants, emptyStateVariants } from "@/components/MotionVariant";
import { toast } from "sonner";

function ViewMachinePage({ machines = [], onDeleteMachine, onEditMachine, onFetchMachineStatus }) {
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const [filters, setFilters] = React.useState(() => 
    filterStorage.loadMachineFilters()
  );

  React.useEffect(() => {
    filterStorage.saveMachineFilters(filters);
  }, [filters]);

  const filteredMachines = React.useMemo(() => {
    if (!machines) return [];

    return machines.filter((machine) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchSearch =
          machine.name?.toLowerCase().includes(searchLower) ||
          machine.productId?.toLowerCase().includes(searchLower) ||
          machine.id?.toString().includes(searchLower);

        if (!matchSearch) return false;
      }

      return true;
    });
  }, [machines, filters]);

  const handleCardClick = (machine) => {
    setSelectedMachine(machine);
    setDetailDialogOpen(true);
  };

  const handleDeleteMachine = async (machineId) => {
    if (onDeleteMachine) {
      toast.promise(onDeleteMachine(machineId), {
        loading: "Deleting machine...",
        success: "Machine deleted successfully! 🗑️",
        error: (err) => {
          return err?.message || "Failed to delete machine";
        },
      });
      setDetailDialogOpen(false);
    }
  };

  const handleEditMachine = async (machineId, machineData) => {
    if (onEditMachine) {
      toast.promise(onEditMachine(machineId, machineData), {
        loading: "Updating machine...",
        success: "Machine updated successfully! ✏️",
        error: (err) => {
          return err?.message || "Failed to edit machine";
        },
      });
      setDetailDialogOpen(false);
    }
  };

  const handleExport = () => {
    exportMachinesToCSV(filteredMachines);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full p-6"
    >
      <div className="container mx-auto space-y-6 max-w-5xl">
        <HeaderText
          title="Machines"
          subtitle="View and manage all your machines"
        />

        {/* Filters */}
        <MachineFilters
          filters={filters}
          onFiltersChange={setFilters}
          onExport={handleExport}
          totalResults={filteredMachines.length}
        />

        {/* Machine Cards Grid */}
        {filteredMachines.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={machineContainerVariants}
            initial="hidden"
            animate="visible"
            key={filters.search} // Re-trigger animation when search changes
          >
            {filteredMachines.map((machine) => (
              <MachineCard 
                key={machine.id} 
                machine={machine}
                onCardClick={handleCardClick}
              />
            ))}
          </motion.div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <motion.div 
                className="flex flex-col items-center justify-center text-center"
                variants={emptyStateVariants}
                initial="hidden"
                animate="visible"
              >
                <Settings className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No machines found</h3>
                <p className="text-muted-foreground text-sm max-w-md">
                  {machines.length === 0
                    ? "No machines have been added yet. Create your first machine to get started."
                    : "No machines match your current filters. Try adjusting your search criteria."}
                </p>
              </motion.div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Machine Detail Dialog */}
      <MachineDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        machine={selectedMachine}
        onDelete={handleDeleteMachine}
        onEdit={handleEditMachine}
        onFetchStatus={onFetchMachineStatus}
      />
    </motion.div>
  );
}

export default ViewMachinePage;
