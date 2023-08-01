function getImage(url) {
	if (
		typeof chrome !== "undefined" &&
		chrome.runtime &&
		chrome.runtime.getURL
	) {
		return chrome.runtime.getURL(url);
	} else if (typeof GM !== "undefined" && GM.info) {
		return {
			"/img/logo_landscape_light.png": "",
			"/img/hide.webp": "https://i.ibb.co/R71J7h8/hide.webp",
			"/img/look.webp": "https://i.ibb.co/d6y0Zpb/look.webp",
			"/img/peek.webp": "https://i.ibb.co/F3t4z90/peek.webp",
			"/img/sticker.webp": "https://i.ibb.co/F3t4z90/sticker.webp",
			"/img/logo_landscape_dark.png":
				"https://i.ibb.co/p0z8x8D/logo-landscape-dark.png",
			"/img/logo_landscape_light.png":
				"https://i.ibb.co/4S7Kt93/logo-landscape-light.png",
		}[url];
	} else {
		throw new Error("Unsupported environment");
	}
}

export default getImage;
