import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { supabase } from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ erreur: "Connexion requise" }, { status: 401 });
  }

  const { data } = await supabase
    .from("abonnements")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data?.stripe_customer_id) {
    return NextResponse.json({ erreur: "Aucun abonnement trouvé." }, { status: 404 });
  }

  const origin = request.headers.get("origin") ?? request.nextUrl.origin;

  const session = await stripe.billingPortal.sessions.create({
    customer: data.stripe_customer_id,
    return_url: `${origin}/mon-compte`,
  });

  return NextResponse.json({ url: session.url });
}
