/** Derive API.Bible chapter passage id from a verse or range id (e.g. JHN.3.16 → JHN.3). */
export function getChapterPassageId(verseId: string): string {
  const parts = verseId.split('.')
  if (parts.length >= 2) return `${parts[0]}.${parts[1]}`
  return verseId
}
