import { ProjectHeader } from "@/components/ProjectHeader";
import { Explorer } from "@/components/Explorer";
import { VideoReview } from "@/components/VideoReview";
import { ActivityTimeline } from "@/components/ActivityTimeline";

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-6">
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
