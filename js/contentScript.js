function enableSlientMode(){
    // mercurymessagesCountValue
    let mercurymessages = document.getElementById('mercurymessagesCountValue')
    if(mercurymessages) mercurymessages.classList.add('hidden_elem')

    // requestsCountValue
    let requestsCount = document.getElementById('requestsCountValue')
    if(requestsCount) requestsCount.classList.add('hidden_elem')

    // notificationsCountValue
    let notificationsCount = document.getElementById('notificationsCountValue')
    if(notificationsCount) notificationsCount.classList.add('hidden_elem')

    //　ChatTabsPagelet
    let pageletDock = document.getElementById('pagelet_dock')
    if(pageletDock) pageletDock.style.display = 'none'
}

function disableSlientMode(){
    //　ChatTabsPagelet
    let pageletDock = document.getElementById('pagelet_dock')
    if(pageletDock) pageletDock.style.display = ''
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
    if (request.message == "FBSM_ENABLE") {
        enableSlientMode()
    } else if(request.message == "FBSM_DISABLE"){
        disableSlientMode()
    }
    return true
})