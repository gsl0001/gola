/* ═══════════════════════════════════════════════════════════════════════
   Gola — site behaviour

   The wheel below is drawn to the shipping GeometryConfig defaults, and the
   four themes are the exact twelve-key blocks from the brand document. Both
   are single sources of truth: change a number here only when it changes in
   the app.
   ═══════════════════════════════════════════════════════════════════════ */

/* Feedback delivery. Point this at anything that accepts a POST of {message, email}.
   Blank it and the form opens a prefilled email instead, needing no backend. */
const FEEDBACK_ENDPOINT = 'https://formspree.io/f/mykrrjad';
const FEEDBACK_MAILTO = 'gsl456789@gmail.com';

/* ── Themes — config.json "theme" blocks, verbatim ──────────────────── */

const THEMES = [
  {
    id: 'midnight',
    name: 'Midnight',
    tag: 'shipped default',
    desc: 'Near-black glass, periwinkle highlight. Reads over dark and busy wallpapers alike.',
    keys: {
      slice: '#26FFFFFF', sliceHot: '#726E86FF', edge: '#45FFFFFF', edgeHot: '#CCAEBBFF',
      ink: '#FFFFFFFF', inkDim: '#FFB4B4C6', hub: '#D808080D', tint: '#9C08080E',
      accent: '#FF6E86FF', running: '#FF4AE38B', shell: '#FF0E0E14', card: '#FF15151C'
    }
  },
  {
    id: 'graphite',
    name: 'Graphite',
    tag: 'no hue at all',
    desc: 'For anyone who finds the blue loud. The only colour left is the running dot, which is the point of it.',
    keys: {
      slice: '#26FFFFFF', sliceHot: '#6AC9CEDA', edge: '#45FFFFFF', edgeHot: '#CCE4E7EE',
      ink: '#FFFFFFFF', inkDim: '#FFA9AEB8', hub: '#D80B0B0C', tint: '#9C0A0A0B',
      accent: '#FFC9CEDA', running: '#FF7FD8A4', shell: '#FF101011', card: '#FF17171A'
    }
  },
  {
    id: 'ember',
    name: 'Ember',
    tag: 'warm, low blue',
    desc: 'Same structure, warm end of the spectrum. Pairs with the amber the Focus dim card already uses.',
    keys: {
      slice: '#26FFFFFF', sliceHot: '#70FF8A5B', edge: '#45FFFFFF', edgeHot: '#CCFFC3A6',
      ink: '#FFFFFFFF', inkDim: '#FFC6B4AC', hub: '#D8120C08', tint: '#9C120C08',
      accent: '#FFFF8A5B', running: '#FFF5C55A', shell: '#FF141010', card: '#FF1C1614'
    }
  },
  {
    id: 'daylight',
    name: 'Daylight',
    tag: 'light glass',
    desc: 'Inverts the whole model: dark ink, white tint over the capture, wedges cut in black. Needs a light wallpaper.',
    keys: {
      slice: '#1F000000', sliceHot: '#5C6E86FF', edge: '#30000000', edgeHot: '#CC3B57E8',
      ink: '#FF12121A', inkDim: '#FF5A5F72', hub: '#E8F7F8FC', tint: '#78FFFFFF',
      accent: '#FF3B57E8', running: '#FF16A34A', shell: '#FFF4F5F9', card: '#FFFFFFFF'
    }
  }
];

