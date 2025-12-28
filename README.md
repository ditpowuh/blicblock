# blicblock

Blicblock is a fictional game featured in the series `The Sims` (in the game `The Sims 4` to be exact) that Sims can play on their computers.

This project is a modern recreation of Blicblock, built using `TypeScript`, `Next.JS`, and `React`.

## Controls
`Left Arrow` - Move block left
<br/>
`Right Arrow` - Move block right
<br/>
`Down Arrow` - Quick drop
<br/>
`ESC` - Pause/Unpause

## Modes
### Normal
Normal mode is similar to the original, but has 6 colors of blocks - a difference from the original that is inspired by [blicblock-js](https://github.com/cheshire137/blicblock-js), as the game would be too easy.
The game additionally uses a more pursuable or trackable point system where each tetromino gives 1000 points and every 4000 points, the level is incremented, which increases the drop speed.

### Original
Original mode has 4 colors of blocks in a board of 7 rows and 5 columns. This reflects the game which can be observed in `The Sims 4`.
The drop speed of the game in `The Sims 4` is already fast by level 4 from observations, where points go up by around 30,000 points every time.
This mode reflects that with a faster rate of drop rate than normal mode and a similar randomised point system.

### Custom
Custom mode, as implied by the name, has customisable settings.
<br/>
Settings that can be customised before starting a game include:
- Width of board
  - Minimum: 3
  - Maximum: 9
- Height of board
  - Minimum: 3
  - Maximum: 15
- Colors
  - Minimum: 2
  - Maximum: 10
- Points awarded per tetromino
  - Minimum: 0
- Points per level
  - Minimum: 1
- Starting level
  - Minimum: 1

## Attribution
Handwritten Simlish font was created by Alleliua, found [here](https://2ttf.com/TMGzvARw).
<br/>
Sound effects were recorded from the game and was then edited by me using `FL Studio`.
