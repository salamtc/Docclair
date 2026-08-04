import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { analyserDocument, analyserImage, type ImageMediaType } from "@/lib/claude";
import { extraireTextePdf, LIMITE_TAILLE_OCTETS } from "@/lib/pdf";
import {
  aDejaUtiliseAnalyseGratuite,
  enregistrerAnalyse,
  estAbonneActif,
} from "@/lib/supabase";

const TYPES_IMAGE: ImageMediaType[] = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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

  let result: Awaited<ReturnType<typeof analyserDocument>>;
  let texteExtrait: string | null = null;

  if (fichier instanceof File) {
    if (fichier.size > LIMITE_TAILLE_OCTETS) {
      return NextResponse.json(
        { erreur: "Fichier trop volumineux. La limite est de 10 Mo." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await fichier.arrayBuffer());

    if (TYPES_IMAGE.includes(fichier.type as ImageMediaType)) {
      try {
        result = await analyserImage(buffer, fichier.type as ImageMediaType);
      } catch (err) {
        console.error("[analyse] Erreur analyse image:", err);
        return NextResponse.json(
          { erreur: "Impossible d'analyser cette image. Essayez de copier-coller le texte directement." },
          { status: 422 }
        );
      }
    } else {
      try {
        texteExtrait = await extraireTextePdf(buffer);
      } catch (err) {
        console.error("[analyse] Erreur pdf-parse:", err);
        return NextResponse.json(
          { erreur: "Impossible de lire ce fichier. Essayez de copier-coller le texte directement." },
          { status: 400 }
        );
      }
      result = await analyserDocument(texteExtrait);
    }
  } else if (typeof texteBrut === "string" && texteBrut.trim().length > 0) {
    texteExtrait = texteBrut;
    result = await analyserDocument(texteExtrait);
  } else {
    return NextResponse.json({ erreur: "Aucun document fourni." }, { status: 400 });
  }

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

  return NextResponse.json({ ...result, texte_extrait: texteExtrait ?? "" });
}
