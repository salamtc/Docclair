"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import type { Beneficiaire, AnalyseAsso } from "@/lib/supabase";

const urgenceBadge = (u: string) => {
  if (u === "urgent") return "bg-red-500/15 text-red-400";
  if (u === "attention") return "bg-orange-500/15 text-orange-400";
  return "bg-white/10 text-white/60";
};

const urgenceLabel = (u: string) => {
  if (u === "urgent") return "Urgent";
  if (u === "attention") return "Attention";
  return "Info";
};

export default function BeneficiairePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  const [beneficiaire, setBeneficiaire] = useState<Beneficiaire | null>(null);
  const [analyses, setAnalyses] = useState<AnalyseAsso[]>([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  // Notes
  const [notes, setNotes] = useState("");
  const [notesSaving, setNotesSaving] = useState(false);
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Upload
  const [uploadMode, setUploadMode] = useState<"idle" | "loading" | "done">("idle");
  const [uploadErreur, setUploadErreur] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [texteManuel, setTexteManuel] = useState("");
  const [showTexte, setShowTexte] = useState(false);

  // Suppression
  const [confirmDelete, setConfirmDelete] = useState(false);

  const charger = () => {
    fetch(`/api/asso/beneficiaires/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.erreur) setErreur(d.erreur);
        else {
          setBeneficiaire(d.beneficiaire);
          setNotes(d.beneficiaire.notes ?? "");
          setAnalyses(d.analyses);
        }
      })
      .catch(() => setErreur("Erreur de connexion"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, id]);

  function saveNotes(val: string) {
    if (notesTimer.current) clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(async () => {
      setNotesSaving(true);
      await fetch(`/api/asso/beneficiaires/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: val }),
      });
      setNotesSaving(false);
    }, 800);
  }

  async function analyser(formData: FormData) {
    setUploadMode("loading");
    setUploadErreur(null);
    formData.append("beneficiaire_id", id);
    const res = await fetch("/api/asso/analyser", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok || data.erreur) {
      setUploadErreur(data.erreur ?? "Erreur d'analyse");
      setUploadMode("idle");
    } else {
      setUploadMode("done");
      setTexteManuel("");
      charger();
      setTimeout(() => setUploadMode("idle"), 2000);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("fichier", file);
    await analyser(fd);
    e.target.value = "";
  }

  async function handleTexte() {
    if (!texteManuel.trim()) return;
    const fd = new FormData();
    fd.append("texte", texteManuel);
    await analyser(fd);
  }

  async function toggleTraite(analyseId: string, traite: boolean) {
    await fetch(`/api/asso/beneficiaires/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analyse_id: analyseId, traite }),
    });
    setAnalyses((prev) => prev.map((a) => a.id === analyseId ? { ...a, traite } : a));
  }

  async function saveNoteInterne(analyseId: string, note: string) {
    await fetch(`/api/asso/beneficiaires/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analyse_id: analyseId, note_interne: note }),
    });
  }

  async function supprimer() {
    await fetch(`/api/asso/beneficiaires/${id}`, { method: "DELETE" });
    router.push("/asso/beneficiaires");
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-sm text-muted">Chargement…</p>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="p-8">
        <p className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-sm text-red-400">{erreur}</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/asso/beneficiaires" className="text-sm text-muted hover:text-white/85 transition">
            ← Bénéficiaires
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-white">
            {beneficiaire?.prenom} {beneficiaire?.nom}
          </h1>
          {beneficiaire?.numero_dossier && (
            <p className="mt-0.5 text-sm text-muted">N° {beneficiaire.numero_dossier}</p>
          )}
        </div>
        <button
          onClick={() => setConfirmDelete(true)}
          className="text-xs text-red-400 hover:text-red-300 transition mt-1"
        >
          Supprimer le dossier
        </button>
      </div>

      {/* Notes internes */}
      <div className="rounded-2xl border border-border-soft bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white">Notes internes</h2>
          {notesSaving && <span className="text-xs text-muted">Sauvegarde…</span>}
        </div>
        <textarea
          value={notes}
          onChange={(e) => { setNotes(e.target.value); saveNotes(e.target.value); }}
          rows={4}
          placeholder="Ajoutez des notes sur la situation de ce bénéficiaire…"
          className="w-full rounded-xl border border-border-soft bg-ink px-4 py-3 text-sm text-white/85 placeholder-muted focus:border-accent focus:outline-none resize-none"
        />
      </div>

      {/* Analyser un document */}
      <div className="rounded-2xl border border-border-soft bg-card p-6">
        <h2 className="font-semibold text-white mb-4">Analyser un document</h2>

        {uploadMode === "loading" ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="block h-2 w-2 rounded-full bg-muted animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="ml-3 text-sm text-muted">Analyse en cours…</span>
          </div>
        ) : uploadMode === "done" ? (
          <p className="text-center py-6 text-sm font-medium text-emerald-400">
            ✓ Document analysé et ajouté à l&apos;historique
          </p>
        ) : (
          <div className="space-y-3">
            <div className="flex gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="flex-1 rounded-xl border-2 border-dashed border-border-soft px-4 py-4 text-sm text-muted hover:border-accent/60 hover:text-white transition text-center"
              >
                Déposer un PDF
              </button>
              <button
                onClick={() => setShowTexte((v) => !v)}
                className="rounded-xl border border-border-soft px-4 py-4 text-sm text-muted hover:border-accent/60 hover:text-white transition"
              >
                Coller du texte
              </button>
            </div>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />

            {showTexte && (
              <div className="space-y-2">
                <textarea
                  value={texteManuel}
                  onChange={(e) => setTexteManuel(e.target.value)}
                  rows={5}
                  placeholder="Collez ici le contenu du courrier…"
                  className="w-full rounded-xl border border-border-soft bg-ink px-4 py-3 text-sm text-white/85 placeholder-muted focus:border-accent focus:outline-none resize-none"
                />
                <button
                  onClick={handleTexte}
                  disabled={!texteManuel.trim()}
                  className="w-full rounded-full dc-gradient-bg px-4 py-3 text-sm font-semibold tracking-[0.3px] text-white hover:opacity-90 disabled:opacity-40 transition"
                >
                  Analyser ce texte
                </button>
              </div>
            )}

            {uploadErreur && (
              <p className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">{uploadErreur}</p>
            )}
          </div>
        )}
      </div>

      {/* Historique des analyses */}
      <div>
        <h2 className="font-semibold text-white mb-3">
          Historique des documents ({analyses.length})
        </h2>

        {analyses.length === 0 ? (
          <div className="rounded-2xl border border-border-soft bg-card p-8 text-center">
            <p className="text-sm text-muted">Aucun document analysé pour ce bénéficiaire.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {analyses.map((a) => (
              <AnalyseRow
                key={a.id}
                analyse={a}
                onToggleTraite={(traite) => toggleTraite(a.id, traite)}
                onSaveNote={(note) => saveNoteInterne(a.id, note)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border-soft bg-card p-6 shadow-2xl">
            <h3 className="font-semibold text-white">Supprimer ce dossier ?</h3>
            <p className="mt-2 text-sm text-muted">
              Tous les documents analysés seront définitivement supprimés. Cette action est irréversible.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-full border border-white/25 px-4 py-3 text-sm font-medium text-white hover:bg-white/5 transition"
              >
                Annuler
              </button>
              <button
                onClick={supprimer}
                className="flex-1 rounded-full bg-red-600 px-4 py-3 text-sm font-medium text-white hover:bg-red-700 transition"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyseRow({
  analyse,
  onToggleTraite,
  onSaveNote,
}: {
  analyse: AnalyseAsso;
  onToggleTraite: (traite: boolean) => void;
  onSaveNote: (note: string) => void;
}) {
  const [note, setNote] = useState(analyse.note_interne ?? "");
  const [editNote, setEditNote] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleNote(val: string) {
    setNote(val);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSaveNote(val), 800);
  }

  return (
    <div className="rounded-2xl border border-border-soft bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="rounded-full dc-gradient-bg px-3 py-1 text-xs font-medium text-white">
            {analyse.organisme}
          </span>
          <span className="text-sm text-muted">{analyse.type_document}</span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${urgenceBadge(analyse.urgence)}`}>
            {urgenceLabel(analyse.urgence)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">
            {new Date(analyse.created_at).toLocaleDateString("fr-FR")}
          </span>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={analyse.traite}
              onChange={(e) => onToggleTraite(e.target.checked)}
              className="h-4 w-4 rounded accent-accent"
            />
            <span className="text-xs text-muted">Traité</span>
          </label>
        </div>
      </div>

      {analyse.explication && (
        <p className="mt-3 text-sm text-muted leading-relaxed">{analyse.explication}</p>
      )}

      <div className="mt-3">
        {editNote ? (
          <textarea
            value={note}
            onChange={(e) => handleNote(e.target.value)}
            onBlur={() => setEditNote(false)}
            autoFocus
            rows={2}
            placeholder="Note interne…"
            className="w-full rounded-xl border border-border-soft bg-ink px-3 py-2 text-sm text-white/85 placeholder-muted focus:border-accent focus:outline-none resize-none"
          />
        ) : (
          <button
            onClick={() => setEditNote(true)}
            className="text-xs text-muted hover:text-white transition text-left"
          >
            {note ? `📝 ${note}` : "+ Ajouter une note interne"}
          </button>
        )}
      </div>
    </div>
  );
}
