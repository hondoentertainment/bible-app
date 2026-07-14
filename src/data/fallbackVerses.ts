import type { Verse } from '../types'

export interface FallbackVerse extends Verse {
  topicId: string
  topicName: string
}

/**
 * A small curated set of well-known NIV verses bundled with the app so the
 * "Verse of the Day" hero can still show real Scripture when the live API is
 * unreachable (offline / missing key). IDs match the API's passage IDs so a
 * later online load can seamlessly replace the fallback.
 */
export const FALLBACK_VERSES: FallbackVerse[] = [
  {
    id: 'JHN.3.16',
    reference: 'John 3:16',
    text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    topicId: 'love',
    topicName: 'Love',
  },
  {
    id: 'PHI.4.6-7',
    reference: 'Philippians 4:6-7',
    text: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
    topicId: 'peace',
    topicName: 'Peace',
  },
  {
    id: 'JER.29.11',
    reference: 'Jeremiah 29:11',
    text: '“For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.”',
    topicId: 'hope',
    topicName: 'Hope',
  },
  {
    id: 'ISA.40.31',
    reference: 'Isaiah 40:31',
    text: 'but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    topicId: 'strength',
    topicName: 'Strength',
  },
  {
    id: 'PHI.4.13',
    reference: 'Philippians 4:13',
    text: 'I can do all this through him who gives me strength.',
    topicId: 'strength',
    topicName: 'Strength',
  },
  {
    id: 'PRO.3.5-6',
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    topicId: 'wisdom',
    topicName: 'Wisdom',
  },
  {
    id: 'MAT.11.28-29',
    reference: 'Matthew 11:28-29',
    text: 'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.',
    topicId: 'peace',
    topicName: 'Peace',
  },
  {
    id: 'ISA.41.10',
    reference: 'Isaiah 41:10',
    text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.',
    topicId: 'anxiety',
    topicName: 'Anxiety & Worry',
  },
  {
    id: '1PE.5.7',
    reference: '1 Peter 5:7',
    text: 'Cast all your anxiety on him because he cares for you.',
    topicId: 'anxiety',
    topicName: 'Anxiety & Worry',
  },
  {
    id: 'HEB.11.1',
    reference: 'Hebrews 11:1',
    text: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
    topicId: 'faith',
    topicName: 'Faith',
  },
  {
    id: 'ROM.15.13',
    reference: 'Romans 15:13',
    text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.',
    topicId: 'hope',
    topicName: 'Hope',
  },
  {
    id: '1JN.1.9',
    reference: '1 John 1:9',
    text: 'If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.',
    topicId: 'forgiveness',
    topicName: 'Forgiveness',
  },
  {
    id: 'JOS.1.9',
    reference: 'Joshua 1:9',
    text: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.',
    topicId: 'strength',
    topicName: 'Strength',
  },
]

const byId = new Map(FALLBACK_VERSES.map((v) => [v.id, v]))

/** Returns bundled text for a specific passage id, if we have it. */
export function getFallbackVerseById(id: string): FallbackVerse | undefined {
  return byId.get(id)
}

/** Deterministically picks a bundled verse for a given day index. */
export function getFallbackVerseForDay(dayIndex: number): FallbackVerse {
  const index = ((dayIndex % FALLBACK_VERSES.length) + FALLBACK_VERSES.length) % FALLBACK_VERSES.length
  return FALLBACK_VERSES[index]
}
