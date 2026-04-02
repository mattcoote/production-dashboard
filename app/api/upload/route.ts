import { NextResponse } from "next/server";
import { parsePDF } from "@/lib/pdf-parser";
import { createJob } from "@/lib/notion";
import { notifyBatchJobs } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const orders = await parsePDF(buffer);

    // Check if client just wants to preview (don't create in Notion yet)
    const preview = formData.get("preview") === "true";

    if (preview) {
      return NextResponse.json({ orders });
    }

    // Create jobs in Notion
    const jobs = [];
    for (const order of orders) {
      const job = await createJob({
        jobName: order.inventoryId
          ? `${order.inventoryId} — ${order.substrate}`
          : order.substrate || "Untitled Order",
        jobType: "Production Order",
        customer: order.customer,
        deadline: order.endDate,
        qtyToProduce: order.qtyToProduce,
        substrate: order.substrate,
        notes: "",
        productionNbr: order.productionNbr,
        orderNbr: order.orderNbr,
        customerPO: order.customerPO,
        orderDate: order.orderDate,
        workcenters: order.workcenters,
        lineItems: order.lineItems,
      });
      jobs.push(job);
    }

    notifyBatchJobs(jobs.length).catch(() => {}); // fire and forget
    return NextResponse.json({ orders, jobs }, { status: 201 });
  } catch (err) {
    console.error("Failed to process PDF:", err);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
