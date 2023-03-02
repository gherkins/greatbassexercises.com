import React, { useEffect, useState } from 'react'
import * as Tone from 'tone'
import PianoMp3 from 'tonejs-instrument-piano-mp3'
import metronomeSound from './audio/metronome.wav'

import exercises from './Exercises'
import Fretboard from './Fretboard'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'

let scheduleEvent

let bar = 0
let tick = 0

let firstTick = true
let countIn = 4

let piano, metro
let currentExercise = Object.values(exercises)[0]

function App () {

  const [instrumentsLoaded, setInstrumentsLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [activeBars, setActiveBars] = useState([])
  const [, updateState] = useState()

  const updateExercise = key => {
    currentExercise = exercises[key]
    if (playing) {
      startStop()
    }
    bar = 0
    tick = 0
    setActiveBars(currentExercise.bars.map((bar, index) => index))
    updateState({})
  }

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

  const exercisesByCategories = () => {
    const categories = {}
    Object.keys(exercises).forEach(exerciseKey => {
      if (!categories[exercises[exerciseKey].category]) {
        categories[exercises[exerciseKey].category] = {}
      }
      categories[exercises[exerciseKey].category][exerciseKey] = exercises[exerciseKey]
    })
    return categories
  }

  const [currentTick, setCurrentTick] = useState()

  const advance = () => {
    const currentBar = currentExercise.bars[bar]
    let nextTick = tick + 1
    if (!currentBar.ticks[nextTick]) {
      nextTick = 0
      let nextBar = bar + 1

      if (nextBar >= currentExercise.bars.length) {
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
    tick = nextTick
  }

  const showTick = () => {
    setCurrentTick(currentExercise.bars[bar].ticks[tick])
  }

  const startStop = async () => {
    await Tone.start()
    scheduleTicks()
    const isPlaying = !playing
    Tone.Transport[isPlaying ? 'start' : 'stop']()
    setPlaying(isPlaying)
    tick = 0
    if (isPlaying) {
      firstTick = true
      countIn = 4
    }
    showTick()
  }

  const setTempo = bpm => {
    bpm = parseInt(bpm)
    setBpm(bpm)
    Tone.Transport.bpm.value = bpm
  }

  const playChord = time => {
    piano.releaseAll()
    currentExercise.bars[bar].chord.forEach((tick, index) => {
      piano.triggerAttack(tick, time)
    })
  }

  const scheduleTicks = () => {
    Tone.Transport.clear(scheduleEvent)
    scheduleEvent = Tone.Transport.scheduleRepeat((time) => {
      if (!firstTick) {
        advance()
      }
      metro.start(time)

      if (countIn > 0) {
        countIn--
        return
      }

      firstTick = false
      showTick()
      updateState({})
      if (tick === 0) {
        playChord(time)
      }
    }, '4n')
  }

  const initInstruments = () => {

    const initPiano = new Promise((resolve) => {
      piano = new PianoMp3({
        onload: () => {
          resolve()
        },
      }).toDestination()
    })

    const initMetro = new Promise((resolve) => {
      metro = new Tone.Player(metronomeSound, () => {
        resolve()
      }).toDestination()
    })

    return new Promise((resolveMain) => {
      Promise.all([initPiano, initMetro]).then(() => {
        resolveMain()
      })
    })
  }

  useEffect(() => {
    initInstruments().then(() => {
      setInstrumentsLoaded(true)
    })
    updateExercise(Object.keys(exercises)[0])
  }, []) /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <React.Fragment>
      <div className="row mb-3">
        <div className="col">
          <select
            className="form-select"
            onChange={e => {
              updateExercise(e.target.value)
            }}>
            {Object.keys(exercisesByCategories()).map((categoryKey) => <optgroup key={categoryKey} label={categoryKey}>
              {Object.keys(exercisesByCategories()[categoryKey]).map((exerciseKey) =>
                <option
                  key={exerciseKey}
                  value={exerciseKey}>
                  {exercises[exerciseKey].title}
                </option>,
              )}
            </optgroup>)}
          </select>
        </div>
      </div>
      <div className="row mb-4">
        <div className="col col-md-2">

          <button onClick={startStop}
                  className={`btn btn-${!instrumentsLoaded ? 'btn-outline-primary' : 'primary'}`}
                  disabled={!instrumentsLoaded}>
            {!instrumentsLoaded ? 'BUSY' : playing ? 'STOP' : 'PLAY'}
          </button>

        </div>
        <div className="col col-md-7 pt-2">
          <input className="form-range"
                 type="range"
                 min={40}
                 max={280}
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
            currentTick={currentTick}
            playing={playing && countIn === 0}
            bar={bar}
            tick={tick}
          />
        </div>
      </div>

      <div className="row mb-5">
        <div className="col text-center">
          {currentExercise.bars.map((dot, index) =>
            <div className="indicator-container" key={`indicator-${index}`}>
              <span className={`indicator ${bar === index ? 'active' : ''}`}
                    key={index}
                    onClick={() => {
                      if (playing) {
                        return
                      }
                      bar = index
                      tick = 0
                      updateState({})
                    }}
              >
              </span>
              <br />
              <span className={`d-inline-block ms-2 me-2`} style={{ width: 15 }}>
              <input type="checkbox"
                     disabled={isActiveBar(index) && activeBars.length === 1}
                     checked={isActiveBar(index)}
                     onChange={() => {toggleActiveBar(index)}}
              />
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
          <p className="description">
            {currentExercise.description}
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default App
