var tickerSiteSpecificId = null;

//loading value(s) specific to the chrome user
chrome.storage.sync.get(['tickerActiveChrome', 'displayLevel'], (result) => {
    //if user has not set this value yet, set it to true
    if (result.tickerActiveChrome == null) {
        //tickerActive means whether or not the user has the top checkbox checked of popup.html for the ticker to show
        tickerActive = true;
        var tickerActiveChrome1 = true;
        chrome.storage.sync.set({ tickerActiveChrome: tickerActiveChrome1 });
    } else {
        //else grab what they set it to
        tickerActive = Boolean(result.tickerActiveChrome);
    }

    //if user has not set this value yet, set it to vid2
    if (result.displayLevel == null) {
        displayLevel = 'vid2';
        var displayLevel1 = 'vid2';
        chrome.storage.sync.set({ displayLevel: displayLevel1 });
    } else {
        //else grab what they set it to
        displayLevel = result.displayLevel;
    }
});

//kicks everything off
blastOff();

function blastOff() {
    //waiting a couple secs to make sure other things have a chance to complete before this
    setTimeout(() => {
        //not going to start anything if the user hasn't set this to true
        if (tickerActive == true) {
            if (inIFrame()) {
                //wait a little longer to give "YouTube Over Commercials (YTOC)" extension a chance to load if it is also being used
                setTimeout(() => {
                    //make sure YTOC overlay indicator is not in frame this script is running in
                    if (document.getElementById('YTOC-LTT-Blocker')) {
                        //do not run LTT extension in YTOC overlay video
                        console.log('LTT extension will not run in YTOC extension overlay videos.');
                    } else {
                        initiateLTT();
                    }
                }, 2000);
            } else {
                initiateLTT();
            }
        }
    }, 2000);
}

