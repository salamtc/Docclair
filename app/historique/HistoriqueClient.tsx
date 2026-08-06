"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import ResultCard from "@/components/ResultCard";
import type { AnalyseResult } from "@/lib/claude";

interface DocumentHistorique {
  id: string;
  created_at: string;
  organisme: string;
  type_document: string;
  resultat: AnalyseResult | null;
}

function telechargerDocument(doc: DocumentHistorique) {
  const r = doc.resultat;
  const fenetre = window.open("", "_blank");
  if (!fenetre) return;

  const actionsHtml = r?.actions?.length
    ? `<ul>${r.actions
        .map(
          (a) =>
            `<li><strong>${a.action}</strong>${a.delai ? ` — Délai : ${a.delai}` : ""}${
              a.documents ? ` — Documents : ${a.documents}` : ""
            }</li>`
        )
        .join("")}</ul>`
    : "<p>Aucune action requise.</p>";

  fenetre.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>DocClair — ${doc.organisme}</title>
  <style>
    body { font-family: Georgia, serif; max-width: 700px; margin: 60px auto; font-size: 14px; line-height: 1.8; color: #111; }
    h1 { font-size: 20px; }
    .meta { color: #666; font-size: 12px; margin-bottom: 24px; }
    ul { padding-left: 20px; }
    @media print { body { margin: 30px; } }
  </style>
</head>
<body>
  <h1>${doc.organisme} — ${doc.type_document}</h1>
  <p class="meta">Analysé le ${new Date(doc.created_at).toLocaleDateString("fr-FR")} avec DocClair</p>
  <p>${r?.explication ?? ""}</p>
  <h2>Actions</h2>
  ${actionsHtml}
<script>window.onload = () => { window.print(); }<\/script>
</body></html>`);
  fenetre.document.close();
}

export default function HistoriqueClient() {
  const [documents, setDocuments] = useState<DocumentHistorique[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [filtreOrganisme, setFiltreOrganisme] = useState<string>("tous");
  const [docOuvert, setDocOuvert] = useState<DocumentHistorique | null>(null);

  useEffect(() => {
    fetch("/api/historique/documents")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setDocuments(data);
        else setErreur(data.erreur ?? "Erreur de chargement");
      })
      .catch(() => setErreur("Erreur de connexion"))
      .finally(() => setLoading(false));
  }, []);

  const organismes = useMemo(
    () => Array.from(new Set(documents.map((d) => d.organisme))).sort(),
    [documents]
  );

  const documentsAffiches =
    filtreOrganisme === "tous"
      ? documents
      : documents.filter((d) => d.organisme === filtreOrganisme);

  function exporterFiscalCsv() {
    window.open("/api/historique?format=csv", "_blank");
  }

  return (
    <div className="flex flex-1 flex-col bg-ink text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Mon historique</h1>
            <p className="mt-1 text-sm text-muted">
              Tous les documents administratifs que vous avez analysés avec DocClair.
            </p>
          </div>
          <button
            onClick={exporterFiscalCsv}
            className="shrink-0 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:bg-white/5"
          >
            Exporter mes documents fiscaux (.csv)
          </button>
        </div>

        {loading ? (
          <p className="text-center text-sm text-muted py-16">Chargement…</p>
        ) : erreur ? (
          <p className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400 text-center">
            {erreur}
          </p>
        ) : documents.length === 0 ? (
          <div className="rounded-2xl border border-border-soft bg-card p-10 text-center">
            <p className="text-muted text-sm mb-4">Aucun document analysé pour l&apos;instant.</p>
            <a
              href="/analyse"
              className="rounded-full dc-gradient-bg px-5 py-3 text-sm font-semibold tracking-[0.3px] text-white hover:opacity-90"
            >
              Analyser un document
            </a>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center gap-3">
              <label className="text-sm text-muted" htmlFor="filtre-organisme">
                Filtrer par organisme
              </label>
              <select
                id="filtre-organisme"
                value={filtreOrganisme}
                onChange={(e) => setFiltreOrganisme(e.target.value)}
                className="rounded-lg border border-border-soft bg-ink px-3 py-1.5 text-sm text-white outline-none focus:border-accent"
              >
                <option value="tous">Tous ({documents.length})</option>
                {organismes.map((org) => (
                  <option key={org} value={org}>
                    {org} ({documents.filter((d) => d.organisme === org).length})
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border-soft bg-card">
              <table className="w-full text-sm">
                <thead className="border-b border-border-soft bg-ink">
                  <tr>
                    {["Date", "Organisme", "Type de document", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-soft">
                  {documentsAffiches.map((doc) => (
                    <tr key={doc.id} className="hover:bg-white/5 transition">
                      <td className="px-4 py-3 text-white/85 whitespace-nowrap">
                        {new Date(doc.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                        {doc.organisme}
                      </td>
                      <td className="px-4 py-3 text-muted">{doc.type_document}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => setDocOuvert(doc)}
                            disabled={!doc.resultat}
                            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-accent/30 bg-accent/10 px-4 text-xs font-semibold tracking-[0.3px] text-accent transition hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-40"
                            title={doc.resultat ? undefined : "Analyse non disponible pour ce document"}
                          >
                            Revoir l&apos;analyse
                          </button>
                          <button
                            onClick={() => telechargerDocument(doc)}
                            disabled={!doc.resultat}
                            className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-white/25 px-4 text-xs font-semibold tracking-[0.3px] text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            Télécharger
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>

      {docOuvert && docOuvert.resultat && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10">
          <div className="w-full max-w-2xl rounded-2xl border border-border-soft bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted">
                Analysé le {new Date(docOuvert.created_at).toLocaleDateString("fr-FR")}
              </p>
              <button
                onClick={() => setDocOuvert(null)}
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
            <ResultCard result={docOuvert.resultat} onReset={() => setDocOuvert(null)} />
          </div>
        </div>
      )}
    </div>
  );
}
