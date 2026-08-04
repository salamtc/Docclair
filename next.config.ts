import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse utilise des API Node.js natives (fs) — on l'exclut du bundling
  // pour que Next.js le charge via require() natif au lieu de le bundler.
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
