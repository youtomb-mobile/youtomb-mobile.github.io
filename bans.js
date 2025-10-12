(async () => {
  try {
    const ipRes = await fetch("https://corsproxy.io/?https://api.ipify.org?format=json");
    const ipData = await ipRes.json();
    const userIp = ipData.ip;

    const bansRes = await fetch("https://youtomb-mobile.github.io/bans.json");
    const bans = await bansRes.json();

    const reason = bans[userIp];
    if (reason) {
      window.location.href = `https://youtomb-mobile.github.io/banned?reason=${encodeURIComponent(reason)}`;
    }
  } catch (err) {
    console.error("Ban check failed:", err);
  }
})();