import Grid from "./Grid.js";
import Tile from "./Tile.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);

//` console.log(grid.randomEmptyCell());

// Creating 2 random tiles on gameboard
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();
// console.log(grid.cellsByColumn);

// - Now we are going to create a function to actually move the tiles based on user input

function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
    // console.log(e.key);
    switch (e.key) {
        case "ArrowUp":
            if (!canMoveUp()) {
                setupInput()
                return
            }
            await moveUp()
            break
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput()
                return
            }
            await moveDown()
            break
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput()
                return
            }
            await moveLeft()
            break
        case "ArrowRight":
            if (!canMoveRight()) {
                setupInput()
                return
            }
            await moveRight()
            break
        default:
            setupInput()
            return
    }

    //, This is the function for merging tiles
    grid.cells.forEach(cell => cell.mergeTiles())

    //, Creating new tile everytime a tile is merged
    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
        newTile.waitForTransition(true).then(() => {
            alert("No Movements Possible - You Lose !!!");
        });
        return
    }
    setupInput()
}

//` The Below function are for sliding the tiles into particular directions
function moveUp() {
    slideTiles(grid.cellsByColumn)
}

function moveDown() {
    slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
    slideTiles(grid.cellsByRow)
}

function moveRight() {
    slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
    return Promise.all(
        cells.flatMap(group => {
            const promises = []
            for (let i = 1; i < group.length; i++) {
                const cell = group[i];

                //, if the tile is null don't do any movement just continue
                if (cell.tile == null) continue;
                let lastValidCell;
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j];
                    if (!moveToCell.canAccept(cell.tile)) break
                    lastValidCell = moveToCell;
                }

                if (lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition());
                    if (lastValidCell.tile != null) {
                        lastValidCell.mergeTile = cell.tile;
                    } else {
                        lastValidCell.tile = cell.tile;
                    }
                    cell.tile = null;
                }
            }
            return promises
        }))
}

//` The Below functions are when no further movement is possible in particular direction then we cant move and no additional new tile is being generated.
function canMoveUp() {
    return canMove(grid.cellsByColumn)
}

function canMoveDown() {
    return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
    return canMove(grid.cellsByRow)
}

function canMoveRight() {
    return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}


//` This function doesn't allow to create new tiles based on checking the above tile on various conditions
function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index === 0) return false;
            if (cell.tile == null) return false;
            const moveToCell = group[index - 1];
            return moveToCell.canAccept(cell.tile)
        })
    })
}