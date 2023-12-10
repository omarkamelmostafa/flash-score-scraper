import { writeStatsToJson, writeStatsToExcel } from "../utils/data_dumper.js";
import { pageOptions, randomReferrer } from "../utils/options.js";
import {
  launchBrowser,
  closeBrowser,
  checkAndCloseBrowser,
} from "../utils/browser_manager.js";
import { sleep } from "../utils/sleep.js";
import { addIdToData, emitLogMessage } from "../utils/utils_functions.js";
import { getMatchesByRound, saveStats } from "../utils/request_utils.js";
import chalk from "chalk";

// Get a list of match IDs for the given league round.
// Returns an array of objects, each containing the match ID, league ID, home team name,
// away team name, home team prior match IDs, and away team prior match IDs.
const getMatchIdsForLeagueRound = async (matches) => {
  // Emit a log message indicating that the function is starting.
  emitLogMessage(`Starting getMatchIdsForLeagueRound()...`, "info");

  try {
    // Create an empty array to store the match IDs.
    let matchIds = [];

    // Launch a Puppeteer browser.
    const page = await launchBrowser();

    // Iterate over each match and get its prior match IDs.
    for (const match of matches) {
      // Get the URLs of the home and away teams' results pages.
      const pageHomeUrl = `${match.homeTeamUrl.toString()}results`;
      const pageAwayUrl = `${match.awayTeamUrl.toString()}results`;

      // Set the HTTP referer header to a random website to avoid being blocked by Flashscore.
      await page.setExtraHTTPHeaders({ referer: randomReferrer });

      // Navigate to the home team's results page.
      await page.goto(pageHomeUrl, pageOptions);

      // Wait for the page to load.
      await sleep(1);

      // Evaluate JavaScript code on the page to get the home team's prior match IDs.
      const homeTeamPriorMatchIds = await page.evaluate(() => {
        // Get a list of all of the prior match elements on the page.
        const priorMatchesIds = [
          ...document.querySelectorAll("div.event__match"),
        ];

        // Slice the list to the first 10 matches.
        const priorMatchesIdsSliced = priorMatchesIds.slice(0, 10);

        // Map the prior match elements to their IDs.
        const priorMatchIdsMapped = priorMatchesIdsSliced.map((priorMatch) =>
          priorMatch.getAttribute("id").substring(4)
        );

        // Return the list of prior match IDs.
        return priorMatchIdsMapped;
      });

      // Set the HTTP referer header to a random website to avoid being blocked by Flashscore.
      await page.setExtraHTTPHeaders({ referer: randomReferrer });

      // Navigate to the away team's results page.
      await page.goto(pageAwayUrl, pageOptions);

      // Wait for the page to load.
      await sleep(1);

      // Evaluate JavaScript code on the page to get the away team's prior match IDs.
      const awayTeamPriorMatchIds = await page.evaluate(() => {
        // Get a list of all of the prior match elements on the page.
        const priorMatchesIds = [
          ...document.querySelectorAll("div.event__match"),
        ];

        // Slice the list to the first 10 matches.
        const priorMatchesIdsSliced = priorMatchesIds.slice(0, );

        // Map the prior match elements to their IDs.
        const priorMatchIdsMapped = priorMatchesIdsSliced.map((priorMatch) =>
          priorMatch.getAttribute("id").substring(4)
        );

        // Return the list of prior match IDs.
        return priorMatchIdsMapped;
      });

      // Add the match ID, league ID, home team name, away team name, home team prior match IDs,
      // and away team prior match IDs to the `matchIds` array.
      matchIds.push({
        matchId: match._id,
        leagueId: match.leagueId,
        homeTeamName: match.homeTeamName,
        awayTeamName: match.awayTeamName,
        homeTeamPriorMatchIds,
        awayTeamPriorMatchIds,
      });
    }

    // Close the Puppeteer browser.
    await closeBrowser();

    // Emit a log message indicating that the function has finished successfully.
    emitLogMessage(
      `Finished getMatchIdsForLeagueRound() successfully.`,
      "info"
    );

    // Return the array of match ID objects.
    return matchIds;
  } catch (err) {
    // Emit a log message containing the error message.
    emitLogMessage(`error message: ${err.message}`, "error");
  }
};

// Scrape the match IDs for the current league round.
// Returns an array of match ID objects.
const scrapeMatchIdsForLeagueRound = async () => {
  // Emit a log message indicating that the function is starting.
  emitLogMessage(`Starting scrapeMatchIds()...`, "info");

  // Get the matches for the current league round.
  const currentRoundMatches = await getMatchesByRound();

  // Create an empty array to store all of the matches for the current league round.
  let allMatches = [];

  // Iterate over the matches for the current league round and add them to the `allMatches` array.
  currentRoundMatches.forEach((obj) => {
    for (const [leagueId, matches] of Object.entries(obj)) {
      allMatches.push(...matches);
    }
  });

  // Get the match IDs for the matches in the current league round.
  const matchIds = await getMatchIdsForLeagueRound(allMatches);

  // Emit a log message indicating that the function has finished successfully.
  emitLogMessage(`Finished scrapeMatchIds() successfully.`, "info");

  // Return the array of match ID objects.
  return matchIds;
};

