export function SubNav() {
  return (
    <div className="w-full bg-pdt-dark" style={{ marginTop: 0 }}>
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
          <a
            href="https://github.com/Citizen-Infra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-white border border-white/80 py-1.5 px-4 rounded-md bg-transparent no-underline hover:bg-white/10 hover:border-white transition-colors whitespace-nowrap"
          >
            Build with us →
          </a>
          <a
            href="#coffee"
            className="text-[11px] font-semibold text-white border border-white/80 py-1.5 px-4 rounded-md bg-transparent no-underline hover:bg-white/10 hover:border-white transition-colors whitespace-nowrap"
          >
            Buy us a coffee →
          </a>
        </div>
      </div>
    </div>
  );
}
