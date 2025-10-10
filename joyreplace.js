const fallback = 'https://youtomb-mobile.github.io/stk.webp'

function isFallbackSrc(src) {
  if (!src) return false
  try {
    const abs = new URL(src, location.href).href
    return abs === new URL(fallback).href || abs.endsWith('/stk.webp')
  } catch (e) {
    return src.endsWith('stk.webp')
  }
}

function applyHandler(img) {
  if (img.dataset.fallbackAdded) return
  img.dataset.fallbackAdded = 'true'
  img.addEventListener('error', () => {
    if (!isFallbackSrc(img.getAttribute('src'))) img.src = fallback
  })
  if (img.complete && img.naturalWidth === 0 && !isFallbackSrc(img.getAttribute('src'))) {
    img.src = fallback
  }
}

function scan(node) {
  if (!node) return
  if (node.nodeType === 1 && node.tagName === 'IMG') {
    applyHandler(node)
  } else if (node.querySelectorAll) {
    node.querySelectorAll('img').forEach(applyHandler)
  }
}

function start() {
  document.querySelectorAll('img').forEach(applyHandler)
  setTimeout(() => {
    const jkljoy = new MutationObserver(mutations => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach(n => scan(n))
        } else if (m.type === 'attributes' && m.target && m.target.tagName === 'IMG' && m.attributeName === 'src') {
          const img = m.target
          if (!isFallbackSrc(img.getAttribute('src'))) {
            applyHandler(img)
            if (img.complete && img.naturalWidth === 0) img.src = fallback
          }
        }
      }
    })
    jkljoy.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] })
  }, 10000)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start)
} else {
  start()
}
