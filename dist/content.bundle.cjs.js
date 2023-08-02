'use strict';

const _maxSaveNumber = 100;
function addMenu(tweetEle) {
  let dropdownElem = tweetEle.querySelector("[data-testid=Dropdown]");
  if (dropdownElem) {
    console.log("detect");
    const newOptionElem = document.createElement("p");
    newOptionElem.innerText = "asdfasdf";
    dropdownElem.append(newOptionElem);
  }
}
function processTweets() {
  let tweets = document.querySelectorAll("[data-testid=cellInnerDiv]");
  tweets.forEach(tweet => {
    if (isElementInViewport(tweet)) {
      try {
        addMenu(tweet);
      } catch (e) {}
      let userNameElem = tweet.querySelector("[data-testid=User-Name]");
      let userIdElem = tweet.querySelector("a[role='link']");
      let tweetUrlElem = tweet.querySelector("a[role='link'][dir='ltr'][aria-label]");
      let tweetBodyElem = tweet.querySelector("[data-testid=tweetText]");
      let tweetTimeElem = tweet.querySelector("a[role='link'] time");
      let tweetImgElems = tweet.querySelectorAll("img[alt='Image']");
      let showMoreLink = tweetBodyElem.querySelector("[data-testid=tweet-text-show-more-link]");
      if (userNameElem && userIdElem && tweetUrlElem && tweetTimeElem) {
        let userName = userNameElem.textContent;
        let tweetBody = tweetBodyElem.textContent;
        if (!!showMoreLink) {
          tweetBody = tweetBody.slice(0, -9);
        }
        let userId = userIdElem.href.split("/").pop();
        let tweetUrl = "https://twitter.com" + tweetUrlElem.getAttribute("href");
        let tweetTime = tweetTimeElem.getAttribute("datetime");
        let tweetImages = Array.from(tweetImgElems).map(ele => ele.getAttribute("src"));
        saveTweet(userName, tweetBody, userId, tweetUrl, tweetTime, tweetImages);
      }
    }
  });
}
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}
function saveTweet(userName, tweetBody, userId, tweetUrl, tweetTime, tweetImages) {
  chrome.storage.local.get("tweets", function (data) {
    let tweets = data.tweets || [];
    let tweet = {
      userName: userName,
      tweetBody: tweetBody,
      userId: userId,
      tweetUrl: tweetUrl,
      tweetTime: tweetTime,
      tweetImages: tweetImages,
      captureDate: new Date().toISOString() // capturing date and time when tweet is saved
    };

    // prevent duplicates
    if (!tweets.some(t => t.userId === userId && t.tweetUrl === tweetUrl)) {
      if (tweets.length >= _maxSaveNumber) {
        tweets.shift();
      }
      // push the new tweet
      tweets.push(tweet);
    }
    chrome.storage.local.set({
      tweets: tweets
    });
  });
}

// function main() {
// 	if (window.location.pathname == "/home") {
// 		setInterval(processTweets, 2000);
// 	}
// }

function main() {
  {
    let lastScrollTop = 0;
    window.addEventListener("scroll", function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (Math.abs(scrollTop - lastScrollTop) > 300) {
        lastScrollTop = scrollTop;
        processTweets();
      }
    });
  }

  // window.addEventListener("popstate", function (event) {
  // 	console.log("Xxxxxxx");
  // });
}

main();