//this function grabs where we want to place the ticker, pulls the html to insert from html-generator.js, and then places it into that location
function initiateLTT() {

    //grab the current domain
    const domain = window.location.href

    //set the id of the div that i'm going to insert specific to the domain, this will help me set up special css per site if I ever get around to that
    tickerSiteSpecificId = `${window.location.hostname.split('.')[1]}-livethreadticker`

    //find where to place the ticker for each site
    let vidLoadLocation;
    if (displayLevel == 'page') {
        vidLoadLocation = document.getElementsByTagName('body')[0];
    } else if (displayLevel == 'vid1' || displayLevel == 'vid2' || displayLevel == 'vid3' || displayLevel == 'vid4') {
        vidLoadLocation = document.getElementsByTagName('video')[0];
    } else if (domain.includes('nfl.com')) {
        vidLoadLocation = document.getElementsByClassName("css-view-1dbjc4n")[3];
    } else if (domain.includes('mlb.com')) {
        vidLoadLocation = document.getElementsByClassName('mlbtv-media-player')[0]; //confirmed working 4-7-22
    } else if (domain.includes('nbcsports.com')) {
        vidLoadLocation = document.getElementsByClassName('tpVideo')[0]; //confirmed works on replay videos 3-17-22
    } else if (domain.includes('usanetwork.com')) {
        vidLoadLocation = document.getElementsByClassName('LivePlayer')[0]; //confirmed working 3-17-22
    } else if (domain.includes('nhl.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0];
    } else if (domain.includes('philo.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0];
    } else if (domain.includes('fubo.tv')) {
        vidLoadLocation = document.getElementById('video'); //confirmed working 2-15-22
    } else if (domain.includes('hulu.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0]; //no free trail option for live tv
    } else if (domain.includes('sling.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0]; //truely works full screen and all at body level, confirmed 2-15-22
    } else if (domain.includes('paramountplus.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0];
    } else if (domain.includes('formula1.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0];
    } else if (domain.includes('nba.com')) {
        vidLoadLocation = document.getElementsByClassName('xcomponent-outlet')[0]; //confirmed working 1-11-22
    } else if (domain.includes('directv.com')) {
        vidLoadLocation = document.getElementsByClassName('videoplayer-container')[0]; //confirmed working 2-15-22
    } else if (domain.includes('weakstreams.com')) {
        vidLoadLocation = document.getElementsByClassName('container')[0]; //confirmed working 1-11-22
    } else if (domain.includes('cbs.com')) {
        vidLoadLocation = document.getElementsByClassName('player-wrapper')[0];
    } else if (domain.includes('cbssports.com')) {
        vidLoadLocation = document.getElementsByClassName('cvp-container avia-container')[0]; //confirmed working 3-17-22
    } else if (domain.includes('ncaa.com')) {
        vidLoadLocation = document.getElementsByClassName('player-wrapper')[0]; //confirmed working 3-17-22
    } else if (domain.includes('1stream.top')) {
        vidLoadLocation = document.getElementsByClassName('container')[1]; //confirmed working 1-11-22
    } else if (domain.includes('foxsports.com')) {
        vidLoadLocation = document.getElementsByClassName('fs-player')[0];
    } else if (domain.includes('amazon.com')) {
        vidLoadLocation = document.getElementsByClassName('scalingVideoContainer')[0];
    } else if (domain.includes('peacocktv.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0]; //truely works full screen and all at body level, confirmed 2-15-22
    } else if (domain.includes('aces2.usite.pro')) {
        vidLoadLocation = document.getElementsByClassName('container')[0]; //confirmed working 2-15-22
    } else if (domain.includes('xfinity.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0]; //truely works full screen and all at body level, confirmed 3-7-22
    } else if (domain.includes('espn.com')) {
        vidLoadLocation = document.getElementsByClassName('btm-media-client')[0] || document.getElementById('vjs_video_3'); //confirmed working for both espn plus and espn live 4-7-22
    } else if (domain.includes('mlb66.ir')) {
        vidLoadLocation = document.getElementsByClassName('container pointer-enabled')[0]; //confirmed working 4-6-22
    } else if (domain.includes('nhl66.ir')) {
        vidLoadLocation = document.getElementsByClassName('container pointer-enabled')[0]; //confirmed working 4-6-22
    } else if (domain.includes('masters.com')) {
        vidLoadLocation = document.getElementsByClassName('amp-html5')[0]; //confirmed working 4-7-22
    } else if (domain.includes('bfstrms.xyz')) {
        vidLoadLocation = document.getElementsByTagName('body')[0];
    } else if (domain.includes('spectrum.net')) {
        vidLoadLocation = document.getElementsByTagName('body')[0];
    } else if (domain.includes('streameast.xyz')) {
        vidLoadLocation = document.getElementsByTagName('body')[0];
    } else if (domain.includes('sky.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0]; //(UK site) don't see free trial to test
    } else if (domain.includes('bt.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0]; //(UK site) don't see free trial to test
    } else if (domain.includes('nowtv.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0]; //(UK site) I see free trial, but not for live sports to test
    } else if (domain.includes('att.com')) {
        vidLoadLocation = document.getElementsByTagName('body')[0]; //unable to test as of 3-7-22 due to them not taking YTTV or comcast as a provider to log in
    } else if (domain.includes('tv.youtube.com')) {
        vidLoadLocation = document.getElementsByClassName('ypl-video-backdrop ypl-fill-layout style-scope ytu-player-layout')[0]; //confirmed working 2-15-22
    } else { // last one is for youtube
        vidLoadLocation = document.getElementsByClassName('html5-video-player')[0] || document.getElementsByClassName('ytp-iv-video-content')[0] || document.getElementsByClassName('ytp-player-content')[2]; //confirmed working 3-7-22
    }


    //retry if page not loaded yet or video location not captured
    if (!document.body || !vidLoadLocation) {
        //wait a little to retry
        setTimeout(() => {
            initiateLTT()
        }, 10000);
    //do not show ticker on reddit.com
    } else if (!domain.includes('reddit.com')) {
        if (displayLevel == 'vid1') {
            //move up a level
            vidLoadLocation = vidLoadLocation.parentNode
        } else if (displayLevel == 'vid2') {
            //move up 2 levels
            vidLoadLocation = vidLoadLocation.parentNode
            vidLoadLocation = vidLoadLocation.parentNode
        } else if (displayLevel == 'vid3') {
            //move up 3 levels
            vidLoadLocation = vidLoadLocation.parentNode
            vidLoadLocation = vidLoadLocation.parentNode
            vidLoadLocation = vidLoadLocation.parentNode
        } else if (displayLevel == 'vid4') {
            //move up 4 levels
            vidLoadLocation = vidLoadLocation.parentNode
            vidLoadLocation = vidLoadLocation.parentNode
            vidLoadLocation = vidLoadLocation.parentNode
            vidLoadLocation = vidLoadLocation.parentNode
        }
        //finding the first child of our video location
        let theFirstChild = vidLoadLocation.firstChild
        //creating a div
        let newElement = document.createElement("div")
        //inserting the new div directly before the video location's first child
        vidLoadLocation.insertBefore(newElement, theFirstChild)
        //grabing the html from html-generator.js and placing it into new div we just added
        newElement.innerHTML = getTickerInsertHTML(tickerSiteSpecificId)
    }

}


function inIFrame() {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
