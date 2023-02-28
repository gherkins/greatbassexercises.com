import React, { useEffect, useState } from 'react'
import * as Tone from 'tone'
import PianoMp3 from 'tonejs-instrument-piano-mp3'
import metronomeSound from './audio/metronome.wav'
import tarantula from './exercise/tarantula'
import Fretboard from './Fretboard'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'

let initialized = false
let bar = 0
let note = 0
let firstNote = true
let piano, metro

function App () {

  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)

  const [, updateState] = useState()

  const [currentExercise] = useState(tarantula)

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

  const showNote = () => {
    setCurrentNote(currentExercise.bars[bar].notes[note])
  }

  const startStop = () => {
    init()
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

  const init = () => {
    if (initialized) {
      return false
    }
    Tone.start()

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
    initialized = true
  }

  useEffect(() => {
    piano = new PianoMp3().toDestination()
    metro = new Tone.Player(metronomeSound).toDestination()
  }, [])

  return (
    <div className="container mt-3">
      <div className="row mb-4">
        <div className="col">
          <h1>
            Great<br />
            Bass<br />
            Exercises.com
          </h1>
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

      <div className="row mb-3">
        <div className="col">
          <Fretboard
            currentExercise={currentExercise}
            currentNote={currentNote}
            playing={playing}
            bar={bar}
            note={note}
          />
        </div>
      </div>

      <div className="row mb-5">
        <div className="col text-center">
          {currentExercise.bars.map((dot, index) =>
            <div className="indicator-container">
              <span className={`indicator ${bar === index ? 'active' : ''}`}
                    key={index}
                    onClick={() => {
                      if (playing) {
                        return
                      }
                      bar = index
                      note = 0
                      updateState({})
                    }}
              >
              </span>
              <br />
              <span className={`d-inline-block ms-2 me-2`} key={index} style={{ width: 15 }}>
              <input type="checkbox" checked={isActiveBar(index)} onChange={() => {toggleActiveBar(index)}} />
            </span>
            </div>,
          )}
        </div>
      </div>

      <div className="row mb-3">
        <div className="col">
          <h6>
            <strong>
              {currentExercise.title}
            </strong>
          </h6>
          <p>
            {currentExercise.description}
          </p>
        </div>
      </div>

    </div>
  )
}

export default App
