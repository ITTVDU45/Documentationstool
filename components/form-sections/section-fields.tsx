"use client"

import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface TextInputFieldProps<TValues extends FieldValues> {
  form: UseFormReturn<TValues>
  name: FieldPath<TValues>
  label: string
  description?: string
  placeholder?: string
  type?: "text" | "email" | "tel" | "url" | "number"
}

interface TextareaFieldProps<TValues extends FieldValues> extends TextInputFieldProps<TValues> {
  rows?: number
}

export function TextInputField<TValues extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  type = "text",
}: TextInputFieldProps<TValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder ?? label} {...field} />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function TextareaField<TValues extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  rows = 4,
}: TextareaFieldProps<TValues>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea rows={rows} placeholder={placeholder ?? label} {...field} />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
