import type { Metadata } from "next";
import EssaiClient from "./EssaiClient";

export const metadata: Metadata = {
  title: "Essai gratuit sans inscription — DocClair",
  description:
    "Testez DocClair gratuitement, sans créer de compte. Uploadez votre courrier CAF, impôts ou banque et obtenez une explication claire en 30 secondes.",
  openGraph: {
    title: "Essayez DocClair gratuitement — Sans inscription",
    description:
      "Uploadez votre courrier administratif et obtenez une explication claire en 30 secondes, sans créer de compte.",
    type: "website",
  },
};

export default function EssaiPage() {
  return <EssaiClient />;
}
