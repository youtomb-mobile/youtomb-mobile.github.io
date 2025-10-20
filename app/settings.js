// Initialize username with prompt fallback
const initUsername = () => {
  let username = localStorage.getItem("ytm15Username");
  if (!username) {
    username = prompt("Enter your username:")?.trim() || "Anonymous";
    localStorage.setItem("ytm15Username", username);
  }
  return username;
};

// Change username function
const changeUsername = (settingOptionElement) => {
  const currentName = localStorage.getItem("ytm15Username") || "Anonymous";
  const newName = prompt("Enter your new username:", currentName)?.trim();
  if (!newName) return;
  localStorage.setItem("ytm15Username", newName);
  const subtitleEl = settingOptionElement.querySelector(".username-subtitle");
  if (subtitleEl) subtitleEl.textContent = newName;
};

// Render username setting directly (no external dependency)
const renderUsernameSetting = (parent) => {
  const username = localStorage.getItem("ytm15Username") || "Anonymous";

  const settingOption = document.createElement("div");
  settingOption.classList.add("setting-single-option-menu", "has-ripple");

  const title = document.createElement("span");
  title.classList.add("username-title");
  title.textContent = "Username";

  const subtitle = document.createElement("span");
  subtitle.classList.add("username-subtitle");
  subtitle.textContent = username;

  settingOption.append(title, subtitle);
  settingOption.addEventListener("click", () => changeUsername(settingOption));

  parent.appendChild(settingOption);
};

// Main settings page
const settingsPage = () => {
  pageCont.innerHTML = "";

  const tabBar = document.querySelector(".tab-bar");
  if (tabBar) {
    tabBar.hidden = true;
    tabBar.setAttribute("isChannel", "false");
    headerBar.classList.remove("has-tab-bar");
    tabBar.innerHTML = "";
  }

  headerTitle.setAttribute("aria-label", Settings_text_string);
  headerTitle.textContent = Settings_text_string;

  const page = document.createElement("page");
  page.classList.add("ytm15Settings");

  const ytm15settings = document.createElement("ytm15-settings");
  const settingsOptCont = document.createElement("div");
  settingsOptCont.classList.add("settings-categories-container");

  const optArray = [
    { title: General_text_string, link: "#/general", id: "general" },
    { title: ExpFlags_text_string, link: "#/expflags", id: "expflags" },
    { title: AboutYTm15_text_string, link: "index.html#/about", id: "about" }
  ];

  optArray.forEach(item => {
    const a = document.createElement("a");
    a.textContent = item.title;
    a.classList.add("settings-category", "has-ripple");
    a.href = item.link;
    a.id = item.id;
    a.setAttribute("aria-label", item.title);
    a.setAttribute("aria-haspopup", false);
    a.setAttribute("aria-pressed", false);
    settingsOptCont.appendChild(a);
  });

  const settingsPagesCont = document.createElement("div");
  settingsPagesCont.classList.add("settings-pages-container");

  const settingsPageHeader = document.createElement("h4");
  settingsPageHeader.classList.add("settings-page-header");
  settingsPageHeader.id = "settings";
  settingsPageHeader.textContent = Settings_text_string;

  const innerSettingsPageCont = document.createElement("div");
  innerSettingsPageCont.classList.add("inner-settings-page-container");
  innerSettingsPageCont.innerHTML = `<div class="ytm15-settings-msg">${SettingsMSG_text_string}</div>`;

  ytm15settings.append(settingsOptCont, settingsPagesCont);
  settingsPagesCont.append(settingsPageHeader, innerSettingsPageCont);
  pageCont.append(page);
  page.append(ytm15settings);
  title.textContent = `${Settings_text_string} - 2015YouTube`;

  const settingsEventListenFunc = () => {
    settingsOptCont.querySelectorAll(".settings-category").forEach(item => item.setAttribute("aria-pressed", false));
    const pageId = window.location.hash.split("/")[1] || "";
    const safePageId = CSS.escape(pageId);

    if (safePageId) {
      const activeCategory = settingsOptCont.querySelector(`#${safePageId}`);
      if (activeCategory) activeCategory.setAttribute("aria-pressed", true);
    }

    innerSettingsPageCont.innerHTML = `<div class="ytm15-settings-msg">${SettingsMSG_text_string}</div>`;
    settingsPageHeader.textContent = Settings_text_string;
    headerTitle.textContent = Settings_text_string;
    title.textContent = `${Settings_text_string} - 2015YouTube`;

    if (pageId === "general") {
      innerSettingsPageCont.innerHTML = "";
      const settingsPage = document.createElement("settings-page");
      innerSettingsPageCont.appendChild(settingsPage);
      settingsPageHeader.textContent = General_text_string;
      headerTitle.textContent = General_text_string;
      title.textContent = `${General_text_string} - 2015YouTube`;
      renderUsernameSetting(settingsPage);
    } else if (pageId === "expflags") {
      innerSettingsPageCont.innerHTML = "";
      const settingsPage = document.createElement("settings-page");
      innerSettingsPageCont.appendChild(settingsPage);
      settingsPageHeader.textContent = ExpFlags_text_string;
      headerTitle.textContent = ExpFlags_text_string;
      title.textContent = `${ExpFlags_text_string} - 2015YouTube`;
    }
  };

  settingsEventListenFunc();
  updateSettingsPage = settingsEventListenFunc;
  window.addEventListener("hashchange", settingsEventListenFunc);
};

// Run on load
initUsername();
