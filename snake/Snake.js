class Snake {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.initialX = x;
    this.initialY = y;

    this.dx = 0;
    this.dy = 0;

    this.score = 0;
    this.tail = [];

    this.alive = true;
  }

  Dir(x, y) {
    if ((x != 0 && this.dx != -x) || (y != 0 && this.dy != -y)) {
      this.dx = x;
      this.dy = y;
    }
  }

  Move() {
    if (this.tail.length > 0) {
      let newHead = this.tail.pop();
      newHead.x = this.x;
      newHead.y = this.y;
      this.tail.unshift(newHead);
    }

    this.x += this.dx * 20;
    this.y += this.dy * 20;

    if (this.x > 480 || this.x < 0 || this.y > 480 || this.y < 0) {
      this.alive = false;
    }

    for (let i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        this.alive = false;
      }
    }
  }

  Eat(apple) {
    if (this.x === apple.x && this.y === apple.y) {
      apple.Eaten();
      this.score++;
      this.tail.push(createVector(this.x, this.y));
    }
  }

  Reset() {
    this.x = this.initialX;
    this.y = this.initialY;
    this.score = 0;
    this.tail = [];

    this.dx = 0;
    this.dy = 0;

    this.alive = true;
  }

  Draw() {
    stroke("#212121");
    strokeWeight(2);
    fill("rgb(0,255,0)");
    rect(this.x, this.y, 20, 20);
    for (let i = this.tail.length - 1; i >= 0; i--) {
      rect(this.tail[i].x, this.tail[i].y, 20, 20);
    }
  }
}
