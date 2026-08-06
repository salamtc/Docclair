"use client";

import { useState } from "react";
import type { AnalyseResult } from "@/lib/claude";
import ContesterModal from "./ContesterModal";
import ContesterEmployeurModal from "./ContesterEmployeurModal";
import LettreReponseModal from "./LettreReponseModal";

interface ResultCardProps {
  result: AnalyseResult;
  onReset: () => void;
}

const ORGS_PUBLICS = [
  "caf", "cpam", "urssaf", "dgfip", "fisc", "impôts", "impot",
  "sécurité sociale", "sécu", "pôle emploi", "france travail",
  "assurance maladie", "retraite", "cnav", "agirc", "arrco",
];

function estContestableCAF(result: AnalyseResult): boolean {
  const org = result.organisme.toLowerCase();
  const type = result.type_document.toLowerCase();
  if (!org.includes("caf")) return false;
  const motsCles = [
    "indu", "remboursement", "trop-perçu", "trop perçu",
    "trop percé", "répétition", "recouvrement",
  ];
  return motsCles.some((mot) => type.includes(mot));
}

function estContestableEmployeur(result: AnalyseResult): boolean {
  const org = result.organisme.toLowerCase();
  const type = result.type_document.toLowerCase();
  if (ORGS_PUBLICS.some((o) => org.includes(o))) return false;
  const motsCles = [
    "réclamation", "heures", "trop-perçu", "trop perçu",
    "salaire", "licenciement", "remboursement", "solde de tout compte",
  ];
  return motsCles.some((mot) => type.includes(mot));
}

function exporterCSV(result: AnalyseResult) {
  const c = result.comptabilite;
  const statut = c?.sens ?? "informatif";
  const entete = ["date_courrier", "organisme", "type_document", "montant_dû", "date_échéance", "statut"];
  const ligne = [
    c?.date_courrier ?? "",
    result.organisme,
    result.type_document,
    c?.montant != null ? String(c.montant) : "",
    c?.date_echeance ?? "",
    statut,
  ];
  const csv = [entete, ligne].map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `docclair-${result.organisme.toLowerCase().replace(/[\s/]+/g, "-")}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
  const [modalOuverte, setModalOuverte] = useState(false);
  const [modalEmployeurOuverte, setModalEmployeurOuverte] = useState(false);
  const [modalLettreOuverte, setModalLettreOuverte] = useState(false);

  const urgenceLabel =
    result.urgence === "urgent"
      ? "Urgent"
      : result.urgence === "attention"
      ? "Attention"
      : null;

  const afficherBoutonContester = estContestableCAF(result);
  const afficherBoutonEmployeur = !afficherBoutonContester && estContestableEmployeur(result);
  const afficherExportCompta = result.comptabilite?.pertinent === true;

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3 print:block">
          <span className="rounded-full dc-gradient-bg px-4 py-1.5 text-sm font-medium text-white">
            {result.organisme}
          </span>
          <span className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80">
            {result.type_document}
          </span>
          {urgenceLabel && (
            <span className="rounded-full bg-orange-500/15 px-4 py-1.5 text-sm font-medium text-orange-400">
              {urgenceLabel}
            </span>
          )}
        </div>

        <section className="rounded-2xl border border-accent/30 bg-accent/10 p-6">
          <h2 className="mb-2 text-lg font-semibold text-white">
            Ce que ça veut dire
          </h2>
          <p className="text-white/85 leading-relaxed">{result.explication}</p>
        </section>

        {result.rien_a_faire ? (
          <section className="rounded-2xl border border-border-soft bg-card p-6">
            <h2 className="text-lg font-semibold text-white">
              Vous n&apos;avez rien à faire
            </h2>
          </section>
        ) : (
          <section className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Ce que vous devez faire
            </h2>
            <ul className="space-y-4">
              {result.actions.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-white">{item.action}</p>
                    {item.delai && (
                      <p className="text-sm text-muted">
                        Délai : {item.delai}
                      </p>
                    )}
                    {item.documents && (
                      <p className="text-sm text-muted">
                        Documents nécessaires : {item.documents}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {result.message_urgent && (
          <section className="rounded-2xl border border-orange-500/30 bg-orange-500/10 p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">
              Attention
            </h2>
            <p className="text-white/85 leading-relaxed">
              {result.message_urgent}
            </p>
          </section>
        )}

        {afficherBoutonContester && (
          <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Vous pensez que cette demande est injustifiée ?
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Générez une lettre de contestation formelle en quelques
                  secondes, appuyée sur la loi.
                </p>
              </div>
              <button
                onClick={() => setModalOuverte(true)}
                className="shrink-0 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:bg-red-500"
              >
                Contester ce courrier
              </button>
            </div>
          </section>
        )}

        {afficherBoutonEmployeur && (
          <section className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-white">
                  Cette réclamation vous semble injustifiée ?
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Générez une mise en demeure citant le Code du travail, avec
                  mention d&apos;un recours aux Prud&apos;hommes.
                </p>
              </div>
              <button
                onClick={() => setModalEmployeurOuverte(true)}
                className="shrink-0 rounded-full bg-amber-600 px-5 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:bg-amber-500"
              >
                Contester la réclamation
              </button>
            </div>
          </section>
        )}

        <div className="print-hide flex flex-col gap-3">
          {afficherExportCompta && (
            <button
              onClick={() => exporterCSV(result)}
              className="w-full rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-semibold tracking-[0.3px] text-emerald-400 transition hover:bg-emerald-500/20"
            >
              Exporter pour ma comptabilité (.csv)
            </button>
          )}
          <button
            onClick={() => setModalLettreOuverte(true)}
            className="w-full rounded-full border border-accent/30 bg-accent/10 px-6 py-3 text-sm font-semibold tracking-[0.3px] text-accent transition hover:bg-accent/20"
          >
            Générer une lettre de réponse
          </button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => window.print()}
              className="flex-1 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:bg-white/5"
            >
              Télécharger le résumé en PDF
            </button>
            <button
              onClick={onReset}
              className="flex-1 rounded-full dc-gradient-bg px-6 py-3 text-sm font-semibold tracking-[0.3px] text-white transition hover:opacity-90"
            >
              Analyser un autre document
            </button>
          </div>
        </div>
      </div>

      {modalOuverte && (
        <ContesterModal
          typeDocument={result.type_document}
          onClose={() => setModalOuverte(false)}
        />
      )}

      {modalEmployeurOuverte && (
        <ContesterEmployeurModal
          typeDocument={result.type_document}
          onClose={() => setModalEmployeurOuverte(false)}
        />
      )}

      {modalLettreOuverte && (
        <LettreReponseModal
          organisme={result.organisme}
          typeDocument={result.type_document}
          explication={result.explication}
          onClose={() => setModalLettreOuverte(false)}
        />
      )}
    </>
  );
}
