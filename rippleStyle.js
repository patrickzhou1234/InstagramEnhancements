// ==UserScript==
// @name         Button Ripple Effects
// @namespace    Patrick Z
// @version      0.2
// @description  Adds ripple effect to buttons! lol
// @match        https://www.instagram.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  const styID = 'mc-ig-ripple-style';
  const hsCls = 'mc-ripple-host';
  const rplCls = 'mc-ripple-wave';
  const btnSel = [
    'div.x1iyjqo2.xh8yej3 a[role="link"]',
    'nav[role="navigation"] a[role="link"]',
    'aside a[role="link"]'
  ];

  const ensSty = () => {
    if (document.getElementById(styID)) return;
    const style = document.createElement('style');
    style.id = styID;
    style.textContent = `
      .${hsCls} {
        position: relative !important;
        overflow: hidden !important;
        isolation: isolate; /* keeps ripple inside stacking context */
      }
      .${rplCls} {
        position: absolute;
        border-radius: 50%;
        transform: scale(0);
        background: rgba(255, 255, 255, 0.35);
        opacity: 0.85;
        pointer-events: none;
        animation: mc-ripple-expand 550ms ease-out;
      }
      @keyframes mc-ripple-expand {
        to {
          transform: scale(3.2);
          opacity: 0;
        }
      }
    `;
    document.documentElement.appendChild(style);
  };

  const handlePointerDown = evt => {
    if (evt.button !== 0 && evt.pointerType !== 'touch') return;
    const target = evt.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = document.createElement('span');
    ripple.className = rplCls;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${evt.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${evt.clientY - rect.top - size / 2}px`;
    target.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  const addRipple = btn => {
    if (!btn || btn.classList.contains(hsCls)) return;
    btn.classList.add(hsCls);
    btn.addEventListener('pointerdown', handlePointerDown, { passive: true });
  };

  const scan = root => {
    const scope = root instanceof Element ? root : document;
    const found = new Set();
    btnSel.forEach(sel =>
      scope.querySelectorAll(sel).forEach(el => found.add(el))
    );
    found.forEach(addRipple);
  };

  ensSty();
  scan(document);

  new MutationObserver(mutations => {
    for (const { addedNodes } of mutations) {
      addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        scan(node);
      });
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
