document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const val = document.activeElement.value?.toLowerCase() || "";
    if (val.includes("klasky csupo") || val.includes("klasky") || val.includes("csupo") || val.includes("vore")) {
      window.location.href = "https://youtomb-mobile.github.io/youmessedup.html";
    }
  }
});

const klaskydetect = new MutationObserver(() => {
  document.querySelectorAll(".compact-media-headline, .small-text").forEach(el => {
    const text = el.textContent.toLowerCase();
    if (text.includes("klasky csupo") || text.includes("klasky") || text.includes("csupo")) {
      const parent = el.closest(".compact-video");
      if (parent) parent.remove();
    }
  });
});

klaskydetect.observe(document.body, { childList: true, subtree: true, characterData: true });
