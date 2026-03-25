import './styles/main.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initTextFill } from './animations/textFill';
import { initTextReveal } from './animations/textReveal';
import { initImageReveal } from './animations/imageReveal';
import { initMorph } from './animations/morph';

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({
  ignoreMobileResize: true,
});

window.addEventListener('load', () => {
  initTextFill('.js-text-fill');
  initTextReveal('.js-text-reveal');
  initImageReveal('.js-image-reveal');
  initMorph();

  // Rebuild text splitting on resize (line breaks + clip-path depend on layout).
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      ScrollTrigger.refresh();
      initTextFill('.js-text-fill', { force: true });
      initTextReveal('.js-text-reveal', true, { force: true });
    }, 150);
  });

  const loader = document.querySelector('.page-loader');

  if (loader) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.2,
      onComplete: () => {
        loader.style.display = 'none';

        ScrollTrigger.refresh();
      },
    });
  }
});
