import React, { useEffect, useState } from 'react'
import './App.css'
import * as Tone from 'tone'
import PianoMp3 from 'tonejs-instrument-piano-mp3'
import metronomeSound from './metronome.wav'

import tarantula from './exercise/tarantula'

let bar = 0
let note = 0
let firstNote = true
let piano

function App () {

  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)

  const [, updateState] = useState()

  const [currentExercise, setCurrentExercise] = useState(tarantula)

  const [activeBars] = useState(currentExercise.bars.map((bar, index) => index))

  const isActiveBar = (index) => {
    return activeBars.includes(index)
  }

  const toggleActiveBar = (index) => {
    if (isActiveBar(index)) {
      if (activeBars.length === 1) {
        return false
      }
      activeBars.splice(activeBars.indexOf(index), 1)
    } else {
      activeBars.push(index)
    }
    setTimeout(() => {
      updateState({})
    })

  }

  const [currentNote, setCurrentNote] = useState(currentExercise.bars[bar].notes[note])

  const romanNumerals = ['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ', 'Ⅺ', 'Ⅻ']

  const advance = () => {
    const currentBar = currentExercise.bars[bar]
    let nextNote = note + 1
    if (!currentBar.notes[nextNote]) {
      nextNote = 0
      let nextBar = bar + 1
      if (!currentExercise.bars[nextBar]) {
        nextBar = 0
      }
      while (!isActiveBar(nextBar)) {
        nextBar = nextBar + 1
        if (!currentExercise.bars[nextBar]) {
          nextBar = 0
        }
      }
      bar = nextBar
    }
    note = nextNote
  }

  const getNextBar = () => {
  }

  const currentBarContainsDot = (string, fret) => {
    let contains = false
    currentExercise.bars[bar].notes.forEach(note => {
      if (note.fret === fret && note.string === string) {
        contains = true
      }
    })
    return contains
  }

  const getLowestFretInCurrentBar = () => {
    let lowestFret = 100
    currentExercise.bars[bar].notes.forEach(note => {
      if (note.fret < lowestFret) {
        lowestFret = note.fret
      }
    })
    return lowestFret
  }

  const getHighestFretInCurrentBar = () => {
    let highestFret = 0
    currentExercise.bars[bar].notes.forEach(note => {
      if (note.fret > highestFret) {
        highestFret = note.fret
      }
    })
    return highestFret
  }

  const getAsciiDiagram = () => {

    const minFret = getLowestFretInCurrentBar()
    const maxFret = minFret + 5

    let ascii = ''
    for (let string = 4; string >= 1; string--) {
      switch (string) {
        case 4:
          ascii += '┌'
          break
        case 1:
          ascii += '└'
          break
        default:
          ascii += '├'
      }
      for (let fret = minFret; fret <= maxFret; fret++) {

        const isCurrent = playing && currentNote.string === string && currentNote.fret === fret

        ascii += '─'
        ascii += currentBarContainsDot(string, fret) ? isCurrent ? '●' : '○' : '─'
        ascii += '─'
        if (fret === maxFret) {
          switch (string) {
            case 4:
              ascii += '┐\n'
              break
            case 1:
              ascii += '┘'
              break
            default:
              ascii += '┤\n'
          }
        } else {
          switch (string) {
            case 4:
              ascii += '┬'
              break
            case 1:
              ascii += '┴'
              break
            default:
              ascii += '┼'
          }
        }

      }
    }
    return ascii
  }

  const showNote = () => {
    setCurrentNote(currentExercise.bars[bar].notes[note])
  }

  const startStop = () => {
    const isPlaying = !playing
    Tone.Transport[isPlaying ? 'start' : 'stop']()
    setPlaying(isPlaying)
    note = 0
    if (isPlaying) {
      firstNote = true
    }
    showNote()
  }

  const setTempo = bpm => {
    bpm = parseInt(bpm)
    setBpm(bpm)
    Tone.Transport.bpm.value = bpm
  }

  const playChord = time => {
    piano.releaseAll()
    currentExercise.bars[bar].chord.forEach((note, index) => {
      piano.triggerAttack(note, time)
    })
  }

  useEffect(() => {
    piano = new PianoMp3().toDestination()
    const metro = new Tone.Player(metronomeSound).toDestination()

    Tone.Transport.scheduleRepeat((time) => {
      if (!firstNote) {
        advance()
      }
      firstNote = false
      showNote()
      if (note === 0) {
        playChord(time)
      }
      metro.start(time)
    }, '4n')
  }, [])

  return (
    <div className="container mt-3" style={{ maxWidth: 440 }}>
      <div className="row mb-4">
        <div className="col">
          <h1>GreatBass<br />Exercises.com</h1>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col">
          <select className="form-select">
            <option value="tarantula">Dan Lopatka’s Tarantula Exercise in C-minor</option>
          </select>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col col-md-2">

          <button onClick={startStop} className={`btn btn-primary`}>
            {playing ? 'STOP' : 'PLAY'}
          </button>

        </div>
        <div className="col col-md-7 pt-2">
          <input className="form-range"
                 type="range"
                 min={40}
                 max={200}
                 value={bpm}
                 onChange={e => {setTempo(e.target.value)}}
          />
        </div>
        <div className="col col-md-3 pt-2">
          <label className="form-label">{bpm} BPM</label>
        </div>

      </div>

      <div className="row">
        <div className="col">
          <pre style={{ textAlign: 'left', marginLeft: 40 }} className="mb-0">
              {romanNumerals[getLowestFretInCurrentBar() - 1]}
          </pre>
          <pre style={{ fontSize: '1.7rem', lineHeight: 1.25 }} className="mb-0">
            {getAsciiDiagram()}
          </pre>
        </div>
      </div>

      <div className="row ">
        <div className="col text-center text-muted">
          {currentExercise.bars.map((dot, index) =>
            <span className={`d-inline-block me-3 ${bar === index ? 'text-primary' : ''}`} key={index} onClick={() => {
              if(playing) {
                return
              }
              bar = index
              note = 0
              updateState({})
            }}>
              ●
            </span>,
          )}
        </div>
      </div>
      <div className="row mb-5">
        <div className="col text-center text-muted">
          {currentExercise.bars.map((dot, index) =>
            <span className={`d-inline-block me-3`} key={index}>
              <input type="checkbox" checked={isActiveBar(index)} onChange={() => {toggleActiveBar(index)}} />
            </span>,
          )}
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h6>
            {currentExercise.title}
          </h6>
          <p>
            <small>
              {currentExercise.description}
            </small>
          </p>
        </div>
      </div>

    </div>
  )
}

export default App
