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
        <Link href="/asso/beneficiaires" className="text-sm text-muted hover:text-white/85 transition">
          ← Bénéficiaires
        </Link>
        <h1 className="mt-3 text-2xl font-semibold text-white">Nouveau bénéficiaire</h1>
        <p className="mt-1 text-sm text-muted">Créez un dossier pour suivre les documents d&apos;un bénéficiaire.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border-soft bg-card p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1.5">Prénom *</label>
            <input
              value={form.prenom}
              onChange={(e) => setForm((f) => ({ ...f, prenom: e.target.value }))}
              required
              className="w-full rounded-xl border border-border-soft bg-ink px-4 py-2.5 text-sm text-white placeholder-muted focus:border-accent focus:outline-none"
              placeholder="Marie"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white/85 mb-1.5">Nom *</label>
            <input
              value={form.nom}
              onChange={(e) => setForm((f) => ({ ...f, nom: e.target.value }))}
              required
              className="w-full rounded-xl border border-border-soft bg-ink px-4 py-2.5 text-sm text-white placeholder-muted focus:border-accent focus:outline-none"
              placeholder="Dupont"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/85 mb-1.5">Numéro de dossier</label>
          <input
            value={form.numero_dossier}
            onChange={(e) => setForm((f) => ({ ...f, numero_dossier: e.target.value }))}
            className="w-full rounded-xl border border-border-soft bg-ink px-4 py-2.5 text-sm text-white placeholder-muted focus:border-accent focus:outline-none"
            placeholder="ex. CAF-2024-001 (optionnel)"
          />
        </div>

        {erreur && (
          <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">{erreur}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full dc-gradient-bg px-6 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Création en cours…" : "Créer le dossier"}
        </button>
      </form>
    </div>
  );
}
