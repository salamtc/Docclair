import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROMPT_SYSTEME = `Tu es un expert en droit du travail français spécialisé dans les litiges salariaux. Tu rédiges des lettres de contestation formelles, précises et juridiquement solides pour contester les réclamations abusives d'anciens employeurs. Tu cites les bons articles du Code du travail, tu adoptes un ton ferme et professionnel, et tu rappelles les voies de recours disponibles. Tu rédiges uniquement le texte de la lettre, sans aucun commentaire autour.`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    nom,
    adresse,
    nomEmployeur,
    adresseEmployeur,
    typeSituation,
    montantReclame,
    indemnitesNonVersees,
    referencesCourrier,
    typeDocument,
  } = body;

  if (!nom || !adresse || !nomEmployeur || !montantReclame) {
    return NextResponse.json({ erreur: "Champs obligatoires manquants" }, { status: 400 });
  }

  const situationDetail =
    typeSituation === "accident_travail"
      ? "accident du travail (suspension du contrat de travail relevant de l'article L.1226-7 du Code du travail)"
      : typeSituation === "maladie"
      ? "arrêt maladie (suspension du contrat relevant de l'article L.1226-1 du Code du travail)"
      : "litige salarial";

  const indemnitesDetail =
    indemnitesNonVersees.length > 0
      ? `Les indemnités suivantes n'ont pas été versées : ${indemnitesNonVersees.join(", ")}.`
      : "";

  const userPrompt = `Rédige une lettre de contestation à un ancien employeur avec ces informations :

Expéditeur (salarié) :
- Nom complet : ${nom}
- Adresse : ${adresse}

Destinataire (employeur) :
- Raison sociale : ${nomEmployeur}
- Adresse : ${adresseEmployeur || "à compléter"}

Situation : ${situationDetail}
Type de document contesté : ${typeDocument}
Référence du courrier : ${referencesCourrier || "non précisée"}
Montant réclamé par l'employeur : ${montantReclame} €
${indemnitesDetail}

La lettre doit impérativement :
1. Contester fermement la réclamation de l'employeur
2. Citer l'article L.1226-7 du Code du travail (suspension du contrat pendant accident du travail ou maladie professionnelle)
3. Citer l'article L.1234-9 du Code du travail (indemnité de licenciement obligatoire)
4. Rappeler les obligations légales non respectées par l'employeur
5. Mettre en demeure l'employeur de régulariser la situation sous 15 jours à compter de la réception
6. Mentionner explicitement qu'en l'absence de réponse satisfaisante, un recours devant le Conseil de Prud'hommes sera engagé sans délai
7. Demander un accusé de réception
8. Être datée d'aujourd'hui (${new Date().toLocaleDateString("fr-FR")})
9. Se terminer par une formule de politesse formelle`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1800,
    messages: [{ role: "user", content: userPrompt }],
    system: PROMPT_SYSTEME,
  });

  const content = response.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ erreur: "Réponse inattendue de l'IA" }, { status: 500 });
  }

  return NextResponse.json({ lettre: content.text });
}
