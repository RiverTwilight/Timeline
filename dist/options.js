// function to create HTML for a tweet
function createTweetHTML(tweet) {
	return `
	<a target="_blank" href="${tweet.tweetUrl}"> 
		<div class="bg-white hover:bg-gray-100 cursor-pointer p-4 my-4 rounded-xl shadow">
			<div class="flex justify-between">
				<span class="name">${tweet.userName}</span>
				<span class="text-gray-500">${formatDate(tweet.tweetTime)}</span>
			</div>
			<p class="text-gray-700 mt-1 text-base">${tweet.tweetBody}</p>
		</div>
	</a>
    `;
}
function clearTweets() {
	chrome.storage.local.remove("tweets", function () {
		var error = chrome.runtime.lastError;
		if (error) {
			console.error(error);
		} else {
			console.log("Tweets cleared successfully");
		}
	});
}

const navLinks = document.querySelectorAll("nav a");
const refreshBtn = document.getElementById("refreshBtn");
const clearBtn = document.getElementById("clearBtn");

refreshBtn.addEventListener("click", displayHistory);
clearBtn.addEventListener("click", () => {
	clearTweets();
	displayHistory();
});

navLinks.forEach(function (link) {
	link.addEventListener("click", function (event) {
		event.preventDefault();

		navLinks.forEach(function (innerLink) {
			innerLink.classList.remove("active");
		});

		this.classList.add("active");

		var id = this.getAttribute("href").substring(1);

		var sections = document.querySelectorAll("main > section");
		sections.forEach(function (section) {
			section.style.display = "none";
		});

		var sectionToShow = document.getElementById(id);
		if (sectionToShow) {
			sectionToShow.style.display = "block";
		}
	});
});

function formatDate(isoString) {
	const date = new Date(isoString);

	// You can adjust the format as you like
	const year = date.getFullYear();
	const month = ("0" + (date.getMonth() + 1)).slice(-2); // months are zero-indexed in JS
	const day = ("0" + date.getDate()).slice(-2);
	const hour = ("0" + date.getHours()).slice(-2);
	const minute = ("0" + date.getMinutes()).slice(-2);

	return `${month}/${day}/${year} ${hour}:${minute}`;
}

// function to load and display the tweet history
function displayHistory() {
	chrome.storage.local.get("tweets", function (data) {
		let tweetHistory = document.getElementById("twitter");
		let tweets = data.tweets || [];
		// Sort tweets by captureDate
		tweets.sort(
			(a, b) => new Date(b.captureDate) - new Date(a.captureDate)
		);
		tweetHistory.innerHTML = tweets.map(createTweetHTML).join("");
	});
}

displayHistory();
