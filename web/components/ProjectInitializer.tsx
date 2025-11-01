"use client";

import { useEffect } from "react";

import { useProjectStore } from "@/lib/store/useProjectStore";

interface ProjectInitializerProps {
  projectId: string;
}

export function ProjectInitializer({ projectId }: ProjectInitializerProps) {
  const setSelectedProject = useProjectStore((state) => state.setSelectedProject);
  useEffect(() => {
    setSelectedProject(projectId);
  }, [projectId, setSelectedProject]);
  return null;
}
