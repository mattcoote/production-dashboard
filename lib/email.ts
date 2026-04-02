import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const NOTIFY_EMAIL = "factorytechs@generalpublic.art";

// Use Resend's default sender until you verify your domain
const FROM_EMAIL = process.env.EMAIL_FROM || "GP Production <onboarding@resend.dev>";

export async function notifyNewJob(job: {
  jobName: string;
  customer: string;
  deadline: string | null;
  jobType: string;
  substrate: string;
  qtyToProduce: number;
  productionNbr?: string;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  const deadlineStr = job.deadline
    ? new Date(job.deadline).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    : "No deadline";

  const subject = `New Job: ${job.productionNbr ? `#${job.productionNbr} — ` : ""}${job.jobName}`;

  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 500px;">
      <h2 style="margin: 0 0 16px; color: #1a1a2e;">New Production Job</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 8px 12px; color: #666; border-bottom: 1px solid #eee;">Job</td>
          <td style="padding: 8px 12px; font-weight: 600; border-bottom: 1px solid #eee;">${job.jobName}</td>
        </tr>
        ${job.productionNbr ? `<tr>
          <td style="padding: 8px 12px; color: #666; border-bottom: 1px solid #eee;">Production #</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${job.productionNbr}</td>
        </tr>` : ""}
        <tr>
          <td style="padding: 8px 12px; color: #666; border-bottom: 1px solid #eee;">Type</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${job.jobType}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; color: #666; border-bottom: 1px solid #eee;">Customer</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${job.customer}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; color: #666; border-bottom: 1px solid #eee;">Substrate</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${job.substrate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; color: #666; border-bottom: 1px solid #eee;">Qty</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${job.qtyToProduce}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; color: #666;">Deadline</td>
          <td style="padding: 8px 12px; font-weight: 600;">${deadlineStr}</td>
        </tr>
      </table>
      <p style="margin-top: 16px; font-size: 12px; color: #999;">
        View all jobs on the <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/jobs">Production Dashboard</a>
      </p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send email notification:", err);
  }
}

export async function notifyBatchJobs(count: number) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping email notification");
    return;
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `${count} New Production Order(s) Added`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 500px;">
          <h2 style="margin: 0 0 12px; color: #1a1a2e;">${count} New Job(s) Added</h2>
          <p style="color: #444; font-size: 14px;">
            ${count} production order(s) were just uploaded via PDF and added to the tracker.
          </p>
          <p style="margin-top: 16px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/jobs"
               style="display: inline-block; padding: 10px 20px; background: #3b82f6; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
              View Jobs
            </a>
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send batch email notification:", err);
  }
}
