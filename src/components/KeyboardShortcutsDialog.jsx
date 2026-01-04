import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Keyboard } from "lucide-react";
import { useShowShortcutsHelp } from "@/hooks/useKeyboardShortcuts";

export function KeyboardShortcutsDialog() {
  const { shortcuts } = useShowShortcutsHelp();
  const [open, setOpen] = React.useState(false);

  // Listen for Ctrl/Cmd + /  to open shortcuts dialog
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "/") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Keyboard className="h-4 w-4" />
          Shortcuts
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate faster
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pr-2">
          {/* Navigation Section */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              Navigation
            </h3>
            <div className="space-y-2">
              {shortcuts.slice(0, 7).map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        {keyIndex > 0 && (
                          <span className="text-muted-foreground text-xs self-center mx-1">
                            +
                          </span>
                        )}
                        <Badge
                          variant="outline"
                          className="font-mono text-xs px-2 py-1"
                        >
                          {key}
                        </Badge>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Other Actions */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              Actions
            </h3>
            <div className="space-y-2">
              {shortcuts.slice(7).map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <span className="text-sm">{shortcut.description}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        {keyIndex > 0 && (
                          <span className="text-muted-foreground text-xs self-center mx-1">
                            +
                          </span>
                        )}
                        <Badge
                          variant="outline"
                          className="font-mono text-xs px-2 py-1"
                        >
                          {key}
                        </Badge>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold">Tip:</span> Press{" "}
              <Badge variant="outline" className="font-mono text-xs mx-1">
                Ctrl/Cmd
              </Badge>
              +
              <Badge variant="outline" className="font-mono text-xs mx-1">
                /
              </Badge>
              to toggle this dialog anytime
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
