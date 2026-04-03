# GP Specialty Production Dashboard — Roadmap

## What This Is

A web-based production tracking dashboard for General Public LLC's specialty print studio. It replaces the manual process of printing physical production tickets on colored paper, and gives the team a shared, collaborative view of what's in production, what's coming up, and what needs attention.

The dashboard is backed by a Notion database — all data lives in Notion and syncs both ways. The website is a visual layer with metrics, charts, and quick editing.

## Phase 1 (Current) — Specialty Production

Focused on jobs that don't come from Acumatica or don't need full ERP setup: samples, test prints, digital work, custom orders, and other specialty jobs.

### What's Built
- **Dashboard** — Status cards (Queued, In Progress, Overdue, Rush), donut charts for job status and proof status, customer breakdown, weekly throughput, deadline timeline
- **Jobs Table** — Filterable by status, priority, proof status, job type. Sortable. Inline status editing. Click to expand full detail modal
- **Job Detail Modal** — All fields visible, editable status/priority/proof status, notes, clickable file links, special instructions highlighted
- **New Job Form** — Grouped fields: Job Info, File & Proofing, Instructions. Supports all specialty fields
- **PDF Import** — Drag-and-drop Acumatica PDFs with preview before creating (de-emphasized in Phase 1)
- **Email Notifications** — Pings factorytechs@generalpublic.art when jobs are added
- **Notion Sync** — All data reads/writes to Notion. Auto-refreshes every 30 seconds

### Job Fields
| Field | Purpose |
|---|---|
| Job Name | Title / description |
| Job Type | Sample, Test Print, Digital Work, Custom Order, Production Order |
| Customer | Client name |
| Priority | Normal, Rush, Hot Rush |
| Status | Queued, In Progress, Done |
| Deadline | Due date |
| Qty to Produce | Quantity |
| Substrate | Print material |
| File Link | URL to print file (Dropbox, Drive, etc.) |
| Proof Status | Not Started, Proof Sent, Approved, Revision Needed |
| Color Profile | ICC profile / color notes |
| RIP Notes | Print settings, resolution, passes |
| Special Instructions | Special handling, finishing details |
| Notes | Free-form notes |
| Workcenters | SHIP TO CALI, CALIFINISH, SWISSQ, CUT, INCA, etc. |
| Completed | Checkbox |

## Phase 2 — Acumatica Integration

Bring production ticket tracking back with tighter Acumatica integration.

- **PDF Upload refinement** — Better parsing for all Acumatica ticket formats, batch processing
- **Acumatica API integration** — Direct sync instead of PDF parsing (if API access is available)
- **Production order fields** — Production Nbr, Order Nbr, Customer PO, Line Items
- **Colored paper mapping** — Auto-determine which color paper to print based on job type/customer

## Future Ideas

These are features we've discussed or that would add value. Not committed to any timeline — pick what matters most and build it.

### Collaboration & Communication
- **Slack/SMS notifications** — In addition to email, ping a Slack channel or text when jobs are added or go overdue
- **Due date warnings** — Automated alerts 1 day before deadline, day-of, and when overdue
- **Customer portal** — Read-only view for clients to check their order status via a shareable link

### Shop Floor
- **Kanban board view** — Drag-and-drop cards between status columns (Queued → In Progress → Done)
- **Photo proof upload** — Technicians snap a photo of the finished piece, attach to the job record
- **Barcode/QR labels** — Generate printable labels with job details + QR code linking back to the dashboard
- **Mobile app / PWA** — Installable on phones for shop floor use without a full browser

### Analytics & Reporting
- **Analytics page** — Throughput trends, average turnaround time, on-time delivery rate
- **Time tracking** — Clock in/out on jobs for labor cost tracking
- **Capacity planning** — Visualize workload by workcenter to spot bottlenecks

### Operations
- **Recurring jobs** — Templates for repeat orders
- **Auto-assignment** — Route jobs to technicians based on skill/workload
- **Inventory tracking** — Substrate stock levels, low-stock alerts
- **Multi-location support** — If GP expands to multiple studios

## Tech Stack
- Next.js 16 (App Router) + Tailwind CSS + Recharts
- Notion API (backend database)
- Resend (email notifications)
- Vercel (hosting, auto-deploys from GitHub)

## Contributing
The repo is public. Fork it, make changes, submit PRs. Environment setup is in the README.
