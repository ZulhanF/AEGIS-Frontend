import {
  getMachineStatuses,
  getMachineStatusByMachineId,
  createMachineStatus,
  updateMachineStatus,
  deleteMachineStatus,
} from "@/utils/api";
import { useCallback, useState } from "react";

export function useStatus() {
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatuses = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { error, data } = await getMachineStatuses();
      if (!error) {
        setStatuses(data);
      } else {
        setError("Failed to fetch machine statuses");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching machine statuses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatusByMachineId = useCallback(async (machineId) => {
    setLoading(true);
    setError(null);

    try {
      const { error, data } = await getMachineStatusByMachineId(machineId);
      if (!error) {
        // Return the latest status (first item if array)
        return Array.isArray(data) ? data[0] : data;
      } else {
        setError("Failed to fetch machine status");
        return null;
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching machine status:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const useCreateStatus = useCallback(async (statusData) => {
    try {
      const { error, message } = await createMachineStatus(statusData);
      if (!error) {
        await fetchStatuses();
        return { success: true, message };
      } else {
        throw new Error("Failed to create machine status");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error creating machine status:", err);
      throw err;
    }
  }, [fetchStatuses]);

  const useUpdateStatus = useCallback(async (statusId, statusData) => {
    try {
      const { error, message, data } = await updateMachineStatus(
        statusId,
        statusData
      );
      if (!error) {
        // Update the status in local state
        setStatuses((prevStatuses) =>
          prevStatuses.map((status) =>
            status.id === statusId ? data : status
          )
        );
        return { success: true, message, data };
      } else {
        throw new Error("Failed to update machine status");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error updating machine status:", err);
      throw err;
    }
  }, []);

  const useDeleteStatus = useCallback(async (statusId) => {
    try {
      const { error, message } = await deleteMachineStatus(statusId);
      if (!error) {
        // Remove the status from local state
        setStatuses((prevStatuses) =>
          prevStatuses.filter((status) => status.id !== statusId)
        );
        return { success: true, message };
      } else {
        throw new Error("Failed to delete machine status");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error deleting machine status:", err);
      throw err;
    }
  }, []);

  return {
    statuses,
    loading,
    error,
    fetchStatuses,
    fetchStatusByMachineId,
    useCreateStatus,
    useUpdateStatus,
    useDeleteStatus,
  };
}
