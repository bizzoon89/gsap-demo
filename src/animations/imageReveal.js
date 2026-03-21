import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initTextReveal } from './textReveal';

gsap.registerPlugin(ScrollTrigger);

// =========================
// 🔥 SLIDER (active class)
// =========================
let sliderInterval;
let index = 0;

function startSlider(container) {
  const slider = container.querySelector('.slider');
  const slides = container.querySelectorAll('.slider img');

  if (!slider || slides.length === 0) return;

  // 🔥 перший активний
  slides.forEach(img => img.classList.remove('active'));
  slides[0].classList.add('active');
  index = 0;

  sliderInterval = setInterval(() => {
    index = (index + 1) % slides.length;

    // рухаємо трек
    gsap.to(slider, {
      xPercent: -100 * index,
      duration: 0.6,
      ease: 'power2.out',
    });

    // міняємо active
    slides.forEach(img => img.classList.remove('active'));
    slides[index].classList.add('active');
  }, 3000);
}

function stopSlider(container) {
  clearInterval(sliderInterval);
  index = 0;

  const slides = container.querySelectorAll('.slider img');
  slides.forEach(img => img.classList.remove('active'));
}

// =========================
// 🔥 MAIN
// =========================
export const initImageReveal = selector => {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    const mask = el.querySelector('.image-reveal__mask');
    const slider = el.querySelector('.slider');
    const texts = el.querySelectorAll('.js-image-text');
    const buttonWrap = el.querySelector('.btn-wrap');

    let textStarted = false;
    let sliderStarted = false;
    let buttonTimeout;

    // стартові стани
    gsap.set(buttonWrap, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=2000',
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        markers: true,

        onUpdate: self => {
          const p = self.progress;

          // ===== TEXT =====
          if (p > 0.35 && !textStarted) {
            textStarted = true;

            initTextReveal(texts, false);

            buttonTimeout = setTimeout(() => {
              gsap.to(buttonWrap, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: 'power3.out',
              });
            }, 600);
          }

          if (p < 0.35 && textStarted) {
            textStarted = false;

            clearTimeout(buttonTimeout);

            gsap.set(el.querySelectorAll('.text-line__inner'), {
              y: 100,
            });

            texts.forEach(t => {
              t.style.visibility = 'hidden';
            });

            gsap.set(buttonWrap, {
              opacity: 0,
              y: 30,
            });
          }

          // ===== SLIDER =====
          if (p > 0.7 && !sliderStarted) {
            sliderStarted = true;
            startSlider(el);
          }

          if (p < 0.7 && sliderStarted) {
            sliderStarted = false;
            stopSlider(el);
          }
        },
      },
    });

    // ===== IMAGE OPEN =====
    tl.to(mask, {
      width: '100%',
      height: '100%',
      duration: 0.9,
      ease: 'power3.out',
    });

    // ===== BORDER RADIUS В КІНЦІ =====
    tl.to(
      mask,
      {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        duration: 0.3,
        ease: 'power4.out',
      },
      0.85,
    );
  });
};
