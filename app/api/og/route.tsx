import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const archetype = searchParams.get("archetype") || "08";
    const title = searchParams.get("title") || "과잠 입은 새내기 호랑이";
    const subtitle = searchParams.get("subtitle") || "고려대학교 2026-2학기 동아리 매칭";

    // Load local mascot PNG as base64 to avoid HTTP loopback fetch
    let imageSrc = "";
    try {
      const validArchetype = /^[0-9]{2}$/.test(archetype) ? archetype : "08";
      const filePath = path.join(
        process.cwd(),
        "public",
        "avatars",
        `plush_${validArchetype}.png`
      );
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        imageSrc = `data:image/png;base64,${fileBuffer.toString("base64")}`;
      }
    } catch (err) {
      console.error("Failed to load local avatar for OG", err);
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#7A1626",
            backgroundImage: "radial-gradient(circle at 30px 30px, #8F1C2E 2%, transparent 0%), radial-gradient(circle at 80px 80px, #5E101D 2%, transparent 0%)",
            backgroundSize: "100px 100px",
            padding: "50px 70px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Left Column: Information */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: "620px",
              justifyContent: "center",
            }}
          >
            {/* Gold Tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#C9A227",
                color: "#1F1B18",
                padding: "8px 20px",
                borderRadius: "30px",
                fontSize: "20px",
                fontWeight: "900",
                width: "fit-content",
                marginBottom: "20px",
              }}
            >
              <span>🐯 고려대 동아리 공식 아바타</span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: "44px",
                fontWeight: "900",
                color: "#FAF6EE",
                lineHeight: 1.2,
                marginBottom: "16px",
                wordBreak: "keep-all",
              }}
            >
              {title}
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontSize: "22px",
                color: "#E2D9CE",
                lineHeight: 1.5,
                marginBottom: "24px",
                wordBreak: "keep-all",
              }}
            >
              {subtitle}
            </div>

            {/* Bottom Footer Info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "18px",
                color: "#C9A227",
                fontWeight: "800",
              }}
            >
              <span>★ 2026-2학기 고려대학교 동아리 맞춤 추천 리포트</span>
            </div>
          </div>

          {/* Right Column: 3D Mascot Box */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "360px",
              height: "360px",
              borderRadius: "40px",
              backgroundColor: "#FAF6EE",
              border: "6px solid #C9A227",
              boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageSrc}
                alt={title}
                width="360"
                height="360"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span style={{ fontSize: "120px" }}>🐯</span>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error("OG Image generation error:", e);
    return new Response("Failed to generate OG Image", { status: 500 });
  }
}
