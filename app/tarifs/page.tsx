import type { Metadata } from "next";
import TarifsClient from "./TarifsClient";

export const metadata: Metadata = {
  title: "Tarifs — DocClair",
  description:
    "Des tarifs simples et sans surprise : Particulier 9€/mois, Association 29€/mois. Premier document analysé gratuitement, résiliable à tout moment.",
  openGraph: {
    title: "Tarifs DocClair — À partir de 9€/mois",
    description: "Analyses illimitées, lettres de réponse, contestation CAF. Premier document gratuit.",
    type: "website",
  },
};

export default function TarifsPage() {
  return <TarifsClient />;
}
