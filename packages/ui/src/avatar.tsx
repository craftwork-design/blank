"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Avatar as AvatarPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const avatarVariants = cva(
  "group/avatar relative grid shrink-0 grid-cols-1 grid-rows-1 overflow-visible rounded-full select-none",
  {
    variants: {
      size: {
        xs: "size-5",
        sm: "size-8",
        default: "size-10",
        lg: "size-12",
        xl: "size-14",
        "2xl": "size-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const avatarFallbackVariants = cva(
  [
    "min-h-0 min-w-0 font-medium col-start-1 row-start-1 flex size-full items-center justify-center rounded-full",
    "group-data-[size=xs]/avatar:leading-3 group-data-[size=xs]/avatar:text-[8px]",
    "group-data-[size=sm]/avatar:text-xs group-data-[size=sm]/avatar:leading-4",
    "group-data-[size=default]/avatar:text-sm group-data-[size=default]/avatar:leading-5",
    "group-data-[size=lg]/avatar:text-base group-data-[size=lg]/avatar:leading-6",
    "group-data-[size=xl]/avatar:text-lg group-data-[size=xl]/avatar:leading-7",
    "group-data-[size=2xl]/avatar:text-xl group-data-[size=2xl]/avatar:leading-7",
    "[&>svg]:size-1/2 [&>svg]:shrink-0",
    // A gradient sibling is the avatar's surface, so the fallback drops its own
    // fill and just carries the initials over it in a static dark ink.
    "group-has-[[data-slot=avatar-gradient]]/avatar:bg-transparent",
    "group-has-[[data-slot=avatar-gradient]]/avatar:text-overlay-foreground",
  ],
  {
    variants: {
      color: {
        grey: "",
        blue: "",
        green: "",
        orange: "",
        red: "",
        purple: "",
      },
      theme: {
        subtle: "",
        accent: "",
      },
    },
    compoundVariants: [
      {
        color: "grey",
        theme: "subtle",
        className: "bg-muted text-muted-foreground",
      },
      {
        color: "grey",
        theme: "accent",
        className: "bg-foreground text-background",
      },
      {
        color: "blue",
        theme: "subtle",
        className: "bg-info text-info-foreground",
      },
      {
        color: "blue",
        theme: "accent",
        className: "bg-info-primary text-info-primary-foreground",
      },
      {
        color: "green",
        theme: "subtle",
        className: "bg-success text-success-foreground",
      },
      {
        color: "green",
        theme: "accent",
        className: "bg-success-primary text-success-primary-foreground",
      },
      {
        color: "orange",
        theme: "subtle",
        className: "bg-warning text-warning-foreground",
      },
      {
        color: "orange",
        theme: "accent",
        className: "bg-warning-primary text-warning-primary-foreground",
      },
      {
        color: "red",
        theme: "subtle",
        className: "bg-danger text-danger-foreground",
      },
      {
        color: "red",
        theme: "accent",
        className: "bg-danger-primary text-danger-primary-foreground",
      },
      {
        color: "purple",
        theme: "subtle",
        className: "bg-brand-subtle text-brand",
      },
      {
        color: "purple",
        theme: "accent",
        className: "bg-brand text-brand-foreground",
      },
    ],
    defaultVariants: {
      color: "grey",
      theme: "subtle",
    },
  }
)

const avatarBadgeVariants = cva(
  [
    "absolute z-10 inline-flex items-center justify-center rounded-full select-none",
    "group-data-[size=xs]/avatar:size-2.5 group-data-[size=sm]/avatar:size-3 group-data-[size=default]/avatar:size-4",
    "group-data-[size=xl]/avatar:size-5 group-data-[size=2xl]/avatar:size-6 group-data-[size=lg]/avatar:size-[18px]",
  ],
  {
    variants: {
      position: {
        "top-right": "top-0 right-0 translate-x-1/3 -translate-y-1/3",
        "bottom-right": "right-0 bottom-0 translate-x-1/3 translate-y-1/3",
        "top-left": "top-0 left-0 -translate-x-1/3 -translate-y-1/3",
        "bottom-left": "bottom-0 left-0 -translate-x-1/3 translate-y-1/3",
      },
    },
    defaultVariants: {
      position: "bottom-right",
    },
  }
)

const avatarBadgeDotVariants = cva(
  [
    "relative z-10 flex items-center justify-center rounded-full",
    "size-1.5 group-data-[size=sm]/avatar:size-2 group-data-[size=default]/avatar:size-2.5",
    "group-data-[size=lg]/avatar:size-3 group-data-[size=xl]/avatar:size-3.5 group-data-[size=2xl]/avatar:size-4",
    "[&>svg]:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden group-data-[size=xs]/avatar:[&>svg]:hidden",
  ],
  {
    variants: {
      tone: {
        success: "bg-success-primary text-success-primary-foreground",
        warning: "bg-warning-primary text-warning-primary-foreground",
        info: "bg-info-primary text-info-primary-foreground",
        danger: "bg-danger-primary text-danger-primary-foreground",
      },
    },
    defaultVariants: {
      tone: "success",
    },
  }
)

const avatarBadgeSeparatorVariants = cva(
  [
    "inset-0 absolute z-0 rounded-full bg-background",
    "group-data-[size=xs]/avatar:size-2.5 group-data-[size=sm]/avatar:size-3 group-data-[size=default]/avatar:size-4",
    "group-data-[size=xl]/avatar:size-5 group-data-[size=2xl]/avatar:size-6 group-data-[size=lg]/avatar:size-[18px]",
  ],
  {
    variants: {
      position: {
        "top-right": "translate-x-0 translate-y-0 [clip-path:inset(0_35%_0_0)]",
        "bottom-right":
          "translate-x-0 translate-y-0 [clip-path:inset(0_35%_0_0)]",
        "top-left": "translate-x-0 translate-y-0 [clip-path:inset(0_0_0_35%)]",
        "bottom-left":
          "translate-x-0 translate-y-0 [clip-path:inset(0_0_0_35%)]",
      },
    },
    defaultVariants: {
      position: "bottom-right",
    },
  }
)

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(avatarVariants({ size, className }))}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "min-h-0 min-w-0 col-start-1 row-start-1 size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  color = "grey",
  theme = "subtle",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback> &
  VariantProps<typeof avatarFallbackVariants>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(avatarFallbackVariants({ color, theme, className }))}
      {...props}
    />
  )
}

