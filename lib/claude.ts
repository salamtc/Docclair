import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PROMPT_SYSTEME = `Tu es un assistant spécialisé dans l'explication des documents administratifs français.
Tu reçois le contenu d'un document officiel (lettre de la CAF, des impôts, d'une banque, d'un huissier, de la sécurité sociale, etc.)

Tu dois répondre UNIQUEMENT en JSON valide avec cette structure exacte :
{
  "organisme": "Nom de l'organisme expéditeur (ex: CAF, Direction Générale des Finances Publiques, Crédit Agricole...)",
  "type_document": "Type de courrier en 3-5 mots (ex: Avis de régularisation, Mise en demeure, Notification d'allocation...)",
  "urgence": "none" | "attention" | "urgent",
  "explication": "Explication en langage simple de ce que dit ce document. Maximum 4 phrases. Parle directement au destinataire (tu/vous). Pas de jargon administratif.",
  "actions": [
    {
      "action": "Description courte de l'action à faire",
      "delai": "Délai si applicable (ex: avant le 15 juin, sous 30 jours) ou null",
      "documents": "Documents éventuellement nécessaires ou null"
    }
  ],
  "message_urgent": "Si urgence = urgent ou attention, message d'alerte court. Sinon null.",
  "rien_a_faire": true | false,
  "comptabilite": {
    "pertinent": true si le document concerne un montant fiscal ou social (impôts, TVA, URSSAF, cotisations, RSI, CIPAV, taxes, redevances), false sinon,
    "montant": montant numérique extrait du document (sans symbole) ou null si absent ou non pertinent,
    "sens": "à payer" si c'est une dette ou obligation de paiement, "remboursement" si c'est un avoir ou remboursement, null si non applicable,
    "date_echeance": date limite de paiement au format "JJ/MM/AAAA" ou null,
    "date_courrier": date du courrier au format "JJ/MM/AAAA" ou null si non trouvée
  }
}

Si le document est illisible ou ne semble pas être un document administratif, retourne :
{ "erreur": "Ce document ne semble pas être un courrier administratif reconnaissable." }`;

export interface ActionItem {
  action: string;
  delai: string | null;
  documents: string | null;
}

export interface Comptabilite {
  pertinent: boolean;
  montant: number | null;
  sens: "à payer" | "remboursement" | null;
  date_echeance: string | null;
  date_courrier: string | null;
}

export interface AnalyseResult {
  organisme: string;
  type_document: string;
  urgence: "none" | "attention" | "urgent";
  explication: string;
  actions: ActionItem[];
  message_urgent: string | null;
  rien_a_faire: boolean;
  comptabilite?: Comptabilite;
}

export interface AnalyseErreur {
  erreur: string;
}

function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
}

function parseReponse(text: string): AnalyseResult | AnalyseErreur {
  return JSON.parse(extractJson(text));
}

export async function analyserDocument(
  texte: string
): Promise<AnalyseResult | AnalyseErreur> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1400,
    system: PROMPT_SYSTEME,
    messages: [
      {
        role: "user",
        content: `Voici le contenu d'un document administratif. Analyse-le et réponds en JSON :\n\n${texte}`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Réponse inattendue");
  return parseReponse(content.text);
}

export type ImageMediaType = "image/jpeg" | "image/png" | "image/webp" | "image/gif";

export async function analyserImage(
  imageBuffer: Buffer,
  mediaType: ImageMediaType
): Promise<AnalyseResult | AnalyseErreur> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1400,
    system: PROMPT_SYSTEME,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBuffer.toString("base64"),
            },
          },
          {
            type: "text",
            text: "Voici l'image d'un document administratif. Analyse-le et réponds en JSON :",
          },
        ],
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Réponse inattendue");
  return parseReponse(content.text);
}
