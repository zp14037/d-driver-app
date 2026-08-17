import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /* Default — white pill (primary CTA on dark bg) */
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-[0.98] transition-opacity",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        /* Outline — thin border, transparent bg */
        outline:
          "border border-foreground/18 bg-transparent text-foreground hover:bg-foreground/6 hover:border-foreground/35",
        /* Secondary — dark elevated pill */
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-foreground/8 text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        /* Gold bordered accent button */
        gold:
          "border border-gold/50 text-gold bg-transparent hover:bg-gold/8 rounded-pill",
        /* Small dark pill — secondary actions */
        dark:
          "bg-secondary text-foreground/80 hover:bg-muted rounded-pill text-xs font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
