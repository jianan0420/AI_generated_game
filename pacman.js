const gameBoard = document.getElementById("pacman-game-board");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");
const winElement = document.getElementById("win"); // 假設這是顯示勝利訊息的元素
const startButton = document.getElementById("start-button");

const boardSize = 20;
const cellSize = 25;
let pacman;
let ghosts = [];
let dots = [];
let walls = [];
let score = 0;
let gameInterval;
let numdots;
let numeatdots;
const gameSpeed = 200; // 初始遊戲速度
const directions = {
    ArrowUp: { x: 0, y: -1 },
    ArrowDown: { x: 0, y: 1 },
    ArrowLeft: { x: -1, y: 0 },
    ArrowRight: { x: 1, y: 0 }
};

startButton.addEventListener("click", startGame);
document.addEventListener("keydown", changeDirection);

function startGame() {
    if (gameInterval) {
        clearInterval(gameInterval); // 清除之前的遊戲間隔
    }
    gameBoard.innerHTML = '';
    numdots = 0;
    numeatdots = 0;
    score = 0;
    scoreElement.textContent = `分數: ${score}`;
    gameOverElement.classList.add("hidden");
    winElement.classList.add("hidden"); // 確保重新開始遊戲時隱藏勝利訊息
    pacman = null;
    ghosts = [];
    dots = [];
    walls = [];
    createBoard();
    placeWalls();
    placePacman();
    placeGhosts();
    placeDots();
    gameInterval = setInterval(moveEntities, gameSpeed); // 重置遊戲速度
}

