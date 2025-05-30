const gameBoard = document.getElementById("game-board");
const timerElement = document.getElementById("timer");
const gameOverElement = document.getElementById("game-over");
const youWinElement = document.getElementById("you-win");
const generateButton = document.getElementById("generate-button");
const difficultySelect = document.getElementById("difficulty");

let timerInterval;
let gameStarted = false;
let minesCount;
let cellsLeft;
let grid;
let rows;
let cols;

generateButton.addEventListener("click", generateGame);
document.addEventListener("contextmenu", event => event.preventDefault());

function generateGame() {
    // Clear any existing timer
    clearInterval(timerInterval);
    gameStarted = false;
    timerElement.textContent = 'Time: 0';

    const difficulty = difficultySelect.value;
    switch (difficulty) {
        case "easy":
            rows = 8;
            cols = 8;
            minesCount = 10;
            break;
        case "medium":
            rows = 16;
            cols = 16;
            minesCount = 40;
            break;
        case "hard":
            rows = 16;
            cols = 30;
            minesCount = 99;
            break;
    }

    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    gameBoard.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    gameOverElement.classList.add("hidden");
    youWinElement.classList.add("hidden");

    grid = [];
    cellsLeft = rows * cols - minesCount;

    for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", revealCell);
            cell.addEventListener("contextmenu", markCell);
            gameBoard.appendChild(cell);
            row.push({
                element: cell,
                mine: false,
                revealed: false,
                flagged: false,
                adjacentMines: 0
            });
        }
        grid.push(row);
    }

    placeMines();
    calculateAdjacentMines();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < minesCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!grid[r][c].mine) {
            grid[r][c].mine = true;
            minesPlaced++;
        }
    }
}

function calculateAdjacentMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c].mine) continue;
            let mines = 0;
            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].mine) {
                        mines++;
                    }
                }
            }
            grid[r][c].adjacentMines = mines;
        }
    }
}

function startTimer() {
    let time = 0;
    timerInterval = setInterval(() => {
        time++;
        timerElement.textContent = `Time: ${time}`;
    }, 1000);
}

function revealCell(event) {
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }

    const cell = event.target;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    const cellData = grid[r][c];

    if (cellData.revealed || cellData.flagged) return;

    cellData.revealed = true;
    cell.classList.add("revealed");

    if (cellData.mine) {
        cell.innerHTML = '💣';
        endGame(false);
        return;
    }

    cellsLeft--;
    if (cellsLeft === 0) {
        endGame(true);
        return;
    }

    if (cellData.adjacentMines > 0) {
        cell.textContent = cellData.adjacentMines;
        cell.style.color = getNumberColor(cellData.adjacentMines);
    } else {
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    revealCell({ target: grid[nr][nc].element });
                }
            }
        }
    }
}

function markCell(event) {
    const cell = event.target;
    const r = parseInt(cell.dataset.row);
    const c = parseInt(cell.dataset.col);
    const cellData = grid[r][c];

    if (cellData.revealed) return;

    if (cellData.flagged) {
        cellData.flagged = false;
        cell.textContent = '';
    } else {
        cellData.flagged = true;
        cell.innerHTML = '🚩';
    }
}

function getNumberColor(number) {
    switch (number) {
        case 1: return 'blue';
        case 2: return 'green';
        case 3: return 'red';
        case 4: return 'darkblue';
        case 5: return 'darkred';
        case 6: return 'cyan';
        case 7: return 'black';
        case 8: return 'gray';
        default: return 'black';
    }
}

function endGame(win) {
    clearInterval(timerInterval);
    gameBoard.querySelectorAll('.cell').forEach(cell => {
        cell.removeEventListener('click', revealCell);
        cell.removeEventListener('contextmenu', markCell);
    });

    if (win) {
        youWinElement.classList.remove("hidden");
    } else {
        gameOverElement.classList.remove("hidden");
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cellData = grid[r][c];
                if (cellData.mine) {
                    cellData.element.innerHTML = '💣';
                    cellData.element.classList.add('mine');
                }
                if (cellData.flagged && !cellData.mine) {
                    cellData.element.innerHTML = '';
                }
            }
        }
    }
}
