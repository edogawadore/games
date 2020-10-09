let player1;
let player2;

function setup() {
  createCanvas(700, 450);
  player1 = new Player("1");
  player2 = new Player("2");
}

function draw() {
  background("#212121");

  stroke("white");
  strokeWeight(20);
  fill("#212121");
  rect(0, 0, 700, 450);

  for (let i = 0; i <= 450 / 10 + 1; i++) {
    if (i % 2 === 1) {
      stroke("white");
      strokeWeight(0);
      fill("white");
      rect(700 / 2, i * 10, 10, 10);
    }
  }

  player1.Draw();
  player2.Draw();
}

function keyPressed() {
  if (keyCode === 87) {
    player1.Move(1);
  } else if (keyCode === 83) {
    player1.Move(-1);
  }

  if (keyCode === UP_ARROW) {
    player2.Move(1);
  } else if (keyCode === DOWN_ARROW) {
    player2.Move(-1);
  }
}

