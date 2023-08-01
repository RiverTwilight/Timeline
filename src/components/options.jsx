import { h, Component, render } from "preact";
import { useState, useEffect } from "preact/hooks";

function Tweet({ tweet }) {
	return (
		<div
			class={`my-4 rounded-xl shadow relative group/item flex overflow-hidden ${
				tweet.bookmarked ? "is-bookmarked" : ""
			}`}
		>
			<a target="_blank" class="w-full" href={tweet.tweetUrl}>
				<div class="bg-white hover:bg-gray-100 cursor-pointer p-4 transition-all group-hover/item:translate-x-[-40px]">
					<div class="flex justify-between">
						<span class="name">{tweet.userName}</span>
						<span class="text-gray-500">
							{formatDate(tweet.tweetTime)}
						</span>
					</div>
					<p class="text-gray-700 mt-1 w-full text-base">
						{tweet.tweetBody}
					</p>
					<div class="flex overflow-x-auto mt-2 gap-1">
						{tweet.tweetImages.length > 0 &&
							tweet.tweetImages.map((img) => (
								<img
									class="rounded-lg object-cover h-32 w-32"
									src={img}
								/>
							))}
					</div>
				</div>
			</a>
			<div class="bg-yellow-300 cursor-pointer transition-all w-[40px] flex flex-col justify-center items-center absolute top-0 bottom-0 right-[-40px] group-hover/item:right-0">
				<button
					onclick={() => toggleBookmark(tweet.tweetUrl)}
					class="h-full"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24"
						viewBox="0 -960 960 960"
						width="24"
						class={`${tweet.bookmarked ? "hidden" : "block"}`}
					>
						<path d="M480-240 200-120v-725h350v60H260v574l220-93 220 93v-334h60v425L480-240ZM260-785h290-290Zm440 180v-90h-90v-60h90v-90h60v90h90v60h-90v90h-60Z" />
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class={`${tweet.bookmarked ? "block" : "hidden"}`}
						height="24"
						viewBox="0 -960 960 960"
						width="24"
					>
						<path d="M850-695H610v-60h240v60ZM480-240 200-120v-725h350v60H260v574l220-93 220 93v-334h60v425L480-240ZM260-785h290-290Z" />
					</svg>
				</button>
			</div>
		</div>
	);
}

function toggleBookmark(tweetUrl) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get("tweets", function (data) {
			let tweets = data.tweets || [];
			let updated = false;
			for (let tweet of tweets) {
				if (tweet.tweetUrl === tweetUrl) {
					tweet.bookmarked = !tweet.bookmarked; // Toggle the bookmark status
					updated = true;

					break;
				}
			}
			if (updated) {
				chrome.storage.local.set({ tweets: tweets }, () => {
					if (chrome.runtime.lastError) {
						reject(chrome.runtime.lastError);
					} else {
						resolve();
					}
				});
			} else {
				resolve();
			}
		});
	});
}

