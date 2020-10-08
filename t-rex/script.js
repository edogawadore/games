const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Variables
let score;
let scoreText;
let highscore;
let highscoreText;
let player;
let gravity;
let obstacles = [];
let gameSpeed;
let keys = {};

let gameOver = false;
let gameOverText;

let start = false;
let startText;

let initialSpawnTimer = 150;
let spawnTimer = Math.random() * initialSpawnTimer;

// Event Listerners
document.addEventListener("keydown", function (evt) {
  keys[evt.code] = true;
});

document.addEventListener("keyup", function (evt) {
  keys[evt.code] = false;
});

class Player {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dy = 0;
    this.jumpForce = 8.7;
    this.originalWidth = w;
    this.originalHeight = h;
    this.grounded = false;
    this.jumpTimer = 0;
  }

  Animate() {
    // Jump
    if (keys["Space"] || keys["KeyW"] || keys["ArrowUp"]) {
      this.Jump();
    } else {
      this.jumpTimer = 0;
    }

    // Shrinking
    if (
      keys["ShiftLeft"] ||
      keys["ShiftRight"] ||
      keys["KeyS"] ||
      keys["ArrowDown"]
    ) {
      this.w = this.originalWidth * 2;
      this.h = this.originalHeight / 2;
    } else {
      this.w = this.originalWidth;
      this.h = this.originalHeight;
    }

    this.y += this.dy;

    // Gravity
    if (this.y + this.h < canvas.height) {
      this.dy += gravity;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.grounded = true;
      this.y = canvas.height - this.h;
    }

    this.Draw();
  }

  Jump() {
    if (this.grounded && this.jumpTimer === 0) {
      this.jumpTimer = 1;
      this.dy = -this.jumpTimer;
    } else if (this.jumpTimer > 0 && this.jumpTimer < 8.7) {
      this.jumpTimer++;
      this.dy = -this.jumpForce - this.jumpTimer / 8.7;
    }
  }

  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}

class Obstacle {
  constructor(x, y, w, h, c) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.dx = -gameSpeed;
  }

  Update() {
    this.x += this.dx;
    this.Draw();
    this.dx = -gameSpeed;
  }

  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.closePath();
  }
}

class Text {
  constructor(t, x, y, a, c, s) {
    this.t = t;
    this.x = x;
    this.y = y;
    this.a = a;
    this.c = c;
    this.s = s;
  }

  Draw() {
    ctx.beginPath();
    ctx.fillStyle = this.c;
    ctx.font = this.s + "px 'Press Start 2P'";
    ctx.textAlign = this.a;
    ctx.fillText(this.t, this.x, this.y);
    ctx.closePath();
  }
}

// Game Function
function spawnObstacle() {
  let type = RandomIntInRange(0, 5);
  let obstacle;

  // Flying obstacles
  if (type < 1) {
    let width = 40;
    let height = 60;
    obstacle = new Obstacle(
      canvas.width + width,
      canvas.height - height - player.originalHeight + 10,
      width,
      height,
      "orange"
    );
  }

  // Ground obstacles
  else {
    let width = RandomIntInRange(20, 40);
    let height = RandomIntInRange(30, 40);
    obstacle = new Obstacle(
      canvas.width + width,
      canvas.height - height,
      width,
      height,
      "blue"
    );
  }

  obstacles.push(obstacle);
}

function Collision(player, object) {
  if (
    player.x < object.x + object.w &&
    player.x + player.w > object.x &&
    player.y < object.y + object.h &&
    player.y + player.h > object.y
  ) {
    return true;
  } else {
    return false;
  }
}

function RandomIntInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function Start() {
  ctx.font = "20px";

  gameSpeed = 3;
  gravity = 1;

  score = 0;
  highscore = 0;
  if (localStorage.getItem("highscore")) {
    highscore = localStorage.getItem("highscore");
  }

  player = new Player(25, 0, 25, 40, "red");

  scoreText = new Text("Score: ", 25, 25, "left", "white", "15");
  highscoreText = new Text(
    "Highscore: " + highscore,
    canvas.width - 25,
    25,
    "right",
    "white",
    "15"
  );

  startText = new Text(
    "Press Space or Up",
    canvas.width / 2,
    canvas.height / 2 + 10,
    "center",
    "white",
    "20"
  );

  gameOverText = new Text(
    "Game Over",
    canvas.width / 2,
    canvas.height / 2 + 15,
    "center",
    "white",
    "40"
  );

  requestAnimationFrame(Update);
}

function Update() {
  requestAnimationFrame(Update);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  spawnTimer--;

  if (spawnTimer <= 0) {
    spawnObstacle();
    console.log(obstacles);
    spawnTimer = RandomIntInRange(90, initialSpawnTimer) - gameSpeed * 8;

    if (spawnTimer < 40) {
      spawnTimer = RandomIntInRange(30, 40);
    }
  }

  // Spawn Enemies
  for (let i = 0; i < obstacles.length; i++) {
    let obstacle = obstacles[i];

    if (obstacle.x + obstacle.w < 0) {
      obstacles.splice(i, 1);
    }

    if (Collision(player, obstacle)) {
      gameOver = true;
      break;
    }
    obstacle.Update();
  }

  player.Animate();

  score++;
  scoreText.t = "Score: " + Math.round(score / 5);
  scoreText.Draw();

  if (score > highscore) {
    highscore = score;
    highscoreText.t = "Highscore: " + highscore;
  }

  highscoreText.Draw();

  gameSpeed += 0.002;

  // Draw Ground
  ctx.beginPath();
  ctx.moveTo(0, canvas.height);
  ctx.lineTo(canvas.width, canvas.height);
  ctx.strokeStyle = "white";
  ctx.stroke();
  ctx.closePath();

  if (!start) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    score = 0;
    obstacles = [];
    spawnTimer = Math.random() * initialSpawnTimer;
    gameSpeed = 3;
    window.localStorage.setItem("highscore", highscore);

    player.Draw();
    scoreText.Draw();
    highscoreText.Draw();
    startText.Draw();

    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.stroke();
    ctx.closePath();

    if (keys["Space"] || keys["KeyW"] || keys["ArrowUp"]) {
      start = true;
    }
  }

  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    score = 0;
    obstacles = [];
    spawnTimer = Math.random() * initialSpawnTimer;
    gameSpeed = 3;
    window.localStorage.setItem("highscore", highscore);

    scoreText.Draw();
    highscoreText.Draw();
    gameOverText.Draw();

    if (keys["Space"] || keys["KeyW"] || keys["ArrowUp"]) {
      gameOver = false;
    }
  }
}

Start();
