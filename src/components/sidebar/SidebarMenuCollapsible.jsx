import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";

// Submenu sidebar
function SidebarMenuCollapsible({ title, icon, subItems, defaultOpen = false }) {
  const IconComponent = icon;
  const location = useLocation();
  const isAnySubItemActive = subItems.some(subItem => location.pathname === subItem.url);
  
  return (
    <Collapsible defaultOpen={defaultOpen} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton 
            tooltip={title}
            className="hover:bg-accent"
          >
            <IconComponent className="h-4 w-4" />
            <span>{title}</span>
            <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {subItems.map((subItem) => {
              const SubIcon = subItem.icon;
              const isActive = location.pathname === subItem.url;
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`${
                      isActive 
                        ? 'bg-primary/10 hover:bg-primary/15 text-primary' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <Link to={subItem.url} className="flex items-center gap-3 relative">
                      {isActive && (
                        <motion.div
                          layoutId="activeSubIndicator"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <SubIcon className="h-3.5 w-3.5" />
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export default SidebarMenuCollapsible;
