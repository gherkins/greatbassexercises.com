import React from 'react'

import './Fretboard.scss'

function Fretboard (props) {

  const isDottedFret = (string, fret) => {
    if (isActiveFret(string, fret)) {
      return false
    }

    let contains = false
    props.currentExercise.bars[props.bar].ticks.forEach(tick => {
      tick.forEach(note => {
        if (note.fret === fret && note.string === string) {
          contains = true
        }
      })
    })
    return contains
  }

  const isActiveFret = (string, fret) => {
    if (!props.playing) {
      return false
    }
    return props.currentTick.find(note => note.string === string && note.fret === fret) !== undefined
  }

  const getFinger = (string, fret) => {
    return props.currentTick.find(note => note.string === string && note.fret === fret).finger || ''
  }

  const getLowestFretForBar = bar => {
    let lowestFret = 100
    props.currentExercise.bars[bar].ticks.forEach(tick => {
      tick.forEach(note => {
        if (note.fret < lowestFret) {
          lowestFret = note.fret
        }
      })
    })
    return lowestFret
  }

  const getHighestFretForBar = bar => {
    let highestFret = 0
    props.currentExercise.bars[bar].ticks.forEach(tick => {
      tick.forEach(note => {
        if (note.fret > highestFret) {
          highestFret = note.fret
        }
      })
    })
    return highestFret
  }

  const getLowestFretForCurrentBar = () => {
    let lowestFret = getLowestFretForBar(props.bar)
    const highestFret = getHighestFretForBar(props.bar)

    for (let bar = props.bar; bar < props.currentExercise.bars.length; bar++) {
      const lowestFretCandidate = getLowestFretForBar(bar)
      if (lowestFretCandidate < lowestFret) {
        const highestFretCandidate = lowestFretCandidate + 5
        if (highestFretCandidate >= highestFret) {
          lowestFret = lowestFretCandidate
        }
      }
    }
    return lowestFret
  }

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII']

  const minFret = getLowestFretForCurrentBar()
  const maxFret = minFret + 5

  const strings = [4, 3, 2, 1]
  const frets = []
  for (let fret = minFret; fret <= maxFret; fret++) {
    frets.push(fret)
  }

  return <table className="table fretboard">
    <tbody>
      {strings.map(string => <tr className="string" key={`s-${string}`}>
        {frets.map(fret => <td className="fret" key={`s-${string}-f-${fret}`}>
          {string === 4 && fret === minFret && <span className="fretnumber">
          {romanNumerals[minFret - 1]}
        </span>}
          {isDottedFret(string, fret) && <span className="dot"></span>}
          {isActiveFret(string, fret) && <span className="dot active">{getFinger(string, fret)}</span>}
        </td>)}
      </tr>)}
    </tbody>
  </table>
}

export default Fretboard