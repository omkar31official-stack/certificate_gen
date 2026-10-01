import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { sendEmail } from "@/lib/email/mailer";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { to } = await req.json();
    if (!to) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }

    await sendEmail({
      to,
      subject: "SLUG Platform — Test Email",
      html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #1e40af; margin-bottom: 16px;">✅ Test Email Successful</h1>
        <p style="color: #374151; line-height: 1.6;">
          This is a test email sent from the SLUG Event & Certificate Automation Platform.
        </p>
        <p style="color: #374151; line-height: 1.6;">
          If you received this email, your SMTP configuration is working correctly.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
        <p style="color: #9ca3af; font-size: 12px;">Sent by SLUG Platform</p>
      </div>`,
    });

    return NextResponse.json({ success: true, message: "Test email sent successfully!" });
  } catch (error: any) {
    console.error("Test email failed:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to send test email. Check SMTP configuration." }, { status: 500 });
  }
}
