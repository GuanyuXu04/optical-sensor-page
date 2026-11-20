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

  // Fabrication step counter animation
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
});
