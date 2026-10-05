/* LUV ME | main.js | v1.1.0 */
(() => {
  const C = Object.assign({}, window.SITE_CONFIG);
  const q = new URLSearchParams(location.search);
  if (q.get('to')) C.toName = q.get('to');
  if (q.get('from')) C.fromName = q.get('from');

  const $ = id => document.getElementById(id);
  const yes = $('yes'), no = $('no'), hint = $('hint'), mouth = $('mouth');
  const mouths = {happy: 'M46 62q14 18 28 0', normal: 'M50 66q10 10 20 0', sad: 'M50 74q10-10 20 0'};
  const setMouth = m => mouth.setAttribute('d', mouths[m]);

  $('hello').textContent = C.toName ? `Hey ${C.toName},` : 'Hey you,';
  $('question').textContent = C.question;
  yes.textContent = C.yesText;
  no.textContent = C.noText;
  document.title = C.question + ' 💜';

  // floating hearts background
  const bg = $('bg');
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span');
    s.textContent = ['💜','💙','🌸','✨'][i % 4];
    s.style.cssText = `left:${Math.random()*100}%;font-size:${16+Math.random()*22}px;` +
      `animation-duration:${9+Math.random()*10}s;animation-delay:-${Math.random()*14}s`;
    bg.appendChild(s);
  }

  // the runaway "No"
  let tries = 0, last = 0;
  function dodge() {
    const now = Date.now();
    if (now - last < 350) return;           // ignore double-fires (touch + click)
    last = now; tries++;
    hint.textContent = C.noMessages[Math.min(tries - 1, C.noMessages.length - 1)];
    setMouth('sad');
    yes.style.setProperty('--grow', Math.min(1 + tries * 0.12, 1.9));
    if (tries >= C.hideNoAfter) { no.style.visibility = 'hidden'; no.disabled = true; return; }
    no.classList.add('flying');
    const w = no.offsetWidth, h = no.offsetHeight, pad = 14, yr = yes.getBoundingClientRect();
    let x, y, n = 0;
    do {
      x = pad + Math.random() * (innerWidth - w - 2 * pad);
      y = pad + Math.random() * (innerHeight - h - 2 * pad);
    } while (n++ < 12 && x < yr.right + 10 && x + w > yr.left - 10 && y < yr.bottom + 10 && y + h > yr.top - 10);
    no.style.left = x + 'px'; no.style.top = y + 'px';
  }
  no.addEventListener('pointerenter', dodge);
  no.addEventListener('click', dodge);

  // the happy ending
  let pick = C.dates[0];
  yes.addEventListener('click', () => {
    $('ask').hidden = true; $('yay').hidden = false; no.style.visibility = 'hidden';
    $('yayTitle').textContent = C.yayTitle;
    $('yayText').textContent = C.yayText;
    setMouth('happy'); window.heartBurst();
    const box = $('dates');
    C.dates.forEach((d, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = d;
      b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', i === 0);
      b.onclick = () => {
        pick = d;
        box.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-checked', c === b));
      };
      box.appendChild(b);
    });
  });

  const share = $('share');
  share.href = `https://t.me/${C.telegram}`;
  share.addEventListener('click', () => {
    const text = `Yes! 💜 I'd love to date you${C.fromName ? ', ' + C.fromName : ''}. ` +
      `Let's start with: ${pick}${C.toName ? ' — ' + C.toName : ''}`;
    const copied = navigator.clipboard ? navigator.clipboard.writeText(text).then(() => true, () => false) : Promise.resolve(false);
    copied.then(ok => {
      $('status').textContent = ok ? 'Answer copied. Paste it in the chat 💌' : `Tell me which date you picked: ${pick}`;
    });
  });
})();
