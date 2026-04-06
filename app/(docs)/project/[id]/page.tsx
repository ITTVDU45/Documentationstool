import { ProjectHubPage } from "@/components/form/project-hub-page"

interface ProjectIdPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const { id } = await params
  return <ProjectHubPage projectId={id} />
}
