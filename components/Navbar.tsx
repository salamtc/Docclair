"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft/60 bg-ink/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOuvert(false)}>
          <span className="h-6 w-6 rounded-md dc-gradient-bg" />
          <span className="text-lg font-bold tracking-tight text-white">DocClair</span>
        </Link>

        {/* Navigation desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <Link href="/tarifs" className="text-sm text-muted transition hover:text-white">
            Tarifs
          </Link>

          <Show when="signed-in">
            <Link href="/historique" className="text-sm text-muted transition hover:text-white">
              Historique
            </Link>
          </Show>

          <Link
            href="/analyse"
            className="rounded-full dc-gradient-bg px-4 py-3 text-[15px] font-semibold tracking-[0.3px] text-white transition hover:opacity-90"
          >
            Analyser un document
          </Link>

          <Show when="signed-out">
            <Link href="/sign-in" className="text-sm text-muted transition hover:text-white">
              Connexion
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full border border-white/25 px-4 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:bg-white/5"
            >
              Commencer gratuitement
            </Link>
          </Show>

          <Show when="signed-in">
            <Link href="/mon-compte" className="text-sm text-muted transition hover:text-white">
              Mon compte
            </Link>
            <UserButton />
          </Show>
        </div>

        {/* Bouton menu mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Show when="signed-in">
            <UserButton />
          </Show>
          <button
            type="button"
            onClick={() => setMenuOuvert((v) => !v)}
            aria-label={menuOuvert ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOuvert}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-white transition hover:bg-white/5"
          >
            {menuOuvert ? (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Panneau menu mobile */}
      {menuOuvert && (
        <div className="border-t border-border-soft/60 bg-ink px-4 py-3 md:hidden">
          <div className="flex flex-col">
            <Link
              href="/tarifs"
              onClick={() => setMenuOuvert(false)}
              className="flex min-h-[44px] items-center text-base text-white/90 transition hover:text-white"
            >
              Tarifs
            </Link>

            <Show when="signed-in">
              <Link
                href="/historique"
                onClick={() => setMenuOuvert(false)}
                className="flex min-h-[44px] items-center text-base text-white/90 transition hover:text-white"
              >
                Historique
              </Link>
              <Link
                href="/mon-compte"
                onClick={() => setMenuOuvert(false)}
                className="flex min-h-[44px] items-center text-base text-white/90 transition hover:text-white"
              >
                Mon compte
              </Link>
            </Show>

            <Show when="signed-out">
              <Link
                href="/sign-in"
                onClick={() => setMenuOuvert(false)}
                className="flex min-h-[44px] items-center text-base text-white/90 transition hover:text-white"
              >
                Connexion
              </Link>
            </Show>

            <div className="mt-2 flex flex-col gap-3 border-t border-border-soft/60 pt-3">
              <Link
                href="/analyse"
                onClick={() => setMenuOuvert(false)}
                className="flex min-h-[44px] w-full items-center justify-center rounded-full dc-gradient-bg px-4 text-[15px] font-semibold tracking-[0.3px] text-white transition hover:opacity-90"
              >
                Analyser un document
              </Link>

              <Show when="signed-out">
                <Link
                  href="/sign-up"
                  onClick={() => setMenuOuvert(false)}
                  className="flex min-h-[44px] w-full items-center justify-center rounded-full border border-white/25 px-4 text-[15px] font-semibold tracking-[0.3px] text-white transition hover:bg-white/5"
                >
                  Commencer gratuitement
                </Link>
              </Show>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
