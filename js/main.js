/* ===================================================================
   REZCA | main.js
   Shared interactivity: nav, cursor, reveal, network canvas, counters,
   card spotlight, tilt, magnetic buttons, contact form.
=================================================================== */
(function(){
  "use strict";

  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Preloader ---------------- */
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    if(pre){
      setTimeout(() => pre.classList.add('hidden'), 350);
    }
  });

  /* ---------------- Scroll progress bar ---------------- */
  const progress = document.getElementById('scroll-progress');
  function updateProgress(){
    if(!progress) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = (scrolled || 0) + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  /* ---------------- Header scroll state ---------------- */
  const header = document.getElementById('site-header');
  function updateHeader(){
    if(!header) return;
    if(window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  document.addEventListener('scroll', updateHeader, { passive:true });
  updateHeader();

  /* ---------------- Mobile nav ---------------- */
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');
  const navScrim = document.getElementById('nav-scrim');
  function closeNav(){
    navToggle && navToggle.classList.remove('open');
    primaryNav && primaryNav.classList.remove('open');
    navScrim && navScrim.classList.remove('open');
    document.body.style.overflow = '';
  }
  function toggleNav(){
    const open = navToggle.classList.toggle('open');
    primaryNav.classList.toggle('open', open);
    navScrim.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  navToggle && navToggle.addEventListener('click', toggleNav);
  navScrim && navScrim.addEventListener('click', closeNav);
  document.querySelectorAll('#primary-nav a').forEach(a => a.addEventListener('click', closeNav));

  /* ---------------- Custom cursor ---------------- */
  if(!isTouch && !prefersReducedMotion){
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.append(dot, ring);

    let mx = window.innerWidth/2, my = window.innerHeight/2;
    let rx = mx, ry = my;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    (function loop(){
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    document.querySelectorAll('a, button, .card, input, textarea, select').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('active'));
      el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
  }

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal], [data-reveal-scale], [data-stagger]');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('[data-counter]');
  if(counters.length && 'IntersectionObserver' in window){
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.counter);
        const suffix = el.dataset.suffix || '';
        const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
        const dur = 1400;
        const start = performance.now();
        function tick(now){
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val)) + suffix;
          if(p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------------- Card spotlight (mouse-tracked glow) ---------------- */
  if(!isTouch){
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
        card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
      });
    });
  }

  /* ---------------- Tilt effect ---------------- */
  if(!isTouch && !prefersReducedMotion){
    document.querySelectorAll('.tilt').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(900px) rotateY(0deg) rotateX(0deg)';
      });
    });
  }

  /* ---------------- Magnetic buttons ---------------- */
  if(!isTouch && !prefersReducedMotion){
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width/2) * 0.28;
        const y = (e.clientY - r.top - r.height/2) * 0.5;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
    });
  }

  /* ---------------- Network canvas (hero background) ---------------- */
  const canvas = document.getElementById('network');
  if(canvas && !prefersReducedMotion){
    const ctx = canvas.getContext('2d');
    let w, h, nodes = [];
    const MAX_DIST = 150;
    let mouse = { x: -9999, y: -9999 };

    function resize(){
      w = canvas.width = canvas.offsetWidth * devicePixelRatio;
      h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      const count = Math.min(80, Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
        r: Math.random() * 1.6 + 0.6
      }));
    }
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * devicePixelRatio;
      mouse.y = (e.clientY - r.top) * devicePixelRatio;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

    function step(){
      ctx.clearRect(0,0,w,h);
      for(const n of nodes){
        n.x += n.vx; n.y += n.vy;
        if(n.x < 0 || n.x > w) n.vx *= -1;
        if(n.y < 0 || n.y > h) n.vy *= -1;
      }
      const maxDist = MAX_DIST * devicePixelRatio;
      for(let i=0;i<nodes.length;i++){
        for(let j=i+1;j<nodes.length;j++){
          const a = nodes[i], b = nodes[j];
          const dx = a.x-b.x, dy = a.y-b.y;
          const dist = Math.sqrt(dx*dx+dy*dy);
          if(dist < maxDist){
            ctx.strokeStyle = `rgba(61,139,255,${(1 - dist/maxDist) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
          }
        }
      }
      // mouse connections + node draw
      for(const n of nodes){
        const dx = n.x - mouse.x, dy = n.y - mouse.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist < maxDist*1.3){
          ctx.strokeStyle = `rgba(31,116,255,${(1-dist/(maxDist*1.3))*0.5})`;
          ctx.beginPath(); ctx.moveTo(n.x,n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(245,245,245,0.55)';
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI*2); ctx.fill();
      }
      requestAnimationFrame(step);
    }
    resize();
    requestAnimationFrame(step);
  }

  /* ---------------- Contact form (submits to Formspree) ---------------- */
  const form = document.getElementById('contact-form');
  if(form){
    const success = document.getElementById('form-success');
    const errorBox = document.getElementById('form-error');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.innerHTML : '';

    form.addEventListener('submit', function(e){
      e.preventDefault();
      const requiredOk = form.checkValidity();
      if(!requiredOk){ form.reportValidity(); return; }

      if(errorBox) errorBox.classList.remove('show');
      if(submitBtn){
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending…';
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function(response){
        if(response.ok){
          form.style.display = 'none';
          if(success) success.classList.add('show');
        } else {
          throw new Error('Form submission failed');
        }
      }).catch(function(){
        if(errorBox) errorBox.classList.add('show');
        if(submitBtn){
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitLabel;
        }
      });
    });
  }

  /* ---------------- Pricing maintenance toggle ---------------- */
  const billingToggle = document.getElementById('billing-toggle');
  if(billingToggle){
    const opts = billingToggle.querySelectorAll('.toggle-opt');
    const prices = document.querySelectorAll('.maint-price');
    function setBilling(mode){
      billingToggle.classList.toggle('yearly', mode === 'yearly');
      opts.forEach(o => {
        const active = o.dataset.billing === mode;
        o.classList.toggle('active', active);
        o.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      prices.forEach(p => {
        p.textContent = mode === 'yearly' ? p.dataset.yearly : p.dataset.monthly;
      });
    }
    opts.forEach(o => o.addEventListener('click', () => setBilling(o.dataset.billing)));
  }

  /* ---------------- Floating glow parallax ---------------- */
  if(!isTouch && !prefersReducedMotion){
    const glows = document.querySelectorAll('.bg-glow');
    window.addEventListener('mousemove', e => {
      const px = e.clientX / window.innerWidth - 0.5;
      const py = e.clientY / window.innerHeight - 0.5;
      glows.forEach((g, i) => {
        const depth = (i+1) * 10;
        g.style.transform = `translate(${px*depth}px, ${py*depth}px)`;
      });
    });
  }

})();
