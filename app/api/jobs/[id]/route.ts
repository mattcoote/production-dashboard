import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { updateJobStatus, updateJobCompleted, updateJobNotes } from "@/lib/notion";

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/jobs/[id]">
) {
  try {
    const { id } = await ctx.params;
    const body = await req.json();

    if (body.status !== undefined) {
      await updateJobStatus(id, body.status);
    }
    if (body.completed !== undefined) {
      await updateJobCompleted(id, body.completed);
    }
    if (body.notes !== undefined) {
      await updateJobNotes(id, body.notes);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update job:", err);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}
