/* Function that returns true only if current page falls under certain rule. */
const validateURLPath = () => {
    return location.pathname.startsWith("/item-details")
}

/* Helper function which waits for element to appear in DOM and returns it. */
const waitForElement = selector => {
    return new Promise(resolve => {

        const loop = () => {
            const element = document.querySelector(selector)
            if (element)
                return resolve(element)
        }

        setTimeout(loop, 1000)
        // loop()
    })
}

/* Get token id for current NFT. */
const getTokenID = () => {
    return location.pathname.split('/')[2]
}

const appendIframeContainer = async () => {

    const shouldContinue = validateURLPath()

    if (!shouldContinue)
        return

    const tokenID = getTokenID()

    await waitForElement(".content")

    const offerContainer = document.querySelectorAll(".content > div")[3]

    let widgetContainer = document.createElement('div')
    widgetContainer.setAttribute('id', 'darkblock-widget-embed')
    widgetContainer.setAttribute('style', "padding: 5px; width:100%; background-color:white;")

    let widgetScript = document.createElement('script')
    widgetScript.setAttribute('type', 'module')
    widgetScript.setAttribute('id', 'darkblockwidget-script')
    widgetScript.setAttribute('data-config', `{'platform':'Solana', 'tokenId': '${tokenID}'}`)
    widgetScript.setAttribute('src', chrome.runtime.getURL("darkblock-widget-latest.js") )

    offerContainer.insertAdjacentElement("afterend", widgetContainer)
    document.body.appendChild(widgetScript)
}

/* Opensea works with dynamic pages. We have to track the URL change and only if that happens - attempt to append the iframe. */
const trackURLChange = () => {

    let oldURL = location.href

    setInterval(() => {

        let currentURL = location.href

        if (currentURL == oldURL)
            return

        appendIframeContainer()

        oldURL = currentURL

    }, 1000)

}

const isloaded = () => {
    window.onload = () => {
        appendIframeContainer()
        trackURLChange()
    }
}

isloaded()
