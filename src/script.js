document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initThemeToggle();
  initHeroTyping();
  initCodeCopyButtons();
  initReadingProgress();
  initBackToTop();
  initBlogFilter();
  initGlobe();
});

function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    links.classList.toggle('open');
  });
}

function initThemeToggle() {
  const nav = document.querySelector('.nav-links');
  if (!nav) return;

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Toggle color theme');
  nav.appendChild(btn);

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = () => {
    return document.documentElement.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
  };

  const updateLabel = () => {
    btn.textContent = currentTheme() === 'dark' ? 'light mode' : 'dark mode';
  };

  const stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.setAttribute('data-theme', stored);
  }
  updateLabel();

  btn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateLabel();
  });
}

function initHeroTyping() {
  const terminal = document.querySelector('.terminal');
  if (!terminal) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lines = Array.from(terminal.querySelectorAll('.terminal-line'));
  if (!lines.length) return;

  const jobs = lines.map((line) => {
    const promptEl = line.querySelector('.prompt');
    const cursorEl = line.querySelector('.cursor');
    const clone = line.cloneNode(true);
    const cp = clone.querySelector('.prompt');
    if (cp) cp.remove();
    const cc = clone.querySelector('.cursor');
    if (cc) cc.remove();
    const fullText = clone.textContent.trim();
    return { line, promptEl, cursorEl, fullText };
  });

  jobs.forEach((job) => {
    job.line.textContent = '';
    if (job.promptEl) {
      job.line.appendChild(job.promptEl);
      job.line.appendChild(document.createTextNode(' '));
    }
  });

  let li = 0;
  function typeLine() {
    if (li >= jobs.length) return;
    const job = jobs[li];
    if (!job.fullText) {
      if (job.cursorEl) job.line.appendChild(job.cursorEl);
      li++;
      typeLine();
      return;
    }
    let ci = 0;
    const textNode = document.createTextNode('');
    job.line.appendChild(textNode);
    const interval = setInterval(() => {
      textNode.textContent += job.fullText[ci];
      ci++;
      if (ci >= job.fullText.length) {
        clearInterval(interval);
        if (job.cursorEl) job.line.appendChild(job.cursorEl);
        li++;
        setTimeout(typeLine, 380);
      }
    }, 26);
  }
  typeLine();
}

function initCodeCopyButtons() {
  document.querySelectorAll('article pre').forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = 'copy';
    btn.addEventListener('click', async () => {
      const codeEl = pre.querySelector('code') || pre;
      try {
        await navigator.clipboard.writeText(codeEl.textContent);
        btn.textContent = 'copied';
      } catch (err) {
        btn.textContent = 'error';
      }
      setTimeout(() => { btn.textContent = 'copy'; }, 1600);
    });
    pre.appendChild(btn);
  });
}

function initReadingProgress() {
  const article = document.querySelector('main article');
  if (!article) return;

  const bar = document.createElement('div');
  bar.className = 'reading-progress';
  document.body.appendChild(bar);

  const update = () => {
    const total = article.offsetHeight - window.innerHeight;
    const rect = article.getBoundingClientRect();
    const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    bar.style.width = pct + '%';
  };

  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function initBackToTop() {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'back-to-top';
  btn.textContent = '↑ top';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);

  const toggleVisibility = () => {
    btn.classList.toggle('visible', window.scrollY > 480);
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  toggleVisibility();
}

function initGlobe() {
  const canvas = document.getElementById('globe');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const radius = size * 0.38;

  const POINT_COUNT = 140;
  const points = [];
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < POINT_COUNT; i++) {
    const y = 1 - (i / (POINT_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    points.push({
      x: Math.cos(theta) * r,
      y: y,
      z: Math.sin(theta) * r,
      highlight: i % 11 === 0,
    });
  }

  let dotColor = '#0E7C86';
  let highlightColor = '#E2A63B';
  function readColors() {
    const styles = getComputedStyle(document.documentElement);
    dotColor = styles.getPropertyValue('--teal').trim() || dotColor;
    highlightColor = styles.getPropertyValue('--amber').trim() || highlightColor;
  }
  readColors();

  const observer = new MutationObserver(readColors);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  function hexToRgba(hex, alpha) {
    const clean = hex.replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    const bigint = parseInt(full, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function draw(angle) {
    ctx.clearRect(0, 0, size, size);
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const projected = points.map((p) => {
      const x = p.x * cosA + p.z * sinA;
      const z = -p.x * sinA + p.z * cosA;
      return { x, y: p.y, z, highlight: p.highlight };
    });

    projected.sort((a, b) => a.z - b.z);

    projected.forEach((p) => {
      const perspective = 2.6 / (2.6 - p.z);
      const px = center + p.x * radius * perspective;
      const py = center + p.y * radius * perspective;
      const depthFactor = (p.z + 1) / 2;
      const dotSize = 1 + depthFactor * 1.8;
      const opacity = 0.25 + depthFactor * 0.65;

      ctx.beginPath();
      ctx.arc(px, py, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = p.highlight ? hexToRgba(highlightColor, opacity) : hexToRgba(dotColor, opacity);
      ctx.fill();
    });
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw(0.6);
    return;
  }

  let angle = 0;
  function tick() {
    angle += 0.006;
    draw(angle);
    requestAnimationFrame(tick);
  }
  tick();
}

function initBlogFilter() {
  const log = document.getElementById('post-log');
  const search = document.getElementById('post-search');
  const chipsWrap = document.getElementById('tag-chips');
  if (!log || !search || !chipsWrap) return;

  const entries = Array.from(log.querySelectorAll('.log-entry'));
  const noResults = document.getElementById('no-results');
  let activeTag = 'all';

  function applyFilter() {
    const q = search.value.trim().toLowerCase();
    let visible = 0;
    entries.forEach((entry) => {
      const tags = (entry.dataset.tags || '').split(',');
      const matchesTag = activeTag === 'all' || tags.includes(activeTag);
      const matchesText = !q || entry.textContent.toLowerCase().includes(q);
      const show = matchesTag && matchesText;
      entry.hidden = !show;
      if (show) visible++;
    });
    if (noResults) noResults.hidden = visible !== 0;
  }

  search.addEventListener('input', applyFilter);
  chipsWrap.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    chipsWrap.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    activeTag = chip.dataset.tag;
    applyFilter();
  });
}
