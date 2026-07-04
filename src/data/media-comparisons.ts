import type { MediaComparison, MediaType } from '../types/media'

export const MEDIA_COMPARISONS: MediaComparison[] = [
  {
    id: 'les-miserables',
    title: 'Les Misérables',
    type: 'book',
    creator: 'Victor Hugo',
    summary:
      'An ex-convict transformed by mercy pursues redemption while the law — without grace — hunts him.',
    parallels: [
      {
        id: 'les-mercy',
        theme: 'Mercy & Forgiveness',
        mediaLine: {
          text: 'Jean Valjean, my brother, you no longer belong to evil, but to good. I have bought your soul for God.',
          attribution: 'The Bishop of Digne, after Valjean steals his silver',
        },
        verseIds: ['MAT.6.14', 'EPH.1.7', 'MIC.7.18-19'],
        connection:
          'The bishop\'s forgiveness — returning stolen goods and giving more — mirrors the gospel: mercy that covers sin and calls the sinner into new life.',
      },
      {
        id: 'les-redemption',
        theme: 'Redemption',
        mediaLine: {
          text: 'He slept, but his heart was awake. The next morning... he was another man.',
          attribution: 'After the bishop\'s act of grace',
        },
        verseIds: ['2CO.5.17', 'ISA.44.22', 'EPH.2.8-9'],
        connection:
          'Valjean\'s overnight transformation pictures what Paul describes: in Christ, the old is gone and something new begins — not earned, but received.',
      },
      {
        id: 'les-sacrifice',
        theme: 'Sacrifice',
        mediaLine: {
          text: 'Take my hand. The night wind is cold. I am ready.',
          attribution: 'Valjean\'s deathbed, releasing Cosette and Marius',
        },
        verseIds: ['JHN.15.13', 'ROM.5.8', 'PHP.2.3-4'],
        connection:
          'Valjean\'s final self-giving for those he loves echoes Christ\'s love — laying down one\'s life for friends and counting others greater than oneself.',
      },
    ],
  },
  {
    id: 'shawshank',
    title: 'The Shawshank Redemption',
    type: 'movie',
    creator: 'Frank Darabont (1994)',
    summary:
      'Two prisoners endure unjust years behind bars, sustained by hope, friendship, and the refusal to let walls define them.',
    parallels: [
      {
        id: 'shawshank-hope',
        theme: 'Hope',
        mediaLine: {
          text: 'Remember, Red, hope is a good thing, maybe the best of things, and no good thing ever dies.',
          attribution: 'Andy Dufresne\'s letter to Red',
        },
        verseIds: ['ROM.15.13', 'HEB.6.19', 'JER.29.11'],
        connection:
          'Andy\'s hope is not naive optimism — it\'s an anchor through suffering, like the biblical hope that does not disappoint because it rests on God\'s promises.',
      },
      {
        id: 'shawshank-endure',
        theme: 'Endurance',
        mediaLine: {
          text: 'Every man must have a way to occupy his mind. This is mine.',
          attribution: 'Andy, carving chess pieces in the yard',
        },
        verseIds: ['JAS.1.2-4', 'ROM.5.3-4', 'GAL.6.9'],
        connection:
          'Years of faithful endurance in unjust circumstances mirror Scripture\'s teaching that perseverance through trials produces character and hope.',
      },
      {
        id: 'shawshank-freedom',
        theme: 'Liberation',
        mediaLine: {
          text: 'I find I\'m so excited I can barely sit still or hold a thought in my head. I think it\'s the excitement only a free man can feel.',
          attribution: 'Red, riding the bus toward freedom',
        },
        verseIds: ['JHN.8.36', 'GAL.5.1', '2CO.3.17'],
        connection:
          'Red\'s release from prison pictures a deeper freedom — the liberation Scripture promises when truth, grace, and the Spirit break chains no wall can hold.',
      },
    ],
  },
  {
    id: 'narnia',
    title: 'The Lion, the Witch and the Wardrobe',
    type: 'book',
    creator: 'C. S. Lewis',
    summary:
      'Four children enter a frozen land where Aslan — a Christ figure — offers himself to save a traitor and defeat death.',
    parallels: [
      {
        id: 'narnia-sacrifice',
        theme: 'Sacrifice & Atonement',
        mediaLine: {
          text: 'When a willing victim who had committed no treachery was killed in a traitor\'s stead... Death itself would start working backward.',
          attribution: 'Aslan explaining the Deep Magic',
        },
        verseIds: ['JHN.15.13', 'ISA.53.5', 'HEB.9.22'],
        connection:
          'Lewis makes explicit what the gospel declares: an innocent substitute dies for the guilty, and death itself is overturned.',
      },
      {
        id: 'narnia-resurrection',
        theme: 'Resurrection',
        mediaLine: {
          text: 'Aslan is not a tame lion... but he is good.',
          attribution: 'Mr. Beaver, describing Aslan to the children',
        },
        verseIds: ['1CO.15.20', 'REV.21.4', 'ROM.15.13'],
        connection:
          'Aslan\'s return brings spring to Narnia — a picture of resurrection hope breaking into a world held under winter and death.',
      },
      {
        id: 'narnia-forgiveness',
        theme: 'Forgiveness',
        mediaLine: {
          text: 'Here is your brother... and there is no need to talk about what is past.',
          attribution: 'Aslan restoring Edmund after his betrayal',
        },
        verseIds: ['1JN.1.9', 'COL.3.13', 'MIC.7.19'],
        connection:
          'Edmund\'s restoration without prolonged condemnation reflects divine forgiveness — sin acknowledged, covered, and not held against the repentant.',
      },
    ],
    cautions: ['Fantasy allegory; Aslan is a literary Christ figure, not a substitute for Scripture.'],
  },
  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    type: 'song',
    creator: 'John Newton (1779)',
    summary:
      'A hymn born from a former slave trader\'s testimony of being saved by grace he did not deserve.',
    parallels: [
      {
        id: 'grace-hymn',
        theme: 'Grace',
        mediaLine: {
          text: 'Amazing grace, how sweet the sound, that saved a wretch like me. I once was lost, but now am found; was blind, but now I see.',
          attribution: 'Verse 1',
        },
        verseIds: ['EPH.2.8-9', 'TIT.3.5', 'ROM.3.23-24'],
        connection:
          'Newton\'s lyrics are a personal confession of the gospel: salvation is received, not achieved — grace finds the lost and gives sight to the blind.',
      },
      {
        id: 'grace-through',
        theme: 'God\'s Faithfulness',
        mediaLine: {
          text: 'Through many dangers, toils, and snares, I have already come; \'tis grace hath brought me safe thus far, and grace will lead me home.',
          attribution: 'Verse 4',
        },
        verseIds: ['2TI.4.18', 'PSA.23.4', 'DEU.31.6'],
        connection:
          'The hymn traces a life preserved through peril — matching Scripture\'s promise that God\'s grace sustains believers through every trial until they reach home.',
      },
    ],
  },
  {
    id: 'hallelujah',
    title: 'Hallelujah',
    type: 'song',
    creator: 'Leonard Cohen (1984)',
    summary:
      'Cohen weaves David\'s broken worship, Samson\'s fall, and human longing into a song that still cries "Hallelujah."',
    parallels: [
      {
        id: 'hallelujah-broken',
        theme: 'Broken Worship',
        mediaLine: {
          text: 'I did my best, it wasn\'t much. I couldn\'t feel, so I tried to touch. I\'ve told the truth, I didn\'t come to fool you — and even though it all went wrong, I\'ll stand before the Lord of song with nothing on my tongue but Hallelujah.',
          attribution: 'Final verse',
        },
        verseIds: ['PSA.51.17', '2CO.12.9', 'ROM.8.26'],
        connection:
          'Cohen\'s broken "Hallelujah" echoes David\'s psalm of repentance — God desires a contrite heart, and worship can rise even from failure and weakness.',
      },
      {
        id: 'hallelujah-david',
        theme: 'Sin & Consequence',
        mediaLine: {
          text: 'Your faith was strong but you needed proof. You saw her bathing on the roof — her beauty and the moonlight overthrew you.',
          attribution: 'Reference to David and Bathsheba',
        },
        verseIds: ['2SA.12.13', 'PSA.51.1-2', 'GAL.6.7'],
        connection:
          'Cohen retells David\'s adultery and its fallout — Scripture\'s honest portrait of a man after God\'s heart who still fell, repented, and bore consequences.',
      },
    ],
    cautions: ['Secular framing of sacred language; useful for reflection, not corporate worship.'],
  },
  {
    id: 'star-wars',
    title: 'Star Wars',
    type: 'movie',
    creator: 'George Lucas (1977)',
    summary:
      'A farm boy discovers destiny, resists the dark side, and learns that faith in something greater can topple empires.',
    parallels: [
      {
        id: 'sw-faith',
        theme: 'Faith',
        mediaLine: {
          text: 'Use the Force, Luke. Let go.',
          attribution: 'Obi-Wan Kenobi\'s voice to Luke during the trench run',
        },
        verseIds: ['HEB.11.1', 'PRO.3.5', '2CO.5.7'],
        connection:
          'Luke\'s trust in the unseen Force parallels walking by faith — releasing control and relying on a power beyond instruments and sight.',
      },
      {
        id: 'sw-redemption',
        theme: 'Redemption',
        mediaLine: {
          text: 'You were right about me. Tell your sister you were right.',
          attribution: 'Darth Vader to Luke, Return of the Jedi',
        },
        verseIds: ['LUK.15.20', 'ISA.1.18', '1TI.1.15'],
        connection:
          'Vader\'s return to the light before death reflects Scripture\'s insistence that no one is beyond the reach of repentance and restoration.',
      },
      {
        id: 'sw-good-evil',
        theme: 'Spiritual Warfare',
        mediaLine: {
          text: 'Luke, don\'t give in to hate. That leads to the dark side.',
          attribution: 'Obi-Wan Kenobi',
        },
        verseIds: ['EPH.6.12', 'GAL.5.16', '1PE.5.8'],
        connection:
          'The struggle between light and dark mirrors biblical spiritual warfare — inner temptation, moral choice, and the call to resist what destroys the soul.',
      },
    ],
    cautions: ['Uses fictional mysticism ("The Force"), not biblical theology.'],
  },
  {
    id: 'chariots',
    title: 'Chariots of Fire',
    type: 'movie',
    creator: 'Hugh Hudson (1981)',
    summary:
      'Eric Liddell, a Scottish missionary, runs for the glory of God and refuses to compromise his conscience at the Olympics.',
    parallels: [
      {
        id: 'chariots-purpose',
        theme: 'Purpose & Calling',
        mediaLine: {
          text: 'I believe God made me for a purpose, but he also made me fast. And when I run, I feel His pleasure.',
          attribution: 'Eric Liddell',
        },
        verseIds: ['EPH.2.10', 'COL.3.23-24', '1CO.10.31'],
        connection:
          'Liddell sees athletics as worship — every gift and task can be offered to God, done heartily as unto the Lord rather than men.',
      },
      {
        id: 'chariots-conviction',
        theme: 'Obedience',
        mediaLine: {
          text: 'The Sabbath is the Lord\'s day. I can\'t run on the Sabbath.',
          attribution: 'Liddell refusing the 100m heat at Paris 1924',
        },
        verseIds: ['ACT.5.29', 'EXO.20.8', 'JHN.14.15'],
        connection:
          'Liddell\'s costly obedience — sacrificing Olympic glory for conscience — echoes Peter: we must obey God rather than human pressure, whatever the price.',
      },
    ],
  },
  {
    id: 'where-is-the-love',
    title: 'Where Is the Love?',
    type: 'song',
    creator: 'The Black Eyed Peas (2003)',
    summary:
      'A pop anthem that catalogs violence, hatred, and brokenness in the world and asks where compassion has gone.',
    parallels: [
      {
        id: 'witl-love',
        theme: 'Love',
        mediaLine: {
          text: 'What\'s wrong with the world, mama? People livin\' like they ain\'t got no mamas... Where is the love?',
          attribution: 'Chorus',
        },
        verseIds: ['1JN.4.7-8', 'MAT.22.37-39', '1CO.13.1'],
        connection:
          'The song\'s central question echoes Jesus\' greatest commandment — love of God and neighbor — and confronts a world that professes faith but lacks love.',
      },
      {
        id: 'witl-justice',
        theme: 'Justice',
        mediaLine: {
          text: 'Wrong information always shown by the media. Negative images is the main criteria.',
          attribution: 'Verse 2',
        },
        verseIds: ['MIC.6.8', 'ISA.1.17', 'AMO.5.24'],
        connection:
          'The lyrics call out systemic injustice and distorted narratives — themes the prophets raised when demanding that justice roll down like a river.',
      },
    ],
    cautions: ['Humanistic framing without explicit gospel; still valuable for moral and social reflection.'],
  },
]

