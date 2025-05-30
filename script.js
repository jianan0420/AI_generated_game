function startGame(game) {
    document.getElementById('game-lobby').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';

    const gameArea = document.getElementById('game-area');
    gameArea.innerHTML = '';

    switch(game) {
        case 'snake':
            loadSnakeGame(gameArea);
            break;
        case 'minesweeper':
            loadMinesweeperGame(gameArea);
            break;
        case 'tetris':
            loadTetrisGame(gameArea);
            break;
        case '2048':
            load2048Game(gameArea);
            break;
        case 'pacman':
            loadPacmanGame(gameArea);
            break;
    }
}

function goBack() {
    document.getElementById('game-lobby').style.display = 'flex';
    document.getElementById('game-container').style.display = 'none';
}

function loadSnakeGame(container) {
    container.innerHTML = `<h2>貪吃蛇</h2><canvas id="snakeCanvas"></canvas><p id="snakeScore">Score: 0</p><p id="snakeGameOver"></p>`;
    // 在這裡添加貪吃蛇的遊戲代碼
}

function loadMinesweeperGame(container) {
    container.innerHTML = `<h2>踩地雷</h2><div id="minesweeperBoard"></div><p id="minesweeperTimer">Time: 0</p><p id="minesweeperGameOver"></p>`;
    // 在這裡添加踩地雷的遊戲代碼
}

function loadTetrisGame(container) {
    container.innerHTML = `<h2>俄羅斯方塊</h2><canvas id="tetrisCanvas"></canvas><p id="tetrisScore">Score: 0</p><p id="tetrisGameOver"></p>`;
    // 在這裡添加俄羅斯方塊的遊戲代碼
}

function load2048Game(container) {
    container.innerHTML = `<h2>2048</h2><div id="game2048Board"></div><p id="game2048Score">Score: 0</p><p id="game2048GameOver"></p>`;
    // 在這裡添加2048的遊戲代碼
}

function loadPacmanGame(container) {
    container.innerHTML = `<h2>Pacman</h2><canvas id="pacmanCanvas"></canvas><p id="pacmanGameOver"></p>`;
    // 在這裡添加Pacman的遊戲代碼
}
