import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex px-2 py-4 h-8 w-full rounded-sm border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none transition-colors",
        "focus-visible:border-yellow-400 focus-visible:ring-1 focus-visible:ring-yellow-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
