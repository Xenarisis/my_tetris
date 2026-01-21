class Tetromino{
    constructor() {
        this.Shape={
            I: [[1, 1, 1, 1]],
            O: [[1, 1], [1, 1]],
            T: [[0, 1, 0], [1, 1, 1]],
            S: [[0, 1, 1], [1, 1, 0]],
            Z: [[1, 1, 0], [0, 1, 1]],
            J: [[0, 0, 1], [0, 0, 1], [0, 1, 1]],
            L: [[1, 0, 0], [1, 0, 0], [1, 1, 0]]
        }
        
        this.Color={
            I: "cyan",
            O: "yellow",
            T: "violet",
            S: "green",
            Z: "red",
            J: "blue",
            L: "orange"
        }
        

        this.pieceSelector()
    }
    
    pieceSelector() {
        this.pieces = Object.keys(this.Shape);
        this.randomPiece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        
        return {
            shape: this.Shape[this.randomPiece],
            type: this.randomPiece,
            x: Math.floor(10 / 2) - Math.floor(this.Shape[this.randomPiece][0].length / 2),
            y: 0,
            color: this.Color[this.randomPiece]
        };
    }
}

const IsTetromino = new Tetromino()

class Grid{
    constructor() {
        this.Columns = 10
        this.Rows = 40
        this.wantedRows = this.Rows/2
        this.blockSizex = document.getElementById("tetris_canva").width/this.Columns
        this.blockSizey = document.getElementById("tetris_canva").height/this.wantedRows
        
        this.theGrid = []
        
        this.tetrisCanvas = document.getElementById("tetris_canva")
        this.Context = this.tetrisCanvas.getContext("2d")
        
        this.fillGrid()
        
        this.draw()
    }
    
    fillGrid() {
        this.theGrid = Array(this.Rows).fill(null).map(() => Array(this.Columns).fill(null))
    }
    
    
    
    draw() {
        this.Context.fillStyle = "#000"
        this.Context.strokeStyle = "#be0af0"
        
        this.drawgrid()
        let piece = IsTetromino.pieceSelector()
        this.drawpiece(piece)
    }
    
    drawgrid() {
        for(let y = 0; y < this.wantedRows; y++) {
            for(let x = 0; x < this.Columns; x++) {
                this.Context.fillRect(x * this.blockSizex, y * this.blockSizey, this.blockSizex, this.blockSizey)
                this.Context.strokeRect(x * this.blockSizex, y * this.blockSizey, this.blockSizex, this.blockSizey)
            }
        }
    }
    
    drawpiece(piece) {
        this.Context.fillStyle = piece.color

        for(let y = 0; y < piece.shape.length; y++) {
            for(let x = 0; x < this.Columns; x++) {
                if(piece.shape[y][x]) {
                    this.Context.fillRect(x * this.blockSizex, y * this.blockSizey, this.blockSizex, this.blockSizey)
                }
            }
        }
    }
    
}
const IsGrid = new Grid()

export {
    IsTetromino,
    IsGrid
}
