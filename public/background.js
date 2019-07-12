

chrome.browserAction.onClicked.addListener( (tab) =>{
	chrome.tabs.create({ 'url': chrome.extension.getURL('index.html') },  (tab) => {

	});
});


chrome.runtime.onConnect.addListener(port => {
	port.onMessage.addListener(message => {
		/* Perform an action if the message meets our criteria */
		if (message.code === "getBookMarks") {
			getBookMarks(port)
		}
	})
});

getBookMarks = (port) => {
	chrome.bookmarks.getTree(function (data) {
		port.postMessage({ bookMarkData: data})
	});
	
}