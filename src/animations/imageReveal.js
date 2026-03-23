import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initTextReveal } from './textReveal';

gsap.registerPlugin(ScrollTrigger);

let sliderInterval;
let index = 0;

function startSlider(container) {
  const slider = container.querySelector('.slider');
  const slides = container.querySelectorAll('.slider img');

  if (!slider || slides.length === 0) return;

  slides.forEach(img => img.classList.remove('active'));
  slides[0].classList.add('active');
  index = 0;

  sliderInterval = setInterval(() => {
    index = (index + 1) % slides.length;

    gsap.to(slider, {
      xPercent: -100 * index,
      duration: 0.6,
      ease: 'power2.out',
    });

    slides.forEach(img => img.classList.remove('active'));
    slides[index].classList.add('active');
  }, 3000);
}

function stopSlider(container) {
  clearInterval(sliderInterval);
  index = 0;

  const slider = container.querySelector('.slider');
  const slides = container.querySelectorAll('.slider img');

  gsap.set(slider, { xPercent: 0 });
  slides.forEach(img => img.classList.remove('active'));
}

export const initImageReveal = selector => {
  const elements = document.querySelectorAll(selector);

  elements.forEach(el => {
    const mask = el.querySelector('.image-reveal__mask');
    const texts = el.querySelectorAll('.js-image-text');
    const buttonWrap = el.querySelector('.btn-wrap');

    let sliderStarted = false;
    let buttonTimeout;

    gsap.set(buttonWrap, { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: '+=2000',
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,

        onUpdate: self => {
          const p = self.progress;

          if (p > 0.75 && !sliderStarted) {
            sliderStarted = true;
            startSlider(el);
          }

          if (p < 0.75 && sliderStarted) {
            sliderStarted = false;
            stopSlider(el);
          }
        },
      },
    });

    // ===== IMAGE OPEN =====
    tl.fromTo(
      mask,
      {
        width: 250,
        height: 320,
      },
      {
        width: () => el.clientWidth,
        height: () => el.clientHeight,
        duration: 1,
        ease: 'power3.out',
      },
    );

    tl.addLabel('opened');

    // ===== TEXT SHOW =====
    tl.call(
      () => {
        initTextReveal(texts, false);

        buttonTimeout = setTimeout(() => {
          gsap.to(buttonWrap, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power3.out',
          });
        }, 600);
      },
      null,
      'opened',
    );

    // ===== TEXT HIDE (першим!) =====
    tl.call(
      () => {
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
      },
      null,
      'opened-=0.02',
    );

    // ===== BORDER =====
    tl.to(
      mask,
      {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        duration: 0.4,
        ease: 'power4.out',
      },
      'opened+=0.25',
    );
  });
};
