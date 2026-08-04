"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface AnalyseFiscale {
  id: string;
  created_at: string;
  organisme: string;
  type_document: string;
  montant: number | null;
  sens: string | null;
  date_echeance: string | null;
  date_courrier: string | null;
}

export default function HistoriquePage() {
  const { isLoaded, isSignedIn } = useUser();
  const [analyses, setAnalyses] = useState<AnalyseFiscale[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/historique")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAnalyses(data);
        else setErreur(data.erreur ?? "Erreur de chargement");
      })
      .catch(() => setErreur("Erreur de connexion"))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn]);

  function exporterTout() {
    window.open("/api/historique?format=csv", "_blank");
  }

  const statutBadge = (sens: string | null) => {
    if (sens === "à payer") return "bg-red-500/15 text-red-400";
    if (sens === "remboursement") return "bg-emerald-500/15 text-emerald-400";
    return "bg-white/10 text-white/70";
  };

  return (
    <div className="flex flex-1 flex-col bg-ink text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Mes documents fiscaux
            </h1>
            <p className="mt-1 text-sm text-muted">
              Historique de vos courriers à enjeu comptable analysés avec DocClair.
            </p>
          </div>
          {analyses.length > 0 && (
            <button
              onClick={exporterTout}
              className="shrink-0 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              Exporter tous (.csv)
            </button>
          )}
        </div>

        {!isLoaded || loading ? (
          <p className="text-center text-sm text-muted py-16">Chargement…</p>
        ) : !isSignedIn ? (
          <div className="rounded-2xl border border-border-soft bg-card p-10 text-center">
            <p className="text-muted mb-4">
              Connectez-vous pour accéder à votre historique.
            </p>
            <Link
              href="/analyse"
              className="rounded-full dc-gradient-bg px-5 py-2.5 text-sm font-semibold tracking-[0.3px] text-white hover:opacity-90"
            >
              Se connecter
            </Link>
          </div>
        ) : erreur ? (
          <p className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 text-center">
            {erreur}
          </p>
        ) : analyses.length === 0 ? (
          <div className="rounded-2xl border border-border-soft bg-card p-10 text-center">
            <p className="text-muted text-sm mb-4">
              Aucun document fiscal analysé pour l&apos;instant.
            </p>
            <Link
              href="/analyse"
              className="rounded-full dc-gradient-bg px-5 py-2.5 text-sm font-semibold tracking-[0.3px] text-white hover:opacity-90"
            >
              Analyser un document
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border-soft bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border-soft bg-ink">
                <tr>
                  {["Date courrier", "Organisme", "Type", "Montant", "Échéance", "Statut"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {analyses.map((a) => (
                  <tr key={a.id} className="hover:bg-ink text-white transition">
                    <td className="px-4 py-3 text-white/85 whitespace-nowrap">
                      {a.date_courrier ?? <span className="text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-white">{a.organisme}</td>
                    <td className="px-4 py-3 text-muted">{a.type_document}</td>
                    <td className="px-4 py-3 text-white/85 whitespace-nowrap">
                      {a.montant != null ? `${a.montant} €` : <span className="text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3 text-white/85 whitespace-nowrap">
                      {a.date_echeance ?? <span className="text-muted">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statutBadge(a.sens)}`}>
                        {a.sens ?? "informatif"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
