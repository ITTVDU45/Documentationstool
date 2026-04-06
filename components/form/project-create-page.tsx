"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"

import { useDocumentationForm } from "@/components/form/documentation-form-provider"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type CreateDraft = {
  projectName: string
  companyName: string
  contactPerson: string
  companyEmail: string
  companyPhone: string
  companyLocation: string
}

const emptyDraft: CreateDraft = {
  projectName: "",
  companyName: "",
  contactPerson: "",
  companyEmail: "",
  companyPhone: "",
  companyLocation: "",
}

function validateCreateDraft(draft: CreateDraft): {
  errors: Partial<Record<keyof CreateDraft, string>>
  trimmed: CreateDraft
} {
  const trimmed: CreateDraft = {
    projectName: draft.projectName.trim(),
    companyName: draft.companyName.trim(),
    contactPerson: draft.contactPerson.trim(),
    companyEmail: draft.companyEmail.trim(),
    companyPhone: draft.companyPhone.trim(),
    companyLocation: draft.companyLocation.trim(),
  }
  const errors: Partial<Record<keyof CreateDraft, string>> = {}
  if (!trimmed.projectName) errors.projectName = "Projektname ist erforderlich."
  if (!trimmed.companyName) errors.companyName = "Unternehmen ist erforderlich."
  if (!trimmed.contactPerson) errors.contactPerson = "Ansprechperson ist erforderlich."
  if (!trimmed.companyEmail) errors.companyEmail = "E-Mail ist erforderlich."
  if (!trimmed.companyPhone) errors.companyPhone = "Telefonnummer ist erforderlich."
  if (!trimmed.companyLocation) errors.companyLocation = "Standort ist erforderlich."
  if (trimmed.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed.companyEmail))
    errors.companyEmail = "Bitte eine gültige E-Mail eingeben."
  if (trimmed.companyPhone && !/^[+\d()\-./\s]{6,25}$/.test(trimmed.companyPhone))
    errors.companyPhone = "Bitte eine gültige Telefonnummer eingeben."
  return { errors, trimmed }
}

export function ProjectCreatePage() {
  const { createProject } = useDocumentationForm()
  const router = useRouter()
  const [draft, setDraft] = useState<CreateDraft>(emptyDraft)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof CreateDraft, string>>>({})

  function updateDraft(field: keyof CreateDraft, value: string) {
    setDraft((previous) => ({ ...previous, [field]: value }))
    setFieldErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  function handleSubmit() {
    const { errors, trimmed } = validateCreateDraft(draft)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    const createdProjectId = createProject(trimmed.projectName, {
      client_company: trimmed.companyName,
      contact_person: trimmed.contactPerson,
      company_email: trimmed.companyEmail,
      company_phone: trimmed.companyPhone,
      company_location: trimmed.companyLocation,
    })
    if (createdProjectId) router.push(`/project/${createdProjectId}`)
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zum Dashboard
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">Neues Projekt</h1>
        <p className="text-sm text-muted-foreground">
          Kontaktdaten und Standort erfassen. Anschließend gelangst du zur Sektionsbearbeitung.
        </p>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <p className="text-sm font-medium">Kontaktdaten</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <Input
              value={draft.projectName}
              onChange={(event) => updateDraft("projectName", event.target.value)}
              placeholder="Projektname"
              autoComplete="off"
            />
            {fieldErrors.projectName ? (
              <p className="text-xs text-destructive">{fieldErrors.projectName}</p>
            ) : null}
          </div>
          <div className="space-y-1">
            <Input
              value={draft.companyName}
              onChange={(event) => updateDraft("companyName", event.target.value)}
              placeholder="Unternehmen"
              autoComplete="organization"
            />
            {fieldErrors.companyName ? (
              <p className="text-xs text-destructive">{fieldErrors.companyName}</p>
            ) : null}
          </div>
          <div className="space-y-1">
            <Input
              value={draft.contactPerson}
              onChange={(event) => updateDraft("contactPerson", event.target.value)}
              placeholder="Ansprechperson"
              autoComplete="name"
            />
            {fieldErrors.contactPerson ? (
              <p className="text-xs text-destructive">{fieldErrors.contactPerson}</p>
            ) : null}
          </div>
          <div className="space-y-1">
            <Input
              type="email"
              value={draft.companyEmail}
              onChange={(event) => updateDraft("companyEmail", event.target.value)}
              placeholder="E-Mail"
              autoComplete="email"
            />
            {fieldErrors.companyEmail ? (
              <p className="text-xs text-destructive">{fieldErrors.companyEmail}</p>
            ) : null}
          </div>
          <div className="space-y-1">
            <Input
              type="tel"
              value={draft.companyPhone}
              onChange={(event) => updateDraft("companyPhone", event.target.value)}
              placeholder="Telefonnummer"
              autoComplete="tel"
            />
            {fieldErrors.companyPhone ? (
              <p className="text-xs text-destructive">{fieldErrors.companyPhone}</p>
            ) : null}
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Input
              value={draft.companyLocation}
              onChange={(event) => updateDraft("companyLocation", event.target.value)}
              placeholder="Standort des Unternehmens"
              autoComplete="street-address"
            />
            {fieldErrors.companyLocation ? (
              <p className="text-xs text-destructive">{fieldErrors.companyLocation}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button type="button" onClick={handleSubmit}>
            Weiter zur Bearbeitung
          </Button>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Abbrechen
          </Link>
        </div>
      </div>
    </div>
  )
}
