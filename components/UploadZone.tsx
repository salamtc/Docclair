"use client";

import { useCallback, useRef, useState } from "react";

interface UploadZoneProps {
  onAnalyser: (payload: { texte?: string; fichier?: File }) => void;
  loading: boolean;
}

const TYPES_ACCEPTES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

// Mirroir de LIMITE_TAILLE_OCTETS (lib/pdf.ts) — ce fichier tourne côté
// client, on ne peut pas importer lib/pdf.ts ici (il embarque pdf-parse,
// un module Node.js only qui casserait le bundle client).
const TAILLE_MAX_OCTETS = 10 * 1024 * 1024;

function formatTailleKo(octets: number): string {
  return `${Math.round(octets / 1024)} Ko`;
}

export default function UploadZone({ onAnalyser, loading }: UploadZoneProps) {
  const [texte, setTexte] = useState("");
  const [fichier, setFichier] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback((files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;

    if (!TYPES_ACCEPTES.includes(f.type)) {
      setErreur("Seuls les fichiers PDF et images (JPG, PNG, WEBP) sont acceptés.");
      return;
    }
    if (f.size > TAILLE_MAX_OCTETS) {
      setErreur("Fichier trop volumineux (max 10MB)");
      return;
    }

    setErreur(null);
    setFichier(f);
    setTexte("");
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  function supprimerFichier() {
    setFichier(null);
    setErreur(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleAnalyserClick() {
    if (!fichier && texte.trim().length === 0) {
      setErreur("Veuillez ajouter un document ou coller du texte");
      return;
    }
    setErreur(null);
    onAnalyser(fichier ? { fichier } : { texte });
  }

  const peutAnalyser = (fichier !== null || texte.trim().length > 0) && !loading;

  return (
    <div className="space-y-6">
      <div>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition ${
            dragActive
              ? "border-accent bg-accent/10"
              : "border-border-soft bg-card hover:border-accent/60"
          }`}
        >
          {/*
            L'input recouvre toute la zone (opacity-0) plutôt que d'être en
            display:none : iOS Safari ignore parfois un .click() programmatique
            sur un input cache. Comme l'input reçoit le clic réel directement,
            on ne met AUCUN onClick sur le conteneur — un double déclenchement
            (clic réel sur l'input + .click() programmatique du parent) fait
            échouer la sélection de fichier sur plusieurs navigateurs.
          */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,image/*"
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <p className="pointer-events-none text-base font-medium text-white">
            Glissez votre PDF ou photo ici, ou cliquez pour choisir
          </p>
          <p className="pointer-events-none mt-1 text-sm text-muted">PDF, JPG, PNG — 10 Mo max</p>
        </div>

        {fichier && (
          <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3">
            <svg className="h-5 w-5 shrink-0 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                clipRule="evenodd"
              />
            </svg>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{fichier.name}</p>
              <p className="text-xs text-muted">{formatTailleKo(fichier.size)}</p>
            </div>
            <button
              type="button"
              onClick={supprimerFichier}
              aria-label="Supprimer le fichier"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-white/10 hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}
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
          setErreur(null);
        }}
        placeholder="Collez ici le texte de votre document..."
        rows={6}
        className="w-full rounded-xl border border-border-soft bg-card p-4 text-sm text-white placeholder:text-muted focus:border-accent focus:outline-none"
      />

      {erreur && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-center text-sm text-red-400">
          {erreur}
        </p>
      )}

      <button
        disabled={loading}
        onClick={handleAnalyserClick}
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
