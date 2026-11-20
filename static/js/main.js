document.addEventListener('DOMContentLoaded', () => {
  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal, .fab-step');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => observer.observe(el));

  // Teaser video: start at the best reconstruction segment
  const teaserVideo = document.getElementById('teaserVideo');
  if (teaserVideo) {
    const TEASER_START = 8;
    const TEASER_END = 25;
    teaserVideo.addEventListener('loadedmetadata', () => {
      teaserVideo.currentTime = TEASER_START;
    });
    teaserVideo.addEventListener('timeupdate', () => {
      if (teaserVideo.currentTime >= TEASER_END) {
        teaserVideo.currentTime = TEASER_START;
      }
    });
  }

  // Smooth subtitle → navbar crossfade driven by scroll position
  const nav = document.getElementById('siteNav');
  const hero = document.getElementById('hero');
  const heroSubtitle = document.getElementById('heroSubtitle');
  if (nav && hero) {
    let ticking = false;
    const updateNav = () => {
      const heroH = hero.offsetHeight;
      const scrolled = window.scrollY;
      const start = heroH * 0.55;
      const end = heroH * 0.85;

      if (scrolled <= start) {
        nav.style.opacity = '0';
        nav.style.pointerEvents = 'none';
        if (heroSubtitle) heroSubtitle.style.opacity = '1';
      } else if (scrolled >= end) {
        nav.style.opacity = '1';
        nav.style.pointerEvents = 'auto';
        if (heroSubtitle) heroSubtitle.style.opacity = '0';
      } else {
        const p = (scrolled - start) / (end - start);
        nav.style.opacity = p;
        nav.style.pointerEvents = p > 0.5 ? 'auto' : 'none';
        if (heroSubtitle) heroSubtitle.style.opacity = 1 - p;
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateNav); }
    }, { passive: true });
    updateNav();
  }

  // Results tabs
  document.querySelectorAll('.results-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.results-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(tab.dataset.panel);
      if (panel) panel.classList.add('active');
    });
  });

  // BibTeX copy
  const copyBtn = document.getElementById('copy-bibtex');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = document.getElementById('bibtex-text');
      navigator.clipboard.writeText(code.textContent).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
      });
    });
  }

  // Fabrication step animation
  const stepDots = document.querySelectorAll('.fab-step-dot');
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.closest('.fab-step').classList.add('visible');
      }
    });
  }, { threshold: 0.5 });
  stepDots.forEach(dot => stepObserver.observe(dot));

  // Animate stat numbers
  const statValues = document.querySelectorAll('.stat-value');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.value);
        const unit = el.dataset.unit || '';
        const prefix = el.dataset.prefix || '';
        const decimals = (el.dataset.value.includes('.')) ? el.dataset.value.split('.')[1].length : 0;
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();

        function animate(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = start + (target - start) * eased;
          el.textContent = prefix + current.toFixed(decimals) + unit;
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statValues.forEach(el => statObserver.observe(el));

  // Neural network pipeline animation (Figure 4 images fade in left to right)
  const pipeline = document.getElementById('nnPipeline');
  if (pipeline) {
    const nnObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const blocks = pipeline.querySelectorAll('.nn-fig-block, .nn-fig-arrow');
          blocks.forEach(block => {
            const delay = parseInt(block.dataset.delay) || 0;
            setTimeout(() => block.classList.add('animate-in'), delay);
          });
          nnObserver.unobserve(pipeline);
        }
      });
    }, { threshold: 0.3 });
    nnObserver.observe(pipeline);
  }

  // NN Detail toggle
  const btnDetail = document.getElementById('btnNNDetail');
  const detailPanel = document.getElementById('nnDetailPanel');
  if (btnDetail && detailPanel) {
    btnDetail.addEventListener('click', () => {
      const isOpen = detailPanel.classList.toggle('open');
      btnDetail.classList.toggle('expanded', isOpen);
      btnDetail.querySelector('.btn-detail-text').textContent = isOpen ? 'Hide' : 'Detail';
    });
  }
});
