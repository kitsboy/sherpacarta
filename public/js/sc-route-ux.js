(() => {
  'use strict';
  const path = location.pathname.replace(/\/$/, '') || '/';
  const stages = path.includes('verify') || path.includes('archive') || path.includes('cite') ? ['Read', 'Sign', 'Verify'] : path.includes('sign') || path.includes('join') ? ['Read', 'Sign', 'Verify'] : ['Read', 'Sign', 'Verify'];
  const current = path.includes('verify') || path.includes('archive') || path.includes('cite') ? 'Verify' : path.includes('sign') || path.includes('join') ? 'Sign' : 'Read';
  const labels = { Read: '/', Sign: '/#sign', Verify: '/verify.html' };
  const main = document.querySelector('main');
  if (!main || document.querySelector('[data-sc-journey]')) return;

  const nav = document.createElement('nav');
  nav.dataset.scJourney = 'true'; nav.className = 'sc-journey-context'; nav.setAttribute('aria-label', 'Journey stage');
  const list = document.createElement('ol');
  stages.forEach((stage) => {
    const item = document.createElement('li');
    const link = document.createElement('a'); link.href = labels[stage]; link.textContent = stage;
    if (stage === current) { item.setAttribute('aria-current', 'step'); link.className = 'is-current'; }
    item.appendChild(link); list.appendChild(item);
  });
  nav.appendChild(list); main.insertBefore(nav, main.firstChild);

  const notice = document.createElement('p');
  notice.className = 'sc-route-help'; notice.setAttribute('role', 'status');
  notice.textContent = current === 'Verify' ? 'You are verifying evidence. Pending is not the same as confirmed.' : current === 'Sign' ? 'Review your commitment before submitting. Local drafts remain on this device.' : 'Start with the source document; choose Sign or Verify when ready.';
  nav.after(notice);

  window.addEventListener('offline', () => { notice.textContent = 'You are offline. Reading and local verification remain available; network proof status is paused.'; });
  window.addEventListener('online', () => { notice.textContent = current === 'Verify' ? 'Back online. You can refresh public proof status.' : 'Back online.'; });
})();
