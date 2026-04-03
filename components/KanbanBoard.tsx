"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  rectIntersection,
} from "@dnd-kit/core";
import type { DragStartEvent, DragEndEvent } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Job } from "@/lib/notion";

const COLUMNS: { id: Job["status"]; label: string; color: string }[] = [
  { id: "Queued", label: "Queued", color: "#f59e0b" },
  { id: "In Progress", label: "In Progress", color: "#3b82f6" },
  { id: "Done", label: "Done", color: "#22c55e" },
];

const PRIORITY_COLORS: Record<string, string> = {
  Rush: "#f97316",
  "Hot Rush": "#ef4444",
};

const PROOF_COLORS: Record<string, string> = {
  "Not Started": "#6b7280",
  "Proof Sent": "#f59e0b",
  Approved: "#22c55e",
  "Revision Needed": "#ef4444",
};

const JOB_TYPE_COLORS: Record<string, string> = {
  Sample: "#a855f7",
  "Test Print": "#f97316",
  "Digital Work": "#ec4899",
  "Custom Order": "#3b82f6",
  "Production Order": "#6b7280",
};

interface KanbanBoardProps {
  jobs: Job[];
  onStatusChange: (id: string, status: string) => void;
  onSelectJob: (job: Job) => void;
}

export default function KanbanBoard({
  jobs,
  onStatusChange,
  onSelectJob,
}: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activeJob = activeId ? jobs.find((j) => j.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const draggedJob = jobs.find((j) => j.id === active.id);
    if (!draggedJob) return;

    // Determine which column was dropped on
    let targetStatus: string | null = null;

    // Dropped on a column directly
    const overColumn = COLUMNS.find((c) => c.id === over.id);
    if (overColumn) {
      targetStatus = overColumn.id;
    } else {
      // Dropped on a card — use that card's status
      const overJob = jobs.find((j) => j.id === over.id);
      if (overJob) {
        targetStatus = overJob.status;
      }
    }

    if (targetStatus && draggedJob.status !== targetStatus) {
      onStatusChange(draggedJob.id, targetStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[60vh]">
        {COLUMNS.map((col) => {
          const columnJobs = jobs.filter((j) => j.status === col.id);
          return (
            <Column
              key={col.id}
              column={col}
              jobs={columnJobs}
              onSelectJob={onSelectJob}
            />
          );
        })}
      </div>
      <DragOverlay>
        {activeJob ? <JobCard job={activeJob} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function Column({
  column,
  jobs,
  onSelectJob,
}: {
  column: (typeof COLUMNS)[number];
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border transition-colors ${
        isOver
          ? "border-[var(--accent-blue)] bg-[var(--accent-blue)]/5"
          : "border-[var(--border)] bg-[var(--background)]"
      }`}
    >
      {/* Column header */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="text-sm font-semibold">{column.label}</h3>
        </div>
        <span className="text-xs text-[var(--muted)] bg-[var(--card)] px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>

      {/* Cards */}
      <div className="p-2 space-y-2 min-h-[200px]">
        {jobs.map((job) => (
          <DraggableJobCard
            key={job.id}
            job={job}
            onSelect={() => onSelectJob(job)}
          />
        ))}
        {jobs.length === 0 && (
          <div className="flex items-center justify-center h-32 text-xs text-[var(--muted)] border-2 border-dashed border-[var(--border)] rounded-lg">
            {isOver ? "Drop here" : "Drop jobs here"}
          </div>
        )}
      </div>
    </div>
  );
}

function DraggableJobCard({
  job,
  onSelect,
}: {
  job: Job;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobCard job={job} onClick={onSelect} />
    </div>
  );
}

function JobCard({
  job,
  isOverlay,
  onClick,
}: {
  job: Job;
  isOverlay?: boolean;
  onClick?: () => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = job.deadline ? new Date(job.deadline) : null;
  const isOverdue = deadline && deadline < today && job.status !== "Done";
  const pri = job.priority || "Normal";
  const proof = job.proofStatus || "Not Started";
  const typeColor = JOB_TYPE_COLORS[job.jobType] || "#6b7280";

  return (
    <div
      onClick={onClick}
      className={`rounded-lg border p-3 cursor-grab active:cursor-grabbing transition-shadow border-l-[3px] ${
        isOverlay
          ? "shadow-2xl border-[var(--accent-blue)] bg-[var(--card)]"
          : isOverdue
          ? "border-[var(--accent-red)]/50 bg-[var(--card)] hover:shadow-md"
          : "border-[var(--border)] bg-[var(--card)] hover:shadow-md"
      }`}
      style={{ borderLeftColor: typeColor }}
    >
      {/* Priority + Proof badges */}
      <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
        {pri !== "Normal" && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase"
            style={{
              backgroundColor: `${PRIORITY_COLORS[pri]}20`,
              color: PRIORITY_COLORS[pri],
            }}
          >
            {pri}
          </span>
        )}
        <span
          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
          style={{
            backgroundColor: `${PROOF_COLORS[proof]}15`,
            color: PROOF_COLORS[proof],
          }}
        >
          {proof}
        </span>
      </div>

      {/* Job name */}
      <p className="text-sm font-medium leading-tight mb-1 line-clamp-2">
        {job.jobName}
      </p>

      {/* Meta row */}
      <div className="flex items-center justify-between text-[10px] text-[var(--muted)]">
        <span>{job.customer || "No customer"}</span>
        {deadline && (
          <span className={isOverdue ? "text-[var(--accent-red)] font-semibold" : ""}>
            {deadline.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            {isOverdue && " !"}
          </span>
        )}
      </div>

      {/* Substrate + qty */}
      {(job.substrate || job.qtyToProduce > 0) && (
        <div className="text-[10px] text-[var(--muted)] mt-0.5">
          {job.substrate && <span>{job.substrate}</span>}
          {job.substrate && job.qtyToProduce > 0 && <span> · </span>}
          {job.qtyToProduce > 0 && <span>Qty: {job.qtyToProduce}</span>}
        </div>
      )}

      {/* Job type */}
      {job.jobType && (
        <div className="mt-1">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{
              backgroundColor: `${typeColor}15`,
              color: typeColor,
            }}
          >
            {job.jobType}
          </span>
        </div>
      )}

      {/* File link indicator */}
      {job.fileLink && (
        <div className="mt-1.5">
          <span className="text-[10px] text-[var(--accent-blue)]">
            File attached
          </span>
        </div>
      )}
    </div>
  );
}
