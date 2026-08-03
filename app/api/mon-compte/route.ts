import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ erreur: "Connexion requise" }, { status: 401 });

  const { data } = await supabase
    .from("abonnements")
    .select("status, plan, created_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return NextResponse.json({ erreur: "Aucun abonnement" }, { status: 404 });
  return NextResponse.json(data);
}
