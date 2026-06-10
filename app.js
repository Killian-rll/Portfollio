/* ==========================================================================
   PORTFOLIO PREMIUM - STABLE ANIMATIONS ENGINE (KILLIAN RULLEAU)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // 1. Initialize Smooth Scroll (Lenis)
  initSmoothScroll();

  // 2. Initialize Custom Interactive Cursor
  initCustomCursor();

  // 3. Initialize Preloader & Hero Reveal
  initPreloader();

  // 4. Initialize Hero Parallax Scroll
  initHeroParallax();

  // 5. Initialize Wow Centerpiece Zoom Portal (Circle Reveal & Banner)
  initZoomPortalReveal();

  // 6. Initialize Split Section Sliding Entry (Qualities & Challenges Pinned)
  initSplitSlidingEntry();

  // 7. Initialize LED Chronological Timeline
  initLEDTimeline();

  // 8. Initialize Horizontal Pinned GMS Showcase
  initGMSHorizontalScroll();

  // 9. Initialize Interactive Drawers Cabinet
  initToolsCabinet();

  // 10. Initialize Gallery 3D Tilt & Interactions
  initGallery3DTilt();
  initGlobalInteractions();
});

/* ==========================================================================
   1. LENIS SMOOTH SCROLLING
   ========================================================================== */