function searchTweets(searchTerm) {
	return new Promise((resolve, reject) => {
		chrome.storage.local.get("tweets", function (data) {
			let tweets = data.tweets || [];
			let results = tweets.filter((tweet) =>
				tweet.tweetBody.toLowerCase().includes(searchTerm.toLowerCase())
			);
			resolve(results);
		});
	});
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

// navLinks.forEach(function (link) {
// 	link.addEventListener("click", function (event) {
// 		event.preventDefault();

// 		navLinks.forEach(function (innerLink) {
// 			innerLink.classList.remove("active");
// 		});

// 		this.classList.add("active");

// 		var id = this.getAttribute("href").substring(1);

// 		var sections = document.querySelectorAll("main > section");
// 		sections.forEach(function (section) {
// 			section.style.display = "none";
// 		});

// 		var sectionToShow = document.getElementById(id);
// 		if (sectionToShow) {
// 			sectionToShow.style.display = "block";
// 		}
// 	});
// });

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

function Header() {
	return (
		<header class="z-10 backdrop-blur pr-[70px] py-1 sticky left-0 right-0 top-0">
			<div class="container mx-auto flex justify-between items-center">
				<h1 class="font-bold text-xl flex items-center gap-2">
					<img
						height="16"
						src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAQAAAD/5HvMAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfnCAEEAgfkAvLDAAAF6klEQVRo3u2Za2wUVRTHf7vtstutCN0CLUJTeaiASKUQCDSUkogaBDQl+IVEwSqh+NZqkPBBQHkEDcRPBqQEEhoSEx5CyiMKaFQKCGik4VGQh33QBy3Qx7Zsd68fvF1mZmd2Z3YX+LL/+2Vm7p0z/3vm3HPuPQcSSCCBBB4ubHGS4iAZO4JufAQeFiEbfRjCSAaRRQa9cRCgg5tUU0sVF6mn+8ER6ksu+RQwgnSSQ3oFrVyjgsNUcD02jZnBQOZziFsEEBFaF2dZSY4O5bhpqA+zWcxYnMEnflppxks7Puy4SeFR0hT9AWooYzOXEPEmZCeXpbxIirz3cpXjHKOSOjrpwo+NXjhJ4wnGk8co0qT8AOf4iu9pj+ePSuEt/gn+jCZ2MIdsHIYT9ZDHKs7TLd9oYyPZ8aPjYR2tUvQdtpGP25ROh7OES9LaAhxhfHzoZFLKXSm0gjmmyNwjlUMp7XIyf1EQO53+bMGPQOBlE8OikJDKIq5JSpVMiY3OI3wj7eAWy+gdpRQbz/OnpHSKMdHTSeIjvAgELbxPr5imNpE/JKVyBkYrZDo1co18ariizGMylQgE3ayJbnKZHJECNgS9T2yYxQ0EgmZmWX/ZxlJpPQfJjAsdSOITuhAIjliXOYILCAS1TDMxOoPXyMUecVw6exEI7vK2NTp2vpQmuIakCGMdvMCPdHGZEtIjSi6gHoHgBIOsEBrKOQSC84yMMHIIX9MQjO/7eS5CdHeyUeqoyAqhIumbV4Qd5WYeJ6Xb7Gk3WMPjYd+aJE17N6lm6aSyRwqfaDjGxrNsCUY4ZfNTwathAoybXQgE9UwwS2g0/yIQ7DQUm867VIXZnN1hE88Ybm/ekPovMUtoLp0I/CzW7XVQwD65fI1bgAsU49GV8JTcymw3625Xy3ChFwizWCltIHLr5AfydIw8lQMIBGfMeSMXu2VkHhzSU0hFcNNlrtWyXCd2rUcgaGCcGUIDOCWDoNaChvG3wWe9NNOqWW/39LQg5BuLCCDo5BX1Y32P0Zs0AGro1PRcZTd26pim8sld7GEHN3AzhTc17u4CNSRxOOQb1XThwkGGGQ3lSBtZpdPXn+EsVh2BfKylj+y18xLXVdrZTzZP6qy2ybQgECwx1pCbAdgBP0PkMcZFtgwbzdySoxppZLpKxnE2cFteByjnOz5XELDRSIfOxDrxAWh3EUpCT/MtHgKAk0cBeJ2XARs+llNmqM+D1CnuBOW8Q38zP0IPSkJn+YkPVH7BgwcQlHHIUIKgXvOkmTYThFzySxorVZqml9WU6Zwv97GEJkPBtpDTVmbQosLBgwsI0GxMCFpYxgHNiz9TQnVY0TMYqrhLptDAO6sxGCfgC9FvCEZzUrFGTjNWZ0yxapUFKA06PicLaFKtsgMG0dCCYyzgkhR2kXzdEcWazIePX/mQGcxjm1zMkQhZDB1zaUBQzUyD/mKdVIyfDhnBzRAyDK76nnoX6RSxnnIz7CXsls4leTJKnpHeKAKhbjazk5uGua9YM5NuZuEAGvhF22W0+/XREEagldyhX8eR5DAJgGNUarsiH1v0UEWL6bGVIQHayXwyAB9745XCSmEdHSZ2QgF+0zmzTA0egwaHiraQjlTAywpOMiHC+VxwjT1c1jz18DEDAB9bIzjcBwI7JXIvfjRux/OYMJO66JMNSmQxDVfMdHrSMX7WKhLHltGPhRyngfdiTlj1RMkYElYARbTxf0pvaQwpvenBlN5pcmKaGBlsDSY9N6q2GmaRykKu0pP0zI9CggaZbFGkhQstpoXHsDm+aWFQJ85vs5UppkKpnWH3J3EOkMJCrgR9cCM7KCQrTGkhjUms4pyitLDJTGnBWvFlHJ+pii9XOMExKqmlHT9+bCTTi36y+DISj/Xii9WNRF9mU0yuwgH4aaWJNu7iw44TFx5VeUpQw3ZKqcJUeSoaPMYCDnHbZAHvC8bezwLePU2NI5+pEUqcR/ndaokz9iLwKLLJVBWBa6nj/IMuAmulxK1MnkACCSTwsPEfF/n4ctIyymwAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDgtMDFUMDQ6MDI6MDQrMDA6MDCiLtkeAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA4LTAxVDA0OjAyOjA0KzAwOjAw03NhogAAABJ0RVh0ZXhpZjpFeGlmT2Zmc2V0ADI2UxuiZQAAABl0RVh0ZXhpZjpQaXhlbFhEaW1lbnNpb24AMTAyNPLFVh8AAAAZdEVYdGV4aWY6UGl4ZWxZRGltZW5zaW9uADEwMjRLPo33AAAAIHRFWHRzb2Z0d2FyZQBodHRwczovL2ltYWdlbWFnaWNrLm9yZ7zPHZ0AAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADE5MkBdcVUAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMTky06whCAAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNjkwODYyNTI058q/fgAAAA90RVh0VGh1bWI6OlNpemUAMEJClKI+7AAAAFZ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL21udGxvZy9mYXZpY29ucy8yMDIzLTA4LTAxLzQ1NzYyZDZkY2Q2YmM2ZmE2MWMzNTYwOTNkZDNkNjA1Lmljby5wbmdCGETuAAAAAElFTkSuQmCC"
					/>
					Timeline - X(Twitter) History
				</h1>
				<div>
					<a
						href="https://github.com/RiverTwilight/Timeline"
						class="ml-2 text-gray-500"
					>
						Github
					</a>
				</div>
			</div>
		</header>
	);
}

function App() {
	const [tweet, setTweet] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [activeTab, setActiveTab] = useState("History");

	const fetchTweets = () => {
		chrome.storage.local.get("tweets", (data) => {
			let fetchedTweets = data.tweets || [];
			fetchedTweets.sort(
				(a, b) => new Date(b.captureDate) - new Date(a.captureDate)
			);
			setTweet(fetchedTweets);
		});
	};

	// Handle search term changes
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	// Search for tweets when search term changes
	useEffect(() => {
		if (searchTerm) {
			searchTweets(searchTerm).then((results) => {
				setSearchResults(results);
			});
		} else {
			setSearchResults([]);
		}
	}, [searchTerm]);

	useEffect(() => {
		fetchTweets();

		const handleStorageChange = (changes) => {
			for (let key in changes) {
				if (key === "tweets") {
					fetchTweets(); // refetch the tweets
				}
			}
		};

		chrome.storage.onChanged.addListener(handleStorageChange);

		// Cleanup: remove event listener
		return () =>
			chrome.storage.onChanged.removeListener(handleStorageChange);
	}, []);

	return (
		<div class="relative min-w-[500px] max-w-[800px]">
			<Header />
			<div class="relative container mx-auto flex">
				<aside class="w-48 sticky pt-5 h-screen px-4 left-0 bottom-0 top-[74px] overflow-hidden">
					<nav>
						<a
							onClick={() => setActiveTab("History")}
							class={`${
								activeTab == "History" ? "active" : ""
							} text-lg text-gray-600 cursor-pointer font-semibold block mb-2 py-2 px-4 rounded-md hover:bg-gray-200`}
						>
							History
						</a>
						<a
							onClick={() => setActiveTab("Favorite")}
							class={`${
								activeTab == "Favorite" ? "active" : ""
							} text-lg text-gray-600 cursor-pointer font-semibold block mb-2 py-2 px-4 rounded-md hover:bg-gray-200`}
						>
							Favorite
						</a>
					</nav>
				</aside>
				<main class="flex-1 px-4 rounded min-w-[550px] overflow-hidden w-full">
					{searchTerm.length == 0 && (
						<section>
							{tweet
								.filter((t) => {
									return (
										(t.bookmarked &&
											activeTab == "Favorite") ||
										activeTab != "Favorite"
									);
								})
								.map((t) => {
									return <Tweet tweet={t} />;
								})}
							<p className="text-gray-500">
								Total: {tweet.length}/100
							</p>
						</section>
					)}
					{searchTerm.length > 0 && (
						<section>
							{searchResults
								.filter((t) => {
									return (
										(t.bookmarked &&
											activeTab == "Favorite") ||
										activeTab != "Favorite"
									);
								})
								.map((t) => {
									return <Tweet tweet={t} />;
								})}
						</section>
					)}
					<section id="result" style="display: none"></section>
				</main>
				<div class="w-48 sticky h-screen flex flex-col right-0 bottom-0 top-[74px] mt-3 overflow-visible">
					<div class="group w-full flex items-center relative">
						<button
							class="bg-white transition-all h-12 w-12 mt-2 bg-red shadow rounded-full flex justify-center items-center overflow-hidden group-hover:w-full group-hover:justify-start"
							aria-label="Search"
							title="Search"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 -960 960 960"
								class="group-hover:ml-3"
								width="24"
							>
								<path d="M796-121 533-384q-30 26-69.959 40.5T378-329q-108.162 0-183.081-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l264 262-44 44ZM377-389q81.25 0 138.125-57.5T572-585q0-81-56.875-138.5T377-781q-82.083 0-139.542 57.5Q180-666 180-585t57.458 138.5Q294.917-389 377-389Z" />
							</svg>
						</button>

						<input
							id="searchInput"
							type="text"
							value={searchTerm}
							onInput={handleSearchChange}
							placeholder="Search"
							class="translate-y-[4px] translate-x-[-4px] p-0 rounded-md h-8 w-14 absolute left-12 opacity-0 group-hover:opacity-100"
						/>
					</div>
					<div class="group w-full flex items-center relative">
						<button
							class="bg-white transition-all h-12 w-12 mt-2 bg-red shadow rounded-full flex justify-center items-center overflow-hidden group-hover:w-full group-hover:justify-start"
							id="refreshBtn"
							aria-label="Refresh"
							title="Refresh"
							onClick={fetchTweets}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 -960 960 960"
								class="group-hover:ml-3"
								width="24"
							>
								<path d="M480-160q-133 0-226.5-93.5T160-480q0-133 93.5-226.5T480-800q85 0 149 34.5T740-671v-99q0-13 8.5-21.5T770-800q13 0 21.5 8.5T800-770v194q0 13-8.5 21.5T770-546H576q-13 0-21.5-8.5T546-576q0-13 8.5-21.5T576-606h138q-38-60-97-97t-137-37q-109 0-184.5 75.5T220-480q0 109 75.5 184.5T480-220q75 0 140-39.5T717-366q5-11 16.5-16.5t22.5-.5q12 5 16 16.5t-1 23.5q-39 84-117.5 133.5T480-160Z" />
							</svg>
						</button>
						<span class="cursor-pointer translate-y-[4px] absolute left-12 opacity-0 group-hover:opacity-100">
							Refresh
						</span>
					</div>
					<div class="group w-full flex items-center relative">
						<button
							onClick={clearTweets}
							class="bg-white transition-all h-12 w-12 mt-2 bg-red shadow rounded-full flex justify-center items-center overflow-hidden group-hover:w-full group-hover:justify-start"
							id="clearBtn"
							title="Clear"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								height="24"
								viewBox="0 -960 960 960"
								width="24"
								class="group-hover:ml-3"
							>
								<path
									fill="rgb(239, 68, 68)"
									d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-11q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T190-810h158q0-13 8.625-21.5T378-840h204q12.75 0 21.375 8.625T612-810h158q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T770-750h-11v570q0 24.75-17.625 42.375T699-120H261Zm438-630H261v570h438v-570Zm-438 0v570-570Zm219 330 96 97q10 10 24 10.5t24-10q10-10.5 10-24T624-370l-96-98 96-98q10-10 10-23.5T624-613q-10-10-24-10t-24 10l-96 97-95-97q-10-10-24-10t-24 10q-10 10-10 24t10 24l96 97-96 97q-10 10-10 24t10 24q10 10 24 10t24-10l95-97Z"
								/>
							</svg>
						</button>
						<span class="text-red-500 cursor-pointer translate-y-[4px] absolute left-12 opacity-0 group-hover:opacity-100">
							Clear
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

// Render the App into the DOM
render(<App />, document.body);
