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
  if (u === "urgent") return "bg-red-100 text-red-700";
  if (u === "attention") return "bg-orange-100 text-orange-700";
  return "bg-stone-100 text-stone-500";
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
        <p className="text-sm text-gray-400">Chargement…</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Connectez-vous pour accéder à l&apos;espace aidant.</p>
          <Link href="/analyse" className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="p-8">
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{erreur}</p>
      </div>
    );
  }

  const urgents = data?.docs_urgents ?? [];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">Documents urgents en attente de traitement.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8 sm:grid-cols-3">
        <div className="rounded-2xl bg-white border border-stone-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Bénéficiaires</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{data?.total_beneficiaires ?? 0}</p>
        </div>
        <div className="rounded-2xl bg-white border border-stone-200 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Documents urgents</p>
          <p className="mt-1 text-3xl font-bold text-red-600">
            {urgents.filter((d) => d.urgence === "urgent").length}
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-stone-200 px-6 py-5 col-span-2 sm:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">À surveiller</p>
          <p className="mt-1 text-3xl font-bold text-orange-500">
            {urgents.filter((d) => d.urgence === "attention").length}
          </p>
        </div>
      </div>

      {/* Urgent docs table */}
      {urgents.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 bg-white p-10 text-center">
          <p className="text-gray-500 text-sm mb-4">Aucun document urgent en attente. Tout est sous contrôle ✓</p>
          <Link
            href="/asso/beneficiaires"
            className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-stone-800"
          >
            Voir les bénéficiaires
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Documents non traités</h2>
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-stone-100 bg-stone-50">
                <tr>
                  {["Bénéficiaire", "Organisme", "Type", "Priorité", "Date", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {urgents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-stone-50 transition">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {doc.beneficiaire.prenom} {doc.beneficiaire.nom}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{doc.organisme}</td>
                    <td className="px-4 py-3 text-gray-600">{doc.type_document}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${urgenceBadge(doc.urgence)}`}>
                        {urgenceLabel(doc.urgence)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/asso/beneficiaires/${doc.beneficiaire_id}`}
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
        </div>
      )}
    </div>
  );
}
