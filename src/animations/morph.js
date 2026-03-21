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

  const texts = section.querySelectorAll('.js-morph-text');
  const title = section.querySelector('.js-morph-title');
  const number = section.querySelector('.screen-number');

  let current = -1;

  // ======================
  // START POSITIONS (ВАЖЛИВО)
  // ======================
  gsap.set(left, { x: -220 });
  gsap.set(right, { x: 220 });
  gsap.set(center, { scale: 1 });

  // ======================
  // COLORS (ЕКРАН 1)
  // ======================
  gsap.set(section, { backgroundColor: '#312926' });

  gsap.set('.section--morph h4, .section--morph p, .section-title, .screen-number', { color: '#F9F0E8' });

  gsap.set(center, { backgroundColor: '#E6D2B5' });
  gsap.set(right, { backgroundColor: '#E6D2B5' });
  gsap.set(left, { borderColor: '#E6D2B5' });

  // ======================
  // TEXT SWITCH
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
      end: '+=3500',
      scrub: true,
      pin: true,
    },
  });

  // ======================
  // 🟢 SCREEN 1
  // ======================
  tl.add(() => showText(0), 0);

  // пауза (текст)
  tl.to({}, { duration: 0.6 });

  // ======================
  // 🔄 1 → 2
  // ======================
  tl.to(left, {
    x: 0,
    rotate: 45,
    ease: 'none',
  });

  tl.to(
    right,
    {
      x: 0,
      rotate: -45,
      ease: 'none',
    },
    '<',
  );

  tl.to(
    center,
    {
      scale: 0,
      opacity: 0,
      ease: 'none',
    },
    '<',
  );

  // кольори екран 2
  tl.to(
    section,
    {
      backgroundColor: '#A9472C',
      ease: 'none',
    },
    '<',
  );

  // ======================
  // 🟡 SCREEN 2
  // ======================
  tl.add(() => showText(1));
  tl.to({}, { duration: 0.6 });

  // ======================
  // 🔄 2 → 3
  // ======================
  tl.to([left, right], {
    scaleY: 0.08,
    ease: 'none',
  });

  tl.to(
    [left, right],
    {
      scaleX: 5,
      rotate: 45,
      ease: 'none',
    },
    '<',
  );

  tl.to(left, { y: -10, ease: 'none' }, '<');
  tl.to(right, { y: 10, ease: 'none' }, '<');

  // кольори екран 3
  tl.to(
    section,
    {
      backgroundColor: '#E6D2B5',
      ease: 'none',
    },
    '<',
  );

  tl.to(
    '.section--morph h4, .section--morph p, .section-title, .screen-number',
    {
      color: '#A9472C',
      ease: 'none',
    },
    '<',
  );

  tl.to(center, { backgroundColor: '#A9472C' }, '<');
  tl.to(right, { backgroundColor: '#A9472C' }, '<');
  tl.to(left, { borderColor: '#A9472C' }, '<');

  // ======================
  // 🔴 SCREEN 3
  // ======================
  tl.add(() => showText(2));
};
