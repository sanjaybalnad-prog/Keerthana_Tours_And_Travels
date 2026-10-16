import { Link } from "@tanstack/react-router";

const navItems = [
  { to: "/destinations", label: "Destinations" },
  { to: "/packages", label: "Packages" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="kt-glass sticky top-4 z-50 mt-6 flex items-center justify-between rounded-full px-5 py-3">
      <Link to="/" className="flex items-center gap-2">
        <div className="grid size-9 place-items-center rounded-full bg-brand font-display text-sm font-semibold text-brand-foreground">
          K
        </div>
        <div className="leading-tight">
          <div className="font-display text-sm font-semibold tracking-tight">
            Keerthana Travels
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-brand/70">
            Est. 1990 · Bengaluru
          </div>
        </div>
      </Link>

      <nav className="hidden items-center gap-7 text-sm font-medium text-ink/80 md:flex">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="relative transition after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:text-brand hover:after:origin-left hover:after:scale-x-100 data-[status=active]:text-brand data-[status=active]:after:origin-left data-[status=active]:after:scale-x-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <Link
        to="/contact"
        className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition hover:brightness-95"
      >
        Plan a trip
      </Link>
    </header>
  );
}
