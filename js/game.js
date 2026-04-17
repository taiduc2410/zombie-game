var game = {
  player: null,
  zombies: [],
  bullets: [],
  items: [],
  boss: null,
  killCount: 0,
  gameOver: false
};

// ===================== INIT =====================
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

  showMessage(""); // từ message.js
  document.getElementById("restart").style.display = "none";
}

// ===================== UPDATE =====================
function updateGame(canvas) {
  if (game.gameOver) return;

  const p = game.player;

  // ===== PLAYER MOVE =====
  p.x += joy.x * 4;
  p.y += joy.y * 4;

  // ===== BULLETS =====
  for (let i = game.bullets.length - 1; i >= 0; i--) {
    const b = game.bullets[i];

    b.x += b.vx;
    b.y += b.vy;

    // remove out screen
    if (
      b.x < 0 || b.x > canvas.width ||
      b.y < 0 || b.y > canvas.height
    ) {
      game.bullets.splice(i, 1);
    }
  }

  // ===== ZOMBIES =====
  for (let i = game.zombies.length - 1; i >= 0; i--) {
    const z = game.zombies[i];

    let dx = p.x - z.x;
    let dy = p.y - z.y;
    let d = Math.hypot(dx, dy);
    if (d === 0) d = 1;

    z.x += dx / d;
    z.y += dy / d;

    if (d < 20) {
      p.hp -= 0.3;
    }

    // bullet hit zombie
    for (let j = game.bullets.length - 1; j >= 0; j--) {
      const b = game.bullets[j];

      if (Math.hypot(b.x - z.x, b.y - z.y) < 15) {
        z.hp -= 10;
        game.bullets.splice(j, 1);
      }
    }

    // zombie dead
    if (z.hp <= 0) {
      game.zombies.splice(i, 1);
      game.killCount++;

      // drop item
      if (Math.random() < 0.5) {
        game.items.push({
          x: z.x,
          y: z.y,
          type: Math.random() < 0.5 ? "gun" : "heal",
          time: Date.now()
        });
      }

      // spawn boss
      if (game.killCount === 99 && !game.boss) {
        setTimeout(() => {
          game.boss = {
            x: canvas.width / 2,
            y: 100,
            hp: 300
          };

          showMessage(MESSAGES.bossSpawn);
        }, 1500);
      }
    }
  }

  // ===== BOSS =====
  if (game.boss) {
    let dx = p.x - game.boss.x;
    let dy = p.y - game.boss.y;
    let d = Math.hypot(dx, dy);
    if (d === 0) d = 1;

    game.boss.x += dx / d;
    game.boss.y += dy / d;

    if (d < 30) {
      p.hp -= 0.6;
    }

    // bullet hit boss
    for (let i = game.bullets.length - 1; i >= 0; i--) {
      const b = game.bullets[i];

      if (Math.hypot(b.x - game.boss.x, b.y - game.boss.y) < 25) {
        game.boss.hp -= 10;
        game.bullets.splice(i, 1);
      }
    }

    // boss dead
    if (game.boss.hp <= 0) {
      showMessage(MESSAGES.bossDead);
      game.gameOver = true;
      document.getElementById("restart").style.display = "block";
    }
  }

  // ===== ITEMS =====
  for (let i = game.items.length - 1; i >= 0; i--) {
    const it = game.items[i];
    const d = Math.hypot(p.x - it.x, p.y - it.y);

    if (d < 20 && Date.now() - it.time > 300) {
      if (it.type === "gun") p.gun++;
      if (it.type === "heal") p.hp = Math.min(100, p.hp + 20);
      game.items.splice(i, 1);
    }
  }

  // ===== PLAYER DEAD =====
  if (p.hp <= 0) {
    if (!game.boss && game.killCount < 99) {
      showMessage(MESSAGES.playerLowHp);
    } else {
      showMessage(MESSAGES.playerDeadAfterBoss);
    }

    game.gameOver = true;
    document.getElementById("restart").style.display = "block";
  }

  // ===== UI =====
  document.getElementById("hp").innerText = Math.floor(p.hp);
  document.getElementById("gun").innerText = p.gun;
  document.getElementById("kill").innerText = game.killCount;
}
