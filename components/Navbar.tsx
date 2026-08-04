import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-soft/60 bg-ink/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="h-6 w-6 rounded-md dc-gradient-bg" />
          <span className="text-lg font-bold tracking-tight text-white">DocClair</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/tarifs" className="text-sm text-muted transition hover:text-white">
            Tarifs
          </Link>
          <Link
            href="/analyse"
            className="rounded-full dc-gradient-bg px-4 py-2 text-[15px] font-semibold tracking-[0.3px] text-white transition hover:opacity-90"
          >
            Analyser un document
          </Link>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-sm text-muted transition hover:text-white">
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
