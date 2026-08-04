"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Abonnement {
  status: string;
  plan: string | null;
  created_at: string;
}

const planNom: Record<string, string> = {
  standard: "Particulier — 9€/mois",
  asso: "Association — 29€/mois",
  asso_pro: "Association Pro — 79€/mois",
};

const planLien: Record<string, string> = {
  asso: "/asso",
  asso_pro: "/asso",
  standard: "/analyse",
};

export default function MonComptePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [abonnement, setAbonnement] = useState<Abonnement | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) { setLoading(false); return; }
    fetch("/api/mon-compte")
      .then((r) => r.json())
      .then((d) => { if (!d.erreur) setAbonnement(d); })
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn]);

  async function ouvrirPortail() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setPortalLoading(false);
    }
  }

  const isActive = abonnement?.status === "active";
  const planKey = abonnement?.plan ?? "standard";

  return (
    <div className="flex flex-1 flex-col bg-ink text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-white mb-8">Mon compte</h1>

        {!isLoaded || loading ? (
          <p className="text-sm text-muted">Chargement…</p>
        ) : !isSignedIn ? (
          <div className="rounded-2xl border border-border-soft bg-card p-8 text-center">
            <p className="text-muted mb-4">Connectez-vous pour accéder à votre compte.</p>
            <Link href="/analyse" className="rounded-full dc-gradient-bg px-5 py-2.5 text-sm font-medium text-white hover:opacity-90">
              Se connecter
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Profil */}
            <div className="rounded-2xl border border-border-soft bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4">Profil</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Nom</span>
                  <span className="font-medium text-white">{user?.fullName ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">E-mail</span>
                  <span className="font-medium text-white">
                    {user?.primaryEmailAddress?.emailAddress ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Abonnement */}
            <div className="rounded-2xl border border-border-soft bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4">Abonnement</h2>

              {isActive ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Plan actif</span>
                    <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-400">
                      Actif
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Formule</span>
                    <span className="text-sm font-medium text-white">
                      {planNom[planKey] ?? "Abonnement actif"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Depuis le</span>
                    <span className="text-sm text-white">
                      {new Date(abonnement!.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-border-soft space-y-2">
                    <Link
                      href={planLien[planKey] ?? "/analyse"}
                      className="flex w-full items-center justify-center rounded-full dc-gradient-bg px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
                    >
                      Accéder à mon espace
                    </Link>
                    <button
                      onClick={ouvrirPortail}
                      disabled={portalLoading}
                      className="flex w-full items-center justify-center rounded-full border border-white/25 bg-transparent px-5 py-2.5 text-sm font-medium text-white hover:bg-ink text-white transition disabled:opacity-60"
                    >
                      {portalLoading ? "Redirection…" : "Gérer ou résilier mon abonnement"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted mb-4">
                    {abonnement ? "Votre abonnement est inactif." : "Vous n'avez pas encore d'abonnement."}
                  </p>
                  <Link
                    href="/tarifs"
                    className="rounded-full dc-gradient-bg px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 transition"
                  >
                    Voir les offres
                  </Link>
                </div>
              )}
            </div>

            {/* Liens utiles */}
            <div className="rounded-2xl border border-border-soft bg-card p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-4">Liens utiles</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/historique" className="text-accent hover:underline">
                    Mes documents fiscaux
                  </Link>
                </li>
                <li>
                  <Link href="/cgu" className="text-accent hover:underline">
                    Conditions générales d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="text-accent hover:underline">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-accent hover:underline">
                    Contacter le support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
