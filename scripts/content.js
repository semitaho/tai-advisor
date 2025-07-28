const ADS_REMOVED = "tai-ad-removed";
(async () => {
  const ads = await getAdClasses();

  const observer = new MutationObserver(async function (mutations) {
    mutations.forEach(async function (mutation) {
      for (const node of mutation.addedNodes) {
        checkAcceptCookies(node);
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const el = node;
        // Direct ad class
        if (hasAdClass(ads, el)) {
          processAdElement(el);
          return;
        }
        const adDescendants = node.querySelectorAll?.("*");
        adDescendants?.forEach((child) => {
          if (hasAdClass(ads, child)) {
            processAdElement(child);
          }
        });
      }
    });
  });

  async function processAdElement(el) {
    const customDiv = document.createElement("div");
    customDiv.className = "tai-ad-replaced";
    customDiv.innerHTML = `
    <div>
      <strong>This ad was replaced by tAi Advisor.</strong>
    </div>
  `;
    if (!el?.parentNode) return;
    if ([...el.classList].some((className) => ADS_REMOVED === className)) {
      console.warn("Ad already removed:", el);
      return;
    }
    el.parentNode.appendChild(customDiv);
    el.classList.add(ADS_REMOVED);
  }

  function hasAdClass(ads, element) {
    if (!element.classList) return false;
    return [...element.classList].some((className) => ads.includes(className));
  }

  observer.observe(document.body, {
    subtree: true,
    attributes: true,
    childList: true,
  });

  checkAds();
  checkAcceptCookies(document.body);

  async function checkAcceptCookies(nodeToCheck) {
    const cookies = document.evaluate(
      `.//button[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'accept cookies')]`,
      nodeToCheck,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    );

    console.log("Cookies found:", cookies.snapshotLength);
    for (let i = 0; i < cookies.snapshotLength; i++) {
      const node = cookies.snapshotItem(i);
      const customDiv = document.createElement("div");
      customDiv.className = "tai-cookies-replaced";
      customDiv.innerHTML = `
    <div>
      <strong>This cookie was accepted by tAi Advisor.</strong>
    </div> 
    `;
      document.body.appendChild(customDiv);
      node.click(); // or any other action
    }
  }

  async function checkAds() {
    const adsQuery = ads.map((ad) => "." + ad).join(", ");
    document.querySelectorAll(adsQuery).forEach(async (elem) => {
      await processAdElement(elem);
    });
  }

  async function getAdClasses() {
    const adsString = await chrome.storage.sync.get(["ads"]);
    return adsString?.ads || [];
  }
})();
