"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import UploadZone from "@/components/UploadZone";
import ResultCard from "@/components/ResultCard";
import ChatSection from "@/components/ChatSection";
import PaywallModal from "@/components/PaywallModal";
import type { AnalyseResult } from "@/lib/claude";

export default function AnalysePage() {
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

      if (res.status === 402) {
        setAfficherPaywall(true);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!res.ok || data.erreur) {
        setErreur(data.erreur ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      const { texte_extrait, ...analyseResult } = data;
      setTexteDocument(texte_extrait ?? texte ?? "");
      setResult(analyseResult as AnalyseResult);
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
    <div className="flex flex-1 flex-col bg-stone-50">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
        {!result ? (
          <>
            <h1 className="mb-8 text-center text-2xl font-semibold text-gray-900">
              Analysez votre document
            </h1>
            {erreur && (
              <p className="mb-4 rounded-xl bg-red-50 p-4 text-center text-sm text-red-700">
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
