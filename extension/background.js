let urls = [];

chrome.webRequest.onBeforeRequest.addListener(
  (info) => {
    const { url } = info;

    if (
      url.indexOf(".mpd") !== -1 ||
      url.indexOf(".m3u8") !== -1 ||
      url.indexOf(".hls") !== -1 ||
      url.indexOf(".mp4") !== -1
    ) {
      urls.push(url);
    }
  },
  { urls: ["<all_urls>"] }
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "getUrls") {
    sendResponse({ urls });
  }
  if (request.type === "clearUrls") {
    urls = [];
    sendResponse({ urls });
  }
});
