"use client"

import { Menu } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import type { SectionId } from "@/lib/section-ids"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { sectionsMeta } from "@/lib/sections-meta"
import { cn } from "@/lib/utils"

interface SidebarNavigationProps {
  activeSectionId: SectionId
  onSectionSelect: (sectionId: SectionId) => void
}

function SectionList({ activeSectionId, onSectionSelect }: SidebarNavigationProps) {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] pr-2">
      <ul className="space-y-1">
        {sectionsMeta.map((section) => {
          const isActive = section.id === activeSectionId
          return (
            <li key={section.id}>
              <button
                type="button"
                className={cn(
                  "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                )}
                onClick={() => onSectionSelect(section.id)}
              >
                <span className="block font-medium">{section.title}</span>
                <span className={cn("block text-xs opacity-80", !isActive && "text-muted-foreground")}>{section.description}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </ScrollArea>
  )
}

export function SidebarNavigation({ activeSectionId, onSectionSelect }: SidebarNavigationProps) {
  return (
    <>
      <aside className="hidden w-[320px] shrink-0 border-r border-border/80 bg-card/70 p-4 lg:block">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Project Sections</h2>
        <SectionList activeSectionId={activeSectionId} onSectionSelect={onSectionSelect} />
      </aside>
      <div className="mb-4 flex items-center justify-between gap-2 lg:hidden">
        <Sheet>
          <SheetTrigger
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-fit"
            )}
          >
            <Menu className="mr-2 h-4 w-4" />
            Sektionen
          </SheetTrigger>
          <SheetContent side="left" className="w-[90vw] sm:w-[420px]">
            <SheetHeader>
              <SheetTitle>Projektstruktur</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <SectionList activeSectionId={activeSectionId} onSectionSelect={onSectionSelect} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
