"use client";

import { useJobs } from "@/lib/useJobs";
import StatusCard from "@/components/StatusCard";
import { StatusDonut, CustomerBar, ThroughputChart } from "@/components/Charts";
import Timeline from "@/components/Timeline";

export default function DashboardPage() {
  const { jobs, loading, error, fetchJobs } = useJobs();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const queued = jobs.filter((j) => j.status === "Queued").length;
  const inProgress = jobs.filter((j) => j.status === "In Progress").length;
  const overdue = jobs.filter(
    (j) =>
      j.status !== "Done" &&
      j.deadline &&
      new Date(j.deadline) < today
  ).length;

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const completedThisWeek = jobs.filter(
    (j) => j.status === "Done" && j.deadline && new Date(j.deadline) >= weekStart
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
        <button
          onClick={fetchJobs}
          className="px-4 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm hover:bg-[var(--card-hover)]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Production Dashboard</h1>
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
          label="Done This Week"
          count={completedThisWeek}
          color="var(--accent-green)"
          icon="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusDonut jobs={jobs} />
        <CustomerBar jobs={jobs} />
        <ThroughputChart jobs={jobs} />
      </div>

      <Timeline jobs={jobs} />
    </div>
  );
}
