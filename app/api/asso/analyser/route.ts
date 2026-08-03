import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { analyserDocument } from "@/lib/claude";
import { extraireTextePdf } from "@/lib/pdf";
import { enregistrerAnalyseAsso } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ erreur: "Connexion requise" }, { status: 401 });

  const formData = await request.formData();
  const beneficiaireId = formData.get("beneficiaire_id");
  const fichier = formData.get("fichier");
  const texteBrut = formData.get("texte");

  if (!beneficiaireId || typeof beneficiaireId !== "string") {
    return NextResponse.json({ erreur: "beneficiaire_id manquant" }, { status: 400 });
  }

  let texte: string;
  if (fichier instanceof File) {
    const buffer = Buffer.from(await fichier.arrayBuffer());
    texte = await extraireTextePdf(buffer);
  } else if (typeof texteBrut === "string" && texteBrut.trim().length > 0) {
    texte = texteBrut;
  } else {
    return NextResponse.json({ erreur: "Aucun document fourni." }, { status: 400 });
  }

  const result = await analyserDocument(texte);
  if ("erreur" in result) return NextResponse.json(result, { status: 422 });

  await enregistrerAnalyseAsso({
    beneficiaire_id: beneficiaireId,
    asso_user_id: userId,
    organisme: result.organisme,
    type_document: result.type_document,
    urgence: result.urgence,
    explication: result.explication,
    result_json: result as unknown as Record<string, unknown>,
  });

  return NextResponse.json({ ...result, texte_extrait: texte });
}
