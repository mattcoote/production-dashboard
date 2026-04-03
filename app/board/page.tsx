"use client";

import { useState } from "react";
import { useJobs } from "@/lib/useJobs";
import KanbanBoard from "@/components/KanbanBoard";
import JobDetail from "@/components/JobDetail";
import type { Job } from "@/lib/notion";

export default function BoardPage() {
  const {
    jobs,
    loading,
    error,
    updateStatus,
    toggleComplete,
    updateNotes,
    updateProofStatus,
    updatePriority,
    fetchJobs,
  } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted)] text-sm">Loading board...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-[var(--accent-red)] text-sm">{error}</p>
        <button onClick={fetchJobs} className="px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm">
          Retry
        </button>
      </div>
    );
  }

  const currentSelectedJob = selectedJob
    ? jobs.find((j) => j.id === selectedJob.id) || selectedJob
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Board</h1>
          <p className="text-sm text-[var(--muted)]">Drag jobs between columns to update status</p>
          <div className="flex gap-3 mt-2">
            {[
              { label: "Sample", color: "#a855f7" },
              { label: "Test Print", color: "#f97316" },
              { label: "Digital Work", color: "#ec4899" },
              { label: "Custom Order", color: "#3b82f6" },
              { label: "Production", color: "#6b7280" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-1 text-[10px] text-[var(--muted)]">
                <span className="w-2.5 h-1 rounded-full" style={{ backgroundColor: t.color }} />
                {t.label}
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={fetchJobs}
          className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
        >
          Refresh
        </button>
      </div>

      <KanbanBoard
        jobs={jobs}
        onStatusChange={updateStatus}
        onSelectJob={setSelectedJob}
      />

      {currentSelectedJob && (
        <JobDetail
          job={currentSelectedJob}
          onClose={() => setSelectedJob(null)}
          onStatusChange={updateStatus}
          onToggleComplete={toggleComplete}
          onNotesChange={updateNotes}
          onProofStatusChange={updateProofStatus}
          onPriorityChange={updatePriority}
        />
      )}
    </div>
  );
}
