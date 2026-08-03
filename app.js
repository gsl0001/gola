/**
 * Gola Interactive Web Experience
 * Interactive Radial Wheel, Theme Engine, FAQ Search, Keyboard Shortcuts
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initRadialWheel();
  initFaqSearch();
  initAccordion();
});

/* --- Theme Switcher Engine --- */
function initThemeEngine() {
  const themeBtns = document.querySelectorAll('.theme-btn');
  const storedTheme = localStorage.getItem('gola-theme') || 'midnight';
  
  setTheme(storedTheme);

  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme-set');
      setTheme(theme);
    });
  });

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gola-theme', theme);

    themeBtns.forEach(btn => {
      if (btn.getAttribute('data-theme-set') === theme) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }
}

/* --- Interactive Radial Wheel Component --- */
function initRadialWheel() {
  const canvasWrap = document.getElementById('wheelCanvasWrap');
  if (!canvasWrap) return;

  const innerSlices = [
    { id: 'chrome', name: 'Google Chrome', icon: '🌐', running: true, count: 3, desc: '3 live windows open. Release to focus main window or slide onto outer fan preview.' },
    { id: 'vscode', name: 'VS Code', icon: '💻', running: true, count: 2, desc: '2 workspace windows open. Green dot indicates running status.' },
    { id: 'terminal', name: 'Terminal', icon: '⚡', running: true, count: 1, desc: '1 window open. Flick to slice & release to bring to front.' },
    { id: 'tools', name: 'Tools', icon: '🛠️', running: false, count: 10, desc: '10 popover utilities: Timer, Calculator, Color Picker, Clipboard, Magnifier, Screenshot, Note, Caffeine, Focus Dim, Dictate.' },
    { id: 'system', name: 'System', icon: '⚙️', running: false, count: 6, desc: '6 quick actions: Settings, Task Manager, Wi-Fi, Volume, Sleep, Lock.' },
    { id: 'shelf', name: 'Shelf', icon: '📥', running: false, count: 7, desc: '7-day inbox of recent files with preview & search. Connected to Telegram bot.' },
    { id: 'spotify', name: 'Spotify', icon: '🎵', running: true, count: 1, desc: 'Music playback active. Release to switch focus.' },
    { id: 'explorer', name: 'File Explorer', icon: '📁', running: false, count: 0, desc: 'Not running. Release slice to launch new instance.' }
  ];

  let activeSliceIndex = 0;
  let wheelOpen = true;
  let activeChord = 'Ctrl+Alt';

  const sliceTitle = document.getElementById('activeSliceTitle');
  const sliceDesc = document.getElementById('activeSliceDesc');
  const triggerBtns = document.querySelectorAll('.chord-trigger-btn');

  // Render SVG Wheel Structure
  function renderSvgWheel() {
    const size = 380;
    const center = size / 2;
    const innerRadius = 55;
    const outerRadius = 140;
    const numSlices = innerSlices.length;
    const angleStep = (2 * Math.PI) / numSlices;

    let svgHtml = `<svg width="100%" height="100%" viewBox="0 0 ${size} ${size}" style="user-select:none; overflow:visible;">
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <linearGradient id="sliceGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="rgba(110, 134, 255, 0.3)"/>
          <stop offset="100%" stop-color="rgba(180, 75, 255, 0.15)"/>
        </linearGradient>
      </defs>

      <!-- Center Frosted Core -->
      <circle cx="${center}" cy="${center}" r="${innerRadius - 5}" fill="rgba(21, 21, 28, 0.9)" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
      <circle cx="${center}" cy="${center}" r="12" fill="url(#g)"/>
    `;

    innerSlices.forEach((slice, i) => {
      const startAngle = i * angleStep - Math.PI / 2;
      const endAngle = (i + 1) * angleStep - Math.PI / 2;
      const midAngle = (startAngle + endAngle) / 2;

      // Arc path
      const x1 = center + innerRadius * Math.cos(startAngle);
      const y1 = center + innerRadius * Math.sin(startAngle);
      const x2 = center + outerRadius * Math.cos(startAngle);
      const y2 = center + outerRadius * Math.sin(startAngle);
      const x3 = center + outerRadius * Math.cos(endAngle);
      const y3 = center + outerRadius * Math.sin(endAngle);
      const x4 = center + innerRadius * Math.cos(endAngle);
      const y4 = center + innerRadius * Math.sin(endAngle);

      const pathData = `M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`;

      const isActive = i === activeSliceIndex;
      const fill = isActive ? 'url(#sliceGrad)' : 'rgba(21, 21, 28, 0.65)';
      const stroke = isActive ? 'rgba(110, 134, 255, 0.8)' : 'rgba(255, 255, 255, 0.08)';

      // Icon & label center position
      const labelRadius = (innerRadius + outerRadius) / 2;
      const lx = center + labelRadius * Math.cos(midAngle);
      const ly = center + labelRadius * Math.sin(midAngle);

      // Running Dot position
      const dotRadius = outerRadius - 12;
      const dx = center + dotRadius * Math.cos(midAngle);
      const dy = center + dotRadius * Math.sin(midAngle);

      svgHtml += `
        <g class="wheel-slice-group" data-index="${i}" style="cursor:pointer;">
          <path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${isActive ? 2.5 : 1}" 
                style="transition: all 0.2s ease; ${isActive ? 'filter:url(#glow);' : ''}" />
          <text x="${lx}" y="${ly + 5}" text-anchor="middle" font-size="20" fill="#fff">${slice.icon}</text>
          ${slice.running ? `<circle cx="${dx}" cy="${dy}" r="4.5" fill="#4AE38B" />` : ''}
          <text x="${lx}" y="${ly + 22}" text-anchor="middle" font-size="10" font-weight="600" fill="rgba(255,255,255,0.7)">[${i + 1}]</text>
        </g>
      `;
    });

    // Outer Ring Fan Preview for Active Slice
    const activeSlice = innerSlices[activeSliceIndex];
    if (activeSlice && activeSlice.count > 0) {
      const activeAngle = (activeSliceIndex + 0.5) * angleStep - Math.PI / 2;
      const fanDistance = outerRadius + 45;
      const fx = center + fanDistance * Math.cos(activeAngle);
      const fy = center + fanDistance * Math.sin(activeAngle);

      svgHtml += `
        <!-- Outer Fan Indicator -->
        <g transform="translate(${fx}, ${fy})">
          <rect x="-60" y="-18" width="120" height="36" rx="18" fill="rgba(110, 134, 255, 0.95)" shadow="0 4px 12px rgba(0,0,0,0.4)" />
          <text x="0" y="4" text-anchor="middle" font-size="12" font-weight="700" fill="#FFF">
            ${activeSlice.count} ${activeSlice.count === 1 ? 'Preview' : 'Items'} ➜
          </text>
        </g>
      `;
    }

    svgHtml += `</svg>`;
    canvasWrap.innerHTML = svgHtml;

    // Attach click & hover events
    const sliceGroups = canvasWrap.querySelectorAll('.wheel-slice-group');
    sliceGroups.forEach(group => {
      group.addEventListener('mouseenter', () => {
        const idx = parseInt(group.getAttribute('data-index'), 10);
        selectSlice(idx);
      });
      group.addEventListener('click', () => {
        const idx = parseInt(group.getAttribute('data-index'), 10);
        selectSlice(idx);
      });
    });
  }

  function selectSlice(index) {
    activeSliceIndex = index;
    const slice = innerSlices[index];
    if (sliceTitle && sliceDesc) {
      sliceTitle.innerHTML = `<span>${slice.icon}</span> ${slice.name} <span style="font-size:12px; color:var(--ink-muted); font-weight:normal;">[Key ${index + 1}]</span>`;
      sliceDesc.textContent = slice.desc;
    }
    renderSvgWheel();
  }

  // Handle Chord Trigger Simulation Buttons
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      triggerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeChord = btn.getAttribute('data-chord');
      selectSlice(0);
    });
  });

  // Direct Number Key Shortcuts (1-9)
  document.addEventListener('keydown', (e) => {
    // Only intercept numbers if user is not typing in a search box
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    
    const keyNum = parseInt(e.key, 10);
    if (keyNum >= 1 && keyNum <= innerSlices.length) {
      selectSlice(keyNum - 1);
    } else if (e.key === 'Escape') {
      sliceTitle.textContent = 'Wheel Dismissed (Esc)';
      sliceDesc.textContent = 'Releasing outside or pressing Esc closes the wheel immediately without running an action.';
    }
  });

  selectSlice(0);
}

/* --- FAQ Search Engine --- */
function initFaqSearch() {
  const searchInput = document.getElementById('faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');

  if (!searchInput || !faqItems.length) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    faqItems.forEach(item => {
      const qText = item.querySelector('.faq-question').textContent.toLowerCase();
      const aText = item.querySelector('.faq-answer').textContent.toLowerCase();

      if (qText.includes(query) || aText.includes(query)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
}

/* --- Accordion Toggle --- */
function initAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      const isOpen = parent.classList.contains('open');

      // Close all other accordion items
      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));

      if (!isOpen) {
        parent.classList.add('open');
      }
    });
  });
}
