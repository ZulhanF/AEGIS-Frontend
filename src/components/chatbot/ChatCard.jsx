import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRightIcon, Trash2 } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function ChatCard({ handleChange, handleSubmit, chat, disabled = false, onClearChat, showClearButton = false }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !disabled) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <InputGroup className="flex w-full mx-auto">
        <InputGroupTextarea
          placeholder={disabled ? "Connecting..." : "Ask, Search or Chat..."}
          name="chat"
          id="chat"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={chat}
          disabled={disabled}
        />
        <InputGroupAddon align="block-end">
          <TooltipProvider>
            <div className="flex items-center gap-1 ml-auto">
              {showClearButton && onClearChat && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton
                      variant="default"
                      className="rounded-full cursor-pointer"
                      size="icon-sm"
                      onClick={onClearChat}
                      disabled={disabled}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Clear Chat</span>
                    </InputGroupButton>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear all messages</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <InputGroupButton
                    variant="default"
                    className="rounded-full cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    size="icon-sm"
                    onClick={handleSubmit}
                    disabled={disabled || !chat?.trim()}
                  >
                    <ArrowUpRightIcon className="h-4 w-4" />
                    <span className="sr-only">Send</span>
                  </InputGroupButton>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message (Enter)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </InputGroupAddon>
      </InputGroup>
    </motion.div>
  );
}

export default ChatCard;
