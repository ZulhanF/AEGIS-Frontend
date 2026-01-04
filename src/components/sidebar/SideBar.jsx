import React from "react";
import { Brain, Bot, Cog, Eye, Plus, Monitor, Ticket, ChartArea, Users } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import ConfirmDialog from "@/components/ConfirmDialog";
import { NavUser } from "./AvatarProfile";
import SidebarMenuSimple from "@/components/sidebar/SidebarMenuSimple";
import SidebarMenuCollapsible from "@/components/sidebar/SidebarMenuCollapsible";
import { motion } from "framer-motion";

// Menu items
const simpleMenuItems = [
  {
    title: "Overview",
    url: "/overview",
    icon: Monitor,
  },
  {
    title: "Chatbot",
    url: "/chat",
    icon: Brain,
  },
];

// Admin only menu items
const adminMenuItems = [
  {
    title: "User Management",
    url: "/users",
    icon: Users,
  },
];

// Submenu items
const collapsibleMenuItems = [
  {
    title: "Machine",
    icon: Cog,
    defaultOpen: false,
    subItems: [
      {
        title: "View Machine",
        url: "/machines",
        icon: Eye,
      },
      {
        title: "Add Machine",
        url: "/machines/add",
        icon: Plus,
      },
      {
        title: "Add Machine Status",
        url: "/machines/add-status",
        icon: ChartArea,
      },
    ],
  },
  {
    title: "Ticket",
    icon: Ticket,
    defaultOpen: false,
    subItems: [
      {
        title: "View Tickets",
        url: "/tickets",
        icon: Eye,
      },
      {
        title: "Create Ticket",
        url: "/tickets/create",
        icon: Plus,
      },
    ],
  },
];

function SideBar({ onLogout, user }) {
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);
  const isAdmin = user?.role === "ADMIN";

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    onLogout();
  };

  return (
    <>
      <ConfirmDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Logout Confirmation"
        description="Are you sure you want to logout? You will need to login again to access your account."
        onConfirm={handleConfirmLogout}
        confirmText="Logout"
        cancelText="Cancel"
      />
      <Sidebar collapsible="icon">
        <SidebarHeader className="h-16 border-sidebar-border flex items-center px-4 group-data-[collapsible=icon]:px-0">
          <motion.div 
            className="flex items-center gap-3 w-full group-data-[collapsible=icon]:justify-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div 
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-200 text-primary-foreground"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <img src="/logo-png.png" alt="AEGIS Logo" className="h-7 w-7" />
            </motion.div>
            <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
              <span className="font-bold text-lg truncate">
                AEGIS
              </span>
            </div>
          </motion.div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="px-2 text-xs">Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* Modularisasi menu sidebar menjadi komponen terpisah */}
                {simpleMenuItems.map((item) => (
                  <SidebarMenuSimple key={item.title} item={item} />
                ))}
                {collapsibleMenuItems.map((menu) => (
                  <SidebarMenuCollapsible
                    key={menu.title}
                    title={menu.title}
                    icon={menu.icon}
                    subItems={menu.subItems}
                    defaultOpen={menu.defaultOpen}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Admin Only Section */}
          {isAdmin && (
            <SidebarGroup>
              <SidebarGroupLabel className="px-2 text-xs">Admin</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminMenuItems.map((item) => (
                    <SidebarMenuSimple key={item.title} item={item} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <NavUser user={user} logout={handleLogoutClick} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
export default SideBar;
