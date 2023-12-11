import { ObjectId } from "bson";
import { client } from "../config/mongo.js";

const db = client.db("soccer-scraper-database");
const matchesCollection = db.collection("matches");
const leaguesCollection = db.collection("leagues");

/**
 * Validates the request body for creating a new league.
 *
 * @param reqBody {object} The request body.
 * @returns {array} An array of errors, or an empty array if the request body is valid.
 */
const validateRequestBody = (reqBody) => {
  const errors = [];

  // Validate the league ID.
  if (!reqBody.leagueId) {
    errors.push("leagueId is required");
  }

  // Validate the league name.
  if (!reqBody.leagueName) {
    errors.push("leagueName is required");
  }

  // Validate the league matches array.
  if (!Array.isArray(reqBody.leagueMatches)) {
    errors.push("league matches must be an array");
  }

  return errors;
};

/**
 * Saves the league matches to the database.
 *
 * @param req {object} The request object.
 * @param res {object} The response object.
 */
export const saveMatches = async (req, res) => {
  try {
    // Validate the request body.
    const validationErrors = validateRequestBody(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).send({ errors: validationErrors });
    }

    // Get the league matches and league ID from the request body.
    const { leagueMatches, leagueId, leagueName } = req.body;

    // For each league match, check if it already exists in the database.
    // If it does, delete the existing match before saving the new match.
    for (const match of leagueMatches) {
      const matchExists = await matchesCollection.findOne({
        leagueId,
        homeTeamName: match.homeTeamName,
        awayTeamName: match.awayTeamName,
      });

      if (matchExists) {
        await matchesCollection.deleteOne({
          leagueId,
          homeTeamName: match.homeTeamName,
          awayTeamName: match.awayTeamName,
        });
      }
    }

    // Add the league ID and league name to each league match.
    leagueMatches.forEach((match) => {
      match.leagueId = leagueId;
      match.leagueName = leagueName;
      match.createdAt = Date.now();
    });

    // Save the league matches to the database.
    await matchesCollection.insertMany(leagueMatches);

    // Log a success message to the console.
    console.log(
      `✅ Inserted ${leagueMatches.length} Matches added to the database successfully!`
    );

    // Send a success message to the response.
    res.send(
      `✅ Inserted ${leagueMatches.length} Matches added to the database successfully!`
    );
  } catch (error) {
    // Log the error message to the console.
    console.error(error.message);

    // Send the error message to the response.
    res.status(500).send(error.message);
  }
};

/**
 * Gets the latest round matches for all leagues.
 *
 * @param req {object} The request object.
 * @param res {object} The response object.
 * @returns {object} An object containing the latest round matches for each league.
 */
export const getMatchesByRound = async (req, res) => {
  try {
    // Get all matches from the database.
    const allMatches = await matchesCollection.find({}).toArray();

    // Get the unique league IDs.
    const uniqueLeagueIds = new Set(allMatches.map((item) => item.leagueId));

    // Create a new object to store the sorted matches for each league.
    const sortedMatches = {};

    // Create a new array to store the sorted matches for each league.
    const roundMatches = [];

    // Iterate over the unique league IDs and get the latest round matches for each league.
    for (const uniqueLeagueId of uniqueLeagueIds) {
      const leagueMatches = allMatches.filter(
        (item) => item.leagueId === uniqueLeagueId
      );
      leagueMatches.sort((a, b) => a.matchRoundNumber - b.matchRoundNumber);
      const lowestRoundNumber = Math.min(
        ...leagueMatches.map((item) => item.matchRoundNumber)
      );
      const filteredArray = leagueMatches.filter(
        (item) => item.matchRoundNumber === lowestRoundNumber
      );
      sortedMatches[uniqueLeagueId] = filteredArray;
    }

    roundMatches.push(sortedMatches);

    // Return the sorted matches for all leagues.
    console.log(`✅ latest Round matches sent from the database successfully!`);
    res.send(roundMatches);
  } catch (error) {
    console.error(error.message);
    return [];
  }
};

export const updateMatchesWithTeamUrls = async (req, res) => {
  // Start the timer to track how long the sync operation takes.
  const startTime = new Date().getTime();

  try {
    // Get all matches from the database.
    const matches = await matchesCollection.find({}).toArray();

    // Create an array to store all of the bulk update operations.
    const bulkUpdateOperations = [];

    // Iterate over each match.
    for (const match of matches) {
      // Get the league document for the match.
      const leaguesArray = await leaguesCollection
        .find({
          _id: new ObjectId(match.leagueId),
        })
        .toArray();

      // Declare variables to store the league document, and whether the home and away teams exist in the league.
      let league, hasHomeTeam, hasAwayTeam;

      // If there is a league document, store it and check if the home and away teams exist in the league.
      if (leaguesArray.length > 0) {
        league = leaguesArray[0];
        hasHomeTeam = league.leagueTeams.some(
          (team) => team.teamName === match.homeTeamName
        );
        hasAwayTeam = league.leagueTeams.some(
          (team) => team.teamName === match.awayTeamName
        );
      }

      // If the league document doesn't exist or the home or away team doesn't exist in the league, log a message to the console.
      if (!league || !hasHomeTeam || !hasAwayTeam) {
        console.log(
          `No league document found with _id: ${match.leagueId} or team not found in league`
        );
      } else {
        // Get the team URLs for the home and away teams.
        const homeTeamUrl = league.leagueTeams.find(
          (team) => team.teamName === match.homeTeamName
        ).teamUrl;
        const awayTeamUrl = league.leagueTeams.find(
          (team) => team.teamName === match.awayTeamName
        ).teamUrl;

        // Add a bulk update operation to the array to update the match with the team URLs.
        bulkUpdateOperations.push({
          updateOne: {
            filter: { _id: match._id },
            update: {
              $set: {
                homeTeamUrl: homeTeamUrl,
                awayTeamUrl: awayTeamUrl,
              },
            },
          },
        });
      }
    }

    // Bulk update the matches with the team URLs.
    await matchesCollection.bulkWrite(bulkUpdateOperations);

    // Get all of the updated matches from the database.
    const updatedMatches = await db.collection("matches").find({}).toArray();

    // Calculate the sync time in milliseconds.
    const syncTime = (new Date().getTime() - startTime) * 1000;

    // Format the sync time to two decimal places.
    const formattedSyncTime = syncTime.toFixed(2);

    // Log a message to the console indicating that the sync operation was successful.
    console.log(
      `✅ Synced ${matches.length} matches with team URLs in ${formattedSyncTime} seconds.`
    );

    // Send the updated matches to the client.
    res.send(updatedMatches);
  } catch (err) {
    // Log any errors that occur during the sync operation to the console.
    console.log({ "error message": err.message });
  }
};
