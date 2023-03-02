const cMajorFourths = {
  category: 'Basic',
  title: 'C major scale fourths',
  description: 'Simple exercise to get used to playing the C major scale in fourths',
  bars: [],
}

const scale = [
  {
    string: 1,
    fret: 8,
  },
  {
    string: 1,
    fret: 10,
  },
  {
    string: 2,
    fret: 7,
  },
  {
    string: 2,
    fret: 8,
  },
  {
    string: 2,
    fret: 10,
  },
  {
    string: 3,
    fret: 7,
  },
  {
    string: 3,
    fret: 9,
  },
  {
    string: 3,
    fret: 10,
  },
  {
    string: 4,
    fret: 7,
  },
  {
    string: 4,
    fret: 9,
  },
  {
    string: 4,
    fret: 10,
  },
  {
    string: 4,
    fret: 12,
  },
]

const bar = {
  chord: [
    'C3',
    'E4',
    'G4',
    'B#4',
  ],
  ticks: [],
}

for (let i = 0; i <= 7; i++) {
  bar.ticks.push([
    scale[i],
  ])
  bar.ticks.push([
    scale[i + 3],
  ])
}

cMajorFourths.bars.push(bar)

const bar2 = {
  chord: [
    'C3',
    'E4',
    'G4',
    'B#4',
  ],
  ticks: [],
}

for (let i = 10; i >= 3; i--) {
  bar2.ticks.push([
    scale[i],
  ])
  bar2.ticks.push([
    scale[i - 3],
  ])
}

cMajorFourths.bars.push(bar2)

export default cMajorFourths
