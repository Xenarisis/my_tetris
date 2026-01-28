import * as Game from "./my_tetris.js"

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
        case 'q':
            Game.IsGame.moveLeft()
            break
        case 'ArrowRight':
        case 'd':
            Game.IsGame.moveRight()
            break
        case 'ArrowDown':
        case 's':
            Game.IsGame.softDrop()
            break
        case 'ArrowUp':
        case 'x':
            Game.IsGame.clockWiseRotate()
            break
        case 'Control':
        case 'z':
            Game.IsGame.counterClockWiseRotate()
            break
        case ' ':
            Game.IsGame.hardDrop()
            break
    }
});
