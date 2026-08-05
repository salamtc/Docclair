-- Table pour tracker les utilisations
create table analyses (
  id uuid default gen_random_uuid() primary key,
  user_id text,          -- Clerk user ID ou null si anonyme
  ip_address text,       -- Pour les anonymes
  created_at timestamp default now(),
  organisme text,        -- Pour stats internes
  type_document text,
  -- Champs comptabilité (ajoutés v2)
  est_fiscal boolean default false,
  montant numeric,
  sens text,             -- 'à payer' | 'remboursement' | null
  date_echeance text,
  date_courrier text,
  -- Résultat Claude complet (v3), pour la page /historique ("Revoir l'analyse")
  resultat jsonb
);

-- Table abonnements
create table abonnements (
  id uuid default gen_random_uuid() primary key,
  user_id text unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,           -- 'active', 'canceled', 'past_due'
  plan text,             -- 'standard' | 'asso' | 'asso_pro'
  created_at timestamp default now()
);
-- Migration si la table existe déjà :
-- alter table abonnements add column if not exists plan text;

-- Migration v2 : à exécuter si la table analyses existe déjà
-- alter table analyses
--   add column if not exists est_fiscal boolean default false,
--   add column if not exists montant numeric,
--   add column if not exists sens text,
--   add column if not exists date_echeance text,
--   add column if not exists date_courrier text;

-- Migration v3 : à exécuter dans le SQL Editor Supabase pour activer /historique
alter table analyses add column if not exists resultat jsonb;

-- ─── Espace aidant ────────────────────────────────────────────────────────────

create table beneficiaires (
  id uuid default gen_random_uuid() primary key,
  asso_user_id text not null,       -- Clerk user ID du responsable asso
  nom text not null,
  prenom text not null,
  numero_dossier text,
  notes text,
  created_at timestamp default now()
);

create table analyses_asso (
  id uuid default gen_random_uuid() primary key,
  beneficiaire_id uuid references beneficiaires(id) on delete cascade,
  asso_user_id text not null,
  organisme text,
  type_document text,
  urgence text default 'none',      -- 'none' | 'attention' | 'urgent'
  explication text,
  result_json jsonb,                -- résultat Claude complet
  note_interne text,
  traite boolean default false,
  created_at timestamp default now()
);

-- Désactiver RLS (même approche que les tables principales)
-- alter table beneficiaires disable row level security;
-- alter table analyses_asso disable row level security;
