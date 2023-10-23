// we can change the grid size value to any other value and it will work perfectly fine
const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

//- To make the Grid variable and dynamic instead of adding it in CSS file
export default class Grid {
    // To define the private variable we do "#" before variable so that they can't be modified from outside this class

    #cells;

    constructor(gridElement) {
        gridElement.style.setProperty("--grid-size", GRID_SIZE);
        gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
        gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

        this.#cells = createCellElements(gridElement).map((cellElement, index) => {
            // returning the cell location inside the grid
            return new Cell(cellElement, index % GRID_SIZE, Math.floor(index / GRID_SIZE));
        })

        // console.log(this.cells);

        // A function to create the Cell Elements
        // createCellElements(gridElement);
    }

    get cells() {
        return this.#cells;
    }

    //, We have created an array of array with first variable represents columns and second variable represents row

    get cellsByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || []
            cellGrid[cell.y][cell.x] = cell
            return cellGrid
        }, [])
    }

    //, We have created an array of array with first variable represents rows and second variable represents column
    get cellsByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || []
            cellGrid[cell.x][cell.y] = cell
            return cellGrid
        }, [])
    }

    // Getter function for getting empty cells
    get #emptyCells() {
        return this.#cells.filter(cell => cell.tile == null);
    }

    // The below function return the randomIndex from the emptyCells
    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
        return this.#emptyCells[randomIndex];
    }
}

class Cell {
    // To define the private variable with do "#" before variable so that they can't be modified from outside this class

    #cellElement
    #x
    #y
    #tile
    #mergeTile

    constructor(cellElement, x, y) {
        this.#cellElement = cellElement;
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    get tile() {
        return this.#tile;
    }

    set tile(value) {
        this.#tile = value;
        if (value == null) return;

        // This is moving the tile from top-left to top-right essentially when we click the arrow keys on keyboard i.e., from x -> #x and y -> #y (Here #x, #y are new tile co-ordinates)
        this.#tile.x = this.#x;
        this.#tile.y = this.#y;
    }

    get mergeTile() {
        return this.#mergeTile;
    }

    set mergeTile(value) {
        this.#mergeTile = value;
        if (value == null) return
        this.#mergeTile.x = this.#x
        this.#mergeTile.y = this.#y
    }

    canAccept(tile) {
        return (this.tile == null || (this.mergeTile == null && this.tile.value === tile.value))
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return;
        this.tile.value = this.tile.value + this.mergeTile.value;
        this.mergeTile.remove();
        this.mergeTile = null;
    }

}


//- Below function is creating cells and appending it to the grid and also returning cells array.
function createCellElements(gridElement) {
    const cells = [];
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cells.push(cell); // Adding cell to cells array
        gridElement.append(cell); // Adding cell to the grid
    }
    return cells; // retuns the created cells
}