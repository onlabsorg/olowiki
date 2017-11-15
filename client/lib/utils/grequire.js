

const loadedAPIs = new Set();

async function grequire (...apiNames) {
    if (!window.gapi) await loadScript("https://apis.google.com/js/api.js");
    for (let apiName of apiNames) {
        if (!loadedAPIs.has(apiName)) {
            await gload(apiName);
            loadedAPIs.add(apiName);
        }
    }
    return window.gapi;
}

function loadScript (src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text\/javascript";
        script.onerror = reject;
        script.onload = resolve;
        document.head.appendChild(script);
        script.src = src;
    });
}

function gload (apiName) {
    return new Promise((resolve, reject) => {
        window.gapi.load(apiName, resolve);
    });
}


module.exports = grequire;
