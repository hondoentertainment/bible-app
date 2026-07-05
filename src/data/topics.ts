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
  {
    id: 'worship',
    name: 'Worship',
    description: 'Honoring God with heart, soul, and life',
    keywords: ['worship', 'praise', 'adore', 'glorify', 'magnify', 'bow down'],
    verseIds: ['PSA.95.6', 'JHN.4.24', 'ROM.12.1', 'PSA.150.6', 'HEB.13.15', 'PSA.29.2', 'COL.3.16'],
  },
  {
    id: 'trust',
    name: 'Trust',
    description: 'Leaning on God instead of your own understanding',
    keywords: ['trust', 'rely', 'depend', 'lean on', 'confidence in god'],
    verseIds: ['PRO.3.5-6', 'PSA.56.3', 'ISA.26.4', 'PSA.37.5', 'NAH.1.7', 'PSA.9.10', 'JER.17.7-8'],
  },
  {
    id: 'courage',
    name: 'Courage',
    description: 'Bold faith when afraid',
    keywords: ['courage', 'brave', 'bold', 'fear not', 'do not fear', 'be strong'],
    verseIds: ['JOS.1.9', 'DEU.31.6', 'ISA.41.10', '2TI.1.7', 'PSA.27.1', 'ACT.4.31', '1CO.16.13'],
  },
  {
    id: 'contentment',
    name: 'Contentment',
    description: 'Finding sufficiency in Christ',
    keywords: ['content', 'contentment', 'enough', 'satisfied', 'sufficiency'],
    verseIds: ['PHI.4.11-13', '1TI.6.6-8', 'HEB.13.5', 'PSA.23.1', 'LUK.12.15', '2CO.9.8', 'MAT.6.33'],
  },
  {
    id: 'holiness',
    name: 'Holiness',
    description: 'Set apart for God in thought and action',
    keywords: ['holy', 'holiness', 'pure', 'purity', 'sanctify', 'set apart'],
    verseIds: ['1PE.1.15-16', 'HEB.12.14', '2CO.7.1', 'ROM.12.1-2', 'PSA.119.9', '1TH.4.7', 'LEV.11.44'],
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Life together in the body of Christ',
    keywords: ['community', 'fellowship', 'together', 'one another', 'church', 'gather'],
    verseIds: ['HEB.10.24-25', 'ACT.2.42', 'ROM.12.5', 'GAL.6.2', '1JN.1.7', 'COL.3.16', 'ECC.4.9-10'],
  },
  {
    id: 'rest',
    name: 'Rest',
    description: 'Sabbath rest and soul refreshment in God',
    keywords: ['rest', 'sabbath', 'refresh', 'weary', 'burden', 'stillness'],
    verseIds: ['MAT.11.28-30', 'PSA.23.2-3', 'EXO.20.8-10', 'HEB.4.9-10', 'ISA.40.31', 'PSA.62.1', 'MRK.6.31'],
  },
  {
    id: 'suffering',
    name: 'Suffering',
    description: 'Enduring hardship with hope in Christ',
    keywords: ['suffer', 'suffering', 'trial', 'affliction', 'hardship', 'persecution'],
    verseIds: ['ROM.5.3-5', 'JAS.1.2-4', '1PE.4.12-13', '2CO.4.17', 'PSA.34.18', 'ISA.53.3', 'ROM.8.18'],
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'God\'s nearness in sorrow and pain',
    keywords: ['comfort', 'console', 'mourn', 'grieve', 'near', 'brokenhearted'],
    verseIds: ['2CO.1.3-4', 'PSA.34.18', 'ISA.61.1-2', 'MAT.5.4', 'PSA.147.3', 'JHN.14.1', 'ROM.15.13'],
  },
  {
    id: 'truth',
    name: 'Truth',
    description: 'Standing firm in God\'s word and character',
    keywords: ['truth', 'true', 'honest', 'integrity', 'word of god', 'lies'],
    verseIds: ['JHN.14.6', 'JHN.8.32', 'PSA.119.160', 'EPH.4.15', '3JN.1.4', 'PRO.12.22', '2TI.2.15'],
  },
  {
    id: 'creation',
    name: 'Creation',
    description: 'God as maker of heaven, earth, and life',
    keywords: ['creation', 'creator', 'made', 'heavens', 'earth', 'beginning'],
    verseIds: ['GEN.1.1', 'PSA.19.1', 'COL.1.16', 'ISA.40.26', 'ROM.1.20', 'PSA.104.24', 'REV.4.11'],
  },
  {
    id: 'evangelism',
    name: 'Evangelism',
    description: 'Sharing the good news of Jesus',
    keywords: ['evangelism', 'witness', 'gospel', 'share faith', 'great commission', 'tell'],
    verseIds: ['MAT.28.19-20', 'MRK.16.15', 'ROM.10.14-15', 'ACT.1.8', '2CO.5.20', '1PE.3.15', 'MAT.5.14-16'],
  },
  {
    id: 'jesus',
    name: 'Jesus Christ',
    description: 'The person, work, and lordship of Christ',
    keywords: ['jesus', 'christ', 'lord', 'messiah', 'savior', 'son of god'],
    verseIds: ['JHN.14.6', 'PHI.2.9-11', 'HEB.1.3', 'COL.1.15-17', 'JHN.1.1', 'ACT.4.12', 'HEB.13.8'],
  },
  {
    id: 'holy-spirit',
    name: 'Holy Spirit',
    description: 'The presence and power of the Spirit',
    keywords: ['holy spirit', 'spirit', 'comforter', 'helper', 'pentecost', 'filled'],
    verseIds: ['JHN.14.26', 'ACT.1.8', 'ROM.8.26', 'GAL.5.22-23', '1CO.6.19', 'JHN.16.13', 'EPH.1.13-14'],
  },
  {
    id: 'scripture',
    name: 'Scripture',
    description: 'The power and authority of God\'s word',
    keywords: ['scripture', 'bible', 'word of god', 'read', 'study', 'law of the lord'],
    verseIds: ['2TI.3.16-17', 'HEB.4.12', 'PSA.119.105', 'JOS.1.8', 'ISA.40.8', 'MAT.4.4', 'PSA.19.7'],
  },
  {
    id: 'heaven',
    name: 'Heaven',
    description: 'Our eternal home with God',
    keywords: ['heaven', 'eternity', 'home', 'glory', 'new jerusalem', 'paradise'],
    verseIds: ['JHN.14.2-3', 'REV.21.4', 'PHI.3.20', '2CO.5.1', 'COL.3.1-2', 'REV.21.1', 'MAT.6.20'],
  },
  {
    id: 'eternal-life',
    name: 'Eternal Life',
    description: 'Everlasting life through Jesus',
    keywords: ['eternal life', 'everlasting', 'forever', 'life', 'immortal'],
    verseIds: ['JHN.3.16', 'JHN.17.3', 'ROM.6.23', '1JN.5.11-13', 'JHN.10.28', 'TIT.1.2', 'JHN.11.25-26'],
  },
  {
    id: 'resurrection',
    name: 'Resurrection',
    description: 'Christ\'s rising and our future hope',
    keywords: ['resurrection', 'risen', 'raised', 'empty tomb', 'alive', 'new body'],
    verseIds: ['1CO.15.20-22', 'JHN.11.25-26', 'ROM.6.5', '1PE.1.3', '1CO.15.54-57', 'PHI.3.10-11', 'MAT.28.6'],
  },
  {
    id: 'redemption',
    name: 'Redemption',
    description: 'Bought back and set free by Christ',
    keywords: ['redemption', 'redeem', 'redeemed', 'ransom', 'bought', 'freed'],
    verseIds: ['EPH.1.7', 'COL.1.14', 'TIT.2.14', '1PE.1.18-19', 'ROM.3.24', 'GAL.3.13', 'PSA.130.7'],
  },
  {
    id: 'blessing',
    name: 'Blessing',
    description: 'God\'s favor poured out on his people',
    keywords: ['blessing', 'blessed', 'bless', 'favor', 'benediction'],
    verseIds: ['NUM.6.24-26', 'PSA.1.1-3', 'EPH.1.3', 'PRO.10.22', 'JER.17.7-8', 'PSA.128.1-2', 'MAT.5.3-10'],
  },
  {
    id: 'self-control',
    name: 'Self-Control',
    description: 'Mastering desires by the Spirit',
    keywords: ['self control', 'self-control', 'discipline', 'restraint', 'moderation'],
    verseIds: ['GAL.5.22-23', '2TI.1.7', 'PRO.25.28', '1CO.9.27', '1PE.5.8', 'TIT.2.11-12', '2PE.1.5-6'],
  },
  {
    id: 'gentleness',
    name: 'Gentleness',
    description: 'A gentle and humble spirit',
    keywords: ['gentle', 'gentleness', 'meekness', 'tender', 'soft answer'],
    verseIds: ['GAL.5.23', 'PHI.4.5', 'COL.3.12', '1PE.3.15', 'MAT.11.29', 'PRO.15.1', 'EPH.4.2'],
  },
  {
    id: 'faithfulness',
    name: 'Faithfulness',
    description: 'God\'s faithfulness and our steadfastness',
    keywords: ['faithful', 'faithfulness', 'steadfast', 'reliable', 'loyal'],
    verseIds: ['LAM.3.22-23', '1CO.1.9', '2TI.2.13', 'PSA.36.5', 'PRO.3.3', 'DEU.7.9', 'HEB.10.23'],
  },
  {
    id: 'goodness',
    name: 'Goodness',
    description: 'The goodness of God and doing good',
    keywords: ['goodness', 'good', 'kind', 'benevolence', 'good works'],
    verseIds: ['GAL.5.22', 'PSA.23.6', 'ROM.8.28', 'PSA.34.8', 'EPH.2.10', 'PSA.145.9', 'LUK.6.35'],
  },
  {
    id: 'discipline',
    name: 'Discipline',
    description: 'God\'s loving correction and training',
    keywords: ['discipline', 'correction', 'train', 'reproof', 'chasten'],
    verseIds: ['HEB.12.11', 'PRO.3.11-12', '1CO.9.27', 'PRO.12.1', '2TI.1.7', 'TIT.1.8', 'PRO.13.24'],
  },
  {
    id: 'service',
    name: 'Service',
    description: 'Serving God by serving others',
    keywords: ['service', 'serve', 'servant', 'ministry', 'help', 'volunteer'],
    verseIds: ['MRK.10.45', 'GAL.5.13', '1PE.4.10', 'PHI.2.3-4', 'COL.3.23-24', 'MAT.25.40', 'JHN.13.14-15'],
  },
  {
    id: 'leadership',
    name: 'Leadership',
    description: 'Leading and shepherding with integrity',
    keywords: ['leadership', 'leader', 'lead', 'shepherd', 'oversee', 'authority'],
    verseIds: ['1TI.3.1-5', 'PRO.11.14', 'MRK.10.42-45', 'TIT.1.7-9', '1PE.5.2-3', 'HEB.13.7', 'EXO.18.21'],
  },
  {
    id: 'friendship',
    name: 'Friendship',
    description: 'Faithful friends and godly companionship',
    keywords: ['friend', 'friendship', 'companion', 'fellowship', 'brother'],
    verseIds: ['PRO.17.17', 'PRO.18.24', 'ECC.4.9-10', 'JHN.15.13', 'PRO.27.17', '1TH.5.11', 'PRO.27.9'],
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    description: 'Welcoming others with open hearts',
    keywords: ['hospitality', 'welcome', 'guest', 'stranger', 'host', 'invite'],
    verseIds: ['HEB.13.2', 'ROM.12.13', '1PE.4.9', 'LUK.14.13-14', 'ACT.2.46', '3JN.1.5-8', 'MAT.25.35'],
  },
  {
    id: 'encouragement',
    name: 'Encouragement',
    description: 'Building one another up in hope',
    keywords: ['encourage', 'encouragement', 'uplift', 'strengthen', 'edify'],
    verseIds: ['1TH.5.11', 'HEB.10.24-25', 'ROM.15.4', 'ISA.41.10', 'PRO.12.25', '2CO.1.3-4', 'PHI.2.1-2'],
  },
  {
    id: 'unity',
    name: 'Unity',
    description: 'Oneness in the body of Christ',
    keywords: ['unity', 'united', 'one', 'together', 'harmony', 'agree'],
    verseIds: ['PSA.133.1', 'EPH.4.3', '1CO.1.10', 'JHN.17.21', 'COL.3.14', 'ROM.15.5-6', 'PHI.2.2'],
  },
  {
    id: 'doubt',
    name: 'Doubt',
    description: 'Wrestling honestly with unbelief',
    keywords: ['doubt', 'unbelief', 'uncertain', 'questions', 'wavering'],
    verseIds: ['JAS.1.6', 'MRK.9.24', 'MAT.14.31', 'JHN.20.27', 'JUD.1.22', 'MAT.21.21', 'PSA.94.19'],
  },
  {
    id: 'fear',
    name: 'Fear',
    description: 'Facing fear with faith in God',
    keywords: ['fear', 'afraid', 'scared', 'terror', 'dread', 'fearful'],
    verseIds: ['ISA.41.10', '2TI.1.7', 'PSA.34.4', 'JHN.14.27', 'PSA.56.3', 'DEU.31.8', '1JN.4.18'],
  },
  {
    id: 'shame',
    name: 'Shame',
    description: 'Freedom from shame and condemnation',
    keywords: ['shame', 'ashamed', 'disgrace', 'humiliation', 'unworthy'],
    verseIds: ['ROM.10.11', 'PSA.34.5', 'ISA.61.7', 'ROM.8.1', 'PSA.25.3', '1PE.2.6', 'ISA.54.4'],
  },
  {
    id: 'spiritual-warfare',
    name: 'Spiritual Warfare',
    description: 'Standing firm against the enemy',
    keywords: ['spiritual warfare', 'battle', 'enemy', 'devil', 'armor', 'fight', 'satan'],
    verseIds: ['EPH.6.11-12', '2CO.10.4-5', '1PE.5.8-9', 'JAS.4.7', '1JN.4.4', 'ROM.8.37', 'EPH.6.13-17'],
  },
  {
    id: 'deliverance',
    name: 'Deliverance',
    description: 'God rescuing us from trouble',
    keywords: ['deliverance', 'deliver', 'rescue', 'save', 'escape', 'set free'],
    verseIds: ['PSA.34.17', '2CO.1.10', 'PSA.18.2', 'COL.1.13', 'PSA.107.6', '2TI.4.18', 'PSA.40.1-2'],
  },
  {
    id: 'protection',
    name: 'Protection',
    description: 'God as our refuge and shield',
    keywords: ['protection', 'protect', 'refuge', 'shield', 'shelter', 'safe', 'guard'],
    verseIds: ['PSA.91.1-2', 'PSA.121.7-8', 'PRO.18.10', 'ISA.41.10', 'PSA.46.1', '2TH.3.3', 'PSA.32.7'],
  },
  {
    id: 'calling',
    name: 'Calling',
    description: 'Living out God\'s purpose for your life',
    keywords: ['calling', 'called', 'purpose', 'destiny', 'vocation', 'mission'],
    verseIds: ['EPH.4.1', 'ROM.8.28-30', '2TI.1.9', '1PE.2.9', '1CO.1.26-27', 'PHI.3.14', '2PE.1.10'],
  },
  {
    id: 'provision',
    name: 'Provision',
    description: 'God supplying every need',
    keywords: ['provision', 'provide', 'needs', 'supply', 'daily bread', 'jehovah jireh'],
    verseIds: ['PHI.4.19', 'MAT.6.31-33', 'PSA.23.1', 'LUK.12.24', '2CO.9.8', 'PSA.34.10', 'GEN.22.14'],
  },
  {
    id: 'fasting',
    name: 'Fasting',
    description: 'Seeking God through self-denial',
    keywords: ['fasting', 'fast', 'abstain', 'consecrate', 'humble yourself'],
    verseIds: ['MAT.6.16-18', 'ISA.58.6-7', 'JOL.2.12', 'ACT.13.2-3', 'MAT.4.2', 'LUK.4.2', 'EZR.8.23'],
  },
  {
    id: 'meditation',
    name: 'Meditation',
    description: 'Dwelling on God\'s word and works',
    keywords: ['meditation', 'meditate', 'ponder', 'reflect', 'dwell', 'consider'],
    verseIds: ['PSA.1.2', 'JOS.1.8', 'PSA.119.15', 'PHI.4.8', 'PSA.19.14', 'PSA.143.5', 'COL.3.2'],
  },
  {
    id: 'reconciliation',
    name: 'Reconciliation',
    description: 'Restoring broken relationships',
    keywords: ['reconciliation', 'reconcile', 'restore', 'peace', 'make right', 'amends'],
    verseIds: ['2CO.5.18-19', 'MAT.5.23-24', 'ROM.5.10', 'COL.1.19-20', 'EPH.2.14-16', 'ROM.12.18', 'MAT.18.15'],
  },
  {
    id: 'repentance',
    name: 'Repentance',
    description: 'Turning from sin back to God',
    keywords: ['repentance', 'repent', 'turn', 'confess', 'contrite', 'return'],
    verseIds: ['ACT.3.19', '2CH.7.14', '1JN.1.9', 'LUK.15.7', 'ROM.2.4', '2CO.7.10', 'ACT.2.38'],
  },
  {
    id: 'baptism',
    name: 'Baptism',
    description: 'Buried and raised with Christ',
    keywords: ['baptism', 'baptize', 'baptized', 'water', 'immersion', 'new life'],
    verseIds: ['MAT.28.19', 'ROM.6.4', 'ACT.2.38', 'MRK.16.16', 'GAL.3.27', 'COL.2.12', '1PE.3.21'],
  },
  {
    id: 'communion',
    name: 'Communion',
    description: 'Remembering Christ at the Lord\'s table',
    keywords: ['communion', 'lord\'s supper', 'bread', 'cup', 'eucharist', 'remembrance'],
    verseIds: ['1CO.11.23-26', 'LUK.22.19-20', 'MAT.26.26-28', 'JHN.6.53-56', '1CO.10.16-17', 'ACT.2.42', 'MRK.14.22-24'],
  },
  {
    id: 'judgment',
    name: 'Judgment',
    description: 'God\'s just judgment of all people',
    keywords: ['judgment', 'judge', 'accountability', 'day of the lord', 'reckoning'],
    verseIds: ['2CO.5.10', 'ROM.14.10-12', 'HEB.9.27', 'REV.20.12', 'MAT.12.36', 'ECC.12.14', 'ROM.2.6'],
  },
  {
    id: 'second-coming',
    name: 'Second Coming',
    description: 'The return of Jesus in glory',
    keywords: ['second coming', 'return', 'coming', 'rapture', 'end times', 'maranatha'],
    verseIds: ['ACT.1.11', '1TH.4.16-17', 'MAT.24.30', 'REV.22.12', 'TIT.2.13', '2PE.3.10', 'MAT.24.44'],
  },
  {
    id: 'sanctification',
    name: 'Sanctification',
    description: 'Being made holy over time',
    keywords: ['sanctification', 'sanctify', 'holy', 'set apart', 'consecrated', 'grow'],
    verseIds: ['1TH.4.3', '1TH.5.23', 'HEB.10.10', 'JHN.17.17', '2TH.2.13', '1CO.6.11', 'ROM.6.22'],
  },
  {
    id: 'transformation',
    name: 'Transformation',
    description: 'Being renewed into Christ\'s likeness',
    keywords: ['transformation', 'transform', 'renew', 'change', 'new creation', 'renewed mind'],
    verseIds: ['ROM.12.2', '2CO.5.17', '2CO.3.18', 'PHI.1.6', 'EPH.4.22-24', 'COL.3.10', 'GAL.2.20'],
  },
  {
    id: 'adoption',
    name: 'Adoption',
    description: 'Becoming children of God',
    keywords: ['adoption', 'adopted', 'child of god', 'sons', 'daughters', 'abba'],
    verseIds: ['ROM.8.15', 'GAL.4.4-7', 'EPH.1.5', 'JHN.1.12', '1JN.3.1', 'ROM.8.16-17', 'GAL.3.26'],
  },
  {
    id: 'inheritance',
    name: 'Inheritance',
    description: 'Our promised inheritance in Christ',
    keywords: ['inheritance', 'inherit', 'heir', 'reward', 'promise', 'treasure'],
    verseIds: ['1PE.1.3-4', 'EPH.1.11', 'COL.3.24', 'ROM.8.17', 'HEB.9.15', 'GAL.3.29', 'PSA.16.5-6'],
  },
  {
    id: 'freedom',
    name: 'Freedom',
    description: 'Liberty found in Christ',
    keywords: ['freedom', 'free', 'liberty', 'liberate', 'no longer slave', 'released'],
    verseIds: ['JHN.8.36', 'GAL.5.1', '2CO.3.17', 'ROM.8.2', 'GAL.5.13', 'JHN.8.32', 'PSA.119.45'],
  },
  {
    id: 'victory',
    name: 'Victory',
    description: 'Overcoming through Christ',
    keywords: ['victory', 'overcome', 'conqueror', 'triumph', 'win', 'more than conquerors'],
    verseIds: ['1CO.15.57', 'ROM.8.37', '1JN.5.4', 'DEU.20.4', 'PSA.44.5', '2CO.2.14', 'REV.12.11'],
  },
  {
    id: 'promises',
    name: 'Promises of God',
    description: 'Trusting God\'s faithful promises',
    keywords: ['promises', 'promise', 'vow', 'guarantee', 'assurance', 'yes and amen'],
    verseIds: ['2CO.1.20', '2PE.1.4', 'HEB.10.23', 'JOS.21.45', 'ROM.4.20-21', '1KI.8.56', 'PSA.145.13'],
  },
  {
    id: 'covenant',
    name: 'Covenant',
    description: 'God\'s binding promises with his people',
    keywords: ['covenant', 'promise', 'agreement', 'oath', 'new covenant', 'testament'],
    verseIds: ['JER.31.33', 'HEB.8.10', 'GEN.9.13', 'LUK.22.20', 'EXO.19.5', 'HEB.13.20', 'DEU.7.9'],
  },
  {
    id: 'discipleship',
    name: 'Discipleship',
    description: 'Following and learning from Jesus',
    keywords: ['discipleship', 'disciple', 'follow', 'learn', 'take up cross', 'abide'],
    verseIds: ['LUK.9.23', 'MAT.28.19-20', 'JHN.8.31-32', 'LUK.14.27', 'JHN.13.35', 'MAT.16.24', '2TI.2.2'],
  },
  {
    id: 'spiritual-gifts',
    name: 'Spiritual Gifts',
    description: 'Serving with Spirit-given gifts',
    keywords: ['spiritual gifts', 'gifts', 'talents', 'grace gifts', 'edify', 'body'],
    verseIds: ['ROM.12.6-8', '1CO.12.4-7', '1PE.4.10-11', '1CO.12.27-31', 'EPH.4.11-13', '1CO.14.1', '1TI.4.14'],
  },
  {
    id: 'fear-of-god',
    name: 'Fear of the Lord',
    description: 'Reverence and awe before God',
    keywords: ['fear of the lord', 'fear of god', 'reverence', 'awe', 'reverent', 'wonder'],
    verseIds: ['PRO.9.10', 'PRO.1.7', 'PSA.111.10', 'ECC.12.13', 'PRO.14.27', 'DEU.10.12', 'PSA.34.9'],
  },
  {
    id: 'sovereignty',
    name: 'God\'s Sovereignty',
    description: 'God\'s rule over all things',
    keywords: ['sovereignty', 'sovereign', 'control', 'in charge', 'rules', 'providence'],
    verseIds: ['ISA.46.9-10', 'PRO.19.21', 'DAN.4.35', 'PSA.115.3', 'ROM.9.20-21', 'JOB.42.2', 'PSA.103.19'],
  },
  {
    id: 'glory',
    name: 'Glory of God',
    description: 'Living for the glory of God',
    keywords: ['glory', 'glorify', 'majesty', 'splendor', 'honor', 'praise'],
    verseIds: ['PSA.19.1', 'ISA.6.3', 'ROM.11.36', '1CO.10.31', '2CO.4.17', 'REV.4.11', 'PSA.115.1'],
  },
  {
    id: 'light',
    name: 'Light',
    description: 'Christ as light and walking in it',
    keywords: ['light', 'lamp', 'shine', 'darkness', 'illuminate', 'bright'],
    verseIds: ['JHN.8.12', 'MAT.5.14-16', '1JN.1.5', 'PSA.119.105', 'ISA.9.2', 'JHN.1.5', 'EPH.5.8'],
  },
  {
    id: 'angels',
    name: 'Angels',
    description: 'God\'s messengers and ministering spirits',
    keywords: ['angels', 'angel', 'messenger', 'heavenly host', 'guardian', 'seraphim'],
    verseIds: ['PSA.91.11', 'HEB.1.14', 'HEB.13.2', 'LUK.2.13-14', 'MAT.18.10', 'PSA.103.20', 'DAN.6.22'],
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
    topicIds: [
      'love',
      'faith',
      'hope',
      'peace',
      'joy',
      'grace',
      'salvation',
      'prayer',
      'worship',
      'truth',
      'creation',
      'evangelism',
      'scripture',
      'heaven',
      'eternal-life',
      'redemption',
      'blessing',
    ],
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
      'courage',
      'holiness',
      'contentment',
      'trust',
      'self-control',
      'gentleness',
      'faithfulness',
      'goodness',
      'discipline',
      'service',
      'leadership',
      'friendship',
      'hospitality',
      'encouragement',
      'unity',
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
      'suffering',
      'comfort',
      'doubt',
      'fear',
      'shame',
      'spiritual-warfare',
      'deliverance',
      'protection',
    ],
  },
  {
    id: 'gospel',
    name: 'Gospel & Growth',
    description: 'The good news and growing in Christ',
    topicIds: [
      'jesus',
      'holy-spirit',
      'resurrection',
      'repentance',
      'baptism',
      'communion',
      'judgment',
      'second-coming',
      'sanctification',
      'transformation',
      'adoption',
      'inheritance',
      'freedom',
      'victory',
      'promises',
      'covenant',
      'discipleship',
      'spiritual-gifts',
    ],
  },
  {
    id: 'god',
    name: 'Knowing God',
    description: 'The character and majesty of God',
    topicIds: ['fear-of-god', 'sovereignty', 'glory', 'light', 'angels'],
  },
  {
    id: 'life',
    name: 'Daily Life',
    description: 'God\'s word for relationships and calling',
    topicIds: [
      'marriage',
      'parenting',
      'money',
      'work',
      'community',
      'rest',
      'calling',
      'provision',
      'fasting',
      'meditation',
      'reconciliation',
    ],
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
    else if (topic.name.toLowerCase().startsWith(normalized)) score += 8
    else if (normalized.length >= 2 && topic.name.toLowerCase().split(/\s+/).some((w) => w.startsWith(normalized))) score += 7
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
