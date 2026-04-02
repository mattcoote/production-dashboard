"use client";

import type { Job } from "@/lib/notion";

export default function Timeline({ jobs }: { jobs: Job[] }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = jobs
    .filter((j) => j.status !== "Done" && j.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 12);

  if (upcoming.length === 0) {
    return (
      <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-6">
        <h3 className="text-sm font-medium text-[var(--muted)] mb-4">Upcoming Deadlines</h3>
        <p className="text-[var(--muted)] text-sm">No upcoming deadlines</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-6">
      <h3 className="text-sm font-medium text-[var(--muted)] mb-4">Upcoming Deadlines</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {upcoming.map((job) => {
          const deadline = new Date(job.deadline!);
          deadline.setHours(0, 0, 0, 0);
          const isOverdue = deadline < today;
          const isToday = deadline.getTime() === today.getTime();
          const daysUntil = Math.ceil(
            (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
          );

          let borderColor = "#2a2e3a";
          let label = `${daysUntil}d`;
          if (isOverdue) {
            borderColor = "#ef4444";
            label = `${Math.abs(daysUntil)}d late`;
          } else if (isToday) {
            borderColor = "#f97316";
            label = "Today";
          } else if (daysUntil <= 3) {
            borderColor = "#f59e0b";
          }

          const statusColor =
            job.status === "In Progress" ? "#3b82f6" : "#f59e0b";

          return (
            <div
              key={job.id}
              className="flex-shrink-0 w-44 rounded-lg border-2 p-3 bg-[var(--background)]"
              style={{ borderColor }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: `${borderColor}20`,
                    color: borderColor === "#2a2e3a" ? "#6b7280" : borderColor,
                  }}
                >
                  {label}
                </span>
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusColor }}
                  title={job.status}
                />
              </div>
              <p className="text-xs font-medium truncate" title={job.jobName}>
                {job.customer && <span className="text-[var(--muted)]">{job.customer} — </span>}
                {job.productionNbr || job.jobName}
              </p>
              <p className="text-[10px] text-[var(--muted)] mt-0.5">
                {deadline.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
