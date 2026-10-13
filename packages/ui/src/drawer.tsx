"use client"

import * as React from "react"
import { Drawer as DrawerPrimitive } from "vaul"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        "inset-0 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed z-50 bg-foreground/10",
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  showCloseButton = true,
  showHandle = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content> & {
  showCloseButton?: boolean
  showHandle?: boolean
}) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          "group/drawer-content text-sm shadow-lg fixed z-50 flex h-auto flex-col bg-popover bg-clip-padding text-popover-foreground outline-none",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[85vh] data-[vaul-drawer-direction=bottom]:rounded-t-2xl data-[vaul-drawer-direction=bottom]:border-t",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[85vh] data-[vaul-drawer-direction=top]:rounded-b-2xl data-[vaul-drawer-direction=top]:border-b",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=left]:h-full data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:sm:max-w-sm data-[vaul-drawer-direction=right]:h-full data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l",
          className
        )}
        {...props}
      >
        {showHandle ? (
          <div
            data-slot="drawer-handle"
            aria-hidden="true"
            className="mt-2.5 h-1 w-10 mx-auto hidden shrink-0 rounded-full bg-foreground/15 transition-colors group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
          />
        ) : null}
        {children}
        {showCloseButton ? (
          <DrawerPrimitive.Close data-slot="drawer-close" asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              className="top-3 right-3 absolute hidden group-data-[vaul-drawer-direction=left]/drawer-content:inline-flex group-data-[vaul-drawer-direction=right]/drawer-content:inline-flex group-data-[vaul-drawer-direction=top]/drawer-content:inline-flex"
            >
              <XIcon />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerPrimitive.Close>
        ) : null}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        "gap-1 p-4 pr-12 has-data-[slot=drawer-media]:gap-2 group-data-[vaul-drawer-direction=bottom]/drawer-content:pr-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:pt-3 group-data-[vaul-drawer-direction=top]/drawer-content:pt-3 flex flex-col text-left",
        className
      )}
      {...props}
    />
  )
}

function DrawerMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-media"
      className={cn(
        "mb-1 size-10 *:[svg:not([class*='size-'])]:size-5 inline-flex items-center justify-center rounded-lg bg-brand-subtle text-brand",
        className
      )}
      {...props}
    />
  )
}

function DrawerBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-body"
      className={cn("gap-4 px-4 pb-4 flex flex-1 flex-col", className)}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        "gap-2 p-4 sm:flex-row sm:justify-end mt-auto flex flex-col-reverse border-t bg-muted/50",
        "group-data-[vaul-drawer-direction=top]/drawer-content:rounded-b-2xl",
        "group-data-[vaul-drawer-direction=left]/drawer-content:rounded-br-xl",
        "group-data-[vaul-drawer-direction=right]/drawer-content:rounded-bl-xl",
        className
      )}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        "text-base font-medium leading-none text-foreground",
        className
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description asChild {...props}>
      <div
        data-slot="drawer-description"
        className={cn(
          "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
          className
        )}
      >
        {children}
      </div>
    </DrawerPrimitive.Description>
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerMedia,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
