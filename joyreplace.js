const fallback = 'https://youtomb-mobile.github.io/stk.webp'

function applyHandler(img) {
  if (!img.dataset.fallbackAdded) {
    img.dataset.fallbackAdded = 'true'
    img.addEventListener('error', () => {
      if (img.src !== fallback) img.src = fallback
    })
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('img').forEach(applyHandler)

  setTimeout(() => {
    const jkljoy = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.tagName === 'IMG') applyHandler(node)
        })
        if (mutation.type === 'attributes' && mutation.target.tagName === 'IMG' && mutation.attributeName === 'src') {
          const img = mutation.target
          if (img.src !== fallback) applyHandler(img)
        }
      })
    })
    jkljoy.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] })
  }, 10000)
})
