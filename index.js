const level = [
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,1,1,1,1,1,1,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0
];
const coins = [
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,1,0,0,0,0,1,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,0,0,0,0
];
const levelWidth = 14;
const levelHeight = 10;
const scale = 4;
const tileSize = 16 * scale;
const canvasWidth = levelWidth * tileSize;
const canvasHeight = levelHeight * tileSize;

const FRICTION = 0.9;
const GRAVITY = 2;

const canvas = document.createElement('canvas');
canvas.width = canvasWidth;
canvas.height = canvasHeight;
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

const keyboard = {};

// game objects 
const player = {
  x: canvasWidth / 2,
  y: canvasHeight / 2,
  velocityX: 0,
  velocityY: 0,
  isJumping: false,
  update() {
    this.velocityY += GRAVITY;
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.velocityX *= FRICTION;
    this.velocityY *= FRICTION;

    if (this.x <= 0) {
      this.x = 0;
      this.velocityX = 0;
    } 
    
    if (this.x + (tileSize / 2) >= canvasWidth) {
      this.x = canvasWidth - (tileSize / 2);
      this.velocityX = 0;
    }

    if (this.y <= 0) {
      this.y = 0;
      this.velocityY = 0;
    }
    
    if (this.y + (tileSize / 2) >= canvasHeight) {
      this.y = canvasHeight - (tileSize / 2);
      this.velocityY = 0;
    }

    if (this.velocityY === 0) {
      this.isJumping = false;
    }
  },
  moveLeft() {
    this.velocityX -= 2;
  },
  moveRight() {
    this.velocityX += 2;
  },
  jump() {
    if (!this.isJumping) {
      this.isJumping = true;
      this.velocityY -= 40;
    }
  }
}

function tick(timestamp) {
  update();
  clear();
  draw();
  window.requestAnimationFrame(tick)
}

function update() {
  if (keyboard[37]) {
    player.moveLeft();
  }

  if (keyboard[39]) {
    player.moveRight();
  }

  if (keyboard[32]) {
    player.jump();
  }

  player.update();
}

function clear() {
  ctx.save();
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

function draw() {
  drawLevel();
  drawCoins();
  drawPlayer();
}

function drawLevel() {
  ctx.save();
  ctx.fillStyle = 'pink';
  for (let y = 0; y < levelHeight; y++) {
    for (let x = 0; x < levelWidth; x++) {
      const tile = level[x + (y * levelWidth)];
      if (tile === 0) {
        continue;
      }
      ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }
  ctx.restore();
}

function drawCoins() {
  ctx.save();
  ctx.fillStyle = 'gold';
  for (let y = 0; y < levelHeight; y++) {
    for (let x = 0; x < levelWidth; x++) {
      const tile = coins[x + (y * levelWidth)];
      if (tile === 0) {
        continue;
      }
      const coinSize = tileSize / 2;
      ctx.fillRect(x * tileSize + coinSize / 2, y * tileSize + coinSize / 2, coinSize, coinSize);
    }
  }
  ctx.restore();
}

function drawPlayer() {
  ctx.save();
  ctx.fillStyle = '#00FFFF';
  ctx.fillRect(player.x, player.y, tileSize / 2, tileSize / 2);
  ctx.restore();
}

document.addEventListener('keydown', (e) => {
  keyboard[e.keyCode] = true;
});
document.addEventListener('keyup', (e) => {
  delete keyboard[e.keyCode];
});

tick(0);
