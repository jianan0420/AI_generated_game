const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const gameOverElement = document.getElementById("game-over");
const startButton = document.getElementById("start-button");

const tileSize = 10;
const width = canvas.width / tileSize;
const height = canvas.height / tileSize;

let snake;
let food;
let direction;
let score;
let gameInterval;

let normalSpeed = 100; // 正常速度
let fastSpeed = 50;    // 加速速度
let currentSpeed = normalSpeed;
let isSpeeding = false; // 标志当前是否处于加速状态

startButton.addEventListener("click", startGame);

document.addEventListener("keydown", changeDirection);
document.addEventListener("keydown", handleKeydown);
document.addEventListener("keyup", handleKeyup);

function handleKeydown(event) {
    changeDirection(event);
    if (event.keyCode === 32 && !isSpeeding) { // 空白键
        isSpeeding = true;
        clearInterval(gameInterval);
        currentSpeed = fastSpeed;
        gameInterval = setInterval(updateGame, currentSpeed);
    }
}

function handleKeyup(event) {
    if (event.keyCode === 32 && isSpeeding) { // 空白键
        isSpeeding = false;
        clearInterval(gameInterval);
        currentSpeed = normalSpeed;
        gameInterval = setInterval(updateGame, currentSpeed);
    }
}

function startGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    direction = { x: 1, y: 0 };
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    food = [];
    generateFood();
    gameOverElement.classList.add("hidden");
    startButton.disabled = true;
    currentSpeed = normalSpeed;
    gameInterval = setInterval(updateGame, currentSpeed);
}

function updateGame() {
    moveSnake();
    if (checkCollision()) {
        endGame();
        return;
    }
    if (checkFood()) {
        eatFood();
    }
    drawGame();
}

function moveSnake() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);
    snake.pop();
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
        return true;
    }
    return false;
}

function generateFood() {
    while (food.length < 4) {
        const newFood = {
            x: Math.floor(Math.random() * width),
            y: Math.floor(Math.random() * height)
        };
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            food.push(newFood);
        }
    }
}

function checkFood() {
    const head = snake[0];
    for (let i = 0; i < food.length; i++) {
        if (food[i].x === head.x && food[i].y === head.y) {
            food.splice(i, 1);
            return true;
        }
    }
    return false;
}

function eatFood() {
    score++;
    scoreElement.textContent = `Score: ${score}`;
    const tail = snake[snake.length - 1];
    snake.push({ x: tail.x, y: tail.y });
    generateFood();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "yellow" : "green";
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
    // 先绘制蛇身
    snake.slice(1).forEach(segment => {
        ctx.fillStyle = "green";
        ctx.fillRect(segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    });
    // 最后绘制蛇头
    ctx.fillStyle = "yellow";
    ctx.fillRect(snake[0].x * tileSize, snake[0].y * tileSize, tileSize, tileSize);
    // 绘制食物
    food.forEach(piece => {
        ctx.fillStyle = "blue";
        ctx.fillRect(piece.x * tileSize, piece.y * tileSize, tileSize, tileSize);
    });
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const goingUp = direction.y === -1;
    const goingDown = direction.y === 1;
    const goingRight = direction.x === 1;
    const goingLeft = direction.x === -1;

    if (keyPressed === 37 || keyPressed === 65) {
        direction = { x: -1, y: 0 };
    }
    if (keyPressed === 38 || keyPressed === 87) {
        direction = { x: 0, y: -1 };
    }
    if (keyPressed === 39 || keyPressed === 68) {
        direction = { x: 1, y: 0 };
    }
    if (keyPressed === 40 || keyPressed === 83) {
        direction = { x: 0, y: 1 };
    }
}

function endGame() {
    clearInterval(gameInterval);
    gameOverElement.classList.remove("hidden");
    startButton.disabled = false;
}
