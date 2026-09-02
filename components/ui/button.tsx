import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg border text-sm font-medium transition-all outline-none select-none focus:outline-none focus:ring-2 focus:ring-gray-300 active:translate-y-px disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-500 text-white hover:bg-blue-600",

        outline:
          "border border-gray-300 bg-white text-black hover:bg-gray-100",

        secondary:
          "bg-gray-200 text-black hover:bg-gray-300",

        ghost:
          "bg-transparent hover:bg-gray-100 text-black",

        destructive:
          "bg-red-500 text-white hover:bg-red-600",

        link: "text-blue-500 underline hover:text-blue-600",
      },

      size: {
        default: "h-8 px-3",
        sm: "h-7 px-2 text-sm",
        lg: "h-10 px-4",
        icon: "h-8 w-8",
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
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {

  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
