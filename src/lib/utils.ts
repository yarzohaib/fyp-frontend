import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ABSOLUTE_URL_REGEX = /^https?:\/\//i

/**
 * Ensures image URLs retrieved from the API can be safely used in Next/Image.
 * - Returns undefined if no URL is provided
 * - Leaves already absolute URLs unchanged
 * - Prefixes relative paths with the provided baseUrl (or NEXT_PUBLIC_API_URL)
 */
export function buildImageUrl(imageUrl?: string | null, baseUrl?: string) {
  if (!imageUrl) {
    return undefined
  }

  const trimmedUrl = imageUrl.trim()

  if (!trimmedUrl) {
    return undefined
  }

  if (ABSOLUTE_URL_REGEX.test(trimmedUrl)) {
    return trimmedUrl
  }

  const resolvedBase = (baseUrl || process.env.NEXT_PUBLIC_API_URL || "").trim()

  if (!resolvedBase) {
    return trimmedUrl
  }

  const normalizedBase = resolvedBase.endsWith("/")
    ? resolvedBase.slice(0, -1)
    : resolvedBase

  const normalizedPath = trimmedUrl.startsWith("/")
    ? trimmedUrl
    : `/${trimmedUrl}`

  return `${normalizedBase}${normalizedPath}`
}
