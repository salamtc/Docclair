"use client";

import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  onAnalyser: (payload: { texte?: string; fichier?: File }) => void;
  loading: boolean;
}

export default function UploadZone({ onAnalyser, loading }: UploadZoneProps) {
  const [texte, setTexte] = useState("");
  const [fichier, setFichier] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const TYPES_ACCEPTES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  const handleFiles = useCallback((files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!TYPES_ACCEPTES.includes(f.type)) {
      alert("Seuls les fichiers PDF et images (JPG, PNG, WEBP) sont acceptés.");
      return;
    }
    setFichier(f);
    setTexte("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const peutAnalyser = (fichier !== null || texte.trim().length > 0) && !loading;

  return (
    <div className="space-y-6">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-stone-300 bg-white hover:border-blue-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-base font-medium text-gray-900">
          {fichier ? fichier.name : "Glissez votre PDF ou photo ici, ou cliquez pour choisir"}
        </p>
        <p className="mt-1 text-sm text-gray-500">PDF, JPG, PNG — 10 Mo max</p>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-400">
        <div className="h-px flex-1 bg-stone-200" />
        ou
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      <textarea
        value={texte}
        onChange={(e) => {
          setTexte(e.target.value);
          setFichier(null);
        }}
        placeholder="Collez ici le texte de votre document..."
        rows={6}
        className="w-full rounded-xl border border-stone-300 bg-white p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none"
      />

      <button
        disabled={!peutAnalyser}
        onClick={() => onAnalyser(fichier ? { fichier } : { texte })}
        className="w-full rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        {loading ? "Analyse en cours..." : "Analyser ce document"}
      </button>

      <p className="text-center text-sm text-gray-500">
        Vos documents ne sont pas stockés. Analyse en temps réel.
      </p>
    </div>
  );
}
