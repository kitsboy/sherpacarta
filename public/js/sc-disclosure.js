(() => {
  'use strict';
  const labels = {
    demo: ['DEMO DATA', 'Illustrative only — replace this before presenting as evidence.'],
    action: ['REQUIRES YOUR ACTION', 'This item needs a real person, authority, credential, or external confirmation.'],
    pending: ['PENDING VERIFICATION', 'Present, but not independently confirmed or legally approved.'],
    live: ['LIVE / REPOSITORY VERIFIED', 'Supported by the current repository or public source; not legal or security certification.']
  };
  function addDisclosure(kind, detail, target = document.body) {
    const item = labels[kind] || labels.pending;
    const bar = document.createElement('aside');
    bar.className = `sc-disclosure sc-disclosure-${kind}`;
    bar.setAttribute('role', 'note');
    bar.innerHTML = `<strong>${item[0]}</strong><span>${detail || item[1]}</span>`;
    target.prepend(bar);
  }
  window.SCDisclosure = { add: addDisclosure };
  document.querySelectorAll('[data-disclosure]').forEach((node) => {
    addDisclosure(node.dataset.disclosure, node.dataset.disclosureText, node);
  });
})();
