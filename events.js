const today = new Date();
const month = today.getMonth() + 1;
const day = today.getDate();
const year = today.getFullYear();

if (month === 10 && day === 9 && year >= 2025) {
  alert("happy birthday youtomb mobile");

  const headline = document.querySelector(".compact-media-headline");
  if (headline) {
    headline.textContent = "HAPPY BIRTHDAY YOUTOMB MOBILE!!!";
  }

  if (document.querySelector(".style-2013")) {
    const smallText = document.querySelector(".small-text");
    if (smallText) {
      smallText.textContent = "BIRTHDAY PARTY WHAR";
    }
  }
}

function randomizeImages() {
  const imgs = document.querySelectorAll("img");
  imgs.forEach(img => {
    if (!img.dataset.checked) {
      img.dataset.checked = "true"; // prevent repeated rolls for same image
      if (Math.random() < 1 / 500) {
        img.src = "https://youtomb-mobile.github.io/stk.webp";
      }
    }
  });
}

randomizeImages();

const observer = new MutationObserver(() => {
  randomizeImages();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
