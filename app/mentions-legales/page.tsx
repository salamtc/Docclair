import Navbar from "@/components/Navbar";

export default function MentionsLegalesPage() {
  return (
    <div className="flex flex-1 flex-col bg-ink text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-white mb-2">Mentions légales</h1>
        <p className="text-sm text-muted mb-10">Dernière mise à jour : août 2025</p>

        <div className="space-y-8 text-sm leading-relaxed text-white/80">

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Éditeur du site</h2>
            <div className="rounded-xl border border-border-soft bg-card p-5 space-y-1.5">
              <p><span className="font-medium text-white">Dénomination sociale :</span> DocClair SAS</p>
              <p><span className="font-medium text-white">Forme juridique :</span> Société par Actions Simplifiée</p>
              <p><span className="font-medium text-white">SIRET :</span> En cours d&apos;immatriculation</p>
              <p><span className="font-medium text-white">Siège social :</span> France</p>
              <p>
                <span className="font-medium text-white">E-mail :</span>{" "}
                <a href="mailto:contact@docclair.fr" className="text-accent hover:underline">
                  contact@docclair.fr
                </a>
              </p>
              <p><span className="font-medium text-white">Directeur de la publication :</span> Le représentant légal de DocClair SAS</p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-3">Hébergement</h2>
            <div className="rounded-xl border border-border-soft bg-card p-5 space-y-1.5">
              <p><span className="font-medium text-white">Hébergeur :</span> Vercel Inc.</p>
              <p><span className="font-medium text-white">Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
              <p>
                <span className="font-medium text-white">Site :</span>{" "}
                <a href="https://vercel.com" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                  vercel.com
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble du contenu présent sur le site DocClair (textes, graphiques, logo, interface, code source) est protégé par le droit d&apos;auteur et appartient à DocClair SAS ou à ses ayants droit. Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l&apos;autorisation écrite préalable de DocClair SAS.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">Intelligence artificielle</h2>
            <p>
              DocClair utilise l&apos;API d&apos;Anthropic (Claude) pour l&apos;analyse des documents. Les analyses produites sont générées automatiquement et ont une valeur indicative. Elles ne constituent pas un avis juridique et ne sauraient engager la responsabilité de DocClair SAS. L&apos;Utilisateur reste seul juge des décisions qu&apos;il prend sur la base de ces analyses.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">Données personnelles</h2>
            <p>
              Le traitement des données personnelles effectué dans le cadre du service est détaillé dans notre{" "}
              <a href="/confidentialite" className="text-accent hover:underline">
                Politique de confidentialité
              </a>
              . Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données en écrivant à{" "}
              <a href="mailto:contact@docclair.fr" className="text-accent hover:underline">
                contact@docclair.fr
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">Limitation de responsabilité</h2>
            <p>
              DocClair SAS ne peut être tenu responsable des dommages directs ou indirects causés au matériel de l&apos;Utilisateur lors de l&apos;accès au site, ni des dommages résultant de l&apos;utilisation des analyses ou lettres générées. DocClair SAS met tout en œuvre pour assurer la disponibilité du service mais ne peut garantir une disponibilité continue et sans interruption.
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-white mb-2">Droit applicable</h2>
            <p>
              Le présent site est soumis au droit français. En cas de litige relatif à son utilisation, les tribunaux français seront seuls compétents.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
