import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { name, email, message, website } = await req.json();

    // Honeypot bot protection
    if (website) {
      return NextResponse.json({ success: true, message: "Spam detected." }, { status: 200 });
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nama, email, dan pesan wajib diisi." },
        { status: 400 }
      );
    }

    // Insert message into Supabase
    const { data, error } = await supabase
      .from("messages")
      .insert([
        {
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        },
      ])
      .select();

    if (error) {
      console.error("Supabase message insert error:", error);
      return NextResponse.json(
        { error: "Gagal menyimpan pesan ke database." },
        { status: 500 }
      );
    }

    // Optional: Resend integration if key is provided in environment
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Portfolio Chamdan <noreply@chamdan.site>",
            to: ["ahmadchamdan03@gmail.com"],
            subject: `Pesan Baru dari ${name} via chamdan.site`,
            html: `
              <div style="font-family: sans-serif; padding: 20px; color: #1c1917;">
                <h2>Pesan Baru di Website Portfolio</h2>
                <p><strong>Pengirim:</strong> ${name} (&lt;${email}&gt;)</p>
                <p><strong>Pesan:</strong></p>
                <div style="background: #f5f5f4; padding: 15px; border-radius: 8px;">
                  ${message.replace(/\n/g, "<br/>")}
                </div>
              </div>
            `,
          }),
        });
      } catch (mailErr) {
        console.error("Resend delivery notice:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Pesan Anda telah berhasil disampaikan.",
      data,
    });
  } catch (err: unknown) {
    console.error("send-email route error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
