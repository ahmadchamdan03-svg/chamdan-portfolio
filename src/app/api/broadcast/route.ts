import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Judul siaran dan isi pesan wajib diisi." },
        { status: 400 }
      );
    }

    // Fetch all subscriber emails
    const { data: subscribers, error: fetchErr } = await supabase
      .from("subscribers")
      .select("email");

    if (fetchErr) {
      return NextResponse.json(
        { error: "Gagal mengambil daftar pelanggan." },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { error: "Belum ada email yang terdaftar dalam daftar pelanggan." },
        { status: 400 }
      );
    }

    const recipientEmails = subscribers.map((s) => s.email);

    // Optional: Send via Resend if RESEND_API_KEY is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails/batch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify(
            recipientEmails.map((email) => ({
              from: "Ahmad Chamdan Yuwafin <newsletter@chamdan.site>",
              to: [email],
              subject: title,
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1c1917; line-height: 1.6;">
                  <h2 style="color: #064e3b; font-family: serif; font-size: 24px;">${title}</h2>
                  <div style="margin-top: 16px; font-size: 15px; color: #44403c;">
                    ${content.replace(/\n/g, "<br/>")}
                  </div>
                  <hr style="margin-top: 32px; border: none; border-top: 1px solid #e7e5e4;" />
                  <p style="font-size: 12px; color: #a8a29e;">
                    Anda menerima email ini karena berlangganan buletin di chamdan.site.
                  </p>
                </div>
              `,
            }))
          ),
        });
      } catch (err) {
        console.error("Batch email broadcast warning:", err);
      }
    }

    return NextResponse.json({
      success: true,
      recipientsCount: recipientEmails.length,
      message: `Siaran berhasil diproses untuk ${recipientEmails.length} pelanggan.`,
    });
  } catch (err: unknown) {
    console.error("Broadcast route error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
