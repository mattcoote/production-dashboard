"use client";

import { useState, useEffect, useCallback } from "react";
import type { Job } from "@/lib/notion";

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setJobs(data);
      setError("");
    } catch {
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    const interval = setInterval(fetchJobs, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const updateStatus = async (id: string, status: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: status as Job["status"] } : j))
    );
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  };

  const toggleComplete = async (id: string, completed: boolean) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id
          ? { ...j, completed, status: completed ? "Done" : j.status }
          : j
      )
    );
    const body: Record<string, unknown> = { completed };
    if (completed) body.status = "Done";
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  const updateNotes = async (id: string, notes: string) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, notes } : j)));
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
  };

  const addJob = async (data: Record<string, unknown>) => {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create job");
    const job = await res.json();
    setJobs((prev) => [job, ...prev]);
  };

  return {
    jobs,
    loading,
    error,
    fetchJobs,
    updateStatus,
    toggleComplete,
    updateNotes,
    addJob,
  };
}
