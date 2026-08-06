"use client";

import { useState } from "react";

interface ContesterModalProps {
  typeDocument: string;
  onClose: () => void;
}

interface FormData {
  nom: string;
  adresse: string;
  numeroAllocataire: string;
  referencesCourrier: string;
}

type EtapeType = "formulaire" | "lettre";

export default function ContesterModal({
  typeDocument,
  onClose,
}: ContesterModalProps) {
  const [etape, setEtape] = useState<EtapeType>("formulaire");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [lettre, setLettre] = useState<string | null>(null);
  const [copie, setCopie] = useState(false);
  const [form, setForm] = useState<FormData>({
    nom: "",
    adresse: "",
    numeroAllocataire: "",
    referencesCourrier: "",
  });

  async function generer() {
    setLoading(true);
    setErreur(null);
    try {
      const res = await fetch("/api/contester", {
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
  <title>Lettre de contestation CAF</title>
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
    form.nom.trim() && form.adresse.trim() && form.numeroAllocataire.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-border-soft bg-card shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-soft px-6 py-4 shrink-0">
          <h2 className="text-lg font-semibold text-white">
            Contester ce courrier
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
            <div className="space-y-4">
              <p className="text-sm text-muted leading-relaxed">
                Renseignez vos informations pour générer une lettre de
                contestation formelle appuyée sur l&apos;article{" "}
                <strong>L.114-17 du Code de la sécurité sociale</strong>.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : Marie Dupont"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="w-full rounded-lg border border-border-soft bg-ink px-3 py-2 text-sm text-white placeholder:text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent"
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
                    className="w-full rounded-lg border border-border-soft bg-ink px-3 py-2 text-sm text-white placeholder:text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Numéro d&apos;allocataire <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : 1234567A"
                    value={form.numeroAllocataire}
                    onChange={(e) =>
                      setForm({ ...form, numeroAllocataire: e.target.value })
                    }
                    className="w-full rounded-lg border border-border-soft bg-ink px-3 py-2 text-sm text-white placeholder:text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-white/80">
                    Référence du courrier{" "}
                    <span className="text-muted font-normal">
                      (facultatif)
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Ex : CAF-2024-XXXXX"
                    value={form.referencesCourrier}
                    onChange={(e) =>
                      setForm({ ...form, referencesCourrier: e.target.value })
                    }
                    className="w-full rounded-lg border border-border-soft bg-ink px-3 py-2 text-sm text-white placeholder:text-muted outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>

              {erreur && (
                <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                  {erreur}
                </p>
              )}
            </div>
          )}

          {etape === "lettre" && lettre && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border-soft bg-ink p-4">
                <pre className="whitespace-pre-wrap font-sans text-sm text-white/90 leading-relaxed">
                  {lettre}
                </pre>
              </div>
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
