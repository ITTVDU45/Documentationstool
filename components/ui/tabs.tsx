"use client"

import * as React from "react"
import { Tabs } from "@base-ui/react/tabs"

import { cn } from "@/lib/utils"

function TabsRoot({ className, ...props }: React.ComponentProps<typeof Tabs.Root>) {
  return <Tabs.Root className={cn("flex flex-col gap-4", className)} {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof Tabs.List>) {
  return (
    <Tabs.List
      className={cn(
        "inline-flex h-9 w-fit flex-wrap items-center gap-1 rounded-lg border border-border bg-muted/40 p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof Tabs.Tab>) {
  return (
    <Tabs.Tab
      className={cn(
        "inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors",
        "hover:text-foreground",
        "data-[active]:bg-background data-[active]:text-foreground data-[active]:shadow-sm",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof Tabs.Panel>) {
  return <Tabs.Panel className={cn("outline-none", className)} {...props} />
}

export { TabsRoot as Tabs, TabsList, TabsTrigger, TabsContent }
