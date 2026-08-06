import Link from "next/link";
import Reveal from "@/components/Reveal";

const fonctionnalites = [
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
    ),
    titre: "On vous explique votre courrier",
    texte:
      "Vous recevez une lettre que vous ne comprenez pas ? On vous dit en langage simple ce qu'elle veut dire et ce que vous devez faire.",
  },
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
    titre: "On écrit la réponse à votre place",
    texte:
      "Besoin de répondre à un organisme ? On génère automatiquement une lettre officielle prête à envoyer, pour n'importe quel type de courrier.",
  },
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 3v18M5 7l-3 6a3 3 0 006 0l-3-6zM19 7l-3 6a3 3 0 006 0l-3-6z" />
        <path d="M5 7h14M8 21h8" />
      </svg>
    ),
    titre: "On vous aide à contester",
    texte:
      "Vous pensez qu'on vous réclame quelque chose à tort ? On rédige votre lettre de contestation avec les bons arguments et les articles de loi qui vous protègent.",
  },
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
      </svg>
    ),
    titre: "On détecte les arnaques",
    texte:
      "On analyse votre courrier et on vous avertit immédiatement s'il ressemble à une fraude ou une tentative d'escroquerie.",
  },
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
    titre: "Posez toutes vos questions",
    texte:
      "Après l'analyse, vous pouvez poser toutes vos questions sur votre courrier. On vous répond simplement, comme un conseiller de confiance.",
  },
  {
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-6 3 3 5-8" />
      </svg>
    ),
    titre: "Gardez une trace pour vos impôts",
    texte:
      "Vous êtes indépendant ou auto-entrepreneur ? On exporte automatiquement vos courriers fiscaux en fichier comptable.",
  },
];

const etapes = [
  {
    numero: "01",
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M12 3v12M7 8l5-5 5 5" />
        <path d="M4 15v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
      </svg>
    ),
    titre: "Uploadez votre document",
    texte: "PDF ou photo, glissé-déposé ou collé directement depuis votre téléphone.",
  },
  {
    numero: "02",
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
    titre: "Notre IA l'analyse",
    texte: "En 30 secondes, DocClair identifie l'organisme, le type de courrier et l'urgence.",
  },
  {
    numero: "03",
    icone: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    ),
    titre: "Vous savez quoi faire",
    texte: "Explication claire, actions à mener, et une lettre de réponse si besoin.",
  },
];

const organismes = ["CAF", "Impôts", "Sécurité sociale", "Banques", "Pôle emploi"];

const plans = [
  {
    nom: "Gratuit",
    prix: "0",
    description: "Pour découvrir DocClair.",
    avantages: ["1 analyse gratuite", "Explication en langage clair", "Sans carte bancaire"],
    populaire: false,
  },
  {
    nom: "Pro",
    prix: "9",
    description: "Pour gérer tous vos courriers.",
    avantages: [
      "Analyses illimitées",
      "Génération de lettres de réponse",
      "Contestation CAF & employeur",
      "Chat conseiller sur chaque document",
      "Export comptable (CSV)",
    ],
    populaire: true,
  },
  {
    nom: "Association",
    prix: "29",
    description: "Pour les travailleurs sociaux.",
    avantages: [
      "Tout du plan Pro",
      "Espace aidant dédié",
      "Jusqu'à 10 bénéficiaires",
      "Historique par bénéficiaire",
      "Tableau de bord des urgences",
    ],
    populaire: false,
  },
];

const temoignages = [
  {
    nom: "Marie",
    role: "52 ans",
    initiales: "M",
    couleur: "from-[#4F6EF7] to-[#7C3AED]",
    citation:
      "J'ai reçu une lettre de la CAF que je ne comprenais pas du tout. DocClair m'a expliqué en 30 secondes que j'avais droit à un remboursement !",
  },
  {
    nom: "Thomas",
    role: "34 ans",
    initiales: "T",
    couleur: "from-[#7C3AED] to-[#4F6EF7]",
    citation:
      "Enfin un outil qui parle en français normal. J'ai contesté une erreur de mon ancien employeur grâce à la lettre générée automatiquement.",
  },
  {
    nom: "Isabelle",
    role: "Assistante sociale",
    initiales: "I",
    couleur: "from-[#4F6EF7] to-[#7C3AED]",
    citation:
      "Je gère les dossiers de 15 bénéficiaires. DocClair m'économise des heures chaque semaine.",
  },
];

