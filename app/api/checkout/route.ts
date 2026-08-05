import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  console.log("Checkout appelé");
  console.log("STRIPE_SECRET_KEY présente:", !!process.env.STRIPE_SECRET_KEY);
  console.log("STRIPE_PRICE_ID présent:", !!process.env.STRIPE_PRICE_ID);

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { erreur: "Vous devez être connecté pour vous abonner." },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  console.log("Body reçu:", body);
  const plan: string = body.plan ?? "standard";

  const priceId =
    plan === "asso"
      ? process.env.STRIPE_PRICE_ID_ASSO
      : plan === "asso_pro"
      ? process.env.STRIPE_PRICE_ID_ASSO_PRO
      : process.env.STRIPE_PRICE_ID;

  console.log("Price ID sélectionné:", priceId);

  if (!priceId) {
    return NextResponse.json(
      { erreur: "Price ID manquant pour le plan: " + plan },
      { status: 500 }
    );
  }

  // NEXT_PUBLIC_APP_URL prend le pas quand elle est définie (utile pour figer
  // les URL Stripe sur le domaine canonique). Sinon on retombe sur l'origine
  // de la requête (correct en local et en preview), puis sur un dernier
  // filet de sécurité si aucune des deux n'est disponible.
  const origin = request.headers.get("origin") ?? request.nextUrl.origin;
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    origin ||
    "https://docclair-f3nlop900-salhi-tc.vercel.app";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    metadata: { plan },
    success_url: `${baseUrl}/merci?plan=${plan}`,
    cancel_url: `${baseUrl}/tarifs`,
  });

  return NextResponse.json({ url: session.url });
}
