
/* =========================================================
   YGP Animations — GSAP + Lenis + Magnetic Cursor
   Requires: gsap, gsap/ScrollTrigger, lenis (CDN)
   ========================================================= */

(function () {
  'use strict';

  var YGP = YGP || {};

  // ── 1. PAGE TRANSITION WIPE ───────────────────────────────────────────────
  // Yellow curtain that opens on load and closes on navigation
  var curtain = document.createElement('div');
  curtain.id = 'yg-curtain';
  curtain.style.cssText = 'position:fixed;inset:0;background:#FBB038;z-index:9999;transform-origin:left;pointer-events:none';
  document.body.appendChild(curtain);

  // Reveal: curtain sweeps out to the right on page load
  gsap.fromTo(curtain,
    { scaleX: 1 },
    { scaleX: 0, duration: 0.8, ease: 'power3.inOut', transformOrigin: 'right', delay: 0.1 }
  );

  // Intercept internal link clicks for exit transition
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (link.target === '_blank') return;
    e.preventDefault();
    gsap.to(curtain, {
      scaleX: 1, duration: 0.5, ease: 'power3.inOut', transformOrigin: 'left',
      onComplete: function () { window.location.href = href; }
    });
  });


  // ── 2. LENIS SMOOTH SCROLL ────────────────────────────────────────────────
  var lenis;
  try {
    lenis = new Lenis({
      duration: 1.25,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
  } catch (e) {
    console.warn('Lenis not available, using native scroll');
  }


  // ── 3. HERO KINETIC TYPOGRAPHY ────────────────────────────────────────────
  // Split .yg-hero-wordmark spans into individual characters, animate in
  var wordmark = document.querySelector('.yg-hero-wordmark');
  if (wordmark) {
    var spans = wordmark.querySelectorAll('span');
    spans.forEach(function (span, wi) {
      var text = span.textContent.trim();
      var isAccent = span.classList.contains('accent');
      span.innerHTML = text.split('').map(function (char) {
        return '<span class=yg-char style=display:inline-block;overflow:hidden;line-height:1>' +
          '<span class=yg-char-inner style=display:inline-block>' + (char === ' ' ? '&nbsp;' : char) + '</span>' +
          '</span>';
      }).join('');
      var chars = span.querySelectorAll('.yg-char-inner');
      // Alternate: odd words from bottom, even from top
      var yFrom = wi % 2 === 0 ? '120%' : '-120%';
      gsap.from(chars, {
        y: yFrom,
        opacity: 0,
        duration: 0.75,
        stagger: 0.04,
        ease: 'power3.out',
        delay: 0.4 + wi * 0.2,
      });
    });
  }

  // ── 4. HERO SUBTITLE + CTA REVEAL ─────────────────────────────────────────
  var heroContent = document.querySelector('.yg-video-content');
  if (heroContent) {
    var subtitle = heroContent.querySelector('p:last-of-type');
    var ctaBlock = heroContent.querySelector('div[style*=flex]');
    if (subtitle) gsap.from(subtitle, { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', delay: 1.4 });
    if (ctaBlock) gsap.from(ctaBlock.children, { opacity: 0, y: 20, duration: 0.6, stagger: 0.15, ease: 'power2.out', delay: 1.6 });
  }


  // ── 5. STATS COUNT-UP ─────────────────────────────────────────────────────
  var statNums = document.querySelectorAll('.stat-num[data-count]');
  statNums.forEach(function (el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '%';
    el.textContent = '0' + suffix;
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val) + suffix;
          }
        });
      }
    });
  });


  // ── 6. SCROLLTRIGGER SECTION REVEALS ─────────────────────────────────────
  // Generic fade-up for sections without data-anime (avoids Crafto conflicts)
  var revealEls = document.querySelectorAll('.yg-reveal');
  revealEls.forEach(function (el) {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      opacity: 0, y: 40, duration: 0.8, ease: 'power2.out',
    });
  });

  // Stagger reveal for yg-reveal-stagger children
  var staggerGroups = document.querySelectorAll('.yg-reveal-stagger');
  staggerGroups.forEach(function (group) {
    gsap.from(group.children, {
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      opacity: 0, y: 50, duration: 0.7, stagger: 0.1, ease: 'power2.out',
    });
  });


  // ── 7. MARQUEE ────────────────────────────────────────────────────────────
  var marquees = document.querySelectorAll('.yg-marquee-inner');
  marquees.forEach(function (m) {
    var clone = m.cloneNode(true);
    m.parentNode.appendChild(clone);
    var speed = parseFloat(m.parentNode.dataset.speed) || 40;
    var totalWidth = m.offsetWidth;
    gsap.to([m, clone], {
      x: '-' + totalWidth + 'px',
      duration: totalWidth / speed,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(function (x) { return parseFloat(x) % totalWidth; })
      }
    });

    // Pause on hover
    m.parentNode.addEventListener('mouseenter', function () { /* marquee paused via specific animation */; });
    m.parentNode.addEventListener('mouseleave', function () { /* marquee resumed */; });
  });


  // ── 8. MAGNETIC CURSOR ───────────────────────────────────────────────────
  var outerCursor = document.querySelector('.circle-cursor-outer');
  var innerCursor = document.querySelector('.circle-cursor-inner');
  if (outerCursor && innerCursor) {
    var mx = window.innerWidth / 2;
    var my = window.innerHeight / 2;
    var cx = mx; var cy = my;

    document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });

    // Smooth cursor follow
    gsap.ticker.add(function () {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      innerCursor.style.transform = 'translate(' + (mx - 10) + 'px,' + (my - 10) + 'px)';
      outerCursor.style.transform = 'translate(' + (cx - 20) + 'px,' + (cy - 20) + 'px)';
    });

    // Magnetic effect on interactive elements
    var magnetics = document.querySelectorAll('a, button, .yg-work-item, .yg-svc-cell, .testi');
    magnetics.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        gsap.to(outerCursor, { scale: 2.2, duration: 0.3, ease: 'power2.out' });
        gsap.to(innerCursor, { scale: 0, duration: 0.2 });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(outerCursor, { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.4)' });
        gsap.to(innerCursor, { scale: 1, duration: 0.3 });
      });
    });

    // CTA buttons: full fill
    document.querySelectorAll('.btn.yg-btn-primary, a[style*=background:#FBB038]').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        gsap.to(outerCursor, { backgroundColor: 'rgba(251,176,56,0.3)', borderColor: '#FBB038', scale: 2.5, duration: 0.3 });
      });
      btn.addEventListener('mouseleave', function () {
        gsap.to(outerCursor, { backgroundColor: 'transparent', borderColor: '#FBB038', scale: 1, duration: 0.4, ease: 'elastic.out(1,0.4)' });
      });
    });
  }


  // ── 9. WORK CARD HOVER SCALE ─────────────────────────────────────────────
  document.querySelectorAll('.yg-work-item').forEach(function (card) {
    var img = card.querySelector('img');
    if (!img) return;
    card.addEventListener('mouseenter', function () { gsap.to(img, { scale: 1.07, duration: 0.6, ease: 'power2.out' }); });
    card.addEventListener('mouseleave', function () { gsap.to(img, { scale: 1, duration: 0.5, ease: 'power2.out' }); });
  });


  // ── 10. SERVICE CARD NUMBER REVEAL ────────────────────────────────────────
  document.querySelectorAll('.yg-svc-num').forEach(function (num) {
    gsap.from(num, {
      scrollTrigger: { trigger: num, start: 'top 90%', once: true },
      opacity: 0, x: -30, duration: 0.6, ease: 'power2.out',
    });
  });

  // ── 11. SECTION HEADING UNDERLINE DRAW ────────────────────────────────────
  // Draws a yellow underline under section headings on scroll entry
  document.querySelectorAll('.yg-eyebrow').forEach(function (eye) {
    ScrollTrigger.create({
      trigger: eye, start: 'top 85%', once: true,
      onEnter: function () {
        gsap.from(eye.querySelector('span:first-child') || eye, {
          scaleX: 0, transformOrigin: 'left', duration: 0.6, ease: 'power3.out'
        });
      }
    });
  });



  // ── CTA SECTION ANIMATION ────────────────────────────────────────────────
  // Dramatic reveal: heading words drop in from above when section enters view
  var ctaSection=document.getElementById('yg-cta');
  if(ctaSection){
    var ctaHeading=ctaSection.querySelector('.yg-cta-heading');
    var ctaEyebrow=ctaSection.querySelector('p');
    var ctaBody=ctaSection.querySelector('p:nth-of-type(2)');
    var ctaBtns=ctaSection.querySelectorAll('.yg-cta-btn-primary,.yg-cta-btn-outline');
    var ctaContact=ctaSection.querySelector('.col-lg-4');
    var ctaIcon=ctaSection.querySelector('.yg-cta-icon-bg');

    var ctaTl=gsap.timeline({
      scrollTrigger:{trigger:ctaSection,start:'top 70%',once:true}
    });

    // Background wipe from left
    ctaTl.fromTo(ctaSection,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:0.01,ease:'none'});

    // Large icon spins in
    if(ctaIcon){
      ctaTl.from(ctaIcon,{scale:0.3,opacity:0,rotation:-40,duration:1.2,ease:'power3.out'},0);
    }

    // Eyebrow line
    if(ctaEyebrow){
      ctaTl.from(ctaEyebrow,{x:-40,opacity:0,duration:0.5,ease:'power2.out'},0.1);
    }

    // Heading: split words, stagger in
    if(ctaHeading){
      var words=ctaHeading.textContent.trim().split(/s+/);
      ctaHeading.innerHTML=words.map(function(w){
        return '<span class=cta-word style=display:inline-block;overflow:hidden;vertical-align:top;margin-right:.25em><span class=cta-word-inner style=display:inline-block>'+w+'</span></span>';
      }).join(' ');
      ctaTl.from(ctaHeading.querySelectorAll('.cta-word-inner'),{
        y:'110%',duration:0.65,stagger:0.08,ease:'power3.out'
      },0.2);
    }

    // Body text + buttons
    if(ctaBody) ctaTl.from(ctaBody,{y:20,opacity:0,duration:0.5,ease:'power2.out'},0.7);
    if(ctaBtns.length) ctaTl.from(ctaBtns,{y:20,opacity:0,duration:0.5,stagger:0.12,ease:'power2.out'},0.85);
    if(ctaContact) ctaTl.from(ctaContact,{x:30,opacity:0,duration:0.6,ease:'power2.out'},0.5);
  }



  // ── HERO LOGO DRAMATIC ENTRANCE ────────────────────────────────────────────
  var heroLogo=document.getElementById('yg-logo-hero');
  var heroImg=document.getElementById('hero-logo-img');
  if(heroLogo&&heroImg){
    // Logo explodes in from scale 0 with glow
    gsap.to(heroLogo,{opacity:1,y:0,duration:0.01,delay:0.9});
    gsap.fromTo(heroImg,
      {scale:0.4,opacity:0,filter:'blur(20px) drop-shadow(0 0 0px rgba(251,176,56,0))'},
      {scale:1,opacity:1,filter:'blur(0px) drop-shadow(0 0 80px rgba(251,176,56,.45))',
       duration:1.1,ease:'power3.out',delay:0.95,
       onComplete:function(){
         // After entrance: pulse the glow
         gsap.to(heroImg,{filter:'drop-shadow(0 0 30px rgba(251,176,56,.2))',duration:2,ease:'power1.inOut',yoyo:true,repeat:-1});
       }
    });
    // Eyebrow line
    var eyebrow=document.querySelector('.yg-video-content p:first-child');
    if(eyebrow) gsap.from(eyebrow,{opacity:0,y:20,duration:0.7,ease:'power2.out',delay:0.5});
    // Tagline
    var tagline=document.querySelector('.yg-video-content p:last-of-type');
    if(tagline) gsap.from(tagline,{opacity:0,y:20,duration:0.7,ease:'power2.out',delay:1.5});
    // CTAs
    var ctaDiv=document.querySelector('.yg-video-content div[style*=flex]');
    if(ctaDiv) gsap.from(ctaDiv.children,{opacity:0,y:20,duration:0.6,stagger:0.15,ease:'power2.out',delay:1.7});
  }



  // ── SECTION ENTRANCE ANIMATIONS ──────────────────────────────────────────────
  // Every .yg-eyebrow animates its line from scaleX 0
  gsap.utils.toArray('.yg-eyebrow, p[style*="eyebrow"], p[style*="Barlow Condensed"][style*="10px"]').forEach(function(el) {
    var line = el.querySelector('span:first-child');
    if (!line) return;
    gsap.from(line, {
      scrollTrigger: {trigger: el, start: 'top 88%', once: true},
      scaleX: 0, transformOrigin: 'left', duration: .5, ease: 'power2.out'
    });
  });

  // Work cards: stagger in with clip-path reveal (cinematic wipe)
  var workItems = document.querySelectorAll('.yg-work-item');
  if (workItems.length) {
    gsap.from(workItems, {
      scrollTrigger: {trigger: workItems[0].closest('.row, div'), start: 'top 85%', once: true},
      opacity: 0, scale: .96, duration: .7, stagger: .08, ease: 'power2.out'
    });
  }

  // Testimonial cards: slide in from alternating sides
  gsap.utils.toArray('.testi').forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: {trigger: card, start: 'top 88%', once: true},
      opacity: 0, x: i % 2 === 0 ? -30 : 30, duration: .6, ease: 'power2.out', delay: (i % 3) * .1
    });
  });

  // Blog cards: cascade up
  gsap.utils.toArray('.bc').forEach(function(card, i) {
    gsap.from(card, {
      scrollTrigger: {trigger: card, start: 'top 90%', once: true},
      opacity: 0, y: 40, duration: .6, ease: 'power2.out', delay: (i % 3) * .12
    });
  });

  // Kinetic stats: individual counter per stat on scroll
  document.querySelectorAll('[data-count]').forEach(function(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    // Skip if already handled by stats-strip script
    if (el.closest('#stats-strip')) return;
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function() {
        gsap.to({val:0}, {val:target, duration:1.5, ease:'power2.out',
          onUpdate: function() { el.textContent = Math.round(this.targets()[0].val) + suffix; }
        });
      }
    });
  });

  // CTA section: heading text wipe
  var ctaHeading = document.getElementById('cta-heading');
  if (ctaHeading) {
    // Split into lines for stagger
    var lines = ctaHeading.innerHTML.split('<br>');
    ctaHeading.innerHTML = lines.map(function(l) {
      return '<span style="display:block;overflow:hidden"><span class="cta-line" style="display:block;will-change:transform">' + l + '</span></span>';
    }).join('');
    gsap.from(ctaHeading.querySelectorAll('.cta-line'), {
      scrollTrigger: {trigger: ctaHeading, start: 'top 80%', once: true},
      y: '100%', duration: .75, stagger: .12, ease: 'power3.out'
    });
  }


  console.log('YGP Animations initialised');

})();
