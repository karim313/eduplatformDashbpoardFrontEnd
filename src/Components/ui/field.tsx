import * as React from "react"
import { Label } from "@/Components/ui/label"
import { cn } from "@/lib/utils"

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: "horizontal" | "vertical"
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
    ({ className, orientation = "vertical", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "flex gap-2",
                    orientation === "vertical" ? "flex-col" : "flex-row items-center justify-between",
                    className
                )}
                {...props}
            />
        )
    }
)
Field.displayName = "Field"

const FieldLabel = React.forwardRef<
    React.ElementRef<typeof Label>,
    React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
    <Label
        ref={ref}
        className={cn("text-sm font-medium leading-none", className)}
        {...props}
    />
))
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-[0.8rem] text-muted-foreground", className)}
        {...props}
    />
))
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef<
    HTMLParagraphElement,
    { errors?: (any | undefined)[] } & React.HTMLAttributes<HTMLParagraphElement>
>(({ className, errors, ...props }, ref) => {
    if (!errors || errors.length === 0 || !errors[0]) return null
    return (
        <p
            ref={ref}
            className={cn("text-[0.8rem] font-medium text-destructive", className)}
            {...props}
        >
            {errors[0].message || errors[0]}
        </p>
    )
})
FieldError.displayName = "FieldError"

const FieldGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("grid gap-4", className)} {...props} />
))
FieldGroup.displayName = "FieldGroup"

export { Field, FieldLabel, FieldDescription, FieldError, FieldGroup }
