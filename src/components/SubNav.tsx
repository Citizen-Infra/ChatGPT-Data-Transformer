export function SubNav() {
  return (
    <div
      style={{
        width: "100vw",
        position: "relative",
        left: "50%",
        marginLeft: "-50vw",
        backgroundColor: "#1a3a2a",
        maxWidth: "none",
        boxSizing: "border-box" as const,
        padding: "10px 0",
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
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <p className="text-white/80 text-xs leading-relaxed text-center md:text-left m-0" style={{ margin: 0 }}>
          Help build citizen-owned data infrastructure by supporting the{" "}
          <a
            href="#cibc"
            className="font-semibold no-underline hover:underline hover:text-white transition-colors"
            style={{ color: "#a8d5a2" }}
          >
            Citizen Infrastructure Builders Club (CIBC)
          </a>
        </p>
        <div className="flex items-center justify-center gap-2 flex-shrink-0 flex-wrap min-[400px]:flex-nowrap">
          {/* Primary — solid white bg, dark green text, no border color showing */}
          <a
            href="https://github.com/Citizen-Infra"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: "#ffffff",
              color: "#1a3a2a",
              border: "1px solid #ffffff",
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "11px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
            className="hover:!bg-[#f0f0f0] transition-colors"
          >
            Build with us &rarr;
          </a>
          {/* Secondary — transparent bg, white text, white border */}
          <a
            href="#coffee"
            style={{
              backgroundColor: "transparent",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.5)",
              fontWeight: 400,
              padding: "8px 20px",
              borderRadius: "6px",
              fontSize: "11px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              cursor: "pointer",
            }}
            className="hover:!bg-white/10 hover:!border-white transition-colors"
          >
            Buy us a coffee &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
