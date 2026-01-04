import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Menu, Moon, Sun, ChevronRight, Home } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { KeyboardShortcutsDialog } from "@/components/KeyboardShortcutsDialog";
import { useIsMobile } from "@/hooks/use-mobile";

const breadcrumbMap = {
  overview: "Overview",
  chat: "Chatbot",
  machines: "Machine",
  view: "View",
  add: "Add",
  status: "Status",
  tickets: "Ticket",
  create: "Create",
  users: "User Management",
};

function Header() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);

    if (pathnames.length === 0) {
      return [{ name: "Overview", path: "/overview" }];
    }

    let breadcrumbs = [];
    let currentPath = "";

    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const name = breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({
        name,
        path: currentPath,
        isLast: index === pathnames.length - 1,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 border-b">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-8 w-8">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>

        <Separator orientation="vertical" className="h-6" />

        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            to="/overview"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
          {breadcrumbs.map((breadcrumb) => (
            <React.Fragment key={breadcrumb.path}>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              {breadcrumb.isLast ? (
                <span className="font-medium text-foreground">
                  {breadcrumb.name.replace("-", " ")}
                </span>
              ) : (
                <Link
                  to={breadcrumb.path}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {breadcrumb.name}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col items-end text-sm">
          <span className="text-foreground font-medium">{formatTime(currentTime)}</span>
          <span className="text-muted-foreground text-xs">{formatDate(currentTime)}</span>
        </div>

        <div className="sm:hidden text-sm font-medium text-foreground">
          {formatTime(currentTime)}
        </div>

        {!isMobile && (
          <>
            <Separator orientation="vertical" className="h-6" />
            <KeyboardShortcutsDialog />
            <Separator orientation="vertical" className="h-6" />
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-8 w-8"
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  );
}

export default Header;
