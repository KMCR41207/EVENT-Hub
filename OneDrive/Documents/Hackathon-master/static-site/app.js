// Shared JS for all pages

// ── Theme (dark/light) ──
(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // Default: dark. Apply light only if explicitly stored or system prefers light.
  if (stored === 'light' || (!stored && !prefersDark)) {
    root.classList.add('light');
  }

  // Inject toggle button into every navbar after DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Hide magic rings on load if light mode
    const canvas = document.getElementById('magic-rings-canvas');
    if (canvas && root.classList.contains('light')) canvas.style.display = 'none';
    const navInner = document.querySelector('.navbar-inner');
    if (!navInner) return;
    const btn = document.createElement('div');
    btn.className = 'theme-toggle-wrap';
    // checked = dark mode (night), unchecked = light mode (day)
    const isDark = !root.classList.contains('light');
    btn.innerHTML = `
      <label class="switch" title="Toggle theme">
        <input id="theme-input" type="checkbox" ${isDark ? 'checked' : ''}>
        <div class="slider round">
          <div class="sun-moon">
            <svg id="moon-dot-1" class="moon-dot" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="moon-dot-2" class="moon-dot" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="moon-dot-3" class="moon-dot" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="light-ray-1" class="light-ray" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="light-ray-2" class="light-ray" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="light-ray-3" class="light-ray" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="cloud-1" class="cloud-dark" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="cloud-2" class="cloud-dark" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="cloud-3" class="cloud-dark" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="cloud-4" class="cloud-light" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="cloud-5" class="cloud-light" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
            <svg id="cloud-6" class="cloud-light" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50"/></svg>
          </div>
          <div class="stars">
            <svg id="star-1" class="star" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10,0 10 C 10 10,10 10,10 20 C 10 10,10 10,20 10 C 10 10,10 10,10 0 C 10 10,10 10,0 10 Z"/></svg>
            <svg id="star-2" class="star" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10,0 10 C 10 10,10 10,10 20 C 10 10,10 10,20 10 C 10 10,10 10,10 0 C 10 10,10 10,0 10 Z"/></svg>
            <svg id="star-3" class="star" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10,0 10 C 10 10,10 10,10 20 C 10 10,10 10,20 10 C 10 10,10 10,10 0 C 10 10,10 10,0 10 Z"/></svg>
            <svg id="star-4" class="star" viewBox="0 0 20 20"><path d="M 0 10 C 10 10,10 10,0 10 C 10 10,10 10,10 20 C 10 10,10 10,20 10 C 10 10,10 10,10 0 C 10 10,10 10,0 10 Z"/></svg>
          </div>
        </div>
      </label>`;

    btn.querySelector('#theme-input').addEventListener('change', (e) => {
      const goingDark = e.target.checked;
      const newBg  = goingDark ? 'hsl(240,20%,5%)'  : 'hsl(220,20%,97%)';
      const midBg  = goingDark ? 'hsl(239,84%,20%)' : 'hsl(239,84%,85%)'; // accent mid-color

      // Create two ripple overlays
      const br = document.createElement('div');
      br.className = 'theme-ripple theme-ripple-br';
      br.style.background = newBg;

      const tl = document.createElement('div');
      tl.className = 'theme-ripple theme-ripple-tl';
      tl.style.background = midBg;

      document.body.appendChild(tl);
      document.body.appendChild(br);

      // Phase 1 complete (~550ms) — swap theme, then shrink both away
      setTimeout(() => {
        if (goingDark) {
          root.classList.remove('light');
          localStorage.setItem('theme', 'dark');
        } else {
          root.classList.add('light');
          localStorage.setItem('theme', 'light');
        }
        // Phase 2: shrink outward
        br.classList.add('shrink');
        tl.classList.add('shrink');
      }, 540);

      // Cleanup
      setTimeout(() => {
        br.remove();
        tl.remove();
        // Pause/resume MagicRings canvas based on theme
        const canvas = document.getElementById('magic-rings-canvas');
        if (canvas) canvas.style.display = root.classList.contains('light') ? 'none' : '';
      }, 1020);
    });
    // Insert before hamburger or at end
    const hamburger = document.getElementById('hamburger');
    navInner.insertBefore(btn, hamburger || null);
  });
})();

