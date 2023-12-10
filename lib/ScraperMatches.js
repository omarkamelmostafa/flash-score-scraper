import {
  generateFileName,
  writeMatchesToExcel,
  writeMatchesToJson,
} from "../utils/data_dumper.js";

import { pageOptions, randomReferrer } from "../utils/options.js";
import { getLeagues, saveMatches } from "../utils/request_utils.js";
import { launchBrowser, closeBrowser } from "../utils/browser_manager.js";
import { addIdToData, emitLogMessage } from "../utils/utils_functions.js";
import { sleep } from "../utils/sleep.js";

const clickShowMore = async (page) => {
  // Try to check firstly the "Show More" button is existed at the page.
  let isInDom;
  // Try to find the "Show More" button on the page.
  let showMoreButton;
  try {
    showMoreButton = await page.waitForSelector("a.event__more");
  } catch (error) {
    // If the button is not found, return.
    return;
  }

  // Check if the button is still in the DOM.
  isInDom = await page.evaluate(
    (element) => document.contains(element),
    showMoreButton
  );

  // While the button is still in the DOM, click it and wait for the page to reload.
  // while (isInDom) {
  await sleep(1);
  await showMoreButton.click();
  await sleep(1);
  isInDom = await page.evaluate(
    (element) => document.contains(element),
    showMoreButton
  );
};

// Scrape the matches from the given page.
// Returns an array of match objects, each containing the home team name, away team name, match date, match hour, and match round number.
const scrapeMatches = async (page) => {
  // Wait for the page to load and click the "Show More" button if it exists.
  await page.waitForTimeout(5000);
  await clickShowMore(page);

  // Get all of the match elements on the page.
  const matchElements = await page.$$("div.event__match");

  // Iterate over each match element and scrape the relevant information.
  const matches = [];
  let matchRoundNumber;
  for (const matchElement of matchElements) {
    // Get the previous element to check if it has the "event__round" class.
    const previousElement = await matchElement.evaluateHandle(
      (element) => element.previousSibling
    );
    const hasRoundClass = await previousElement.evaluate((element) =>
      element.classList.contains("event__round")
    );

    // If the previous element has the "event__round" class, get the round number.
    if (hasRoundClass) {
      matchRoundNumber = await previousElement.evaluate(
        (element) => element.textContent
      );
    }

    // Get the match time element and parse the match date and time.
    const matchTimeElement = await matchElement.$("div.event__time");
    const matchTimeText = await page.evaluate(
      (element) => element.textContent,
      matchTimeElement
    );
    const [matchDate, matchHour] = matchTimeText.split(" ");

    // Get the home team name and away team name elements.
    const homeTeamNameElement = await matchElement.$(
      "div.event__participant--home"
    );
    const awayTeamNameElement = await matchElement.$(
      "div.event__participant--away"
    );

    // Get the home team name and away team name.
    const homeTeamName = await page.evaluate(
      (element) => element.textContent,
      homeTeamNameElement
    );
    const awayTeamName = await page.evaluate(
      (element) => element.textContent,
      awayTeamNameElement
    );

    // Create a match object and add it to the matches array.
    const matchObj = {
      homeTeamName,
      awayTeamName,
      matchDate,
      matchHour,
      matchRoundNumber: parseInt(matchRoundNumber.replace(/Round\s*/i, "")),
    };

    matches.push(matchObj);
  }

  // Return the array of match objects.
  return matches;
};

export const ScraperMatches = async () => {
  // Emit a log message indicating that the scraper is starting.
  emitLogMessage(`Starting ScraperMatches()...`, "info");

  try {
    // Get a list of leagues to scrape.
    const leagues = await getLeagues();

    // Launch a Puppeteer browser.
    const page = await launchBrowser();

    // Create a filename to save the results to.
    const fileName = generateFileName();

    // Iterate over each league and scrape the matches.
    for (const league of leagues) {
      // Set the HTTP referer header to a random website to avoid being blocked by Flashscore.
      await page.setExtraHTTPHeaders({ referer: randomReferrer });

      // Navigate to the league's matches page.
      await page.goto(league.matchesEndpoint, pageOptions);

      // Scrape the matches from the league's matches page.
      const leagueMatches = await scrapeMatches(page);

      // Save the league's matches to the database, Excel file, and JSON file.
      await saveMatches({
        leagueMatches,
        leagueId: league.leagueId,
        leagueName: league.leagueName,
      });
      await writeMatchesToExcel(addIdToData(leagueMatches), league.leagueName);
      await writeMatchesToJson(addIdToData(leagueMatches), league.leagueName);
    }

    // Close the Puppeteer browser.
    await closeBrowser();

    // Emit a log message indicating that the scraper has finished successfully.
    emitLogMessage(`Finished ScraperMatches() successfully.`, "info");
  } catch (err) {
    // Emit a log message containing the error message.
    emitLogMessage(`error message: ${err.message}`, "error");
  }
};

// const runScraperTest = async () => {
//   await ScraperMatches();
// };

// runScraperTest();
