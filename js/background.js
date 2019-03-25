const url = chrome.runtime.getURL('../data/block_urls.json')
let block_urls = []
fetch(url)
    .then((response) => response.json())
    .then((data) => {
        block_urls = data
    })
function isBlockUrl(details){
    for (let index = 0; index < block_urls.length; index++) {
        const urlPattern = block_urls[index]
        const isBlock = details.url.indexOf(urlPattern) !== -1
        if(isBlock) return true
    }
    return false
}

function sendContentScriptMsg(msg='FBSM_ENABLE'){
    chrome.tabs.query({url: "https://www.facebook.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {message: msg})
        })
    })
}

function blockListener(details) {
    if(isBlockUrl(details)){
        return {cancel: true}
    }
}

let isEnable = true
function enable(){
    isEnable = true
    setEnableIcon()
    addListeners()
    renameAllFacebookTab()
    sendContentScriptMsg('FBSM_ENABLE')
}

function setEnableIcon(){
    chrome.browserAction.setIcon({
        path : "icon/enable.png"
    })
}

enable()

function disable(){
    isEnable = false
    setDisableIcon()
    removeListeners()
    reloadAllFacebookTab()
    sendContentScriptMsg('FBSM_DISABLE')
}

function removeListeners(){
    chrome.webRequest.onBeforeRequest.removeListener(blockListener)
    chrome.tabs.onUpdated.removeListener(renameFacebookTabTitleListener)
}

function addListeners(){
    chrome.webRequest.onBeforeRequest.addListener(
        blockListener,
        {urls: ["<all_urls>"]},
        ["blocking"]
    )
    chrome.tabs.onUpdated.addListener(renameFacebookTabTitleListener);
}

function setDisableIcon(){
    chrome.browserAction.setIcon({
        path : "icon/disable.png"
    })
}

chrome.browserAction.onClicked.addListener(function(tab) {
    if(isEnable) {
        disable()
    } else enable()
})

function reload(tab){
    chrome.tabs.reload(tab.id)
}

function reloadAllFacebookTab(){
    chrome.tabs.query({url: "https://www.facebook.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            reload(tab)
        })
    })
}

function isFacebookTab(tab){
    try {
        let url = new URL(tab.url)
        let domain = url.hostname
        return domain==="www.facebook.com"
    } catch (error) {
        return false
    }
}

function renameFacebookTabTitleListener(tab) {
    if(isFacebookTab(tab)) renameFacebookTabTitle(tab)
}

function renameAllFacebookTab(){
    chrome.tabs.query({url: "https://www.facebook.com/*"}, function (tabs) {
        tabs.forEach(tab => {
            renameFacebookTabTitle(tab)
        })
    })
}

function renameFacebookTabTitle(tab){
    if(isEnable) chrome.tabs.executeScript(tab.id, {code:"document.title = 'Facebook Slient Mode'"})
}