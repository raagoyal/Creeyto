const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((item) => revealObserver.observe(item));

const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
});
mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.querySelectorAll('[data-year]').forEach((year) => { year.textContent = new Date().getFullYear(); });

document.querySelectorAll('.contact-form').forEach((form) => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const status = form.querySelector('.form-status');
    const button = form.querySelector('button[type="submit"]');
    const payload = Object.fromEntries(fields.entries());
    payload._subject = `New Creeyto project enquiry from ${fields.get('name')}`;
    payload._template = 'table';
    status.classList.remove('error');
    status.textContent = 'Sending your enquiry…';
    button.disabled = true;
    try {
      const response = await fetch('https://formsubmit.co/ajax/hello@creeyto.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || result.success === false || result.success === 'false') {
        throw new Error(result.message || 'The enquiry could not be sent. Please try again.');
      }
      form.classList.add('is-submitted');
      form.querySelector('.form-success').hidden = false;
      status.textContent = '';
      form.reset();
    } catch (error) {
      status.classList.add('error');
      status.textContent = error.message || 'Something went wrong. Please try again or email hello@creeyto.com.';
      button.disabled = false;
    }
  });
});
