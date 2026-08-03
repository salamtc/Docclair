import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { analyserDocument } from "@/lib/claude";
import { extraireTextePdf } from "@/lib/pdf";
import {
  aDejaUtiliseAnalyseGratuite,
  enregistrerAnalyse,
  estAbonneActif,
} from "@/lib/supabase";

function getIpAddress(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "inconnu";
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  const ipAddress = getIpAddress(request);

  if (userId) {
    if (!(await estAbonneActif(userId))) {
      if (await aDejaUtiliseAnalyseGratuite(userId, ipAddress)) {
        return NextResponse.json({ quotaDepasse: true }, { status: 402 });
      }
    }
  } else if (await aDejaUtiliseAnalyseGratuite(null, ipAddress)) {
    return NextResponse.json({ quotaDepasse: true }, { status: 402 });
  }

  const formData = await request.formData();
  const fichier = formData.get("fichier");
  const texteBrut = formData.get("texte");

  let texte: string;
  if (fichier instanceof File) {
    const buffer = Buffer.from(await fichier.arrayBuffer());
    texte = await extraireTextePdf(buffer);
  } else if (typeof texteBrut === "string" && texteBrut.trim().length > 0) {
    texte = texteBrut;
  } else {
    return NextResponse.json(
      { erreur: "Aucun document fourni." },
      { status: 400 }
    );
  }

  const result = await analyserDocument(texte);

  if ("erreur" in result) {
    return NextResponse.json(result, { status: 422 });
  }

  await enregistrerAnalyse(
    userId,
    ipAddress,
    result.organisme,
    result.type_document,
    result.comptabilite
  );

  return NextResponse.json({ ...result, texte_extrait: texte });
}
