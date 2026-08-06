"use client";

import { useState } from "react";
import Link from "next/link";
import UploadZone from "@/components/UploadZone";
import ResultCard from "@/components/ResultCard";
import type { AnalyseResult } from "@/lib/claude";

export default function EssaiClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyseResult | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  const handleAnalyser = async ({ texte, fichier }: { texte?: string; fichier?: File }) => {
    setLoading(true);
    setErreur(null);

    const formData = new FormData();
    if (fichier) formData.append("fichier", fichier);
    if (texte) formData.append("texte", texte);

    try {
      const res = await fetch("/api/analyse", { method: "POST", body: formData });
      const data = await res.json();

      if (res.status === 403 && data.erreur === "quota_depasse") {
        setErreur(
          "Vous avez déjà utilisé votre analyse gratuite sans compte. Créez un compte gratuit pour continuer."
        );
        setLoading(false);
        return;
      }

      if (!res.ok || data.erreur) {
        setErreur(data.erreur ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      const { texte_extrait: _ignore, ...analyseResult } = data;
      setResult(analyseResult as AnalyseResult);
    } catch {
      setErreur("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  function handleReset() {
    setResult(null);
  }

  return (
    <div className="flex min-h-screen flex-col bg-ink text-white">
      <header className="border-b border-border-soft/60 px-6 py-5">
        <Link href="/" className="flex items-center justify-center gap-2.5">
          <span className="h-6 w-6 rounded-md dc-gradient-bg" />
          <span className="text-lg font-bold tracking-tight text-white">DocClair</span>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        {!result ? (
          <>
            <div className="mb-10 text-center">
              <span className="dc-gradient-border inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm font-medium text-white">
                ✦ Essayez DocClair gratuitement — Sans inscription
              </span>
              <h1 className="mx-auto mt-6 max-w-lg text-3xl font-extrabold leading-tight sm:text-4xl">
                Comprenez votre courrier en 30 secondes
              </h1>
              <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
                Uploadez un PDF ou une photo, ou collez le texte directement.
                Aucune création de compte requise.
              </p>
            </div>

            {erreur && (
              <p className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-center text-sm text-red-400">
                {erreur}
              </p>
            )}
            <UploadZone onAnalyser={handleAnalyser} loading={loading} />
          </>
        ) : (
          <div className="space-y-6">
            <ResultCard result={result} onReset={handleReset} />

            <div className="dc-gradient-border relative rounded-2xl border-transparent bg-card p-6 text-center">
              <h2 className="text-lg font-semibold text-white">
                Vous avez aimé ?
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                Créez un compte gratuit pour sauvegarder vos analyses et accéder
                à toutes les fonctionnalités : lettres de réponse, contestation,
                chat conseiller et export comptable.
              </p>
              <Link
                href="/sign-up"
                className="mt-5 inline-block rounded-full dc-gradient-bg px-6 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:opacity-90"
              >
                Créer mon compte gratuit
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
