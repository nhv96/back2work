chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
    let s = await chrome.storage.local.get(["b2w_state"]);
    if (s.b2w_state == undefined) {
        return;
    }

    if (s.b2w_state == false) {
        return;
    }

    let v = await chrome.storage.local.get(["blocked_urls"]);
    if (v.blocked_urls == undefined) {
        return;
    }
    let blocked_list = v.blocked_urls;

    if (blocked_list.indexOf(details.url) != -1) {
        chrome.tabs.update({url:"https://hv.instructure.com"});
    }
});