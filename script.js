(() => {
  const canvas = document.getElementById('dust');
  const ctx = canvas?.getContext('2d', { alpha: true });
  const intro = document.getElementById('intro');
  const skip = document.getElementById('skip');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let particles = [], width = 0, height = 0, raf;

  const resize = () => {
    if (!canvas || !ctx) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = innerWidth; height = innerHeight;
    canvas.width = width * ratio; canvas.height = height * ratio;
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = reduceMotion ? 28 : (width < 600 ? 52 : 105);
    const cx = width / 2, cy = height * .48, rx = Math.min(width * .46, 650), ry = Math.min(height * .42, 510);
    particles = Array.from({ length: count }, () => {
      const a = Math.random() * Math.PI * 2, d = .68 + Math.random() * .38;
      return { x: cx + Math.cos(a) * rx * d, y: cy + Math.sin(a) * ry * d, r: Math.random() * 1.45 + .25, a: Math.random() * .5 + .18, phase: Math.random() * Math.PI * 2, speed: .00025 + Math.random() * .00045, drift: Math.random() * 10 + 4, gold: Math.random() > .28 ? '228,190,103' : '178,129,41' };
    });
  };
  const draw = (time = 0) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    const cx = width / 2, cy = height * .48;
    particles.forEach(p => {
      const fx = reduceMotion ? 0 : Math.sin(time * p.speed + p.phase) * p.drift;
      const fy = reduceMotion ? 0 : Math.cos(time * p.speed * .8 + p.phase) * p.drift;
      const pulse = reduceMotion ? 1 : .7 + Math.sin(time * p.speed * 2 + p.phase) * .3;
      const dx = p.x + fx, dy = p.y + fy;
      const fade = Math.max(0, 1 - Math.hypot(dx - cx, (dy - cy) * .88) / (Math.max(width, height) * .78));
      ctx.beginPath(); ctx.fillStyle = `rgba(${p.gold},${p.a * pulse * fade})`; ctx.arc(dx, dy, p.r, 0, Math.PI * 2); ctx.fill();
    });
    if (!reduceMotion) raf = requestAnimationFrame(draw);
  };

  let finished = false;
  const finishIntro = () => {
    if (finished || !intro) return;
    finished = true; cancelAnimationFrame(raf); intro.classList.add('is-exiting');
    intro.addEventListener('animationend', () => { intro.setAttribute('aria-hidden', 'true'); window.dispatchEvent(new CustomEvent('phase2:ready')); }, { once: true });
  };
  resize(); addEventListener('resize', resize, { passive: true }); draw();
  if (intro) setTimeout(finishIntro, reduceMotion ? 1400 : 6800);
  skip?.addEventListener('click', finishIntro);

  const menu = document.querySelector('.menu-toggle'), nav = document.querySelector('.primary-nav');
  menu?.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('menu-open', open); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); document.body.classList.remove('menu-open'); }));

  if (!reduceMotion) {
    document.querySelectorAll('.parallax').forEach(el => addEventListener('scroll', () => { el.style.transform = `translate3d(0,${scrollY * parseFloat(el.dataset.speed || .1)}px,0)`; }, { passive: true }));
  }

  const pageIds = ['about-page','studio-page','academy-page','gallery-page','packages-page','contact-page','booking-page'];
  const pageTitles = {
    'about-page':'About Shital Gurav Makeup Studio | Founder Story',
    'studio-page':'Makeup Studio in Sangli | Shital Gurav Makeup Studio',
    'academy-page':'Professional Makeup Academy in Sangli | Shital Gurav',
    'packages-page':'Bridal Makeup Packages in Sangli | Shital Gurav',
    'gallery-page':'Makeup Portfolio Gallery | Shital Gurav Makeup Studio',
    'contact-page':'Contact Shital Gurav Makeup Studio in Sangli',
    'booking-page':'Book Your Appointment | Shital Gurav Makeup Studio'
  };

  const revealVisiblePage = () => {
    document.querySelectorAll('.page-view .js-reveal,.page-view .js-image-reveal').forEach(el => {
      if (el.getBoundingClientRect().top < innerHeight * .92) el.classList.add('is-visible');
    });
  };
  const route = () => {
    const requested = location.hash.slice(1);
    const page = pageIds.includes(requested) ? requested : null;
    document.body.classList.toggle('page-active', !!page);
    document.title = pageTitles[page] || 'Shital Gurav Makeup Studio in Sangli | Bridal Makeup & Professional Academy';
    document.querySelectorAll('.page-view').forEach(el => { el.style.display = el.id === page ? 'block' : 'none'; });
    document.querySelectorAll('.primary-nav a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${page}` || (!page && a.getAttribute('href') === '#home')));
    window.scrollTo({ top: 0, behavior: 'instant' });
    requestAnimationFrame(() => setTimeout(revealVisiblePage, 80));
  };
  addEventListener('hashchange', route); route();

  // Normalize CTA destinations and add accessible hover labels to floating actions.
  document.querySelectorAll('a').forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    if (text.includes('book') && text.includes('appointment')) link.setAttribute('href', '#booking-page');
    if (text === 'enquire now' || text.includes('enquire / apply') || text.includes('enquire about courses')) {
      link.setAttribute('href', 'https://wa.me/917767887555?text=' + encodeURIComponent('Hello Shital Gurav Makeup Studio, I would like to make an enquiry.'));
      link.setAttribute('target', '_blank'); link.setAttribute('rel', 'noopener');
    }
  });
  document.querySelectorAll('.float-actions a').forEach(a => a.title = a.getAttribute('aria-label') || 'Contact');

  const lightbox = document.getElementById('lightbox');
  document.querySelectorAll('.lightbox-trigger, .portfolio-item').forEach(trigger => trigger.addEventListener('click', () => {
    if (!lightbox) return;
    const img = lightbox.querySelector('img'); img.src = trigger.dataset.image; img.alt = trigger.querySelector('img')?.alt || 'Expanded makeup portfolio image';
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false'); document.body.classList.add('lightbox-open');
  }));
  const closeLightbox = () => { lightbox?.classList.remove('open'); lightbox?.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lightbox-open'); };
  lightbox?.querySelector('button')?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeLightbox(); nav?.classList.remove('open'); menu?.setAttribute('aria-expanded','false'); } });

  const bookingForm = document.getElementById('booking-form');
  bookingForm?.addEventListener('submit', e => {
    e.preventDefault();
    const status = document.getElementById('form-status');
    const data = new FormData(bookingForm);
    const required = ['fullName','phone','eventDate','eventType','time','service','consent'];
    const missing = required.some(key => !data.get(key) || (key === 'consent' && !bookingForm.elements[key].checked));
    if (missing) { status.textContent = 'Please complete the required fields before continuing.'; status.className = 'form-status error'; bookingForm.querySelector(':invalid')?.focus(); return; }
    const lines = ['Hello Shital Gurav Makeup Studio,','', 'I would like to enquire/book an appointment.','',`Name: ${data.get('fullName')}`,`Phone: ${data.get('phone')}`,`Email: ${data.get('email') || 'Not provided'}`,`Event Date: ${data.get('eventDate')}`,`Event Type: ${data.get('eventType')}`,`Preferred Time: ${data.get('time')}`,`Makeup Service: ${data.get('service')}`,`Number of People: ${data.get('people') || 'Not provided'}`,`Location: ${data.get('venue') || 'Not provided'}`,`Additional Requirements: ${data.get('message') || 'None'}`,'','Please let me know the availability and further details.'];
    status.textContent = 'Your enquiry is ready. WhatsApp will open in a new tab.'; status.className = 'form-status';
    window.open('https://wa.me/917767887555?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  });

  document.querySelectorAll('.gallery-filters button').forEach(filter => filter.addEventListener('click', () => {
    document.querySelectorAll('.gallery-filters button').forEach(button => button.classList.remove('active')); filter.classList.add('active');
    const selected = filter.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item => { item.style.display = selected === 'all' || item.dataset.category === selected ? '' : 'none'; });
  }));

  const header = document.querySelector('.site-header');
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 32);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const revealTargets = document.querySelectorAll('.section-label,.section-head,.page-section-label,.journey-head,.intro-copy,.page-copy,.course-card,.price-list article,.prebridal-grid article,.contact-card,.portfolio-item,.credential-grid article,.benefit-list span,.experience-notes article,.booking-form > label,.confirm-box,.form-actions,.footer-column,.footer-brand');
  revealTargets.forEach((el, index) => { el.classList.add('js-reveal'); el.style.setProperty('--reveal-delay', `${(index % 5) * 70}ms`); });
  document.querySelectorAll('.image-reveal,.founder-image,.credentials-image,.studio-intro-image,.studio-bridal-grid img,.showcase-track img').forEach(el => el.classList.add('js-image-reveal'));
  if (!reduceMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12, rootMargin: '0px 0px -5%' });
    document.querySelectorAll('.js-reveal,.js-image-reveal').forEach(el => observer.observe(el));
  } else document.querySelectorAll('.js-reveal,.js-image-reveal').forEach(el => el.classList.add('is-visible'));
})();
