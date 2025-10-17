let bannedWords = [];

fetch("https://youtomb-mobile.github.io/wordbans.json")
  .then(res => res.json())
  .then(data => {
    if (Array.isArray(data)) bannedWords = data.map(entry => ({
      word: entry.word.toLowerCase(),
      reason: entry.reason || "Rule-breaking content detected"
    }));
  })
  .catch(() => {});

function getBannedReason(text) {
  const lowerText = text.toLowerCase();
  for (const entry of bannedWords) {
    if (lowerText.includes(entry.word)) return entry.reason;
  }
  return null;
}

setInterval(() => {
  document.querySelectorAll(".compact-media-headline, .small-text").forEach(el => {
    const reason = getBannedReason(el.textContent);
    if (reason) {
      const parent = el.closest(".compact-video");
      if (parent) parent.remove();
      console.log(`Removed element due to: ${reason}`);
    }
  });
}, 5000);

document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const val = document.activeElement.value?.toLowerCase() || "";
    const reason = getBannedReason(val);
    if (reason) {
      console.log(`Redirecting user due to: ${reason}`);
      window.location.href = "https://youtomb-mobile.github.io/youmessedup.html";
    }
  }
});
