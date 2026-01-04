import { getMachines, addMachine, deleteMachine, editMachine } from "@/utils/api";
import { useCallback, useState } from "react";

export function useMachine() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMachines = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { error, data } = await getMachines();
      if (!error) {
        setMachines(data);
      } else {
        setError("Failed to fetch machines");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching machines:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const useAddMachine = useCallback(async (newMachine) => {
    try {
      const { error, data } = await addMachine(newMachine);
      if (!error) {
        setMachines((prevMachines) => [data, ...prevMachines]);
        return data;
      } else {
        throw new Error("Failed to add machine");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error adding machine:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const useDeleteMachine = useCallback(async (machineId) => {
    try {
      const { error } = await deleteMachine(machineId);
      if (!error) {
        setMachines((prevMachines) =>
          prevMachines.filter((machine) => machine.id !== machineId)
        );
        return true;
      } else {
        throw new Error("Failed to delete machine");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error deleting machine:", err);
      throw err;
    }
  }, []);

  const useEditMachine = useCallback(async (machineId, machineData) => {
    try {
      const { error, data } = await editMachine(machineId, machineData);
      if (!error) {
        setMachines((prevMachines) =>
          prevMachines.map((machine) =>
            machine.id === machineId ? data : machine
          )
        );
        return data;
      } else {
        throw new Error("Failed to edit machine");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error editing machine:", err);
      throw err;
    }
  }, []);

  return {
    machines,
    loading,
    error,
    fetchMachines,
    useAddMachine,
    useDeleteMachine,
    useEditMachine,
  };
}
