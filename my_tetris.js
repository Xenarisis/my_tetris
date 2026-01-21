// import * as keys from "./keys.js"
import * as display from "./display.js"

class Game{
    constructor() {
        this.Score = 0
        this.Lines = 0
        this.Level = 1

    }
}

document.addEventListener('DOMContentLoaded', init);

function init() {
    document.getElementById("start_button").addEventListener("click", () => display.IsGrid.draw())
}
