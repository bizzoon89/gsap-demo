import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initTextReveal = selector => {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    const text = el.textContent;
    el.innerHTML = '';

    const words = text.split(' ').map(word => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      return span;
    });

    words.forEach(word => el.appendChild(word));

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

    const lineInners = [];

    lines.forEach(lineWords => {
      const line = document.createElement('span');
      line.classList.add('text-line');

      const inner = document.createElement('span');
      inner.classList.add('text-line__inner');

      inner.textContent = lineWords.join('').trim();

      line.appendChild(inner);
      el.appendChild(line);

      lineInners.push(inner);
    });

    gsap.set(lineInners, { y: 100 });

    gsap.to(lineInners, {
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        markers: true,
      },
    });
  });
};
