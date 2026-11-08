/**
 * Text Utilities
 *
 * Helper manipulasi string dan pemformatan teks tampilan.
 */

export function truncateText(text: string | null | undefined, maxLength: number, suffix = "..."): string {
  if (!text) {
    return "";
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength) + suffix;
}

export function capitalize(text: string | null | undefined): string {
  if (!text) {
    return "";
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
