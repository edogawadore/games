class Apple {
  constructor(snake) {
    this.x = 240;
    this.y = 60;
    this.snake = snake;
  }

  PositionCollide(x, y) {
    if (x === this.snake.x && y === this.snake.y) {
      return true;
    } else {
      for (let i = 0; i < this.snake.tail.length; i++) {
        if (x === this.snake.tail[i].x && y === this.snake.tail[i].y) {
          return true;
        }
      }
    }
    return false;
  }

  GetApplePostiion() {
    let x = this.x;
    let y = this.y;
    let randomVector;
    while (this.PositionCollide(x, y)) {
      randomVector = this.randomVector();
      x = randomVector.x;
      y = randomVector.y;
    }
    this.x = x;
    this.y = y;
  }

  randomVector() {
    return createVector(
      Math.floor(Math.random() * 25) * 20,
      Math.floor(Math.random() * 25) * 20
    );
  }

  Eaten() {
    this.GetApplePostiion();
  }

  Reset() {
    this.x = 240;
    this.y = 60;
  }

  Draw() {
    stroke("#212121");
    strokeWeight(2);
    fill("red");
    rect(this.x, this.y, 20, 20);
  }
}
