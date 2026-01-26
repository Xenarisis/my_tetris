import * as Game from "./my_tetris.js"

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft', 'q':
            Game.IsGame.moveLeft()
            break
        case 'ArrowRight', 'd':
            Game.IsGame.moveRight()
            break
        case 'ArrowDown', 's':
            Game.IsGame.softDrop()
            break
        case 'ArrowUp', 'x':
            Game.IsGame.clockWiseRotate()
            break
        case 'Ctrl', 'z':
            Game.IsGame.counterClockWiseRotate()
            break
        case ' ':
            Game.IsGame.hardDrop()
            break
    }
});
