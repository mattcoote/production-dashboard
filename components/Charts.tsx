"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import type { Job } from "@/lib/notion";

const STATUS_COLORS: Record<string, string> = {
  Queued: "#f59e0b",
  "In Progress": "#3b82f6",
  Done: "#22c55e",
};

export function StatusDonut({ jobs }: { jobs: Job[] }) {
  const data = Object.entries(
    jobs.reduce<Record<string, number>>((acc, j) => {
      acc[j.status] = (acc[j.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return <EmptyChart label="No jobs yet" />;
  }

  return (
    <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-6">
      <h3 className="text-sm font-medium text-[var(--muted)] mb-4">Status Breakdown</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || "#6b7280"} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1a1d27",
                border: "1px solid #2a2e3a",
                borderRadius: "8px",
                color: "#e5e7eb",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[d.name] }}
            />
            <span className="text-[var(--muted)]">{d.name}</span>
            <span className="font-semibold">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomerBar({ jobs }: { jobs: Job[] }) {
  const counts = jobs.reduce<Record<string, number>>((acc, j) => {
    if (j.customer) acc[j.customer] = (acc[j.customer] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  if (data.length === 0) {
    return <EmptyChart label="No customers yet" />;
  }

  return (
    <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-6">
      <h3 className="text-sm font-medium text-[var(--muted)] mb-4">Jobs by Customer</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={60}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1d27",
                border: "1px solid #2a2e3a",
                borderRadius: "8px",
                color: "#e5e7eb",
              }}
            />
            <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ThroughputChart({ jobs }: { jobs: Job[] }) {
  // Build weekly throughput from completed jobs based on their deadline
  const now = new Date();
  const weeks: { label: string; completed: number }[] = [];

  for (let i = 3; i >= 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - i * 7);

    const count = jobs.filter((j) => {
      if (j.status !== "Done" || !j.deadline) return false;
      const d = new Date(j.deadline);
      return d >= weekStart && d < weekEnd;
    }).length;

    weeks.push({
      label: `Week ${4 - i}`,
      completed: count,
    });
  }

  return (
    <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-6">
      <h3 className="text-sm font-medium text-[var(--muted)] mb-4">
        Weekly Throughput (Last 4 Weeks)
      </h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeks} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="green-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#1a1d27",
                border: "1px solid #2a2e3a",
                borderRadius: "8px",
                color: "#e5e7eb",
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#22c55e"
              fill="url(#green-gradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-6 flex items-center justify-center h-72">
      <p className="text-[var(--muted)] text-sm">{label}</p>
    </div>
  );
}
