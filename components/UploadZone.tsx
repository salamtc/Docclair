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
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
          dragActive
            ? "border-accent bg-accent/10"
            : "border-border-soft bg-card hover:border-accent/60"
        }`}
      >
        {/*
          iOS Safari peut ignorer un .click() programmatique sur un input
          caché avec display:none. On le garde dans le flux (opacity-0 +
          position absolute) plutôt que "hidden" pour que le picker natif
          s'ouvre de façon fiable sur iPhone/iPad.
        */}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp,image/gif"
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="text-base font-medium text-white">
          {fichier ? fichier.name : "Glissez votre PDF ou photo ici, ou cliquez pour choisir"}
        </p>
        <p className="mt-1 text-sm text-muted">PDF, JPG, PNG — 10 Mo max</p>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted">
        <div className="h-px flex-1 bg-border-soft" />
        ou
        <div className="h-px flex-1 bg-border-soft" />
      </div>

      <textarea
        value={texte}
        onChange={(e) => {
          setTexte(e.target.value);
          setFichier(null);
        }}
        placeholder="Collez ici le texte de votre document..."
        rows={6}
        className="w-full rounded-xl border border-border-soft bg-card p-4 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
      />

      <button
        disabled={!peutAnalyser}
        onClick={() => onAnalyser(fichier ? { fichier } : { texte })}
        className="w-full rounded-full dc-gradient-bg px-6 py-3 text-base font-semibold tracking-[0.3px] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Analyse en cours..." : "Analyser ce document"}
      </button>

      <p className="text-center text-sm text-muted">
        Vos documents ne sont pas stockés. Analyse en temps réel.
      </p>
    </div>
  );
}
