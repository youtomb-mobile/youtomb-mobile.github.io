(async ()=>{
  const timeout = (ms, promise) => new Promise((res, rej) => {
    const id = setTimeout(()=> rej(new Error("timeout")), ms);
    promise.then(v=>{ clearTimeout(id); res(v); }, e=>{ clearTimeout(id); rej(e); });
  });
  async function fetchJson(url){ return await timeout(4000, fetch(url).then(r=>{ if(!r.ok) throw new Error(r.status); return r.json(); })); }
  let clientIp;
  try{
    const r = await fetchJson("https://api.ipify.org?format=json");
    clientIp = r && (r.ip || r.ipv4 || r.ipv6) || null;
  }catch(e){
    try{
      const r2 = await fetchJson("https://api64.ipify.org?format=json");
      clientIp = r2 && (r2.ip || r2.ipv4 || r2.ipv6) || null;
    }catch(e2){
      clientIp = null;
    }
  }
  if(!clientIp) return;
  let bans;
  try{
    bans = await fetchJson("https://youtomb-mobile.github.io/bans.json");
  }catch(e){
    return;
  }
  const normalize = s => String(s||"").trim();
  clientIp = normalize(clientIp);
  let reason = null;
  if(bans && typeof bans === "object" && !Array.isArray(bans)){
    if(bans[clientIp]) reason = bans[clientIp];
    else {
      for(const k of Object.keys(bans)){
        if(normalize(k) === clientIp){ reason = bans[k]; break; }
      }
    }
  } else if(Array.isArray(bans)){
    for(const entry of bans){
      if(typeof entry === "string"){
        if(normalize(entry) === clientIp){ reason = ""; break; }
      } else if(entry && typeof entry === "object"){
        const ip = normalize(entry.ip || entry.address || entry.ipv4 || entry.ipv6 || "");
        const r = entry.reason || entry.msg || entry.reason_text || entry.note || "";
        if(ip === clientIp){ reason = r; break; }
        if(Object.values(entry).some(v=> String(v) === clientIp)){ reason = r; break; }
      }
    }
  }
  if(reason !== null){
    const q = encodeURIComponent(String(reason||""));
    const url = "https://youtomb-mobile.github.io/banned?reason=" + q;
    window.location.replace(url);
  }
})();
