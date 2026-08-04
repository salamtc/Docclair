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
        <p className="text-sm text-muted">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Bénéficiaires</h1>
          <p className="mt-1 text-sm text-muted">
            {beneficiaires.length} dossier{beneficiaires.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/asso/beneficiaires/nouveau"
          className="shrink-0 rounded-full dc-gradient-bg px-5 py-2.5 text-sm font-semibold tracking-[0.3px] text-white hover:opacity-90 transition"
        >
          + Nouveau bénéficiaire
        </Link>
      </div>

      {erreur ? (
        <p className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">{erreur}</p>
      ) : beneficiaires.length === 0 ? (
        <div className="rounded-2xl border border-border-soft bg-card p-10 text-center">
          <p className="text-muted text-sm mb-4">Aucun bénéficiaire enregistré.</p>
          <Link
            href="/asso/beneficiaires/nouveau"
            className="rounded-full dc-gradient-bg px-5 py-2.5 text-sm font-semibold tracking-[0.3px] text-white hover:opacity-90"
          >
            Créer le premier dossier
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border-soft bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border-soft bg-ink">
              <tr>
                {["Nom complet", "N° dossier", "Notes", "Créé le", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-soft">
              {beneficiaires.map((b) => (
                <tr key={b.id} className="hover:bg-white/5 transition">
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                    {b.prenom} {b.nom}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {b.numero_dossier ?? <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted max-w-xs truncate">
                    {b.notes ?? <span className="text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {new Date(b.created_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/asso/beneficiaires/${b.id}`}
                      className="rounded-full dc-gradient-bg px-3 py-1.5 text-xs font-semibold tracking-[0.3px] text-white hover:opacity-90 transition"
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