let lenis;
function initSmoothScroll() {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Synchronize ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

/* ==========================================================================
   2. CUSTOM INTERACTIVE CURSOR WITH INERTIA
   ========================================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  const cursorLabel = document.getElementById('cursor-label');

  if (!cursor || !cursorRing) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  const xToDot = gsap.quickTo(cursor, "x", { duration: 0.08, ease: "power3" });
  const yToDot = gsap.quickTo(cursor, "y", { duration: 0.08, ease: "power3" });

  const xToRing = gsap.quickTo(cursorRing, "x", { duration: 0.35, ease: "power3" });
  const yToRing = gsap.quickTo(cursorRing, "y", { duration: 0.35, ease: "power3" });

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    xToDot(mouseX);
    yToDot(mouseY);

    xToRing(mouseX);
    yToRing(mouseY);
  });

  const updateCursorTracking = () => {
    const interactives = document.querySelectorAll('.interactive');
    interactives.forEach(el => {
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);

      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
  };

  function handleMouseEnter(e) {
    const dataLabel = e.currentTarget.getAttribute('data-cursor');
    if (dataLabel) {
      document.body.classList.add('cursor-hovering');
    } else {
      document.body.classList.add('cursor-link');
    }
  }

  function handleMouseLeave() {
    document.body.classList.remove('cursor-hovering');
    document.body.classList.remove('cursor-link');
  }

  updateCursorTracking();
  window.updateCursorTracking = updateCursorTracking;

  document.addEventListener('mouseleave', () => {
    gsap.to([cursor, cursorRing], { opacity: 0 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to([cursor, cursorRing], { opacity: 1 });
  });
}

/* ==========================================================================
   3. PRELOADER & HERO REVEAL
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const percentNum = document.getElementById('preloader-num');
  const progressBar = document.getElementById('preloader-bar');

  if (!preloader) return;

  let countObj = { val: 0 };
  const tl = gsap.timeline({
    onComplete: () => {
      ScrollTrigger.refresh();
    }
  });

  // Percentage counter
  tl.to(countObj, {
    val: 100,
    duration: 2.0,
    ease: "power3.out",
    onUpdate: () => {
      const currentVal = Math.floor(countObj.val);
      percentNum.innerHTML = currentVal;
      progressBar.style.width = currentVal + '%';
    }
  });

  // Fade title elements out
  tl.to('#preloader-title, .preloader-percentage-container', {
    y: -30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: "power2.in"
  });

  // Slide preloader up
  tl.to(preloader, {
    yPercent: -100,
    duration: 1.0,
    ease: "power4.inOut"
  });

  // Stagger hero entry items
  tl.from('#hero-tag', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.4");

  const titleSpans = document.querySelectorAll('#hero-title span');
  tl.from(titleSpans, {
    y: 50,
    opacity: 0,
    duration: 1.0,
    stagger: 0.12,
    ease: "power4.out"
  }, "-=0.6");

  tl.from('#hero-desc', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.8");
}

/* ==========================================================================
   4. HERO PARALLAX SCROLL
   ========================================================================== */
function initHeroParallax() {
  const heroContent = document.getElementById('hero-content-wrapper');
  if (!heroContent) return;

  gsap.to(heroContent, {
    yPercent: -20,
    scale: 0.9,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
}

/* ==========================================================================
   5. WOW CENTERPIECE: CIRCLE ZOOM REVEAL & SLIDING BANNER (NEW & 100% STABLE)
   ========================================================================== */
function initZoomPortalReveal() {
  const trigger = document.getElementById('zoom-portal-section');
  const outerLayer = document.getElementById('portal-layer-outer');
  const outerText = document.getElementById('portal-outer-text');
  const growingCircle = document.getElementById('portal-growing-circle');
  const innerLayer = document.getElementById('portal-layer-inner');
  const slidingText = document.getElementById('portal-sliding-text');
  const cardPresentation = document.querySelector('.portal-card-presentation');
  const cardMastery = document.querySelector('.portal-card-mastery');
  const cardProject = document.querySelector('.portal-card-project');

  if (!trigger || !growingCircle || !innerLayer || !outerLayer || !cardPresentation || !cardMastery || !cardProject) return;

  const portalTl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger,
      start: 'top top',
      end: '+=900%', // Augmenté pour allonger la durée totale d'affichage et de scroll
      pin: true,
      scrub: 0.8, // Transitions douces lors du scroll
      invalidateOnRefresh: true
    }
  });

  // 1. Initial outer text scales down and fades out
  portalTl.to(outerText, {
    scale: 0.8,
    opacity: 0,
    duration: 0.5,
    ease: 'power1.inOut'
  }, 0);

  // 2. Glowing background circle scales up massively to cover the whole viewport
  portalTl.to(growingCircle, {
    scale: 45,
    duration: 1.0,
    ease: 'power2.in'
  }, 0);

  // 3. Smoothly crossfade outer layer and inner layer
  portalTl.to(innerLayer, {
    opacity: 1,
    duration: 0.4,
    ease: 'none',
    onStart: () => {
      innerLayer.style.pointerEvents = 'all';
    },
    onReverseComplete: () => {
      innerLayer.style.pointerEvents = 'none';
    }
  }, 0.35);

  portalTl.to(outerLayer, {
    opacity: 0,
    duration: 0.4,
    ease: 'none'
  }, 0.4);

  // 4. Giant banner text slides EXACTLY its width
  portalTl.fromTo(slidingText,
    { x: '100vw' },
    { x: () => -(slidingText.scrollWidth), ease: 'none', duration: 3.4 },
    0.8 // Attends que l'apparition du cercle bleu et le fondu soient terminés
  );

  // 5. Presentation card rises and fades in cleanly
  portalTl.fromTo(cardPresentation,
    { y: 60, opacity: 0, pointerEvents: 'none' },
    { y: 0, opacity: 1, pointerEvents: 'all', ease: 'power2.out', duration: 0.5 },
    0.6
  );

  // 6. Presentation card slides left & fades out, Mastery card slides in from right & fades in
  portalTl.to(cardPresentation, {
    x: -100,
    opacity: 0,
    pointerEvents: 'none',
    duration: 0.4,
    ease: 'power2.inOut'
  }, 2.0);

  portalTl.fromTo(cardMastery,
    { x: 100, opacity: 0, pointerEvents: 'none' },
    { x: 0, opacity: 1, pointerEvents: 'all', duration: 0.4, ease: 'power2.out' },
    2.0
  );

  // 7. Mastery card slides left & fades out, Project/Campaign card slides in from right & fades in
  portalTl.to(cardMastery, {
    x: -100,
    opacity: 0,
    pointerEvents: 'none',
    duration: 0.4,
    ease: 'power2.inOut'
  }, 3.4);

  portalTl.fromTo(cardProject,
    { x: 100, opacity: 0, pointerEvents: 'none' },
    { x: 0, opacity: 1, pointerEvents: 'all', duration: 0.4, ease: 'power2.out' },
    3.4
  );
}

