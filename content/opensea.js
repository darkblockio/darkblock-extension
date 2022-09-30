/* Function that returns true only if current page falls under certain rules. */
const validateURLPath = () => {
    
    const rulesArray = [
        "/assets/ethereum/",
        "/assets/matic",
        "/assets/solana"
    ]

    return rulesArray.some(rule => location.pathname.startsWith(rule))

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

/* Get general data for current NFT. */
const getNFTData = () => {

    const pathArray = location.pathname.split('/')
    const chain = pathArray[2]

    if (chain == "solana")
        return {
            chain,
            tokenID: pathArray[3]
        }

    return {
        chain,
        contractAddress: pathArray[3],
        tokenID: pathArray[4]
    }

}

/* Get relative chain/platform name for Darkblock */
const getDarkblockPlatform = chain => {

    if (chain == "ethereum")
        return "eth"

    if (chain == "matic")
        return "matic"

    if (chain == "solana")
        return "sol"

}

/* We have to make a small difference in Darkblock iframe URL for Solana platform */
const getDarkblockIframeURL = (NFTData, platform) => {

    if (platform == "sol")
        return `https://app.darkblock.io/platform/sol/embed/viewer/${ NFTData.tokenID }`

    return `https://app.darkblock.io/platform/${ platform }/embed/viewer/${ NFTData.contractAddress }/${ NFTData.tokenID }`

}

const appendIframeContainer = async () => {

    const shouldContinue = validateURLPath()

    if (!shouldContinue)
        return

    const NFTData = getNFTData()
    const platform = getDarkblockPlatform(NFTData.chain)

    const offerContainer = await waitForElement(".item--container .item--main .item--frame")
    const iframeContainer = `<div class="opensea-ext--data-container "width: ${ offerContainer.getBoundingClientRect().width }px">
                                <iframe
                                    style="border: none; height: 550px; width: 100%; padding: 5px;"
                                    title="darkblock"
                                    src="${ getDarkblockIframeURL(NFTData, platform) }"
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