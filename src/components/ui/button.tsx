"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

type SlotProps = React.HTMLAttributes<HTMLElement> & { children?: React.ReactElement }

function Slot({ children, className, ...props }: SlotProps) {
  if (!React.isValidElement(children)) return null
  const child = children as React.ReactElement<any>
  return React.cloneElement(child, {
    ...props,
    className: cn(className, (child.props as any)?.className),
  })
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-kona-brown text-kona-white shadow hover:bg-kona-brown/90",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-500/90",
        outline:
          "border border-kona-brown bg-transparent text-kona-brown shadow-sm hover:bg-kona-brown hover:text-kona-white",
        secondary:
          "bg-kona-taupe text-kona-espresso shadow-sm hover:bg-kona-taupe/80",
        ghost: "hover:bg-kona-taupe hover:text-kona-espresso",
        link: "text-kona-brown underline-offset-4 hover:underline",
        teal: "bg-kona-teal text-white shadow hover:bg-kona-teal/90",
        aloha: "bg-gradient-to-r from-kona-brown to-kona-teal text-white shadow-kona-soft hover:shadow-kona-medium transition-all duration-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const Comp: any = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }