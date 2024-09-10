//establishing variables, not sure I even need to do this? seems to work fine sometimes when I don't
var jsonRLTURL;
var upVoteMin;
var delaySeconds;
var delayMiliSeconds;
var commentLoadIntervalMiliSeconds;
var maxCommentLoad;
var tickerActive;
var upVoteFallback;
var tickerLoaded;
var usernameSize;

//getting user chrome settings
chrome.storage.sync.get(['rLTURL', 'upVoteMin', 'delaySeconds', 'commentLoadInterval', 'maxCommentLoad', 'tickerActiveChrome', 'upVoteFallback', 'commentFontSize', 'textExclusionList', 'scrollEnabled'], (result) => {
    //if these settings have not been entered yet, it won't try to set them, otherwise there is an error on the slice
    if (result.upVoteMin == null) {
        console.log("Need to input URL into Live Thread Ticker console.")
    } else {
        //seting the values as they need to be for them to work for the comment fetcher
        jsonRLTURL = result.rLTURL.slice(0, -1) + ".json?sort=new"
        upVoteMin = result.upVoteMin;
        delayMiliSeconds = result.delaySeconds * 1000;
        commentLoadIntervalMiliSeconds = result.commentLoadInterval * 1000;
        scrollingDelay = Math.round(result.commentLoadInterval * 0.33);
        maxCommentLoad = result.maxCommentLoad;
        tickerActive = Boolean(result.tickerActiveChrome);
        upVoteFallback = Boolean(result.upVoteFallback);
        scrollEnabled = Boolean(result.scrollEnabled);
        //need to have this check in here for anybody that had the extension before font size was customizable
        if (result.commentFontSize == null) {
            //set default username size
            usernameSize = 14;
        } else {
            //set user selected username size
            usernameSize = Math.round(result.commentFontSize * 0.636);
        }
        if (result.textExclusionList == null) {
            //if the text exlcusion list has not been set by the user yet, I set it here so the comment fetcher doesn't spit out errors when it tries to load it
            textExclusionList1 = ''
            chrome.storage.sync.set({ textExclusionList: textExclusionList1 });
        } else if (result.textExclusionList != '') {
            textExclusionList = result.textExclusionList.toUpperCase()
            textExclusionListArr = textExclusionList.split(',')
        }
    }
});

//kicking off comment fetcher initiation
kickOff();

function kickOff() {
    //waiting a few secs before initiating fetching comments so other things, including the ticker div have time to set
    setTimeout(() => {
        //checking to see if the ticker div has been set
        tickerLoaded = !!document.getElementById("tickerCommentSlot");
        //only initiating if user set the ticker to be active
        if (tickerActive == true) {
            //only initiating if ticker div has been set
            if (tickerLoaded == true) {
                //initiating fetching comments
                fetchComments()
                //setting to rerun in user defined increments
                commentFetchInterval = setInterval(fetchComments, commentLoadIntervalMiliSeconds);
            }
            else {
                //running again since the ticker div was not set
                kickOff()
            }
        }
    }, 3000);
}

