"use client";

import { useState } from "react";
import { useJobs } from "@/lib/useJobs";
import JobsTable from "@/components/JobsTable";
import JobDetail from "@/components/JobDetail";
import type { Job } from "@/lib/notion";

export default function JobsPage() {
  const { jobs, loading, error, updateStatus, toggleComplete, updateNotes, updateProofStatus, updatePriority, fetchJobs } = useJobs();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted)] text-sm">Loading jobs...</div>
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

  // Keep selected job in sync with latest data
  const currentSelectedJob = selectedJob
    ? jobs.find((j) => j.id === selectedJob.id) || selectedJob
    : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">All Jobs</h1>
        <button
          onClick={fetchJobs}
          className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
        >
          Refresh
        </button>
      </div>

      <JobsTable
        jobs={jobs}
        onStatusChange={updateStatus}
        onToggleComplete={toggleComplete}
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
