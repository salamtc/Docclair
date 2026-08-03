import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { erreur: "Vous devez être connecté pour vous abonner." },
      { status: 401 }
    );
  }

  const origin = request.headers.get("origin") ?? request.nextUrl.origin;
  const body = await request.json().catch(() => ({}));
  const plan: string = body.plan ?? "standard";

  const priceId =
    plan === "asso"
      ? process.env.STRIPE_PRICE_ID_ASSO!
      : plan === "asso_pro"
      ? process.env.STRIPE_PRICE_ID_ASSO_PRO!
      : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    client_reference_id: userId,
    metadata: { plan },
    success_url: `${origin}/merci?plan=${plan}`,
    cancel_url: `${origin}/tarifs`,
  });

  return NextResponse.json({ url: session.url });
}
