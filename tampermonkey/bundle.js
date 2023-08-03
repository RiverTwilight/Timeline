'use strict';

const _maxSaveNumber = 100;
// const _primaryContainer = document.querySelector("[data-testid=primaryColumn]");

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

function GM_addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

function injectCss() {
	GM_addStyle(`
	
		/**
 * Bolt.css
 * Version 0.5.0
 * https://github.com/tbolt/boltcss
 *
 * Sections
 * 1. Content sectioning
 * 2. Text content
 * 3. Inline text semantics
 * 4. Image and multimedia
 * 5. Tables
 * 6. Forms
 * 7. Interactive elements
 *
 */

:root {
	--c-themed: #4589ee;
	--highlight-border-radius: 7px;
	--border-radius: 11px;
	--siderbar-bg: var(--background-main);

	--links: #0f6dff;
	--background-body: #fff;
	--background-main: #f1f1f1;
	--background-inputs: #fcfcfc;
	--text: #1c1d1e;
	--border: #dddddd;
	--focus-highlight: #b8b8b8;
	--shadow-color: #545454;
	--table-highlight: #f1f1f1;
	--select-icon-url: url("data:image/svg+xml,%3Csvg width='292' height='292' viewBox='0 0 292 292' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpath id='Path' fill='%23222222' stroke='none' d='M 287 69 C 283.606537 65.469971 278.895844 63.513214 274 63.600006 L 18.4 63.600006 C 13.4 63.600006 9.1 65.400009 5.5 69 C 1.984143 72.328568 -0.005267 76.958466 -0 81.800003 C -0 86.800003 1.8 91.100006 5.4 94.699997 L 133.399994 222.600006 C 137 226.200012 141.199997 228 146.199997 228 C 151.199997 228 155.399994 226.200012 159 222.600006 L 287 94.600006 C 290.5 91.100006 292.399994 86.800003 292.399994 81.800003 C 292.399994 76.800003 290.5 72.600006 286.899994 69 Z'/%3E%3C/svg%3E");
}

@media (prefers-color-scheme: dark) {
	:root {
		--siderbar-bg: #333;
		--c-themed: #4589ee;
		--links: #4589ee;
		--background-body: #0f0f0f;
		--background-main: #222;
		--background-inputs: #222;
		--text: #efefef;
		--border: #444;
		--focus-highlight: #888;
		--shadow-color: #bebebe;
		--table-highlight: #222;
		--select-icon-url: url("data:image/svg+xml,%3Csvg width='292' height='292' viewBox='0 0 292 292' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cpath id='Path' fill='%23ffffff' stroke='none' d='M 287 69 C 283.606537 65.469971 278.895844 63.513214 274 63.600006 L 18.4 63.600006 C 13.4 63.600006 9.1 65.400009 5.5 69 C 1.984143 72.328568 -0.005267 76.958466 -0 81.800003 C -0 86.800003 1.8 91.100006 5.4 94.699997 L 133.399994 222.600006 C 137 226.200012 141.199997 228 146.199997 228 C 151.199997 228 155.399994 226.200012 159 222.600006 L 287 94.600006 C 290.5 91.100006 292.399994 86.800003 292.399994 81.800003 C 292.399994 76.800003 290.5 72.600006 286.899994 69 Z'/%3E%3C/svg%3E");
	}
}

*,
::after,
::before {
	box-sizing: border-box;
}

html,
body {
	margin: 0;
	font-size: 12pt;
	font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
		Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
	color: var(--text);
	background: var(--background-body);
}

/* Content sectioning */
address {
	font-style: normal;
	line-height: 1.6rem;
}

/* Todo: Revisit this and try to find a way to handle margin depending on float direction  */
aside {
	width: 40%;
	padding: 0.84rem;
	margin: 0.16rem;
	font-style: italic;
	color: var(--text);
	background-color: var(--background-main);
	border-radius: var(--border-radius);
}

/* No styles provided */
footer {
}
header {
}

h1 {
	font-size: 2.5rem;
}

h2 {
	font-size: 2rem;
}

h3 {
	font-size: 1.75rem;
}

h4 {
	font-size: 1.5rem;
}

h5 {
	font-size: 1.25rem;
	font-weight: normal;
}

h6 {
	font-size: 1rem;
	font-weight: normal;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
}

h1,
h2,
h3,
h4,
b,
strong,
th {
	font-weight: 700;
}

/* Not provided */
hgroup {
}

/* Not provided */
main {
}

/* Not provided */
nav {
}

/* Not provided */
section {
}

/* Text content */
blockquote {
	position: relative;
	padding-left: 1.5rem;
	margin: 0;
}

blockquote:before {
	content: "";
	display: block;
	position: absolute;
	left: 0;
	height: 100%;
	border-left: 7px solid var(--border);
	border-radius: 6px;
}

dd {
	margin-left: 0;
	padding-bottom: 11px;
}

dl {
}

dt {
	font-weight: bold;
}

figcaption {
	padding-top: 10px;
	font-size: 0.8rem;
}

figure {
	margin: 0;
}

hr {
	border: 2px solid var(--border);
}

ul,
ol {
}

li {
	line-height: 1.6em;
}

p {
	display: block;
	line-height: 1.6em;
}

/* Inline text elements */
a {
	color: var(--links);
}

a:active,
a:hover,
a:focus {
	text-decoration: none;
}

mark,
samp,
kbd,
code,
time {
	border-radius: var(--highlight-border-radius, 4px);
	box-decoration-break: clone;
	-webkit-box-decoration-break: clone;
}

mark {
	background-color: #fffab7;
	padding: 3px 5px;
}

samp {
	display: inline-block;
	font-weight: bold;
	padding: 10px 20px;
	background-color: var(--background-main);
	color: var(--text);
}

kbd,
time {
	padding: 2px 4px;
	background-color: var(--background-main);
	color: var(--text);
}

code,
pre {
	font-size: 1em;
	padding: 2px 4px;
	background: var(--background-main);
	border: 1px solid darkgray;
	max-width: fit-content;
	overflow-x: auto;
}

pre > code {
	padding: 10px;
	border: 0;
	display: block;
	overflow-x: auto;
}

pre {
	margin: 0;
	border-radius: var(--border-radius);
}

sup,
sub {
	line-height: normal;
}

/* Image and multimedia */
audio,
img,
video {
	border-radius: var(--border-radius);
	max-width: 100%;
}

img {
	height: auto;
}

/* Tables */
table {
	width: fit-content;
	border: 1px solid var(--background-main);
	background: var(--background-main);
	border-radius: var(--border-radius);
}

table tr:last-child td:first-child {
	border-bottom-left-radius: 8px;
}

table tr:last-child td:last-child {
	border-bottom-right-radius: 8px;
}

table tr:first-child th:first-child {
	border-top-left-radius: 8px;
}

table tr:first-child th:last-child {
	border-top-right-radius: 8px;
}

th {
	background-color: var(--background-main);
}

td {
	background: var(--background-body);
}

td,
th {
	text-align: left;
	padding: 8px;
}

thead {
	border-collapse: collapse;
}

tfoot {
	border-top: 1px solid black;
}

table tr:hover td,
tbody tr:nth-child(even):hover td {
	background-color: var(--table-highlight);
}

/* Form elements */
input,
button,
select,
optgroup,
textarea {
	margin: 0;
}

button,
select,
input[type="submit"],
input[type="button"],
input[type="checkbox"],
input[type="range"],
input[type="radio"] {
	cursor: pointer;
}

button {
	color: var(--text);
	background-color: var(--background-main);
	font-family: inherit;
	font-size: inherit;
	padding: 6px 15px 6px 15px;
	border: 1px solid transparent;
	border-radius: 6px;
	box-shadow: 0px 1px 1.5px rgba(158, 158, 158, 0.6);
}

button:active {
	box-shadow: none;
	border: 1px solid var(--border);
}

button:disabled,
button[disabled] {
	box-shadow: none;
	border: 1px solid var(--border);
	cursor: initial;
	opacity: 0.55;
}

label {
	display: block;
	max-width: fit-content;
}

input {
	font-size: 1em;
	background-color: var(--background-inputs);
	border: 1px solid var(--border);
	color: var(--text);
	margin: 6px 0px;
	padding: 11px;
	border-radius: var(--border-radius);
	max-width: fit-content;
	outline: none;
	display: inline-block;
	appearance: none;
}

input[type="checkbox"],
input[type="radio"] {
	vertical-align: middle;
	position: relative;
	margin-right: 0.33em;
	margin-top: 0.31em;
}

input[type="checkbox"] {
	border-radius: 7px;
}

input[type="radio"] {
	border-radius: 100%;
}

input[type="checkbox"]:checked,
input[type="radio"]:checked {
	border: 1px solid var(--links);
	background: var(--links);
}

input[type="checkbox"]:checked {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3.5' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
}

input[type="radio"]:checked {
	background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='2' fill='%23fff'/%3e%3c/svg%3e");
}

input[type="range"] {
	vertical-align: middle;
	padding: 0;
}

textarea {
	font-family: inherit;
	font-size: 1em;
	background-color: var(--background-inputs);
	border: 1px solid var(--border);
	padding: 11px;
	color: var(--text);
	border-radius: var(--border-radius);
	outline: none;
	/* resize: none;  Todo: research if there is a non-js way to style/move grippie */
	max-width: 100%;
}

select {
	display: inline-block;
	vertical-align: middle;
	font-size: 1rem;
	color: var(--text);
	padding: 0.6em 2em 0.5em 0.8em;
	margin: 6px 0px;
	max-width: fit-content;
	box-sizing: border-box;
	border: 1px solid var(--border);
	box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
	border-radius: 0.5em;
	appearance: none;
	background-color: var(--background-inputs);
	background-image: var(--select-icon-url);
	background-repeat: no-repeat, repeat;
	background-position: right 0.7em top 50%, 0 0;
	background-size: 0.65em auto, 100%;
}

/* Todo: update styles when using multiple mode */
select:is([multiple]) {
	background: none;
	height: fit-content;
}

fieldset:focus-within,
input:focus-within,
textarea:focus-within,
select:focus-within {
	border-color: var(--focus-highlight);
}

fieldset:hover,
input:hover,
textarea:hover,
select:hover {
	border-color: var(--focus-highlight);
}

meter {
	height: 2.2em;
	vertical-align: middle;
}

fieldset {
	border: 1px var(--border) solid;
	border-radius: 6px;
	margin: 0;
	margin-bottom: 6px;
	padding: 10px;
	max-width: fit-content;
}

/* Interactive elements */
details {
	border: 1px solid #aaa;
	border-radius: 7px;
	padding: 0.5em 0.5em 0;
}

summary {
	font-weight: bold;
	margin: -0.5em -0.5em 0;
	padding: 0.5em;
}

details[open] {
	padding: 0.5em;
}

details[open] summary {
	border-bottom: 1px solid #aaa;
	margin-bottom: 0.5em;
}

		
		.ub-loginBox {
	background: var(--background-body);
	width: 450px;
	min-height: 400px;
	height: fit-content;
	border-radius: 30px;
	padding: 50px;
}

body {
	overflow-y: hidden;
}

.ub-validationField {
	height: 60px;
}

.ub-validationImg {
	min-width: 40%;
	height: inherit;
	padding: 6px 0;
	display: block;
	align-self: center;
}

.ub-validationImg > img {
	height: 100%;
	width: 100%;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}

#validation {
	min-width: 60%;
	border-top-right-radius: 0;
	border-bottom-right-radius: 0;
}

.copyright {
	color: var(--text);
	text-align: center;
	font-size: 0.9em;
}

.sidebar li {
	height: 50px;
	width: 100%;
	line-height: 50px;
	text-decoration: none;
	font-size: 1.1em;
	text-align: center;
	font-weight: bolder;
}

.sidebar ul {
	transform: translateY(-40px);
}

.sidebar {
	display: flex;
	flex-direction: column;
	justify-content: center;
}

.sidebar li:hover {
	background-color: var(--background-main);
}

.sidebar li.active {
	background-color: var(--background-body);
}

.sidebar a {
	text-decoration: none;
}

#intereactive {
	width: 100%;
	padding: 20px 30px;
	height: 95vh;
}

iframe,
frame,
frameset {
	border: none;
}

.signout {
	position: absolute;
	bottom: 15;
	left: 0;
	right: 0;
}
.signout button {
	color: rgb(194, 86, 86) !important;
}

main {
	min-width: 72vw;
	max-width: 1400px;
}

.tab-container {
	padding: 4px 2px;
	border: 2px solid var(--border);
	border-radius: 24px;
	overflow-x: hidden;
	scrollbar-width: none; /* Firefox */
	-ms-overflow-style: none; /* Internet Explorer and Microsoft Edge */
}

.tab {
	color: var(--text);
	height: 40px;
	line-height: 40px;
	border-radius: 20px;
	text-align: center;
	overflow: hidden;
	cursor: pointer;
	margin-right: 10px;
	padding: 0 1em;
}

.tab.active {
	background-color: var(--c-themed);
	color: white;
}

.empty-notice {
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
}

#framebody {
	max-height: 100%;
	border: 2px solid var(--border);
	border-radius: 20px;
	overflow: hidden;
	scrollbar-width: none;
}

#peeker {
	position: fixed;
	left: 0;
	height: 100px;
	bottom: 0;
	opacity: .7;
	transform: translateX(-22px);
	transition: transform .3s;
	cursor: grab;
}

#peeker:hover{
	transform: scale(1.2, 1.2);
}

.hider {
	opacity: 0.7;
	margin-top: 100px;
	height: 35vw;
	width: 35vw;
	bottom: 0;
	position: absolute;
}

#neko-warpper {
	width: 35vw;
	height: 100vh;
	position: relative;
}

	`);

	GM_addStyle(`
		/* Box sizing rules */
*,
*::before,
*::after {
	box-sizing: border-box;
}

/* Remove default margin */
body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd {
	margin: 0;
}

/* Remove list styles on ul, ol elements with a list role, which suggests default styling will be removed */
ul[role="list"],
ol[role="list"] {
	list-style: none;
}

ul {
	padding: 0;
}

/* Set core root defaults */
html:focus-within {
	scroll-behavior: smooth;
}

/* Set core body defaults */
body {
	min-height: 100vh;
	text-rendering: optimizeSpeed;
	line-height: 1.5;
}

.darkOnly {
	display: none;
}

@media (prefers-color-scheme: dark) {
	.lightOnly {
		display: none;
	}
	.darkOnly {
		display: unset;
	}
}

/* A elements that don't have a class get default styles */
a:not([class]) {
	text-decoration-skip-ink: auto;
}

/* Make images easier to work with */
img,
picture {
	max-width: 100%;
	display: block;
}

/* Inherit fonts for inputs and buttons */
input,
button,
textarea,
select {
	font: inherit;
}

/* Remove all animations, transitions and smooth scroll for people that prefer not to see them */
@media (prefers-reduced-motion: reduce) {
	html:focus-within {
		scroll-behavior: auto;
	}

	*,
	*::before,
	*::after {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}
}

/**
 * =============================================================================
 * ************   Atomic Css   ************
 * =============================================================================
 */
.Bgc\\(red\\) {
	background: red !important;
}

.Bgc\\(white\\) {
	background: white !important;
}

.Textc\\(secondary\\) {
	color: #8590a6;
}

.Textc\\(primary\\) {
	color: #fff;
}

.Textc\\(primary\\)\\:h :hover {
	color: #fff;
}

.Textc\\(secondary\\)\\:h :hover {
	color: #8590a6;
}

.Texta\\(center\\) {
	text-align: center;
}

.Overf\\(hidden\\) {
	overflow: hidden;
}

.Cur\\(pointer\\) {
	cursor: pointer;
}

.P\\(10px\\) {
	padding: 10px;
}

.P\\(20px\\) {
	padding: 20px;
}

.MTB\\(10px\\) {
	margin-top: 10px;
	margin-bottom: 10px;
}

.Br\\(30px\\) {
	border-radius: 30px;
}

.Br\\(3px\\) {
	border-radius: 3px;
}

.Bra\\(30px\\) {
	border-radius: 30px 30px 0px 0px;
}

.Bru\\(30px\\) {
	border-radius: 0px 0px 30px 30px;
}

.Dis\\(flex\\) {
	display: flex;
}

.JC\\(center\\) {
	justify-content: center;
}

.Pos\\(fixed\\) {
	position: fixed;
}

.FD\\(row\\) {
	flex-direction: row;
}

.FD\\(column\\) {
	flex-direction: column;
}

.H\\(100\\%\\) {
	height: 100%;
}

.W\\(100\\%\\) {
	width: 100%;
}
.MW\\(100\\%\\) {
	min-width: 100%;
}
.MW\\(50\\%\\) {
	min-width: 50%;
}

	`);
}

// ==UserScript==
// @name         URP-Beautifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  URP 教务系统全面美化插件 | Make your URP education system more elegant.
// @author       RiverTwilight
// @match        http://10.28.63.111:9002/*
// @match        http://10.28.63.111:9001/*
// @grant        none
// ==/UserScript==
injectCss();
main();