//grabs the comments
function fetchComments() {
    //only runs if the user set the ticker to active, checking here in case user wants to turn it off on a page the ticker has already started
    if (tickerActive == true) {
        //if the user has not set their chrome prefs yet, the ticker will indicate to do so
        if (upVoteMin == null) {
            document.getElementById("tickerCommentSlot").innerHTML = "To initiate Live Thread Ticker: Please click on the LTT Chrome extension icon, input comment thread URL, and then click save"
        } else {
            //grabing some of the user set values again, this allows some of the changes to take effect without refreshing the page the ticker is on
            chrome.storage.sync.get(['rLTURL', 'upVoteMin', 'delaySeconds', 'maxCommentLoad', 'tickerActiveChrome', 'upVoteFallback', 'textExclusionList', 'scrollEnabled'], (result) => {
                jsonRLTURL = result.rLTURL.slice(0, -1) + ".json?sort=new"
                upVoteMin = result.upVoteMin;
                delayMiliSeconds = result.delaySeconds * 1000;
                maxCommentLoad = result.maxCommentLoad;
                tickerActive = Boolean(result.tickerActiveChrome);
                upVoteFallback = Boolean(result.upVoteFallback);
                scrollEnabled = Boolean(result.scrollEnabled);
                if (result.textExclusionList == null || result.textExclusionList == '') {
                    //if the text exlcusion list has not been set by the user yet or set and then removed, I set it here to a nonsense value that will most likely never come up
                    textExclusionList = 'sfNWEfsjlfiwenl'
                    textExclusionListArr = textExclusionList.split(',')
                } else {
                    textExclusionList = result.textExclusionList.toUpperCase()
                    textExclusionListArr = textExclusionList.split(',')
                }
            });

            //establishing variables
            var fullCommentList = ''
            var finalOutput = ''
            //This is the "logo"
            var beginning = '<span style=\"color: rgb(140, 179, 210);\">L</span>TT '

            //fetching the json from the user inputted url
            //adding date to the end of the url since firefox won't bother re-reading something it just read
            fetch(jsonRLTURL + "&" + 1 * new Date())
                .then(response => response.json())
                .then(body => {
                    //parsing through the comments, also index1 to limit the number of comments loaded base on the user set max
                    for (let index = 0, index1 = 0; index < body[1].data.children.length && index1 < maxCommentLoad; index++) {
                        //only grabing comments that meet the user set parameters and aren't a stickied comment
                        if (body[1].data.children[index].data.ups >= upVoteMin && body[1].data.children[index].data.stickied == false && (body[1].data.children[index].data.created_utc * 1000) < (Date.now() - delayMiliSeconds) && textExclusionListArr.some(substring => body[1].data.children[index].data.body.toUpperCase().includes(substring)) == false) {
                            let author = body[1].data.children[index].data.author
                            let comment = body[1].data.children[index].data.body
                            let upVotes = body[1].data.children[index].data.ups
                            index1++
                            //concatenating comment after comment, also changing name and vote font size and color
                            fullCommentList += " <span style=\"font-size: " + usernameSize + "px; color: rgb(140, 179, 210);\">" + author + "(" + upVotes + "):</span>" + comment + "&nbsp;";
                        }
                    }
                    //check to see if any comments that met the requirments were found AND if the user has the upvote fallback preference set
                    if (fullCommentList == '' && upVoteFallback == true) {
                        //if none were found, we are going to try to grab again, but this time ignoring the min upvote requirement
                        for (let index = 0, index1 = 0; index < body[1].data.children.length && index1 < maxCommentLoad; index++) {
                            //only grabing comments that meet the user set parameters and aren't a stickied comment (ignoring the upvote minimum)
                            if (body[1].data.children[index].data.stickied == false && (body[1].data.children[index].data.created_utc * 1000) < (Date.now() - delayMiliSeconds) && textExclusionListArr.some(substring => body[1].data.children[index].data.body.toUpperCase().includes(substring)) == false) {
                                let author = body[1].data.children[index].data.author
                                let comment = body[1].data.children[index].data.body
                                let upVotes = body[1].data.children[index].data.ups
                                index1++
                                //concatenating comment after comment, also changing name and vote font size and color, but this time changing the upvote count to red to indicate to the user that we had to drop the min upvote requirements
                                fullCommentList += " <span style=\"font-size: " + usernameSize + "px; color: rgb(140, 179, 210);\">" + author + "(" + "<span style=\"!important; color: rgb(255, 68, 51);\">" + upVotes + "</span>" + "):</span>" + comment + "&nbsp;";
                            }
                        }
                        //adding scroll if the user has it set
                        if (scrollEnabled == true) {
                            beginning = "<span class=\"ltt-scroll-container\"><span class=\"ltt-logo-scroll\">&nbsp;&nbsp;" + beginning + "&nbsp;</span>"
                            fullCommentList = " <span class=\"ltt-scroll\" style=\"animation-delay: " + scrollingDelay + "s;\">LTT&nbsp;&nbsp;&nbsp;" + fullCommentList + "</span></span>"
                        }
                        //adding "logo" before the string of comments
                        finalOutput = beginning.concat(fullCommentList)
                        //rechecking to see if the ticker div is still set as some pages can remove the video without refreshing the page
                        tickerLoaded = !!document.getElementById("tickerCommentSlot");
                        //only initiating if user set the ticker to be active
                        if (tickerLoaded == true) {
                            //pushing the result out into the ticker div
                            document.getElementById("tickerCommentSlot").innerHTML = finalOutput
                        } else {
                            //since the ticker div is now gone for whatever reason, clear the current comment fetching interval and basically restart the whole extension
                            clearInterval(commentFetchInterval)
                            blastOff()
                            kickOff()
                        }
                    } else {
                        //if at least one comment was found with the full requirements including the min upvote, we are going to display it
                        //adding scroll if the user has it set
                        if (scrollEnabled == true) {
                            beginning = "<span class=\"ltt-scroll-container\"><span class=\"ltt-logo-scroll\">&nbsp;&nbsp;" + beginning + "&nbsp;</span>"
                            fullCommentList = " <span class=\"ltt-scroll\" style=\"animation-delay: " + scrollingDelay + "s;\">LTT&nbsp;&nbsp;&nbsp;" + fullCommentList + "</span></span>"
                        }
                        //adding "logo" before the string of comments
                        finalOutput = beginning.concat(fullCommentList)
                        //rechecking to see if the ticker div is still set as some pages can remove the video without refreshing the page
                        tickerLoaded = !!document.getElementById("tickerCommentSlot");
                        //only initiating if user set the ticker to be active
                        if (tickerLoaded == true) {
                            //pushing the result out into the ticker div
                            document.getElementById("tickerCommentSlot").innerHTML = finalOutput
                        } else {
                            //since the ticker div is now gone for whatever reason, clear the current comment fetching interval and basically restart the whole extension
                            clearInterval(commentFetchInterval)
                            blastOff()
                            kickOff()
                        }
                    }
                }
                );
        }
    }
}
