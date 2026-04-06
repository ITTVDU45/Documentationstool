import type { ReactNode } from "react"

import { DocumentationFormProvider } from "@/components/form/documentation-form-provider"

interface DocsLayoutProps {
  children: ReactNode
}

export default function DocsLayout({ children }: DocsLayoutProps) {
  return <DocumentationFormProvider>{children}</DocumentationFormProvider>
}
