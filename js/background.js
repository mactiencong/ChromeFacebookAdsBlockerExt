chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        if(isFacebookAds(details)){
            return {cancel: true}
        }
    },
    {urls: ["<all_urls>"]},
    ["blocking"]
);
const url = chrome.runtime.getURL('../data/ads_urls.json');
let ads_urls = []
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        ads_urls = data
    });
function isFacebookAds(details){
    for (let index = 0; index < ads_urls.length; index++) {
        const urlPattern = ads_urls[index]
        const isFacebookAdsUrl = details.url.indexOf(urlPattern) !== -1
        if(isFacebookAdsUrl) return true
    }
    return false
}