chrome.browserAction.onClicked.addListener(function () {
	alert('working?');
	chrome.runtime.openOptionsPage();
});
