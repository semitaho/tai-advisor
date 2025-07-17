


const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    for (const node of mutation.addedNodes) {
      console.log("Node added:", node.attributes.id);
      if (node.nodeType !== Node.ELEMENT_NODE) return;
      const el = node;
      // Direct ad class
      if (hasAdClass(el)) {
        console.log("Ad element detected:", el);
        el.remove();
      }

  
    } 
  
  });
});

function hasAdClass(element) {
  if (!element.classList) return false;


  return [...element.classList].some(className =>className === 'ad') ;
}

observer.observe(document.body, {
  subtree: true,
  attributes: true, 
  childList: true}
);


document.querySelectorAll('.ad').forEach((elem) => {
  console.log("Ad element found:", elem.classList);
  elem.remove();
});