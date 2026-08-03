import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROMPT_SYSTEME = `Tu es expert en rédaction de courriers administratifs français. Tu génères des lettres formelles, efficaces et correctement structurées (lieu/date, objet, formule d'appel, corps, formule de politesse, signature). Tu adaptes le ton et les arguments juridiques selon l'organisme destinataire et l'objet de la lettre. Tu cites les articles de loi pertinents quand c'est utile.

Tu rédiges UNIQUEMENT le texte de la lettre, sans commentaire autour. La lettre doit être complète et prête à envoyer.`;

const OBJETS_LIBELLES: Record<string, string> = {
  contester: "Contestation de décision",
  delai: "Demande de délai de paiement",
  explications: "Demande d'explications complémentaires",
  erreur: "Signalement d'une erreur dans le dossier",
  accuser: "Accusé de réception",
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { nom, adresse, reference, objet, organisme, typeDocument, explication } = body;

  if (!nom || !adresse || !objet) {
    return NextResponse.json({ erreur: "Champs obligatoires manquants" }, { status: 400 });
  }

  const objetLibelle = OBJETS_LIBELLES[objet] ?? objet;
  const refMention = reference ? `Référence courrier : ${reference}` : "Pas de référence précisée";

  const userPrompt = `Rédige une lettre de réponse à un organisme administratif avec ces informations :

Expéditeur :
- Nom complet : ${nom}
- Adresse : ${adresse}

Destinataire : ${organisme}
Type de document reçu : ${typeDocument}
${refMention}
Objet de la réponse : ${objetLibelle}

Contexte du document reçu : ${explication}

La lettre doit :
- Être datée du ${new Date().toLocaleDateString("fr-FR")} (Paris)
- Avoir un objet clair en en-tête
- Utiliser "Madame, Monsieur," comme formule d'appel
- Être adaptée à l'objet "${objetLibelle}" et à l'organisme "${organisme}"
- Citer des articles de loi pertinents si l'objet est une contestation ou un signalement d'erreur
- Se terminer par une formule de politesse complète et une signature
- Mentionner une demande d'accusé de réception`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    messages: [{ role: "user", content: userPrompt }],
    system: PROMPT_SYSTEME,
  });

  const content = response.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ erreur: "Réponse inattendue de l'IA" }, { status: 500 });
  }

  return NextResponse.json({ lettre: content.text });
}
