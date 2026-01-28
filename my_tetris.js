import * as keys from "./keys.js"
import * as display from "./display.js"

class Game{
    constructor() {
        this.Score = 0
        this.Lines = 0
        this.Level = 1
        this.Speed = 1000
        this.lastUpdateTime = 0
        this.deltaTime = 0

        this.Tetromino = null
        this.gameOver = false
        this._gameRunning = false
        this.gameLoop = null
        this.collision = false
        this.pieceLock = false

        this.newY = display.IsGrid.wantedRows

        // this.init()
        // this.start_game()
        // this.reset_grid()
        // this.update()
        // this.softDrop()
    }

    
    
    reset_grid() {
        display.IsGrid.fillGrid()
        display.IsGrid.draw()
    }
    
    start_game() {
        if(this._gameRunning) return
        
        console.log("Game Started")

        
        this._gameRunning = true
        this.Tetromino = display.IsTetromino.pieceSelector()
    
        this.reset_grid()

        this.lastUpdateTime = Date.now()
        console.log(this._gameRunning)
        requestAnimationFrame(() => this.update())
    }

    update() {
        // Update game state
        if(!this._gameRunning) return;

        this.deltaTime = Date.now() - (this.lastUpdateTime || 0);
        if(this.deltaTime > this.Speed) {
            this.softDrop()
            this.lastUpdateTime = Date.now()
        }

        this.IsLinesComplete()
        this.pieceLock = false
        display.IsGrid.draw(this.Tetromino)
        requestAnimationFrame(() => this.update())
    }  

    IsLinesComplete() {
        let element = 0
        for(let y = 0; y < display.IsGrid.wantedRows; y++) {
            for(let x = 0; x < display.IsGrid.Columns; x++) {
                if(display.IsGrid.theGrid[y][x] != 0) {
                    element++
                }
            }
            if(element == display.IsGrid.Columns && this.pieceLock === true) {
                display.IsGrid.replacementOfGrid(y)
                this.Lines++
            }
            
            element = 0
        }
        this.pieceLock = false
    }

    lockPiece() {
        // Logic to lock tetromino in place.
        this.pieceLock = true
        for(let y = 0; y < this.Tetromino.shape.length; y++) {
            for(let x = 0; x < this.Tetromino.shape[y].length; x++) {
                if(this.Tetromino.shape[y][x]) {
                    display.IsGrid.theGrid[this.Tetromino.y + y][this.Tetromino.x + x] = this.Tetromino.color
                    display.IsGrid.Context.fillStyle = this.Tetromino.color
                    display.IsGrid.Context.fillRect((this.Tetromino.x + x) * display.IsGrid.blockSizex, (this.Tetromino.y + y) * display.IsGrid.blockSizey, display.IsGrid.blockSizex, display.IsGrid.blockSizey)
                }
            }
        }

    }

    checkCollision() {
        // Logic to check for collisions
        this.collision = () => {
            for(let y = 0; y < this.Tetromino.shape.length; y++) {
                for(let x = 0; x < this.Tetromino.shape[y].length; x++) {
                    if(this.Tetromino.shape[y][x]) {
                        // Check for bottom collision
                        if(this.Tetromino.y + y + 1 >= display.IsGrid.wantedRows || display.IsGrid.theGrid[this.Tetromino.y + y + 1][this.Tetromino.x + x] !== 0) {
                            return true
                        }
                    }
                }
            }
            return false
        };

        if(this.collision()) {
            if(this.Tetromino.y <= 1 || this.Tetromino.y + this.Tetromino.shape.length <= 1) {
                console.log("Game Over")
                this._gameRunning = false
                return
            } else {
                this.lockPiece()
                
                this.Tetromino = display.IsTetromino.pieceSelector()
                requestAnimationFrame(() => this.update())
            }
        }
    }

    softDrop() {
        // Logic to move tetromino down
        display.IsGrid.removeTetrominos(this.Tetromino)

        this.Tetromino.y += 1
        this.checkCollision()
    }
    hardDrop() {
        // Logic to move tetromino down
        display.IsGrid.removeTetrominos(this.Tetromino)
        while (!this.collision()) {
            this.Tetromino.y += 1
        }

        this.checkCollision()
    }

    moveRight() {
        // Logic to move tetromino right
        display.IsGrid.removeTetrominos(this.Tetromino)

        this.Tetromino.x += 1

        if(this.Tetromino.x + this.Tetromino.shape[0].length > display.IsGrid.Columns) {
            this.Tetromino.x = display.IsGrid.Columns - this.Tetromino.shape[0].length
        }

        this.exeptionright = () => {
            let isExeption = 0
            for(let y = 0; y < this.Tetromino.shape.length; y++) {
                if(this.Tetromino.shape[y][this.Tetromino.shape.length -1] == 0) {
                    isExeption++
                }
            }
            if(isExeption == this.Tetromino.shape.length) {
                this.Tetromino.x += 1
                isExeption = O
            }

            return false
        }

        this.exeptionright()
        this.checkCollision() 
    }

    moveLeft() {
        // Logic to move tetromino left
        display.IsGrid.removeTetrominos(this.Tetromino)

        this.Tetromino.x -= 1
        if(this.Tetromino.x < 0) this.Tetromino.x = 0

        this.exeptionleft = () => {
            let isExeption = 0
            for(let y = 0; y < this.Tetromino.shape.length; y++) {
                if(this.Tetromino.shape[y][0] == 0) {
                    isExeption++
                }
            }
            if(isExeption == this.Tetromino.shape.length) {
                this.Tetromino.x -= 1
                isExeption = O
            }
        }

        this.exeptionleft()
        this.checkCollision()
    }

    clockWiseRotate() {
        // Logic to rotate tetromino
        display.IsGrid.removeTetrominos(this.Tetromino)

        let lengthOfShape = this.Tetromino.shape[0].length
        let rotatedShape = Array(lengthOfShape).fill(0).map(() => Array(lengthOfShape).fill(0)) 
        // console.log("Rotate Clockwise")
        // console.log(this.Tetromino.shape)
        // console.log(rotatedShape)

        for(let y = 0; y< lengthOfShape; y++) {
            for(let x = 0; x < lengthOfShape; x++) {
                // console.log(rotatedShape)
                if(this.Tetromino.shape[y][x] == 1) {
                    rotatedShape[x][lengthOfShape - 1 - y] = this.Tetromino.shape[y][x]
                }
            }
        }

        this.Tetromino.shape = rotatedShape

    }

    counterClockWiseRotate() {
        // Logic to rotate tetromino
        display.IsGrid.removeTetrominos(this.Tetromino)

        let lengthOfShape = this.Tetromino.shape[0].length
        let rotatedShape = Array(lengthOfShape).fill(0).map(() => Array(lengthOfShape).fill(0))
        // console.log("Rotate Counter-Clockwise") 
        // console.log(this.Tetromino.shape)
        // console.log(rotatedShape)

        for(let y = 0; y< lengthOfShape; y++) {
            for(let x = 0; x < lengthOfShape; x++) {
                // console.log(rotatedShape)
                if(this.Tetromino.shape[y][x] == 1) {
                rotatedShape[lengthOfShape - 1 - x][y] = this.Tetromino.shape[y][x]
                }
            }
        }

        this.Tetromino.shape = rotatedShape

    }
}

const IsGame = new Game

document.addEventListener('DOMContentLoaded', init);

function init() {
    let button = document.getElementById("start_button")
    button.addEventListener("click", () => {IsGame.start_game()})
}

export {
    IsGame
};
