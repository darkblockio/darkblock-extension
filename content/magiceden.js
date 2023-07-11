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

    await waitForElement(".content")

    const offerContainer = document.querySelectorAll(".content > div")[3]
    const iframeContainer = `<div class="opensea-ext--data-container "width: ${ offerContainer.getBoundingClientRect().width }px">
                                <iframe
                                    style="border: none; height: 550px; width: 100%; padding: 5px;"
                                    title="darkblock"
                                    src="https://app.darkblock.io/platform/sol/embed/test/${ tokenID }"
                                    allowfullscreen=“allowfullscreen” mozallowfullscreen=“mozallowfullscreen” msallowfullscreen=“msallowfullscreen” oallowfullscreen=“oallowfullscreen” webkitallowfullscreen=“webkitallowfullscreen”>
                                </iframe>
                            </div>`

    offerContainer.insertAdjacentHTML("afterend", iframeContainer)

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