export function getMediaComparison(id: string): MediaComparison | undefined {
  return MEDIA_COMPARISONS.find((m) => m.id === id)
}

export function getComparisonsByType(type: MediaType | 'all'): MediaComparison[] {
  if (type === 'all') return MEDIA_COMPARISONS
  return MEDIA_COMPARISONS.filter((m) => m.type === type)
}

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
  book: 'Book',
  song: 'Song',
  movie: 'Movie',
}

export const FEATURED_STORY_IDS = [
  'shawshank',
  'les-miserables',
  'hallelujah',
  'narnia',
  'amazing-grace',
  'star-wars',
] as const

export const STORIES_COMPARE_STEPS = [
  { step: 1, label: 'Search', detail: 'Find any book on Goodreads or film on Letterboxd' },
  { step: 2, label: 'Compare', detail: 'Synopsis and summary themes matched to NIV passages' },
  { step: 3, label: 'Reflect', detail: 'Jump between themes, share, or explore subjects deeper' },
] as const

export function getFeaturedStories(): MediaComparison[] {
  return FEATURED_STORY_IDS.map((id) => getMediaComparison(id)).filter(
    (item): item is MediaComparison => item !== undefined,
  )
}

export function searchCuratedComparisons(
  query: string,
  type?: 'book' | 'movie' | 'song',
): MediaComparison[] {
  const trimmed = query.trim()
  if (trimmed.length < 2) return []

  const pool = type ? getComparisonsByType(type) : MEDIA_COMPARISONS

  return pool
    .map((item) => {
      const label = `${item.title} ${item.creator ?? ''} ${item.summary}`
      let score = 0
      const q = trimmed.toLowerCase()
      const title = item.title.toLowerCase()
      if (title === q) score = 100
      else if (title.startsWith(q)) score = 90
      else if (title.includes(q)) score = 75
      else if (item.creator?.toLowerCase().includes(q)) score = 60
      else if (label.toLowerCase().includes(q)) score = 40
      return { item, score }
    })
    .filter(({ score }) => score >= 40)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}
