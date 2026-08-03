import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { obtenirAnalysesFiscales } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ erreur: "Connexion requise" }, { status: 401 });
  }

  const format = new URL(req.url).searchParams.get("format");
  const analyses = await obtenirAnalysesFiscales(userId);

  if (format === "csv") {
    const entete = ["date_courrier", "organisme", "type_document", "montant_dû", "date_échéance", "statut", "date_analyse"];
    const lignes = analyses.map((a) => [
      a.date_courrier ?? "",
      a.organisme,
      a.type_document,
      a.montant != null ? String(a.montant) : "",
      a.date_echeance ?? "",
      a.sens ?? "informatif",
      new Date(a.created_at).toLocaleDateString("fr-FR"),
    ]);

    const csv = [entete, ...lignes]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    return new NextResponse("﻿" + csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="docclair-fiscal-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  }

  return NextResponse.json(analyses);
}
