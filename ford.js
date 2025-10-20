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
  }
})();
