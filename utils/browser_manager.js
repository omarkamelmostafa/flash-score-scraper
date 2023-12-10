import puppeteer from "puppeteer";
import { browserOptions, pageOptions } from "./options.js";
import randUserAgent from "rand-user-agent";
import { sleep } from "./sleep.js";

/**
 * Gets a random user agent from the `rand-user-agent` module.
 *
 * @returns {string} A random user agent string.
 */
export const randomUserAgent = randUserAgent("desktop");

/**
 * Default page options for Puppeteer.
 *
 * @type {object}
 */

// A Puppeteer browser instance.
let browser;

/**
 * Launches a new Puppeteer browser instance.
 *
 * @returns {Promise<Page>} A promise that resolves to the new Puppeteer page.
 */
export const launchBrowser = async () => {
  browser = await puppeteer.launch(browserOptions);
  const page = await browser.newPage();

  // Set a random desktop user agent.
  const userAgent = randUserAgent("desktop");
  await page.setUserAgent(userAgent);

  return page;
};

/**
 * Closes the Puppeteer browser instance.
 */
export const closeBrowser = async () => {
  await browser.close();
};

/**
 * Checks if the Puppeteer browser instance is open and closes it if it is.
 */
export const checkAndCloseBrowser = async () => {
  // Check if the browser is open.
  const isOpen = await browser.isConnected();

  // If the browser is open, close it.
  if (isOpen) {
    await browser.close();
  }
};
