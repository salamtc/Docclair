"use client";

import { useState } from "react";

interface PaywallModalProps {
  onClose: () => void;
}

export default function PaywallModal({ onClose }: PaywallModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
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
          onClick={handleSubscribe}
          disabled={loading}
          className="mt-6 w-full rounded-full dc-gradient-bg px-6 py-3 text-base font-semibold tracking-[0.3px] text-white transition hover:opacity-90 disabled:opacity-40"
        >
          {loading ? "Redirection..." : "Commencer pour 9 €/mois"}
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-sm text-muted hover:text-white"
        >
          Non merci
        </button>
      </div>
    </div>
  );
}
