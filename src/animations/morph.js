import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initTextReveal } from './textReveal';

gsap.registerPlugin(ScrollTrigger);

export const initMorph = () => {
  const section = document.querySelector('.section--morph');
  if (!section) return;

  const left = section.querySelector('.shape-left');
  const center = section.querySelector('.shape-center');
  const right = section.querySelector('.shape-right');
  const hole = section.querySelector('.shape-hole');

  const texts = section.querySelectorAll('.js-morph-text');
  const title = section.querySelector('.js-morph-title');
  const number = section.querySelector('.screen-number');

  const CONFIG = {
    size: 178,
    line: {
      thickness: 0.22,
      length: 1.6,
      angle: -52,
      offsetY: -20,
      skewX: -50,
    },
    scroll: 4000,
  };

  let current = -1;

  // ======================
  // START POSITIONS
  // ======================
  gsap.set(left, { x: -CONFIG.size });
  gsap.set(center, { x: 0 });
  gsap.set(right, { x: CONFIG.size });

  gsap.set(left, { transformOrigin: 'center center' });

  // ======================
  // COLORS (SCREEN 1)
  // ======================
  const setColors = (bg, text, shape) => {
    gsap.set(section, { backgroundColor: bg });

    gsap.set('.section--morph h4, .section--morph p, .section-title, .screen-number', { color: text });

    gsap.set(center, { backgroundColor: shape });
    gsap.set(right, { backgroundColor: shape });
    gsap.set(left, { borderColor: shape, backgroundColor: shape });

    gsap.set(hole, { backgroundColor: bg });
  };

  setColors('#312926', '#F9F0E8', '#E6D2B5');

  // ======================
  // TEXT
  // ======================
  const showText = i => {
    if (current === i) return;
    current = i;

    texts.forEach(t => {
      t.style.opacity = 0;
      t.style.visibility = 'hidden';
    });

    const el = texts[i];
    el.style.opacity = 1;
    el.style.visibility = 'visible';

    const inner = el.querySelectorAll('.js-morph-animate');

    if (i === 0) {
      initTextReveal([title, ...inner], false);
    } else {
      initTextReveal(inner, false);
    }

    number.textContent = `0${i + 1}`;
  };

  // ======================
  // TIMELINE
  // ======================
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${CONFIG.scroll}`,
      scrub: 1,
      pin: true,

      // 🔥 FIX SNAP
      snap: {
        snapTo: progress => {
          const points = [0, 0.33, 0.66, 1];
          const threshold = 0.12; // 👈 збільшили

          if (progress > 1 - threshold) return 1;

          return points.reduce((prev, curr) => (Math.abs(curr - progress) < Math.abs(prev - progress) ? curr : prev));
        },
        duration: 0.4,
        ease: 'power2.out',
      },
    },
  });

  // ======================
  // SCREEN 1
  // ======================
  tl.add(() => showText(0), 0);
  tl.to({}, { duration: 0.4 });

  // ======================
  // 1 → 2
  // ======================
  tl.to(left, {
    x: 0,
    rotate: -45,
    ease: 'none',
    duration: 1,
  });

  tl.to(
    right,
    {
      x: 0,
      rotate: 45,
      ease: 'none',
      duration: 1,
    },
    '<',
  );

  tl.to(
    center,
    {
      scale: 0,
      opacity: 0,
      duration: 0.6,
    },
    '<',
  );

  tl.to(section, { backgroundColor: '#A9472C' }, '<');
  tl.to(hole, { backgroundColor: '#A9472C' }, '<');

  // ======================
  // SCREEN 2
  // ======================
  tl.add(() => showText(1));
  tl.to({}, { duration: 0.4 });

  // ======================
  // 2 → 3
  // ======================
  tl.to(center, { opacity: 0, scale: 0, duration: 0.2 });
  tl.to(right, { opacity: 0, duration: 0.2 }, '<');

  tl.to(left, {
    scaleY: CONFIG.line.thickness,
    duration: 0.6,
    ease: 'none',
  });

  tl.to(
    left,
    {
      scaleX: CONFIG.line.length,
      duration: 0.8,
      ease: 'none',
    },
    '<',
  );

  tl.to(
    left,
    {
      rotate: CONFIG.line.angle,
      duration: 0.6,
      ease: 'none',
    },
    '<',
  );

  tl.to(
    left,
    {
      y: CONFIG.line.offsetY,
      duration: 0.6,
      ease: 'none',
    },
    '<',
  );

  tl.to(
    left,
    {
      skewX: CONFIG.line.skewX,
      duration: 0.6,
      ease: 'none',
    },
    '<',
  );

  // ======================
  // COLORS SCREEN 3
  // ======================
  tl.to(section, { backgroundColor: '#E6D2B5' }, '<');

  tl.to('.section--morph h4, .section--morph p, .section-title, .screen-number', { color: '#A9472C' }, '<');

  tl.to(left, { backgroundColor: '#A9472C' }, '<');

  tl.to(
    hole,
    {
      backgroundColor: '#A9472C',
      duration: 0.8,
    },
    '<',
  );

  // ======================
  // SCREEN 3
  // ======================
  tl.add(() => showText(2));

  // 🔥 ФІКС: даємо місце для snap
  tl.to({}, { duration: 1.8 });
};
