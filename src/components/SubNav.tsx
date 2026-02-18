export function SubNav() {
  return (
    <div
      className="bg-pdt-dark"
      style={{
        width: "100vw",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div className="max-w-[960px] mx-auto px-6 md:px-8 py-[10px] flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        <p className="text-white/80 text-xs leading-relaxed text-center md:text-left m-0">
          Help build citizen-owned data infrastructure by supporting the{" "}
          <a
            href="#cibc"
            className="font-semibold text-[#a8d5a2] no-underline hover:underline hover:text-white transition-colors"
          >
            Citizen Infrastructure Builders Club (CIBC)
          </a>
        </p>
        <div className="flex items-center justify-center gap-2 flex-shrink-0 flex-wrap min-[400px]:flex-nowrap">
          {/* Primary — solid white filled, dark text */}
          <a
            href="https://github.com/Citizen-Infra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-pdt-dark bg-white border border-white py-[8px] px-5 rounded-md no-underline hover:bg-[#f0f0f0] transition-colors whitespace-nowrap cursor-pointer"
          >
            Build with us &rarr;
          </a>
          {/* Secondary — ghost/outline, white text */}
          <a
            href="#coffee"
            className="text-[11px] font-normal text-white bg-transparent border border-white/60 py-[8px] px-5 rounded-md no-underline hover:bg-white/10 hover:border-white transition-colors whitespace-nowrap cursor-pointer"
          >
            Buy us a coffee &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
