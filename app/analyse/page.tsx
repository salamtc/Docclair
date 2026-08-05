import type { Metadata } from "next";
import AnalyseClient from "./AnalyseClient";

export const metadata: Metadata = {
  title: "Analyser un document — DocClair",
  description:
    "Uploadez votre courrier CAF, impôts, banque ou huissier et obtenez une explication claire en 30 secondes, avec les actions à faire.",
  openGraph: {
    title: "Analysez votre courrier administratif — DocClair",
    description: "Uploadez un PDF ou une photo, on vous explique quoi faire en 30 secondes.",
    type: "website",
  },
};

export default function AnalysePage() {
  return <AnalyseClient />;
}
