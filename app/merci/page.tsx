import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function MerciPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const { plan } = await searchParams;

  const details: Record<string, { nom: string; description: string }> = {
    asso: {
      nom: "Association",
      description: "Vous pouvez dès maintenant accéder à votre espace aidant et créer vos premiers dossiers bénéficiaires.",
    },
    asso_pro: {
      nom: "Association Pro",
      description: "Vous pouvez dès maintenant accéder à votre espace aidant avec un nombre illimité de bénéficiaires.",
    },
    standard: {
      nom: "Particulier",
      description: "Vous pouvez dès maintenant analyser tous vos courriers sans limite.",
    },
  };

  const info = details[plan ?? "standard"] ?? details.standard;
  const isAsso = plan === "asso" || plan === "asso_pro";

  return (
    <div className="flex flex-1 flex-col bg-ink text-white">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
            <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-white">
            Votre abonnement est actif !
          </h1>
          <p className="mt-3 text-base font-medium text-accent">
            Plan {info.nom}
          </p>
          <p className="mt-4 leading-[1.7] text-muted">
            {info.description}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {isAsso ? (
              <Link
                href="/asso"
                className="rounded-full dc-gradient-bg px-8 py-3 text-[15px] font-semibold tracking-[0.3px] text-white transition hover:opacity-90"
              >
                Accéder à mon espace aidant
              </Link>
            ) : (
              <Link
                href="/analyse"
                className="rounded-full dc-gradient-bg px-8 py-3 text-[15px] font-semibold tracking-[0.3px] text-white transition hover:opacity-90"
              >
                Analyser un document
              </Link>
            )}
            <Link
              href="/mon-compte"
              className="rounded-full border border-white/25 px-8 py-3 text-[15px] font-semibold tracking-[0.3px] text-white transition hover:bg-white/5"
            >
              Voir mon abonnement
            </Link>
          </div>

          <p className="mt-8 text-xs text-muted">
            Un e-mail de confirmation vous a été envoyé par Stripe.
            Vous pouvez{" "}
            <Link href="/mon-compte" className="underline hover:text-white">
              gérer ou résilier votre abonnement
            </Link>{" "}
            à tout moment.
          </p>
        </div>
      </main>
    </div>
  );
}
