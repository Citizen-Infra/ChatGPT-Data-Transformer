export function SubNav() {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#1a3a2a",
        padding: "12px 0",
        margin: 0,
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
          flexWrap: "wrap" as const,
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            fontSize: "0.8rem",
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          Help build citizen-owned data infrastructure by supporting the{" "}
          <a
            href="/#cibc"
            style={{
              color: "#a8d5a2",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Citizen Infrastructure Builders Club (CIBC)
          </a>
        </p>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexShrink: 0,
            flexWrap: "wrap" as const,
          }}
        >
          {/* PRIMARY: white filled button */}
          <a
            href="https://github.com/Citizen-Infra"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#ffffff",
              color: "#1a3a2a",
              border: "1px solid #ffffff",
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            Build with us &rarr;
          </a>
          {/* SECONDARY: outline ghost button */}
          <a
            href="#coffee"
            style={{
              backgroundColor: "transparent",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.5)",
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 400,
              textDecoration: "none",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
          >
            Buy us a coffee &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
