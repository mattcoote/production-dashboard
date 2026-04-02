import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID!;
// The data source (collection) ID for querying — newer Notion SDK uses dataSources.query
const dataSourceId = "e6de7e3f-1515-4bfd-af2a-f5cb1b956a81";

export interface Job {
  id: string;
  jobName: string;
  productionNbr: string;
  status: "Queued" | "In Progress" | "Done";
  jobType: string;
  customer: string;
  orderNbr: string;
  customerPO: string;
  substrate: string;
  qtyToProduce: number;
  orderDate: string | null;
  deadline: string | null;
  workcenters: string[];
  lineItems: string;
  notes: string;
  completed: boolean;
  notionUrl: string;
}

function getText(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop];
  if (!p) return "";
  if (p.type === "rich_text") return p.rich_text.map((t) => t.plain_text).join("");
  if (p.type === "title") return p.title.map((t) => t.plain_text).join("");
  return "";
}

function getSelect(page: PageObjectResponse, prop: string): string {
  const p = page.properties[prop];
  if (p?.type === "select" && p.select) return p.select.name;
  return "";
}

function getMultiSelect(page: PageObjectResponse, prop: string): string[] {
  const p = page.properties[prop];
  if (p?.type === "multi_select") return p.multi_select.map((s) => s.name);
  return [];
}

function getNumber(page: PageObjectResponse, prop: string): number {
  const p = page.properties[prop];
  if (p?.type === "number" && p.number !== null) return p.number;
  return 0;
}

function getDate(page: PageObjectResponse, prop: string): string | null {
  const p = page.properties[prop];
  if (p?.type === "date" && p.date) return p.date.start;
  return null;
}

function getCheckbox(page: PageObjectResponse, prop: string): boolean {
  const p = page.properties[prop];
  if (p?.type === "checkbox") return p.checkbox;
  return false;
}

function pageToJob(page: PageObjectResponse): Job {
  return {
    id: page.id,
    jobName: getText(page, "Job Name"),
    productionNbr: getText(page, "Production Nbr"),
    status: getSelect(page, "Status") as Job["status"] || "Queued",
    jobType: getSelect(page, "Job Type"),
    customer: getText(page, "Customer"),
    orderNbr: getText(page, "Order Nbr"),
    customerPO: getText(page, "Customer PO"),
    substrate: getText(page, "Substrate"),
    qtyToProduce: getNumber(page, "Qty to Produce"),
    orderDate: getDate(page, "Order Date"),
    deadline: getDate(page, "Deadline"),
    workcenters: getMultiSelect(page, "Workcenter"),
    lineItems: getText(page, "Line Items"),
    notes: getText(page, "Notes"),
    completed: getCheckbox(page, "Completed"),
    notionUrl: page.url,
  };
}

export async function getAllJobs(): Promise<Job[]> {
  const pages: PageObjectResponse[] = [];
  let cursor: string | undefined;

  do {
    const params: { data_source_id: string; page_size: number; start_cursor?: string } = {
      data_source_id: dataSourceId,
      page_size: 100,
    };
    if (cursor) params.start_cursor = cursor;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await (notion.dataSources as any).query(params);
    for (const page of res.results) {
      if ("properties" in page) pages.push(page as PageObjectResponse);
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages.map(pageToJob);
}

export async function updateJobStatus(
  pageId: string,
  status: string
): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Status: { select: { name: status } },
    },
  });
}

export async function updateJobCompleted(
  pageId: string,
  completed: boolean
): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Completed: { checkbox: completed },
    },
  });
}

export async function updateJobNotes(
  pageId: string,
  notes: string
): Promise<void> {
  await notion.pages.update({
    page_id: pageId,
    properties: {
      Notes: {
        rich_text: [{ type: "text", text: { content: notes } }],
      },
    },
  });
}

export async function createJob(data: {
  jobName: string;
  jobType: string;
  customer: string;
  deadline: string | null;
  qtyToProduce: number;
  substrate: string;
  notes: string;
  productionNbr?: string;
  orderNbr?: string;
  customerPO?: string;
  orderDate?: string | null;
  workcenters?: string[];
  lineItems?: string;
}): Promise<Job> {
  const properties: Record<string, unknown> = {
    "Job Name": { title: [{ text: { content: data.jobName } }] },
    "Job Type": { select: { name: data.jobType } },
    Status: { select: { name: "Queued" } },
    Customer: {
      rich_text: [{ type: "text", text: { content: data.customer } }],
    },
    "Qty to Produce": { number: data.qtyToProduce },
    Substrate: {
      rich_text: [{ type: "text", text: { content: data.substrate } }],
    },
    Notes: {
      rich_text: [{ type: "text", text: { content: data.notes || "" } }],
    },
    Completed: { checkbox: false },
  };

  if (data.deadline) {
    properties["Deadline"] = { date: { start: data.deadline } };
  }
  if (data.productionNbr) {
    properties["Production Nbr"] = {
      rich_text: [{ type: "text", text: { content: data.productionNbr } }],
    };
  }
  if (data.orderNbr) {
    properties["Order Nbr"] = {
      rich_text: [{ type: "text", text: { content: data.orderNbr } }],
    };
  }
  if (data.customerPO) {
    properties["Customer PO"] = {
      rich_text: [{ type: "text", text: { content: data.customerPO } }],
    };
  }
  if (data.orderDate) {
    properties["Order Date"] = { date: { start: data.orderDate } };
  }
  if (data.workcenters?.length) {
    properties["Workcenter"] = {
      multi_select: data.workcenters.map((name) => ({ name })),
    };
  }
  if (data.lineItems) {
    properties["Line Items"] = {
      rich_text: [{ type: "text", text: { content: data.lineItems } }],
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: properties as any,
  });

  return pageToJob(res as PageObjectResponse);
}
