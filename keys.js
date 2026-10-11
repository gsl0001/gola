// The page's keycaps press. Hero: hold Ctrl+Alt on your keyboard, or press both caps.
// Chord board: light any combination. Hold/Flick/Release types itself once when scrolled to.

const chord = document.querySelector('[data-chord]');
if (chord) {
  const caps = [...chord.querySelectorAll('[data-key]')];
  const say = chord.querySelector('[data-say]');
  const idle = say.textContent;
  const sync = () => {
    const held = caps.every(c => c.classList.contains('is-down'));
    chord.classList.toggle('is-held', held);
    caps.forEach(c => c.setAttribute('aria-pressed', c.classList.contains('is-down')));
    say.textContent = held ? 'That’s it. With Gola running, the wheel is open under your cursor now.' : idle;
  };
  const set = (name, down) => {
    const cap = caps.find(c => c.dataset.key === name);
    if (cap && cap.classList.contains('is-down') !== down) { cap.classList.toggle('is-down', down); sync(); }
  };
  addEventListener('keydown', e => set(e.key, true));
  addEventListener('keyup', e => set(e.key, false));
  addEventListener('blur', () => caps.forEach(c => set(c.dataset.key, false)));
  // Pointer: a press holds the cap down until release, so two fingers (or two clicks) make the chord.
  caps.forEach(c => {
    c.addEventListener('pointerdown', e => { e.preventDefault(); set(c.dataset.key, !c.classList.contains('is-down')); });
    c.addEventListener('click', e => { if (e.detail === 0) set(c.dataset.key, !c.classList.contains('is-down')); });
  });
}

const board = document.querySelector('[data-board]');
if (board) {
  const out = document.querySelector('[data-chord-out]');
  const mods = [...board.querySelectorAll('[data-mod]')];
  const mice = [...board.querySelectorAll('[data-mouse]')];
  const on = list => list.filter(b => b.getAttribute('aria-pressed') === 'true');
  const render = () => {
    const m = on(mods).map(b => b.dataset.mod);
    const p = on(mice).map(b => b.dataset.mouse);
    let text, note = '';
    if (p.length) { text = 'Hold ' + p.join(' + '); note = 'Gola takes this button over'; }
    else if (m.length) {
      text = m.join(' + ');
      if (text === 'Ctrl + Alt') note = 'the default';
      else if (m.length === 1) note = 'pair it with another modifier';
    } else { text = 'Pick a key or a button'; }
    out.innerHTML = '';
    out.append(text);
    if (note) { const s = document.createElement('span'); s.textContent = ' · ' + note; out.append(s); }
  };
  board.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const lit = b.getAttribute('aria-pressed') !== 'true';
    // A key chord or a mouse button, not both: lighting one group clears the other.
    (b.dataset.mod ? mice : mods).forEach(x => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', lit);
    render();
  });
  render();
}

const stroke = document.querySelector('[data-stroke]');
if (stroke && 'IntersectionObserver' in window) {
  const keys = [...stroke.querySelectorAll('.key')];
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    keys.forEach((k, i) => {
      setTimeout(() => k.classList.add('is-down', 'key-lit'), 250 + i * 420);
      setTimeout(() => k.classList.remove('is-down'), 250 + i * 420 + 260);
    });
    setTimeout(() => keys.forEach(k => k.classList.remove('key-lit')), 250 + keys.length * 420 + 900);
  }, { threshold: 0.6 });
  io.observe(stroke);
}
