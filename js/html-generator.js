
//grab user set prefs from chrome 
chrome.storage.sync.get(['displayLocation', 'commentFontSize'], (result) => {
    displayLocation = result.displayLocation;
    if (result.commentFontSize == null) {
        //set font size to these values since the user hasn't set them yet
        commentBodySize = 22;
        tickerHeightSize = 28;
    } else {
        //use user defined font sizes
        commentBodySize = result.commentFontSize;
        tickerHeightSize = Math.ceil(result.commentFontSize * 1.272);
    }
});

//generate HTML for ticker
function getTickerInsertHTML(lTTSiteId) {
    var mainDiv = document.createElement('div')
    mainDiv.className = "ltt-main " + lTTSiteId
    mainDiv.style.height = tickerHeightSize + "px"
    if (displayLocation == "top" || displayLocation == null) {
        //set for displaying ticker at top of video
        mainDiv.style.top = "0px"
    }
    var fontLink1 = document.createElement('link')
    fontLink1.rel = "preconnect"
    fontLink1.href = "https://fonts.googleapis.com"
    var fontLink2 = document.createElement('link')
    fontLink2.rel = "preconnect"
    fontLink2.href = "https://fonts.gstatic.com"
    var fontLink3 = document.createElement('link')
    fontLink3.href = "https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300&display=swap"
    fontLink3.rel = "stylesheet"
    mainDiv.appendChild(fontLink1)
    mainDiv.appendChild(fontLink2)
    mainDiv.appendChild(fontLink3)
    var tickerCommentSlotDiv = document.createElement('div')
    tickerCommentSlotDiv.className = "ltt-comment-slot"
    tickerCommentSlotDiv.id = "tickerCommentSlot"
    tickerCommentSlotDiv.style.fontSize = commentBodySize + "px"
    mainDiv.appendChild(tickerCommentSlotDiv)
    return mainDiv;
}
