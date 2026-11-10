import { ImageResponse } from "next/og";
import fs from "fs";
import path from "path";

export const alt =
  "Ahmad Chamdan Yuwafin - Santri Lirboyo, Khadimul Ilmi & AI-Driven Full-Stack Web Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  // Read logo master and convert to base64 data URI
  const logoPath = path.join(process.cwd(), "public", "images", "logo.png");
  const logoBuffer = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;

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
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #047857 2%, transparent 0%), radial-gradient(circle at 75px 75px, #022c22 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          padding: "50px 70px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "8px 24px",
              borderRadius: "999px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              border: "1px solid rgba(251, 191, 36, 0.4)",
            }}
          >
            <span
              style={{ fontSize: "18px", color: "#fbbf24", fontWeight: 700 }}
            >
              Khadimul Ilmi
            </span>
            <span style={{ fontSize: "16px", color: "#d1fae5" }}>
              • Ma&apos;had Aly Lirboyo
            </span>
          </div>

          <span
            style={{
              fontSize: "20px",
              color: "#fbbf24",
              fontWeight: 700,
              letterSpacing: "2px",
            }}
          >
            WWW.CHAMDAN.SITE
          </span>
        </div>

        {/* Center Hero Block: Typography + Majestic Emblem */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "50px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: "58px",
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-1px",
                lineHeight: 1.1,
              }}
            >
              Ahmad Chamdan Yuwafin
            </div>
            <div
              style={{
                fontSize: "26px",
                color: "#fbbf24",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>Santri Lirboyo</span>
              <span style={{ color: "#34d399" }}>•</span>
              <span>AI-Driven Full-Stack Web Developer</span>
            </div>
            <div
              style={{
                fontSize: "19px",
                color: "#d1fae5",
                lineHeight: 1.45,
                maxWidth: "760px",
              }}
            >
              Merajut ketelitian khazanah turats Islam dengan rekayasa web modern, Next.js 16, Supabase, dan otomasi cerdas.
            </div>
          </div>

          {/* New Arabic Emblem (ذوو العلى) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "180px",
              height: "180px",
              borderRadius: "999px",
              backgroundColor: "#ffffff",
              border: "4px solid #fbbf24",
              boxShadow: "0 14px 35px rgba(0, 0, 0, 0.45)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoBase64}
              alt="Logo Emblem Chamdan"
              width="180"
              height="180"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
            paddingTop: "20px",
            fontSize: "17px",
            color: "#a7f3d0",
          }}
        >
          <span>Kediri, Jawa Timur, Indonesia</span>
          <span>Official Digital Portfolio &amp; Systems</span>
          <span>ahmadchamdan03@gmail.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
