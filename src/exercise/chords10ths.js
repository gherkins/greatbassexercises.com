const chords10ths = {
  category: 'Chords',
  title: 'G major 10th chords',
  description: `Nice 10th chord-exercise to play over the G major scale.`,
  bars: [],
}

const scale = ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
const notes = []
for (let i = 3; i <= 6; i++) {
  scale.forEach(tone => {
    notes.push(`${tone}${i}`)
  })
}

const chords = [
  [
    {
      string: 1,
      fret: 3,
    },
    {
      string: 4,
      fret: 4,
    },
  ],

  [
    {
      string: 1,
      fret: 5,
    },
    {
      string: 4,
      fret: 5,
    },
  ],

  [
    {
      string: 1,
      fret: 7,
    },
    {
      string: 4,
      fret: 7,
    },
  ],

  [
    {
      string: 1,
      fret: 8,
    },
    {
      string: 4,
      fret: 9,
    },
  ],

  [
    {
      string: 1,
      fret: 10,
    },
    {
      string: 4,
      fret: 11,
    },
  ],

  [
    {
      string: 1,
      fret: 12,
    },
    {
      string: 4,
      fret: 12,
    },
  ],

  [
    {
      string: 1,
      fret: 14,
    },
    {
      string: 4,
      fret: 14,
    },
  ],

  [
    {
      string: 1,
      fret: 15,
    },
    {
      string: 4,
      fret: 16,
    },
  ],
]

chords.forEach((chord, index) => {
  const bar = {
    chord: [
      notes[index],
      notes[index + 9],
      notes[index + 11],
      notes[index + 13],
    ],
    ticks: [chord, chord, chord, chord],
  }

  chords10ths.bars.push(bar)

})

export default chords10ths
