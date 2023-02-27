import React, { useEffect, useState } from 'react'
import './App.css'
import * as Tone from 'tone'
import PianoMp3 from 'tonejs-instrument-piano-mp3'
import metronomeSound from './metronome.wav'

import tarantula from './exercise/tarantula'

let slice = 0
let tick = 0
let firstTick = true
let piano

function App () {

  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)

  const currentExercise = tarantula

  const [currentTick, setCurrentTick] = useState(currentExercise[slice].ticks[tick])

  const progress = () => {
    const currentSlice = currentExercise[slice]
    let nextTick = tick + 1
    if (!currentSlice.ticks[nextTick]) {
      nextTick = 0
      let nextSlice = slice + 1
      if (!currentExercise[nextSlice]) {
        nextSlice = 0
        nextTick = 0
      }
      slice = nextSlice
    }
    tick = nextTick
  }

  const getAsciiDiagram = () => {

    const res = []
    currentExercise[slice].ticks.forEach(tick => {
      res.push(`${tick.string}-${tick.fret}`)
    })

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
      for (let fret = 1; fret <= 6; fret++) {

        const isCurrent = currentTick.string === string && currentTick.fret === fret

        ascii += '─'
        ascii += res.includes(`${string}-${fret}`) ? isCurrent ? '●' : '○' : '─'
        ascii += '─'
        if (fret === 6) {
          switch (string) {
            case 4:
              ascii += '┐\n'
              break
            case 1:
              ascii += '┘\n'
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

  const showTick = () => {
    setCurrentTick(currentExercise[slice].ticks[tick])
  }

  const startStop = () => {
    const isPlaying = !playing
    Tone.Transport[isPlaying ? 'start' : 'stop']()
    setPlaying(isPlaying)
    slice = 0
    tick = 0
    firstTick = true
    showTick()
  }

  const setTempo = bpm => {
    bpm = parseInt(bpm)
    setBpm(bpm)
    Tone.Transport.bpm.value = bpm
  }

  const playChord = time => {
    piano.releaseAll()
    currentExercise[slice].chord.forEach((note, index) => {
      piano.triggerAttack(note, time)
    })
  }

  useEffect(() => {
    piano = new PianoMp3().toDestination()
    const metro = new Tone.Player(metronomeSound).toDestination()

    Tone.Transport.scheduleRepeat((time) => {
      if (!firstTick) {
        progress()
      }
      firstTick = false
      showTick()
      if (tick === 0) {
        playChord(time)
      }
      metro.start(time)
    }, '4n')
  }, [])

  return (
    <div className="container" style={{ maxWidth: 440 }}>
      <div className="row">
        <div className="col">
          <h1>great bass exercises</h1>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="App">
            <label className="form-label">{bpm} BPM</label>
            <input className="form-range"
                   type="range"
                   min={40}
                   max={200}
                   value={bpm}
                   onChange={e => {setTempo(e.target.value)}}
            />

            <button onClick={startStop} className="btn btn-success">
              {playing ? 'stop' : 'start'}
            </button>

            <div>
              <pre style={{ fontSize: '1.7rem', lineHeight: 1.25 }}>
                {getAsciiDiagram()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
