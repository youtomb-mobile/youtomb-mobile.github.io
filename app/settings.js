function renderSettingBoolean(parent, sbTitle, sbSubtitle, isPressed, isDisabled, LSItem) {
    const settingBoolean = document.createElement("div");
    settingBoolean.classList.add("setting-boolean", "has-ripple");

    const sbLabel = document.createElement("label");
    sbLabel.classList.add("setting-label");

    const settingTitleSubBlock = document.createElement("div");
    settingTitleSubBlock.classList.add("setting-title-subtitle-block");

    const settingTitle = document.createElement("h3");
    settingTitle.textContent = sbTitle;

    const settingSubtitle = document.createElement("span");
    settingSubtitle.textContent = sbSubtitle;

    settingBoolean.appendChild(sbLabel);
    sbLabel.appendChild(settingTitleSubBlock);
    settingTitleSubBlock.appendChild(settingTitle);
    settingTitleSubBlock.appendChild(settingSubtitle);

    renderToggleBtn(sbLabel, isDisabled, isPressed, LSItem);

    parent.appendChild(settingBoolean);
}

function renderSettingOptionMenu(parent, somTitle, somSubtitle, somArray, somLSItem) {
    const settingOptionMenu = document.createElement("div");
    settingOptionMenu.classList.add("setting-single-option-menu", "has-ripple");

    const sbLabel = document.createElement("label");
    sbLabel.classList.add("setting-label");

    const settingTitleSubBlock = document.createElement("div");
    settingTitleSubBlock.classList.add("setting-title-subtitle-block");
    settingTitleSubBlock.role = "button";
    settingTitleSubBlock.tabIndex = 0;
    settingTitleSubBlock.onclick = function() {
        dialogRenderer(somTitle, "", "options", somArray, somLSItem, true);
    }

    const settingTitle = document.createElement("h3");
    settingTitle.textContent = somTitle;

    const settingSubtitle = document.createElement("span");
    settingSubtitle.textContent = somSubtitle;

    settingOptionMenu.appendChild(sbLabel);
    sbLabel.appendChild(settingTitleSubBlock);
    settingTitleSubBlock.appendChild(settingTitle);
    settingTitleSubBlock.appendChild(settingSubtitle);

    parent.appendChild(settingOptionMenu);
}

// Load Links section
function renderSidebarLinks() {
    const settingsOptCont = document.querySelector(".settings-categories-container");
    if (!settingsOptCont) return;

    // Remove previous links
    const oldLinks = settingsOptCont.querySelector(".settings-links-group");
    if (oldLinks) oldLinks.remove();

    fetch("https://youtomb-mobile.github.io/link-content.json")
        .then(res => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then(data => {
            if (!Array.isArray(data)) return;

            const linkGroup = document.createElement("div");
            linkGroup.classList.add("settings-links-group");

            const linkTitle = document.createElement("h4");
            linkTitle.textContent = "Links";
            linkGroup.appendChild(linkTitle);

            data.forEach(linkItem => {
                if (!linkItem.title || !linkItem.link) return;

                const a = document.createElement("a");
                a.textContent = linkItem.title;
                a.href = linkItem.link;
                a.target = "_blank";
                a.classList.add("settings-link");
                linkGroup.appendChild(a);
            });

            settingsOptCont.appendChild(linkGroup);
        })
        .catch(err => console.error("Failed to load sidebar links:", err));
}

function settingsPage() {
    pageCont.innerHTML = "";

    if (document.querySelector(".tab-bar")) {
        document.querySelector(".tab-bar").setAttribute("hidden", "");
        document.querySelector(".tab-bar").setAttribute("isChannel", "false");
        headerBar.classList.remove('has-tab-bar');
        document.querySelector(".tab-bar").innerHTML = "";
    }

    headerTitle.setAttribute("aria-label", Settings_text_string);
    headerTitle.textContent = Settings_text_string;

    const page = document.createElement("page");
    page.classList.add('ytm15Settings');

    const ytm15settings = document.createElement("ytm15-settings");

    const settingsOptCont = document.createElement("div");
    settingsOptCont.classList.add("settings-categories-container");

    const optArray = [
        { type: "option", title: General_text_string, link: "#/general", id: "general" },
        { type: "option", title: ExpFlags_text_string, link: "#/expflags", id: "expflags" },
        { type: "option", title: AboutYTm15_text_string, link: "index.html#/about", id: "about" }
    ];

    // Build sidebar categories
    optArray.forEach(item => {
        const settingsOpt = document.createElement("a");
        settingsOpt.innerHTML = item.title;
        settingsOpt.classList.add("settings-category", "has-ripple");
        settingsOpt.href = item.link;
        settingsOpt.setAttribute("aria-label", item.title);
        settingsOpt.setAttribute("aria-haspopup", false);
        settingsOpt.setAttribute("aria-pressed", false);
        settingsOpt.id = item.id;
        settingsOptCont.appendChild(settingsOpt);
    });

    // Render dynamic Links section
    renderSidebarLinks();

    const settingsPagesCont = document.createElement("div");
    settingsPagesCont.classList.add("settings-pages-container");

    const settingsPageHeader = document.createElement("h4");
    settingsPageHeader.classList.add("settings-page-header");
    settingsPageHeader.id = "settings";
    settingsPageHeader.textContent = Settings_text_string;

    const innerSettingsPageCont = document.createElement("div");
    innerSettingsPageCont.classList.add("inner-settings-page-container");
    innerSettingsPageCont.innerHTML = `<div class="ytm15-settings-msg">${SettingsMSG_text_string}</div>`;

    ytm15settings.appendChild(settingsOptCont);
    ytm15settings.appendChild(settingsPagesCont);
    settingsPagesCont.appendChild(settingsPageHeader);
    settingsPagesCont.appendChild(innerSettingsPageCont);

    pageCont.appendChild(page);
    page.appendChild(ytm15settings);

    title.textContent = Settings_text_string + ' - 2015YouTube';

    function settingsEventListenFunc() {
        const settingsOpts = settingsOptCont.querySelectorAll(".settings-category");
        settingsOpts.forEach(item => item.setAttribute("aria-pressed", false));

        const pageId = window.location.hash.split("/")[1] || '';
        const activeCategory = settingsOptCont.querySelector(`#${pageId}`);
        if (activeCategory) activeCategory.setAttribute("aria-pressed", true);

        innerSettingsPageCont.innerHTML = `<div class="ytm15-settings-msg">${SettingsMSG_text_string}</div>`;
        settingsPageHeader.textContent = Settings_text_string;
        headerTitle.textContent = Settings_text_string;
        title.textContent = Settings_text_string + ' - 2015YouTube';

        // Always update links
        renderSidebarLinks();

        if (pageId === "general") {
            innerSettingsPageCont.innerHTML = "";
            const settingsPage = document.createElement("settings-page");
            innerSettingsPageCont.appendChild(settingsPage);
            settingsPageHeader.textContent = General_text_string;
            headerTitle.textContent = General_text_string;
            title.textContent = General_text_string + ' - 2015YouTube';
        } else if (pageId === "expflags") {
            innerSettingsPageCont.innerHTML = "";
            const settingsPage = document.createElement("settings-page");
            innerSettingsPageCont.appendChild(settingsPage);
            settingsPageHeader.textContent = ExpFlags_text_string;
            headerTitle.textContent = ExpFlags_text_string;
            title.textContent = ExpFlags_text_string + ' - 2015YouTube';
        }
    }

    settingsEventListenFunc();
    updateSettingsPage = settingsEventListenFunc;

    window.addEventListener("hashchange", () => {
        settingsEventListenFunc();
    });
}
