/* LUV ME | confetti.js | v1.1.0 */
window.heartBurst = function () {
  const cv = document.getElementById('confetti'), ctx = cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  const icons = ['💜','💙','🌸','🦋','✨'];
  const ps = Array.from({length: 90}, () => ({
    x: cv.width / 2, y: cv.height * 0.45,
    vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4,
    s: 16 + Math.random() * 22, e: icons[Math.floor(Math.random() * icons.length)]
  }));
  let t = 0;
  (function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => {
      p.vy += .3; p.x += p.vx; p.y += p.vy;
      ctx.font = p.s + 'px serif'; ctx.fillText(p.e, p.x, p.y);
    });
    if (++t < 140) requestAnimationFrame(tick); else ctx.clearRect(0, 0, cv.width, cv.height);
  })();
};
