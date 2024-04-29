'use strict';

const _maxSaveNumber = 100;
const _root = "https://twitter.com";
// const _primaryContainer = document.querySelector("[data-testid=primaryColumn]");

// function addMenu(tweetEle) {
// 	let dropdownElem = tweetEle.querySelector("[data-testid=Dropdown]");

// 	if (dropdownElem) {
// 		console.log("detect");
// 		const newOptionElem = document.createElement("p");
// 		newOptionElem.innerText = "asdfasdf";

// 		dropdownElem.append(newOptionElem);
// 	}
// }

function processTweets() {
  let tweets = document.querySelectorAll("[data-testid=cellInnerDiv]");
  console.log("Tweets Captured", tweets.length);
  tweets.forEach(tweet => {
    if (isElementInViewport(tweet)) {
      let userNameElem = tweet.querySelector("[data-testid=User-Name]");
      let userIdElem = tweet.querySelector("a[role='link']");
      let tweetUrlElem = tweet.querySelector("a[role='link'][dir='ltr'][aria-label]");
      let tweetBodyElem = tweet.querySelector("[data-testid=tweetText]");
      let tweetTimeElem = tweet.querySelector("a[role='link'] time");
      let tweetImgElems = tweet.querySelectorAll("img[alt='Image']");
      let showMoreLink;
      let tweetUrl = "";
      let engaged = false;
      if (!tweetUrlElem) {
        // maybe can use the index?
        // Try to get url from current host
        if (tweetBodyElem && tweetBodyElem.textContent) {
          console.log("try to get url from title");
          const title = document.title;
          let tweetBody = tweetBodyElem.textContent;
          const firstFiveChars = tweetBody.substring(0, Math.min(5, tweetBody.length));
          if (title.includes(firstFiveChars)) {
            tweetUrl = window.location.href;
            engaged = true;
          }
        }
      } else {
        tweetUrl = _root + tweetUrlElem.getAttribute("href");
      }
      console.log("before checking", userNameElem, tweetBodyElem);
      if (userNameElem && userIdElem && tweetUrl && tweetTimeElem) {
        console.log("pass checking", tweetBodyElem.textContent);
        if (tweetBodyElem) {
          showMoreLink = tweetBodyElem.querySelector("[data-testid=tweet-text-show-more-link]");
        }
        let userName = userNameElem.textContent;
        let tweetBody = tweetBodyElem.textContent;
        if (!!showMoreLink) {
          tweetBody = tweetBody.slice(0, -9);
        }
        let userId = userIdElem.href.split("/").pop();
        let tweetTime = tweetTimeElem.getAttribute("datetime");
        let tweetImages = Array.from(tweetImgElems).map(ele => ele.getAttribute("src"));
        console.log("save tweet", tweetBodyElem.textContent);
        saveTweet(userName, tweetBody, userId, tweetUrl, tweetTime, tweetImages, engaged);
      }
    }
  });
}
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
}
function saveTweet(userName, tweetBody, userId, tweetUrl, tweetTime, tweetImages, engaged) {
  console.log("saving tweet");
  chrome.storage.local.get("tweets", function (data) {
    let tweets = data.tweets || [];
    let tweet = {
      userName: userName,
      tweetBody: tweetBody,
      userId: userId,
      tweetUrl: tweetUrl,
      tweetTime: tweetTime,
      tweetImages: tweetImages,
      captureDate: new Date().toISOString(),
      engaged: engaged
    };
    if (!tweets.some(t => t.tweetUrl === tweetUrl)) {
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
  window.onload = function () {
    setInterval(processTweets, 500);
    const targetNode = document.querySelector("#react-root");
    if (targetNode) {
      const config = {
        attributes: true,
        childList: true,
        subtree: true
      };
      let currentUrl = window.location.href;
      const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList" && window.location.href !== currentUrl) {
            currentUrl = window.location.href;
            let tweetID = currentUrl.split("/").pop();
            chrome.storage.local.get("tweets", function (data) {
              let tweets = data.tweets || [];

              // Find the relevant tweet in the storage by its ID
              let tweetIndex = tweets.findIndex(tweet => tweet.tweetUrl.includes(tweetID));
              if (tweetIndex !== -1) {
                // Update the 'engaged' attribute of the tweet
                tweets[tweetIndex].engaged = true;

                // Save the updated tweets array back to the storage
                chrome.storage.local.set({
                  tweets: tweets
                });
              } else {
                processTweets();
              }
            });
          }
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    } else {
      console.error("Target node not found");
    }
  };
}

main();
