


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onPageReady);
} else {
  // The document is already ready
  onPageReady();
}

async function onPageReady() {
  console.log("Page is ready:", document.title);
  const response = await chrome.runtime.sendMessage({
    type: 'PAGE_READY',
    title: document.title,
    url: window.location.href
  });
  console.log("Response from background script:", response);

}