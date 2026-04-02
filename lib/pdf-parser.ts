import { extractText } from "unpdf";

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

function parseDate(str: string): string | null {
  const match = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return null;
  const [, m, d, y] = match;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

function parseOrderBlock(text: string): ParsedOrder {
  // unpdf concatenates fields without whitespace, e.g.:
  // "Production Nbr.: 00015563 Customer: RHVO: Order Date: 3/30/2026"
  // "Order Nbr: 003876Substrate: Start Date: 5/15/2026"
  // We need specific regex patterns that handle these concatenations.

  // Production Nbr — digits after "Production Nbr.:"
  const prodNbrMatch = text.match(/Production Nbr\.?:?\s*(\d+)/);
  const productionNbr = prodNbrMatch?.[1] || "";

  // Customer — word(s) between "Customer:" and next known label
  const customerMatch = text.match(/Customer:\s*([A-Z0-9][A-Z0-9 ]*?)(?=VO:|$)/m);
  const customer = customerMatch?.[1]?.trim() || "";

  // Order Date — date after "Order Date:"
  const orderDateMatch = text.match(/Order Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
  const orderDate = orderDateMatch ? parseDate(orderDateMatch[1]) : null;

  // Inventory ID — alphanumeric+dash pattern after "Inventory ID:"
  const invMatch = text.match(/Inventory ID:\s*([A-Z0-9][\w-]+)/);
  const inventoryId = invMatch?.[1] || "";

  // Order Nbr — digits after "Order Nbr:"
  const orderNbrMatch = text.match(/Order Nbr:\s*(\d+)/);
  const orderNbr = orderNbrMatch?.[1] || "";

  // Start Date
  const startDateMatch = text.match(/Start Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
  const startDate = startDateMatch ? parseDate(startDateMatch[1]) : null;

  // End Date
  const endDateMatch = text.match(/End Date:\s*(\d{1,2}\/\d{1,2}\/\d{4})/);
  const endDate = endDateMatch ? parseDate(endDateMatch[1]) : null;

  // Customer PO Nbr — digits after "Customer PO Nbr."
  const poMatch = text.match(/Customer PO Nbr\.?\s*(\d+)/);
  const customerPO = poMatch?.[1] || "";

  // Qty to Produce
  const qtyMatch = text.match(/Qty to Prod:\s*(\d+(?:\.\d+)?)/);
  const qtyToProduce = qtyMatch ? parseFloat(qtyMatch[1]) : 0;

  // Substrate — the line after Inventory ID line, before "Customer PO"
  let substrate = "";
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Inventory ID")) {
      const nextLine = lines[i + 1]?.trim();
      if (nextLine && !nextLine.startsWith("Qty") && !nextLine.startsWith("Operation")) {
        // Take up to "Customer PO" or "Frame Type"
        substrate = nextLine.replace(/Customer PO.*$/, "").replace(/Frame Type.*$/, "").trim();
      }
    }
  }

  // Workcenters
  const workcenters: string[] = [];
  if (text.includes("SHIP TO CALI")) workcenters.push("SHIP TO CALI");
  if (text.includes("CALIFINISH")) workcenters.push("CALIFINISH");
  // Generic: 4-digit op number followed by uppercase workcenter name
  const wcMatches = text.matchAll(/^(\d{4})\s+([A-Z][A-Z\s]+?)$/gm);
  for (const m of wcMatches) {
    const wc = m[2].trim();
    if (wc && !workcenters.includes(wc)) workcenters.push(wc);
  }

  // Line items — everything in operation sections after the headers
  const lineItemParts: string[] = [];
  const opSections = text.split(/Operation\s+Workcenter/i).slice(1);
  for (const sec of opSections) {
    const secLines = sec.split("\n").map((l) => l.trim()).filter(Boolean);
    const firstLine = secLines[0];
    if (!firstLine) continue;

    // First line has "Inventory Item Description Qty To Produce" or the op line
    const opMatch = firstLine.match(/^(\d{4})\s+(.+)/);
    if (opMatch) {
      lineItemParts.push(`Op ${opMatch[1]}: ${opMatch[2]}`);
    }

    for (let i = 1; i < secLines.length; i++) {
      const line = secLines[i];
      if (
        line &&
        !line.startsWith("Inventory Item") &&
        !line.match(/^Description\b/) &&
        !line.match(/^Qty To/)
      ) {
        lineItemParts.push(`  - ${line}`);
      }
    }
  }

  return {
    productionNbr,
    inventoryId,
    substrate,
    customer,
    orderNbr,
    customerPO,
    orderDate,
    startDate,
    endDate: endDate,
    qtyToProduce,
    workcenters,
    lineItems: lineItemParts.join("\n"),
  };
}

export async function parsePDF(buffer: Buffer): Promise<ParsedOrder[]> {
  const uint8 = new Uint8Array(buffer);
  const result = await extractText(uint8);

  const orders: ParsedOrder[] = [];
  for (const pageText of result.text) {
    if (pageText.includes("Production Ticket") || pageText.includes("Production Nbr")) {
      orders.push(parseOrderBlock(pageText));
    }
  }

  return orders;
}

export type { ParsedOrder };