function createBoard() {
    gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, ${cellSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${boardSize}, ${cellSize}px)`;
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cell = document.createElement("div");
            cell.classList.add("pacman-cell");
            cell.dataset.row = i;
            cell.dataset.col = j;
            gameBoard.appendChild(cell);
        }
    }
}
function placeWalls() {
    const wallPositions = [
      { row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }, { row: 0, col: 5 },
      { row: 0, col: 6 }, { row: 0, col: 7 }, { row: 0, col: 8 }, { row: 0, col: 9 }, { row: 0, col: 10 }, { row: 0, col: 11 },
      { row: 0, col: 12 }, { row: 0, col: 13 }, { row: 0, col: 14 }, { row: 0, col: 15 }, { row: 0, col: 16 }, { row: 0, col: 17 },
      { row: 0, col: 18 }, { row: 0, col: 19 }, { row: 1, col: 0 }, { row: 1, col: 19 }, { row: 2, col: 0 }, { row: 2, col: 2 },
      { row: 2, col: 4 }, { row: 2, col: 5 }, { row: 2, col: 6 }, { row: 2, col: 7 }, { row: 2, col: 8 },
      { row: 2, col: 9 }, { row: 2, col: 10 }, { row: 2, col: 12 }, { row: 2, col: 13 }, { row: 2, col: 14 }, { row: 2, col: 15 },
      { row: 2, col: 16 }, { row: 2, col: 17 }, { row: 2, col: 18 }, { row: 2, col: 19 }, { row: 3, col: 0 }, { row: 3, col: 2 },
      { row: 3, col: 10 }, { row: 3, col: 19 }, { row: 4, col: 0 }, { row: 4, col: 2 }, { row: 4, col: 4 },
      { row: 4, col: 5 }, { row: 4, col: 6 }, { row: 4, col: 7 }, { row: 4, col: 8 }, { row: 4, col: 10 }, { row: 4, col: 11 },
      { row: 4, col: 12 }, { row: 4, col: 13 }, { row: 4, col: 14 }, { row: 4, col: 15 }, { row: 4, col: 16 },{ row: 4, col: 17 }, 
      { row: 4, col: 19 }, { row: 5, col: 0 }, { row: 5, col: 2 }, { row: 5, col: 4 }, { row: 5, col: 8 }, { row: 5, col: 10 },
      { row: 5, col: 17 },{ row: 5, col: 19 }, { row: 6, col: 0 }, { row: 6, col: 2 }, { row: 6, col:3 },{ row: 6, col: 4 },
      { row: 6, col: 6 }, { row: 6, col: 8 }, { row: 6, col: 10 }, { row: 6, col: 12 }, { row: 6, col: 13 } ,{ row: 6, col: 14 }, { row: 6, col: 15 },
      { row: 6, col: 17 }, { row: 6, col: 19 }, { row: 7, col: 0 }, { row: 7, col: 6 }, { row: 7, col: 12 },
      { row: 7, col: 19 }, { row: 8, col: 0 }, { row: 8, col: 1 }, { row: 8, col: 2 }, { row: 8, col: 3 }, { row: 8, col: 4 },
      { row: 8, col: 5 }, { row: 8, col: 6 }, { row: 8, col: 8 }, { row: 8, col: 9 }, { row: 8, col: 10 }, { row: 8, col: 11 },
      { row: 8, col: 12 }, { row: 8, col: 14 }, { row: 8, col: 15 }, { row: 8, col: 16 }, { row: 8, col: 17 }, { row: 8, col: 18 },
      { row: 8, col: 19 }, { row: 9, col: 0 }, { row: 9, col: 19 }, { row: 10, col: 0 }, { row: 10, col: 2 }, { row: 10, col: 3 },
      { row: 10, col: 4 }, { row: 10, col: 5 }, { row: 10, col: 6 }, { row: 10, col: 7 }, { row: 10, col: 8 }, { row: 10, col: 9 },
      { row: 10, col: 11 }, { row: 10, col: 12 }, { row: 10, col: 13 }, { row: 10, col: 14 }, { row: 10, col: 15 },
      { row: 10, col: 16 }, { row: 10, col: 17 }, { row: 10, col: 19 }, { row: 11, col: 0 }, { row: 11, col: 2 },
      { row: 11, col: 19 }, { row: 12, col: 0 }, { row: 12, col: 2 }, { row: 12, col: 4 },
      { row: 12, col: 5 }, { row: 12, col: 6 }, { row: 12, col: 7 }, { row: 12, col: 8 }, { row: 12, col: 10 }, { row: 12, col: 11 },
      { row: 12, col: 12 }, { row: 12, col: 13 }, { row: 12, col: 14 }, { row: 12, col: 15 }, { row: 12, col: 16 },{ row: 12, col: 17 }, 
      { row: 12, col: 19 }, { row: 13, col: 0 }, { row: 13, col: 2 }, { row: 13, col: 4 }, { row: 13, col: 8 }, { row: 13, col: 10 },
      { row: 13, col: 17 }, { row: 13, col: 19 }, { row: 14, col: 0 }, { row: 14, col: 2 }, { row: 14, col: 4 },
      { row: 14, col: 6 }, { row: 14, col: 8 }, { row: 14, col: 10 }, { row: 14, col: 12 }, { row: 14, col: 14 }, { row: 14, col: 15 },{ row: 14, col: 16 },
      { row: 14, col: 17 },  { row: 14, col: 19 }, { row: 15, col: 0 }, { row: 15, col: 6 }, { row: 15, col: 12 },
      { row: 15, col: 19 }, { row: 16, col: 0 }, { row: 16, col: 1 }, { row: 16, col: 2 }, { row: 16, col: 3 }, { row: 16, col: 4 },
      { row: 16, col: 5 }, { row: 16, col: 6 }, { row: 16, col: 8 }, { row: 16, col: 9 }, { row: 16, col: 10 }, { row: 16, col: 11 },
      { row: 16, col: 12 }, { row: 16, col: 14 }, { row: 16, col: 15 }, { row: 16, col: 16 }, { row: 16, col: 17 }, { row: 16, col: 18 },
      { row: 16, col: 19 }, { row: 17, col: 0 },{ row: 17, col: 2 },{ row: 17, col: 5 },{ row: 17, col: 8 },{ row: 17, col: 11 },{ row: 17, col: 14 }, { row: 17, col: 17 },{ row: 17, col: 19 }, 
      { row: 18, col: 0 },{ row: 18, col: 19 },
      { row: 19, col: 0 }, { row: 19, col: 1 },{ row: 19, col: 2 }, { row: 19, col: 3 }, { row: 19, col: 4 }, { row: 19, col: 5 }, { row: 19, col: 6 }, { row: 19, col: 7 },
      { row: 19, col: 8 }, { row: 19, col: 9 }, { row: 19, col: 10 }, { row: 19, col: 11 }, { row: 19, col: 12 }, { row: 19, col: 13 },
      { row: 19, col: 14 }, { row: 19, col: 15 }, { row: 19, col: 16 }, { row: 19, col: 17 }, { row: 19, col: 18 }, { row: 19, col: 19 }

        // Add your wall positions here
    ];
    wallPositions.forEach(pos => {
        const wall = createEntity("pacman-wall", pos.row, pos.col);
        walls.push(wall);
    });
}

function placePacman() {
    pacman = createEntity("pacman-pacman", 10, 10);
    pacman.direction = { x: 0, y: 0 };
    pacman.nextDirection = { x: 0, y: 0 }; // 用於儲存玩家的下一個移動方向
}

function placeGhosts() {
    ghosts = [
        createEntity("pacman-ghost", 1, 1),
        createEntity("pacman-ghost", 1, 18),
        createEntity("pacman-ghost", 18, 1),
        createEntity("pacman-ghost", 18, 18)
    ];
    ghosts.forEach(ghost => {
        ghost.moveCount = 0; // 初始化移動計數器
    });
}

function placeDots() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (Math.random() < 0.2 && (i !== 10 || j !== 10) && !isWall(i, j)) {
                dots.push(createEntity("pacman-dot", i, j));
                numdots += 1;
            }
        }
    }
}

function createEntity(className, row, col) {
    const cell = document.querySelector(`.pacman-cell[data-row='${row}'][data-col='${col}']`);
    const entity = document.createElement("div");
    entity.classList.add(className);
    cell.appendChild(entity);
    return { element: entity, row, col, direction: getRandomDirection() };
}

function getRandomDirection() {
    const directionsArray = Object.values(directions);
    return directionsArray[Math.floor(Math.random() * directionsArray.length)];
}

function changeDirection(event) {
    if (directions[event.key]) {
        pacman.nextDirection = directions[event.key];
    }
}

function moveEntities() {
    movePacman();
    ghosts.forEach(ghost => {
        if (distanceToPacman(ghost) < 5) {
            followPacman(ghost);
        } else {
            ghost.moveCount++;
            if (ghost.moveCount >= 3) {
                ghost.direction = getRandomDirection();
                ghost.moveCount = 0;
            }
        }
        moveEntity(ghost);
        checkGhostCollision(ghost);
    });
    checkGhostCollisionWithPacman();
}

function movePacman() {
    const nextRow = (pacman.row + pacman.nextDirection.y + boardSize) % boardSize;
    const nextCol = (pacman.col + pacman.nextDirection.x + boardSize) % boardSize;

    if (!isWall(nextRow, nextCol)) {
        pacman.direction = pacman.nextDirection;
    }

    const newRow = (pacman.row + pacman.direction.y + boardSize) % boardSize;
    const newCol = (pacman.col + pacman.direction.x + boardSize) % boardSize;

    if (!isWall(newRow, newCol)) {
        pacman.row = newRow;
        pacman.col = newCol;
    } else {
        pacman.direction = { x: 0, y: 0 }; // 撞牆後停止移動
    }

    updateEntityPosition(pacman);
    checkPacmanCollision(); // 在吃豆人移動後立即檢查碰撞
    checkGhostCollisionWithPacman(); // 每次吃豆人移動後立即檢查與鬼的碰撞
}

function moveEntity(entity) {
    const newRow = (entity.row + entity.direction.y + boardSize) % boardSize;
    const newCol = (entity.col + entity.direction.x + boardSize) % boardSize;
    if (!isWall(newRow, newCol) && !isGhostInCell(newRow, newCol, entity)) {
        entity.row = newRow;
        entity.col = newCol;
    } else {
        entity.direction = getRandomDirection();
        entity.moveCount = 0; // 撞牆後重置移動計數器
    }
    updateEntityPosition(entity);
    checkGhostCollision(entity); // 每次鬼移動後立即檢查與吃豆人的碰撞
}

function updateEntityPosition(entity) {
    const cell = document.querySelector(`.pacman-cell[data-row='${entity.row}'][data-col='${entity.col}']`);
    cell.appendChild(entity.element);
}

function isWall(row, col) {
    return walls.some(wall => wall.row === row && wall.col === col);
}

function isGhostInCell(row, col, currentGhost) {
    return ghosts.some(ghost => ghost.row === row && ghost.col === col && ghost !== currentGhost);
}

function distanceToPacman(ghost) {
    return Math.abs(ghost.row - pacman.row) + Math.abs(ghost.col - pacman.col);
}

function followPacman(ghost) {
    const rowDiff = pacman.row - ghost.row;
    const colDiff = pacman.col - ghost.col;
    if (Math.abs(rowDiff) > Math.abs(colDiff)) {
        ghost.direction = rowDiff > 0 ? directions.ArrowDown : directions.ArrowUp;
    } else {
        ghost.direction = colDiff > 0 ? directions.ArrowRight : directions.ArrowLeft;
    }
    ghost.moveCount = 0; // 追踪Pacman時重置移動計數器
}

function checkPacmanCollision() {
    dots = dots.filter(dot => {
        if (dot.row === pacman.row && dot.col === pacman.col) {
            dot.element.remove();
            numeatdots += 1;
            score += 10;
            scoreElement.textContent = `分數: ${score}`;
            checkForWin(); // 每次吃掉點後檢查是否獲勝
            return false;
        }
        return true;
    });
}

function checkGhostCollision(ghost) {
    if (ghost.row === pacman.row && ghost.col === pacman.col) {
        clearInterval(gameInterval);
        gameOverElement.classList.remove("hidden");
    }
}

function checkGhostCollisionWithPacman() {
    ghosts.forEach(ghost => {
        if (ghost.row === pacman.row && ghost.col === pacman.col) {
            clearInterval(gameInterval);
            gameOverElement.classList.remove("hidden");
        }
    });
}

function checkForWin() {
    if (numeatdots >= numdots) {
        clearInterval(gameInterval);
        winElement.classList.remove("hidden");
    }
}
