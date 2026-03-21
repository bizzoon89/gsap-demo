import './styles/main.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initTextFill } from './animations/textFill';
import { initTextReveal } from './animations/textReveal';
import { initImageReveal } from './animations/imageReveal';
import { initMorph } from './animations/morph';

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  initTextFill('.js-text-fill');
  initTextReveal('.js-text-reveal');
  initImageReveal('.js-image-reveal');
  initMorph();
});
