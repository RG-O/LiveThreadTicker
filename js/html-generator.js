
//grab user set prefs from chrome 
chrome.storage.sync.get(['displayLocation', 'commentFontSize'], (result) => {
    if (result.displayLocation == "bottom") {
        //set for displaying ticker at bottom of video
        displayLocation = "";
    } else {
        //set for displaying ticker at top of video
        displayLocation = "top: 0px;";
    }

    if (result.commentFontSize == null) {
        //set for displaying ticker at bottom of video
        commentBodySize = 22;
        tickerHeightSize = 28;
    } else {
        //set for displaying ticker at top of video
        commentBodySize = result.commentFontSize;
        tickerHeightSize = Math.ceil(result.commentFontSize * 1.272);
    }
});

//generate HTML for ticker
function getTickerInsertHTML(lTTSiteId) {
            return `
    <div class="${lTTSiteId}" style="background-color: rgba(0, 0, 0, 0.8); height: ${tickerHeightSize}px; bottom: 0; position: absolute !important; overflow: hidden !important; z-index: 2147483647 !important; border-left: 0; border-right: 0; ${displayLocation} width: 100%;">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300&display=swap" rel="stylesheet">
        <div id = "tickerCommentSlot" style="margin: 0 -0.25rem; font-family: 'Roboto Condensed', sans-serif; padding-left: 7px; color: white; font-size: ${commentBodySize}px"></div>
    </div>
    `
}
