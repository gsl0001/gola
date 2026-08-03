/**
 * Ball / Gola Launcher Web Engine
 * Direct implementation of design/Ball - UI Reference.dc.html (Section 4a)
 * Interactive Step-by-Step Guided Gesture State Machine
 */

/**
 * Waitlist delivery. Point this at anything that accepts a POST of {email}
 * — Formspree, Getform, a Cloudflare Worker — and signups go straight there.
 * Left empty, the form opens a prefilled email instead, which needs no backend.
 */
const WAITLIST_ENDPOINT = '';
const WAITLIST_MAILTO = 'gsl456789@gmail.com';

document.addEventListener('DOMContentLoaded', () => {
  initStepByStepRadialLauncher();
  initFaqSearch();
  initAccordion();
  initVideoPerformanceObserver();
  initClipLightbox();
  initWaitlist();
});

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initVideoPerformanceObserver() {
  const videos = document.querySelectorAll('video[loop]:not(#lightboxVideo)');
  if (!videos.length) return;

  // Motion-sensitive visitors get the poster and a play button instead of a loop.
  if (prefersReducedMotion()) {
    videos.forEach(v => { v.controls = true; });
    return;
  }
  if (!('IntersectionObserver' in window)) {
    videos.forEach(v => v.play().catch(() => {}));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.2 });

  videos.forEach(v => observer.observe(v));
}

function initClipLightbox() {
  const box = document.getElementById('clipLightbox');
  const video = document.getElementById('lightboxVideo');
  const caption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const frames = document.querySelectorAll('.clip-frame');
  if (!box || !video || !frames.length) return;

  let lastFocused = null;

  function openClip(src, text) {
    if (!src) return;
    lastFocused = document.activeElement;
    video.src = src;
    caption.textContent = text || '';
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    if (!prefersReducedMotion()) video.play().catch(() => {});
    closeBtn.focus();
  }

  function closeClip() {
    box.hidden = true;
    video.pause();
    video.removeAttribute('src');
    video.load();
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  frames.forEach(frame => {
    frame.addEventListener('click', () => openClip(frame.dataset.src, frame.dataset.caption));
  });

  closeBtn.addEventListener('click', closeClip);
  box.addEventListener('click', (e) => { if (e.target === box) closeClip(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !box.hidden) closeClip();
  });
}

function initWaitlist() {
  const form = document.getElementById('waitlistForm');
  if (!form) return;

  const input = document.getElementById('waitlistEmail');
  const status = document.getElementById('waitlistStatus');
  const submit = form.querySelector('.waitlist-submit');

  function say(message, kind) {
    status.textContent = message;
    status.className = 'waitlist-status' + (kind ? ' ' + kind : '');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = input.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      input.classList.add('invalid');
      say('That does not look like an email address.', 'error');
      input.focus();
      return;
    }
    input.classList.remove('invalid');

    if (!WAITLIST_ENDPOINT) {
      // No backend wired up: hand off to the mail client, and name the address
      // in plain text so the visitor is never stuck if nothing opens.
      say('Opening your mail app — send the draft and you are on the list. ' +
          'If nothing opens, email ' + WAITLIST_MAILTO + ' instead.');
      window.location.href = 'mailto:' + WAITLIST_MAILTO +
        '?subject=' + encodeURIComponent('Gola waitlist') +
        '&body=' + encodeURIComponent('Please add ' + email + ' to the Gola waitlist.');
      return;
    }

    submit.disabled = true;
    say('Adding you…');

    fetch(WAITLIST_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(res => {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        say('You are on the list. One email when it ships.', 'ok');
      })
      .catch(() => {
        say('That did not go through. Email ' + WAITLIST_MAILTO + ' and you will be added by hand.', 'error');
      })
      .then(() => { submit.disabled = false; });
  });
}

