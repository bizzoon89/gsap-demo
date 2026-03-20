import './styles/main.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initTextFill } from './animations/textFill';
import { initTextReveal } from './animations/textReveal';

gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  initTextFill('.js-text-fill');
  initTextReveal('.js-text-reveal');
});