/* ==========================================================================
   6. SPLIT SECTION PINNED DASHBOARD (FLYING CARDS FROM RANDOM COORDINATES)
   ========================================================================== */
function initSplitSlidingEntry() {
  const splitSection = document.getElementById('split-section');
  const panelLeft = document.getElementById('panel-left');
  const panelRight = document.getElementById('panel-right');
  const separationPortal = document.querySelector('.split-center-portal');

  if (!splitSection || !panelLeft || !panelRight) return;

  // 1. Pin the split section for long scrolling assembly
  const splitTl = gsap.timeline({
    scrollTrigger: {
      trigger: splitSection,
      start: 'top top',
      end: '+=250%',
      pin: true,
      scrub: 0.8,
      invalidateOnRefresh: true
    }
  });

  // 2. Animate column header and divider portal entrance
  splitTl.fromTo(separationPortal, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)' }, 0);
  splitTl.fromTo('.dashboard-header', { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, 0);

  // 3. Animate each quality/challenge pair sequentially coming from random coords!
  const leftCards = panelLeft.querySelectorAll('.dashboard-card');
  const rightCards = panelRight.querySelectorAll('.dashboard-card');
  const totalCards = Math.max(leftCards.length, rightCards.length);

  for (let i = 0; i < totalCards; i++) {
    const leftCard = leftCards[i];
    const rightCard = rightCards[i];
    const startTime = 0.2 + (i * 0.3); // Stagger each pair over scroll

    if (leftCard) {
      // Random coordinates off-screen left/top/bottom
      const randX = gsap.utils.random(-800, -300);
      const randY = gsap.utils.random(-400, 400);
      const randRot = gsap.utils.random(-35, 35);

      splitTl.fromTo(leftCard,
        {
          x: randX,
          y: randY,
          rotation: randRot,
          scale: 0.3,
          opacity: 0
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.1)'
        },
        startTime
      );
    }

    if (rightCard) {
      // Random coordinates off-screen right/top/bottom
      const randX = gsap.utils.random(300, 800);
      const randY = gsap.utils.random(-400, 400);
      const randRot = gsap.utils.random(-35, 35);

      splitTl.fromTo(rightCard,
        {
          x: randX,
          y: randY,
          rotation: randRot,
          scale: 0.3,
          opacity: 0
        },
        {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(1.1)'
        },
        startTime
      );
    }
  }
}

/* ==========================================================================
   7. LED CHROMATIC TIMELINE
   ========================================================================== */
