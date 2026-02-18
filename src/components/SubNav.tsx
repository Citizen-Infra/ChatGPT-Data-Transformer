export function SubNav() {
  return (
    <div className="bg-pdt-dark px-6 md:px-8 py-2.5">
      <div className="max-w-[960px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        <p className="text-white/80 text-xs leading-relaxed text-center md:text-left m-0">
          Help build citizen-owned data infrastructure by supporting the{" "}
          <span className="font-semibold text-white">Citizen Infrastructure Builders Club (CIBC)</span>
        </p>
        <div className="flex items-center justify-center gap-2 flex-shrink-0">
          <a
            href="https://github.com/Citizen-Infra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-white border border-white/30 py-1.5 px-4 rounded no-underline hover:bg-white/10 transition-colors whitespace-nowrap"
          >
            Build with us →
          </a>
          <a
            href="#coffee"
            className="text-[11px] font-semibold text-white/70 border border-white/20 py-1.5 px-4 rounded no-underline hover:bg-white/10 hover:text-white transition-colors whitespace-nowrap"
          >
            Buy us a coffee →
          </a>
        </div>
      </div>
    </div>
  );
}
