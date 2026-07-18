export interface FeaturedSong {
  artist: string
  title: string
  theme?: string
}

export const FEATURED_SONGS: FeaturedSong[] = [
  { artist: 'Leonard Cohen', title: 'Hallelujah', theme: 'Praise' },
  { artist: 'Lauren Daigle', title: 'You Say', theme: 'Identity' },
  { artist: 'MercyMe', title: 'I Can Only Imagine', theme: 'Hope' },
  { artist: 'Hillsong UNITED', title: 'Oceans (Where Feet May Fail)', theme: 'Faith' },
  { artist: 'Carrie Underwood', title: 'Jesus, Take the Wheel', theme: 'Trust' },
  { artist: 'John Newton', title: 'Amazing Grace', theme: 'Grace' },
  { artist: 'Matt Redman', title: '10,000 Reasons (Bless the Lord)', theme: 'Worship' },
  { artist: 'Hillsong Worship', title: 'What a Beautiful Name', theme: 'Jesus' },
  { artist: 'Cory Asbury', title: 'Reckless Love', theme: 'Love' },
  { artist: 'Chris Tomlin', title: 'Good Good Father', theme: 'Identity' },
  { artist: 'Traditional', title: 'How Great Thou Art', theme: 'Praise' },
  { artist: 'Elevation Worship', title: 'Do It Again', theme: 'Faith' },
]

export const LYRICS_COMPARE_STEPS = [
  { step: 1, label: 'Search', detail: 'Find a song on Spotify or enter artist & title' },
  { step: 2, label: 'Lyrics', detail: 'We pull lyrics from LRCLIB by artist and track name' },
  { step: 3, label: 'Scripture', detail: 'Themes in the lyrics are matched to curated NIV passages' },
] as const
