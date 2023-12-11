import { client } from "../config/mongo.js";

const db = client.db("soccer-scraper-database");
const leaguesCollection = db.collection("leagues");

/**
 * Saves a league to the database.
 *
 * @param {object} league The league object to save.
 * @returns {Promise<void>}
 */
export const saveLeague = async (req, res) => {
  try {
    const league = req.body;

    // Set the createdAt timestamp.
    league.createdAt = Date.now();

    // Check if the league already exists in the database.
    const existingLeague = await leaguesCollection.findOne({
      leagueName: league.leagueName,
    });

    // If the league exists, update it.
    if (existingLeague) {
      // Replace the entire league object, even if some of the fields have not changed.
      await leaguesCollection.replaceOne({ _id: existingLeague._id }, league, {
        upsert: true,
      });

      console.log(
        `🟢 Updated ${league.leagueName} teams in the database successfully!`
      );
      res.send(
        `🟢 Updated ${league.leagueName} teams in the database successfully!`
      );
    }

    // If the league does not exist, insert it into the database.
    else {
      await leaguesCollection.insertOne(league);
      console.log(
        `🟢 Inserted ${league.leagueName} teams to the database successfully!`
      );
      res.send(
        `🟢 Inserted ${league.leagueName} teams to the database successfully!`
      );
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

/**
 * Gets a list of leagues from the database.
 *
 * @param {object} req The request object.
 * @param {object} res The response object.
 * @returns {Promise<void>}
 */
export const getLeagues = async (req, res) => {
  // Try to get the leagues from the database.
  try {
    const leagues = await leaguesCollection.find({}).toArray();

    // Map the leagues to a new array of league metadata objects.
    const leagueMetadata = leagues.map((league) => ({
      leagueId: league._id,
      leagueName: league.leagueName,
      matchesEndpoint: league.matchesEndpoint,
    }));

    // Send the league metadata back to the client.
    res.send(leagueMetadata);
  } catch (error) {
    // If there is an error, log it to the console and send a 500 Internal Server Error response to the client.
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
