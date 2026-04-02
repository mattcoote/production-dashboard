"use client";

import { useState } from "react";
import type { Job } from "@/lib/notion";

const STATUS_OPTIONS = ["Queued", "In Progress", "Done"] as const;
const STATUS_COLORS: Record<string, string> = {
  Queued: "#f59e0b",
  "In Progress": "#3b82f6",
  Done: "#22c55e",
};

interface JobsTableProps {
  jobs: Job[];
  onStatusChange: (id: string, status: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onSelectJob: (job: Job) => void;
}

export default function JobsTable({
  jobs,
  onStatusChange,
  onToggleComplete,
  onSelectJob,
}: JobsTableProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"deadline" | "orderDate" | "customer">("deadline");

  const filtered = jobs
    .filter((j) => {
      if (filterStatus !== "all" && j.status !== filterStatus) return false;
      if (filterType !== "all" && j.jobType !== filterType) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          j.jobName.toLowerCase().includes(q) ||
          j.productionNbr.toLowerCase().includes(q) ||
          j.customer.toLowerCase().includes(q) ||
          j.substrate.toLowerCase().includes(q) ||
          j.orderNbr.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === "orderDate") {
        if (!a.orderDate) return 1;
        if (!b.orderDate) return -1;
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      }
      return a.customer.localeCompare(b.customer);
    });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)] flex-1 min-w-48"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)]"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)]"
        >
          <option value="all">All Types</option>
          <option value="Production Order">Production Order</option>
          <option value="Sample">Sample</option>
          <option value="Test Print">Test Print</option>
          <option value="Digital Work">Digital Work</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)]"
        >
          <option value="deadline">Sort: Deadline</option>
          <option value="orderDate">Sort: Order Date</option>
          <option value="customer">Sort: Customer</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--card)] text-[var(--muted)] text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left w-8"></th>
                <th className="px-4 py-3 text-left">Job</th>
                <th className="px-4 py-3 text-left">Customer</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Substrate</th>
                <th className="px-4 py-3 text-left">Qty</th>
                <th className="px-4 py-3 text-left">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => {
                const deadline = job.deadline ? new Date(job.deadline) : null;
                const isOverdue =
                  deadline && deadline < today && job.status !== "Done";

                return (
                  <tr
                    key={job.id}
                    className={`border-t border-[var(--border)] hover:bg-[var(--card-hover)] cursor-pointer transition-colors ${
                      isOverdue ? "bg-[#ef444408]" : ""
                    }`}
                    onClick={() => onSelectJob(job)}
                  >
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={job.completed}
                        onChange={() => onToggleComplete(job.id, !job.completed)}
                        className="rounded accent-[var(--accent-green)]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">
                        {job.productionNbr && (
                          <span className="text-[var(--muted)] mr-1">#{job.productionNbr}</span>
                        )}
                        {job.jobName}
                      </div>
                    </td>
                    <td className="px-4 py-3">{job.customer}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={job.status}
                        onChange={(e) => onStatusChange(job.id, e.target.value)}
                        className="px-2 py-1 rounded-md text-xs font-semibold border-0 cursor-pointer"
                        style={{
                          backgroundColor: `${STATUS_COLORS[job.status]}20`,
                          color: STATUS_COLORS[job.status],
                        }}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--border)] text-[var(--muted)]">
                        {job.jobType}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--muted)]">{job.substrate}</td>
                    <td className="px-4 py-3">{job.qtyToProduce}</td>
                    <td className="px-4 py-3">
                      {deadline ? (
                        <span className={isOverdue ? "text-[var(--accent-red)] font-semibold" : ""}>
                          {deadline.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          {isOverdue && " (overdue)"}
                        </span>
                      ) : (
                        <span className="text-[var(--muted)]">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-[var(--muted)]">
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-[var(--muted)] mt-2">
        Showing {filtered.length} of {jobs.length} jobs
      </p>
    </div>
  );
}
