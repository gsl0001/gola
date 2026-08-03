/**
 * Ball / Gola Launcher Web Engine
 * Direct implementation of design/Ball - UI Reference.dc.html (Section 4a)
 */

document.addEventListener('DOMContentLoaded', () => {
  initRadialLauncher();
  initFaqSearch();
  initAccordion();
});

function initRadialLauncher() {
  const canvasWrap = document.getElementById('wheelCanvasWrap');
  if (!canvasWrap) return;

  // Exact launcher slices matching Section 4a of UI Reference
  const slices = [
    { id: 'claude', name: 'Claude', icon: 'C', running: true, count: 3, desc: '3 live windows open. Slide onto outer fan previews or release to focus main window.' },
    { id: 'chatgpt', name: 'ChatGPT', icon: 'G', running: true, count: 1, desc: '1 window running. Release to focus.' },
    { id: 'antigravity', name: 'Antigravity', icon: 'A', running: false, count: 0, desc: 'Not running. Release to launch.' },
    { id: 'edge', name: 'Edge', icon: 'E', running: true, count: 2, desc: '2 browser windows open.' },
    { id: 'files', name: 'Files', icon: 'F', running: true, count: 1, desc: 'File Explorer active.' },
    { id: 'terminal', name: 'Terminal', icon: 'T', running: false, count: 0, desc: 'Not running. Release to open terminal window.' },
    { id: 'system', name: 'System', icon: '⚙️', isSymbol: true, symbolCode: '&#xE770;', running: false, count: 6, desc: 'System controls: Settings, Task Manager, Wi-Fi, Volume, Sleep, Lock.' },
    { id: 'tools', name: 'Tools', icon: '🛠️', isSymbol: true, symbolCode: '&#xE90F;', running: false, count: 10, desc: '10 popover utilities: Timer, Calculator, Color Picker, Clipboard, Magnifier, Screenshot, Note, Caffeine, Focus Dim, Dictate.' },
    { id: 'shelf', name: 'Shelf', icon: '📥', isSymbol: true, symbolCode: '&#xE8F1;', running: false, count: 7, desc: '7-day file inbox with preview, search & Telegram bot integration.' }
  ];

  let activeIndex = 0;
  const sliceTitle = document.getElementById('activeSliceTitle');
  const sliceDesc = document.getElementById('activeSliceDesc');
  const triggerBtns = document.querySelectorAll('.chord-trigger-btn');

  function renderSvgWheel() {
    const size = 620;
    const center = 310;
    
    // Geometry specs from Section 4a: hub r66, inner ring 100-196, fan ring 208-296, 2.5° slice gap
    const hubRadius = 66;
    const rInner1 = 100;
    const rInner2 = 196;
    const rFan1 = 208;
    const rFan2 = 296;
    const gapAngleRad = (2.5 * Math.PI) / 180;

    const numSlices = slices.length;
    const totalStep = (2 * Math.PI) / numSlices;

    let svg = `<svg width="100%" height="100%" viewBox="0 0 ${size} ${size}" style="user-select:none; overflow:visible;">
      <defs>
        <!-- Aperture Mark Gradient -->
        <linearGradient id="apertureGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#8FDCFF"/>
          <stop offset="50%" stop-color="#5B6CFF"/>
          <stop offset="100%" stop-color="#B44BFF"/>
        </linearGradient>

        <!-- Slice Glass Glow -->
        <filter id="sliceGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <!-- Backdrop Glass Blur Disc -->
      <circle cx="${center}" cy="${center}" r="${rFan2}" fill="rgba(8, 8, 14, 0.65)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    `;

    // Render Inner Ring Slices
    slices.forEach((slice, i) => {
      const baseStartAngle = i * totalStep - Math.PI / 2;
      const baseEndAngle = (i + 1) * totalStep - Math.PI / 2;

      // Apply 2.5° gap between slices
      const startAngle = baseStartAngle + gapAngleRad / 2;
      const endAngle = baseEndAngle - gapAngleRad / 2;
      const midAngle = (startAngle + endAngle) / 2;

      const isActive = i === activeIndex;

      // Slice colors from Brand & UI Reference specs
      const fill = isActive ? 'rgba(110, 134, 255, 0.447)' : 'rgba(255, 255, 255, 0.149)';
      const stroke = isActive ? 'rgba(174, 187, 255, 0.8)' : 'rgba(255, 255, 255, 0.271)';

      // Path data for inner ring sector
      const x1 = center + rInner1 * Math.cos(startAngle);
      const y1 = center + rInner1 * Math.sin(startAngle);
      const x2 = center + rInner2 * Math.cos(startAngle);
      const y2 = center + rInner2 * Math.sin(startAngle);
      const x3 = center + rInner2 * Math.cos(endAngle);
      const y3 = center + rInner2 * Math.sin(endAngle);
      const x4 = center + rInner1 * Math.cos(endAngle);
      const y4 = center + rInner1 * Math.sin(endAngle);

      const pathData = `M ${x1} ${y1} L ${x2} ${y2} A ${rInner2} ${rInner2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rInner1} ${rInner1} 0 0 0 ${x1} ${y1} Z`;

      // Label & Badge Positions
      const labelRadius = (rInner1 + rInner2) / 2;
      const lx = center + labelRadius * Math.cos(midAngle);
      const ly = center + labelRadius * Math.sin(midAngle);

      svg += `
        <g class="wheel-slice" data-index="${i}" style="cursor:pointer;">
          <path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${isActive ? 1.5 : 1}" 
                style="${isActive ? 'filter:url(#sliceGlow);' : ''}" />
        </g>
      `;

      // Draw Slice Badge & Text (Refined specs: no redundant "launch" text, 13px Segoe UI Semibold)
      svg += `
        <g style="pointer-events:none; transform: translate(${lx}px, ${ly}px);">
          <!-- Icon Tile (44x44px) -->
          <rect x="-22" y="-32" width="44" height="44" rx="12" 
                fill="rgba(255,255,255,0.11)" stroke="rgba(255,255,255,0.30)" stroke-width="1"/>
          
          <text x="0" y="-5" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="19" fill="#FFF">
            ${slice.icon}
          </text>

          <!-- Label -->
          <text x="0" y="26" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="#FFF">
            ${slice.name}
          </text>

          <!-- Green Running Indicator Dot & Count -->
          ${slice.running ? `
            <g transform="translate(0, 40)">
              <circle cx="${slice.count > 1 ? -8 : 0}" cy="0" r="3.5" fill="#4AE38B" style="filter: drop-shadow(0 0 4px #4AE38B);" />
              ${slice.count > 1 ? `<text x="4" y="3" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="#4AE38B">${slice.count}</text>` : ''}
            </g>
          ` : ''}
        </g>
      `;
    });

    // Outer Fan Ring for Active Slice
    const activeSlice = slices[activeIndex];
    if (activeSlice && activeSlice.count > 0) {
      const activeMidAngle = (activeIndex + 0.5) * totalStep - Math.PI / 2;
      const fanAngleSpan = totalStep * 1.5;
      const fanStart = activeMidAngle - fanAngleSpan / 2;
      const fanEnd = activeMidAngle + fanAngleSpan / 2;

      const fx1 = center + rFan1 * Math.cos(fanStart);
      const fy1 = center + rFan1 * Math.sin(fanStart);
      const fx2 = center + rFan2 * Math.cos(fanStart);
      const fy2 = center + rFan2 * Math.sin(fanStart);
      const fx3 = center + rFan2 * Math.cos(fanEnd);
      const fy3 = center + rFan2 * Math.sin(fanEnd);
      const fx4 = center + rFan1 * Math.cos(fanEnd);
      const fy4 = center + rFan1 * Math.sin(fanEnd);

      const fanPath = `M ${fx1} ${fy1} L ${fx2} ${fy2} A ${rFan2} ${rFan2} 0 0 1 ${fx3} ${fy3} L ${fx4} ${fy4} A ${rFan1} ${rFan1} 0 0 0 ${fx1} ${fy1} Z`;

      svg += `
        <!-- Outer Fan Segment -->
        <path d="${fanPath}" fill="rgba(110, 134, 255, 0.447)" stroke="rgba(174, 187, 255, 0.8)" stroke-width="1" />
      `;

      // Thumbnail previews inside outer fan
      for (let k = 0; k < Math.min(activeSlice.count, 3); k++) {
        const thumbAngle = fanStart + ((k + 0.5) * (fanAngleSpan / Math.min(activeSlice.count, 3)));
        const tx = center + ((rFan1 + rFan2) / 2) * Math.cos(thumbAngle);
        const ty = center + ((rFan1 + rFan2) / 2) * Math.sin(thumbAngle);

        svg += `
          <g transform="translate(${tx}, ${ty})" style="pointer-events:none;">
            <rect x="-44" y="-26" width="88" height="52" rx="7" fill="rgba(8, 10, 18, 0.6)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
            <rect x="-44" y="10" width="88" height="16" fill="rgba(6,7,12,0.85)"/>
            <text x="0" y="22" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="10.5" fill="#FFF">
              Window ${k + 1}
            </text>
          </g>
        `;
      }
    }

    // Center Hub & Aperture Mark
    svg += `
      <!-- Center Disc Hub -->
      <circle cx="${center}" cy="${center}" r="${hubRadius}" fill="rgba(8, 8, 13, 0.85)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      
      <!-- Brand Aperture Mark (300° arc, opening at 1 o'clock) -->
      <g transform="translate(${center - 26}, ${center - 26})">
        <svg width="52" height="52" viewBox="0 0 32 32">
          <path d="M25.98 10.24 A11.52 11.52 0 1 1 16.00 4.48" fill="none" stroke="url(#apertureGrad)" stroke-width="7.04" stroke-linecap="round"/>
        </svg>
      </g>
    `;

    svg += `</svg>`;
    canvasWrap.innerHTML = svg;

    // Hover & click listeners
    const sliceEls = canvasWrap.querySelectorAll('.wheel-slice');
    sliceEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        selectSlice(idx);
      });
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        selectSlice(idx);
      });
    });
  }

  function selectSlice(index) {
    activeIndex = index;
    const slice = slices[index];
    if (sliceTitle && sliceDesc) {
      sliceTitle.innerHTML = `<span>${slice.icon}</span> ${slice.name}`;
      sliceDesc.textContent = slice.desc;
    }
    renderSvgWheel();
  }

  // Trigger controls
  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      triggerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectSlice(0);
    });
  });

  // Direct Key 1-9 shortcuts
  document.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    const keyNum = parseInt(e.key, 10);
    if (keyNum >= 1 && keyNum <= slices.length) {
      selectSlice(keyNum - 1);
    } else if (e.key === 'Escape') {
      sliceTitle.textContent = 'Wheel Closed (Esc)';
      sliceDesc.textContent = 'Releasing outside or pressing Esc dismisses the wheel without launching an action.';
    }
  });

  selectSlice(0);
}

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

function initAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(q => {
    q.addEventListener('click', () => {
      const parent = q.parentElement;
      const isOpen = parent.classList.contains('open');

      document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));

      if (!isOpen) {
        parent.classList.add('open');
      }
    });
  });
}
