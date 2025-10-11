(async function(){
  const url = "https://youtomb-mobile.github.io/announce.txt";
  const res = await fetch(url).catch(()=>null);
  const text = res && res.ok ? await res.text().catch(()=>null) : null;
  const message = (text && text.trim()) ? text.replace(/\r\n/g,"\n") : "Announcement unavailable";
  const id = "ytm-sticky-marquee-" + Date.now();
  const container = document.createElement("div");
  container.id = id;
  Object.assign(container.style,{
    position:"fixed",
    left:"0",
    right:"0",
    bottom:"0",
    height:"40px",
    display:"flex",
    alignItems:"center",
    overflow:"hidden",
    background:"rgba(0,0,0,0.75)",
    color:"#fff",
    fontFamily:"system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    fontSize:"16px",
    zIndex:"2147483647",
    padding:"0 10px",
    boxSizing:"border-box"
  });
  const track = document.createElement("div");
  track.setAttribute("role","marquee");
  track.setAttribute("aria-live","polite");
  Object.assign(track.style,{
    whiteSpace:"nowrap",
    display:"inline-block",
    willChange:"transform"
  });
  const span = document.createElement("span");
  span.textContent = message;
  track.appendChild(span);
  container.appendChild(track);
  document.documentElement.appendChild(container);
  await new Promise(r=>requestAnimationFrame(r));
  const containerWidth = container.clientWidth;
  const textWidth = span.offsetWidth;
  const distance = containerWidth + textWidth;
  const pxPerSecond = 120;
  const duration = Math.max(8, Math.ceil(distance / pxPerSecond));
  const style = document.createElement("style");
  const animName = "ytm-move-" + Date.now();
  style.textContent = `
@keyframes ${animName}{
  0%{transform:translateX(${containerWidth}px)}
  100%{transform:translateX(${ -textWidth }px)}
}
#${id} div{animation:${animName} ${duration}s linear infinite}
#${id}:hover div{animation-play-state:paused}
`;
  document.head.appendChild(style);
})();
