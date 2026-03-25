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
  const title = section.querySelector('.section-title');
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
    scroll: 3600,
  };

  let current = -1;
  let titleShown = false;

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
  // TEXT CONTROL
  // ======================
  const showText = i => {
    if (current === i) return;

    const prev = current;
    current = i;

    if (prev >= 0 && texts[prev]) {
      gsap.set(texts[prev], { autoAlpha: 0 });
    }

    const el = texts[i];
    if (el) gsap.set(el, { autoAlpha: 1 });

    const inner = el.querySelectorAll('.js-morph-animate');
    initTextReveal(inner, false);

    const newValue = `${i + 1}`;

    if (number.textContent === newValue) return;

    gsap.to(number, {
      x: -20,
      opacity: 0,
      duration: 0.25,
      delay: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        number.textContent = newValue;

        gsap.fromTo(
          number,
          {
            x: 20,
            opacity: 0,
          },
          {
            x: 0,
            opacity: 1,
            duration: 0.25,
            ease: 'power2.out',
          },
        );
      },
    });
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

      onEnter: () => {
        if (!titleShown) {
          initTextReveal([title], false);
          titleShown = true;
        }

        // `initTextReveal` rebuilds/animates inner lines, but `onLeaveBack`
        // may have set `autoAlpha: 0` on the whole title element.
        if (title) gsap.set(title, { autoAlpha: 1 });

        showText(0);
      },

      // When scrolling back down after `onLeaveBack`,
      // ScrollTrigger may call `onEnterBack` instead of `onEnter`.
      onEnterBack: () => {
        if (!titleShown) {
          initTextReveal([title], false);
          titleShown = true;
        }

        if (title) gsap.set(title, { autoAlpha: 1 });

        showText(0);
      },

      onUpdate: self => {
        const p = self.progress;

        if (p < 0.28) {
          showText(0);
        } else if (p < 0.68) {
          showText(1);
        } else {
          showText(2);
        }
      },

      onLeaveBack: () => {
        texts.forEach(t => gsap.set(t, { autoAlpha: 0 }));
        current = -1;

        // Reset title state so it can be prepared/animated again.
        titleShown = false;
        if (title) {
          title.style.visibility = 'hidden';
          gsap.set(title, { autoAlpha: 0 });
        }
      },

      snap: false,
    },
  });

  // ======================
  // SCREEN 1 (PAUSE)
  // ======================
  tl.to({}, { duration: 0.45 });

  // ======================
  // 1 → 2
  // ======================
  tl.to(left, {
    x: 0,
    rotate: -45,
    duration: 1,
    ease: 'power1.inOut',
  });

  tl.to(
    right,
    {
      x: 0,
      rotate: 45,
      duration: 1,
      ease: 'power1.inOut',
    },
    '<',
  );

  tl.to(
    center,
    {
      scale: 0,
      opacity: 0,
      duration: 0.5,
      ease: 'power1.out',
    },
    '<',
  );

  tl.to(section, { backgroundColor: '#A9472C', duration: 0.7 }, '<');
  tl.to(hole, { backgroundColor: '#A9472C', duration: 0.7 }, '<');

  // ======================
  // SCREEN 2 (PAUSE)
  // ======================
  tl.to({}, { duration: 0.9 });

  // ======================
  // 2 → 3
  // ======================
  tl.to(center, { opacity: 0, scale: 0, duration: 0.2 });
  tl.to(right, { opacity: 0, duration: 0.2 }, '<');

  tl.to(left, {
    scaleY: CONFIG.line.thickness,
    duration: 0.6,
    ease: 'power1.inOut',
  });

  tl.to(
    left,
    {
      scaleX: CONFIG.line.length,
      duration: 0.9,
      ease: 'power1.inOut',
    },
    '<',
  );

  tl.to(
    left,
    {
      rotate: CONFIG.line.angle,
      duration: 0.6,
      ease: 'power1.inOut',
    },
    '<',
  );

  tl.to(
    left,
    {
      y: CONFIG.line.offsetY,
      duration: 0.6,
      ease: 'power1.inOut',
    },
    '<',
  );

  tl.to(
    left,
    {
      skewX: CONFIG.line.skewX,
      duration: 0.6,
      ease: 'power1.inOut',
    },
    '<',
  );

  // ======================
  // SCREEN 3 (PAUSE)
  // ======================
  tl.to({}, { duration: 0.6 });

  // ======================
  // COLORS SCREEN 3
  // ======================
  tl.to(section, { backgroundColor: '#E6D2B5', duration: 0.7 }, '<');

  tl.to(
    '.section--morph h4, .section--morph p, .section-title, .screen-number',
    {
      color: '#A9472C',
      duration: 0.7,
    },
    '<',
  );

  tl.to(left, { backgroundColor: '#A9472C', duration: 0.7 }, '<');

  tl.to(
    hole,
    {
      backgroundColor: '#A9472C',
      duration: 0.7,
    },
    '<',
  );
};
