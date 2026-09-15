import { COMPANY_INFO } from './business-config.js';
import { setupQuoteForm } from './quote.js';

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.site-nav a').forEach((link) => {
    link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.12
});

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

setupQuoteForm(document.querySelector('#contact-form'));

document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear());
});
document.querySelectorAll('[data-company-location]').forEach((element) => {
    element.textContent = COMPANY_INFO.location;
});
document.querySelectorAll('[data-company-email]').forEach((element) => {
    if (!COMPANY_INFO.email) return;
    const link = document.createElement('a');
    link.href = `mailto:${COMPANY_INFO.email}`;
    link.textContent = COMPANY_INFO.email;
    element.replaceChildren(link);
});