/* Windows stores colours as #AARRGGBB. */
function argb(hex) {
  const h = hex.replace('#', '');
  if (h.length === 8) {
    return {
      a: parseInt(h.slice(0, 2), 16) / 255,
      r: parseInt(h.slice(2, 4), 16),
      g: parseInt(h.slice(4, 6), 16),
      b: parseInt(h.slice(6, 8), 16)
    };
  }
  return { a: 1, r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

const rgba = (c, a = c.a) => `rgba(${c.r}, ${c.g}, ${c.b}, ${Math.round(a * 1000) / 1000})`;
const solid = (c) => `rgb(${c.r}, ${c.g}, ${c.b})`;

function mix(c1, c2, t) {
  return {
    a: 1,
    r: Math.round(c1.r + (c2.r - c1.r) * t),
    g: Math.round(c1.g + (c2.g - c1.g) * t),
    b: Math.round(c1.b + (c2.b - c1.b) * t)
  };
}

function applyTheme(theme) {
  const k = theme.keys;
  const shell = argb(k.shell), card = argb(k.card), ink = argb(k.ink), inkDim = argb(k.inkDim);
  const root = document.documentElement.style;

  root.setProperty('--shell', solid(shell));
  root.setProperty('--surface', solid(mix(shell, card, 0.45)));
  root.setProperty('--card', solid(card));
  root.setProperty('--card-2', solid(mix(card, ink, 0.07)));
  root.setProperty('--ink', solid(ink));
  root.setProperty('--ink-dim', solid(inkDim));
  /* Body copy sits on --ink-faint, so it steps down from --ink-dim away from
     the background, never toward it — Daylight would otherwise wash out. */
  const lightShell = (shell.r * 0.299 + shell.g * 0.587 + shell.b * 0.114) > 140;
  root.setProperty('--ink-faint', solid(lightShell ? mix(inkDim, ink, 0.25) : mix(inkDim, shell, 0.18)));
  root.setProperty('--line', rgba(ink, 0.10));
  root.setProperty('--line-strong', rgba(ink, 0.18));
  root.setProperty('--accent', solid(argb(k.accent)));
  root.setProperty('--accent-ink', solid(shell));
  root.setProperty('--running', solid(argb(k.running)));

  root.setProperty('--w-slice', rgba(argb(k.slice)));
  root.setProperty('--w-slice-hot', rgba(argb(k.sliceHot)));
  root.setProperty('--w-edge', rgba(argb(k.edge)));
  root.setProperty('--w-edge-hot', rgba(argb(k.edgeHot)));
  root.setProperty('--w-ink', solid(ink));
  root.setProperty('--w-ink-dim', solid(inkDim));
  root.setProperty('--w-hub', rgba(argb(k.hub)));
  root.setProperty('--w-tint', rgba(argb(k.tint)));

  /* Overlays read the theme too, so Daylight does not get a black lightbox. */
  root.setProperty('--scrim', rgba(shell, 0.9));
  root.setProperty('--danger', lightShell ? '#C2410C' : '#FF8A5B');

  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', solid(shell));

  document.querySelectorAll('[data-theme-pick]').forEach(el => {
    const on = el.dataset.themePick === theme.id;
    el.setAttribute('aria-pressed', String(on));
    el.closest('.theme-card')?.classList.toggle('is-current', on);
  });

  try { localStorage.setItem('gola-theme', theme.id); } catch { /* private mode */ }
}

function themeJson(theme) {
  const rows = Object.entries(theme.keys)
    .map(([key, val]) => `  "${key}": "${val}"`)
    .join(',\n');
  return `"theme": {\n${rows}\n}`;
}

let apertureCount = 0;

function apertureSvg(size, stroke) {
  const id = 'ap' + apertureCount++;
  const s = size, r = s * 0.36, w = s * 0.22, c = s / 2;
  const p0 = [c + r * Math.cos(-Math.PI / 6), c + r * Math.sin(-Math.PI / 6)];
  const p1 = [c, c - r];
  const arc = `M${p0[0].toFixed(2)} ${p0[1].toFixed(2)} A${r} ${r} 0 1 1 ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8FDCFF"/><stop offset="50%" stop-color="#5B6CFF"/><stop offset="100%" stop-color="#B44BFF"/>
    </linearGradient></defs>
    <path d="${arc}" fill="none" stroke="${stroke || `url(#${id})`}" stroke-width="${w}" stroke-linecap="round"/>
  </svg>`;
}

function initThemes() {
  const dots = document.getElementById('themeDots');
  const grid = document.getElementById('themeGrid');
  // The dots live in the topbar and the grid in a page section, so the grid can legitimately be
  // absent. Requiring both used to disable the topbar switcher the moment that section went.
  if (!dots) return;

  THEMES.forEach(theme => {
    const k = theme.keys;

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'theme-dot';
    dot.dataset.themePick = theme.id;
    dot.setAttribute('aria-label', `${theme.name} theme`);
    dot.setAttribute('aria-pressed', 'false');
    dot.style.setProperty('--dot-fill',
      `linear-gradient(135deg, ${solid(argb(k.card))} 0 50%, ${solid(argb(k.accent))} 50% 100%)`);
    dot.addEventListener('click', () => applyTheme(theme));
    dots.appendChild(dot);

    const card = document.createElement('div');
    card.className = 'theme-card';
    card.innerHTML = `
      <button type="button" class="theme-pick" data-theme-pick="${theme.id}" aria-pressed="false">
        <span class="theme-swatch" style="background:${solid(argb(k.shell))}">
          ${apertureSvg(46, solid(argb(k.accent)))}
          <span class="theme-strip">
            <span style="background:${solid(argb(k.accent))}"></span>
            <span style="background:${solid(argb(k.running))}"></span>
            <span style="background:${solid(argb(k.card))}"></span>
            <span style="background:${solid(argb(k.inkDim))}"></span>
          </span>
        </span>
        <span class="theme-body">
          <span class="theme-name">${theme.name} <span class="theme-tag">${theme.tag}</span></span>
          <span class="theme-desc">${theme.desc}</span>
        </span>
      </button>
      <pre class="theme-json">${themeJson(theme)}</pre>`;
    card.querySelector('.theme-pick').addEventListener('click', () => applyTheme(theme));
    grid?.appendChild(card);
  });

  let saved = null;
  try { saved = localStorage.getItem('gola-theme'); } catch { /* private mode */ }
  const preferred = window.matchMedia('(prefers-color-scheme: light)').matches ? 'daylight' : 'midnight';
  applyTheme(THEMES.find(t => t.id === (saved || preferred)) || THEMES[0]);
}

/* ── The wheel ──────────────────────────────────────────────────────── */

/* GeometryConfig, refined plate 4a of the UI reference. */
const G = {
  hub: 66,
  innerIn: 100, innerOut: 196,
  disc: 204,
  outerIn: 208, outerOut: 296,
  gap: 2.5,
  fanSlice: 30,
  dwellToFan: 350
};

/* Slice artwork, drawn rather than typed. The sections used to render Segoe Fluent codepoints,
   which exist only on Windows - every visitor on a phone or a Mac got tofu boxes on the one
   element this page is built around. These are plain paths on a 24x24 grid, so they render
   everywhere and need no font. Only the sections need one: app slices
   render the real artwork, pulled off this machine by the same shell call the app itself uses. */
const ICONS = {
  power:    'M12 3.5v7.5M7.6 6.6a7.5 7.5 0 1 0 8.8 0',
  wrench:   'M17.2 3.4a4.6 4.6 0 0 0-4.3 6.2L3.3 19.3l1.6 1.6 9.7-9.6a4.6 4.6 0 1 0 2.6-7.9z',
  tray:     'M3.8 13.2h4.3l1.5 2.8h4.8l1.5-2.8h4.3M3.8 13.2l2.6-7.4h11.2l2.6 7.4v4.6a2 2 0 0 1-2 2H5.8a2 2 0 0 1-2-2z'
};

const ITEMS = [
  {
    label: 'Claude', kind: 'app', art: 'claude', windows: 3,
    fan: ['release notes', 'Gola — docs', 'store listing', 'New window']
  },
  { label: 'ChatGPT', kind: 'app', art: 'chatgpt', windows: 0, fan: ['Launch ChatGPT'] },
  { label: 'Antigravity', kind: 'app', art: 'antigravity', windows: 0, fan: ['Launch Antigravity'] },
  { label: 'Edge', kind: 'app', art: 'edge', windows: 2, fan: ['Partner Center', 'gola site', 'New window'] },
  { label: 'Files', kind: 'app', art: 'files', windows: 2, fan: ['Documents', 'Downloads', 'New window'] },
  { label: 'Terminal', kind: 'app', art: 'terminal', windows: 0, fan: ['Launch Terminal'] },
  {
    label: 'System', kind: 'section', icon: 'power',
    fan: ['Lock', 'Sleep', 'Volume', 'Wi-Fi', 'Task mgr', 'Settings']
  },
  {
    label: 'Tools', kind: 'section', icon: 'wrench',
    fan: ['Timer', 'Calculator', 'Colour', 'Magnifier', 'Caffeine', 'Focus dim']
  },
  {
    label: 'Shelf', kind: 'section', icon: 'tray',
    fan: ['ship-notes.md', 'IMG-2213.jpg', 'VOICE-2213.ogg', 'Open Shelf']
  }
];

/* Slice tile and the artwork inside it, in wheel units. */
const TILE = 42, ART = 27;

const SVG_NS = 'http://www.w3.org/2000/svg';
const STEP = 360 / ITEMS.length;

const pol = (r, deg) => {
  const a = (deg * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
};

function sector(a0, a1, r0, r1) {
  const large = a1 - a0 > 180 ? 1 : 0;
  const [x0, y0] = pol(r1, a0), [x1, y1] = pol(r1, a1);
  const [x2, y2] = pol(r0, a1), [x3, y3] = pol(r0, a0);
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r1} ${r1} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}` +
         ` L${x2.toFixed(2)} ${y2.toFixed(2)} A${r0} ${r0} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)} Z`;
}

function el(name, attrs, text) {
  const node = document.createElementNS(SVG_NS, name);
  for (const key in attrs) node.setAttribute(key, attrs[key]);
  if (text != null) node.textContent = text;
  return node;
}

function initWheel() {
  const stage = document.getElementById('wheelStage');
  const svg = document.getElementById('wheelSvg');
  if (!stage || !svg) return;

  const stateEl = document.getElementById('readoutState');
  const targetEl = document.getElementById('readoutTarget');
  const detailEl = document.getElementById('readoutDetail');

  const body = el('g', { class: 'wheel-body' });
  svg.appendChild(body);

  body.appendChild(el('circle', { class: 'w-disc', cx: 0, cy: 0, r: G.disc }));

  const fanLayer = el('g', { class: 'w-fan' });
  body.appendChild(fanLayer);

  const slices = ITEMS.map((item, i) => {
    const mid = -90 + i * STEP;
    const a0 = mid - STEP / 2 + G.gap / 2;
    const a1 = mid + STEP / 2 - G.gap / 2;

    const g = el('g');
    const path = el('path', { class: 'w-slice', d: sector(a0, a1, G.innerIn, G.innerOut) });
    g.appendChild(path);

    /* Three rows, the same as the shipping wheel: a rounded tile holding the icon, the label
       under it, then a status line - a running dot and window count for an app, the word
       "section" for a section. Apps show their real artwork, pulled off this machine by the
       same shell call the app itself uses; sections keep a drawn white glyph, which is what
       the app draws for them too. */
    /* One anchor per slice, then everything stacks vertically from it in screen space - which
       is what the shipping wheel does. Offsetting radially instead puts the label beside the
       tile on the left and right slices rather than under it. */
    const [ax, ay] = pol(148, mid);
    g.appendChild(el('rect', {
      class: 'w-tile', x: ax - TILE / 2, y: ay - 34, width: TILE, height: TILE, rx: 11
    }));

    if (item.art) {
      g.appendChild(el('image', {
        class: 'w-art', href: `assets/icons/apps/${item.art}.png`,
        x: ax - ART / 2, y: ay - 34 + (TILE - ART) / 2, width: ART, height: ART
      }));
    } else {
      // The drawn glyphs live on a 24-wide grid, so shift by half that to centre them in the tile.
      const art = el('g', { class: 'w-icon', transform: `translate(${(ax - 12).toFixed(2)} ${(ay - 34 + (TILE - 24) / 2).toFixed(2)})` });
      art.appendChild(el('path', { d: ICONS[item.icon] }));
      g.appendChild(art);
    }

    g.appendChild(el('text', { class: 'w-label', x: ax, y: ay + 16 }, item.label));

    if (item.kind === 'section') {
      g.appendChild(el('text', { class: 'w-sub', x: ax, y: ay + 30 }, 'section'));
    } else if (item.windows > 0) {
      g.appendChild(el('circle', { class: 'w-dot', cx: ax - 7, cy: ay + 30, r: 3.2 }));
      g.appendChild(el('text', { class: 'w-count', x: ax + 6, y: ay + 30 }, String(item.windows)));
    }

    body.appendChild(g);
    return { item, mid, path };
  });

  body.appendChild(el('circle', { class: 'w-hub', cx: 0, cy: 0, r: G.hub }));
  const hubTop = el('text', { class: 'w-hub-text', x: 0, y: -7 }, 'GOLA');
  const hubSub = el('text', { class: 'w-hub-text', x: 0, y: 9, style: 'opacity:.6' }, 'idle');
  body.appendChild(hubTop);
  body.appendChild(hubSub);

  const state = { open: false, slice: null, fanOf: null, fanHot: null, visible: false };
  let dwellTimer = null;
  let fanNodes = [];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function say(head, target, detail) {
    stateEl.textContent = head;
    targetEl.textContent = target;
    detailEl.textContent = detail;
  }

  function clearFan() {
    fanLayer.replaceChildren();
    fanNodes = [];
    state.fanOf = null;
    state.fanHot = null;
  }

  function drawFan(index) {
    clearFan();
    const { item, mid } = slices[index];
    const items = item.fan;
    const spread = Math.min(items.length * G.fanSlice, 320);
    const width = spread / items.length;
    const start = mid - spread / 2;

    fanNodes = items.map((label, i) => {
      const a0 = start + i * width + G.gap / 2;
      const a1 = start + (i + 1) * width - G.gap / 2;
      const centre = (a0 + a1) / 2;

      const g = el('g');
      const path = el('path', { class: 'w-slice', d: sector(a0, a1, G.outerIn, G.outerOut) });
      g.appendChild(path);

      const [tx, ty] = pol(252, centre);
      const short = label.length > 15 ? label.slice(0, 14) + '…' : label;
      g.appendChild(el('text', { class: 'w-label', x: tx, y: ty, style: 'font-size:12px' }, short));

      fanLayer.appendChild(g);
      return { label, a0, a1, path };
    });

    state.fanOf = index;
    hubSub.textContent = item.label.toLowerCase();
  }

  function setSlice(index, immediate) {
    if (state.slice === index) return;
    state.slice = index;
    slices.forEach((s, i) => s.path.classList.toggle('is-hot', i === index));
    clearTimeout(dwellTimer);

    if (index === null) {
      clearFan();
      hubSub.textContent = 'idle';
      say('Open', 'Nothing under the cursor', 'Release here and the wheel just dismisses — no accidental picks.');
      return;
    }

    const { item } = slices[index];
    const detail = item.kind === 'section'
      ? `Dwell ${G.dwellToFan} ms and the section fans its actions onto the outer ring.`
      : item.windows === 0
        ? 'Not running. Release and it launches.'
        : item.windows === 1
          ? 'One window. Release and it focuses.'
          : `${item.windows} live windows. Dwell ${G.dwellToFan} ms and they fan out.`;

    say('Slice', item.label, detail);

    if (immediate || reduceMotion) drawFan(index);
    else dwellTimer = setTimeout(() => drawFan(index), G.dwellToFan);
  }

  function setFanHot(index) {
    if (state.fanHot === index) return;
    state.fanHot = index;
    fanNodes.forEach((n, i) => n.path.classList.toggle('is-hot', i === index));
    if (index === null) return;
    say('Outer ring', fanNodes[index].label, 'Release here and this is what opens.');
  }

  function open() {
    if (state.open) return;
    state.open = true;
    stage.classList.add('is-open');
    hubSub.textContent = 'open';
    say('Open', 'Nothing under the cursor', 'Move onto a slice. Number keys 1–9 pick one directly.');
  }

  function close(message) {
    state.open = false;
    stage.classList.remove('is-open');
    clearTimeout(dwellTimer);
    slices.forEach(s => s.path.classList.remove('is-hot'));
    clearFan();
    state.slice = null;
    hubSub.textContent = 'idle';
    if (message) say('Released', message.target, message.detail);
    else say('Idle', 'Nothing under the cursor', 'The wheel sits closed in the tray until you hold the chord.');
  }

  function release() {
    if (!state.open) return;

    if (state.fanHot !== null && fanNodes[state.fanHot]) {
      const label = fanNodes[state.fanHot].label;
      const verb = label.startsWith('Launch') || label === 'New window' || label === 'Open Shelf' ? 'Ran' : 'Focused';
      close({ target: label, detail: `${verb} it and the wheel closed in one gesture.` });
      return;
    }
    if (state.slice !== null) {
      const { item } = slices[state.slice];
      const detail = item.kind === 'section'
        ? `Opened the ${item.label} section.`
        : item.windows === 0 ? `Launched ${item.label}.` : `Focused ${item.label}'s main window.`;
      close({ target: item.label, detail });
      return;
    }
    close({ target: 'Dismissed', detail: 'You released outside the wheel, so nothing ran.' });
  }

  /* The rect is cached because track() runs on every pointermove right after
     the previous move wrote classes — measuring there forces a layout. */
  let rect = null;
  const remeasure = () => { rect = stage.getBoundingClientRect(); };
  window.addEventListener('scroll', () => { if (state.open) remeasure(); }, { passive: true });
  window.addEventListener('resize', () => { rect = null; });

  /* Pointer geometry — the same maths the app does with the cursor. */
  function track(ev) {
    if (!state.open) return;
    if (!rect) remeasure();
    const scale = 620 / rect.width;
    const x = (ev.clientX - rect.left - rect.width / 2) * scale;
    const y = (ev.clientY - rect.top - rect.height / 2) * scale;
    const r = Math.hypot(x, y);
    let deg = (Math.atan2(y, x) * 180) / Math.PI;

    if (r >= G.outerIn - 6 && r <= G.outerOut + 6 && fanNodes.length) {
      const hit = fanNodes.findIndex(n => {
        let a = deg;
        while (a < n.a0 - 180) a += 360;
        while (a > n.a0 + 180) a -= 360;
        return a >= n.a0 && a <= n.a1;
      });
      setFanHot(hit === -1 ? null : hit);
      return;
    }
    setFanHot(null);

    if (r >= G.innerIn - 8 && r <= G.innerOut + 8) {
      const idx = (Math.round((deg + 90) / STEP) % ITEMS.length + ITEMS.length) % ITEMS.length;
      setSlice(idx, false);
      return;
    }
    if (r < G.hub) {
      setSlice(null, false);
      return;
    }
    if (r > G.outerOut + 20) setSlice(null, false);
  }

  stage.addEventListener('pointerdown', ev => {
    ev.preventDefault();
    stage.setPointerCapture(ev.pointerId);
    remeasure();
    open();
    track(ev);
  });
  stage.addEventListener('pointermove', track);
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', () => close());
  stage.addEventListener('pointerleave', () => { if (state.open) setSlice(null, false); });

  /* Hold Ctrl+Alt anywhere, but only while the wheel is actually on screen. */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      state.visible = entries[0].isIntersecting;
      if (!state.visible && state.open) close();
    }, { threshold: 0.35 }).observe(stage);
  } else {
    state.visible = true;
  }

  const isTyping = target =>
    target instanceof HTMLElement &&
    (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

  document.addEventListener('keydown', ev => {
    if (!state.visible) return;

    if (ev.key === 'Escape' && state.open) {
      close({ target: 'Closed', detail: 'Esc closes the wheel without running anything.' });
      return;
    }
    if (isTyping(ev.target)) return;

    if (state.open && ev.key >= '1' && ev.key <= '9') {
      const idx = Number(ev.key) - 1;
      if (idx < ITEMS.length) {
        ev.preventDefault();
        setSlice(idx, true);
      }
      return;
    }

    /* Windows reports AltGr as Ctrl+Alt — the collision the FAQ documents.
       Only a real Ctrl+Alt press opens the wheel, never AltGr composing a
       character, and never a bare letter arriving with those flags set. */
    if ((ev.key === 'Control' || ev.key === 'Alt') &&
        !ev.getModifierState('AltGraph') &&
        ev.ctrlKey && ev.altKey && !ev.shiftKey && !state.open) {
      ev.preventDefault();
      remeasure();
      open();
    }
  });

  document.addEventListener('keyup', ev => {
    if (state.open && (!ev.ctrlKey || !ev.altKey) && (ev.key === 'Control' || ev.key === 'Alt')) release();
  });

  window.addEventListener('blur', () => { if (state.open) close(); });
}

/* ── Clips ──────────────────────────────────────────────────────────── */

function initClips() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const videos = document.querySelectorAll('.clip-frame video');

  /* No controls here: the video sits inside the button that opens the
     lightbox, and a control surface over it swallows that click. Reduced
     motion gets the poster, and the lightbox provides the controls. */
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting) {
          if (v.preload === 'none') v.preload = 'auto';
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: 0.25 });
    videos.forEach(v => io.observe(v));
  }

  const box = document.getElementById('lightbox');
  const boxVideo = document.getElementById('lightboxVideo');
  const boxCaption = document.getElementById('lightboxCaption');
  const boxClose = document.getElementById('lightboxClose');
  if (!box) return;

  let opener = null;
  /* inert keeps focus inside the dialog — without it Tab walks straight into
     the page the scrim is covering. */
  const behind = [document.querySelector('header'), document.querySelector('main'),
                  document.querySelector('footer')].filter(Boolean);

  function show(button) {
    opener = button;
    boxVideo.src = button.dataset.src;
    boxCaption.textContent = button.dataset.caption || '';
    box.hidden = false;
    behind.forEach(n => n.setAttribute('inert', ''));
    document.body.style.overflow = 'hidden';
    boxVideo.play().catch(() => {});
    boxClose.focus();
  }

  function hide() {
    box.hidden = true;
    boxVideo.pause();
    boxVideo.removeAttribute('src');
    behind.forEach(n => n.removeAttribute('inert'));
    document.body.style.overflow = '';
    opener?.focus();
  }

  document.querySelectorAll('.clip-frame').forEach(btn => {
    btn.addEventListener('click', () => show(btn));
  });
  boxClose.addEventListener('click', hide);
  box.addEventListener('click', ev => { if (ev.target === box) hide(); });
  document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && !box.hidden) hide(); });
}

