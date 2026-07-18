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
        reflectionQuestions: [
          'Where have you seen sacrificial love in your own life?',
          'How does Scripture redefine love beyond sentiment?',
        ],
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
  {
    id: 'invictus-poem',
    title: 'Invictus',
    type: 'book',
    creator: 'William Ernest Henley (1875)',
    summary:
      'A defiant poem about the unconquerable human spirit in the face of suffering — often read alongside questions of sovereignty and grace.',
    parallels: [
      {
        id: 'invictus-strength',
        theme: 'Strength',
        mediaLine: {
          text: 'I am the master of my fate, I am the captain of my soul.',
          attribution: 'Final lines',
        },
        verseIds: ['PHI.4.13', 'ISA.40.31', '2CO.12.9-10'],
        connection:
          'Henley\'s self-reliance contrasts with Paul\'s boast in Christ — strength perfected in weakness, not self-mastery alone.',
        reflectionQuestions: [
          'Where is human resilience admirable, and where does it fall short without God?',
          'How does Isaiah 40 redefine the "captain" of the soul?',
        ],
      },
    ],
  },
  {
    id: 'lotr-fellowship',
    title: 'The Lord of the Rings',
    type: 'book',
    creator: 'J.R.R. Tolkien',
    summary:
      'A fellowship carries an impossible burden to destroy evil — themes of friendship, sacrifice, and hope against darkness.',
    parallels: [
      {
        id: 'lotr-fellowship',
        theme: 'Friendship',
        mediaLine: {
          text: 'I can\'t carry it for you, but I can carry you.',
          attribution: 'Sam to Frodo on Mount Doom (film)',
        },
        verseIds: ['ECC.4.9-10', 'PRO.17.17', 'JHN.15.13'],
        connection:
          'Sam\'s loyalty pictures the friend who sticks closer than a brother — bearing burdens together as the body of Christ.',
        reflectionQuestions: [
          'Who has carried you in a season of weakness?',
          'How can you "carry" someone else this week?',
        ],
      },
      {
        id: 'lotr-hope',
        theme: 'Hope',
        mediaLine: {
          text: 'There is some good in this world, Mr. Frodo, and it\'s worth fighting for.',
          attribution: 'Samwise Gamgee',
        },
        verseIds: ['ROM.15.13', 'LAM.3.21-23', 'HEB.6.19'],
        connection:
          'Sam\'s stubborn hope in darkness mirrors the anchor of the soul — confident expectation when circumstances say otherwise.',
      },
    ],
    cautions: ['Fantasy fiction; film quotes used where widely known.'],
  },
  {
    id: 'i-have-a-dream',
    title: 'I Have a Dream',
    type: 'book',
    creator: 'Martin Luther King Jr. (1963)',
    summary:
      'A landmark speech invoking prophetic justice, freedom, and the moral arc of the universe.',
    parallels: [
      {
        id: 'dream-justice',
        theme: 'Justice',
        mediaLine: {
          text: 'We will not be satisfied until justice rolls down like waters, and righteousness like a mighty stream.',
          attribution: 'March on Washington',
        },
        verseIds: ['AMO.5.24', 'MIC.6.8', 'ISA.1.17'],
        connection:
          'King directly quotes Amos — Scripture\'s call for justice becomes the heartbeat of civil-rights hope.',
        reflectionQuestions: [
          'What does "doing justice" look like in your community today?',
          'How does Micah 6:8 connect worship and justice?',
        ],
      },
    ],
  },
  {
    id: 'pilgrims-progress',
    title: "The Pilgrim's Progress",
    type: 'book',
    creator: 'John Bunyan (1678)',
    summary:
      'Christian flees the City of Destruction, bearing a burden of sin, and journeys toward the Celestial City through trial and grace.',
    parallels: [
      {
        id: 'pp-burden',
        theme: 'Salvation',
        mediaLine: {
          text: 'He ran thus till he came at a place somewhat ascending, and upon that place stood a cross... his burden loosed from off his shoulders.',
          attribution: 'Christian at the cross',
        },
        verseIds: ['MAT.11.28-30', 'PSA.55.22', '1PE.2.24'],
        connection:
          'Bunyan\'s burden falling at the cross pictures Christ bearing our sins — rest for the weary and freedom from what we cannot carry alone.',
      },
      {
        id: 'pp-perseverance',
        theme: 'Endurance',
        mediaLine: {
          text: 'The hill, though high, I covet to ascend; the difficulty will not me offend.',
          attribution: 'Christian approaching Hill Difficulty',
        },
        verseIds: ['HEB.12.1-2', 'JAS.1.2-4', 'ROM.5.3-4'],
        connection:
          'The climb toward holiness is hard but purposeful — Scripture calls believers to run with endurance, looking to Jesus.',
      },
    ],
  },
  {
    id: 'screwtape',
    title: 'The Screwtape Letters',
    type: 'book',
    creator: 'C.S. Lewis (1942)',
    summary:
      'A senior demon coaches a junior tempter on distracting a human soul from God — satire that exposes spiritual warfare and grace.',
    parallels: [
      {
        id: 'screwtape-warfare',
        theme: 'Spiritual Warfare',
        mediaLine: {
          text: 'Indeed the safest road to Hell is the gradual one — the gentle slope, soft underfoot, without sudden turnings.',
          attribution: 'Screwtape',
        },
        verseIds: ['1PE.5.8', 'EPH.6.11-12', '2CO.2.11'],
        connection:
          'Lewis dramatizes the enemy\'s subtlety — Scripture warns believers to stay alert, armored against schemes that feel ordinary.',
      },
      {
        id: 'screwtape-love',
        theme: 'Love',
        mediaLine: {
          text: 'He really does want to fill the universe with a lot of loathsome little replicas of Himself.',
          attribution: 'Screwtape on God\'s love',
        },
        verseIds: ['1JN.4.7-10', 'JHN.3.16', 'ROM.5.8'],
        connection:
          'Even the demons must admit God\'s self-giving love — the gospel center Screwtape cannot comprehend or defeat.',
      },
    ],
    cautions: ['Satirical demonic POV; read as allegory, not doctrine from demons.'],
  },
  {
    id: 'prince-of-egypt',
    title: 'The Prince of Egypt',
    type: 'movie',
    creator: 'DreamWorks (1998)',
    summary:
      'Moses discovers his identity, confronts Pharaoh, and leads Israel out of bondage — the Exodus told with cinematic awe.',
    parallels: [
      {
        id: 'poe-deliverance',
        theme: 'Freedom',
        mediaLine: {
          text: 'I have come down to rescue them from the hand of the Egyptians.',
          attribution: 'God speaking from the burning bush (film paraphrase of Exodus)',
        },
        verseIds: ['EXO.3.7-8', 'EXO.14.13-14', 'JHN.8.36'],
        connection:
          'The film retells God\'s rescue of the oppressed — Scripture\'s pattern of deliverance fulfilled ultimately in Christ setting people free.',
      },
      {
        id: 'poe-calling',
        theme: 'Purpose & Calling',
        mediaLine: {
          text: 'Who am I to lead these people?',
          attribution: 'Moses',
        },
        verseIds: ['EXO.3.11', 'EXO.4.10-12', '2CO.3.5'],
        connection:
          'Moses\' inadequacy meets God\'s sufficiency — calling rests on who sends, not on self-confidence.',
      },
    ],
  },
  {
    id: 'its-a-wonderful-life',
    title: "It's a Wonderful Life",
    type: 'movie',
    creator: 'Frank Capra (1946)',
    summary:
      'George Bailey despairs that his life meant nothing — until he sees how one faithful presence shapes a whole town.',
    parallels: [
      {
        id: 'iawl-worth',
        theme: 'Hope',
        mediaLine: {
          text: 'Strange, isn\'t it? Each man\'s life touches so many other lives.',
          attribution: 'Clarence the angel',
        },
        verseIds: ['MAT.5.14-16', '1CO.12.26', 'HEB.6.10'],
        connection:
          'Hidden faithfulness still lights the world — God remembers labor done in love even when we cannot see its fruit.',
      },
      {
        id: 'iawl-community',
        theme: 'Friendship',
        mediaLine: {
          text: 'No man is a failure who has friends.',
          attribution: 'Inscription in the book from Clarence',
        },
        verseIds: ['ECC.4.9-10', 'PRO.18.24', 'GAL.6.2'],
        connection:
          'Community bears burdens and restores hope — friendship as the film\'s answer echoes Scripture\'s call to carry one another.',
      },
    ],
  },
  {
    id: 'hacksaw-ridge',
    title: 'Hacksaw Ridge',
    type: 'movie',
    creator: 'Mel Gibson (2016)',
    summary:
      'Desmond Doss, a combat medic who refuses to carry a weapon, risks everything to save the wounded on Okinawa.',
    parallels: [
      {
        id: 'hr-conviction',
        theme: 'Obedience',
        mediaLine: {
          text: 'I can\'t hear God while I\'m looking at a gun.',
          attribution: 'Desmond Doss',
        },
        verseIds: ['ACT.5.29', 'ROM.14.5', 'JAS.1.22'],
        connection:
          'Costly conscience before God over human pressure — Doss\'s stand mirrors biblical obedience when conviction and culture collide.',
      },
      {
        id: 'hr-sacrifice',
        theme: 'Sacrifice',
        mediaLine: {
          text: 'Please Lord, help me get one more.',
          attribution: 'Doss praying while rescuing the wounded',
        },
        verseIds: ['JHN.15.13', 'MAT.25.40', 'PHP.2.3-4'],
        connection:
          'Love that lays down safety for others images Christ\'s greater sacrifice and the call to count others above ourselves.',
      },
    ],
  },
  {
    id: 'the-chosen',
    title: 'The Chosen',
    type: 'tv',
    creator: 'Dallas Jenkins (2019–)',
    summary:
      'A multi-season drama following Jesus and his disciples — mercy, calling, and ordinary lives interrupted by the Messiah.',
    parallels: [
      {
        id: 'chosen-follow',
        theme: 'Discipleship',
        mediaLine: {
          text: 'Get used to different.',
          attribution: 'Jesus to Simon (paraphrased series theme)',
        },
        verseIds: ['MAT.4.19', 'LUK.9.23', '2CO.5.17'],
        connection:
          'Following Jesus upends expectations — discipleship means a new way of seeing people, purpose, and power.',
      },
      {
        id: 'chosen-mercy',
        theme: 'Mercy & Forgiveness',
        mediaLine: {
          text: 'I am the Law of Moses.',
          attribution: 'Jesus to Mary Magdalene (season 1)',
        },
        verseIds: ['JHN.8.10-11', 'MIC.7.18-19', 'LUK.5.31-32'],
        connection:
          'Christ meets shame with restoration — the series dramatizes the gospel welcome Scripture describes for sinners who turn to him.',
      },
    ],
    cautions: ['Dramatic interpolation around the Gospels; always weigh scenes against Scripture itself.'],
  },
  {
    id: 'the-bible-miniseries',
    title: 'The Bible',
    type: 'tv',
    creator: 'History Channel (2013)',
    summary:
      'A dramatized journey from Genesis to Revelation — creation, covenant, exile, and the life of Christ retold for screen.',
    parallels: [
      {
        id: 'bible-tv-promise',
        theme: 'Faith',
        mediaLine: {
          text: 'I will make you into a great nation… and all peoples on earth will be blessed through you.',
          attribution: 'God\'s promise to Abraham (series dramatization)',
        },
        verseIds: ['GEN.12.2-3', 'GAL.3.8', 'HEB.11.8'],
        connection:
          'Abraham\'s call launches the story of blessing for the nations — fulfilled in Christ and retold across the series arcs.',
      },
      {
        id: 'bible-tv-cross',
        theme: 'Sacrifice',
        mediaLine: {
          text: 'It is finished.',
          attribution: 'Jesus on the cross',
        },
        verseIds: ['JHN.19.30', 'ISA.53.5', '1CO.15.3-4'],
        connection:
          'The climax of Scripture\'s story is the finished work of the cross — atonement and resurrection hope.',
      },
    ],
    cautions: ['Compressed timelines and dramatization; use as a doorway back into the biblical text.'],
  },
  {
    id: 'ted-lasso',
    title: 'Ted Lasso',
    type: 'tv',
    creator: 'Apple TV+ (2020–2023)',
    summary:
      'An optimistic American coach wins over a skeptical English football club through kindness, honesty, and second chances.',
    parallels: [
      {
        id: 'lasso-kindness',
        theme: 'Love',
        mediaLine: {
          text: 'Be curious, not judgmental.',
          attribution: 'Ted Lasso (quoting a Walt Whitman anecdote)',
        },
        verseIds: ['JAS.1.19', '1CO.13.4-7', 'MIC.6.8'],
        connection:
          'Curiosity that refuses quick condemnation resembles patient love — slow to speak, eager to understand.',
      },
      {
        id: 'lasso-believe',
        theme: 'Hope',
        mediaLine: {
          text: 'I believe in believe.',
          attribution: 'Ted\'s BELIEVE sign',
        },
        verseIds: ['ROM.15.13', 'HEB.11.1', '1TH.5.11'],
        connection:
          'The show\'s stubborn hope in people mirrors (imperfectly) biblical encouragement — building others up when despair feels easier.',
      },
    ],
    cautions: ['Secular workplace comedy with adult themes; extract the moral wheat carefully.'],
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
  tv: 'TV',
}

