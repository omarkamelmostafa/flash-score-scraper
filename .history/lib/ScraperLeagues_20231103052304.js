import {
  generateFileName,
  writeTeamsToExcel,
  writeTeamsToJson,
} from "../utils/data_dumper.js";

import { pageOptions, randomReferrer } from "../utils/options.js";
import { saveLeague } from "../utils/request_utils.js";
import { launchBrowser, closeBrowser } from "../utils/browser_manager.js";
import { addIdToData, emitLogMessage } from "../utils/utils_functions.js";
import { sleep } from "../utils/sleep.js";

/**
 * Scrapes the teams from the given Flashscore league page.
 *
 * @param {Page} page The Puppeteer page to scrape.
 * @returns {Array<{ teamName: string, teamUrl: string }>} An array of teams.
 */

const scrapeTeams = async (page) => {
  // Wait 2 seconds for the page to load.
  await page.waitForTimeout(2000);

  // Wait an additional 3 seconds to ensure that all of the teams are loaded.
  await sleep(3);

  // Scrape the team names and URLs from the page.
  const scrapedTeams = await page.evaluate(() => {
    return [...document.querySelectorAll("a.tableCellParticipant__name")].map(
      (team) => ({
        teamName: team.textContent,
        teamUrl: `https://www.flashscore.com${team.getAttribute("href")}`,
      })
    );
  });

  // Return the scraped teams.
  return scrapedTeams;
};

export const ScraperLeagues = async () => {
  // Emit a log message indicating that the scraper is starting.
  emitLogMessage(`Starting ScraperLeagues()...`, "info");

  try {
    // Create an array of leagues to scrape.
    const leagues = [
      {
        leagueName: "English Premier League",
        leagueUrl: `https://www.flashscore.com/football/england/premier-league/standings/#/I3O5jpB2/table/overall`,
        country: "England",
        sport: "Football",
        numberOfTeams: 20,
        season: "August to May",
        matchesEndpoint:
          "https://www.flashscore.com/football/england/premier-league/fixtures/",
        leagueTeams: [],
      },
      {
        leagueName: "German Bundesliga",
        leagueUrl: `https://www.flashscore.com/football/germany/bundesliga/standings/#/OWq2ju22/table/overall`,
        country: "Germany",
        sport: "Football",
        numberOfTeams: 18,
        season: "August to May",
        matchesEndpoint:
          "https://www.flashscore.com/football/germany/bundesliga/fixtures/",
        leagueTeams: [],
      },
      {
        leagueName: "Australian Football League (AFL)",
        leagueUrl: ``,
        country: "Australia",
        sport: "Football",
        numberOfTeams: 12,
        season: "March to October",
        matchesEndpoint:
          "https://www.flashscore.com/football/germany/bundesliga/fixtures/",
        leagueTeams: [],
      },
    ];

    // Launch a Puppeteer browser.
    const page = await launchBrowser();

    // Iterate over each league and scrape the teams.
    for (const league of leagues) {
      // Set the HTTP referer header to a random website to avoid being blocked by Flashscore.
      await page.setExtraHTTPHeaders({ referer: randomReferrer });

      // Navigate to the league page.
      await page.goto(league.leagueUrl, pageOptions);

      // Scrape the teams from the league page.
      const teamsArray = await scrapeTeams(page);

      // Add the scraped teams to the league's team array.
      teamsArray.forEach((team) => league.leagueTeams.push(team));

      // Save the league's team array to the database, Excel file, and JSON file.
      await saveLeague(league);
    }

    // Close the Puppeteer browser.
    await closeBrowser();

    // Emit a log message indicating that the scraper has finished successfully.
    emitLogMessage(`Finished ScraperLeagues() successfully.`, "info");
  } catch (err) {
    // Emit a log message containing the error message.
    emitLogMessage(`error message: ${err.message}`, "error");
  }
};

// const runScraperTest = async () => {
//   await ScraperLeagues();
// };

// runScraperTest();