/* ── Chord chips ────────────────────────────────────────────────────── */

function initChord() {
  const chips = document.querySelectorAll('.chip[data-mod]');
  const preview = document.getElementById('chordPreview');
  if (!chips.length || !preview) return;

  function render() {
    const on = [...chips].filter(c => c.classList.contains('is-on')).map(c => c.dataset.mod);
    preview.innerHTML = on.length
      ? `Hold <b>${on.join(' + ')}</b>`
      : 'Pick at least one modifier — the wheel needs a key you can hold.';
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('is-on');
      chip.setAttribute('aria-pressed', String(chip.classList.contains('is-on')));
      render();
    });
    chip.setAttribute('aria-pressed', String(chip.classList.contains('is-on')));
  });
  render();
}

/* ── FAQ filter ─────────────────────────────────────────────────────── */

function initFaq() {
  const input = document.getElementById('faqSearch');
  const empty = document.getElementById('faqEmpty');
  if (!input) return;
  const items = [...document.querySelectorAll('.faq-item')];

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    items.forEach(item => {
      const hit = !q || item.textContent.toLowerCase().includes(q);
      item.hidden = !hit;
      if (hit) shown++;
      if (hit && q) item.open = true;
    });
    empty.hidden = shown > 0;
  });
}

/* ── Feedback ───────────────────────────────────────────── */

