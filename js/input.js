var joy = { x: 0, y: 0 };

window.addEventListener("load", () => {
  const joyDiv = document.getElementById("joystick");
  const stick = document.getElementById("stick");

  joyDiv.ontouchmove = function (e) {
    var t = e.touches[0];
    var rect = joyDiv.getBoundingClientRect();

    var x = t.clientX - rect.left - 50;
    var y = t.clientY - rect.top - 50;

    var dist = Math.sqrt(x * x + y * y);
    if (dist > 40) {
      x *= 40 / dist;
      y *= 40 / dist;
    }

    joy.x = x / 40;
    joy.y = y / 40;

    stick.style.left = x + 30 + "px";
    stick.style.top = y + 30 + "px";
  };

  joyDiv.ontouchend = function () {
    joy.x = 0;
    joy.y = 0;
    stick.style.left = "30px";
    stick.style.top = "30px";
  };
});
