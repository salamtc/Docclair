"use client";

import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import Navbar from "@/components/Navbar";

const plans = [
  {
    id: "standard",
    nom: "Particulier",
    prix: "9",
    description: "Pour gérer vos propres courriers administratifs.",
    avantages: [
      "Analyses illimitées",
      "Explication en langage clair",
      "Génération de lettres de réponse",
      "Contestation CAF & employeur",
      "Chat conseiller sur chaque document",
      "Export comptable (CSV)",
    ],
    recommande: false,
    couleur: "border-border-soft",
    bouton: "border border-white/25 text-white hover:bg-white/5",
  },
  {
    id: "asso",
    nom: "Association",
    prix: "29",
    description: "Pour les associations et travailleurs sociaux.",
    avantages: [
      "Tout du plan Particulier",
      "Espace aidant dédié",
      "Jusqu'à 10 bénéficiaires",
      "Historique par bénéficiaire",
      "Notes internes par dossier",
      "Tableau de bord des urgences",
    ],
    recommande: true,
    couleur: "dc-gradient-border border-transparent bg-card-hover",
    bouton: "dc-gradient-bg text-white hover:opacity-90",
  },
  {
    id: "asso_pro",
    nom: "Association Pro",
    prix: "79",
    description: "Pour les structures avec de nombreux bénéficiaires.",
    avantages: [
      "Tout du plan Association",
      "Bénéficiaires illimités",
      "Support prioritaire par e-mail",
      "Rapport mensuel d'activité",
      "Formation à l'outil incluse",
    ],
    recommande: false,
    couleur: "border-border-soft",
    bouton: "border border-white/25 text-white hover:bg-white/5",
  },
];

export default function TarifsClient() {
  const { isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const [loading, setLoading] = useState<string | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  async function souscrire(planId: string) {
    if (!isSignedIn) {
      openSignIn();
      return;
    }
    setLoading(planId);
    setErreur(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErreur(data.erreur ?? "Erreur lors de la création du paiement.");
      }
    } catch {
      setErreur("Erreur de connexion.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-1 flex-col bg-ink text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-20">
        <div className="text-center mb-14">
          <h1 className="text-3xl font-bold sm:text-4xl">
            Des tarifs simples, sans surprise
          </h1>
          <p className="mt-4 text-lg text-muted">
            Résiliable à tout moment. Premier document analysé gratuitement.
          </p>
        </div>

        {erreur && (
          <p className="mb-8 rounded-xl bg-red-500/10 border border-red-500/30 px-5 py-3 text-sm text-red-400 text-center">
            {erreur}
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-2xl border bg-card p-8 ${plan.couleur}`}
            >
              {plan.recommande && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full dc-gradient-bg px-4 py-1 text-xs font-semibold text-white shadow">
                    Le plus populaire
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white">{plan.nom}</h2>
                <p className="mt-1 text-sm text-muted">{plan.description}</p>
                <div className="mt-5 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">{plan.prix}€</span>
                  <span className="mb-1 text-sm text-muted">/mois</span>
                </div>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.avantages.map((av) => (
                  <li key={av} className="flex items-start gap-2.5 text-sm text-white/90">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-accent" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    {av}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => souscrire(plan.id)}
                disabled={loading === plan.id || !isLoaded}
                className={`w-full rounded-full px-6 py-3 text-[15px] font-semibold tracking-[0.3px] transition disabled:opacity-60 ${plan.bouton}`}
              >
                {loading === plan.id
                  ? "Redirection…"
                  : isSignedIn
                  ? "Commencer"
                  : "Se connecter pour souscrire"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-border-soft bg-card p-6 text-center">
          <p className="text-sm text-white/80">
            Des questions sur nos tarifs ?{" "}
            <Link href="/contact" className="font-medium text-accent hover:underline">
              Contactez-nous
            </Link>
            {" "}— nous répondons sous 24h.
          </p>
          <p className="mt-2 text-xs text-muted">
            Paiement sécurisé par Stripe · Résiliation en un clic · Sans engagement
          </p>
        </div>
      </main>
    </div>
  );
}
