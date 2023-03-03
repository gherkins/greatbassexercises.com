# Great Bass Exercises

### https://greatbassexercises.com/

> collection of great (or hopefully at least useful) bass exercises.

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg


## Data model

Exercise data is defined in JS files like so:

https://github.com/gherkins/greatbassexercises.com/blob/main/src/exercise/tarantula.js

__Exercises are organized in "bars", "ticks" and "notes"__

* An Exercise contains one or many _bars_.
* Each _bar_ defines a playalong-piano-chord and contains one or many _ticks_.
* Each _tick_ contains one or many _notes_.
* Each _note_ then describes a _fret_ and a _string_ position and also optionally the _finger_ of the fretting hand.

```javascript
  [
    {
          string: 1,
          fret: 1,
          finger: 1,
      },
      {
          string: 2,
          fret: 2,
          finger: 2,
      }
  ],
```

That way we can describe chords, scales, arpeggios, etc.

> since these are just js files, you can also use a more programmatically approach like this for example: https://github.com/gherkins/greatbassexercises.com/blob/main/src/exercise/theClamp.js


## Local development

Requirements:

Node: https://github.com/nvm-sh/nvm   
Yarn: https://www.npmjs.com/package/yarn

Run:

    yarn install
    yarn start

