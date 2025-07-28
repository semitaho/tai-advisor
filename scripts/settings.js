
const ads = "ads";
// Load saved value on page load
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(ads, (data) => {
    document.getElementById(ads).value = data?.ads.join(',') || '';
  });
});

document.getElementById(ads).addEventListener('change', (event) => {
  const newValue = event.target.value;
  const adsArr = newValue.split(',').map((ad) => ad.trim());
  // Save the new value to storage
  chrome.storage.sync.set({ [ads]: adsArr }, () => {
    console.log(`Saved ${ads}:`, newValue);
  });
});