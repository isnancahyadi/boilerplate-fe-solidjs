/**
 * File Utilities
 *
 * Mengelola penanganan berkas dan download binary blob di browser.
 */

export function downloadFile(data: Blob | ArrayBuffer, filename: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const blob = data instanceof Blob ? data : new Blob([data]);
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();

  setTimeout(() => {
    document.body.removeChild(anchor);
    window.URL.revokeObjectURL(url);
  }, 100);
}