function initLEDTimeline() {
  const timelineTrigger = document.getElementById('timeline-trigger');
  const svgPathBg = document.getElementById('serpent-path-bg');
  const svgPathProg = document.getElementById('serpent-path-progress');
  const items = document.querySelectorAll('.timeline-item');

  if (!timelineTrigger || !svgPathBg || !svgPathProg || items.length === 0) return;

  let pathTween = null;

  // Function to calculate and draw the SVG serpentine path, then initialize or update the GSAP animation
  function drawSerpentineTimeline() {
    const containerRect = timelineTrigger.getBoundingClientRect();
    const width = containerRect.width;
    const isMobile = window.innerWidth <= 768;

    // Starting coordinates
    const firstItemRect = items[0].getBoundingClientRect();
    const startY = (firstItemRect.top + firstItemRect.bottom) / 2 - containerRect.top;

    let d = "";

    if (isMobile) {
      // Mobile layout: straight line down the left side (at x = 20)
      d += `M 20,${startY} `;
      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterY = (itemRect.top + itemRect.bottom) / 2 - containerRect.top;
        d += `L 20,${itemCenterY} `;
      });
      // Continue to the bottom of the section to chain into the next step
      d += `L 20,${containerRect.height}`;
    } else {
      // Desktop serpentine layout
      const padding = window.innerWidth > 991 ? 80 : 40;

      // Start exactly at the first card's dot in the middle of the timeline (left: 44%)
      d += `M ${width * 0.44},${startY} `;

      items.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterY = (itemRect.top + itemRect.bottom) / 2 - containerRect.top;
        const isOdd = index % 2 === 0; // Odd cards are on the right, even on the left

        if (index === 0) {
          // Odd: travel horizontally left-to-right to the right card entrance
          d += `L ${width - padding},${startY} `;
          // Curve down to the next level's center Y position
          const nextRect = items[index + 1]?.getBoundingClientRect();
          if (nextRect) {
            const nextCenterY = (nextRect.top + nextRect.bottom) / 2 - containerRect.top;
            d += `C ${width - padding / 4},${startY} ${width - padding / 4},${nextCenterY} ${width - padding},${nextCenterY} `;
          }
        } else if (index < items.length - 1) {
          const nextRect = items[index + 1].getBoundingClientRect();
          const nextCenterY = (nextRect.top + nextRect.bottom) / 2 - containerRect.top;

          if (isOdd) {
            // odd (right card): travel left-to-right, then curve down on the right side
            d += `L ${width - padding},${itemCenterY} `;
            d += `C ${width - padding / 4},${itemCenterY} ${width - padding / 4},${nextCenterY} ${width - padding},${nextCenterY} `;
          } else {
            // even (left card): travel right-to-left, then curve down on the left side
            d += `L ${padding},${itemCenterY} `;
            d += `C ${padding / 4},${itemCenterY} ${padding / 4},${nextCenterY} ${padding},${nextCenterY} `;
          }
        } else {
          // Last timeline card: curve down to the side to chain into Section 04
          const endY = containerRect.height;
          if (isOdd) {
            d += `L ${width - padding - 80},${itemCenterY} `;
            d += `C ${width - padding},${itemCenterY} ${width - padding},${itemCenterY + 150} ${width - padding},${endY}`;
          } else {
            d += `L ${padding + 80},${itemCenterY} `;
            d += `C ${padding},${itemCenterY} ${padding},${itemCenterY + 150} ${padding},${endY}`;
          }
        }
      });
    }

    svgPathBg.setAttribute('d', d);
    svgPathProg.setAttribute('d', d);

    // Now calculate actual length
    try {
      const pathLength = svgPathProg.getTotalLength();

      // Set initial dash properties immediately so the line is hidden before any scroll
      svgPathProg.style.strokeDasharray = pathLength;
      svgPathProg.style.strokeDashoffset = pathLength;

      // Kill any existing tween to avoid duplicates
      if (pathTween) {
        pathTween.scrollTrigger.kill();
        pathTween.kill();
      }

      // Create the ScrollTrigger tween with the accurate length
      pathTween = gsap.to(svgPathProg, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: timelineTrigger,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: 0.5
        }
      });
    } catch (e) {
      console.warn("Failed to retrieve SVG path length", e);
    }
  }

  // Draw immediately to hide the line before render
  drawSerpentineTimeline();

  // Also draw on window load and resize to ensure total accuracy
  window.addEventListener('load', drawSerpentineTimeline);
  window.addEventListener('resize', drawSerpentineTimeline);

  // Create ScrollTriggers for individual items to light them up as the snake passes
  items.forEach((item, index) => {
    ScrollTrigger.create({
      trigger: item,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => item.classList.add('active'),
      onLeaveBack: () => item.classList.remove('active'),
      onEnterBack: () => item.classList.add('active'),
    });

    const content = item.querySelector('.timeline-content');
    gsap.fromTo(content,
      {
        x: index % 2 === 0 ? 50 : -50,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}

/* ==========================================================================
   8. GMS DIFFUSION - HORIZONTAL PINNED SHOWCASE
   ========================================================================== */
function initGMSHorizontalScroll() {
  const workContainer = document.getElementById('work'); // The full container including the header
  const workWrapper = document.getElementById('work-wrapper');
  const workTrigger = document.getElementById('work-trigger');

  if (!workWrapper || !workTrigger || !workContainer) return;

  const horizontalScrollTween = gsap.to(workWrapper, {
    x: () => -(workWrapper.scrollWidth - window.innerWidth),
    ease: "none",
    scrollTrigger: {
      trigger: workContainer, // Pin the whole section so the header stays at the top
      pin: true,
      scrub: 0.8,
      start: 'top top',
      end: () => `+=${workWrapper.scrollWidth - window.innerWidth}`,
      invalidateOnRefresh: true,
    }
  });

  const slides = gsap.utils.toArray('.work-slide');
  slides.forEach((slide) => {
    ScrollTrigger.create({
      trigger: slide,
      containerAnimation: horizontalScrollTween,
      start: 'left 50%',
      end: 'right 50%',
      onEnter: () => slide.classList.add('active-slide'),
      onLeave: () => slide.classList.remove('active-slide'),
      onEnterBack: () => slide.classList.add('active-slide'),
      onLeaveBack: () => slide.classList.remove('active-slide'),
    });

    const num = slide.querySelector('.work-num');
    const title = slide.querySelector('.work-title-giant');
    const desc = slide.querySelector('.work-desc');

    gsap.from([num, title, desc], {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: slide,
        containerAnimation: horizontalScrollTween,
        start: 'left 80%',
        toggleActions: 'play none none reverse'
      }
    });
  });
}

/* ==========================================================================
   9. SNAPPY MAGNETIC TOOLS GRID
   ========================================================================== */
function initToolsCabinet() {
  const cabinetSection = document.querySelector('.tools');
  const dockInner = document.getElementById('logos-cloud');
  const drawers = document.querySelectorAll('.drawer-card');
  if (!cabinetSection || !dockInner || drawers.length === 0) return;

  /* ── 1. Collect tags ── */
  const allTags = [];
  cabinetSection.querySelectorAll('.drawer-content .tool-tag').forEach(tag => {
    const parent = tag.parentNode;
    allTags.push({
      element: tag,
      originalParent: parent,
      drawerNum: parent.closest('.drawer-card').dataset.drawer,
      dockItem: null,
      fromX: 0,
      fromY: 0,
      fromRot: (Math.random() - 0.5) * 20
    });
  });

  /* ── 2. Build dock items once ── */
  allTags.forEach(td => {
    const img = td.element.querySelector('img');
    const item = document.createElement('div');
    item.className = 'dock-item';
    item.dataset.name = img ? img.alt : '';
    item.dataset.drawer = td.drawerNum;
    const icon = document.createElement('img');
    icon.src = img ? img.src : '';
    icon.alt = img ? img.alt : '';
    icon.draggable = false;
    item.appendChild(icon);
    dockInner.appendChild(item);
    td.dockItem = item;
  });

  /* ── 3. refreshInit: measure with all drawers at x=0, then set initial state ── */
  ScrollTrigger.addEventListener('refreshInit', () => {
    document.body.classList.add('measuring-layout');

    /* Put all tags back in their drawers */
    allTags.forEach(td => {
      td.originalParent.appendChild(td.element);
      gsap.set(td.element, { clearProps: 'all' });
    });

    /* Open all drawers at x=0 for measurement */
    drawers.forEach(drawer => {
      drawer.classList.add('open');
      gsap.set(drawer, { x: '0%', clearProps: 'opacity,visibility,scale,rotation' });
      const wrap = drawer.querySelector('.drawer-content-wrap');
      const content = drawer.querySelector('.drawer-content');
      if (wrap) gsap.set(wrap, { clearProps: 'all' });
      if (content) content.style.height = '';
    });

    /* Reset dock items to visible */
    allTags.forEach(td => gsap.set(td.dockItem, { clearProps: 'all' }));

    document.body.offsetHeight;

    /* Lock content-wrap heights — +24px buffer so the last row is never clipped */
    let maxDrawerHeight = 300; // fallback minimum
    drawers.forEach(drawer => {
      const content = drawer.querySelector('.drawer-content');
      const wrap = drawer.querySelector('.drawer-content-wrap');
      const front = drawer.querySelector('.drawer-front');
      if (!content || !wrap) return;
      const h = content.offsetHeight + 24;
      const frontH = front ? front.offsetHeight : 0;
      const totalH = frontH + h;
      drawer.dataset.naturalHeight = h;
      drawer.style.height = totalH + 'px';
      wrap.style.height = h + 'px';
      wrap.style.opacity = '1';
      wrap.style.overflow = 'visible';
      if (totalH > maxDrawerHeight) maxDrawerHeight = totalH;
    });
    /* Set the grid height to the tallest drawer so it doesn't collapse */
    const grid = document.querySelector('.drawers-grid');
    if (grid) grid.style.height = maxDrawerHeight + 'px';

    document.body.offsetHeight;

    /* Measure fromX/fromY for every tag while drawer is at x=0 */
    allTags.forEach(td => {
      const tR = td.element.getBoundingClientRect();
      const dR = td.dockItem.getBoundingClientRect();
      td.fromX = dR.left + dR.width / 2 - (tR.left + tR.width / 2);
      td.fromY = dR.top + dR.height / 2 - (tR.top + tR.height / 2);
    });

    /* ── Set initial visual states ── */
    /* Drawer 1 visible, rest offscreen right across the full viewport */
    drawers.forEach((drawer, i) => {
      gsap.set(drawer, { x: i === 0 ? '0vw' : '150vw' });
    });

    /* All tags hidden initially */
    allTags.forEach(td => gsap.set(td.element, { autoAlpha: 0, scale: 0.5 }));

    /* Only drawer 1's dock items visible, others display: none so they don't take space */
    allTags.forEach(td => {
      const isVisible = td.drawerNum === drawers[0].dataset.drawer;
      gsap.set(td.dockItem, {
        display: isVisible ? 'flex' : 'none',
        autoAlpha: isVisible ? 1 : 0,
        scale: 1, y: 0
      });
    });

    document.body.classList.remove('measuring-layout');
    document.body.offsetHeight;
  });

  /* ── 4. ScrollTrigger timeline ── */
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.tools',
      start: 'top top',
      end: '+=1000%',
      pin: true,
      scrub: 1.2,
      invalidateOnRefresh: true
    }
  });

  drawers.forEach((drawer, idx) => {
    const drawerNum = drawer.dataset.drawer;
    const drawerTags = allTags.filter(t => t.drawerNum === drawerNum);
    const nextDrawer = drawers[idx + 1];
    const nextNum = nextDrawer ? nextDrawer.dataset.drawer : null;
    const nextTags = nextNum ? allTags.filter(t => t.drawerNum === nextNum) : [];

    if (drawerTags.length === 0) return;

    /* Fly logos from dock into current drawer */
    drawerTags.forEach((td, i) => {
      const pos = (i === 0) ? '>' : '-=0.3';

      /* Dock icon disappears */
      tl.to(td.dockItem, {
        autoAlpha: 0, scale: 0.4, y: -10,
        duration: 0.2, ease: 'power2.in'
      }, pos);

      /* Tag flies in using pre-computed offsets */
      tl.fromTo(td.element,
        { x: () => td.fromX, y: () => td.fromY, autoAlpha: 0, scale: 0.55, rotation: td.fromRot },
        { x: 0, y: 0, autoAlpha: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'power3.out' },
        '<'
      );
    });

    if (nextDrawer) {
      /* Pause on filled drawer */
      tl.to({}, { duration: 0.4 });

      /* Swap dock items in the DOM so the dock shrinks/grows precisely */
      tl.set(drawerTags.map(t => t.dockItem), { display: 'none' });

      /* Slide current out left entirely off screen, next in from far right simultaneously */
      tl.to(drawer, { x: '-150vw', duration: 0.8, ease: 'power2.inOut' }, '+=0.1');
      tl.fromTo(nextDrawer,
        { x: '150vw' },
        { x: '0vw', duration: 0.8, ease: 'power2.inOut' },
        '<'
      );

      /* Slide next drawer's dock icons in from the right */
      if (nextTags.length > 0) {
        tl.set(nextTags.map(t => t.dockItem), { display: 'flex' }, '<');
        tl.fromTo(nextTags.map(t => t.dockItem),
          { autoAlpha: 0, x: 200 },
          { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.05, ease: 'power3.out' },
          '<'
        );
      }
    } else {
      /* Once the last drawer is filled, DO NOT fly it out! 
         Let the user admire it, and when the scroll continues, the section simply unpins. */
      tl.to({}, { duration: 0.4 });
    }
  });
}



