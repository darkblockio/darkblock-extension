/* Function that returns true only if current page falls under certain rule. */
const validateURLPath = () => {
    return location.pathname.startsWith("/single")
}

/* Helper function which waits for element to appear in DOM and returns it. */
const waitForElement = selector => {
    return new Promise(resolve => {

        const loop = () => {

            const element = document.querySelector(selector)

            if (element)
                return resolve(element)

            setTimeout(loop, 1000)

        }

        loop()

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

    const offerContainer = await waitForElement("nft-actions")
    const iframeContainer = `<div class="opensea-ext--data-container "width: ${ offerContainer.getBoundingClientRect().width }px">
                                <iframe
                                    style="border: none; height: 550px; width: 100%; padding: 5px;"
                                    title="darkblock"
                                    src="https://app.darkblock.io/platform/sol/embed/viewer/${ tokenID }">
                                </iframe>
                            </div>`


    offerContainer.insertAdjacentHTML("afterend", iframeContainer)

    /* Not sure what is the exact reason, but the page re-renders after it gets loaded - therefore our container gets removed. Have to track that and re-add */
    const interval = setInterval(() => {

        const iframeExists = document.querySelector(".opensea-ext--data-container")

        if (iframeExists)
            return

        clearInterval(interval)

        appendIframeContainer()

    }, 1000)

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

appendIframeContainer()
trackURLChange()