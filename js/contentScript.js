debugger;
const url = chrome.runtime.getURL('../data/ads_selectors.json');
fetch(url)
    .then((response) => response.json())
    .then((adsClasses) => {
        removeAdsClasses(adsClasses)
    });

function removeAdsClasses(adsClasses){
    adsClasses.forEach(elementTag => {
        removeElement(elementTag)
    });
}

function removeElement(elementTag){
    const adsElements = document.querySelectorAll(elementTag);
    adsElements.forEach(function(element) {
        element.remove();
    });
}