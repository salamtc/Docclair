import Navbar from "@/components/Navbar";

export default function ContactPage() {
  return (
    <div className="flex flex-1 flex-col bg-ink text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-2xl px-6 py-24">
        <h1 className="text-3xl font-bold text-white">Contact</h1>
        <p className="mt-4 leading-[1.7] text-muted">
          Une question ? Écrivez-nous à{" "}
          <a href="mailto:contact@docclair.fr" className="text-accent hover:underline">
            contact@docclair.fr
          </a>
          .
        </p>
      </main>
    </div>
  );
}
