// Get the list of tabs
async function getTabs(): Promise<chrome.tabs.Tab[]> {
	return new Promise((resolve) => {
	chrome.tabs.query({}, (tabs) => resolve(tabs));
	});
}

// Extract the domain from a URL
function extractDomain(url: string): string | null {
	try {
	const parsedUrl = new URL(url);
	return parsedUrl.hostname;
	} catch {
	return null;
	}
}

// Populate the popup with the list of tabs
async function populateTabs() {
	const tabsList = document.getElementById("tabs") as HTMLUListElement;
	const tabs = await getTabs();

	tabs.forEach((tab) => {
	if (tab.url) {
		const domain = extractDomain(tab.url);
		if (domain) {
			const listItem = document.createElement("li");
			const tabInfo = document.createElement("span");
      		tabInfo.textContent = tab.title || domain;
			tabInfo.title = tab.title || domain;
			const clearButton = document.createElement("button");
			clearButton.textContent = "Clear Data";

			listItem.addEventListener("click", () => clearData(domain));			
			listItem.appendChild(tabInfo);
      		listItem.appendChild(clearButton);
			tabsList.appendChild(listItem);
		}
	}
	});
}

// Send a message to clear data for the selected domain
function clearData(domain: string) {
	chrome.runtime.sendMessage({ command: "clearData", domain }, (response) => {
	if (response && response.success) {
		alert(`Data cleared for domain: ${domain}`);
	} else {
		alert("Failed to clear data.");
	}
	});
}

// Initialize the popup
document.addEventListener("DOMContentLoaded", populateTabs);
