//Things to improve:
//-add grab current url feature
//-on upvote min drop feature, have it load a second page of comments in case the comment delay feature is still causing comments not to show
//-show flair somehow?
//-add tool tips so when you hover over the text in the popup it will tell you what it does
//-add user exclusion list
//-make scrolling work with firefox etc
//-clean up upvote fallback so everything isn't duplicated

//Updates to make in google web store:
//-I can add a youtube video to the web store post?? - maybe I record a shorter video without me talking?

//grab whether or not the user set the ticker to active
chrome.storage.sync.get(['tickerActiveChrome'], (result) => {
    //if user has not set this value yet, set it to true
    if (result.tickerActiveChrome == null) {
        optionsForm.tickerActive.checked = true;
        var tickerActiveChrome1 = true;
        chrome.storage.sync.set({ tickerActiveChrome: tickerActiveChrome1 });
    } else {
        //else grab what they set it to
        optionsForm.tickerActive.checked = Boolean(result.tickerActiveChrome);
    }
});

//grab all user set values
chrome.storage.sync.get(['displayLocation', 'rLTURL', 'upVoteMin', 'delaySeconds', 'commentLoadInterval', 'maxCommentLoad', 'tickerActiveChrome', 'upVoteFallback', 'displayLevel', 'textExclusionList', 'scrollEnabled'], (result) => {
    //if user has not set their values yet, input these defaults into the field
    if (result.rLTURL == null) {
        optionsForm.displayLocation.value = 'top';
        optionsForm.upVoteMin.value = 1;
        optionsForm.delaySeconds.value = 25;
        optionsForm.commentLoadInterval.value = 20;
        optionsForm.maxCommentLoad.value = 10;
        optionsForm.upVoteFallback.checked = true;
        optionsForm.displayLevel.value = 'vid2';
        optionsForm.scrollEnabled.checked = false;
    } else {
        //else grab what they set them to
        optionsForm.displayLocation.value = result.displayLocation;
        optionsForm.rLTURL.value = result.rLTURL;
        optionsForm.upVoteMin.value = result.upVoteMin;
        optionsForm.delaySeconds.value = result.delaySeconds;
        optionsForm.commentLoadInterval.value = result.commentLoadInterval;
        optionsForm.maxCommentLoad.value = result.maxCommentLoad;
        optionsForm.tickerActive.checked = Boolean(result.tickerActiveChrome);
        optionsForm.upVoteFallback.checked = Boolean(result.upVoteFallback);
        //checking these specifically since they came in a later updates
        if (result.displayLevel == null) {
            optionsForm.displayLevel.value = 'vid2';
        } else {
            optionsForm.displayLevel.value = result.displayLevel;
        }
        if (result.scrollEnabled == null) {
            optionsForm.scrollEnabled.checked = false;
        } else {
            optionsForm.scrollEnabled.checked = Boolean(result.scrollEnabled);
        }
        //doing this so it doesn't show "undefined" in the field if it isn't set yet
        if (result.textExclusionList) {
            optionsForm.textExclusionList.value = result.textExclusionList;
        }
    }
});

//grab comment font size (I'm grabbing this outside of all the other ones since this setting came later in an update)
chrome.storage.sync.get(['commentFontSize'], (result) => {
    //if user has not set comment font size yet, input this default into the field
    if (result.commentFontSize == null) {
        optionsForm.commentFontSize.value = 22;
    } else {
        //else grab what they set it to
        optionsForm.commentFontSize.value = result.commentFontSize;
    }
});

//listen to see if the user changes whether or not the ticker is active, then set it accordingly
optionsForm.tickerActive.addEventListener('change', (event) => {
    var tickerActiveChrome1 = event.target.checked;
    chrome.storage.sync.set({ tickerActiveChrome: tickerActiveChrome1 });
});

//uncollapse advanced settings if user clicks button to do so
document.getElementById("ltt-expand-button").onclick = function () {
    this.classList.toggle("button-hidden");
    var content = this.nextElementSibling;
    content.style.display = "block";
}

//if user clicks the save button, save all their values to their chrome profile
document.getElementById("ltt-save-button").onclick = function () {
    var displayLocation1 = document.querySelector('input[name=displayLocation]:checked').value
    var rLTURL1 = document.getElementsByName("rLTURL")[0].value
    var upVoteMin1 = document.getElementsByName("upVoteMin")[0].value
    var delaySeconds1 = document.getElementsByName("delaySeconds")[0].value
    var commentLoadInterval1 = document.getElementsByName("commentLoadInterval")[0].value
    var maxCommentLoad1 = document.getElementsByName("maxCommentLoad")[0].value
    var upVoteFallback1 = document.getElementsByName("upVoteFallback")[0].checked
    var commentFontSize1 = document.getElementsByName("commentFontSize")[0].value
    var displayLevel1 = document.querySelector('input[name=displayLevel]:checked').value
    var textExclusionList1 = document.getElementsByName("textExclusionList")[0].value
    var scrollEnabled1 = document.getElementsByName("scrollEnabled")[0].checked
    //check to see if they have inputed all the fields, alert them if they haven't
    if (!displayLocation1 || !rLTURL1 || !upVoteMin1 || !delaySeconds1 || !commentLoadInterval1 || !maxCommentLoad1 || !commentFontSize1 || !displayLevel1) {
        alert('Field missing');
        return;
    }
    //save the values to the users chrome profile, close the extension window, and then give them message telling them they might need to refresh
    chrome.storage.sync.set({ displayLocation: displayLocation1, rLTURL: rLTURL1, upVoteMin: upVoteMin1, delaySeconds: delaySeconds1, commentLoadInterval: commentLoadInterval1, maxCommentLoad: maxCommentLoad1, upVoteFallback: upVoteFallback1, commentFontSize: commentFontSize1, displayLevel: displayLevel1, textExclusionList: textExclusionList1, scrollEnabled: scrollEnabled1 }, function () {
        window.close();
        alert("Changes saved successfully! Note: If ticker is already loaded on a page, you may need to refresh that page for some of these changes to take effect.");
    });
}

//close chrome extension window if they click to close
document.getElementById("ltt-close-button").onclick = function () {
    window.close();
}