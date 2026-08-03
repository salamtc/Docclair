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
      <aside className="hidden w-60 shrink-0 flex-col bg-stone-900 text-white md:flex">
        <div className="px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">DocClair</p>
          <p className="mt-0.5 text-base font-semibold text-white">Espace aidant</p>
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
                    : "text-stone-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            );
          })}

          <Link
            href="/asso/beneficiaires/nouveau"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-400 hover:bg-white/5 hover:text-white transition mt-1"
          >
            <span className="text-base">+</span>
            Nouveau bénéficiaire
          </Link>
        </nav>

        <div className="border-t border-white/10 px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="text-xs text-stone-500 hover:text-stone-300 transition"
          >
            ← DocClair
          </Link>
          <UserButton />
        </div>
      </aside>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between bg-stone-900 px-4 py-3 md:hidden">
        <span className="text-sm font-semibold text-white">Espace aidant</span>
        <div className="flex items-center gap-3">
          <Link href="/asso" className="text-xs text-stone-400">Tableau</Link>
          <Link href="/asso/beneficiaires" className="text-xs text-stone-400">Bénéficiaires</Link>
          <UserButton />
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 bg-stone-50 md:overflow-y-auto pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
