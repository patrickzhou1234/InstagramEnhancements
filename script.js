// ==UserScript==
// @name         Instagram Reels Remover
// @namespace    http://tampermonkey.net/
// @version      2025-10-11
// @description  try to take over the world!
// @author       You
// @match        https://*.instagram.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=instagram.com
// @grant        none
// ==/UserScript==

setInterval(() => {
    if (window.location.href.includes("reels") || window.location.href.includes("explore")) {
        document.body.remove();
    }
    document.querySelectorAll("a").forEach((el) => {
        if (el.getAttribute("href").includes("reels") || el.getAttribute("href").includes("explore")) {
            el.remove();
        }
    });
}, 1000);
