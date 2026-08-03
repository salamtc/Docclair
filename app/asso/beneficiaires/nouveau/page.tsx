"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NouveauBeneficiairePage() {
  const router = useRouter();
  const [form, setForm] = useState({ nom: "", prenom: "", numero_dossier: "" });
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/asso/beneficiaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setErreur(data.erreur ?? "Erreur lors de la création");
      } else {
        router.push(`/asso/beneficiaires/${data.id}`);
      }
    } catch {
      setErreur("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-10 max-w-xl mx-auto">
      <div className="mb-8">
        <Link href="/asso/beneficiaires" className="text-sm text-gray-500 hover:text-gray-700 transition">
          ← Bénéficiaires
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">Nouveau bénéficiaire</h1>
        <p className="mt-1 text-sm text-gray-500">Créez un dossier pour suivre les documents d&apos;un bénéficiaire.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-stone-200 bg-white p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom *</label>
            <input
              value={form.prenom}
              onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))}
              required
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm text-gray-900 placeholder-stone-400 focus:border-stone-500 focus:outline-none"
              placeholder="Marie"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
            <input
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
              required
              className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm text-gray-900 placeholder-stone-400 focus:border-stone-500 focus:outline-none"
              placeholder="Dupont"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Numéro de dossier</label>
          <input
            value={form.numero_dossier}
            onChange={(e) => setForm((f) => ({ ...f, numero_dossier: e.target.value }))}
            className="w-full rounded-xl border border-stone-300 px-4 py-2.5 text-sm text-gray-900 placeholder-stone-400 focus:border-stone-500 focus:outline-none"
            placeholder="ex. CAF-2024-001 (optionnel)"
          />
        </div>

        {erreur && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erreur}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-stone-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-stone-800 disabled:opacity-60"
        >
          {loading ? "Création en cours…" : "Créer le dossier"}
        </button>
      </form>
    </div>
  );
}