function initStepByStepRadialLauncher() {
  const canvasWrap = document.getElementById('wheelCanvasWrap');
  if (!canvasWrap) return;

  const slices = [
    { id: 'claude', name: 'Claude', icon: 'C', running: true, count: 3, desc: '3 live windows open. Slide onto outer fan previews or release to focus main window.' },
    { id: 'chatgpt', name: 'ChatGPT', icon: 'G', running: true, count: 1, desc: '1 window running. Release to focus.' },
    { id: 'antigravity', name: 'Antigravity', icon: 'A', running: false, count: 0, desc: 'Not running. Release to launch.' },
    { id: 'edge', name: 'Edge', icon: 'E', running: true, count: 2, desc: '2 browser windows open.' },
    { id: 'files', name: 'Files', icon: 'F', running: true, count: 1, desc: 'File Explorer active.' },
    { id: 'terminal', name: 'Terminal', icon: 'T', running: false, count: 0, desc: 'Not running. Release to open terminal window.' },
    { id: 'system', name: 'System', icon: '⚙️', isSymbol: true, running: false, count: 6, desc: 'System controls: Settings, Task Manager, Wi-Fi, Volume, Sleep, Lock.' },
    { id: 'tools', name: 'Tools', icon: '🛠️', isSymbol: true, running: false, count: 10, desc: '10 popover utilities: Timer, Calculator, Color Picker, Clipboard, Magnifier, Screenshot, Note, Caffeine, Focus Dim, Dictate.' },
    { id: 'shelf', name: 'Shelf', icon: '📥', isSymbol: true, running: false, count: 7, desc: '7-day file inbox with preview, search & Telegram bot integration.' }
  ];

  // Guided Step-by-Step State
  // Step 1: Hold Trigger Chord -> Step 2: Select Slice (Keys 1-8) -> Step 3: Dwell / Fan Out -> Step 4: Execute or Dismiss (Esc)
  let currentStep = 1; 
  let activeIndex = 0;
  let wheelOpen = true;

  const stepBadge = document.getElementById('interactiveStepBadge');
  const stepPrompt = document.getElementById('interactiveStepPrompt');
  const sliceTitle = document.getElementById('activeSliceTitle');
  const sliceDesc = document.getElementById('activeSliceDesc');
  const triggerBtns = document.querySelectorAll('.chord-trigger-btn');
  const nextStepBtn = document.getElementById('nextStepBtn');

  const syncVideo = document.getElementById('playgroundSyncVideo');
  const syncVideoSource = document.getElementById('playgroundSyncVideoSource');
  const stepClipTitle = document.getElementById('stepClipTitle');

  const stepClipMap = {
    1: { title: 'Wheel opens under the cursor', clip: 'summon-wheel' },
    2: { title: 'Tools ring fans out', clip: 'tools-popovers' },
    3: { title: 'Live windows on the outer ring', clip: 'window-fanout' },
    4: { title: 'System actions, then release', clip: 'system-fanout' }
  };

  function updateStepUI() {
    if (!stepBadge || !stepPrompt) return;

    if (currentStep === 1) {
      stepBadge.textContent = 'Step 1 of 4 — Summon';
      stepPrompt.innerHTML = 'Press <kbd>Ctrl</kbd>+<kbd>Alt</kbd>, or click a trigger below, to open the wheel under your cursor.';
    } else if (currentStep === 2) {
      stepBadge.textContent = 'Step 2 of 4 — Target a slice';
      stepPrompt.innerHTML = 'Press <kbd>1</kbd>–<kbd>9</kbd>, or hover a slice, to target an app or a section.';
    } else if (currentStep === 3) {
      stepBadge.textContent = 'Step 3 of 4 — Fan out';
      stepPrompt.innerHTML = 'Dwell on the slice and its windows or actions fan onto the outer ring.';
    } else if (currentStep === 4) {
      stepBadge.textContent = 'Step 4 of 4 — Run or dismiss';
      stepPrompt.innerHTML = 'Release on an outer item to run it, or press <kbd>Esc</kbd> to close the wheel.';
    }

    if (syncVideo && syncVideoSource && stepClipMap[currentStep]) {
      const clipInfo = stepClipMap[currentStep];
      const src = `assets/clips/${clipInfo.clip}.mp4`;
      if (stepClipTitle) stepClipTitle.textContent = clipInfo.title;
      if (syncVideoSource.getAttribute('src') !== src) {
        syncVideo.poster = `assets/clips/${clipInfo.clip}.jpg`;
        syncVideoSource.setAttribute('src', src);
        syncVideo.load();
        if (!prefersReducedMotion()) syncVideo.play().catch(() => {});
      }
    }

    if (nextStepBtn) {
      nextStepBtn.textContent = currentStep < 4
        ? `Next step (${currentStep + 1}/4)`
        : 'Restart the flow';
    }
  }

  function renderSvgWheel() {
    const size = 620;
    const center = 310;
    const rInner1 = 100;
    const rInner2 = 196;
    const rFan1 = 208;
    const rFan2 = 296;
    const gapAngleRad = (2.5 * Math.PI) / 180;
    const numSlices = slices.length;
    const totalStep = (2 * Math.PI) / numSlices;

    let svg = `<svg width="100%" height="100%" viewBox="0 0 ${size} ${size}" style="user-select:none; overflow:visible;">
      <defs>
        <linearGradient id="apertureGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#8FDCFF"/>
          <stop offset="50%" stop-color="#5B6CFF"/>
          <stop offset="100%" stop-color="#B44BFF"/>
        </linearGradient>

        <filter id="sliceGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      <circle cx="${center}" cy="${center}" r="${rFan2}" fill="rgba(8, 8, 14, 0.65)" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
    `;

    // Inner Ring Slices
    slices.forEach((slice, i) => {
      const baseStartAngle = i * totalStep - Math.PI / 2;
      const baseEndAngle = (i + 1) * totalStep - Math.PI / 2;
      const startAngle = baseStartAngle + gapAngleRad / 2;
      const endAngle = baseEndAngle - gapAngleRad / 2;
      const midAngle = (startAngle + endAngle) / 2;

      const isActive = i === activeIndex;

      const fill = isActive ? 'rgba(110, 134, 255, 0.447)' : 'rgba(255, 255, 255, 0.149)';
      const stroke = isActive ? 'rgba(174, 187, 255, 0.8)' : 'rgba(255, 255, 255, 0.271)';

      const x1 = center + rInner1 * Math.cos(startAngle);
      const y1 = center + rInner1 * Math.sin(startAngle);
      const x2 = center + rInner2 * Math.cos(startAngle);
      const y2 = center + rInner2 * Math.sin(startAngle);
      const x3 = center + rInner2 * Math.cos(endAngle);
      const y3 = center + rInner2 * Math.sin(endAngle);
      const x4 = center + rInner1 * Math.cos(endAngle);
      const y4 = center + rInner1 * Math.sin(endAngle);

      const pathData = `M ${x1} ${y1} L ${x2} ${y2} A ${rInner2} ${rInner2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${rInner1} ${rInner1} 0 0 0 ${x1} ${y1} Z`;

      const labelRadius = (rInner1 + rInner2) / 2;
      const lx = center + labelRadius * Math.cos(midAngle);
      const ly = center + labelRadius * Math.sin(midAngle);

      svg += `
        <g class="wheel-slice" data-index="${i}" style="cursor:pointer;">
          <path d="${pathData}" fill="${fill}" stroke="${stroke}" stroke-width="${isActive ? 1.5 : 1}" 
                style="${isActive ? 'filter:url(#sliceGlow);' : ''}" />
        </g>
      `;

      svg += `
        <g style="pointer-events:none; transform: translate(${lx}px, ${ly}px);">
          <rect x="-22" y="-32" width="44" height="44" rx="12" 
                fill="rgba(255,255,255,0.11)" stroke="rgba(255,255,255,0.30)" stroke-width="1"/>
          
          <text x="0" y="-5" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="19" fill="#FFF">
            ${slice.icon}
          </text>

          <text x="0" y="26" text-anchor="middle" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="13" fill="#FFF">
            ${slice.name}
          </text>

          ${slice.running ? `
            <g transform="translate(0, 40)">
              <circle cx="${slice.count > 1 ? -8 : 0}" cy="0" r="3.5" fill="#4AE38B" style="filter: drop-shadow(0 0 4px #4AE38B);" />
              ${slice.count > 1 ? `<text x="4" y="3" font-family="'Segoe UI', sans-serif" font-weight="600" font-size="11" fill="#4AE38B">${slice.count}</text>` : ''}
            </g>
          ` : ''}
        </g>
      `;
    });

    // Outer Fan Ring (Active during Steps 3 and 4)
    const activeSlice = slices[activeIndex];
    if (activeSlice && activeSlice.count > 0 && currentStep >= 3) {
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
        <path d="${fanPath}" fill="rgba(110, 134, 255, 0.447)" stroke="rgba(174, 187, 255, 0.8)" stroke-width="1" />
      `;

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

    // Center Hub & Brand Aperture Mark
    svg += `
      <circle cx="${center}" cy="${center}" r="66" fill="rgba(8, 8, 13, 0.85)" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
      <g transform="translate(${center - 26}, ${center - 26})">
        <svg width="52" height="52" viewBox="0 0 32 32">
          <path d="M25.98 10.24 A11.52 11.52 0 1 1 16.00 4.48" fill="none" stroke="url(#apertureGrad)" stroke-width="7.04" stroke-linecap="round"/>
        </svg>
      </g>
    `;

    svg += `</svg>`;
    canvasWrap.innerHTML = svg;

    const sliceEls = canvasWrap.querySelectorAll('.wheel-slice');
    sliceEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        selectSlice(idx);
        if (currentStep === 1 || currentStep === 2) {
          advanceStep(3);
        }
      });
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        selectSlice(idx);
        advanceStep(4);
      });
    });
  }

  function advanceStep(targetStep) {
    if (targetStep) {
      currentStep = targetStep;
    } else {
      currentStep = currentStep < 4 ? currentStep + 1 : 1;
    }
    updateStepUI();
    renderSvgWheel();
  }

  function selectSlice(index) {
    activeIndex = index;
    const slice = slices[index];
    if (sliceTitle && sliceDesc) {
      sliceTitle.innerHTML = `<span>${slice.icon}</span> ${slice.name} <span style="font-size:12px; color:var(--ink-muted);">[Key ${index + 1}]</span>`;
      sliceDesc.textContent = slice.desc;
    }
    renderSvgWheel();
  }

  if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
      advanceStep();
    });
  }

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      triggerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      advanceStep(2);
    });
  });

  // Key Listeners for Step-by-Step Execution
  document.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

    // While a clip is open in the lightbox, keys belong to the lightbox.
    const lightbox = document.getElementById('clipLightbox');
    if (lightbox && !lightbox.hidden) return;

    const keyNum = parseInt(e.key, 10);
    if (keyNum >= 1 && keyNum <= slices.length) {
      selectSlice(keyNum - 1);
      advanceStep(3);
    } else if (e.key === 'Escape') {
      currentStep = 4;
      updateStepUI();
      if (sliceTitle && sliceDesc) {
        sliceTitle.textContent = 'Wheel Dismissed (Esc)';
        sliceDesc.textContent = 'Releasing outside or pressing Esc closes the wheel immediately.';
      }
      renderSvgWheel();
    } else if (e.ctrlKey && e.altKey) {
      advanceStep(2);
    }
  });

  updateStepUI();
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

  function toggle(q) {
    const parent = q.parentElement;
    const isOpen = parent.classList.contains('open');

    document.querySelectorAll('.faq-item').forEach(item => item.classList.remove('open'));

    if (!isOpen) {
      parent.classList.add('open');
    }
    q.setAttribute('aria-expanded', String(!isOpen));
  }

  faqQuestions.forEach(q => {
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', () => toggle(q));
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(q);
      }
    });
  });
}
