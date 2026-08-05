import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import HistoriqueClient from "./HistoriqueClient";

export const metadata: Metadata = {
  title: "Mon historique — DocClair",
  description: "Retrouvez tous vos documents administratifs analysés par DocClair.",
  robots: { index: false, follow: false },
};

export default async function HistoriquePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in?redirect_url=/historique");
  }

  return <HistoriqueClient />;
}
