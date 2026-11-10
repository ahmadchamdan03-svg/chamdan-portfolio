import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import CVDocument from "@/components/pdf/CVDocument";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const [profileRes, eduRes, expRes, projRes, skillRes] = await Promise.all([
      supabase.from("profile").select("*").single(),
      supabase.from("education").select("*").order("created_at", { ascending: true }),
      supabase.from("experience").select("*").order("created_at", { ascending: true }),
      supabase.from("projects").select("*").order("created_at", { ascending: true }),
      supabase.from("skills").select("*").order("created_at", { ascending: true }),
    ]);

    const pdfElement = React.createElement(CVDocument, {
      profile: profileRes.data,
      education: eduRes.data || [],
      experience: expRes.data || [],
      projects: projRes.data || [],
      skills: skillRes.data || [],
    });

    // Cast as unknown as React.ReactElement to satisfy @react-pdf/renderer types
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(pdfElement as any);

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="CV_Ahmad_Chamdan_Yuwafin.pdf"',
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("CV generation error:", error);
    return NextResponse.json(
      { error: "Gagal membuat dokumen CV PDF secara dinamis." },
      { status: 500 }
    );
  }
}
