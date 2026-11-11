import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastUserMessage = messages[messages.length - 1]?.content || "";

    const apiKey = process.env.GEMINI_API_KEY;

    // --- FASE 46: RAG (Retrieval-Augmented Generation) Live Database Search ---
    let retrievedContext = "";
    try {
      const [projRes, writRes, eduRes, expRes] = await Promise.all([
        supabase.from("projects").select("title, description, tech_stack"),
        supabase.from("writings").select("title, category, summary, slug"),
        supabase.from("education").select("institution, level, period, notes"),
        supabase.from("experience").select("organization, period, roles"),
      ]);

      const projects = projRes.data || [];
      const writings = writRes.data || [];
      const education = eduRes.data || [];
      const experience = expRes.data || [];

      retrievedContext = `
[DATA LANGSUNG DARI DATABASE SUPABASE TERKINI]:
- PROYEK STUDI KASUS:
${projects.map((p) => `  * ${p.title}: ${p.description} (Tech: ${Array.isArray(p.tech_stack) ? p.tech_stack.join(", ") : p.tech_stack})`).join("\n")}

- RISALAH ILMIAH & KARYA TULIS:
${writings.map((w) => `  * ${w.title} [Kategori: ${w.category}]: ${w.summary || "Kajian dialektika turats dan teknologi"} (Slug: /writings/${w.slug})`).join("\n")}

- RIWAYAT PENDIDIKAN & SANAD (11 Jenjang):
${education.map((e) => `  * ${e.institution} (${e.period}) - ${e.level}: ${e.notes}`).join("\n")}

- PENGALAMAN & KEPEMIMPINAN:
${experience.map((ex) => `  * ${ex.organization} (${ex.period}): ${Array.isArray(ex.roles) ? ex.roles.join("; ") : ex.roles}`).join("\n")}
`;
    } catch (dbErr) {
      console.warn("RAG retrieval fallback to standard prompt:", dbErr);
    }

    const systemPrompt = `Anda adalah "Usth. Halwaa" (Khadim AI), asisten kecerdasan buatan resmi untuk website portofolio Ahmad Chamdan Yuwafin (Kang Chamdan).
Karakter Anda: Sopan, tawadhu, cerdas, beradab santri pesantren (sering menyapa dengan "Assalamu'alaikum" atau "Afwan", menggunakan istilah santri secara tepat), namun sangat menguasai rekayasa teknologi modern (Next.js 16, Supabase, AI, Python).
Identitas Kang Chamdan:
- Santri Pondok Pesantren Lirboyo Kediri dan Mahasantri Ma'had Aly Lirboyo (Takhassus Fiqh wa Ushuluh).
- Julukan: Khadimul Ilmi & AI-Driven Full-Stack Web Developer.
- Kontak: Email ahmadchamdan03@gmail.com, WhatsApp 0858-9915-1685, Domisili di Kediri, Jawa Timur.

Gunakan data nyata dari database berikut ini untuk menjawab pertanyaan pengunjung secara akurat:
${retrievedContext}

Aturan Menjawab:
- Jawab secara ringkas, ramah, jujur, dan beradab.
- Jika pengunjung menanyakan proyek spesifik, jelaskan detail teknis dan dampaknya berdasarkan data database di atas.
- Jika pengunjung menanyakan sanad atau pendidikan, sebutkan riwayat aslinya dari Lirboyo.`;

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
        "Anda dapat menghubungi Kang Chamdan langsung via WhatsApp di 0858-9915-1685 atau email di ahmadchamdan03@gmail.com. Beliau sangat terbuka untuk kolaborasi sistem digital dan musyawarah ilmiah.";
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
