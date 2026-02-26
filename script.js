/* ═══════════════════════════════════════════
   ATHFALIN PORTFOLIO — script.js
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════
     CUSTOM CURSOR
  ══════════════════ */
  const cursor      = document.getElementById('cursor');
  const cursorTrail = document.getElementById('cursorTrail');
  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Smooth trail
  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // Cursor scale on hover
  document.querySelectorAll('a, button, .project-card, .skill-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width  = '20px';
      cursor.style.height = '20px';
      cursorTrail.style.width  = '50px';
      cursorTrail.style.height = '50px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width  = '12px';
      cursor.style.height = '12px';
      cursorTrail.style.width  = '32px';
      cursorTrail.style.height = '32px';
    });
  });

  /* ══════════════════
     HEADER SCROLL EFFECT
  ══════════════════ */
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  });

  /* ══════════════════
     NAV ACTIVE LINK
  ══════════════════ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => navObserver.observe(s));

  /* ══════════════════
     HAMBURGER / MOBILE NAV
  ══════════════════ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!header.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    }
  });

  /* ══════════════════
     SCROLL REVEAL
  ══════════════════ */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ══════════════════
     SKILL BARS — animate on reveal
  ══════════════════ */
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));

  /* ══════════════════
     HERO COUNTER ANIMATION
  ══════════════════ */
  const counters = document.querySelectorAll('.stat-n');

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        let current  = 0;
        const step   = target / 40;
        const timer  = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current);
        }, 40);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  /* ══════════════════
     ROLE TEXT TYPEWRITER
  ══════════════════ */
  const roles = [
    'Frontend Web Developer',
    'Backend Web Developer',
    'Prompt Engineer',
  ];
  const roleEl = document.getElementById('roleText');
  if (roleEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeRole() {
      const current = roles[roleIndex];
      if (isDeleting) {
        roleEl.textContent = current.substring(0, charIndex--);
        if (charIndex < 0) {
          isDeleting = false;
          roleIndex  = (roleIndex + 1) % roles.length;
          setTimeout(typeRole, 400);
          return;
        }
        setTimeout(typeRole, 40);
      } else {
        roleEl.textContent = current.substring(0, charIndex++);
        if (charIndex > current.length) {
          isDeleting = true;
          setTimeout(typeRole, 2000);
          return;
        }
        setTimeout(typeRole, 80);
      }
    }
    setTimeout(typeRole, 1200);
  }

  /* ══════════════════
     SMOOTH SCROLL
  ══════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id   = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ══════════════════
     FLOATING PARTICLES (canvas)
  ══════════════════ */
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:fixed;inset:0;z-index:0;pointer-events:none;opacity:.4';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - .5) * .3,
    vy: (Math.random() - .5) * .3,
    opacity: Math.random() * .6 + .2,
  }));

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${p.opacity})`;
      ctx.fill();
    });

    // Draw connecting lines
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(0,212,255,${.15 * (1 - dist/120)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(drawParticles);
  }
  drawParticles();

  /* ══════════════════
     PARALLAX EFFECT on hero
  ══════════════════ */
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero    = document.querySelector('.hero');
    if (hero && scrollY < window.innerHeight) {
      hero.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
  });

  /* ══════════════════
     GLITCH EFFECT on logo hover
  ══════════════════ */
  const logo = document.querySelector('.nav-logo');
  if (logo) {
    logo.addEventListener('mouseenter', () => {
      logo.style.animation = 'none';
      logo.offsetHeight; // reflow
      logo.style.animation = 'glitch .3s ease';
    });
  }

  /* ══════════════════
     PROJECT CARD TILT (3D on hover)
     — link di dalam card tetap bisa diklik
  ══════════════════ */
  document.querySelectorAll('.project-card').forEach(card => {
    // Pastikan semua link di dalam card selalu bisa diklik
    card.querySelectorAll('a').forEach(link => {
      link.style.position = 'relative';
      link.style.zIndex   = '10';
      link.style.pointerEvents = 'auto';
    });

    card.addEventListener('mousemove', e => {
      // Jika mouse tepat di atas link, nonaktifkan tilt
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        card.style.transform = 'translateY(-4px)';
        return;
      }
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;
      const rotX = (y - cy) / cy * -6;
      const rotY = (x - cx) / cx * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
      card.style.transition = 'transform .05s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform .3s ease';
    });
  });

  /* ══════════════════
     SCROLL PROGRESS BAR
  ══════════════════ */
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 2px;
    background: linear-gradient(90deg, #0066ff, #00d4ff, #00ffaa);
    z-index: 9999; width: 0%; transition: width .1s;
    box-shadow: 0 0 8px rgba(0,212,255,.6);
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop  = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (scrollTop / scrollHeight * 100) + '%';
  });

  /* ══════════════════
     INIT — ensure first visible elements animate
  ══════════════════ */
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) el.classList.add('visible');
    });
  }, 100);

});