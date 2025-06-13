
const tabOpenTimes = {};

chrome.tabs.onCreated.addListener((activeInfo) => {
  console.log("Tab created:", activeInfo);
});

chrome.tabs.onHighlighted.addListener((highlightInfo) => {
  console.log("Tabs highlighted:", highlightInfo.tabIds);

});

chrome.tabs.


chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log("Tab removed:", tabId, removeInfo);
  // Remove the tab's open time from the tracking object
  delete tabOpenTimes[tabId];
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type ===  'PAGE_READY') {
    const { title, url } = message;
    console.log("Page is ready:", sender.tab.id, title, url);
    tabOpenTimes[sender.tab.id] = Date.now();
    // Store the time when the tab was opened
    // Send a response back to the content script
    sendResponse({ status: 'success', message: 'Page ready event received' });
  }
  
  return true; // Keep the message channel open for sendResponse
});

