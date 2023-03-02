const theClamp = {
  category: 'Yoga',
  title: `The Clamp`,
  description: `"All fingers stay in place - all the time.\nPractice at your own risk.`,
  bars: [],
}

const previousFingerPositions = []

const bar1 = {
  chord: [],
  ticks: [],
}

for (let string = 1; string <= 4; string++) {
  for (let finger = 1; finger <= 4; finger++) {
    const tick = {
      string,
      fret: finger + 4,
      finger,
    }

    previousFingerPositions[finger - 1] = tick

    if (previousFingerPositions.length >= 4) {
      bar1.ticks.push([
        tick, ...previousFingerPositions,
      ])
    }

  }
}
theClamp.bars.push(bar1)

const bar2 = {
  chord: [],
  ticks: [],
}

bar2.ticks.push([
  ...previousFingerPositions,
])

for (let string = 3; string >= 1; string--) {
  for (let finger = 1; finger <= 4; finger++) {

    const tick = {
      string,
      fret: finger + 4,
      finger,
    }

    previousFingerPositions[finger - 1] = tick

    bar2.ticks.push([
      tick, ...previousFingerPositions,
    ])
  }
}
theClamp.bars.push(bar2)

export default theClamp
