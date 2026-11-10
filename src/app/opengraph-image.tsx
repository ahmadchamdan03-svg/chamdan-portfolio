import { ImageResponse } from "next/og";

export const alt = "Ahmad Chamdan Yuwafin - Santri Lirboyo, Khadimul Ilmi & AI-Driven Full-Stack Web Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#064e3b",
          backgroundImage: "radial-gradient(circle at 25px 25px, #047857 2%, transparent 0%), radial-gradient(circle at 75px 75px, #022c22 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "60px 80px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 24px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(251, 191, 36, 0.4)",
            }}
          >
            <span style={{ fontSize: "18px", color: "#fbbf24", fontWeight: 700 }}>Khadimul Ilmi</span>
            <span style={{ fontSize: "16px", color: "#d1fae5" }}>• Ma&apos;had Aly Lirboyo</span>
          </div>
          <span style={{ fontSize: "20px", color: "#fbbf24", fontWeight: 700, letterSpacing: "2px" }}>
            CHAMDAN.SITE
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: "64px", fontWeight: 900, color: "#ffffff", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Ahmad Chamdan Yuwafin
          </div>
          <div style={{ fontSize: "28px", color: "#fbbf24", fontWeight: 600 }}>
            Santri Lirboyo &amp; AI-Driven Full-Stack Web Developer
          </div>
          <div style={{ fontSize: "20px", color: "#d1fae5", maxWidth: "900px", lineHeight: 1.4 }}>
            Merajut ketelitian khazanah turats Islam dengan rekayasa web modern, Next.js 16, Supabase, dan otomasi cerdas.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.2)", paddingTop: "24px", fontSize: "18px", color: "#a7f3d0" }}>
          <span>Kediri, Jawa Timur, Indonesia</span>
          <span>ahmadchamdan03@gmail.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
