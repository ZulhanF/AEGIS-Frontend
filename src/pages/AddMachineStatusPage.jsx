import React from "react";
import AddMachineStatus from "@/components/machine/AddMachineStatus";
import HeaderText from "@/components/HeaderText";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";

function AddMachineStatusPage({ onCreateStatus, machines = [], onStatusAdded }) {
  const location = useLocation();
  const preSelectedMachine = location.state?.selectedMachine;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full p-6"
    >
      <div className="max-w-5xl mx-auto">
        <HeaderText
          title="Add Machine Status"
          subtitle="Record new machine status data"
        />
        <AddMachineStatus
          onCreateStatus={onCreateStatus}
          machines={machines}
          onStatusAdded={onStatusAdded}
          defaultMachineId={preSelectedMachine}
        />
      </div>
    </motion.div>
  );
}

export default AddMachineStatusPage;
