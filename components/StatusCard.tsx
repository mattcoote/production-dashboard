"use client";

interface StatusCardProps {
  label: string;
  count: number;
  color: string;
  icon: string;
  pulse?: boolean;
}

export default function StatusCard({ label, count, color, icon, pulse }: StatusCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[var(--card)] border border-[var(--border)] p-6 ${
        pulse && count > 0 ? "animate-pulse-red border-[var(--accent-red)]" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">{label}</p>
          <p className="mt-1 text-4xl font-bold tracking-tight" style={{ color }}>
            {count}
          </p>
        </div>
        <div
          className="flex items-center justify-center w-12 h-12 rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <svg className="w-6 h-6" style={{ color }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
          </svg>
        </div>
      </div>
      {/* Decorative gradient bar at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
    </div>
  );
}
