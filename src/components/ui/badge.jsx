/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        warning:
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
        success:
          "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        info:
          "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
        purple:
          "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }
