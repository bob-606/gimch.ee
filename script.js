// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let isGameOver = false;

// Set up the canvas dimensions to match the viewport
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Kimchi jar (player)
const kimchi = {
  x: 50,
  y: canvas.height / 2,
  width: 50,
  height: 50,
  gravity: 1,
  lift: -15,
  velocity: 0,
};

// Obstacles
const obstacles = [];
const obstacleWidth = 50;
const obstacleGap = 333;

function drawKimchi() {
  ctx.fillStyle = '#ff6347'; // Kimchi jar color
  ctx.fillRect(kimchi.x, kimchi.y, kimchi.width, kimchi.height);
}

function drawObstacles() {
  obstacles.forEach((obs) => {
    ctx.fillStyle = '#8b0000'; // Obstacle color
    ctx.fillRect(obs.x, 0, obstacleWidth, obs.gapStart);
    ctx.fillRect(obs.x, obs.gapStart + obstacleGap, obstacleWidth, canvas.height);
  });
}

function updateObstacles() {
  if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
    const gapStart = Math.random() * (canvas.height - obstacleGap);
    obstacles.push({ x: canvas.width, gapStart });
  }

  obstacles.forEach((obs) => {
    obs.x -= 5; // Move obstacles
  });

  // Remove off-screen obstacles
  if (obstacles[0]?.x + obstacleWidth < 0) obstacles.shift();
}

function updateKimchi() {
  kimchi.velocity += kimchi.gravity;
  kimchi.y += kimchi.velocity;

  // Prevent falling off screen
  if (kimchi.y + kimchi.height > canvas.height) {
    kimchi.y = canvas.height - kimchi.height;
    kimchi.velocity = 0;
  }

  if (kimchi.y < 0) {
    kimchi.y = 0;
    kimchi.velocity = 0;
  }
}

function checkCollision() {
  obstacles.forEach((obs) => {
    if (
      kimchi.x < obs.x + obstacleWidth &&
      kimchi.x + kimchi.width > obs.x &&
      (kimchi.y < obs.gapStart || kimchi.y + kimchi.height > obs.gapStart + obstacleGap)
    ) {
      isGameOver = true;
    }
  });
}

function gameLoop() {
  if (isGameOver) {
    alert('Game Over! Your Score: ' + score);
    document.location.reload();
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawKimchi();
  drawObstacles();

  updateKimchi();
  updateObstacles();
  checkCollision();

  score += 1;
  document.getElementById('score').innerText = `Score: ${score}`;

  requestAnimationFrame(gameLoop);
}

// Enable touch input for kimchi jar jump
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent default touch behavior
  kimchi.velocity = kimchi.lift;
});

// Controls for desktop
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    kimchi.velocity = kimchi.lift;
  }
});

// Start the game
gameLoop();
