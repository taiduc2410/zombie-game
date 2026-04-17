const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

initGame(canvas);

// spawn zombies
setInterval(() => {
  if (game.gameOver || game.boss) return;

  game.zombies.push({
    x: Math.random() * canvas.width,
    y: -20,
    hp: 30
  });
}, 800);

// auto shoot
setInterval(() => {
  if (game.gameOver) return;
  if (!game.player) return;

  let target = null;
  let min = Infinity;

  // PRIORITY: BOSS > ZOMBIE
  if (game.boss && game.boss.hp > 0) {
    target = game.boss;
  } else {
    game.zombies.forEach(z => {
      let d = Math.hypot(
        z.x - game.player.x,
        z.y - game.player.y
      );

      if (d < min) {
        min = d;
        target = z;
      }
    });
  }

  if (!target) return;

  let dx = target.x - game.player.x;
  let dy = target.y - game.player.y;

  let a = Math.atan2(dy, dx);

  if (!isFinite(a)) return;

  game.bullets.push({
    x: game.player.x,
    y: game.player.y,
    vx: Math.cos(a) * 6,
    vy: Math.sin(a) * 6
  });

}, 400);

// loop
function loop() {
  updateGame(canvas);
  draw();
  requestAnimationFrame(loop);
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // player
  ctx.fillStyle = "green";
  ctx.beginPath();
  ctx.arc(game.player.x, game.player.y, 10, 0, Math.PI * 2);
  ctx.fill();

  // bullets
  ctx.fillStyle = "yellow";
  game.bullets.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // zombies
  ctx.fillStyle = "red";
  game.zombies.forEach(z => {
    ctx.beginPath();
    ctx.arc(z.x, z.y, 12, 0, Math.PI * 2);
    ctx.fill();
  });

  // boss
  if (game.boss) {
    ctx.fillStyle = "purple";
    ctx.beginPath();
    ctx.arc(game.boss.x, game.boss.y, 25, 0, Math.PI * 2);
    ctx.fill();
  }
}

function spawnBoss(canvas) {
  game.zombies = []; // 🔥 CLEAR ALL ZOMBIES

  setMessage && setMessage("A Hiệp xuất hiện");

  setTimeout(() => {
    game.boss = {
      x: canvas.width / 2,
      y: 100,
      hp: 300
    };
  }, 800);
}

// restart
document.getElementById("restart").onclick = function () {
  initGame(canvas);
};

loop();
