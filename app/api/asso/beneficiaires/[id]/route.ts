import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  obtenirBeneficiaire,
  obtenirAnalysesAsso,
  mettreAJourBeneficiaire,
  supprimerBeneficiaire,
  mettreAJourAnalyseAsso,
} from "@/lib/supabase";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ erreur: "Connexion requise" }, { status: 401 });

  const { id } = await params;
  const [beneficiaire, analyses] = await Promise.all([
    obtenirBeneficiaire(id, userId),
    obtenirAnalysesAsso(id, userId),
  ]);

  if (!beneficiaire) return NextResponse.json({ erreur: "Introuvable" }, { status: 404 });
  return NextResponse.json({ beneficiaire, analyses });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ erreur: "Connexion requise" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // Update a specific analyse_asso (note_interne or traite)
  if (body.analyse_id !== undefined) {
    await mettreAJourAnalyseAsso(body.analyse_id, userId, {
      ...(body.note_interne !== undefined && { note_interne: body.note_interne }),
      ...(body.traite !== undefined && { traite: body.traite }),
    });
    return NextResponse.json({ ok: true });
  }

  // Update beneficiaire fields (notes, nom, prenom, numero_dossier)
  const allowed = ["notes", "nom", "prenom", "numero_dossier"] as const;
  const updates: Record<string, string> = {};
  for (const k of allowed) {
    if (body[k] !== undefined) updates[k] = body[k];
  }
  await mettreAJourBeneficiaire(id, userId, updates);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ erreur: "Connexion requise" }, { status: 401 });

  const { id } = await params;
  await supprimerBeneficiaire(id, userId);
  return NextResponse.json({ ok: true });
}
