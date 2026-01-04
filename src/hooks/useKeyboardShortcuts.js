import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  const handleKeyPress = useCallback(
    (event) => {
      const target = event.target;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        if (event.key === "/" && !target.classList.contains("global-search")) {
          return;
        }
        if (event.key !== "/") {
          return;
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        console.log("Quick navigation (Ctrl/Cmd + K)");
        return;
      }

      if (event.key === "/" && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        const searchInput = document.querySelector(
          'input[placeholder*="Search" i], input[placeholder*="search" i]'
        );
        if (searchInput) {
          searchInput.focus();
        }
        return;
      }

      if (event.altKey && !event.ctrlKey && !event.metaKey) {
        const keyNum = parseInt(event.key);
        if (keyNum >= 1 && keyNum <= 9) {
          event.preventDefault();
          switch (keyNum) {
            case 1:
              navigate("/overview");
              break;
            case 2:
              navigate("/chat");
              break;
            case 3:
              navigate("/machines");
              break;
            case 4:
              navigate("/tickets");
              break;
            case 5:
              navigate("/machines/add");
              break;
            case 6:
              navigate("/tickets/create");
              break;
            case 7:
              navigate("/users");
              break;
            default:
              break;
          }
        }
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "e") {
        event.preventDefault();
        const exportButton = document.querySelector("[data-export-button]");
        if (exportButton) {
          exportButton.click();
        }
        return;
      }

      if (event.key === "Escape") {
        return;
      }
    },
    [navigate]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);
}

export function useShowShortcutsHelp() {
  return {
    shortcuts: [
      { keys: ["Alt", "1"], description: "Go to Overview" },
      { keys: ["Alt", "2"], description: "Go to Chatbot" },
      { keys: ["Alt", "3"], description: "Go to Machines" },
      { keys: ["Alt", "4"], description: "Go to Tickets" },
      { keys: ["Alt", "5"], description: "Add Machine" },
      { keys: ["Alt", "6"], description: "Create Ticket" },
      { keys: ["Alt", "7"], description: "User Management" },
      { keys: ["/"], description: "Focus search" },
      { keys: ["Ctrl/Cmd", "K"], description: "Quick navigation" },
      { keys: ["Ctrl/Cmd", "E"], description: "Export data" },
      { keys: ["Esc"], description: "Close dialog" },
    ],
  };
}
