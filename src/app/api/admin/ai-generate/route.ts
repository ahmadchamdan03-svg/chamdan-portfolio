import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, type } = await req.json();

    if (!title) {
      return NextResponse.json({ error: "Judul wajib diisi" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful fallback dummy generator if API key not yet set in local environment
      if (type === "project") {
        return NextResponse.json({
          description: `Sistem digital terintegrasi ${title} untuk otomatisasi operasional dan tata kelola data pesantren modern.`,
          long_description: `${title} dirancang sebagai solusi arsitektur perangkat lunak mutakhir yang menjawab kompleksitas administrasi kepesantrenan. Dibangun menggunakan Next.js 16, Supabase PostgreSQL, dan Row Level Security untuk menjamin kecepatan pemrosesan data tinggi dan keandalan sistem tanpa jeda.`,
          tech_stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Row Level Security", "Vercel"],
        });
      } else {
        return NextResponse.json({
          category: "Fikih & Teknologi Kontemporer",
          summary: `Kajian mendalam mengenai ${title} dari sudut pandang ushul fikih klasik dan etika rekayasa kecerdasan buatan.`,
          content: `## Pendahuluan\n\nKajian mengenai ${title} menempati posisi strategis dalam diskursus keilmuan kontemporer pesantren.\n\n## Dialektika Turats & Realitas\n\nPara ulama ushul menetapkan kaidah bahwa hukum senantiasa berputar bersama 'illat-nya (*al-hukmu yaduru ma'a 'illatihi*). Dalam konteks digitalisasi saat ini, integrasi nilai etika Islam menjadi fondasi mutlak.\n\n## Kesimpulan\n\nHarmonisasi antara khazanah kitab salaf dan disiplin sains modern membuktikan bahwa nilai turats senantiasa relevan melintasi zaman.`,
        });
      }
    }

    const prompt =
      type === "project"
        ? `Sebagai AI copywriter arsitektur software dan santri developer untuk Ahmad Chamdan Yuwafin, buatkan konten proyek portofolio profesional untuk judul: "${title}".
Kembalikan HANYA format JSON valid tanpa tanda kutip markdown (raw JSON):
{
  "description": "Ringkasan proyek 1-2 kalimat fokus pada solusi nyata dan kapasitas",
  "long_description": "Penjelasan studi kasus mendalam 2-3 paragraf mencakup latar belakang, arsitektur teknis Next.js/Supabase, dan dampak operasional",
  "tech_stack": ["Teknologi1", "Teknologi2", "Teknologi3", "Teknologi4", "Teknologi5"]
}`
        : `Sebagai penulis risalah ilmiah santri Ma'had Aly Lirboyo untuk Ahmad Chamdan Yuwafin, buatkan draf artikel ilmiah untuk judul: "${title}".
Kembalikan HANYA format JSON valid tanpa tanda kutip markdown (raw JSON):
{
  "category": "Kategori yang relevan (misal: Fikih Kontemporer / Ushul Fikih / Etika AI)",
  "summary": "Ringkasan risalah 1-2 kalimat berbobot ilmiah",
  "content": "Isi risalah lengkap berformat Markdown dengan heading ##, dalil/kaidah ushul fiqih, dan analisis santri beradab"
}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          },
        }),
      }
    );

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Respon kosong dari Gemini AI");
    }

    const parsed = JSON.parse(rawText);
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal generate konten dengan AI";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}