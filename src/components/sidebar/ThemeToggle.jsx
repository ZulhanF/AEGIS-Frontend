import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarMenuButton
      onClick={toggleTheme}
      tooltip={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      className="cursor-pointer"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4" />
          <span>Dark Mode</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span>Light Mode</span>
        </>
      )}
    </SidebarMenuButton>
  );
}
