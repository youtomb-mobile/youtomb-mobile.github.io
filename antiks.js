setInterval(() => {
  document.querySelectorAll(".compact-media-headline, .small-text").forEach(el => {
    const text = el.textContent.toLowerCase();
    if (text.includes("klasky csupo") || text.includes("klasky") || text.includes("csupo")) {
      const parent = el.closest(".compact-video");
      if (parent) parent.remove();
    }
  });
}, 5000);

document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const val = document.activeElement.value?.toLowerCase() || "";
    if (val.includes("klasky csupo") || val.includes("klasky") || val.includes("csupo")) {
      window.location.href = "https://youtomb-mobile.github.io/youmessedup.html";
    }
  }
});
