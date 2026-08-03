export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <h1 className="text-2xl font-semibold text-gray-900">Contact</h1>
      <p className="mt-4 text-gray-600">
        Une question ? Écrivez-nous à{" "}
        <a href="mailto:contact@docclair.fr" className="text-blue-600">
          contact@docclair.fr
        </a>
        .
      </p>
    </div>
  );
}
