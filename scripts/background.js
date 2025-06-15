const tabOpenTimes = {};
// 10 minutes
const tabOpenLimitInMinutes = 0.2;
const tabCloseLimitInMinutes = 2;

const intervalToCheckTabs = 500; // 5 seconds

let interval = setInterval(async function () {
  const hiddenTabs = await queryHiddenTabs();
  hiddenTabs.forEach((tab) => {
    const tabId = tab.id;
    if (!tabOpenTimes[tabId]) {
      // If the tab is not in the tracking object, add it with the current time
      tabOpenTimes[tabId] = Date.now();
      return;
    }
    const openTime = tabOpenTimes[tabId];

    if (openTime) {
      const elapsedTime = Date.now() - openTime;
  

      if (elapsedTime > tabCloseLimitInMinutes * 60 * 1000) {
        console.log("Closing tab:", tabId);
        tabOpenTimes[tabId] = null; // Reset the open time for the tab
        chrome.tabs.remove(tabId);
        console.log(
          `Tab ${tab.url} has been open for more than ${tabCloseLimitInMinutes} minutes. Closing tab.`
        );
      }
      // If the tab has been open for more than 10 minutes, reset the timer
      else if (elapsedTime > tabOpenLimitInMinutes * 60 * 1000) {
        // 10 minutes in milliseconds
        console.log(
          `Tab ${tab.url} has been open for more than ${tabOpenLimitInMinutes} minutes. Resetting timer.`
        );
        //resetTimer(tabId);
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: () => {
            const originalTitle = document.title;
            const newTitle = 'Closing..';
            setInterval(() => {
             if (document.title === originalTitle) {
                document.title = newTitle;
              } else {
                document.title = originalTitle;
              }
            },intervalToCheckTabs);
            document.title = "RESET";
          },
        });
      }
    }
  });
}, 10000); // Check every 5 seconds

async function queryHiddenTabs() {
  const tabs = await chrome.tabs.query({ active: false, currentWindow: true });
  return tabs.filter((tab, index) => index > 3);
}
function resetTimer(tabId) {
  console.log("Resetting timer for tab:", tabId);
  // Store the current time as the new open time for the tab
  tabOpenTimes[tabId] = Date.now();
}
chrome.tabs.onCreated.addListener((activeInfo) => {
  console.log("Tab created:", activeInfo);
});

chrome.tabs.onHighlighted.addListener((highlightInfo) => {
  console.log("Tabs highlighted:", highlightInfo.tabIds);
  highlightInfo.tabIds.forEach((tabId) => resetTimer(tabId));
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log("Tab removed:", tabId, removeInfo);
  // Remove the tab's open time from the tracking object
  delete tabOpenTimes[tabId];
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Extension started");
  console.log("has tabs:" + chrome.tabOpenTimes);

  // Optionally, you can reset the tab open times on startup
});

chrome.runtime.onSuspend.addListener(() => {
  console.log("Extension suspended");
  clearInterval(interval);
});
