import { PAGE_READY } from '/scripts/actions.js';



if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onPageReady);
} else {
  // The document is already ready
  onPageReady();
}

function onPageReady() {
  console.log("Page is ready:", document.title);
  chrome.runtime.sendMessage({
    type: PAGE_READY,
    title: document.title,
    url: window.location.href
  });
}