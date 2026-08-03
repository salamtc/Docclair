import { createClient } from "@supabase/supabase-js";
import type { Comptabilite } from "./claude";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function aDejaUtiliseAnalyseGratuite(
  userId: string | null,
  ipAddress: string
): Promise<boolean> {
  const query = supabase.from("analyses").select("id", { count: "exact", head: true });

  const { count, error } = userId
    ? await query.eq("user_id", userId)
    : await query.eq("ip_address", ipAddress);

  if (error) throw error;
  return (count ?? 0) > 0;
}

export async function enregistrerAnalyse(
  userId: string | null,
  ipAddress: string,
  organisme: string,
  typeDocument: string,
  comptabilite?: Comptabilite
) {
  const { error } = await supabase.from("analyses").insert({
    user_id: userId,
    ip_address: ipAddress,
    organisme,
    type_document: typeDocument,
    est_fiscal: comptabilite?.pertinent ?? false,
    montant: comptabilite?.montant ?? null,
    sens: comptabilite?.sens ?? null,
    date_echeance: comptabilite?.date_echeance ?? null,
    date_courrier: comptabilite?.date_courrier ?? null,
  });

  if (error) throw error;
}

export async function obtenirAnalysesFiscales(userId: string) {
  const { data, error } = await supabase
    .from("analyses")
    .select("id, created_at, organisme, type_document, montant, sens, date_echeance, date_courrier")
    .eq("user_id", userId)
    .eq("est_fiscal", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function estAbonneActif(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from("abonnements")
    .select("status")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  return data !== null;
}

// ─── Espace aidant ────────────────────────────────────────────────────────────

export interface Beneficiaire {
  id: string;
  asso_user_id: string;
  nom: string;
  prenom: string;
  numero_dossier: string | null;
  notes: string | null;
  created_at: string;
}

export interface AnalyseAsso {
  id: string;
  beneficiaire_id: string;
  asso_user_id: string;
  organisme: string | null;
  type_document: string | null;
  urgence: string;
  explication: string | null;
  result_json: Record<string, unknown> | null;
  note_interne: string | null;
  traite: boolean;
  created_at: string;
}

export async function creerBeneficiaire(
  assoUserId: string,
  data: { nom: string; prenom: string; numero_dossier?: string }
): Promise<Beneficiaire> {
  const { data: row, error } = await supabase
    .from("beneficiaires")
    .insert({ asso_user_id: assoUserId, ...data })
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function obtenirBeneficiaires(assoUserId: string): Promise<Beneficiaire[]> {
  const { data, error } = await supabase
    .from("beneficiaires")
    .select("*")
    .eq("asso_user_id", assoUserId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function obtenirBeneficiaire(
  id: string,
  assoUserId: string
): Promise<Beneficiaire | null> {
  const { data, error } = await supabase
    .from("beneficiaires")
    .select("*")
    .eq("id", id)
    .eq("asso_user_id", assoUserId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function mettreAJourBeneficiaire(
  id: string,
  assoUserId: string,
  fields: Partial<Pick<Beneficiaire, "notes" | "nom" | "prenom" | "numero_dossier">>
) {
  const { error } = await supabase
    .from("beneficiaires")
    .update(fields)
    .eq("id", id)
    .eq("asso_user_id", assoUserId);
  if (error) throw error;
}

export async function supprimerBeneficiaire(id: string, assoUserId: string) {
  const { error } = await supabase
    .from("beneficiaires")
    .delete()
    .eq("id", id)
    .eq("asso_user_id", assoUserId);
  if (error) throw error;
}

export async function enregistrerAnalyseAsso(data: {
  beneficiaire_id: string;
  asso_user_id: string;
  organisme: string;
  type_document: string;
  urgence: string;
  explication: string;
  result_json: Record<string, unknown>;
}): Promise<AnalyseAsso> {
  const { data: row, error } = await supabase
    .from("analyses_asso")
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return row;
}

export async function obtenirAnalysesAsso(
  beneficiaireId: string,
  assoUserId: string
): Promise<AnalyseAsso[]> {
  const { data, error } = await supabase
    .from("analyses_asso")
    .select("*")
    .eq("beneficiaire_id", beneficiaireId)
    .eq("asso_user_id", assoUserId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function mettreAJourAnalyseAsso(
  id: string,
  assoUserId: string,
  fields: Partial<Pick<AnalyseAsso, "note_interne" | "traite">>
) {
  const { error } = await supabase
    .from("analyses_asso")
    .update(fields)
    .eq("id", id)
    .eq("asso_user_id", assoUserId);
  if (error) throw error;
}

export async function obtenirDashboardAsso(assoUserId: string): Promise<{
  total_beneficiaires: number;
  docs_urgents: Array<AnalyseAsso & { beneficiaire: Pick<Beneficiaire, "nom" | "prenom"> }>;
}> {
  const [{ count }, { data: urgents, error }] = await Promise.all([
    supabase
      .from("beneficiaires")
      .select("id", { count: "exact", head: true })
      .eq("asso_user_id", assoUserId),
    supabase
      .from("analyses_asso")
      .select("*, beneficiaire:beneficiaires(nom, prenom)")
      .eq("asso_user_id", assoUserId)
      .eq("traite", false)
      .in("urgence", ["urgent", "attention"])
      .order("created_at", { ascending: false })
      .limit(20),
  ]);
  if (error) throw error;
  return {
    total_beneficiaires: count ?? 0,
    docs_urgents: (urgents as Array<AnalyseAsso & { beneficiaire: Pick<Beneficiaire, "nom" | "prenom"> }>) ?? [],
  };
}
