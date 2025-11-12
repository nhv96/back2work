const txtEnable = "Enable";
const txtDisable = "Disable";

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function setBlockUrl(url) {
    let v = await chrome.storage.local.get(["blocked_urls"]);
    let urls = v.blocked_urls

    if (urls == undefined) {
        urls = [];
        urls[0] = url;
    } else {
        urls.push(url);
    }

    return chrome.storage.local.set({"blocked_urls": urls});
}

async function removeBlockUrl(url) {
    let v = await chrome.storage.local.get(["blocked_urls"]);
    let urls = v.blocked_urls

    if (urls != undefined) {
        let i = urls.indexOf(url);
        if (i > -1) {
            urls.splice(i, 1);
            return chrome.storage.local.set({"blocked_urls": urls});
        }
    }
}

const add_btn = document.getElementById("add_btn");
add_btn.addEventListener('click', async () => {
    let t = await getCurrentTab()

    console.log('adding', t.url)

    setBlockUrl(t.url).then(populateList);
});

const rm_btn = document.getElementById("rm_btn");
rm_btn.addEventListener('click', async () => {
    let t = await getCurrentTab()

    console.log('removing', t.url)

    removeBlockUrl(t.url).then(populateList);
});

async function populateList() {
    let v = await chrome.storage.local.get(["blocked_urls"]);
    if (v.blocked_urls == undefined) {
        return;
    }

    let blocked_list = v.blocked_urls

    let list = document.getElementById("blk_list");
    list.innerHTML = '';

    for(let i = 0; i < blocked_list.length; i++) {
        let item = document.createElement("li");

        item.appendChild(
            document.createTextNode(blocked_list[i])
        );

        list.appendChild(item);
    }
}

const act_btn = document.getElementById("act_btn");
act_btn.addEventListener('click', async () => {
    console.log('toggle')

    let v = await chrome.storage.local.get(["b2w_state"]);
    if (v.b2w_state == undefined) {
        chrome.storage.local.set({"b2w_state": true});
        act_btn.textContent = txtDisable;
        console.log('1')
        return;
    }

    if (v.b2w_state == true) {
        chrome.storage.local.set({"b2w_state": false});
        act_btn.textContent = txtEnable;
        console.log('2')
    } else {
        chrome.storage.local.set({"b2w_state": true});
        act_btn.textContent = txtDisable;
        console.log('3')
    }
});

(async () => {
    populateList();

    let v = await chrome.storage.local.get([b2wState]);
    if (v.b2w_state != undefined) {
        let act_btn = document.getElementById("act_btn");
        if (v.b2w_state == true) {
            act_btn.textContent = txtDisable
        } else {
            act_btn.textContent = txtEnable
        }
    }
})();