/* ==========================================================================
   10. GALLERY 3D TILT & INTERACTIONS
   ========================================================================== */
function initGallery3DTilt() {
  const items = document.querySelectorAll('.gallery-item');

  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const bound = item.getBoundingClientRect();
      const x = (e.clientX - bound.left) / bound.width - 0.5;
      const y = (e.clientY - bound.top) / bound.height - 0.5;

      gsap.to(item, {
        rotateX: -y * 15,
        rotateY: x * 15,
        scale: 1.02,
        boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
        duration: 0.45,
        ease: "power2.out",
        transformPerspective: 1000
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        boxShadow: "0 20px 45px rgba(0,0,0,0.4)",
        duration: 0.65,
        ease: "power3.out"
      });
    });
  });
}

function initGlobalInteractions() {
  const inputs = document.querySelectorAll('.form-input');
  inputs.forEach(input => {
    if (input.value.trim() !== "") {
      input.classList.add('has-value');
    }

    input.addEventListener('focus', () => {
      input.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      input.classList.remove('focused');
      if (input.value.trim() !== "") {
        input.classList.add('has-value');
      } else {
        input.classList.remove('has-value');
      }
    });
  });

  const menuBtn = document.getElementById('menu-btn');
  const menuCloseBtn = document.getElementById('menu-close-btn');
  const menuOverlay = document.getElementById('menu-overlay');
  const menuLinks = document.querySelectorAll('.menu-link');

  if (!menuBtn || !menuOverlay) return;

  const toggleMenu = (open) => {
    if (open) {
      lenis.stop();

      menuOverlay.style.display = "flex";
      menuOverlay.style.visibility = "visible";

      gsap.fromTo(menuOverlay,
        { yPercent: -100 },
        { yPercent: 0, duration: 0.85, ease: "power4.inOut" }
      );

      gsap.fromTo('.menu-link',
        { y: 85, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.08, ease: "power3.out", delay: 0.3 }
      );
    } else {
      lenis.start();

      gsap.to(menuOverlay, {
        yPercent: -100,
        duration: 0.75,
        ease: "power4.inOut",
        onComplete: () => {
          menuOverlay.style.display = "none";
          menuOverlay.style.visibility = "hidden";
        }
      });
    }
  };

  menuBtn.addEventListener('click', () => toggleMenu(true));
  menuCloseBtn.addEventListener('click', () => toggleMenu(false));

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      menuLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      toggleMenu(false);

      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        setTimeout(() => {
          lenis.scrollTo(targetElement, {
            offset: -10,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }, 600);
      }
    });
  });

  const magneticSubmit = document.getElementById('magnetic-submit');
  const submitBtn = magneticSubmit ? magneticSubmit.querySelector('.submit-btn') : null;

  if (magneticSubmit && submitBtn) {
    magneticSubmit.addEventListener('mousemove', (e) => {
      const bound = magneticSubmit.getBoundingClientRect();
      const x = e.clientX - bound.left - bound.width / 2;
      const y = e.clientY - bound.top - bound.height / 2;

      gsap.to(submitBtn, {
        x: x * 0.45,
        y: y * 0.45,
        scale: 1.02,
        duration: 0.35,
        ease: "power3.out"
      });
    });

    magneticSubmit.addEventListener('mouseleave', () => {
      gsap.to(submitBtn, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.65,
        ease: "elastic.out(1.1, 0.4)"
      });
    });
  }

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const submitBtnEl = form.querySelector('.submit-btn');
      const originalText = submitBtnEl.querySelector('span').innerText;

      submitBtnEl.style.pointerEvents = 'none';
      submitBtnEl.querySelector('span').innerText = 'Envoi en cours...';

      setTimeout(() => {
        submitBtnEl.querySelector('span').innerText = 'Message envoyé !';
        submitBtnEl.style.backgroundColor = 'var(--accent-blue)';
        submitBtnEl.style.color = '#000';

        form.reset();
        inputs.forEach(input => input.classList.remove('has-value'));

        setTimeout(() => {
          submitBtnEl.querySelector('span').innerText = originalText;
          submitBtnEl.style.backgroundColor = '#fff';
          submitBtnEl.style.color = '#000';
          submitBtnEl.style.pointerEvents = 'all';
        }, 3000);
      }, 1500);
    });
  }
}
