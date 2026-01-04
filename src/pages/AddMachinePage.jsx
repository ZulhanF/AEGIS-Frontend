import React from "react";
import AddMachine from "@/components/machine/AddMachine";
import HeaderText from "@/components/HeaderText";
import { motion } from "framer-motion";

function AddMachinePage({ onAddMachine, onMachineAdded }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 w-full p-6"
    >
      <div className="max-w-5xl mx-auto">
        <HeaderText
          title="Add Machine"
          subtitle="Add a new machine to the system"
        />
        <AddMachine
          onAddMachine={onAddMachine}
          onMachineAdded={onMachineAdded}
        />
      </div>
    </motion.div>
  );
}
export default AddMachinePage;
