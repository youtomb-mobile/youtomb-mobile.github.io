const fallback = 'https://youtomb-mobile.github.io/stk.webp'

function applyHandler(img) {
  if (!img.dataset.fallbackAdded) {
    img.dataset.fallbackAdded = 'true'
    img.addEventListener('error', () => { img.src = fallback })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(applyHandler)

  setTimeout(() => {
    const jkljoy = new MutationObserver(() => {
      document.querySelectorAll('img').forEach(applyHandler)
    })
    jkljoy.observe(document.body, { childList: true, subtree: true })
  }, 10000)
})
