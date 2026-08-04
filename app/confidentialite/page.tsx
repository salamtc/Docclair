import Navbar from "@/components/Navbar";

export default function ConfidentialitePage() {
  return (
    <div className="flex flex-1 flex-col bg-ink text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-white mb-2">
          Politique de confidentialité
        </h1>
        <p className="text-sm text-muted mb-10">Dernière mise à jour : août 2025</p>

        <div className="space-y-8 text-sm leading-relaxed text-white/80">

          <section>
            <h2 className="text-base font-semibold text-white mb-2">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles collectées sur DocClair est <strong>DocClair SAS</strong>, joignable à l&apos;adresse e-mail{" "}
              <a href="mailto:contact@docclair.fr" className="text-accent hover:underline">contact@docclair.fr</a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">2. Données collectées</h2>
            <p>DocClair collecte les données suivantes :</p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li><strong>Données d&apos;identification</strong> : nom, adresse e-mail (via Clerk lors de l&apos;inscription).</li>
              <li><strong>Données d&apos;utilisation</strong> : type d&apos;organisme et catégorie du document analysé (jamais le contenu integral), horodatage des analyses.</li>
              <li><strong>Données de paiement</strong> : gérées exclusivement par Stripe. DocClair ne stocke aucune coordonnée bancaire.</li>
              <li><strong>Données techniques</strong> : adresse IP (à des fins de limitation d&apos;usage gratuit), journaux de connexion.</li>
            </ul>
            <p className="mt-2 font-medium text-white">
              Le contenu intégral de vos documents n&apos;est jamais stocké. Il est transmis à l&apos;API d&apos;Anthropic pour analyse en temps réel, puis immédiatement supprimé.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">3. Finalités du traitement</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Fournir le service d&apos;analyse et de génération de lettres.</li>
              <li>Gérer les comptes utilisateurs et les abonnements.</li>
              <li>Prévenir les abus et fraudes (limitation des analyses gratuites par IP).</li>
              <li>Améliorer le service grâce à des statistiques anonymisées sur les types de documents traités.</li>
            </ul>
            <p className="mt-2">
              Base légale : exécution du contrat (art. 6.1.b RGPD) pour les traitements liés au service ; intérêt légitime (art. 6.1.f RGPD) pour la sécurité et l&apos;amélioration.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">4. Durée de conservation</h2>
            <ul className="ml-4 list-disc space-y-1">
              <li>Données de compte : conservées pendant la durée de l&apos;abonnement + 3 ans après résiliation.</li>
              <li>Journaux d&apos;usage (organisme, catégorie) : 2 ans glissants.</li>
              <li>Données de paiement : 10 ans conformément aux obligations comptables légales (gérées par Stripe).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">5. Sous-traitants et transferts</h2>
            <p>DocClair fait appel aux prestataires suivants, avec lesquels des accords de protection des données ont été conclus :</p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li><strong>Anthropic</strong> (États-Unis) — traitement IA des documents. Les données sont traitées sous couverture des clauses contractuelles types de l&apos;UE.</li>
              <li><strong>Clerk</strong> (États-Unis) — authentification des utilisateurs.</li>
              <li><strong>Stripe</strong> (États-Unis) — paiement et gestion des abonnements.</li>
              <li><strong>Supabase</strong> (UE) — base de données hébergée en Europe.</li>
              <li><strong>Vercel</strong> (États-Unis) — hébergement de l&apos;application.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">6. Vos droits</h2>
            <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>Droit d&apos;accès à vos données personnelles.</li>
              <li>Droit de rectification des données inexactes.</li>
              <li>Droit à l&apos;effacement (« droit à l&apos;oubli »).</li>
              <li>Droit à la limitation du traitement.</li>
              <li>Droit à la portabilité de vos données.</li>
              <li>Droit d&apos;opposition au traitement.</li>
            </ul>
            <p className="mt-2">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact@docclair.fr" className="text-accent hover:underline">contact@docclair.fr</a>.
              Vous pouvez également introduire une réclamation auprès de la{" "}
              <a href="https://www.cnil.fr" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">CNIL</a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">7. Sécurité</h2>
            <p>
              DocClair met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des communications (HTTPS/TLS), accès restreint aux bases de données, authentification renforcée via Clerk. Les documents analysés transitent de manière chiffrée et ne sont jamais persistés sur nos serveurs.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">8. Cookies</h2>
            <p>
              DocClair utilise uniquement des cookies strictement nécessaires au fonctionnement du service (session d&apos;authentification Clerk). Aucun cookie publicitaire ou de tracking tiers n&apos;est déposé.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">9. Modifications</h2>
            <p>
              Cette politique peut être mise à jour pour refléter les évolutions du service ou de la réglementation. Les utilisateurs abonnés seront informés par e-mail de tout changement substantiel 30 jours avant son entrée en vigueur.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
