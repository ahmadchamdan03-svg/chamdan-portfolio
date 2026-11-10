import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Nama, email, dan pesan wajib disertakan." },
        { status: 400 }
      );
    }

    const fonnteToken = process.env.FONNTE_TOKEN;
    if (!fonnteToken) {
      console.warn("FONNTE_TOKEN environment variable is not defined.");
      return NextResponse.json(
        { error: "Konfigurasi token Fonnte belum dipasang di server." },
        { status: 500 }
      );
    }

    // Format pesan WhatsApp yang rapi dan profesional
    const formattedMessage = [
      "*🔔 NOTIFIKASI PESAN BARU - CHAMDAN.SITE*",
      "────────────────────────",
      `👤 *Nama Pengirim:* ${name.trim()}`,
      `📧 *Alamat Email:* ${email.trim()}`,
      `📅 *Waktu:* ${new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })} WIB`,
      "",
      "💬 *Isi Pesan:*",
      `"${message.trim()}"`,
      "────────────────────────",
      "_Sistem Notifikasi Otomatis Fonnte Gateway_",
    ].join("\n");

    const formData = new FormData();
    formData.append("target", "6285899151685");
    formData.append("message", formattedMessage);
    formData.append("countryCode", "62");

    const fonnteRes = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: fonnteToken,
      },
      body: formData,
    });

    const resJson = await fonnteRes.json().catch(() => null);

    if (!fonnteRes.ok || (resJson && resJson.status === false)) {
      console.error("Fonnte API error:", resJson || fonnteRes.statusText);
      return NextResponse.json(
        {
          error: "Gagal mengirimkan notifikasi via Fonnte API.",
          details: resJson?.reason || fonnteRes.statusText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Notifikasi WhatsApp berhasil dikirimkan.",
      result: resJson,
    });
  } catch (error: unknown) {
    console.error("send-wa route error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal saat memproses kiriman WhatsApp." },
      { status: 500 }
    );
  }
}
