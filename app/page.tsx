"use client";

import { useJobs } from "@/lib/useJobs";
import StatusCard from "@/components/StatusCard";
import { StatusDonut, CustomerBar, ThroughputChart, ProofStatusDonut } from "@/components/Charts";
import Timeline from "@/components/Timeline";

export default function DashboardPage() {
  const { jobs, loading, error, fetchJobs } = useJobs();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const queued = jobs.filter((j) => j.status === "Queued").length;
  const inProgress = jobs.filter((j) => j.status === "In Progress").length;
  const overdue = jobs.filter(
    (j) => j.status !== "Done" && j.deadline && new Date(j.deadline) < today
  ).length;
  const rushCount = jobs.filter(
    (j) => j.status !== "Done" && (j.priority === "Rush" || j.priority === "Hot Rush")
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--muted)] text-sm">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-[var(--accent-red)] text-sm">{error}</p>
        <button onClick={fetchJobs} className="px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm hover:bg-[var(--card-hover)]">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Specialty Production</h1>
          <p className="text-sm text-[var(--muted)]">{jobs.length} total jobs</p>
        </div>
        <button
          onClick={fetchJobs}
          className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          label="Queued"
          count={queued}
          color="var(--accent-yellow)"
          icon="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
        <StatusCard
          label="In Progress"
          count={inProgress}
          color="var(--accent-blue)"
          icon="M5.636 5.636a9 9 0 1012.728 0M12 3v9"
        />
        <StatusCard
          label="Overdue"
          count={overdue}
          color="var(--accent-red)"
          icon="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
          pulse
        />
        <StatusCard
          label="Rush / Hot Rush"
          count={rushCount}
          color="var(--accent-orange)"
          icon="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.047 8.287 8.287 0 009 9.601a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z"
          pulse={rushCount > 0}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusDonut jobs={jobs} />
        <ProofStatusDonut jobs={jobs} />
        <CustomerBar jobs={jobs} />
        <ThroughputChart jobs={jobs} />
      </div>

      <Timeline jobs={jobs} />
    </div>
  );
}
