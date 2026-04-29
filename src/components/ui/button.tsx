import { ComponentProps, useRef } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"
import { useButtonRipple } from "@/hooks/use-button-ripple"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive touch-manipulation",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 active:scale-[0.97]",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 active:scale-[0.97]",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 active:scale-[0.97]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-[44px] px-4 py-2 has-[>svg]:px-3",
        sm: "min-h-[40px] rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "min-h-[48px] rounded-md px-6 has-[>svg]:px-4",
        icon: "min-w-[44px] min-h-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  onClick,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const { ripples, createRipple, rippleColor } = useButtonRipple(variant || 'default')
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e)
    onClick?.(e)
  }

  if (asChild) {
    return (
      <Slot
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }

  return (
    <button
      ref={buttonRef}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden select-none")}
      onClick={handleClick}
      style={{
        WebkitTapHighlightColor: 'transparent',
      }}
      {...props}
    >
      {props.children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            backgroundColor: rippleColor,
          }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1]
          }}
        />
      ))}
    </button>
  )
}

export { Button, buttonVariants }
