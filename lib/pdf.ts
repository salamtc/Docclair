// Import the implementation directly: pdf-parse's index.js runs a debug
// self-test (reading a bundled sample PDF) whenever `module.parent` is falsy,
// which Turbopack's bundling triggers at build time.
import pdf from "pdf-parse/lib/pdf-parse.js";

export const LIMITE_TAILLE_OCTETS = 10 * 1024 * 1024; // 10 Mo

export async function extraireTextePdf(buffer: Buffer): Promise<string> {
  try {
    if (buffer.length > LIMITE_TAILLE_OCTETS) {
      throw new Error("Fichier trop volumineux (max 10MB)");
    }
    const data = await pdf(buffer);
    const texte = data.text.trim();
    if (!texte || texte.length < 10) {
      throw new Error("Le PDF ne contient pas de texte lisible");
    }
    return texte;
  } catch (error) {
    console.error("Erreur extraction PDF:", (error as Error).message);
    throw new Error(
      "Impossible de lire ce PDF. Essayez de copier-coller le texte directement dans la zone de texte."
    );
  }
}
