import { useEffect, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Wraps page content and replays the entrance animation on every navigation
 * by keying on the current pathname.
 */
export function PageShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: unknown) => void } }).lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className="kt-page pt-14">
      {children}
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
}) {
  return (
    <div className="kt-stagger max-w-2xl">
      <span className="block font-body text-xs uppercase tracking-[0.25em] text-accent">
        {eyebrow}
      </span>
      <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-ink md:text-6xl">
        {title}
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-ink/70">
        {subtitle}
      </p>
    </div>
  );
}
