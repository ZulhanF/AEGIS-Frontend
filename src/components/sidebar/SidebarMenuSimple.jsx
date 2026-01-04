import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";

// Sidebar menu item
function SidebarMenuSimple({ item }) {
  const Icon = item.icon;
  const location = useLocation();
  const isActive = location.pathname === item.url;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        asChild 
        tooltip={item.title}
        className={`${
          isActive 
            ? 'bg-primary/10 hover:bg-primary/15 text-primary' 
            : 'hover:bg-accent'
        }`}
      >
        <Link to={item.url} className="flex items-center gap-3 relative">
          {isActive && (
            <motion.div
              layoutId="activeIndicator"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full group-data-[collapsible=icon]:hidden"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <Icon className="h-4 w-4" />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default SidebarMenuSimple;
