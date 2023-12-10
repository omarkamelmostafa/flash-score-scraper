export const pageOptions = {
  // waitUntil: "networkidle0", // Wait for the network to be idle before returning the page.
  waitUntil: "load", // Wait for the page to load before returning the page.
  networkIdleTimeout: 5000, // The maximum amount of time to wait for the network to be idle.
  timeout: 600000, // The maximum amount of time to wait for the page to load.
};

/**
 * Default browser options for Puppeteer.
 *
 * @type {object}
 */
export const browserOptions = {
  headless: false, // Whether to run the browser in headless mode.
  defaultViewport: false, // Whether to use the default viewport size.
  userDataDir: "./tmp", // The directory to store the browser's user data.
  // slowMo: 100, // Slow down the browser by the specified factor.
};

// A list of common referrers to use for web scraping.
const referrers = [
  "https://www.google.com",
  "https://www.facebook.com",
  "https://www.instagram.com",
  "https://www.youtube.com",
  "https://www.amazon.com",
  "https://www.wikipedia.org",
  "https://www.yahoo.com",
  "https://www.twitter.com",
  "https://www.microsoft.com",
  "https://www.apple.com",
  "https://www.netflix.com",
  "https://www.amazon.com",
  "https://www.cnn.com",
  "https://www.bbc.com",
  "https://www.espn.com",
  "https://www.reddit.com",
  "https://www.twitch.tv",
  "https://www.paypal.com",
  "https://www.ebay.com",
  "https://www.etsy.com",
  "https://www.amazon.in",
  "https://www.amazon.co.jp",
  "https://www.amazon.de",
  "https://www.amazon.ca",
  "https://www.amazon.com.au",
  "https://www.espncricinfo.com",
  "https://www.theguardian.com",
  "https://www.washingtonpost.com",
  "https://www.nytimes.com",
  "https://www.bbc.co.uk",
  "https://www.theguardian.com",
  "https://www.reddit.com",
  "https://www.amazon.fr",
  "https://www.amazon.es",
  "https://www.amazon.it",
  "https://www.amazon.mx",
  "https://www.amazon.nl",
  "https://www.amazon.pl",
  "https://www.amazon.se",
  "https://www.amazon.sg",
  "https://www.amazon.com.tr",
  "https://www.amazon.ae",
  "https://www.amazon.sa",
];

/**
 * Gets a random referrer from the list of common referrers.
 *
 * @returns {string} A random referrer URL.
 */
export const randomReferrer =
  referrers[Math.floor(Math.random() * referrers.length)];
