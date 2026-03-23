import './styles/main.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initTextFill } from './animations/textFill';
import { initTextReveal } from './animations/textReveal';
import { initImageReveal } from './animations/imageReveal';
import { initMorph } from './animations/morph';

gsap.registerPlugin(ScrollTrigger);

// 🔥 стабільність
ScrollTrigger.config({
  ignoreMobileResize: true,
});

window.addEventListener('load', () => {
  const loader = document.querySelector('.page-loader');

  // 👉 ініт анімацій
  initTextFill('.js-text-fill');
  initTextReveal('.js-text-reveal');
  initImageReveal('.js-image-reveal');
  initMorph();

  // 👉 плавне зникнення loader
  if (loader) {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      delay: 0.2,
      onComplete: () => {
        loader.style.display = 'none';

        // 🔥 дуже важливо
        ScrollTrigger.refresh();
      },
    });
  }
});
