let adsUrlPatterns = []

function loadAdsUrlPatterns(){
  const url = chrome.runtime.getURL('../data/adsUrlPatterns.json')
  return fetch(url)
    .then(response => response.json())
    .then(patterns => patterns)
}

function start(){
  loadAdsUrlPatterns().then(data => {
    adsUrlPatterns = data
    startBlock()
    reloadAllYoutubeTab()
  })
}

function startBlock(){
  chrome.webRequest.onBeforeRequest.addListener(
    blockListener,
    {urls: ["<all_urls>"]},
    ["blocking"]
  )
}

function isAds(details){
    for (let index = 0; index < adsUrlPatterns.length; index++) {
        const adsUrlPattern = adsUrlPatterns[index]
        const isAdsUrl = details.url.indexOf(adsUrlPattern) !== -1
        if(isAdsUrl) return true
    }
    return false
}

function blockListener(details) {
  if(isAds(details)){
      return {cancel: true}
  }
}

function reload(tab){
  chrome.tabs.reload(tab.id)
}

function reloadAllYoutubeTab(){
  chrome.tabs.query({url: "*://*.youtube.com/*"}, tabs => {
      tabs.forEach(tab => {
          reload(tab)
      })
  })
}

start()