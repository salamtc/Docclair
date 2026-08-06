"use client";

import { useState } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";
import ResultCard from "@/components/ResultCard";
import ChatSection from "@/components/ChatSection";
import PaywallModal from "@/components/PaywallModal";
import type { AnalyseResult } from "@/lib/claude";

export default function AnalyseClient() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyseResult | null>(null);
  const [texteDocument, setTexteDocument] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [afficherPaywall, setAfficherPaywall] = useState(false);

  const handleAnalyser = async ({
    texte,
    fichier,
  }: {
    texte?: string;
    fichier?: File;
  }) => {
    setLoading(true);
    setErreur(null);

    const formData = new FormData();
    if (fichier) formData.append("fichier", fichier);
    if (texte) formData.append("texte", texte);

    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.status === 403 && data.erreur === "quota_depasse") {
        setAfficherPaywall(true);
        setLoading(false);
        return;
      }

      if (!res.ok || data.erreur) {
        setErreur(data.erreur ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      const { texte_extrait, ...analyseResult } = data;
      setTexteDocument(texte_extrait ?? texte ?? "");
      setResult(analyseResult as AnalyseResult);

      sendGAEvent("event", "analyse_document", {
        event_category: "engagement",
        event_label: "document_analyse",
      });
    } catch {
      setErreur("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  function handleReset() {
    setResult(null);
    setTexteDocument("");
  }

  return (
    <div className="flex flex-1 flex-col bg-ink text-white">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        {!result ? (
          <>
            <h1 className="mb-8 text-center text-2xl font-semibold text-white">
              Analysez votre document
            </h1>
            {erreur && (
              <p className="mb-4 rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-center text-sm text-red-400">
                {erreur}
              </p>
            )}
            <UploadZone onAnalyser={handleAnalyser} loading={loading} />
          </>
        ) : (
          <div className="space-y-6">
            <ResultCard result={result} onReset={handleReset} />
            <ChatSection result={result} texteDocument={texteDocument} />
          </div>
        )}
      </main>

      {afficherPaywall && (
        <PaywallModal onClose={() => setAfficherPaywall(false)} />
      )}
    </div>
  );
}
