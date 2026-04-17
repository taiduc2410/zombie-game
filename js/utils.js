function distance(x1, y1, x2, y2) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function angle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}
