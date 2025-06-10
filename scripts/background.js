import { PAGE_READY } from '/scripts/actions.js';

const tabOpenTimes = {};

chrome.tabs.onCreated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    console.log("Tab changed to:", tab.url);
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type ===  PAGE_READY) {
    const { title, url } = message;
    console.log("Page is ready:", sender.tab.id, title, url);
    
    // Store the time when the tab was opened
    tabOpenTimes[sender.tab.id] = Date.now();
    
    // Send a response back to the content script
    sendResponse({ status: 'success', message: 'Page ready event received' });
  }
  
  return true; // Keep the message channel open for sendResponse
});

