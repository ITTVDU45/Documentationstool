import { ProjectDocumentationPage } from "@/components/form/project-documentation-page"

interface ProjectDocumentationRouteProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDocumentationRoute({ params }: ProjectDocumentationRouteProps) {
  const { id } = await params
  return <ProjectDocumentationPage projectId={id} />
}
