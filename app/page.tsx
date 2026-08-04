import Link from "next/link";
import Navbar from "@/components/Navbar";

const exemples = [
  {
    badge: "CAF",
    titre: "Votre allocation a changé",
    description: "Changement d'allocation, dettes, trop-perçus",
  },
  {
    badge: "Impôts",
    titre: "Avis de régularisation",
    description: "Vous allez recevoir un remboursement",
  },
  {
    badge: "Huissier",
    titre: "Mise en demeure",
    description: "Vous avez 15 jours, voici les étapes",
  },
];

const fonctionnalites = [
  {
    icone: "🔍",
    titre: "On vous explique votre courrier",
    texte:
      "Vous recevez une lettre que vous ne comprenez pas ? On vous dit en langage simple ce qu'elle veut dire et ce que vous devez faire.",
  },
  {
    icone: "✉️",
    titre: "On écrit la réponse à votre place",
    texte:
      "Besoin de répondre à un organisme ? On génère automatiquement une lettre officielle prête à envoyer, pour n'importe quel type de courrier.",
  },
  {
    icone: "⚖️",
    titre: "On vous aide à contester",
    texte:
      "Vous pensez qu'on vous réclame quelque chose à tort ? On rédige votre lettre de contestation avec les bons arguments et les articles de loi qui vous protègent.",
  },
  {
    icone: "🚨",
    titre: "On détecte les arnaques",
    texte:
      "On analyse votre courrier et on vous avertit immédiatement s'il ressemble à une fraude ou une tentative d'escroquerie.",
  },
  {
    icone: "💬",
    titre: "Posez toutes vos questions",
    texte:
      "Après l'analyse, vous pouvez poser toutes vos questions sur votre courrier. On vous répond simplement, comme un conseiller de confiance.",
  },
  {
    icone: "📊",
    titre: "Gardez une trace pour vos impôts",
    texte:
      "Vous êtes indépendant ou auto-entrepreneur ? On exporte automatiquement vos courriers fiscaux en fichier comptable.",
  },
  {
    icone: "🤝",
    titre: "Pour les professionnels du social",
    texte:
      "Assistantes sociales, associations, CCAS : gérez les courriers de vos bénéficiaires depuis un espace dédié. Chaque personne a son propre dossier et historique.",
  },
];

const etapes = [
  "Uploadez votre document (PDF ou photo)",
  "Notre IA l'analyse en 30 secondes",
  "Vous recevez une explication claire + les actions à faire",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-stone-50">
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl">
            Vous recevez des courriers que vous ne comprenez pas ?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
            DocClair les lit pour vous et vous dit exactement quoi faire. En
            30 secondes.
          </p>
          <Link
            href="/analyse"
            className="mt-10 inline-block rounded-full bg-blue-600 px-8 py-4 text-base font-medium text-white transition hover:bg-blue-700"
          >
            Analyser un document gratuitement
          </Link>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-center text-2xl font-semibold text-gray-900 mb-10">
            Ce qu&apos;on peut faire pour vous
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {fonctionnalites.slice(0, 6).map((f) => (
              <div
                key={f.titre}
                className="rounded-2xl border border-stone-200 bg-white p-6"
              >
                <span className="text-4xl leading-none">{f.icone}</span>
                <h3 className="mt-4 text-base font-semibold text-gray-900">
                  {f.titre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {f.texte}
                </p>
              </div>
            ))}
          </div>
          {/* Dernière carte pleine largeur */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 flex gap-5 items-start">
            <span className="text-4xl leading-none shrink-0">{fonctionnalites[6].icone}</span>
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {fonctionnalites[6].titre}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {fonctionnalites[6].texte}
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="grid gap-6 sm:grid-cols-3">
            {exemples.map((ex) => (
              <div
                key={ex.badge}
                className="rounded-2xl border border-stone-200 bg-white p-6"
              >
                <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  {ex.badge}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {ex.titre}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{ex.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <h2 className="text-center text-2xl font-semibold text-gray-900">
            Comment ça marche
          </h2>
          <ol className="mt-10 space-y-8">
            {etapes.map((etape, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <p className="pt-1 text-base text-gray-700">{etape}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-stone-200 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} DocClair</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/tarifs" className="hover:text-gray-900">Tarifs</Link>
            <Link href="/cgu" className="hover:text-gray-900">CGU</Link>
            <Link href="/confidentialite" className="hover:text-gray-900">Confidentialité</Link>
            <Link href="/mentions-legales" className="hover:text-gray-900">Mentions légales</Link>
            <Link href="/contact" className="hover:text-gray-900">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
