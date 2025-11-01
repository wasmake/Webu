import { notFound } from "next/navigation";

import { ProjectHeader } from "@/components/ProjectHeader";
import { Explorer } from "@/components/Explorer";
import { VideoReview } from "@/components/VideoReview";
import { ActivityTimeline } from "@/components/ActivityTimeline";
import { ProjectInitializer } from "@/components/ProjectInitializer";

interface ProjectPageProps {
  params: { projectId: string };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = params;
  if (!projectId) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
      <ProjectInitializer projectId={projectId} />
      <ProjectHeader />
      <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
        <Explorer />
        <div className="flex flex-1 flex-col gap-4">
          <VideoReview />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}
