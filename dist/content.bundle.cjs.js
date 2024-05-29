'use strict';

const _maxSaveNumber = 100;
const _root = "https://x.com";
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
  tweets.forEach(tweet => {
    if (isElementInViewport(tweet)) {
      let userNameElem = tweet.querySelector("[data-testid=User-Name]");
      let userIdElem = tweet.querySelector("a[role='link']");
      let tweetUrlElem = tweet.querySelector("a[role='link'][dir='ltr'][aria-label]");
      let tweetBodyElem = tweet.querySelector("[data-testid=tweetText]");
      let tweetTimeElem = tweet.querySelector("a[role='link'] time");
      let tweetImgElems = tweet.querySelectorAll("img[alt='Image']");
      let showMoreLink;
      if (userNameElem && userIdElem && tweetTimeElem) {
        if (tweetBodyElem) {
          showMoreLink = tweetBodyElem.querySelector("[data-testid=tweet-text-show-more-link]");
        }
        let tweetUrl = "";
        let engaged = false;
        if (!tweetUrlElem && window.location.pathname.includes("/status/")) {
          // If the url element is missing, it means
          // the user might enter the x page from a
          // external link, instead of home page
          tweetUrl = window.location.href;
          engaged = true;
        } else {
          tweetUrl = _root + tweetUrlElem.getAttribute("href");
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
let tweetsToSave = [];
function saveTweet(userName, tweetBody, userId, tweetUrl, tweetTime, tweetImages, engaged) {
  const existingIndex = tweetsToSave.findIndex(tweet => tweet.tweetUrl === tweetUrl);
  if (existingIndex === -1) {
    tweetsToSave.push({
      userName: userName,
      tweetBody: tweetBody,
      userId: userId,
      tweetUrl: tweetUrl,
      tweetTime: tweetTime,
      tweetImages: tweetImages,
      captureDate: new Date().toISOString(),
      engaged: engaged
    });
  }
}
function flushTweets() {
  chrome.storage.local.get("tweets", function (data) {
    let tweets = data.tweets || [];

    // Merge tweets in the temporary array with existing tweets in Chrome storage
    tweetsToSave.forEach(tweetToSave => {
      const existingTweetIndex = tweets.findIndex(t => t.tweetUrl === tweetToSave.tweetUrl);
      if (existingTweetIndex !== -1) {
        // Merge the latest data with the existing tweet
        // But this may only happen when enaged changed
        if (tweetToSave.engaged) {
          tweets[existingTweetIndex].engaged = true;
        }
      } else {
        // Add the new tweet to the existing tweets array
        if (tweets.length >= _maxSaveNumber) {
          tweets.shift();
        }
        tweets.push(tweetToSave);
      }
    });
    chrome.storage.local.set({
      tweets: tweets
    });
    tweetsToSave = [];
  });
}
function main() {
  {
    let lastScrollTop = 0;
    let firstRun = true;
    window.addEventListener("scroll", function () {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (Math.abs(scrollTop - lastScrollTop) > 300) {
        lastScrollTop = scrollTop;
        processTweets();
      }
      if (firstRun) {
        firstRun = false;
        processTweets();
      }
    });
  }
  window.onload = function () {
    const targetNode = document.querySelector("#react-root");
    setInterval(flushTweets, 5000);
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
            console.log("=====>", currentUrl);
            currentUrl = window.location.href;
            processTweets();

            // let tweetID = currentUrl.split("/").pop();

            // chrome.storage.local.get("tweets", function (data) {
            // 	let tweets = data.tweets || [];

            // 	// Find the relevant tweet in the storage by its ID
            // 	let tweetIndex = tweets.findIndex((tweet) =>
            // 		tweet.tweetUrl.includes(tweetID)
            // 	);

            // 	if (tweetIndex !== -1) {
            // 		// Update the 'engaged' attribute of the tweet
            // 		tweets[tweetIndex].engaged = true;

            // 		// Save the updated tweets array back to the storage
            // 		chrome.storage.local.set({ tweets: tweets });
            // 	} else {
            // 		processTweets();
            // 	}
            // });
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
