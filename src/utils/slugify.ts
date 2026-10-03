/**
 * Pretvara hrvatski tekst u SEO-friendly slug s odgovarajućim engleskim ekvivalentima
 * za dijakritičke znakove (č, ć -> c; đ -> dj; š -> s; ž -> z).
 */
export function slugifyHr(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .replace(/[čć]/g, "c")
    .replace(/đ/g, "dj")
    .replace(/š/g, "s")
    .replace(/ž/g, "z")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
