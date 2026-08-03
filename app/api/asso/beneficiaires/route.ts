import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { creerBeneficiaire, obtenirBeneficiaires } from "@/lib/supabase";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ erreur: "Connexion requise" }, { status: 401 });

  const data = await obtenirBeneficiaires(userId);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ erreur: "Connexion requise" }, { status: 401 });

  const body = await request.json();
  const { nom, prenom, numero_dossier } = body;

  if (!nom?.trim() || !prenom?.trim()) {
    return NextResponse.json({ erreur: "Nom et prénom obligatoires" }, { status: 400 });
  }

  const row = await creerBeneficiaire(userId, { nom: nom.trim(), prenom: prenom.trim(), numero_dossier: numero_dossier?.trim() || undefined });
  return NextResponse.json(row, { status: 201 });
}