/** Default featured Stories (books/movies/TV only — songs live in Lyrics). */
export const FEATURED_STORY_IDS = [
  'shawshank',
  'les-miserables',
  'narnia',
  'star-wars',
  'the-chosen',
  'prince-of-egypt',
] as const

export const SEARCH_EXAMPLES: Record<'book' | 'movie' | 'tv', string[]> = {
  book: ['Screwtape', 'Pilgrim', 'Narnia'],
  movie: ['Shawshank', 'Prince of Egypt', 'Wonderful Life'],
  tv: ['The Chosen', 'Ted Lasso', 'The Bible'],
}

export const STORIES_COMPARE_STEPS = [
  { step: 1, label: 'Choose a section', detail: 'Browse Books, Movies, or TV' },
  { step: 2, label: 'Search or pick', detail: 'Find a title or open a curated story' },
  { step: 3, label: 'Reflect', detail: 'Jump between themes, share, or explore subjects deeper' },
] as const

export function getSeasonalFeaturedStoryIds(date: Date = new Date()): string[] {
  const month = date.getMonth() // 0–11
  // Advent / Christmas
  if (month === 11 || month === 0) {
    return ['its-a-wonderful-life', 'narnia', 'the-chosen', 'prince-of-egypt', 'les-miserables']
  }
  // Lent / Easter window (approx Feb–Apr)
  if (month >= 1 && month <= 3) {
    return ['the-chosen', 'the-bible-miniseries', 'pilgrims-progress', 'hacksaw-ridge', 'shawshank']
  }
  return [...FEATURED_STORY_IDS]
}

export function getFeaturedStories(type?: MediaType, date?: Date): MediaComparison[] {
  const featured = getSeasonalFeaturedStoryIds(date)
    .map((id) => getMediaComparison(id))
    .filter((item): item is MediaComparison => item !== undefined)
  return type ? featured.filter((item) => item.type === type) : featured
}

export function searchCuratedComparisons(
  query: string,
  type?: MediaType,
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
