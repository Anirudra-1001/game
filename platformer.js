const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const gameContainer = document.getElementById('game-container');
const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const scoreSpan = document.getElementById('score');
const timerSpan = document.getElementById('timer');
const gameOverScreen = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const playAgainBtn = document.getElementById('play-again');

// Mobile controls
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const jumpBtn = document.getElementById('jump-btn');

let playerBottom = 0;
let playerLeft = 50;
let isJumping = false;
let gravity = 3;
let score = 0;
let timeLeft = 30;
let gameInterval;
let timerInterval;

// Platforms
const platforms = [
    {left: 0, bottom: 0, width: 600},
    {left: 150, bottom: 80, width: 100},
    {left: 300, bottom: 150, width: 100},
    {left: 450, bottom: 220, width: 100}
];

// Draw platforms
function drawPlatforms() {
    gameArea.innerHTML = '<div id="player"></div>'; // clear area
    platforms.forEach(p => {
        const plat = document.createElement('div');
        plat.classList.add('platform');
        plat.style.left = p.left + 'px';
        plat.style.bottom = p.bottom + 'px';
        plat.style.width = p.width + 'px';
        gameArea.appendChild(plat);
    });
}

// Start Game
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    resetGame();
});

// Play Again
playAgainBtn.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    resetGame();
});

function resetGame() {
    playerBottom = 0;
    playerLeft = 50;
    isJumping = false;
    score = 0;
    timeLeft = 30;
    scoreSpan.textContent = score;
    timerSpan.textContent = timeLeft;
    player.style.bottom = playerBottom + 'px';
    player.style.left = playerLeft + 'px';
    drawPlatforms();
    startTimer();
}

// Timer
function startTimer() {
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerSpan.textContent = timeLeft;
        if(timeLeft <= 0) endGame();
    }, 1000);

    gameInterval = setInterval(() => {
        score++;
        scoreSpan.textContent = score;
    }, 200);
}

// Controls - Keyboard
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') moveLeft();
    else if (e.key === 'ArrowRight') moveRight();
    else if (e.key === 'ArrowUp') jump();
});

function moveLeft() {
    if(playerLeft > 0) playerLeft -= 20;
    player.style.left = playerLeft + 'px';
}
function moveRight() {
    if(playerLeft < gameArea.clientWidth - 40) playerLeft += 20;
    player.style.left = playerLeft + 'px';
}

// Mobile Controls
leftBtn.addEventListener('touchstart', moveLeft);
rightBtn.addEventListener('touchstart', moveRight);
jumpBtn.addEventListener('touchstart', jump);

// Jump
function jump() {
    if(isJumping) return;
    isJumping = true;
    let jumpCount = 0;
    const jumpInterval = setInterval(() => {
        if(jumpCount < 15) playerBottom += 6;
        else {
            clearInterval(jumpInterval);
            fall();
        }
        player.style.bottom = playerBottom + 'px';
        jumpCount++;
    }, 20);
}

// Fall
function fall() {
    const fallInterval = setInterval(() => {
        if(playerBottom > 0) {
            playerBottom -= gravity;
            platforms.forEach(p => {
                if (
                    playerLeft + 40 > p.left &&
                    playerLeft < p.left + p.width &&
                    playerBottom <= p.bottom + 5 &&
                    playerBottom >= p.bottom - 5
                ) playerBottom = p.bottom;
            });
        }
        player.style.bottom = playerBottom + 'px';
        if(playerBottom <= 0) clearInterval(fallInterval);
    }, 20);
}

// End Game
function endGame() {
    clearInterval(timerInterval);
    clearInterval(gameInterval);
    gameContainer.style.display = 'none';
    finalScore.textContent = score;
    gameOverScreen.style.display = 'flex';
}
