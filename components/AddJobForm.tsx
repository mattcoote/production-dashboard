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
    priority: "Normal",
    fileLink: "",
    proofStatus: "Not Started",
    colorProfile: "",
    ripNotes: "",
    specialInstructions: "",
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
        priority: "Normal",
        fileLink: "",
        proofStatus: "Not Started",
        colorProfile: "",
        ripNotes: "",
        specialInstructions: "",
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {success && (
        <div className="p-3 rounded-lg bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 text-[var(--accent-green)] text-sm font-medium">
          Job added successfully!
        </div>
      )}

      {/* Job Info */}
      <section>
        <h3 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3 font-semibold">Job Info</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[var(--muted)] block mb-1.5">Job Name *</label>
            <input
              type="text"
              required
              value={form.jobName}
              onChange={(e) => set("jobName", e.target.value)}
              placeholder="e.g., RH Sample — Canvas 24x36"
              className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)]"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                <option value="Custom Order">Custom Order</option>
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
            <div>
              <label className="text-sm text-[var(--muted)] block mb-1.5">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)]"
              >
                <option value="Normal">Normal</option>
                <option value="Rush">Rush</option>
                <option value="Hot Rush">Hot Rush</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
              <label className="text-sm text-[var(--muted)] block mb-1.5">Qty</label>
              <input
                type="number"
                min={1}
                value={form.qtyToProduce}
                onChange={(e) => set("qtyToProduce", parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--accent-blue)]"
              />
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
          </div>
        </div>
      </section>

      {/* File & Proofing */}
      <section>
        <h3 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3 font-semibold">File & Proofing</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[var(--muted)] block mb-1.5">File Link</label>
              <input
                type="url"
                value={form.fileLink}
                onChange={(e) => set("fileLink", e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--muted)] block mb-1.5">Proof Status</label>
              <select
                value={form.proofStatus}
                onChange={(e) => set("proofStatus", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)]"
              >
                <option value="Not Started">Not Started</option>
                <option value="Proof Sent">Proof Sent</option>
                <option value="Approved">Approved</option>
                <option value="Revision Needed">Revision Needed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-[var(--muted)] block mb-1.5">Color Profile</label>
              <input
                type="text"
                value={form.colorProfile}
                onChange={(e) => set("colorProfile", e.target.value)}
                placeholder="e.g., sRGB, Adobe RGB 1998"
                className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)]"
              />
            </div>
            <div>
              <label className="text-sm text-[var(--muted)] block mb-1.5">RIP Notes</label>
              <input
                type="text"
                value={form.ripNotes}
                onChange={(e) => set("ripNotes", e.target.value)}
                placeholder="e.g., 720x1440, 8-pass, high quality"
                className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Instructions & Notes */}
      <section>
        <h3 className="text-xs uppercase tracking-wider text-[var(--muted)] mb-3 font-semibold">Instructions</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-[var(--muted)] block mb-1.5">Special Instructions</label>
            <textarea
              value={form.specialInstructions}
              onChange={(e) => set("specialInstructions", e.target.value)}
              rows={2}
              placeholder="Special handling, finishing details, etc."
              className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)] resize-none"
            />
          </div>
          <div>
            <label className="text-sm text-[var(--muted)] block mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              rows={2}
              placeholder="Any additional details..."
              className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)] resize-none"
            />
          </div>
        </div>
      </section>

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
