let bird;
let pipes = [];

const gravity = 0.3;

let pipeSpace = 240;
let acc = 0.05;

let over = false;

function Init() {
  CreateObjects();
  Update();
}

function Update() {
  bird.update();
  if (pipes.last().x < innerWidth - pipeSpace) CreatePipe();
  for (const pipe of pipes) pipe.update();

  if (!over) requestAnimationFrame(Update);
}

function CreateObjects() {
  CreateBird();
  CreatePipe();
}

function CreateBird() {
  const x = innerWidth / 4;
  const y = innerHeight / 4;
  const r = 16;
  const force = 7;
  bird = new Bird(x, y, r, force);
}

function CreatePipe() {
  const vel = 3 + bird.score * acc;
  const w = 48;
  const h = 160;
  pipes.push(new Pipe(vel, w, h));
}

class Bird {
  constructor(x, y, r, f) {
    this.x = x;
    this.y = y;
    this.v = 0;

    this.score = 0;

    this.jumpForce = f;

    this.r = r;

    this.createHTML();
  }

  createHTML() {
    this.html = document.createElement("div");
    this.html.id = "bird";
    document.body.append(this.html);
    this.html.style.setProperty("--w", `${2 * this.r}px`);

    this.updatePosition();
  }

  jump() {
    this.v = -this.jumpForce;
  }

  updatePosition() {
    this.v += gravity;
    this.y += this.v;
    this.html.style.left = `${this.x}px`;
    this.html.style.top = `${this.y}px`;
  }

  update() {
    this.updatePosition();
    this.checkGameOver();
  }

  checkGameOver() {
    this.checkCollision();
    this.checkBorder();
  }

  checkBorder() {
    if (this.y < 0 || this.y > innerHeight) return GameOver();
  }

  checkCollision() {
    for (const pipe of pipes) {
      if (pipe.x > this.x + this.r) return;

      if (
        this.x > pipe.x &&
        this.x < pipe.x + pipe.w &&
        (
          this.y < pipe.holeY ||
          this.y > pipe.holeY + pipe.holeH
        )
      ) {
        return GameOver();
      }
    }
  }
}

class Pipe {
  constructor(v, w, h) {
    this.x = innerWidth;
    this.v = v;
    this.w = w;

    this.holeH = h;
    this.holeY = Math.random() * (innerHeight - this.holeH);

    this.scored = false;

    this.createHTML();
  }

  createHTML() {
    this.html = {
      pipe: document.createElement("div"),
      hole: document.createElement("div"),
    };

    this.html.pipe.classList.add("pipe");
    this.html.hole.classList.add("pipe-hole");

    document.body.append(this.html.pipe);
    this.html.pipe.append(this.html.hole);

    this.html.pipe.style.setProperty("--w", `${this.w}px`);
    this.html.pipe.style.setProperty("--h", `${this.holeH}px`);
    this.html.hole.style.top = `${this.holeY}px`;

    this.updatePosition();
  }

  updatePosition() {
    this.x -= this.v;
    this.html.pipe.style.left = `${this.x}px`;
  }

  update() {
    this.updatePosition();
    this.checkScore();
    this.checkOver();
  }

  checkScore() {
    if (this.scored) return;
    if (this.x + this.w < bird.x) {
      bird.score++;
      this.scored = true;
    }
  }

  checkOver() {
    if (this.x + this.w < -this.w) {
      pipes.splice(0, 1);
      this.html.pipe.remove();
    }
  }
}

function GameOver() {
  console.log("game over");
  console.log("score:", bird.score);
  over = true;

  const scoreBoard = document.createElement("div");
  scoreBoard.id = "scoreboard";
  document.body.append(scoreBoard);
  scoreBoard.innerHTML = `Score: ${bird.score}`;
}

Array.prototype.last = function () {
  return this[this.length - 1];
};
document.addEventListener("keypress", (e) => {
  if (e.key == " ") bird.jump();
});

Init();
