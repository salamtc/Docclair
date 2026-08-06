import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ClerkProvider } from "@clerk/nextjs";
import { frFR } from "@clerk/localizations";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://docclair-f3nlop900-salhi-tc.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "DocClair — Comprendre vos courriers administratifs",
  description:
    "DocClair analyse vos courriers CAF, impôts, banque et vous explique en langage simple ce que vous devez faire. Essai gratuit, sans inscription.",
  keywords: [
    "courrier administratif",
    "CAF",
    "impôts",
    "lettre administrative",
    "comprendre courrier",
    "contestation CAF",
    "trop perçu",
    "lettre de contestation",
  ],
  openGraph: {
    title: "DocClair — Vos courriers expliqués en 30 secondes",
    description:
      "Analysez gratuitement votre courrier administratif. CAF, impôts, banque, huissier — on vous dit quoi faire.",
    url: APP_URL,
    siteName: "DocClair",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocClair — Vos courriers expliqués en 30 secondes",
    description: "Analysez gratuitement votre courrier administratif en 30 secondes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="fr" className={`${inter.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col bg-ink text-white">
          {children}
          {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
        </body>
      </html>
    </ClerkProvider>
  );
}
