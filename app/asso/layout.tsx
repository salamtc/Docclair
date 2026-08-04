"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const navLinks = [
  { href: "/asso", label: "Tableau de bord", icon: "⊡" },
  { href: "/asso/beneficiaires", label: "Bénéficiaires", icon: "◎" },
];

export default function AssoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border-soft/60 bg-ink-alt text-white md:flex">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <span className="h-6 w-6 rounded-md dc-gradient-bg" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">DocClair</p>
            <p className="text-sm font-semibold text-white">Espace aidant</p>
          </div>
        </div>

        <nav className="flex-1 px-3 pb-4 space-y-1">
          {navLinks.map(({ href, label, icon }) => {
            const active =
              href === "/asso" ? pathname === "/asso" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-muted hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}

          <Link
            href="/asso/beneficiaires/nouveau"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-white/5 hover:text-white transition mt-1"
          >
            <span className="text-base">+</span>
            Nouveau bénéficiaire
          </Link>
        </nav>

        <div className="border-t border-border-soft/60 px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs text-muted hover:text-white transition"
          >
            ← DocClair
          </Link>
          <UserButton />
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between border-b border-border-soft/60 bg-ink-alt px-4 py-3 md:hidden">
        <span className="text-sm font-semibold text-white">Espace aidant</span>
        <div className="flex items-center gap-3">
          <Link href="/asso" className="text-xs text-muted">Tableau</Link>
          <Link href="/asso/beneficiaires" className="text-xs text-muted">Bénéficiaires</Link>
          <UserButton />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-ink text-white md:overflow-y-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
