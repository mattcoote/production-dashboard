"use client";

import { useJobs } from "@/lib/useJobs";
import PDFUpload from "@/components/PDFUpload";

export default function UploadPage() {
  const { fetchJobs } = useJobs();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Upload Production Order</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Upload Acumatica Production Order PDFs to automatically parse and add to the tracker.
        </p>
      </div>
      <PDFUpload onCreated={fetchJobs} />
    </div>
  );
}
