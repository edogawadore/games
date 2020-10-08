let snake;
let apple;

function setup() {
  createCanvas(500, 500);
  snake = new Snake(240, 240);
  apple = new Apple(snake);
  frameRate(10);
}

function draw() {
  background("#212121");

  if (snake.alive) {
    snake.Eat(apple);
    snake.Move();
    apple.Draw();
    snake.Draw();
  } else {
    clear();
    fill("white");
    textSize(70);
    text("Game Over", 72, 230);
    textSize(30);
    text("Score: " + snake.score, 200, 300);
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    snake.Dir(0, -1);
  } else if (keyCode === DOWN_ARROW) {
    snake.Dir(0, 1);
  } else if (keyCode === RIGHT_ARROW) {
    snake.Dir(1, 0);
  } else if (keyCode === LEFT_ARROW) {
    snake.Dir(-1, 0);
  } else if (keyCode === ENTER) {
    clear();
    snake.Reset();
    apple.Reset();
  }
}
