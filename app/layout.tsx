import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "DocClair — Comprenez enfin vos courriers administratifs",
  description:
    "DocClair lit vos courriers administratifs (CAF, impôts, sécu, banque, huissier...) et vous dit exactement quoi faire, en 30 secondes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" className={`${inter.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-stone-50 text-gray-900">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
