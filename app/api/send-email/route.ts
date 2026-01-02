import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, itemName, requesterName, requesterEmail } = await req.json();

    const { data, error } = await resend.emails.send({
      from: 'FINDOOR <onboarding@resend.dev>', // Free tier uses this domain
      to: [to],
      subject: `FINDOOR: Request for your item "${itemName}"`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #334155;">
          <h2 style="color: #2563eb;">Hello!</h2>
          <p>Someone on the <b>MIT ADT Campus</b> has inquired about your item: <b>${itemName}</b>.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><b>Requester:</b> ${requesterName}</p>
            <p><b>Contact Email:</b> ${requesterEmail}</p>
          </div>
          <p>Please reply to this student directly to coordinate the return.</p>
          <footer style="margin-top: 40px; font-size: 12px; color: #94a3b8;">
            Sent via FINDOOR - Smart Lost & Found Platform
          </footer>
        </div>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 400 });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}