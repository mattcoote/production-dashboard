"use client";

import { useJobs } from "@/lib/useJobs";
import AddJobForm from "@/components/AddJobForm";

export default function AddJobPage() {
  const { addJob } = useJobs();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Add Job</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Quickly add samples, test prints, digital work, or other one-off jobs.
        </p>
      </div>
      <AddJobForm onSubmit={addJob} />
    </div>
  );
}
