 var userdata = null;
 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    var reg = /oa.corp.56.com/; 
    if( reg.test(tab.url) ) {
        chrome.pageAction.show(tabId);
    }
});

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    // console.log(sender.tab ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    // console.log(request.data);
    //赋值给全局对象
    userdata = request.data;
    chrome.tabs.create({url:chrome.extension.getURL("html/result.html")});
  });