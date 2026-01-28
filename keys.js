import * as Game from "./my_tetris.js"

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
        case 'q':
        case 'Q':
            Game.IsGame.moveLeft()
            break
        case 'ArrowRight':
        case 'd':
        case 'D':
            Game.IsGame.moveRight()
            break
        case 'ArrowDown':
        case 's':
        case 'S':
            Game.IsGame.softDrop()
            break
        case 'ArrowUp':
        case 'x':
        case 'X':
            Game.IsGame.clockWiseRotate()
            break
        case 'Control':
        case 'z':
        case 'Z':
            Game.IsGame.counterClockWiseRotate()
            break
        case ' ':
            Game.IsGame.hardDrop()
            break
    }
});
