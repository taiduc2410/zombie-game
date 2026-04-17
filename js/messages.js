const MESSAGES = {
  bossSpawn: "A Hiệp xuất hiện",

  playerLowHp: "Cố lên nào vợ iu",

  playerDeadAfterBoss: "A Hiệp đã chinh phục bạn, Tài Đức đã giải cứu bạn và cưới bạn",

  bossDead: "A Hiệp đã chết, chúc mừng bạn đã cưới Tài Đức"
};

function showMessage(text) {
  document.getElementById("message").innerText = text;
}
