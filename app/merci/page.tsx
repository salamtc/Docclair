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
    <div className="flex flex-1 flex-col bg-stone-50">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-semibold text-gray-900">
            Votre abonnement est actif !
          </h1>
          <p className="mt-3 text-base font-medium text-blue-600">
            Plan {info.nom}
          </p>
          <p className="mt-4 text-gray-500 leading-relaxed">
            {info.description}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
            {isAsso ? (
              <Link
                href="/asso"
                className="rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Accéder à mon espace aidant
              </Link>
            ) : (
              <Link
                href="/analyse"
                className="rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Analyser un document
              </Link>
            )}
            <Link
              href="/mon-compte"
              className="rounded-full border border-stone-300 bg-white px-8 py-3 text-sm font-medium text-gray-700 transition hover:bg-stone-50"
            >
              Voir mon abonnement
            </Link>
          </div>

          <p className="mt-8 text-xs text-gray-400">
            Un e-mail de confirmation vous a été envoyé par Stripe.
            Vous pouvez{" "}
            <Link href="/mon-compte" className="underline hover:text-gray-600">
              gérer ou résilier votre abonnement
            </Link>{" "}
            à tout moment.
          </p>
        </div>
      </main>
    </div>
  );
}
