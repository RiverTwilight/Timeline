// inject css to webpage

function injectStyle(sheets) {
	sheets.forEach((css) => {
		let style = document.createElement("style");
		style.type = "text/css";
		style.innerHTML = css;
		document.head.appendChild(style);
	});
}