function initFeedback() {
  const form = document.getElementById('feedbackForm');
  if (!form) return;
  const message = document.getElementById('feedbackMessage');
  const email = document.getElementById('feedbackEmail');
  const status = document.getElementById('feedbackStatus');
  const button = document.getElementById('feedbackSend');
  const segs = [...form.querySelectorAll('.seg-btn')];

  // feedback | feature | bug. Drives the mail subject, so it has to survive to submit time.
  let kind = 'feedback';
  const SEND_LABEL = { feedback: 'Send feedback', feature: 'Send request', bug: 'Send report' };

  segs.forEach(btn => btn.addEventListener('click', () => {
    kind = btn.dataset.kind;
    segs.forEach(b => {
      const on = b === btn;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-pressed', String(on));
    });
    button.textContent = SEND_LABEL[kind];
  }));

  function report(text, tone) {
    status.textContent = text;
    status.className = 'form-status' + (tone ? ' is-' + tone : '');
  }

  form.addEventListener('submit', ev => {
    ev.preventDefault();
    const body = message.value.trim();
    const from = email.value.trim();

    // The message is the point; the address is optional, so it is only checked when given.
    if (body.length < 4) {
      report('Say a little more and I can actually act on it.', 'bad');
      message.focus();
      return;
    }
    if (from && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(from)) {
      report('That address does not look complete. Clear it or correct it.', 'bad');
      email.focus();
      return;
    }

    const subject = `Gola ${kind}`;

    if (!FEEDBACK_ENDPOINT) {
      window.location.href =
        `mailto:${FEEDBACK_MAILTO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      report('Opening your mail app.', 'ok');
      return;
    }

    button.disabled = true;
    report('Sending…');

    fetch(FEEDBACK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        message: body,
        email: from || '(not given)',
        kind,
        // Formspree reads _subject as the subject of the mail it sends on.
        _subject: subject
      })
    })
      .then(res => {
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        report(from ? 'Landed — I will reply.' : 'Landed. Thank you.', 'ok');
      })
      .catch(() => {
        // Covers the monthly quota running out as well as a network failure: either way the
        // person keeps their words instead of losing them to a dead form.
        report(`That did not go through. Email ${FEEDBACK_MAILTO} instead — it reaches the same place.`, 'bad');
      })
      .finally(() => { button.disabled = false; });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThemes();
  initWheel();
  initClips();
  initChord();
  initFaq();
  initFeedback();
});
