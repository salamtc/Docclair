import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="border-b border-stone-200 bg-stone-50/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-gray-900">
          DocClair
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/tarifs" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition">
            Tarifs
          </Link>
          <Link
            href="/analyse"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Analyser un document
          </Link>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
                Se connecter
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}
