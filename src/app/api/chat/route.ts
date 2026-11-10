import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = `Anda adalah "Khadim AI", asisten kecerdasan buatan resmi untuk website portofolio Ahmad Chamdan Yuwafin (Kang Chamdan).
Karakter Anda: Sopan, tawadhu, cerdas, beradab santri pesantren (sering menyapa dengan "Assalamu'alaikum" atau "Afwan", menggunakan istilah santri secara tepat), namun sangat berwawasan teknologi modern (Next.js 16, Supabase, AI, Python).
Fakta tentang Kang Chamdan:
- Identitas: Santri Pondok Pesantren Lirboyo Kediri dan Mahasantri Ma'had Aly Lirboyo (Takhassus Fiqh wa Ushuluh).
- Julukan: Khadimul Ilmi & AI-Driven Full-Stack Web Developer.
- Portofolio Utama:
  1. Sistem Presensi & Live Scanner Gerbang Haflah (3.500+ tamu, Supabase RLS, QR offline-sync).
  2. Portal Wisuda Akbar & AI Guide A'lawna.
  3. Bazar Stan Muktamar NU Ke-35 Dzaween Press.
  4. Undangan Digital Interaktif Wali Santri.
- Kontak: Email ahmadchamdan03@gmail.com, WhatsApp 0821-3271-7015, Domisili di Kediri, Jawa Timur.
Tugas Anda: Jawab pertanyaan pengunjung secara ringkas, ramah, dan solutif.`;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: systemPrompt },
                    { text: `Pertanyaan pengunjung: "${lastUserMessage}"` },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        const replyText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Afwan, sistem AI sedang mengolah jawaban.";
        return NextResponse.json({ reply: replyText });
      } catch (geminiErr) {
        console.error("Gemini fetch error, using graceful fallback:", geminiErr);
      }
    }

    // Graceful fallback response when API key is not yet set or network issue
    const lower = lastUserMessage.toLowerCase();
    let reply =
      "Assalamu'alaikum wr. wb. Saya Khadim AI, asisten Kang Chamdan. Ada yang bisa saya bantu terkait profil beliau, proyek digital santri, atau risalah keilmuannya?";

    if (lower.includes("siapa") || lower.includes("tentang") || lower.includes("profil") || lower.includes("chamdan")) {
      reply =
        "Ahmad Chamdan Yuwafin (Kang Chamdan) adalah Santri Pondok Pesantren Lirboyo Kediri dan Mahasantri Ma'had Aly Lirboyo yang memadukan khazanah turats klasik (Fikih & Ushul Fikih) dengan arsitektur web modern (Next.js 16, Supabase, AI Automation).";
    } else if (lower.includes("proyek") || lower.includes("karya") || lower.includes("portfolio")) {
      reply =
        "Kang Chamdan telah membangun beberapa sistem unggulan, di antaranya: 1) Sistem Presensi & Live Scanner Gerbang Haflah (3.500+ wali santri), 2) Portal Wisuda Akbar & AI Guide A'lawna, 3) Sistem Kasir Bazar Stan Muktamar NU Ke-35, dan 4) Undangan Digital Interaktif.";
    } else if (lower.includes("kontak") || lower.includes("wa") || lower.includes("hubungi") || lower.includes("email")) {
      reply =
        "Anda dapat menghubungi Kang Chamdan langsung via WhatsApp di 0821-3271-7015 atau email di ahmadchamdan03@gmail.com. Beliau sangat terbuka untuk kolaborasi sistem digital dan musyawarah ilmiah.";
    } else if (lower.includes("cv") || lower.includes("resume")) {
      reply =
        "Anda dapat mengunduh CV resmi Kang Chamdan langsung melalui tombol 'Unduh CV' di bagian atas halaman atau mengunjungi endpoint /api/cv.";
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada layanan AI Chat." },
      { status: 500 }
    );
  }
}
