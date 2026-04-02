import { NextResponse } from "next/server";
import { getAllJobs, createJob } from "@/lib/notion";
import { notifyNewJob } from "@/lib/email";

export async function GET() {
  try {
    const jobs = await getAllJobs();
    return NextResponse.json(jobs);
  } catch (err) {
    console.error("Failed to fetch jobs:", err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const job = await createJob(body);
    notifyNewJob(job).catch(() => {}); // fire and forget
    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error("Failed to create job:", err);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
