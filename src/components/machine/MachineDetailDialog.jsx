import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trash2,
  Pencil,
  Activity,
  Gauge,
  Thermometer,
  Zap,
  Brain,
  Clock,
  Grid2X2,
  LineChart,
} from "lucide-react";
import EditMachineDialog from "./EditMachineDialog";
import AIAnalysisDialog from "./AIAnalysisDialog";
import { MachineStatusChart } from "./MachineStatusChart";
import ConfirmDialog from "../ConfirmDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getMachineStatusByMachineId } from "@/utils/api";

function MachineDetailDialog({
  open,
  onOpenChange,
  machine = [],
  onDelete,
  onEdit,
  onFetchStatus,
}) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [machineStatus, setMachineStatus] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);

  useEffect(() => {
    const fetchMachineStatus = async () => {
      if (open && machine?.id && onFetchStatus) {
        setLoadingStatus(true);
        try {
          // Fetch latest status
          const status = await onFetchStatus(machine.id);
          console.log("Fetched machine status:", status);
          setMachineStatus(status);

          // Fetch status history
          const historyResponse = await getMachineStatusByMachineId(machine.id);
          if (!historyResponse.error && historyResponse.data) {
            // If data is an array, use it; otherwise wrap in array
            const history = Array.isArray(historyResponse.data) 
              ? historyResponse.data 
              : [historyResponse.data];
            setStatusHistory(history.slice(0, 20)); // Last 20 readings
          }
        } catch (error) {
          console.error("Error fetching machine status:", error);
          setMachineStatus(null);
          setStatusHistory([]);
        } finally {
          setLoadingStatus(false);
        }
      }
    };

    fetchMachineStatus();
  }, [open, machine?.id, onFetchStatus]);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (machineId, productId) => {
    setDeleteDialogOpen(true);
    setSelectedMachineId(machineId);
    setSelectedProductId(productId);
  };

  const handleConfirmDelete = async () => {
    if (selectedMachineId) {
      await onDelete(selectedMachineId);
      setDeleteDialogOpen(false);
      setSelectedMachineId(null);
    }
  };
  return (
    <>
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Confirmation"
        description={`Are you sure you want to delete machine with ID ${selectedProductId}? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        confirmText="Delete"
        cancelText="Cancel"
      />
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar">
          <DialogHeader>
            <DialogTitle>Machine Details</DialogTitle>
            <DialogDescription>
              View and manage machine information and status
            </DialogDescription>
          </DialogHeader>

          {machine && (
            <div className="space-y-6">
              {/* Machine Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Product ID
                    </p>
                    <p className="text-lg font-semibold">{machine.productId}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Machine Name
                    </p>
                    <p className="text-base font-medium">{machine.name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Badge className="bg-green-50 text-green-700 border border-green-200">
                      Active
                    </Badge>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Machine ID
                    </p>
                    <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                      {machine.id}
                    </p>
                  </div>
                </div>

                {machine.description && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">
                      Description
                    </p>
                    <p className="text-sm">{machine.description}</p>
                  </div>
                )}
              </div>

              {/* Machine Status Section with Tabs */}
              <Tabs defaultValue="current" className="border-t pt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="current">Current Status</TabsTrigger>
                  <TabsTrigger value="history">Status History</TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Latest Status</h3>
                  </div>

                  {loadingStatus ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ) : machineStatus ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Type */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Grid2X2 className="w-4 h-4 text-orange-500" />
                        <p className="text-xs text-muted-foreground">
                         Type
                        </p>
                      </div>
                      <p className="text-base font-semibold">
                        {machineStatus.type === "L"
                          ? "Low"
                          : machineStatus.type === "M"
                          ? "Medium"
                          : "High"}
                      </p>
                    </div>

                    {/* Air Temperature */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="w-4 h-4 text-blue-500" />
                        <p className="text-xs text-muted-foreground">
                          Air Temp
                        </p>
                      </div>
                      <p className="text-base font-semibold">
                        {machineStatus.airTemperature ?? 0} K
                      </p>
                    </div>

                    {/* Process Temperature */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Thermometer className="w-4 h-4 text-red-500" />
                        <p className="text-xs text-muted-foreground">
                          Process Temp
                        </p>
                      </div>
                      <p className="text-base font-semibold">
                        {machineStatus.processTemperature ?? 0} K
                      </p>
                    </div>

                    {/* Rotational Speed */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="w-4 h-4 text-purple-500" />
                        <p className="text-xs text-muted-foreground">
                          Rot Speed
                        </p>
                      </div>
                      <p className="text-base font-semibold">
                        {machineStatus.rotationalSpeed ?? 0} rpm
                      </p>
                    </div>

                    {/* Torque */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <p className="text-xs text-muted-foreground">Torque</p>
                      </div>
                      <p className="text-base font-semibold">
                        {machineStatus.torque ?? 0} Nm
                      </p>
                    </div>

                    {/* Tool Wear */}
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-green-500" />
                        <p className="text-xs text-muted-foreground">
                          Tool Wear
                        </p>
                      </div>
                      <p className="text-base font-semibold">
                        {machineStatus.toolWear ?? 0} min
                      </p>
                    </div>

                    {/* Target/Status */}
                    <div className="p-4 bg-muted rounded-lg md:col-span-3 col-span-2">
                      <p className="text-xs text-muted-foreground mb-2">
                        Status
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            machineStatus.target === 0
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }
                        >
                          {machineStatus.target === 0
                            ? "Normal Operation"
                            : "Failure Detected"}
                        </Badge>
                        {machineStatus.failureType && (
                          <span className="text-sm text-muted-foreground">
                            ({machineStatus.failureType})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No status data available</p>
                  </div>
                )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <LineChart className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Status History</h3>
                  </div>

                  <MachineStatusChart 
                    statusHistory={statusHistory} 
                    isLoading={loadingStatus} 
                  />
                </TabsContent>
              </Tabs>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() =>
                    handleDeleteClick(machine.id, machine.productId)
                  }
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
                <Button size="sm" className="flex-1" onClick={handleEditClick}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                {machineStatus?.machineAnalysis?.[0] && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => setAnalysisDialogOpen(true)}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    View Analysis
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Machine Dialog */}
      <EditMachineDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        machine={machine}
        onConfirm={onEdit}
        onOpenChangeParent={onOpenChange}
      />

      {/* AI Analysis Dialog */}
      <AIAnalysisDialog
        open={analysisDialogOpen}
        onOpenChange={setAnalysisDialogOpen}
        analysis={machineStatus?.machineAnalysis?.[0]}
        machineName={machine?.name}
      />
    </>
  );
}

export default MachineDetailDialog;
