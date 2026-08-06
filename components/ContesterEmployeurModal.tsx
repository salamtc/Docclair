"use client";

import { useState } from "react";

interface ContesterEmployeurModalProps {
  typeDocument: string;
  onClose: () => void;
}

type TypeSituation = "accident_travail" | "maladie" | "autre";
type EtapeType = "formulaire" | "lettre";

const INDEMNITES_OPTIONS = [
  "Indemnité de licenciement",
  "Indemnité compensatrice de congés payés",
  "Indemnité compensatrice de préavis",
  "Heures supplémentaires non payées",
  "Prime de 13e mois",
  "Solde de tout compte incomplet",
];

interface FormData {
  nom: string;
  adresse: string;
  nomEmployeur: string;
  adresseEmployeur: string;
  typeSituation: TypeSituation;
  montantReclame: string;
  indemnitesNonVersees: string[];
  referencesCourrier: string;
}

export default function ContesterEmployeurModal({
  typeDocument,
  onClose,
}: ContesterEmployeurModalProps) {
  const [etape, setEtape] = useState<EtapeType>("formulaire");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [lettre, setLettre] = useState<string | null>(null);
  const [copie, setCopie] = useState(false);
  const [form, setForm] = useState<FormData>({
    nom: "",
    adresse: "",
    nomEmployeur: "",
    adresseEmployeur: "",
    typeSituation: "autre",
    montantReclame: "",
    indemnitesNonVersees: [],
    referencesCourrier: "",
  });

  function toggleIndemnite(val: string) {
    setForm((f) => ({
      ...f,
      indemnitesNonVersees: f.indemnitesNonVersees.includes(val)
        ? f.indemnitesNonVersees.filter((i) => i !== val)
        : [...f.indemnitesNonVersees, val],
    }));
  }

  async function generer() {
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/contester-employeur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, typeDocument }),
      });
      const data = await res.json();
      if (!res.ok || data.erreur) {
        setErreur(data.erreur ?? "Une erreur est survenue.");
      } else {
        setLettre(data.lettre);
        setEtape("lettre");
      }
    } catch {
      setErreur("Impossible de générer la lettre. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  function copier() {
    if (!lettre) return;
    navigator.clipboard.writeText(lettre).then(() => {
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    });
  }

  function telecharger() {
    if (!lettre) return;
    const fenetre = window.open("", "_blank");
    if (!fenetre) return;
    fenetre.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Lettre de contestation — ancien employeur</title>
  <style>
    body { font-family: Georgia, serif; max-width: 700px; margin: 60px auto; font-size: 14px; line-height: 1.8; color: #111; }
    pre { white-space: pre-wrap; word-break: break-word; font-family: inherit; }
    @media print { body { margin: 30px; } }
  </style>
</head>
<body><pre>${lettre.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
<script>window.onload = () => { window.print(); }<\/script>
</body></html>`);
    fenetre.document.close();
  }

  const champValide =
    form.nom.trim() &&
    form.adresse.trim() &&
    form.nomEmployeur.trim() &&
    form.montantReclame.trim();

  const inputCls =
    "w-full rounded-lg border border-border-soft bg-ink px-3 py-2 text-sm text-white placeholder:text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border-soft bg-card shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-white">
            Contester une réclamation employeur
          </h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-white transition"
            aria-label="Fermer"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5">
          {etape === "formulaire" && (
            <div className="space-y-5">
              <p className="text-sm text-muted leading-relaxed">
                Renseignez votre situation pour générer une lettre de
                contestation citant les articles{" "}
                <strong>L.1226-7</strong> et <strong>L.1234-9</strong> du Code
                du travail, avec mise en demeure et mention des Prud&apos;hommes.
              </p>

              {/* Vos coordonnées */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Vos coordonnées
                </legend>
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Marie Dupont"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Adresse complète <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex : 12 rue des Lilas, 75011 Paris"
                    value={form.adresse}
                    onChange={(e) =>
                      setForm({ ...form, adresse: e.target.value })
                    }
                    className={`${inputCls} resize-none`}
                  />
                </div>
              </fieldset>

              {/* Employeur */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Ancien employeur
                </legend>
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Raison sociale <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : SARL Martin & Associés"
                    value={form.nomEmployeur}
                    onChange={(e) =>
                      setForm({ ...form, nomEmployeur: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Adresse de l&apos;employeur{" "}
                    <span className="text-muted font-normal">(facultatif)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : 45 avenue de la République, 69001 Lyon"
                    value={form.adresseEmployeur}
                    onChange={(e) =>
                      setForm({ ...form, adresseEmployeur: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
              </fieldset>

              {/* Situation */}
              <fieldset className="space-y-2">
                <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  Type de situation <span className="text-red-500">*</span>
                </legend>
                {(
                  [
                    ["accident_travail", "Accident du travail"],
                    ["maladie", "Arrêt maladie / maladie professionnelle"],
                    ["autre", "Autre litige salarial"],
                  ] as const
                ).map(([val, label]) => (
                  <label
                    key={val}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-soft px-4 py-3 hover:bg-white/5 has-[:checked]:border-accent has-[:checked]:bg-accent/10"
                  >
                    <input
                      type="radio"
                      name="typeSituation"
                      value={val}
                      checked={form.typeSituation === val}
                      onChange={() =>
                        setForm({ ...form, typeSituation: val })
                      }
                      className="accent-blue-600"
                    />
                    <span className="text-sm font-medium text-white/90">
                      {label}
                    </span>
                  </label>
                ))}
              </fieldset>

              {/* Montant + indemnités */}
              <fieldset className="space-y-3">
                <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Détails financiers
                </legend>
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Montant réclamé (€) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : 1 200"
                    value={form.montantReclame}
                    onChange={(e) =>
                      setForm({ ...form, montantReclame: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
                <div>
                  <p className="mb-2 text-sm font-medium text-white/80">
                    Indemnités non versées par l&apos;employeur{" "}
                    <span className="text-muted font-normal">(facultatif)</span>
                  </p>
                  <div className="space-y-2">
                    {INDEMNITES_OPTIONS.map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-border-soft px-3 py-2 text-sm hover:bg-white/5 has-[:checked]:border-accent has-[:checked]:bg-accent/10"
                      >
                        <input
                          type="checkbox"
                          checked={form.indemnitesNonVersees.includes(opt)}
                          onChange={() => toggleIndemnite(opt)}
                          className="accent-blue-600"
                        />
                        <span className="text-white/90">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </fieldset>

              {/* Référence */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/80">
                  Référence du courrier{" "}
                  <span className="text-muted font-normal">(facultatif)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex : REF-2024-001"
                  value={form.referencesCourrier}
                  onChange={(e) =>
                    setForm({ ...form, referencesCourrier: e.target.value })
                  }
                  className={inputCls}
                />
              </div>

              {erreur && (
                <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                  {erreur}
                </p>
              )}
            </div>
          )}

          {etape === "lettre" && lettre && (
            <div className="rounded-xl border border-border-soft bg-ink p-4">
              <pre className="whitespace-pre-wrap font-sans text-sm text-white/90 leading-relaxed">
                {lettre}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border-soft px-6 py-4 shrink-0">
          {etape === "formulaire" && (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-full border border-white/25 bg-transparent px-5 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                onClick={generer}
                disabled={!champValide || loading}
                className="flex-1 rounded-full dc-gradient-bg px-5 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Génération en cours…" : "Générer la lettre"}
              </button>
            </div>
          )}

          {etape === "lettre" && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={() => setEtape("formulaire")}
                className="flex-1 rounded-full border border-white/25 bg-transparent px-5 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:bg-white/5"
              >
                Modifier
              </button>
              <button
                onClick={copier}
                className="flex-1 rounded-full border border-accent/30 bg-accent/10 px-5 py-3 text-sm font-semibold tracking-[0.3px] text-accent transition hover:bg-accent/20"
              >
                {copie ? "Copié !" : "Copier la lettre"}
              </button>
              <button
                onClick={telecharger}
                className="flex-1 rounded-full dc-gradient-bg px-5 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:opacity-90"
              >
                Télécharger en PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
