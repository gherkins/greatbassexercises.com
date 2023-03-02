const dMinorThirds = {
  category: 'Basic',
  title: 'D minor scale thirds',
  description: 'Simple exercise to get used to playing the D minor scale in thirds',
  bars: [],
}

const scale = [
  {
    string: 2,
    fret: 5,
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
    string: 3,
    fret: 5,
  },
  {
    string: 3,
    fret: 7,
  },
  {
    string: 3,
    fret: 8,
  },
  {
    string: 4,
    fret: 5,
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
]

const bar = {
  chord: [
    'D3',
    'F4',
    'A4',
    'C5',
  ],
  ticks: [],
}

for (let i = 0; i <= 7; i++) {
  bar.ticks.push([
    scale[i],
  ])
  bar.ticks.push([
    scale[i + 2],
  ])
}

dMinorThirds.bars.push(bar)


const bar2 = {
  chord: [
    'D3',
    'F4',
    'A4',
    'C5',
  ],
  ticks: [],
}

for (let i = 9; i >= 2; i--) {
  bar2.ticks.push([
    scale[i],
  ])
  bar2.ticks.push([
    scale[i -2],
  ])
}

dMinorThirds.bars.push(bar2)

export default dMinorThirds