function Etoiles() {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="#FBBF24" className="h-4 w-4">
          <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.1-5.4 3.1 1.3-6-4.6-4.1 6.1-.6z" />
        </svg>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-ink text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-border-soft/60 bg-ink/80 backdrop-blur-lg">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="h-6 w-6 shrink-0 rounded-md dc-gradient-bg" />
            <span className="text-base font-bold tracking-tight text-white sm:text-lg">DocClair</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#fonctionnalites" className="text-sm text-muted transition hover:text-white">
              Fonctionnalités
            </a>
            <a href="#tarifs" className="text-sm text-muted transition hover:text-white">
              Tarifs
            </a>
            <Link href="/contact" className="text-sm text-muted transition hover:text-white">
              Contact
            </Link>
          </div>

          <Link
            href="/analyse"
            className="inline-flex min-h-[44px] shrink-0 items-center whitespace-nowrap rounded-full dc-gradient-bg px-4 text-sm font-semibold tracking-[0.3px] text-white transition hover:opacity-90 sm:px-5 sm:text-[15px]"
          >
            Commencer gratuitement
          </Link>
        </nav>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden px-6 pb-28 pt-20 sm:pt-28">
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 opacity-25 blur-[120px]"
            style={{ background: "linear-gradient(135deg, #4F6EF7, #7C3AED)" }}
          />

          <div className="relative mx-auto max-w-4xl text-center">
            <span className="dc-gradient-border inline-flex items-center gap-2 rounded-full bg-card px-4 py-1.5 text-sm font-medium text-white">
              ✦ Analyse IA en 30 secondes
            </span>

            <h1 className="mx-auto mt-8 max-w-3xl text-[40px] font-extrabold leading-[1.08] tracking-[-1px] sm:text-[56px] md:text-[64px] md:tracking-[-2px]">
              Vos courriers administratifs,
              <br />
              <span className="dc-gradient-text">expliqués</span> en langage simple.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-[1.7] text-muted">
              Fini le stress des lettres incompréhensibles. DocClair analyse vos
              documents CAF, impôts, banque et vous dit exactement quoi faire.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/analyse"
                className="rounded-full dc-gradient-bg px-8 py-4 text-[15px] font-semibold tracking-[0.3px] text-white transition hover:opacity-90"
              >
                Analyser un document
              </Link>
              <a
                href="#comment-ca-marche"
                className="rounded-full border border-white/25 px-8 py-4 text-[15px] font-semibold tracking-[0.3px] text-white transition hover:bg-white/5"
              >
                Voir comment ça marche
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted">
              <span>✓ 1 analyse gratuite</span>
              <span>✓ Sans carte bancaire</span>
              <span>✓ Résultat en 30 secondes</span>
            </div>
          </div>

          {/* Mockup flottant */}
          <div className="relative mx-auto mt-20 max-w-xl">
            <div
              className="rounded-2xl border border-border-soft bg-card p-6 shadow-2xl"
              style={{
                transform: "rotate(-3deg)",
                boxShadow: "0 40px 80px -30px rgba(79, 110, 247, 0.45)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="rounded-full dc-gradient-bg px-3 py-1 text-xs font-semibold text-white">
                  CAF
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-muted">
                  Trop-perçu
                </span>
                <span className="rounded-full bg-orange-500/15 px-3 py-1 text-xs font-medium text-orange-400">
                  Attention
                </span>
              </div>
              <p className="mt-5 text-sm leading-[1.7] text-muted">
                La CAF vous informe d&apos;un trop-perçu de <span className="text-white">312 €</span> lié
                à un changement de situation non déclaré. Vous avez 30 jours pour
                contester ou proposer un échéancier.
              </p>
              <div className="mt-5 flex items-center gap-2 text-sm text-white">
                <svg viewBox="0 0 20 20" fill="#4F6EF7" className="h-4 w-4 shrink-0">
                  <path fillRule="evenodd" d="M16.7 4.2a.75.75 0 01.14 1.05l-8 10.5a.75.75 0 01-1.13.08l-4.5-4.5a.75.75 0 111.06-1.06l3.9 3.9 7.48-9.82a.75.75 0 011.05-.15z" clipRule="evenodd" />
                </svg>
                3 actions à faire avant le 15 septembre
              </div>
            </div>
          </div>
        </section>

        {/* LOGOS DE CONFIANCE */}
        <section className="border-y border-border-soft/60 bg-ink-alt px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-center text-sm font-medium uppercase tracking-wide text-muted">
              Ils nous font confiance
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              {organismes.map((org) => (
                <span
                  key={org}
                  className="rounded-full border border-border-soft bg-card px-5 py-2 text-sm font-medium text-muted"
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FONCTIONNALITÉS */}
        <section id="fonctionnalites" className="px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="text-center">
              <h2 className="text-[28px] font-bold sm:text-[36px]">
                Tout ce dont vous avez besoin
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-[1.7] text-muted">
                Une suite complète pour gérer vos courriers administratifs sans
                stress.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {fonctionnalites.map((f, i) => (
                <Reveal key={f.titre} delay={i * 80}>
                  <div className="dc-card-hover h-full rounded-2xl border border-border-soft bg-card p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl dc-gradient-bg text-white">
                      {f.icone}
                    </div>
                    <h3 className="mt-5 text-base font-semibold text-white">
                      {f.titre}
                    </h3>
                    <p className="mt-2 text-sm leading-[1.7] text-muted">
                      {f.texte}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* COMMENT ÇA MARCHE */}
        <section id="comment-ca-marche" className="bg-ink-alt px-6 py-28">
          <div className="mx-auto max-w-4xl">
            <Reveal className="text-center">
              <h2 className="text-[28px] font-bold sm:text-[36px]">Comment ça marche</h2>
            </Reveal>

            <div className="relative mt-16 grid gap-12 sm:grid-cols-3 sm:gap-6">
              <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-border-soft sm:block" />
              {etapes.map((etape, i) => (
                <Reveal key={etape.numero} delay={i * 120} className="relative text-center">
                  <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-ink-alt">
                    <span className="dc-gradient-text text-lg font-extrabold">
                      {etape.numero}
                    </span>
                  </div>
                  <div className="mx-auto mt-5 flex h-11 w-11 items-center justify-center rounded-xl bg-card text-accent">
                    {etape.icone}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {etape.titre}
                  </h3>
                  <p className="mt-2 text-sm leading-[1.7] text-muted">
                    {etape.texte}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TARIFS */}
        <section id="tarifs" className="px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="text-center">
              <h2 className="text-[28px] font-bold sm:text-[36px]">
                Des tarifs simples
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-base leading-[1.7] text-muted">
                Commencez gratuitement, évoluez quand vous en avez besoin.
              </p>
            </Reveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3 md:items-center">
              {plans.map((plan) => (
                <Reveal key={plan.nom}>
                  <div
                    className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                      plan.populaire
                        ? "dc-gradient-border border-transparent bg-card-hover md:-my-4 md:py-12"
                        : "border-border-soft bg-card"
                    }`}
                  >
                    {plan.populaire && (
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full dc-gradient-bg px-4 py-1 text-xs font-semibold text-white">
                        Le plus populaire
                      </span>
                    )}

                    <h3 className="text-lg font-semibold text-white">{plan.nom}</h3>
                    <p className="mt-1 text-sm text-muted">{plan.description}</p>
                    <div className="mt-5 flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-white">
                        {plan.prix}€
                      </span>
                      {plan.prix !== "0" && (
                        <span className="mb-1 text-sm text-muted">/mois</span>
                      )}
                    </div>

                    <ul className="mt-7 flex-1 space-y-3">
                      {plan.avantages.map((av) => (
                        <li key={av} className="flex items-start gap-2.5 text-sm text-white/90">
                          <svg viewBox="0 0 20 20" fill="#4F6EF7" className="mt-0.5 h-4 w-4 shrink-0">
                            <path fillRule="evenodd" d="M16.7 4.2a.75.75 0 01.14 1.05l-8 10.5a.75.75 0 01-1.13.08l-4.5-4.5a.75.75 0 111.06-1.06l3.9 3.9 7.48-9.82a.75.75 0 011.05-.15z" clipRule="evenodd" />
                          </svg>
                          {av}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/tarifs"
                      className={`mt-8 w-full rounded-full px-6 py-3 text-center text-[15px] font-semibold tracking-[0.3px] transition ${
                        plan.populaire
                          ? "dc-gradient-bg text-white hover:opacity-90"
                          : "border border-white/25 text-white hover:bg-white/5"
                      }`}
                    >
                      Commencer
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TÉMOIGNAGES */}
        <section className="bg-ink-alt px-6 py-28">
          <div className="mx-auto max-w-5xl">
            <Reveal className="text-center">
              <h2 className="text-[28px] font-bold sm:text-[36px]">
                Ils ont retrouvé leur tranquillité
              </h2>
            </Reveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-3">
              {temoignages.map((t, i) => (
                <Reveal key={t.nom} delay={i * 100}>
                  <div className="flex h-full flex-col rounded-2xl border border-border-soft bg-card p-6">
                    <Etoiles />
                    <p className="mt-4 flex-1 text-sm italic leading-[1.7] text-white/90">
                      &ldquo;{t.citation}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.couleur} text-sm font-semibold text-white`}
                      >
                        {t.initiales}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white">{t.nom}</p>
                        <p className="text-xs text-muted">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA FINALE */}
        <section className="px-6 py-24">
          <Reveal>
            <div
              className="mx-auto max-w-4xl rounded-3xl px-8 py-16 text-center"
              style={{ background: "linear-gradient(135deg, #4F6EF7, #7C3AED)" }}
            >
              <h2 className="text-[28px] font-bold text-white sm:text-[36px]">
                Prêt à comprendre vos courriers ?
              </h2>
              <p className="mt-4 text-base leading-[1.7] text-white/85">
                Commencez gratuitement, sans carte bancaire.
              </p>
              <Link
                href="/analyse"
                className="mt-8 inline-block rounded-full bg-white px-8 py-4 text-[15px] font-semibold tracking-[0.3px] text-[#4F6EF7] transition hover:opacity-90"
              >
                Analyser un document
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border-soft/60 bg-[#0A0C14] px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="h-6 w-6 rounded-md dc-gradient-bg" />
                <span className="text-lg font-bold text-white">DocClair</span>
              </div>
              <p className="mt-3 max-w-xs text-sm leading-[1.7] text-muted">
                Vos courriers administratifs expliqués en langage simple, en 30
                secondes.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Produit</p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li><a href="#fonctionnalites" className="hover:text-white transition">Fonctionnalités</a></li>
                <li><Link href="/tarifs" className="hover:text-white transition">Tarifs</Link></li>
                <li><Link href="/analyse" className="hover:text-white transition">Analyser un document</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Légal</p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li><Link href="/cgu" className="hover:text-white transition">CGU</Link></li>
                <li><Link href="/confidentialite" className="hover:text-white transition">Confidentialité</Link></li>
                <li><Link href="/mentions-legales" className="hover:text-white transition">Mentions légales</Link></li>
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">Contact</p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li><Link href="/contact" className="hover:text-white transition">Nous contacter</Link></li>
                <li>
                  <a href="mailto:contact@docclair.fr" className="hover:text-white transition">
                    contact@docclair.fr
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border-soft/60 pt-8 text-sm text-muted sm:flex-row">
            <p>© {new Date().getFullYear()} DocClair</p>
            <p>Vos documents ne sont jamais stockés. Analyse en temps réel.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
