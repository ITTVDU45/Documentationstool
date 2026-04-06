import { ProjectDetailPage } from "@/components/form/project-detail-page"

interface ProjectIdPageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectIdPage({ params }: ProjectIdPageProps) {
  const { id } = await params
  return <ProjectDetailPage projectId={id} />
}
