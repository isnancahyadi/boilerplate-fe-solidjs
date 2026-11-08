import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * ClassName Merger Helper
 *
 * Menggabungkan class name secara kondisional dan menyelesaikan konflik Tailwind utility classes.
 */
export function cn(...inputs: Array<ClassValue>): string {
  return twMerge(clsx(inputs));
}
