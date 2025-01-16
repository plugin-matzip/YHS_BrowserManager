chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "clearData" && message.domain) {
      const domain = message.domain;
      console.log("domain :: " + domain)
      
      // Clear cache for the specified domain
      chrome.browsingData.remove({
        origins: [`http://${domain}`, `https://${domain}`],
        originTypes: {
          protectedWeb: true
        }
      }, {
        appcache: true,
        cache: true,
        cacheStorage: true,
        cookies: true,
        localStorage: true
      }, () => {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "../images/alarm.png", // Add a valid icon path here
          title: "Data Cleared",
          message: `Data for domain ${domain} has been cleared.`,
        });
        sendResponse({ success: true });
      });
  
      return true; // Indicates asynchronous response
    }
  });
  