function AvatarBadge({
  className,
  children,
  tone = "success",
  position = "bottom-right",
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof avatarBadgeDotVariants> &
  VariantProps<typeof avatarBadgeVariants>) {
  return (
    <span
      data-slot="avatar-badge"
      data-position={position}
      className={cn(avatarBadgeVariants({ position, className }))}
      {...props}
    >
      <span
        data-slot="avatar-badge-separator"
        aria-hidden="true"
        className={cn(avatarBadgeSeparatorVariants({ position }))}
      />
      <span
        data-slot="avatar-badge-dot"
        className={cn(avatarBadgeDotVariants({ tone }))}
      >
        {children}
      </span>
    </span>
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group pl-0 isolate flex items-center",
        "pr-3 has-[[data-size=sm]]:pr-2 has-[[data-size=xs]]:pr-1",
        "*:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        "*:data-[slot=avatar]:-mr-3 *:data-[slot=avatar]:data-[size=sm]:-mr-2 *:data-[slot=avatar]:data-[size=xs]:-mr-1",
        "*:data-[slot=avatar-group-count]:-mr-3 group-has-[[data-size=sm]]/avatar-group:*:data-[slot=avatar-group-count]:-mr-2 group-has-[[data-size=xs]]/avatar-group:*:data-[slot=avatar-group-count]:-mr-1",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  color = "grey",
  theme = "subtle",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof avatarFallbackVariants>) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        avatarFallbackVariants({ color, theme }),
        "size-10 relative shrink-0 ring-2 ring-background",
        "group-has-[[data-size=xs]]/avatar-group:size-5 group-has-[[data-size=xs]]/avatar-group:leading-3 group-has-[[data-size=xs]]/avatar-group:[&>svg]:size-3 group-has-[[data-size=xs]]/avatar-group:text-[8px]",
        "group-has-[[data-size=sm]]/avatar-group:size-8 group-has-[[data-size=sm]]/avatar-group:text-xs group-has-[[data-size=sm]]/avatar-group:leading-4 group-has-[[data-size=sm]]/avatar-group:[&>svg]:size-4",
        className
      )}
      {...props}
    />
  )
}
export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  avatarVariants,
}
