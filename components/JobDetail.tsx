"use client";

import { useState } from "react";
import type { Job } from "@/lib/notion";

const STATUS_COLORS: Record<string, string> = {
  Queued: "#f59e0b",
  "In Progress": "#3b82f6",
  Done: "#22c55e",
};

const PROOF_COLORS: Record<string, string> = {
  "Not Started": "#6b7280",
  "Proof Sent": "#f59e0b",
  Approved: "#22c55e",
  "Revision Needed": "#ef4444",
};

const PRIORITY_COLORS: Record<string, string> = {
  Normal: "#6b7280",
  Rush: "#f97316",
  "Hot Rush": "#ef4444",
};

interface JobDetailProps {
  job: Job;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
  onNotesChange: (id: string, notes: string) => void;
  onProofStatusChange: (id: string, proofStatus: string) => void;
  onPriorityChange: (id: string, priority: string) => void;
}

export default function JobDetail({
  job,
  onClose,
  onStatusChange,
  onToggleComplete,
  onNotesChange,
  onProofStatusChange,
  onPriorityChange,
}: JobDetailProps) {
  const [notes, setNotes] = useState(job.notes);
  const [saving, setSaving] = useState(false);

  const saveNotes = async () => {
    setSaving(true);
    onNotesChange(job.id, notes);
    setTimeout(() => setSaving(false), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-[var(--border)]">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {job.productionNbr && (
                <span className="text-sm text-[var(--muted)]">#{job.productionNbr}</span>
              )}
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: `${STATUS_COLORS[job.status]}20`,
                  color: STATUS_COLORS[job.status],
                }}
              >
                {job.status}
              </span>
              {job.priority && job.priority !== "Normal" && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-bold uppercase"
                  style={{
                    backgroundColor: `${PRIORITY_COLORS[job.priority]}20`,
                    color: PRIORITY_COLORS[job.priority],
                  }}
                >
                  {job.priority}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold">{job.jobName}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-[var(--foreground)] p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Quick actions */}
          <div className="flex flex-wrap gap-3">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Status</label>
              <select
                value={job.status}
                onChange={(e) => onStatusChange(job.id, e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
              >
                <option value="Queued">Queued</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Priority</label>
              <select
                value={job.priority || "Normal"}
                onChange={(e) => onPriorityChange(job.id, e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
              >
                <option value="Normal">Normal</option>
                <option value="Rush">Rush</option>
                <option value="Hot Rush">Hot Rush</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Proof</label>
              <select
                value={job.proofStatus || "Not Started"}
                onChange={(e) => onProofStatusChange(job.id, e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
                style={{ color: PROOF_COLORS[job.proofStatus] }}
              >
                <option value="Not Started">Not Started</option>
                <option value="Proof Sent">Proof Sent</option>
                <option value="Approved">Approved</option>
                <option value="Revision Needed">Revision Needed</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Completed</label>
              <button
                onClick={() => onToggleComplete(job.id, !job.completed)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                  job.completed
                    ? "bg-[var(--accent-green)]/15 border-[var(--accent-green)] text-[var(--accent-green)]"
                    : "bg-[var(--background)] border-[var(--border)] text-[var(--muted)]"
                }`}
              >
                {job.completed ? "Done" : "Mark Done"}
              </button>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Customer" value={job.customer} />
            <Field label="Job Type" value={job.jobType} />
            <Field label="Substrate" value={job.substrate} />
            <Field label="Qty to Produce" value={String(job.qtyToProduce)} />
            <Field
              label="Deadline"
              value={job.deadline ? new Date(job.deadline).toLocaleDateString() : "—"}
              highlight={
                !!(job.deadline && new Date(job.deadline) < new Date() && job.status !== "Done")
              }
            />
            <Field label="Color Profile" value={job.colorProfile} />
          </div>

          {/* File Link */}
          {job.fileLink && (
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1.5">File Link</label>
              <a
                href={job.fileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-[var(--accent-blue)] hover:underline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                Open Print File
              </a>
            </div>
          )}

          {/* RIP Notes */}
          {job.ripNotes && (
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1.5">RIP Notes</label>
              <p className="text-sm bg-[var(--background)] rounded-lg p-3 border border-[var(--border)]">
                {job.ripNotes}
              </p>
            </div>
          )}

          {/* Special Instructions */}
          {job.specialInstructions && (
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1.5">Special Instructions</label>
              <div className="text-sm bg-[var(--accent-orange)]/5 border border-[var(--accent-orange)]/20 rounded-lg p-3 text-[var(--accent-orange)]">
                {job.specialInstructions}
              </div>
            </div>
          )}

          {/* Workcenters */}
          {job.workcenters.length > 0 && (
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1.5">Workcenters</label>
              <div className="flex gap-2 flex-wrap">
                {job.workcenters.map((wc) => (
                  <span
                    key={wc}
                    className="px-2 py-1 rounded-md bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] text-xs font-medium"
                  >
                    {wc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Line Items */}
          {job.lineItems && (
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1.5">Line Items</label>
              <pre className="text-xs bg-[var(--background)] rounded-lg p-3 border border-[var(--border)] whitespace-pre-wrap font-mono">
                {job.lineItems}
              </pre>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-xs text-[var(--muted)] block mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add notes..."
              className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent-blue)] resize-none"
            />
            <button
              onClick={saveNotes}
              disabled={saving || notes === job.notes}
              className="mt-2 px-3 py-1.5 rounded-lg bg-[var(--accent-blue)] text-white text-xs font-medium disabled:opacity-30 hover:opacity-90 transition-opacity"
            >
              {saving ? "Saving..." : "Save Notes"}
            </button>
          </div>

          {/* Link to Notion */}
          <a
            href={job.notionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
            Open in Notion
          </a>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <label className="text-xs text-[var(--muted)] block mb-0.5">{label}</label>
      <p className={`text-sm font-medium ${highlight ? "text-[var(--accent-red)]" : ""}`}>
        {value || "—"}
      </p>
    </div>
  );
}
