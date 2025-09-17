"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-kona-brown text-kona-white shadow hover:bg-kona-brown/80",
        secondary:
          "border-transparent bg-kona-taupe text-kona-espresso hover:bg-kona-taupe/80",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-500/80",
        outline: "text-kona-espresso border-kona-brown",
        teal: "border-transparent bg-kona-teal text-white shadow hover:bg-kona-teal/80",
        new: "border-transparent bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow animate-pulse",
        popular: "border-transparent bg-gradient-to-r from-orange-500 to-red-500 text-white shadow",
        seasonal: "border-transparent bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow",
        "in-stock": "border-transparent bg-green-100 text-green-800 border-green-200",
        "sold-out": "border-transparent bg-red-100 text-red-800 border-red-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }