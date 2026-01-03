import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      to,
      itemName,
      requesterName,
      requesterEmail,
    } = body;

    // ✅ STRONG VALIDATION (VERY IMPORTANT)
    if (
      !to ||
      typeof to !== "string" ||
      !itemName ||
      !requesterEmail
    ) {
      return NextResponse.json(
        { error: "Invalid or missing email data" },
        { status: 400 }
      );
    }

    // ❌ Prevent self-email
    if (to === requesterEmail) {
      return NextResponse.json(
        { error: "You cannot request your own item" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "FINDOOR <onboarding@resend.dev>", // Free tier OK
      to: to, // ✅ MUST BE STRING, NOT ARRAY
      subject: `FINDOOR: Request for your item "${itemName}"`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #334155;">
          <h2 style="color: #2563eb;">Hello!</h2>

          <p>
            Someone on the <b>MIT ADT Campus</b> has shown interest in your item:
            <b>${itemName}</b>.
          </p>

          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><b>Requester Name:</b> ${requesterName || "Student"}</p>
            <p><b>Requester Email:</b> ${requesterEmail}</p>
          </div>

          <p>Please reply directly to coordinate the return.</p>

          <footer style="margin-top: 40px; font-size: 12px; color: #94a3b8;">
            Sent via <b>FINDOOR</b> – Smart Lost & Found Platform
          </footer>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Server Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
