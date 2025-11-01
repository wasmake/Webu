"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link2 } from "lucide-react";

import { selectWhiteboard, useProjectStore } from "@/lib/store/useProjectStore";
import type { WhiteboardElement } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

const COLORS = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b"];

function WhiteboardNode({ element }: { element: WhiteboardElement }) {
  const color = element.color ?? COLORS[element.id.length % COLORS.length];
  return (
    <motion.div
      layout
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "absolute w-48 cursor-grab rounded-xl border border-white/40 bg-white/95 px-3 py-2 text-xs shadow-lg",
      )}
      style={{
        top: element.position.y,
        left: element.position.x,
        borderColor: color,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {element.type}
        </span>
        {element.linkedTo && <Link2 className="h-3 w-3 text-slate-400" />}
      </div>
      <p className="mt-1 text-sm text-slate-800">{element.content}</p>
      {element.linkedTo?.timestampSeconds !== undefined && (
        <span className="mt-2 inline-flex rounded-full bg-slate-900/5 px-2 py-0.5 text-[11px] text-slate-500">
          {element.linkedTo.timestampSeconds.toFixed(0)}s
        </span>
      )}
    </motion.div>
  );
}

export function WhiteboardCanvas() {
  const elements = useProjectStore(selectWhiteboard);
  const nodes = useMemo(() => elements, [elements]);

  return (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-dashed border-slate-200 bg-slate-50/60">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.05),_transparent_45%)]" />
      <div className="absolute inset-0">
        {nodes.map((element) => (
          <WhiteboardNode key={element.id} element={element} />
        ))}
      </div>
      <div className="absolute bottom-3 right-3 rounded-full bg-white/80 px-3 py-1 text-xs text-slate-500 shadow">
        Whiteboard ligero - vincula ideas con archivos o timecodes
      </div>
    </div>
  );
}
