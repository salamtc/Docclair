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
          <span className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white">
            {result.organisme}
          </span>
          <span className="rounded-full bg-stone-200 px-4 py-1.5 text-sm font-medium text-gray-700">
            {result.type_document}
          </span>
          {urgenceLabel && (
            <span className="rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-700">
              {urgenceLabel}
            </span>
          )}
        </div>

        <section className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Ce que ça veut dire
          </h2>
          <p className="text-gray-700 leading-relaxed">{result.explication}</p>
        </section>

        {result.rien_a_faire ? (
          <section className="rounded-2xl border border-stone-300 bg-stone-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Vous n&apos;avez rien à faire
            </h2>
          </section>
        ) : (
          <section className="rounded-2xl border border-green-200 bg-green-50 p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Ce que vous devez faire
            </h2>
            <ul className="space-y-4">
              {result.actions.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{item.action}</p>
                    {item.delai && (
                      <p className="text-sm text-gray-600">
                        Délai : {item.delai}
                      </p>
                    )}
                    {item.documents && (
                      <p className="text-sm text-gray-600">
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
          <section className="rounded-2xl border border-orange-200 bg-orange-50 p-6">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Attention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {result.message_urgent}
            </p>
          </section>
        )}

        {afficherBoutonContester && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Vous pensez que cette demande est injustifiée ?
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Générez une lettre de contestation formelle en quelques
                  secondes, appuyée sur la loi.
                </p>
              </div>
              <button
                onClick={() => setModalOuverte(true)}
                className="shrink-0 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
              >
                Contester ce courrier
              </button>
            </div>
          </section>
        )}

        {afficherBoutonEmployeur && (
          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Cette réclamation vous semble injustifiée ?
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Générez une mise en demeure citant le Code du travail, avec
                  mention d&apos;un recours aux Prud&apos;hommes.
                </p>
              </div>
              <button
                onClick={() => setModalEmployeurOuverte(true)}
                className="shrink-0 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700"
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
              className="w-full rounded-full border border-emerald-300 bg-emerald-50 px-6 py-3 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
            >
              Exporter pour ma comptabilité (.csv)
            </button>
          )}
          <button
            onClick={() => setModalLettreOuverte(true)}
            className="w-full rounded-full border border-blue-300 bg-blue-50 px-6 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
          >
            Générer une lettre de réponse
          </button>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => window.print()}
              className="flex-1 rounded-full border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition hover:bg-stone-50"
            >
              Télécharger le résumé en PDF
            </button>
            <button
              onClick={onReset}
              className="flex-1 rounded-full bg-blue-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
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
