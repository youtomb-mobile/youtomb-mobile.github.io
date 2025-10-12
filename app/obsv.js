const forbidden = ["ren", "pokemon", "trump", "news", "chicken stars"];
const replacement = "Æ BLOCK YOUTOMB GIGGITY GOOGLE";

function scanAndReplace() {
  document.querySelectorAll("*").forEach(el => {
    if (el.children.length === 0 && typeof el.innerText === "string") {
      const text = el.innerText;
      if (forbidden.some(word => text.toLowerCase().includes(word.toLowerCase()))) {
        el.innerText = replacement;
        el.style.fontFamily = "BBH Sans Bartle";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  scanAndReplace();
  const blockcheck = new MutationObserver(() => {
    setTimeout(scanAndReplace, 500);
  });
  blockcheck.observe(document.body, { childList: true, subtree: true, characterData: true });
});

const forbidden2 = ["67", "sprunki", "klasky", "csupo", "robot logo", "logo"];
const replacement2 = "brainrot video";

function scanAndReplace() {
  document.querySelectorAll("*").forEach(el => {
    if (el.children.length === 0 && typeof el.innerText === "string") {
      const text = el.innerText;
      if (forbidden.some(word => text.toLowerCase().includes(word.toLowerCase()))) {
        el.innerText = replacement;
        el.style.fontFamily = "Roboto Condensed";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  scanAndReplace();
  const gog = new MutationObserver(() => {
    setTimeout(scanAndReplace, 500);
  });
  gog.observe(document.body, { childList: true, subtree: true, characterData: true });
});

const forbidden3 = ["PewDiePie", "Markiplier", "Yo Mama"];
const replacement3 = "Popular Youtomber";

function scanAndReplace() {
  document.querySelectorAll("*").forEach(el => {
    if (el.children.length === 0 && typeof el.innerText === "string") {
      const text = el.innerText;
      if (forbidden.some(word => text.toLowerCase().includes(word.toLowerCase()))) {
        el.innerText = replacement;
        el.style.fontFamily = "Arial Narrow";
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  scanAndReplace();
  const gog = new MutationObserver(() => {
    setTimeout(scanAndReplace, 500);
  });
  gog.observe(document.body, { childList: true, subtree: true, characterData: true });
});

