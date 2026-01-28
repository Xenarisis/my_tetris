class Tetromino{
    constructor() {
        this.shape={
            I: [[1, 1, 1, 1], [0,0,0,0], [0,0,0,0], [0,0,0,0]],
            O: [[1, 1], [1, 1]],
            T: [[0, 1, 0], [1, 1, 1], [0,0,0]],
            S: [[0, 1, 1], [1, 1, 0], [0,0,0]],
            Z: [[1, 1, 0], [0, 1, 1], [0,0,0]],
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

        // this.pieceSelector()
    }
    
    pieceSelector() {
        this.pieces = Object.keys(this.shape);
        this.randomPiece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        
        return {
            shape: this.shape[this.randomPiece],
            type: this.randomPiece,
            x: Math.floor(10 / 2) - Math.floor(this.shape[this.randomPiece][0].length / 2),
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
        this.theGrid = Array(this.Rows).fill(0).map(() => Array(this.Columns).fill(0))
    }

    draw(piece/*, piece2*/) {
        this.Context.fillStyle = "#000"
        this.Context.strokeStyle = "#be0af0"
        this.drawgrid()
        if(piece) {
            this.drawpiece(piece)
        }
        // if(piece2) {
        //     this.drawnextpiece(piece2)
        // }
    }
    
    drawgrid() {
        for(let y = 0; y < this.wantedRows; y++) {
            for(let x = 0; x < this.Columns; x++) {
                if(this.theGrid[y][x] == 0) {
                    this.Context.fillRect(x * this.blockSizex, y * this.blockSizey, this.blockSizex, this.blockSizey)
                    this.Context.strokeRect(x * this.blockSizex, y * this.blockSizey, this.blockSizex, this.blockSizey)
                }
            }
        }
    }
    
    drawpiece(piece) {
        this.Context.fillStyle = piece.color

        for(let y = 0; y < piece.shape.length; y++) {
            for(let x = 0; x < piece.shape[y].length; x++) {
                if(piece.shape[y][x] != 0) {
                    this.theGrid[piece.y + y][piece.x + x] = piece.color
                    this.Context.fillRect((piece.x + x) * this.blockSizex, (piece.y + y) * this.blockSizey, this.blockSizex, this.blockSizey)
                }
            }
        }
    }

    // drawnextpiece(piece) {
    //     this.Context.fillStyle = piece.color

    //     for(let y = 0; y < piece.shape.length; y++) {
    //         for(let x = 0; x < piece.shape[y].length; x++) {
    //             if(piece.shape[y][x]) {
    //                 this.Context.fillRect((x + 12) * this.blockSizex, (y + 1) * this.blockSizey, this.blockSizex, this.blockSizey)
    //             }
    //         }
    //     }
    // }

    removeTetrominos(piece) {
        this.Context.fillStyle = "#000"
        for(let y = 0; y < piece.shape.length; y++) {
            for(let x = 0; x < piece.shape[y].length; x++) {
                if(piece.shape[y][x] != 0) {
                    this.theGrid[piece.y + y][piece.x + x] = 0
                    this.Context.fillRect((piece.x + x) * this.blockSizex, (piece.y + y) * this.blockSizey, this.blockSizex, this.blockSizey)
                }
            }
        }
        this.drawgrid()
    }

    replacementOfGrid(linesY) {
        for(let y = linesY; y > 0; y--) {
            for(let x = 0; x < this.Columns; x++) {
                this.theGrid[y][x] = this.theGrid[y - 1][x]
                this.Context.fillStyle = this.theGrid[y - 1][x]
                this.Context.fillRect(x * this.blockSizex, y * this.blockSizey, this.blockSizex, this.blockSizey)
            }
        }
    }

    takeRightRows(piece) {
        let Rows = {
            leftY: 0,
            rightY: 0
        }

        let IsEmpty = 0

        let IsLeft = true
        let IsRight = false

        for(let x = 0; x < piece.shape.length; x++) {
            for (let y = 0; y < piece.shape.length; y++) {
                if(piece.shape[y][x] == 0) {
                    IsEmpty++
                } else {
                    IsLeft = false
                    IsRight = true
                }
            }
            if(IsEmpty == piece.shape.length && IsLeft == true) {
                Rows.leftY++
            }
            if(IsEmpty == piece.shape.length && IsRight == true) {
                Rows.rightY++
            }

            IsEmpty = 0
        }

        return Rows
    }
}
const IsGrid = new Grid()

export {
    IsTetromino,
    IsGrid
};