let page;
const getMatchStats = async (matchId, teamName) => {
  // Try to get the match statistics.
  try {
    // Emit a log message indicating that the function is starting.
    emitLogMessage(`Starting getMatchStats()...`, "info");

    // Launch a Puppeteer browser if necessary.
    if (!page) {
      page = await launchBrowser();
    }

    // Navigate to the match statistics page for the given match ID.
    const url = `https://www.flashscore.com/match/${matchId}/#/match-summary/match-statistics/0`;
    await page.setExtraHTTPHeaders({ referer: randomReferrer });
    await page.goto(url, pageOptions);
    await sleep(2);

    // Get the home team and away team names from the page.
    const homeTeamElement = await page.$("div.duelParticipant__home");
    const homeTeamName = await homeTeamElement.evaluate(
      (element) => element.textContent
    );

    const awayTeamElement = await page.$("div.duelParticipant__away");
    const awayTeamName = await awayTeamElement.evaluate(
      (element) => element.textContent
    );

    // Get a list of all of the stat divs on the page.
    const statDivs = await page.$$("div._categoryName_11si3_5");

    // Create an object to store the match statistics.
    const stats = {};

    // Iterate over the stat divs and extract the stat name and value for each stat.
    for (const statDiv of statDivs) {
      // Get the stat text.
      const statText = await statDiv.evaluate((div) => div.textContent.trim());

      // Edit the stat text if it is "Expected Goals".
      const editedStatText = statText.includes("Expected Goals")
        ? "Expected Goals"
        : statText;

      // Get the previous and next sibling divs.
      const previousDiv = await statDiv.evaluateHandle(
        (div) => div.previousSibling
      );
      const nextDiv = await statDiv.evaluateHandle((div) => div.nextSibling);

      // Get the content of the previous and next sibling divs.
      const previousDivContent = await previousDiv.evaluate(
        (element) => element.textContent
      );
      const nextDivContent = await nextDiv.evaluate(
        (element) => element.textContent
      );

      // Add the stat value to the stats object, depending on the team name.
      if (!stats[editedStatText]) {
        stats[editedStatText] = [];
      }

      if (homeTeamName === teamName) {
        stats[editedStatText].push(previousDivContent);
      } else {
        stats[editedStatText].push(nextDivContent);
      }
    }

    // Emit a log message indicating that the function has finished successfully.
    emitLogMessage(`Finished getMatchStats() successfully.`, "info");

    // Return the match statistics object.
    return stats;
  } catch (err) {
    // Emit a log message containing the error message.
    emitLogMessage(`error message: ${err.message}`, "error");
  }
};

export const ScraperStats = async () => {
  // **Emit a log message indicating that the scraper is starting.**
  emitLogMessage(`Starting ScraperStats()...`, "info");

  // **Get a list of fixture IDs for the current league round.**
  const fixtureIds = await scrapeMatchIdsForLeagueRound();

  try {
    // **Iterate over the fixture IDs and scrape the match stats for each fixture.**
    for (const match of fixtureIds) {
      // **Create an empty array to store the aggregated match stats.**
      const aggregatedStats = {
        matchId: match.matchId,
        leagueId: match.leagueId,
        homeTeamName: match.homeTeamName,
        awayTeamName: match.awayTeamName,
        homeTeamPriorMatchStats: {},
        awayTeamPriorMatchStats: {},
      };

      // **Scrape the match stats for the home team's prior matches.**
      for (const matchId of match.homeTeamPriorMatchIds) {
        const priorMatchStats = await getMatchStats(
          matchId,
          match.homeTeamName
        );

        // **Aggregate the match stats for the home team's prior matches.**
        for (const statText in priorMatchStats) {
          if (!aggregatedStats.homeTeamPriorMatchStats[statText]) {
            aggregatedStats.homeTeamPriorMatchStats[statText] = [];
          }

          aggregatedStats.homeTeamPriorMatchStats[statText].push(
            ...priorMatchStats[statText].flat()
          );
        }
      }

      // **Scrape the match stats for the away team's prior matches.**
      for (const matchId of match.awayTeamPriorMatchIds) {
        const priorMatchStats = await getMatchStats(
          matchId,
          match.awayTeamName
        );

        // **Aggregate the match stats for the away team's prior matches.**
        for (const key in priorMatchStats) {
          if (!aggregatedStats.awayTeamPriorMatchStats[key]) {
            aggregatedStats.awayTeamPriorMatchStats[key] = [];
          }

          aggregatedStats.awayTeamPriorMatchStats[key].push(
            ...priorMatchStats[key].flat()
          );
        }
      }

      // **Save the aggregated match stats to the database.**
      await saveStats(aggregatedStats);

      // **Write the aggregated match stats to an Excel file.**
      const aggregatedStatsArray = [];
      aggregatedStatsArray.push(aggregatedStats);
      writeStatsToExcel(
        addIdToData(aggregatedStatsArray),
        `${aggregatedStats.homeTeamName} - ${aggregatedStats.awayTeamName}`
      );

      // **Write the aggregated match stats to Json file.**
      writeStatsToJson(
        addIdToData(aggregatedStatsArray),
        `${aggregatedStats.homeTeamName} - ${aggregatedStats.awayTeamName}`
      );
    }
    // **Close the browser if it is still open.**
    await checkAndCloseBrowser();
  } catch (err) {
    // **Emit a log message containing the error message.**
    emitLogMessage(`error message: ${err.message}`, "error");
  }
};

// const runTest = async () => {
//   const data = await ScraperStats();
//   // console.log(data);
// };

// runTest();
