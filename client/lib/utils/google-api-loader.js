

async function load (apis) {

    if (!window.gapi) await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.type = "text\/javascript";
        script.onerror = reject;
        script.onload = resolve;
        document.head.appendChild(script);
        script.src = "https://apis.google.com/js/api.js";
    });

    await new Promise((resolve, reject) => {
        gapi.load(apis, resolve)
    });

    return gapi;
}


module.exports = load;
