import React from 'react'

import './Fretboard.scss'

function Fretboard (props) {

  const isDottedFret = (string, fret) => {
    if (isActiveFret(string, fret)) {
      return false
    }

    let contains = false
    props.currentExercise.bars[props.bar].notes.forEach(note => {
      if (note.fret === fret && note.string === string) {
        contains = true
      }
    })
    return contains
  }

  const isActiveFret = (string, fret) => {
    return props.playing && props.currentNote.string === string && props.currentNote.fret === fret
  }

  const getLowestFretInCurrentBar = () => {
    let lowestFret = 100
    props.currentExercise.bars[props.bar].notes.forEach(note => {
      if (note.fret < lowestFret) {
        lowestFret = note.fret
      }
    })
    return lowestFret
  }

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII']

  const minFret = getLowestFretInCurrentBar()
  const maxFret = minFret + 5

  const strings = [4, 3, 2, 1]
  const frets = []
  for (let fret = minFret; fret <= maxFret; fret++) {
    frets.push(fret)
  }

  return <table className="table fretboard">
    {strings.map(string => <tr className="string" key={string}>
      {frets.map(fret => <td className="fret" key={fret}>
        {string === 4 && fret === minFret && <span className="fretnumber">
          {romanNumerals[minFret - 1]}
        </span>}
        {isDottedFret(string, fret) && <span className="dot"></span>}
        {isActiveFret(string, fret) && <span className="dot active"></span>}
      </td>)}
    </tr>)}

  </table>
}

export default Fretboard