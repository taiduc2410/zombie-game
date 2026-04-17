var game = {
  player: null,
  zombies: [],
  bullets: [],
  items: [],
  boss: null,
  killCount: 0,
  gameOver: false
};

function initGame(canvas) {
  game.player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    hp: 100,
    gun: 1
  };

  game.zombies = [];
  game.bullets = [];
  game.items = [];
  game.boss = null;
  game.killCount = 0;
  game.gameOver = false;

  document.getElementById("message").innerText = "";
  document.getElementById("restart").style.display = "none";
}

function updateGame(canvas) {
  if (game.gameOver) return;

  const p = game.player;

  // move player
  p.x += joy.x * 4;
  p.y += joy.y * 4;

  // bullets
  game.bullets.forEach(b => {
    b.x += b.vx;
    b.y += b.vy;
  });

  // zombies chase
  game.zombies.forEach(z => {
    let dx = p.x - z.x;
    let dy = p.y - z.y;
    let d = Math.hypot(dx, dy);

    z.x += dx / d;
    z.y += dy / d;

    if (d < 20) p.hp -= 0.3;
  });

  // boss
  if (game.boss) {
    let dx = p.x - game.boss.x;
    let dy = p.y - game.boss.y;
    let d = Math.hypot(dx, dy);

    game.boss.x += dx / d;
    game.boss.y += dy / d;

    if (d < 30) p.hp -= 0.6;
  }

  // death check
  if (p.hp <= 0) {
    game.gameOver = true;
    document.getElementById("restart").style.display = "block";
    document.getElementById("message").innerText = "Game Over";
  }

  // UI
  document.getElementById("hp").innerText = Math.floor(p.hp);
  document.getElementById("gun").innerText = p.gun;
  document.getElementById("kill").innerText = game.killCount;
}
