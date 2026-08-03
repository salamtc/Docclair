import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { obtenirDashboardAsso } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ erreur: "Connexion requise" }, { status: 401 });

  const data = await obtenirDashboardAsso(userId);
  return NextResponse.json(data);
}
