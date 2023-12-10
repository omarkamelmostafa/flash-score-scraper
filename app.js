import { ScraperLeagues } from "./lib/ScraperLeagues.js";
// Scrapes the latest league data from the source website.
import { ScraperMatches } from "./lib/ScraperMatches.js";
// Scrapes the latest match data from the source website.
import { updateMatches } from "./lib/updateMatches.js";
// Updates the match data in the database with the latest information.
import { ScraperStats } from "./lib/ScraperStats.js";
import { emitLogMessage } from "./utils/utils_functions.js";
// Scrapes the latest stats data from the source website.

const main = async () => {
  // Try to scrape the latest data and update the database.
  try {
    emitLogMessage("Starting Flashscore Scraper 😎", "info");
    await ScraperLeagues();
    await ScraperMatches();
    await updateMatches();
    await ScraperStats();
    emitLogMessage("Finished Flashscore Scraper 😎", "success");
  } catch (err) {
    // Log any errors to the console.
    emitLogMessage(`ERROR: ${err.message}`, "error");
  }
};

// Start the main function.
main();
