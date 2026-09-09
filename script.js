(() => {
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- mobile nav ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('nav-links');
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- project slider ---------- */
  const track = document.getElementById('project-track');
  const prev = document.querySelector('.slider-prev');
  const next = document.querySelector('.slider-next');
  const bar = document.getElementById('slider-bar');

  const visibleCards = () => [...track.querySelectorAll('.card')].filter(c => !c.hidden);

  const stepWidth = () => {
    const cards = visibleCards();
    if (cards.length < 1) return track.clientWidth * 0.8;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return cards[0].offsetWidth + gap;
  };

  const updateUI = () => {
    const max = track.scrollWidth - track.clientWidth;
    const x = track.scrollLeft;
    prev.disabled = x <= 2;
    next.disabled = x >= max - 2;
    if (max <= 0) {
      bar.style.width = '100%';
      bar.style.transform = 'translateX(0)';
      return;
    }
    const frac = track.clientWidth / track.scrollWidth;
    bar.style.width = `${Math.max(frac * 100, 8)}%`;
    bar.style.transform = `translateX(${(x / max) * (100 / Math.max(frac, 0.08) - 100)}%)`;
  };

  prev.addEventListener('click', () => track.scrollBy({ left: -stepWidth(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: stepWidth(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateUI, { passive: true });
  window.addEventListener('resize', updateUI);

  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); next.click(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prev.click(); }
  });

  // drag to scroll (mouse only; touch already scrolls natively)
  let dragging = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    dragging = true; moved = false;
    startX = e.clientX; startScroll = track.scrollLeft;
    track.setPointerCapture(e.pointerId);
  });
  track.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4 && !moved) { moved = true; track.classList.add('is-dragging'); }
    if (moved) track.scrollLeft = startScroll - dx;
  });
  const endDrag = e => {
    if (!dragging) return;
    dragging = false;
    if (moved) {
      track.classList.remove('is-dragging');
      const step = stepWidth();
      const target = Math.round(track.scrollLeft / step) * step;
      track.scrollTo({ left: target, behavior: 'smooth' });
    }
    if (e.pointerId !== undefined && track.hasPointerCapture(e.pointerId)) {
      track.releasePointerCapture(e.pointerId);
    }
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('pointerleave', endDrag);
  // suppress link click after a drag
  track.addEventListener('click', e => { if (moved) { e.preventDefault(); moved = false; } }, true);

  /* ---------- filters ---------- */
  const filters = document.querySelectorAll('.filter');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => {
        const on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', String(on));
      });
      const f = btn.dataset.filter;
      track.querySelectorAll('.card').forEach(card => {
        card.hidden = f !== 'all' && card.dataset.cat !== f;
      });
      track.scrollTo({ left: 0, behavior: 'auto' });
      updateUI();
    });
  });

  updateUI();
})();
