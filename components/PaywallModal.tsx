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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h2 className="text-xl font-semibold text-gray-900">
          Vous avez utilisé votre analyse gratuite
        </h2>
        <p className="mt-2 text-gray-600">
          Pour des analyses illimitées, passez à DocClair Pro.
        </p>

        <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-5">
          <p className="text-3xl font-semibold text-gray-900">
            9 €<span className="text-base font-normal text-gray-500">/mois</span>
          </p>
          <p className="mt-1 text-sm text-gray-500">Résiliable à tout moment</p>
          <ul className="mt-4 space-y-2 text-sm text-gray-700">
            <li>✓ Analyses illimitées</li>
            <li>✓ Tous types de documents</li>
            <li>✓ Export PDF</li>
          </ul>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="mt-6 w-full rounded-full bg-blue-600 px-6 py-3 text-base font-medium text-white transition hover:bg-blue-700 disabled:bg-stone-300"
        >
          {loading ? "Redirection..." : "Commencer pour 9 €/mois"}
        </button>

        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Non merci
        </button>
      </div>
    </div>
  );
}
