import fs from "fs";

const rawConfig = {
	name: "Timeline - X History",
	manifest_version: 3,
	version: "1.1",
	icons: {
		16: "./icon/android-icon-36x36.png",
		48: "./icon/android-icon-48x48.png",
		128: "./icon/icon-128.png",
	},
	options_page: "options.html",
	permissions: ["storage"],
	content_scripts: [
		{
			matches: ["*://*.twitter.com/*"],
			all_frames: true,
			js: ["content.bundle.cjs.js"],
		},
	],
	background: {
		service_worker: "background.js",
	},
	action: {
		default_icon: {
			16: "./icon/android-icon-36x36.png",
			48: "./icon/android-icon-48x48.png",
		},
	},
};

const MATCHES = ["*://*.twitter.com/*"];

rawConfig["content_scripts"].forEach((script) => {
	script.matches = MATCHES;
});

// rawConfig["web_accessible_resources"].forEach((script) => {
// 	script.matches = MATCHES;
// });

// rawConfig["host_permissions"] = MATCHES;

fs.writeFileSync("./dist/manifest.json", JSON.stringify(rawConfig));

// const rawBoltCss = fs.readFileSync("./dist/css/bolt.css", "utf-8");
// const rawMainCss = fs.readFileSync("./dist/css/main.css", "utf-8");
// const rawGloabalCss = fs.readFileSync("./dist/css/global.css", "utf-8");

// const injectScript = `

// function GM_addStyle(css) {
//     var head, style;
//     head = document.getElementsByTagName('head')[0];
//     if (!head) { return; }
//     style = document.createElement('style');
//     style.type = 'text/css';
//     style.innerHTML = css;
//     head.appendChild(style);
// }

// export default function injectCss() {
// 	GM_addStyle(\`

// 		${rawBoltCss}

// 		${rawMainCss}
// 	\`);

// 	GM_addStyle(\`
// 		${rawGloabalCss.replace(/\\/g, "\\\\")}
// 	\`);
// }
// `;

// fs.writeFileSync("./tampermonkey/injectCss.js", injectScript);
