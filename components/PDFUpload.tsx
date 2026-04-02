"use client";

import { useState, useRef } from "react";

interface ParsedOrder {
  productionNbr: string;
  inventoryId: string;
  substrate: string;
  customer: string;
  orderNbr: string;
  customerPO: string;
  orderDate: string | null;
  startDate: string | null;
  endDate: string | null;
  qtyToProduce: number;
  workcenters: string[];
  lineItems: string;
}

export default function PDFUpload({ onCreated }: { onCreated: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [creating, setCreating] = useState(false);
  const [orders, setOrders] = useState<ParsedOrder[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setCurrentFile(file);
    if (!file.name.endsWith(".pdf")) {
      setError("Please upload a PDF file");
      return;
    }
    setError("");
    setSuccess("");
    setParsing(true);
    setOrders([]);

    try {
      const formData = new FormData();
      formData.append("pdf", file);
      formData.append("preview", "true");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Upload failed");
      setOrders(data.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse PDF");
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleCreate = async () => {
    setCreating(true);
    setError("");
    try {
      if (!currentFile) {
        setError("No file selected");
        return;
      }

      const formData = new FormData();
      formData.append("pdf", currentFile);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to create jobs");
      setSuccess(`Created ${data.jobs.length} job(s) in Notion!`);
      setOrders([]);
      setCurrentFile(null);
      if (fileRef.current) fileRef.current.value = "";
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create jobs");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-5">
      {error && (
        <div className="p-3 rounded-lg bg-[var(--accent-red)]/10 border border-[var(--accent-red)]/30 text-[var(--accent-red)] text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 text-[var(--accent-green)] text-sm font-medium">
          {success}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-[var(--accent-blue)] bg-[var(--accent-blue)]/5"
            : "border-[var(--border)] hover:border-[var(--muted)]"
        }`}
      >
        <svg className="w-10 h-10 mx-auto mb-3 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-[var(--muted)]">
          {parsing ? "Parsing PDF..." : "Drop an Acumatica Production Order PDF here, or click to browse"}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Preview */}
      {orders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[var(--muted)]">
            Found {orders.length} order(s) — review before adding to Notion:
          </h3>
          {orders.map((order, i) => (
            <div
              key={i}
              className="rounded-xl bg-[var(--card)] border border-[var(--border)] p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-bold">#{order.productionNbr || "N/A"}</span>
                <span className="text-xs text-[var(--muted)]">{order.inventoryId}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[var(--muted)]">Customer:</span>{" "}
                  <span className="font-medium">{order.customer || "—"}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Substrate:</span>{" "}
                  <span className="font-medium">{order.substrate || "—"}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Deadline:</span>{" "}
                  <span className="font-medium">{order.endDate || "—"}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Qty:</span>{" "}
                  <span className="font-medium">{order.qtyToProduce}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">Order Nbr:</span>{" "}
                  <span className="font-medium">{order.orderNbr || "—"}</span>
                </div>
                <div>
                  <span className="text-[var(--muted)]">PO:</span>{" "}
                  <span className="font-medium">{order.customerPO || "—"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[var(--muted)]">Workcenters:</span>{" "}
                  <span className="font-medium">{order.workcenters.join(", ") || "—"}</span>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-6 py-2.5 rounded-lg bg-[var(--accent-green)] text-white text-sm font-medium disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            {creating ? "Creating..." : `Add ${orders.length} Job(s) to Notion`}
          </button>
        </div>
      )}
    </div>
  );
}
