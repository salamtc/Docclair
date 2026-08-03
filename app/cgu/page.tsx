import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function CguPage() {
  return (
    <div className="flex flex-1 flex-col bg-stone-50">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Conditions générales d&apos;utilisation
        </h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : août 2025</p>

        <div className="prose prose-stone max-w-none space-y-8 text-sm leading-relaxed text-gray-700">

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. Présentation du service</h2>
            <p>
              DocClair est un service en ligne édité par DocClair SAS, permettant à toute personne physique ou morale (ci-après « l&apos;Utilisateur ») d&apos;obtenir une explication simplifiée de ses courriers administratifs grâce à des modèles d&apos;intelligence artificielle, et de générer des lettres de réponse adaptées.
            </p>
            <p className="mt-2">
              Le service est accessible à l&apos;adresse <strong>docclair.fr</strong>. L&apos;utilisation du service implique l&apos;acceptation pleine et entière des présentes conditions.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. Accès et inscription</h2>
            <p>
              DocClair propose une analyse gratuite sans inscription. Au-delà, l&apos;accès complet au service requiert la création d&apos;un compte et la souscription à un abonnement payant. L&apos;inscription est réservée aux personnes majeures ou aux représentants légaux d&apos;une personne morale.
            </p>
            <p className="mt-2">
              L&apos;Utilisateur est responsable de la confidentialité de ses identifiants de connexion. Toute utilisation du service depuis son compte lui est attribuée.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. Description des offres</h2>
            <p>DocClair propose trois formules d&apos;abonnement :</p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li><strong>Particulier (9€/mois)</strong> — analyses illimitées, génération de lettres, chat conseiller, export comptable.</li>
              <li><strong>Association (29€/mois)</strong> — fonctionnalités Particulier + espace aidant pour jusqu&apos;à 10 bénéficiaires.</li>
              <li><strong>Association Pro (79€/mois)</strong> — fonctionnalités Association + bénéficiaires illimités, support prioritaire, rapport mensuel.</li>
            </ul>
            <p className="mt-2">
              Les tarifs sont indiqués en euros TTC. DocClair se réserve le droit de modifier ses tarifs, avec notification préalable de 30 jours aux abonnés actifs.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. Modalités de paiement et résiliation</h2>
            <p>
              Les abonnements sont facturés mensuellement par prélèvement automatique via Stripe, prestataire de paiement agréé. L&apos;Utilisateur peut résilier son abonnement à tout moment depuis son espace «&nbsp;Mon compte&nbsp;». La résiliation prend effet à la fin de la période mensuelle en cours.
            </p>
            <p className="mt-2">
              En vertu de l&apos;article L.221-18 du Code de la consommation, l&apos;Utilisateur bénéficie d&apos;un droit de rétractation de 14 jours à compter de la souscription, sauf s&apos;il a expressément demandé l&apos;exécution immédiate du service.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. Utilisation du service et obligations</h2>
            <p>L&apos;Utilisateur s&apos;engage à :</p>
            <ul className="mt-2 ml-4 list-disc space-y-1">
              <li>N&apos;uploader que des documents lui appartenant ou pour lesquels il dispose d&apos;une autorisation.</li>
              <li>Ne pas utiliser le service à des fins illicites, frauduleuses ou contraires aux bonnes mœurs.</li>
              <li>Ne pas tenter de contourner les limitations techniques ou d&apos;accéder aux systèmes de DocClair de manière non autorisée.</li>
            </ul>
            <p className="mt-2">
              DocClair se réserve le droit de suspendre ou résilier l&apos;accès de tout Utilisateur en cas de violation des présentes conditions, sans remboursement.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. Limitation de responsabilité</h2>
            <p>
              DocClair est un outil d&apos;aide à la compréhension. Les informations et lettres générées ont une valeur indicative et ne constituent pas un conseil juridique. DocClair décline toute responsabilité pour les décisions prises par l&apos;Utilisateur sur la base des analyses produites.
            </p>
            <p className="mt-2">
              En cas de situation juridique complexe, l&apos;Utilisateur est invité à consulter un professionnel du droit (avocat, juriste, travailleur social).
            </p>
            <p className="mt-2">
              DocClair ne garantit pas la disponibilité continue du service et ne saurait être tenu responsable d&apos;interruptions liées à des opérations de maintenance, à des défaillances des services tiers (Anthropic, Stripe, Clerk, Supabase) ou à des cas de force majeure.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">7. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des éléments constitutifs du service (interface, logo, code source, textes, algorithmes) sont la propriété exclusive de DocClair SAS et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle. Toute reproduction ou utilisation sans autorisation expresse est interdite.
            </p>
            <p className="mt-2">
              Les courriers et lettres générés à la demande de l&apos;Utilisateur lui sont cédés à titre non exclusif pour son usage personnel ou professionnel.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">8. Données personnelles</h2>
            <p>
              Le traitement des données personnelles est décrit dans notre{" "}
              <Link href="/confidentialite" className="text-blue-600 hover:underline">
                Politique de confidentialité
              </Link>
              , conforme au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">9. Droit applicable et juridiction</h2>
            <p>
              Les présentes conditions sont régies par le droit français. En cas de litige, et après tentative de résolution amiable, compétence est attribuée aux tribunaux compétents du ressort du siège de DocClair SAS. L&apos;Utilisateur peut également recourir à la médiation de la consommation via la plateforme européenne{" "}
              <a href="https://ec.europa.eu/consumers/odr" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                ec.europa.eu/consumers/odr
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">10. Contact</h2>
            <p>
              Pour toute question relative aux présentes conditions :{" "}
              <a href="mailto:contact@docclair.fr" className="text-blue-600 hover:underline">
                contact@docclair.fr
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
