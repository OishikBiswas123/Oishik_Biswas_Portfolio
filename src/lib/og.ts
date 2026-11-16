/**
 * Builds the URL for the explicit OG image endpoint (/api/og).
 * Returns a root-relative path — resolved against metadataBase.
 */
export function ogImageUrl(title: string, date?: string): string {
  const params = new URLSearchParams({ title })
  if (date) params.set("date", date)
  return `/api/og?${params.toString()}`
}
