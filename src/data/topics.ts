export interface Topic {
  id: string
  name: string
  description: string
  keywords: string[]
  verseIds: string[]
}

export const NIV_BIBLE_ID = 'de4e12af7f28f599-02'

export const TOPICS: Topic[] = [
  {
    id: 'love',
    name: 'Love',
    description: 'God\'s love and loving others',
    keywords: ['love', 'beloved', 'charity', 'affection', 'compassion'],
    verseIds: ['JHN.3.16', '1JN.4.8', '1CO.13.4-7', 'ROM.5.8', '1JN.4.19', 'GAL.5.22', 'MAT.22.37-39'],
  },
  {
    id: 'faith',
    name: 'Faith',
    description: 'Trusting God and living by faith',
    keywords: ['faith', 'believe', 'trust', 'faithful', 'belief'],
    verseIds: ['HEB.11.1', 'ROM.10.17', 'JAS.1.6', 'MAR.11.22-24', 'EPH.2.8-9', '2CO.5.7', 'GAL.2.20'],
  },
  {
    id: 'hope',
    name: 'Hope',
    description: 'Confident expectation in God',
    keywords: ['hope', 'expectation', 'future', 'promise'],
    verseIds: ['ROM.15.13', 'JER.29.11', 'PSA.39.7', 'ROM.5.5', '1PE.1.3', 'LAM.3.21-23', 'HEB.6.19'],
  },
  {
    id: 'peace',
    name: 'Peace',
    description: 'Inner calm and reconciliation with God',
    keywords: ['peace', 'calm', 'rest', 'tranquil', 'shalom'],
    verseIds: ['PHI.4.6-7', 'JHN.14.27', 'ISA.26.3', 'ROM.5.1', 'COL.3.15', 'MAT.11.28-29', 'PSA.29.11'],
  },
  {
    id: 'forgiveness',
    name: 'Forgiveness',
    description: 'Receiving and extending forgiveness',
    keywords: ['forgive', 'forgiveness', 'mercy', 'pardon', 'reconcile'],
    verseIds: ['1JN.1.9', 'EPH.4.32', 'MAT.6.14-15', 'COL.3.13', 'PSA.103.12', 'MIC.7.18-19', 'LUK.23.34'],
  },
  {
    id: 'anxiety',
    name: 'Anxiety & Worry',
    description: 'Casting cares on God when anxious',
    keywords: ['anxiety', 'anxious', 'worry', 'worried', 'stress', 'fear', 'trouble'],
    verseIds: ['PHI.4.6-7', '1PE.5.7', 'MAT.6.25-34', 'PSA.55.22', 'ISA.41.10', 'JHN.14.1', 'PSA.94.19'],
  },
  {
    id: 'strength',
    name: 'Strength',
    description: 'Drawing power from God in weakness',
    keywords: ['strength', 'strong', 'power', 'mighty', 'courage', 'weakness'],
    verseIds: ['PHI.4.13', 'ISA.40.31', '2CO.12.9-10', 'EPH.6.10', 'PSA.46.1', 'JOS.1.9', 'NEH.8.10'],
  },
  {
    id: 'wisdom',
    name: 'Wisdom',
    description: 'Godly wisdom and discernment',
    keywords: ['wisdom', 'wise', 'understanding', 'discernment', 'knowledge'],
    verseIds: ['JAS.1.5', 'PRO.3.5-6', 'PRO.9.10', 'ECC.7.12', 'COL.2.2-3', '1CO.1.25', 'DAN.2.20-21'],
  },
  {
    id: 'prayer',
    name: 'Prayer',
    description: 'Talking with God and interceding',
    keywords: ['prayer', 'pray', 'petition', 'intercede', 'supplication'],
    verseIds: ['MAT.6.6', '1TH.5.17', 'JAS.5.16', 'PHI.4.6', 'JER.33.3', 'LUK.18.1', 'ROM.8.26'],
  },
  {
    id: 'salvation',
    name: 'Salvation',
    description: 'Rescue and eternal life through Christ',
    keywords: ['salvation', 'saved', 'save', 'redeem', 'redeemer', 'eternal life'],
    verseIds: ['EPH.2.8-9', 'ROM.10.9-10', 'JHN.3.16', 'ACT.4.12', 'TIT.3.5', '2CO.5.17', 'ROM.6.23'],
  },
  {
    id: 'grace',
    name: 'Grace',
    description: 'Unmerited favor from God',
    keywords: ['grace', 'favor', 'gift', 'undeserved'],
    verseIds: ['EPH.2.8-9', '2CO.12.9', 'ROM.3.23-24', 'TIT.2.11-12', 'HEB.4.16', 'JHN.1.16', 'ROM.5.20'],
  },
  {
    id: 'joy',
    name: 'Joy',
    description: 'Deep gladness rooted in God',
    keywords: ['joy', 'joyful', 'rejoice', 'gladness', 'delight'],
    verseIds: ['NEH.8.10', 'PSA.16.11', 'JHN.15.11', 'ROM.15.13', 'PHI.4.4', 'GAL.5.22', '1PE.1.8-9'],
  },
  {
    id: 'patience',
    name: 'Patience',
    description: 'Enduring with steadfast hope',
    keywords: ['patience', 'patient', 'endure', 'perseverance', 'wait', 'longsuffering'],
    verseIds: ['JAS.1.2-4', 'ROM.12.12', 'GAL.6.9', 'HEB.10.36', 'LAM.3.25', 'COL.1.11', '2PE.3.9'],
  },
  {
    id: 'healing',
    name: 'Healing',
    description: 'Physical and spiritual restoration',
    keywords: ['heal', 'healing', 'restore', 'health', 'wholeness', 'sickness'],
    verseIds: ['PSA.103.2-3', 'JAS.5.14-15', 'ISA.53.5', '1PE.2.24', 'EXO.15.26', 'JER.17.14', 'MAT.11.28'],
  },
  {
    id: 'marriage',
    name: 'Marriage',
    description: 'Covenant love between husband and wife',
    keywords: ['marriage', 'marry', 'husband', 'wife', 'spouse', 'wedding'],
    verseIds: ['GEN.2.24', 'EPH.5.25', 'EPH.5.33', 'ECC.4.9-12', 'PRO.18.22', 'HEB.13.4', '1CO.13.4-7'],
  },
  {
    id: 'parenting',
    name: 'Parenting & Children',
    description: 'Raising children in the Lord',
    keywords: ['children', 'child', 'parent', 'parenting', 'family', 'son', 'daughter'],
    verseIds: ['PRO.22.6', 'EPH.6.4', 'PSA.127.3', 'DEU.6.6-7', 'COL.3.21', 'PRO.29.17', 'MAT.19.14'],
  },
  {
    id: 'money',
    name: 'Money & Generosity',
    description: 'Stewardship, contentment, and giving',
    keywords: ['money', 'wealth', 'rich', 'poor', 'give', 'generosity', 'tithe', 'greed'],
    verseIds: ['MAT.6.24', '1TI.6.10', 'HEB.13.5', 'PRO.3.9-10', '2CO.9.7', 'LUK.6.38', 'ECC.5.10'],
  },
  {
    id: 'work',
    name: 'Work & Purpose',
    description: 'Laboring with diligence and meaning',
    keywords: ['work', 'labor', 'job', 'purpose', 'vocation', 'diligence'],
    verseIds: ['COL.3.23-24', 'ECC.3.13', 'PRO.16.3', 'GEN.2.15', '2TH.3.10', 'PSA.90.17', 'EPH.2.10'],
  },
  {
    id: 'anger',
    name: 'Anger',
    description: 'Righteous and sinful anger',
    keywords: ['anger', 'angry', 'wrath', 'rage', 'temper'],
    verseIds: ['EPH.4.26-27', 'JAS.1.19-20', 'PRO.15.1', 'PRO.29.11', 'ECC.7.9', 'PSA.37.8', 'COL.3.8'],
  },
  {
    id: 'grief',
    name: 'Grief & Loss',
    description: 'Comfort in mourning and sorrow',
    keywords: ['grief', 'grieve', 'mourn', 'sorrow', 'loss', 'death', 'comfort'],
    verseIds: ['MAT.5.4', 'PSA.34.18', 'REV.21.4', '2CO.1.3-4', 'PSA.23.4', 'JHN.11.35', 'ISA.61.1-3'],
  },
  {
    id: 'loneliness',
    name: 'Loneliness',
    description: 'God\'s presence when you feel alone',
    keywords: ['lonely', 'loneliness', 'alone', 'isolated', 'abandoned'],
    verseIds: ['HEB.13.5', 'PSA.23.4', 'ISA.41.10', 'DEU.31.6', 'MAT.28.20', 'PSA.68.6', 'JHN.14.18'],
  },
  {
    id: 'temptation',
    name: 'Temptation',
    description: 'Resisting sin and finding a way out',
    keywords: ['temptation', 'tempt', 'tempted', 'sin', 'lust', 'desire'],
    verseIds: ['1CO.10.13', 'JAS.1.12-15', 'MAT.26.41', 'HEB.2.18', 'GAL.5.16', '1PE.5.8', 'PSA.119.11'],
  },
  {
    id: 'obedience',
    name: 'Obedience',
    description: 'Following God\'s commands',
    keywords: ['obey', 'obedience', 'command', 'commandment', 'submit'],
    verseIds: ['JHN.14.15', '1SA.15.22', 'DEU.28.1-2', 'ACT.5.29', 'JAS.1.22', '1JN.5.3', 'JHN.15.10'],
  },
  {
    id: 'humility',
    name: 'Humility',
    description: 'Lowliness before God and others',
    keywords: ['humble', 'humility', 'meek', 'pride', 'proud'],
    verseIds: ['PHI.2.3-4', 'JAS.4.6', '1PE.5.6', 'MIC.6.8', 'PRO.22.4', 'MAT.23.12', 'LUK.14.11'],
  },
  {
    id: 'kindness',
    name: 'Kindness & Compassion',
    description: 'Showing mercy and gentle care',
    keywords: ['kind', 'kindness', 'compassion', 'mercy', 'gentle', 'goodness'],
    verseIds: ['EPH.4.32', 'COL.3.12', 'MIC.6.8', 'GAL.5.22', 'LUK.6.36', 'PRO.11.17', 'ZEC.7.9'],
  },
  {
    id: 'justice',
    name: 'Justice & Righteousness',
    description: 'Doing what is right and fair',
    keywords: ['justice', 'righteous', 'righteousness', 'fair', 'equity', 'judge'],
    verseIds: ['MIC.6.8', 'ISA.1.17', 'AMO.5.24', 'PRO.21.3', 'PSA.89.14', 'MAT.23.23', 'ZEC.7.9'],
  },
  {
    id: 'mercy',
    name: 'Mercy',
    description: 'God\'s compassion toward the undeserving',
    keywords: ['mercy', 'merciful', 'compassion', 'pity'],
    verseIds: ['PSA.103.8', 'LUK.6.36', 'MAT.5.7', 'MIC.7.18', 'JAS.2.13', 'EPH.2.4', 'TIT.3.5'],
  },
  {
    id: 'guidance',
    name: 'Guidance & Direction',
    description: 'Seeking God\'s leading in decisions',
    keywords: ['guide', 'guidance', 'direction', 'path', 'lead', 'will of god'],
    verseIds: ['PSA.32.8', 'PRO.3.5-6', 'PSA.119.105', 'ISA.30.21', 'JAS.1.5', 'ROM.12.2', 'JHN.16.13'],
  },
  {
    id: 'thanksgiving',
    name: 'Thanksgiving',
    description: 'Gratitude and praise to God',
    keywords: ['thank', 'thanks', 'thanksgiving', 'gratitude', 'grateful', 'praise'],
    verseIds: ['1TH.5.18', 'PSA.100.4', 'PHI.4.6', 'COL.3.17', 'PSA.107.1', 'HEB.13.15', 'JAS.1.17'],
  },
  {
    id: 'identity',
    name: 'Identity in Christ',
    description: 'Who you are as God\'s child',
    keywords: ['identity', 'who am i', 'child of god', 'belong', 'chosen', 'worth'],
    verseIds: ['2CO.5.17', 'GAL.2.20', 'EPH.2.10', '1PE.2.9', 'ROM.8.16-17', 'JHN.1.12', 'COL.3.3-4'],
  },
]

