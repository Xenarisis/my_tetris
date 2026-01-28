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
        // Logic to move tetromino to the right
        display.IsGrid.removeTetrominos(this.Tetromino)
        
        this.Tetromino.x += 1
        
        let Rows = display.IsGrid.takeRightRows(this.Tetromino)
        
        if(this.Tetromino.x + this.Tetromino.shape[0].length - Rows.rightY > display.IsGrid.Columns) {
            this.Tetromino.x = display.IsGrid.Columns - (this.Tetromino.shape[0].length - Rows.rightY)
        }
        

        if(this.checkSideCollision()) {
            this.Tetromino.x -= 1 
        }
    }

    moveLeft() {
        // Logic to move tetromino to the left
        display.IsGrid.removeTetrominos(this.Tetromino)
        
        this.Tetromino.x -= 1
        
        let Rows = display.IsGrid.takeRightRows(this.Tetromino)
        
        if(this.Tetromino.x + Rows.leftY < 0) {
            this.Tetromino.x = -Rows.leftY
        }
        
        if(this.checkSideCollision()) {
            this.Tetromino.x += 1 
        }
    }
    
    checkSideCollision() {
        // Logic to check collateral collision
        for(let y = 0; y < this.Tetromino.shape.length; y++) {
            for(let x = 0; x < this.Tetromino.shape[y].length; x++) {
                if(this.Tetromino.shape[y][x]) {
                    let gridY = this.Tetromino.y + y
                    let gridX = this.Tetromino.x + x
                    
                    // Vérifier si on est dans les limites
                    if(gridX < 0 || gridX >= display.IsGrid.Columns) {
                        return true
                    }
                    
                    // Vérifier collision avec pièces déjà placées
                    if(gridY >= 0 && gridY < display.IsGrid.wantedRows && 
                       display.IsGrid.theGrid[gridY][gridX] !== 0) {
                        return true
                    }
                }
            }
        }
        return false
    }
    
    clockWiseRotate() {
        // Logic to rotate the tetromino clockWise
        display.IsGrid.removeTetrominos(this.Tetromino)
        
        let oldShape = this.Tetromino.shape
        let lengthOfShape = this.Tetromino.shape[0].length
        let rotatedShape = Array(lengthOfShape).fill(0).map(() => Array(lengthOfShape).fill(0))
        
        for(let y = 0; y < lengthOfShape; y++) {
            for(let x = 0; x < lengthOfShape; x++) {
                if(this.Tetromino.shape[y][x] == 1) {
                    rotatedShape[x][lengthOfShape - 1 - y] = this.Tetromino.shape[y][x]
                }
            }
        }
        
        this.Tetromino.shape = rotatedShape
        
        this.adjustAfterRotation(oldShape)
    }
    
    counterClockWiseRotate() {
        // Logic to rotate the tetromino counterclockWise
        display.IsGrid.removeTetrominos(this.Tetromino)
        
        let oldShape = this.Tetromino.shape
        let lengthOfShape = this.Tetromino.shape[0].length
        let rotatedShape = Array(lengthOfShape).fill(0).map(() => Array(lengthOfShape).fill(0))
        
        for(let y = 0; y < lengthOfShape; y++) {
            for(let x = 0; x < lengthOfShape; x++) {
                if(this.Tetromino.shape[y][x] == 1) {
                    rotatedShape[lengthOfShape - 1 - x][y] = this.Tetromino.shape[y][x]
                }
            }
        }
        
        this.Tetromino.shape = rotatedShape
        
        this.adjustAfterRotation(oldShape)
    }
    
    adjustAfterRotation(oldShape) {
        // Logic to adjust tetromino in function of the old one
        let Rows = display.IsGrid.takeRightRows(this.Tetromino)
        
        if(this.Tetromino.x + this.Tetromino.shape[0].length - Rows.rightY > display.IsGrid.Columns) {
            this.Tetromino.x = display.IsGrid.Columns - (this.Tetromino.shape[0].length - Rows.rightY)
        }
        
        if(this.Tetromino.x + Rows.leftY < 0) {
            this.Tetromino.x = -Rows.leftY
        }
        
        if(this.checkSideCollision() || this.collision()) {
            this.Tetromino.shape = oldShape
        }
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
