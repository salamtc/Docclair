import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { AnalyseResult } from "@/lib/claude";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROMPT_SYSTEME = `Tu es un conseiller juridique accessible et bienveillant. Tu connais parfaitement le document administratif qui vient d'être analysé. Tu réponds aux questions de l'utilisateur en langage simple, sans jargon, de façon rassurante mais honnête. Tu ne donnes jamais de conseil juridique définitif mais tu orientes clairement.`;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    question,
    analyse,
    texteDocument,
    historique,
  }: {
    question: string;
    analyse: AnalyseResult;
    texteDocument: string;
    historique: { role: "user" | "assistant"; content: string }[];
  } = body;

  if (!question?.trim()) {
    return NextResponse.json({ erreur: "Question manquante" }, { status: 400 });
  }

  const extrait = texteDocument ? `\n\nExtrait du document original :\n${texteDocument.slice(0, 3000)}` : "";

  const contextAnalyse = `Voici l'analyse du document soumis par l'utilisateur :
- Organisme expéditeur : ${analyse.organisme}
- Type de document : ${analyse.type_document}
- Niveau d'urgence : ${analyse.urgence}
- Explication : ${analyse.explication}
- Actions recommandées : ${analyse.actions.map((a) => a.action).join(" / ")}${analyse.message_urgent ? `\n- Point d'attention : ${analyse.message_urgent}` : ""}${extrait}`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: `${PROMPT_SYSTEME}\n\n${contextAnalyse}`,
    messages: [
      ...historique,
      { role: "user", content: question },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    return NextResponse.json({ erreur: "Réponse inattendue" }, { status: 500 });
  }

  return NextResponse.json({ reponse: content.text });
}
