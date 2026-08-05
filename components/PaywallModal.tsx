"use client";

import { useState } from "react";

interface PaywallModalProps {
  onClose: () => void;
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);

  const handleAbonnement = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "standard" }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.erreur ?? "Erreur lors de la redirection vers le paiement");
      }
    } catch {
      alert("Erreur de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border-soft bg-card p-8 shadow-2xl">
        <h2 className="text-xl font-semibold text-white">
          Vous avez utilisé votre analyse gratuite
        </h2>
        <p className="mt-2 text-muted">
          Pour des analyses illimitées, passez à DocClair Pro.
        </p>

        <div className="mt-6 rounded-xl border border-border-soft bg-ink p-5">
          <p className="text-3xl font-bold text-white">
            9 €<span className="text-base font-normal text-muted">/mois</span>
          </p>
          <p className="mt-1 text-sm text-muted">Résiliable à tout moment</p>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            <li>✓ Analyses illimitées</li>
            <li>✓ Tous types de documents</li>
            <li>✓ Export PDF</li>
          </ul>
        </div>

        <button
          type="button"
          onClick={handleAbonnement}
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full dc-gradient-bg px-6 py-3 text-base font-semibold tracking-[0.3px] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <>
              <svg
                className="h-4 w-4 animate-spin text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Chargement...
            </>
          ) : (
            "M'abonner pour 9 €/mois"
          )}
        </button>

        <button
          onClick={onClose}
          disabled={loading}
          className="mt-3 w-full text-center text-sm text-muted hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Non merci
        </button>
      </div>
    </div>
  );
}
