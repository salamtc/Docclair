"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { Beneficiaire } from "@/lib/supabase";

export default function BeneficiairesPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [beneficiaires, setBeneficiaires] = useState<Beneficiaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/asso/beneficiaires")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d)) setBeneficiaires(d);
        else setErreur(d.erreur ?? "Erreur");
      })
      .catch(() => setErreur("Erreur de connexion"))
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-sm text-gray-400">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Bénéficiaires</h1>
          <p className="mt-1 text-sm text-gray-500">
            {beneficiaires.length} dossier{beneficiaires.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/asso/beneficiaires/nouveau"
          className="shrink-0 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800 transition"
        >
          + Nouveau bénéficiaire
        </Link>
      </div>

      {erreur ? (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{erreur}</p>
      ) : beneficiaires.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
          <p className="text-gray-500 text-sm mb-4">Aucun bénéficiaire enregistré.</p>
          <Link
            href="/asso/beneficiaires/nouveau"
            className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            Créer le premier dossier
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-stone-100 bg-stone-50">
              <tr>
                {["Nom complet", "N° dossier", "Notes", "Créé le", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {beneficiaires.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {b.prenom} {b.nom}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {b.numero_dossier ?? <span className="text-stone-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                    {b.notes ?? <span className="text-stone-400">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {new Date(b.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/asso/beneficiaires/${b.id}`}
                      className="rounded-full bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700 transition"
                    >
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
