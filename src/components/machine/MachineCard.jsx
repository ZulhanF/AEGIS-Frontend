import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { machineCardVariants } from "../MotionVariant";
import { useNavigate } from "react-router-dom";

function MachineCard({ machine, onCardClick }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const navigate = useNavigate();

  const handleCreateTicket = (e) => {
    e.stopPropagation();
    navigate("/tickets/create", { state: { selectedMachine: machine.productId } });
  };

  const handleAddStatus = (e) => {
    e.stopPropagation();
    navigate("/machines/add-status", { state: { selectedMachine: machine.id } });
  };

  return (
    <motion.div
      variants={machineCardVariants}
      whileHover="hover"
      whileTap="tap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onCardClick(machine)}
    >
      <Card className="cursor-pointer border-2 hover:border-primary/50 h-full">
        <CardHeader className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 bg-primary/10 rounded-full"
                animate={{ rotate: isHovered ? 360 : 0 }}
                transition={{ duration: 0.6 }}
              >
                <Settings className="w-6 h-6 text-primary" />
              </motion.div>
              <div className="space-y-1">
                <CardTitle className="text-xl">{machine.productId}</CardTitle>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200"
            >
              Active
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Machine ID</p>
              <p className="font-semibold">{machine.productId}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Machine Name</p>
              <p className="font-semibold">{machine.name}</p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-4 pt-4 border-t flex gap-2">
            <Button 
              onClick={handleCreateTicket}
              variant="outline" 
              size="sm" 
              className="flex-1 gap-1.5 text-xs h-8"
            >
              <Plus className="w-3.5 h-3.5" />
              Ticket
            </Button>
            <Button 
              onClick={handleAddStatus}
              variant="outline" 
              size="sm" 
              className="flex-1 gap-1.5 text-xs h-8"
            >
              <Plus className="w-3.5 h-3.5" />
              Status
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default MachineCard;
