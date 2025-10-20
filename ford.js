(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.has("wharmode")) {
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      if (link.href.includes("2015YTm.css")) {
        link.href = link.href.replace("2015YTm.css", "jrod.css");
      } else if (link.href.includes("player.css")) {
        link.href = link.href.replace("player.css", "griddy.css");
      }
    });

    document.querySelectorAll('script[src]').forEach(script => {
      if (script.src.includes("2015ytm.js")) {
        script.src = script.src.replace("2015ytm.js", "alala.js");
      } else if (script.src.includes("search-suggestions.js")) {
        script.src = script.src.replace("search-suggestions.js", "search-guh.js");
      }
    });
  }
})();
