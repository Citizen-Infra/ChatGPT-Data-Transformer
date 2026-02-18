"use client";

import type { Snapshot } from "@/lib/types";
import type { CardData } from "@/lib/cardData";
import { snapshotToCardData } from "@/lib/cardData";

const CARD_WIDTH = 390;
const COLORS = {
  primary: "#2D6A4F",
  secondary: "#40916C",
  tertiary: "#74C69D",
  quaternary: "#B7DFC9",
} as const;

const TAG_STYLES: Record<string, React.CSSProperties> = {
  filled: { background: "#2D6A4F", color: "#fff" },
  tonal: { background: "#E4F2EB", color: "#2D6A4F" },
  outlined: { background: "transparent", color: "#6B7D73", border: "1px solid #DDE8E2" },
};

export interface CardCustomization {
  displayName?: string;
  role?: string;
  location?: string;
  tagline?: string;
}

interface NetworkingCardProps {
  snapshot: Snapshot;
  customization?: CardCustomization;
  className?: string;
  retina?: boolean;
}

/** Card rendered to match pdt_card_generation_kit — white bg, stripe, role/name/tagline, tags, usage bar, projects, lenses, footer */
function CardFromData({ data }: { data: CardData }) {
  return (
    <div
      style={{
        width: CARD_WIDTH,
        background: "#FFFFFF",
        borderRadius: 20,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 4px 24px rgba(45,106,79,0.10), 0 1px 4px rgba(45,106,79,0.08)",
        border: "1px solid #DDE8E2",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div style={{ height: 5, background: "linear-gradient(90deg,#2D6A4F,#3A7D5E)", flexShrink: 0 }} />
      <div style={{ padding: "24px 28px 18px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "#F2FAF5",
            zIndex: 0,
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          {data.role && (
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#1E5C40",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <span style={{ display: "block", width: 16, height: 2, background: "#2D6A4F", borderRadius: 2 }} />
              {data.role}
            </div>
          )}
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, lineHeight: 1, color: "#1A1F1C", marginBottom: 6 }}>
            {data.name}
          </div>
          {data.tagline && (
            <div style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", fontSize: 14, color: "#6B7D73", lineHeight: 1.4 }}>
              {data.tagline}
            </div>
          )}
        </div>
      </div>
      <div style={{ height: 1, background: "#DDE8E2", margin: "0 28px" }} />
      {data.tags.length > 0 && (
        <div style={{ padding: "16px 28px", display: "flex", flexWrap: "wrap", gap: 7 }}>
          {data.tags.map((t, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                padding: "5px 10px",
                borderRadius: 4,
                lineHeight: 1,
                display: "inline-block",
                ...TAG_STYLES[t.variant],
              }}
            >
              {t.label}
            </span>
          ))}
        </div>
      )}
      <div style={{ height: 1, background: "#DDE8E2", margin: "0 28px" }} />
      {data.usageModes.length > 0 && (
        <div style={{ padding: "16px 28px" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#6B7D73",
              marginBottom: 8,
            }}
          >
            How I work with AI
          </div>
          <div
            style={{
              height: 8,
              background: "#F2FAF5",
              borderRadius: 99,
              overflow: "hidden",
              display: "flex",
              gap: 2,
              marginBottom: 9,
            }}
          >
            {data.usageModes.map((m, i) => (
              <div
                key={i}
                style={{
                  height: "100%",
                  borderRadius: 99,
                  background: COLORS[m.color],
                  width: `${m.percent}%`,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
            {data.usageModes.map((m, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#6B7D73" }}>
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: COLORS[m.color],
                    flexShrink: 0,
                  }}
                />
                {m.label} {m.percent}%
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{ height: 1, background: "#DDE8E2", margin: "0 28px" }} />
      {data.projects.length > 0 && (
        <div style={{ padding: "16px 28px 14px" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#6B7D73",
              marginBottom: 10,
            }}
          >
            Active projects
          </div>
          {data.projects.map((p, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "3px 1fr",
                gap: 10,
                alignItems: "start",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 3,
                  borderRadius: 99,
                  minHeight: 30,
                  height: "100%",
                  background: COLORS[p.pipColor],
                }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1F1C", marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#6B7D73", lineHeight: 1.45 }}>{p.description}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div style={{ height: 1, background: "#DDE8E2", margin: "0 28px" }} />
      {data.lenses.length > 0 && (
        <div style={{ padding: "14px 28px 16px" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#6B7D73",
              marginBottom: 9,
            }}
          >
            Thinking lenses
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {data.lenses.map((l, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  color: "#2D6A4F",
                  background: "#F2FAF5",
                  border: "1px solid #C2DFD0",
                  padding: "4px 10px",
                  borderRadius: 99,
                  display: "inline-block",
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      )}
      <div
        style={{
          background: "#F7F9F6",
          borderTop: "1px solid #DDE8E2",
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#6B7D73",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          {data.location && <span style={{ color: "#2D6A4F" }}>◎</span>}
          {data.location || "—"}
        </div>
        <div style={{ fontSize: 10, color: "#9EB5A4", textAlign: "right", lineHeight: 1.6 }}>
          Made with pdt.com
          {data.attribution && <><br /><span style={{ opacity: 0.6 }}>{data.attribution}</span></>}
        </div>
      </div>
    </div>
  );
}

export function NetworkingCard({ snapshot, customization, className = "", retina = false }: NetworkingCardProps) {
  const data = snapshotToCardData(snapshot, customization);
  return (
    <div className={className} style={{ width: CARD_WIDTH * (retina ? 2 : 1), height: "auto" }}>
      <div style={{ transform: retina ? "scale(2)" : "none", transformOrigin: "top left" }}>
        <CardFromData data={data} />
      </div>
    </div>
  );
}

/** Inner card only, fixed 390px width, for html2canvas capture */
export function NetworkingCardInner({ snapshot, customization }: { snapshot: Snapshot; customization?: CardCustomization }) {
  const data = snapshotToCardData(snapshot, customization);
  return <CardFromData data={data} />;
}