// Navbar scroll effect + hamburger
(function() {
  const nav = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
  });

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isOpen = mobileMenu.classList.contains('open');
      hamburger.innerHTML = isOpen
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });
  }

  // Set active nav link
  const links = document.querySelectorAll('.nav-links a, .mobile-menu a');
  links.forEach(a => {
    if (a.getAttribute('href') === window.location.pathname ||
        (window.location.pathname === '/' && a.getAttribute('href') === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// Animate elements on scroll
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .6s ease, transform .6s ease';
    observer.observe(el);
  });
})();

// Progress bars animate on scroll
(function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const fill = e.target.querySelector('.progress-fill');
        if (fill) {
          const w = fill.dataset.width || '0';
          setTimeout(() => { fill.style.width = w + '%'; }, 100);
        }
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.progress-bar').forEach(b => observer.observe(b));
})();

// Category filter pills
function initFilter(inputId, pillsId, gridId, attr) {
  const input = document.getElementById(inputId);
  const pills = document.getElementById(pillsId);
  const grid = document.getElementById(gridId);
  if (!grid) return;

  const cards = Array.from(grid.children);
  let activeCategory = 'All';
  let searchVal = '';

  function filter() {
    cards.forEach(card => {
      const title = (card.dataset.title || '').toLowerCase();
      const desc = (card.dataset.desc || '').toLowerCase();
      const loc = (card.dataset.loc || '').toLowerCase();
      const cat = card.dataset.cat || '';
      const matchSearch = !searchVal || title.includes(searchVal) || desc.includes(searchVal) || loc.includes(searchVal);
      const matchCat = activeCategory === 'All' || cat === activeCategory;
      card.style.display = matchSearch && matchCat ? '' : 'none';
    });
    const visible = cards.filter(c => c.style.display !== 'none').length;
    const counter = document.getElementById('event-count');
    if (counter) counter.textContent = visible + ' event' + (visible !== 1 ? 's' : '') + ' found';
  }

  if (input) input.addEventListener('input', e => { searchVal = e.target.value.toLowerCase(); filter(); });
  if (pills) pills.addEventListener('click', e => {
    const pill = e.target.closest('.pill');
    if (!pill) return;
    pills.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    activeCategory = pill.dataset.cat;
    filter();
  });
}

// Modal helpers
function openModal(id) {
  const m = document.getElementById(id);
  if (m) { m.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) { m.style.display = 'none'; document.body.style.overflow = ''; }
}
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.style.display = 'none';
    document.body.style.overflow = '';
  }
});

// ── Page transition loader ──
(function () {
  const textLoaderHTML = `
  <div class="page-loader-overlay" id="page-loader">
    <div class="loader">
      <div class="text"><span>Loading</span></div>
      <div class="text"><span>Loading</span></div>
      <div class="text"><span>Loading</span></div>
      <div class="text"><span>Loading</span></div>
      <div class="text"><span>Loading</span></div>
      <div class="text"><span>Loading</span></div>
      <div class="text"><span>Loading</span></div>
      <div class="text"><span>Loading</span></div>
      <div class="text"><span>Loading</span></div>
      <div class="line"></div>
    </div>
  </div>`;

  const squaresLoaderHTML = `
  <div class="loader-squares-overlay" id="page-loader">
    <div class="loader-sq">
      <div class="loader-square"></div>
      <div class="loader-square"></div>
      <div class="loader-square"></div>
      <div class="loader-square"></div>
      <div class="loader-square"></div>
      <div class="loader-square"></div>
      <div class="loader-square"></div>
    </div>
  </div>`;

  function showLoader(href, html) {
    document.body.insertAdjacentHTML('beforeend', html);
    setTimeout(function () { window.location.href = href; }, 900);
  }

  document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    e.preventDefault();
    // Event cards use squares loader, everything else uses text loader
    const isCard = a.classList.contains('event-card') || a.closest('.event-card');
    showLoader(href, isCard ? squaresLoaderHTML : textLoaderHTML);
  });
})();
