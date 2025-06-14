import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  alt?: string
  fallback?: React.ReactNode
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "avatar"}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground text-sm font-medium">
            {fallback ?? "?"}
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export { Avatar, avatarVariants }
