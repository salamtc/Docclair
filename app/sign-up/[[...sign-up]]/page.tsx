import Link from "next/link";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-white px-4 py-16">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="h-6 w-6 rounded-md bg-gradient-to-br from-[#4F6EF7] to-[#7C3AED]" />
        <span className="text-lg font-bold tracking-tight text-gray-900">DocClair</span>
      </Link>
      <SignUp />
    </div>
  );
}
