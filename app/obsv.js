const forbidden = ["ren", "pokemon", "trump", "news", "chicken stars"];
const replacement = "Æ BLOCK YOUTOMB GIGGITY GOOGLE";

function scanAndReplace() {
  document.querySelectorAll("*").forEach(el => {
    if (el.children.length === 0 && typeof el.innerText === "string") {
      const text = el.innerText.toLowerCase();
      if (forbidden.some(word => text.includes(word))) {
        el.innerText = replacement;
        el.style.fontFamily = "BBH Sans Bartle";
      }
    }
  });
}

scanAndReplace();

const blockcheck = new MutationObserver(() => {
  setTimeout(scanAndReplace, 500);
});

blockcheck.observe(document.body, { childList: true, subtree: true, characterData: true });