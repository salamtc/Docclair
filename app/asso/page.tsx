"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { AnalyseAsso, Beneficiaire } from "@/lib/supabase";

type DocUrgent = AnalyseAsso & { beneficiaire: Pick<Beneficiaire, "nom" | "prenom"> };

interface DashboardData {
  total_beneficiaires: number;
  docs_urgents: DocUrgent[];
}

const urgenceBadge = (u: string) => {
  if (u === "urgent") return "bg-red-500/15 text-red-400";
  if (u === "attention") return "bg-orange-500/15 text-orange-400";
  return "bg-white/10 text-white/60";
};

const urgenceLabel = (u: string) => {
  if (u === "urgent") return "Urgent";
  if (u === "attention") return "Attention";
  return "Info";
};

export default function AssoDashboard() {
  const { isLoaded, isSignedIn } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    fetch("/api/asso/dashboard")
      .then((r) => r.json())
      .then((d) => {
        if (d.erreur) setErreur(d.erreur);
        else setData(d);
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

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <p className="text-muted mb-4">Connectez-vous pour accéder à l&apos;espace aidant.</p>
          <Link href="/analyse" className="rounded-full dc-gradient-bg px-5 py-3 text-sm font-semibold tracking-[0.3px] text-white hover:opacity-90">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="p-8">
        <p className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">{erreur}</p>
      </div>
    );
  }

  const urgents = data?.docs_urgents ?? [];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted">Documents urgents en attente de traitement.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3">
        <div className="rounded-2xl bg-card border border-border-soft px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Bénéficiaires</p>
          <p className="mt-1 text-3xl font-bold text-white">{data?.total_beneficiaires ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-card border border-border-soft px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Documents urgents</p>
          <p className="mt-1 text-3xl font-bold text-red-600">
            {urgents.filter((d) => d.urgence === "urgent").length}
          </p>
        </div>
        <div className="rounded-2xl bg-card border border-border-soft px-6 py-5 col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">À surveiller</p>
          <p className="mt-1 text-3xl font-bold text-orange-500">
            {urgents.filter((d) => d.urgence === "attention").length}
          </p>
        </div>
      </div>

      {/* Urgent docs table */}
      {urgents.length === 0 ? (
        <div className="rounded-2xl border border-border-soft bg-card p-10 text-center">
          <p className="text-muted text-sm mb-4">Aucun document urgent en attente. Tout est sous contrôle ✓</p>
          <Link
            href="/asso/beneficiaires"
            className="rounded-full dc-gradient-bg px-5 py-3 text-sm font-semibold tracking-[0.3px] text-white hover:opacity-90"
          >
            Voir les bénéficiaires
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-base font-semibold text-white mb-3">Documents non traités</h2>
          <div className="overflow-hidden rounded-2xl border border-border-soft bg-card">
            <table className="w-full text-sm">
              <thead className="border-b border-border-soft bg-ink">
                <tr>
                  {["Bénéficiaire", "Organisme", "Type", "Priorité", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-soft">
                {urgents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                      {doc.beneficiaire.prenom} {doc.beneficiaire.nom}
                    </td>
                    <td className="px-4 py-3 text-white/85">{doc.organisme}</td>
                    <td className="px-4 py-3 text-muted">{doc.type_document}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${urgenceBadge(doc.urgence)}`}>
                        {urgenceLabel(doc.urgence)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap">
                      {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/asso/beneficiaires/${doc.beneficiaire_id}`}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-full dc-gradient-bg px-4 text-xs font-semibold tracking-[0.3px] text-white hover:opacity-90 transition"
                      >
                        Ouvrir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
