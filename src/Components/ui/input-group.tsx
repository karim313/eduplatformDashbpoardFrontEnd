import * as React from "react"
import { cn } from "@/lib/utils"

const InputGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative flex w-full flex-col gap-1", className)} {...props} />
))
InputGroup.displayName = "InputGroup"

const InputGroupTextarea = React.forwardRef<
    HTMLTextAreaElement,
    React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
    <textarea
        ref={ref}
        className={cn(
            "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    />
))
InputGroupTextarea.displayName = "InputGroupTextarea"

const InputGroupAddon = React.forwardRef<
    HTMLDivElement,
    { align?: "inline-start" | "inline-end" | "block-start" | "block-end" } & React.HTMLAttributes<HTMLDivElement>
>(({ className, align = "inline-end", ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex items-center text-muted-foreground",
            align === "block-end" && "mt-1 justify-end",
            className
        )}
        {...props}
    />
))
InputGroupAddon.displayName = "InputGroupAddon"

const InputGroupText = React.forwardRef<
    HTMLSpanElement,
    React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
    <span
        ref={ref}
        className={cn("text-xs text-muted-foreground", className)}
        {...props}
    />
))
InputGroupText.displayName = "InputGroupText"

export { InputGroup, InputGroupTextarea, InputGroupAddon, InputGroupText }
