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
    if (sens === "à payer") return "bg-red-100 text-red-700";
    if (sens === "remboursement") return "bg-green-100 text-green-700";
    return "bg-stone-100 text-stone-600";
  };

  return (
    <div className="flex flex-1 flex-col bg-stone-50">
      <Navbar />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Mes documents fiscaux
            </h1>
            <p className="mt-1 text-sm text-gray-500">
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
          <p className="text-center text-sm text-gray-500 py-16">Chargement…</p>
        ) : !isSignedIn ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-gray-600 mb-4">
              Connectez-vous pour accéder à votre historique.
            </p>
            <Link
              href="/analyse"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Se connecter
            </Link>
          </div>
        ) : erreur ? (
          <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700 text-center">
            {erreur}
          </p>
        ) : analyses.length === 0 ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
            <p className="text-gray-500 text-sm mb-4">
              Aucun document fiscal analysé pour l&apos;instant.
            </p>
            <Link
              href="/analyse"
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Analyser un document
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-100 bg-stone-50">
                <tr>
                  {["Date courrier", "Organisme", "Type", "Montant", "Échéance", "Statut"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {analyses.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50 transition">
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {a.date_courrier ?? <span className="text-stone-400">—</span>}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{a.organisme}</td>
                    <td className="px-4 py-3 text-gray-600">{a.type_document}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {a.montant != null ? `${a.montant} €` : <span className="text-stone-400">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {a.date_echeance ?? <span className="text-stone-400">—</span>}
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
