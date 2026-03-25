import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const normalizeText = text => text.replace(/\s+/g, ' ').trim();

export const initTextFill = (selector, { force = false } = {}) => {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    if (!el) return;

    if (!el.dataset.textFillOriginal) {
      el.dataset.textFillOriginal = normalizeText(el.innerText);
    }

    const shouldRebuild = force || el.dataset.textFillDirty === '1' || el.dataset.textFillBuilt !== '1';
    if (!shouldRebuild) return;

    const text = el.innerText;
    const words = (el.dataset.textFillOriginal || text).split(' ');

    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === el) st.kill();
    });

    el.innerHTML = '';

    let line = document.createElement('span');
    line.classList.add('text-line');

    words.forEach(word => {
      const testLine = line.innerText + ' ' + word;

      line.innerText = testLine;
      el.appendChild(line);

      if (line.offsetWidth > el.offsetWidth) {
        line.innerText = line.innerText.replace(word, '').trim();

        const newLine = document.createElement('span');
        newLine.classList.add('text-line');
        newLine.innerText = word;

        el.appendChild(newLine);
        line = newLine;
      }
    });

    const lines = el.querySelectorAll('.text-line');

    lines.forEach(line => {
      const text = line.innerText;

      line.innerHTML = `
        <span class="text-line__base">${text}</span>
        <span class="text-line__overlay">${text}</span>
      `;
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 70%',
        end: 'top 35%',
        scrub: 1.5,
      },
    });

    lines.forEach((line, i) => {
      const overlay = line.querySelector('.text-line__overlay');

      tl.fromTo(
        overlay,
        {
          clipPath: 'inset(0 100% 0 0)',
          opacity: 1,
        },
        {
          clipPath: 'inset(0 0% 0 0)',
          opacity: 1,
          ease: 'none',
        },
        i * 0.15,
      );
    });

    el.dataset.textFillBuilt = '1';
    el.dataset.textFillDirty = '0';
  });
};
