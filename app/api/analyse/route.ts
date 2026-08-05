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
  console.log("API analyse appelée");
  console.log("Content-Type reçu:", request.headers.get("content-type"));
  console.log("ANTHROPIC_API_KEY présente:", !!process.env.ANTHROPIC_API_KEY);

  try {
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

    const contentType = request.headers.get("content-type") || "";

    let result: Awaited<ReturnType<typeof analyserDocument>> | undefined;
    let texteExtrait: string | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const fichier = formData.get("fichier");
      const texteBrut = formData.get("texte");

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
            return NextResponse.json(
              { erreur: (err as Error).message },
              { status: 400 }
            );
          }
        }
      } else if (typeof texteBrut === "string" && texteBrut.trim().length > 0) {
        texteExtrait = texteBrut.trim();
      } else {
        return NextResponse.json({ erreur: "Aucun document fourni." }, { status: 400 });
      }
    } else {
      const body = await request.json().catch(() => ({}));
      texteExtrait = typeof body.texte === "string" ? body.texte.trim() : "";
    }

    // À ce stade, soit `result` a déjà été fixé (analyse d'image), soit `texteExtrait` contient le texte à analyser.
    if (result === undefined) {
      if (texteExtrait === null || texteExtrait.length < 20) {
        return NextResponse.json(
          { erreur: "Le document est trop court ou vide." },
          { status: 400 }
        );
      }
      result = await analyserDocument(texteExtrait);
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
  } catch (error: any) {
    console.error("Erreur analyse complète:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { erreur: error.message || "Erreur inconnue" },
      { status: 500 }
    );
  }
}
