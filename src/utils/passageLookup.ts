const BOOK_ALIASES: Record<string, string> = {
  genesis: 'GEN', gen: 'GEN', exodus: 'EXO', exo: 'EXO', leviticus: 'LEV', lev: 'LEV',
  numbers: 'NUM', num: 'NUM', deuteronomy: 'DEU', deut: 'DEU', joshua: 'JOS', jos: 'JOS',
  judges: 'JDG', jdg: 'JDG', ruth: 'RUT', rut: 'RUT', '1 samuel': '1SA', '1sam': '1SA',
  '2 samuel': '2SA', '2sam': '2SA', '1 kings': '1KI', '1ki': '1KI', '2 kings': '2KI', '2ki': '2KI',
  '1 chronicles': '1CH', '1ch': '1CH', '2 chronicles': '2CH', '2ch': '2CH', ezra: 'EZR',
  nehemiah: 'NEH', neh: 'NEH', esther: 'EST', est: 'EST', job: 'JOB', psalm: 'PSA', psalms: 'PSA',
  ps: 'PSA', proverbs: 'PRO', prov: 'PRO', pro: 'PRO', ecclesiastes: 'ECC', ecc: 'ECC',
  'song of songs': 'SNG', song: 'SNG', isaiah: 'ISA', isa: 'ISA', jeremiah: 'JER', jer: 'JER',
  lamentations: 'LAM', lam: 'LAM', ezekiel: 'EZK', ezek: 'EZK', daniel: 'DAN', dan: 'DAN',
  hosea: 'HOS', hos: 'HOS', joel: 'JOL', jol: 'JOL', amos: 'AMO', obadiah: 'OBA',
  oba: 'OBA', jonah: 'JON', jon: 'JON', micah: 'MIC', mic: 'MIC', nahum: 'NAH', nah: 'NAH',
  habakkuk: 'HAB', hab: 'HAB', zephaniah: 'ZEP', zep: 'ZEP', haggai: 'HAG', hag: 'HAG',
  zechariah: 'ZEC', zec: 'ZEC', malachi: 'MAL', mal: 'MAL', matthew: 'MAT', matt: 'MAT', mat: 'MAT',
  mark: 'MRK', mrk: 'MRK', luke: 'LUK', luk: 'LUK', john: 'JHN', jhn: 'JHN', acts: 'ACT',
  act: 'ACT', romans: 'ROM', rom: 'ROM', '1 corinthians': '1CO', '1cor': '1CO', '2 corinthians': '2CO',
  '2cor': '2CO', galatians: 'GAL', gal: 'GAL', ephesians: 'EPH', eph: 'EPH', philippians: 'PHP',
  php: 'PHP', phil: 'PHP', colossians: 'COL', col: 'COL', '1 thessalonians': '1TH', '1thess': '1TH',
  '2 thessalonians': '2TH', '2thess': '2TH', '1 timothy': '1TI', '1tim': '1TI', '2 timothy': '2TI',
  '2tim': '2TI', titus: 'TIT', tit: 'TIT', philemon: 'PHM', phm: 'PHM', hebrews: 'HEB', heb: 'HEB',
  james: 'JAS', jas: 'JAS', '1 peter': '1PE', '1pet': '1PE', '2 peter': '2PE', '2pet': '2PE',
  '1 john': '1JN', '1jn': '1JN', '2 john': '2JN', '2jn': '2JN', '3 john': '3JN', '3jn': '3JN',
  jude: 'JUD', jud: 'JUD', revelation: 'REV', rev: 'REV',
}

const OT_BOOKS = new Set([
  'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', '1KI', '2KI', '1CH', '2CH',
  'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS',
  'JOL', 'AMO', 'OBA', 'JON', 'MIC', 'NAH', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL',
])

/** Parse human reference like "John 3:16" or "Romans 8:28-30" into API.Bible passage id. */
export function parsePassageReference(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const normalized = trimmed.replace(/\s+/g, ' ')
  const match = normalized.match(/^(.+?)\s+(\d+)\s*:\s*(\d+)(?:\s*-\s*(\d+))?$/i)
  if (!match) return null

  const bookPart = match[1].trim().toLowerCase()
  const chapter = match[2]
  const verseStart = match[3]
  const verseEnd = match[4]

  const bookId = BOOK_ALIASES[bookPart]
  if (!bookId) return null

  const versePart = verseEnd ? `${verseStart}-${verseEnd}` : verseStart
  return `${bookId}.${chapter}.${versePart}`
}

export function isOldTestament(verseId: string): boolean {
  const book = verseId.split('.')[0]
  return OT_BOOKS.has(book)
}

export function isNewTestament(verseId: string): boolean {
  return !isOldTestament(verseId)
}

export function looksLikePassageReference(input: string): boolean {
  return parsePassageReference(input) !== null
}
