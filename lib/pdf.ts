// Import the implementation directly: pdf-parse's index.js runs a debug
// self-test (reading a bundled sample PDF) whenever `module.parent` is falsy,
// which Turbopack's bundling triggers at build time.
import pdf from "pdf-parse/lib/pdf-parse.js";

export const LIMITE_TAILLE_OCTETS = 10 * 1024 * 1024; // 10 Mo

export async function extraireTextePdf(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  const texte = data.text.trim();
  if (!texte) throw new Error("PDF_VIDE");
  return texte;
}
