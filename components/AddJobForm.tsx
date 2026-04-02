"use client";

import { useState } from "react";

interface AddJobFormProps {
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

export default function AddJobForm({ onSubmit }: AddJobFormProps) {
  const [form, setForm] = useState({
    jobName: "",
    jobType: "Sample",
    customer: "",
    deadline: "",
    qtyToProduce: 1,
    substrate: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        deadline: form.deadline || null,
      });
      setSuccess(true);
      setForm({
        jobName: "",
        jobType: "Sample",
        customer: "",
        deadline: "",
        qtyToProduce: 1,
        substrate: "",
        notes: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const set = (field: string, value: string | number) =>
    setForm((f) => ({ ...f, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      {success && (
        <div className="p-3 rounded-lg bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 text-[var(--accent-green)] text-sm font-medium">
          Job added successfully!
        </div>
      )}

      <div>
        <label className="text-sm text-[var(--muted)] block mb-1.5">Job Name *</label>
        <input
          type="text"
          required
          value={form.jobName}
          onChange={(e) => set("jobName", e.target.value)}
          placeholder="e.g., Test Print — Canvas 24x36"
          className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--muted)] block mb-1.5">Job Type *</label>
          <select
            value={form.jobType}
            onChange={(e) => set("jobType", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)]"
          >
            <option value="Sample">Sample</option>
            <option value="Test Print">Test Print</option>
            <option value="Digital Work">Digital Work</option>
            <option value="Production Order">Production Order</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-[var(--muted)] block mb-1.5">Customer</label>
          <input
            type="text"
            value={form.customer}
            onChange={(e) => set("customer", e.target.value)}
            placeholder="e.g., RH"
            className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-[var(--muted)] block mb-1.5">Deadline</label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => set("deadline", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-blue)]"
          />
        </div>
        <div>
          <label className="text-sm text-[var(--muted)] block mb-1.5">Qty to Produce</label>
          <input
            type="number"
            min={1}
            value={form.qtyToProduce}
            onChange={(e) => set("qtyToProduce", parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-blue)]"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-[var(--muted)] block mb-1.5">Substrate</label>
        <input
          type="text"
          value={form.substrate}
          onChange={(e) => set("substrate", e.target.value)}
          placeholder="e.g., Canvas 24x36"
          className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)]"
        />
      </div>

      <div>
        <label className="text-sm text-[var(--muted)] block mb-1.5">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          placeholder="Any additional details..."
          className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting || !form.jobName}
        className="px-6 py-2.5 rounded-lg bg-[var(--accent-blue)] text-white text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
      >
        {submitting ? "Adding..." : "Add Job"}
      </button>
    </form>
  );
}
