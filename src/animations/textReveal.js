import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const normalizeText = text => text.replace(/\s+/g, ' ').trim();

export const initTextReveal = (selector, useScroll = true, { force = false } = {}) => {
  const elements = typeof selector === 'string' ? document.querySelectorAll(selector) : selector;

  elements.forEach(el => {
    if (!el) return;

    el.style.visibility = 'visible';

    if (!el.dataset.textRevealOriginal) {
      el.dataset.textRevealOriginal = normalizeText(el.textContent);
    }

    const shouldRebuild = force || el.dataset.textRevealDirty === '1' || el.dataset.textRevealBuilt !== '1';

    let lineInners = [];

    if (shouldRebuild) {
      const text = el.dataset.textRevealOriginal;

      // Expensive part: split words + rebuild DOM into .text-line__inner spans.
      el.innerHTML = '';

      const words = text.split(' ').map(word => {
        const span = document.createElement('span');
        span.textContent = word + ' ';
        return span;
      });

      words.forEach(word => el.appendChild(word));
      // Force layout for accurate offsetTop measurements.
      el.offsetHeight;

      const lines = [];
      let currentLine = [];
      let lastTop = null;

      words.forEach(word => {
        const top = word.offsetTop;

        if (lastTop === null) lastTop = top;

        if (Math.abs(top - lastTop) > 5) {
          lines.push(currentLine);
          currentLine = [];
          lastTop = top;
        }

        currentLine.push(word.textContent);
      });

      if (currentLine.length) lines.push(currentLine);

      el.innerHTML = '';

      const rebuiltInners = [];

      lines.forEach(lineWords => {
        const line = document.createElement('span');
        line.classList.add('text-line');

        const inner = document.createElement('span');
        inner.classList.add('text-line__inner');

        inner.textContent = lineWords.join('').trim();

        line.appendChild(inner);
        el.appendChild(line);

        rebuiltInners.push(inner);
      });

      lineInners = rebuiltInners;
      el.dataset.textRevealBuilt = '1';
      el.dataset.textRevealDirty = '0';
    } else {
      lineInners = el.querySelectorAll('.text-line__inner');
      if (!lineInners || lineInners.length === 0) {
        // If DOM was unexpectedly not prepared, rebuild once.
        el.dataset.textRevealDirty = '1';
        initTextReveal([el], useScroll, { force: true });
        return;
      }
    }

    // Re-animate without rewriting DOM.
    gsap.killTweensOf(lineInners);
    gsap.set(lineInners, { y: 100 });

    if (useScroll) {
      // Avoid duplicate ScrollTriggers on rebuild/resize.
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    }

    gsap.to(lineInners, {
      y: 0,
      duration: 1.5,
      stagger: 0.08,
      ease: 'power4.out',
      ...(useScroll && {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
      }),
    });
  });
};
