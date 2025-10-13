(async () => {
  try {
    const ipRes = await fetch("https://ipv4.icanhazip.com/t");
    const ipData = await ipRes.json();
    const userIp = ipData.ip || ipData;

    const hostRes = await fetch(`https://corsproxy.io/?https://ipapi.co/${userIp}/hostname/`);
    const hostname = (await hostRes.text()).trim().toLowerCase();

    const bansRes = await fetch("https://youtomb-mobile.github.io/bans.json");
    const bans = await bansRes.json();

    const reason = bans[userIp] || Object.entries(bans.providers || {}).find(([k]) => hostname.includes(k))?.[1];
    if (reason) {
      window.location.href = `https://youtomb-mobile.github.io/banned?reason=${encodeURIComponent(reason)}`;
    }
  } catch (err) {
    console.error("Ban check failed:", err);
  }
})();