export interface TopicCategory {
  id: string
  name: string
  description: string
  topicIds: string[]
}

export const TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: 'foundations',
    name: 'Foundations',
    description: 'Core truths of the Christian faith',
    topicIds: ['love', 'faith', 'hope', 'peace', 'joy', 'grace', 'salvation', 'prayer'],
  },
  {
    id: 'character',
    name: 'Character',
    description: 'Virtues that shape a Christlike life',
    topicIds: [
      'forgiveness',
      'wisdom',
      'patience',
      'obedience',
      'humility',
      'kindness',
      'mercy',
      'justice',
      'thanksgiving',
      'identity',
    ],
  },
  {
    id: 'struggles',
    name: 'Struggles',
    description: 'Scripture for hard seasons and emotions',
    topicIds: [
      'anxiety',
      'strength',
      'healing',
      'grief',
      'loneliness',
      'anger',
      'temptation',
      'guidance',
    ],
  },
  {
    id: 'life',
    name: 'Daily Life',
    description: 'God\'s word for relationships and calling',
    topicIds: ['marriage', 'parenting', 'money', 'work'],
  },
]

export const FEATURED_TOPICS = TOPICS.slice(0, 8)

export function getTopicsByCategory(categoryId: string): Topic[] {
  if (categoryId === 'all') return TOPICS
  const category = TOPIC_CATEGORIES.find((c) => c.id === categoryId)
  if (!category) return TOPICS
  return category.topicIds
    .map((id) => TOPICS.find((t) => t.id === id))
    .filter((t): t is Topic => t !== undefined)
}

export function getCategoryForTopic(topicId: string): TopicCategory | undefined {
  return TOPIC_CATEGORIES.find((c) => c.topicIds.includes(topicId))
}

export function searchTopics(query: string): Topic[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return []

  return TOPICS.map((topic) => {
    let score = 0

    if (topic.name.toLowerCase().includes(normalized)) score += 10
    if (topic.id.includes(normalized)) score += 8

    for (const keyword of topic.keywords) {
      if (keyword === normalized) score += 12
      else if (keyword.includes(normalized) || normalized.includes(keyword)) score += 6
    }

    if (topic.description.toLowerCase().includes(normalized)) score += 3

    return { topic, score }
  })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ topic }) => topic)
}

export function getTopicById(id: string): Topic | undefined {
  return TOPICS.find((topic) => topic.id === id)
}
