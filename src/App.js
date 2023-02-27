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

  const [currentExercise, setCurrentExercise] = useState(tarantula)
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
        nextNote = 0
      }
      bar = nextBar
    }
    note = nextNote
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

        const isCurrent = currentNote.string === string && currentNote.fret === fret

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
    if (isPlaying) {
      bar = 0
      note = 0
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
        <div className="col col-md-7">
          <input className="form-range"
                 type="range"
                 min={40}
                 max={200}
                 value={bpm}
                 onChange={e => {setTempo(e.target.value)}}
          />
        </div>
        <div className="col col-md-3">
          <label className="form-label">{bpm} BPM</label>
        </div>

      </div>

      <div className="row mb-5">
        <div className="col">
          <pre style={{ textAlign: 'left', marginLeft: 40 }} className="mb-0">
              {romanNumerals[getLowestFretInCurrentBar() - 1]}
          </pre>
          <pre style={{ fontSize: '1.7rem', lineHeight: 1.25 }}>
            {getAsciiDiagram()}
          </pre>
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
