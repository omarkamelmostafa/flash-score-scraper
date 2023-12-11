import express from "express";
import chalk from "chalk";
import { logRequest } from "./middleware/middleware.js";
import { connectToMongo, client } from "./config/mongo.js";
import {
  getMatchesByRound,
  saveMatches,
  updateMatchesWithTeamUrls,
} from "./routes/matches.js";
import { getLeagues, saveLeague } from "./routes/leagues.js";
import { saveStats } from "./routes/stats.js";

// Express server instance.
const app = express();

// Middleware to log all incoming requests.
app.use(express.json());
app.use(logRequest);

// Connect to the MongoDB database.
connectToMongo().catch(console.dir);

// Load the routes.

// **POST** /save-teams
// Saves a list of teams to the database.
app.post("/save-teams", logRequest, saveLeague);

// **GET** /get-leagues
// Gets a list of leagues from the database.
app.get("/get-leagues", logRequest, getLeagues);

// **POST** /save-matches
// Saves a list of matches to the database.
app.post("/save-matches", logRequest, saveMatches);

// **PUT** /update-matches
// Updates a list of matches with home and away team URLs.
app.put("/update-matches", logRequest, updateMatchesWithTeamUrls);

// **GET** /get-round-matches
// Gets a list of matches for the current round.
app.get("/get-round-matches", logRequest, getMatchesByRound);

// **POST** /save-stats
// Saves the stats of the last 10 matches for each match.
app.post("/save-stats", logRequest, saveStats);

// Close the MongoDB connection before exiting the process.
process.on("exit", () => {
  client.close();
});

// Start the server on port 3000.
app.listen(3000, () => {
  console.log(
    chalk.bgYellowBright.bold.redBright` Server listening on port 3000 `
  );
});
