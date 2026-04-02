# GP Production Dashboard

Production tracking dashboard for General Public LLC. Reads and writes to a Notion database, with visual metrics, job management, and PDF upload for Acumatica production orders.

## Features

- **Dashboard** — Status cards, donut/bar/area charts, deadline timeline
- **Jobs Table** — Filterable, sortable, with inline status editing
- **Add Job** — Quick form for samples, test prints, digital work
- **Upload PDF** — Drag-and-drop Acumatica Production Order PDFs, auto-parse and push to Notion
- **Email Notifications** — Pings the team when new jobs are added

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS
- Recharts
- Notion API (backend)
- Resend (email notifications)
- Vercel (hosting)

## Setup

1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill in your keys:
   ```
   NOTION_API_KEY=your_notion_integration_token
   NOTION_DATABASE_ID=your_database_id
   RESEND_API_KEY=your_resend_api_key (optional)
   NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
   ```
4. `npm run dev`

## Notion Setup

1. Create an integration at https://www.notion.so/my-integrations
2. Share the Production Tracker database with your integration
3. Use the database ID from the URL as `NOTION_DATABASE_ID`

## Email Setup (Optional)

1. Create a free account at https://resend.com
2. Get your API key and add as `RESEND_API_KEY`
3. Verify your domain to send from your own address (otherwise uses Resend's test sender)

## Deploy to Vercel

1. Push to GitHub
2. Import at https://vercel.com/new
3. Add environment variables in Vercel project settings
4. Deploy
