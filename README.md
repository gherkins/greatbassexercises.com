# Great Bass Exercises

### https://greatbassexercises.com/

> collection of great (or hopefully at least useful) bass exercises.

## Data model

Exercise data is defined in JS files like so:

https://github.com/gherkins/greatbassexercises.com/blob/main/src/exercise/tarantula.js

__Exercises are organized in "bars", "ticks" and "notes"__

* An Exercise contains one or many _bars_.
* Each _bar_ defines a playalong-piano-chord and contains one or many _ticks_.
* Each _tick_ contains one or many _notes_.
* Each _note_ then describes a _fret_ and a _string_ position.

That way we can describe chords, scales, arpeggios, etc. in a flexible way.

## Local development

Requirements:

Node: https://github.com/nvm-sh/nvm   
Yarn: https://www.npmjs.com/package/yarn

Run:

    yarn install
    yarn start

