export const NIV_BIBLE_ID = 'de4e12af7f28f599-02'
export const ESV_BIBLE_ID = 'f421fe272da76204-01'

export const TRANSLATIONS = {
  niv: { id: NIV_BIBLE_ID, label: 'NIV', shortLabel: 'New International Version' },
  esv: { id: ESV_BIBLE_ID, label: 'ESV', shortLabel: 'English Standard Version' },
} as const

export type TranslationKey = keyof typeof TRANSLATIONS
