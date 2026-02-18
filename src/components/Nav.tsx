import Link from "next/link";

export function Nav({ variant = "landing" }: { variant?: "landing" | "results" }) {
  const isDark = variant === "results";
  return (
    <nav
      className={`sticky top-0 z-50 border-b px-6 md:px-8 h-14 flex items-center justify-between ${
        isDark ? "bg-pdt-dark border-white/10" : "bg-white border-[var(--border)]"
      }`}
    >
      <Link href="/" className={`flex items-center gap-2.5 no-underline ${isDark ? "text-white" : "text-[var(--text-primary)]"}`}>
        <span className={`font-mono-pdt font-medium text-[15px] ${isDark ? "text-white" : "text-[var(--text-primary)]"}`}>
          chatgpt.pdt
        </span>
      </Link>
      {variant === "results" ? (
        <div className="flex items-center gap-7">
          <Link href="/#how" className="text-sm font-medium text-white/80 no-underline hover:text-white transition-colors">
            How it works
          </Link>
          <Link href="/#privacy" className="text-sm font-medium text-white/80 no-underline hover:text-white transition-colors">
            Privacy
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-white bg-pdt-dark border border-white/30 px-5 py-2.5 rounded-lg no-underline hover:bg-green-mid transition-colors"
          >
            Upload your data →
          </Link>
        </div>
      ) : (
        <ul className="flex items-center gap-7 list-none m-0 p-0">
          <li>
            <Link href="/#how" className="text-sm font-medium text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)] transition-colors">
              How it works
            </Link>
          </li>
          <li>
            <Link href="/#privacy" className="text-sm font-medium text-[var(--text-secondary)] no-underline hover:text-[var(--text-primary)] transition-colors">
              Privacy
            </Link>
          </li>
          <li>
            <Link href="/#upload" className="text-sm font-semibold text-white bg-pdt-dark px-5 py-2.5 rounded-[8px] no-underline hover:bg-green-mid transition-colors">
              Upload your data →
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}
