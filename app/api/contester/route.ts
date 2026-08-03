import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROMPT_SYSTEME = `Tu es un expert en droit des allocations familiales français. Tu rédiges des lettres de contestation formelles, précises et efficaces pour contester les demandes de remboursement de la CAF. Tu utilises les bons articles de loi et tu adoptes un ton professionnel.

Tu dois répondre UNIQUEMENT avec le texte de la lettre, sans aucune explication autour. La lettre doit être complète, prête à envoyer, avec les blocs de coordonnées en haut.`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nom, adresse, numeroAllocataire, referencesCourrier, typeDocument } =
    body;

  if (!nom || !adresse || !numeroAllocataire) {
    return NextResponse.json({ erreur: "Champs manquants" }, { status: 400 });
  }

  const userPrompt = `Rédige une lettre de contestation à la CAF avec ces informations :

Nom complet : ${nom}
Adresse : ${adresse}
Numéro d'allocataire : ${numeroAllocataire}
Référence du courrier contesté : ${referencesCourrier || "non précisée"}
Type de document : ${typeDocument}

La lettre doit :
- Contenir les coordonnées de l'allocataire et de la CAF en en-tête
- Mentionner explicitement l'article L.114-17 du Code de la sécurité sociale
- Contester fermement la demande de remboursement / l'indu
- Demander un réexamen complet du dossier
- Demander un accusé de réception
- Se terminer par une formule de politesse formelle
- Être datée d'aujourd'hui (${new Date().toLocaleDateString("fr-FR")})`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [{ role: "user", content: userPrompt }],
    system: PROMPT_SYSTEME,
  });

  const content = response.content[0];
  if (content.type !== "text") {
    return NextResponse.json(
      { erreur: "Réponse inattendue de l'IA" },
      { status: 500 }
    );
  }

  return NextResponse.json({ lettre: content.text });
}
