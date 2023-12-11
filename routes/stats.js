import { client } from "../config/mongo.js";

const db = client.db("soccer-scraper-database");
const statsCollection = db.collection("stats");

/**
 * Saves the given stats object to the database.
 *
 * @param {object} stats The stats object to save.
 * @param {Request} req The incoming request.
 * @param {Response} res The outgoing response.
 */
export const saveStats = async (req, res) => {
  try {
    const stats = req.body;

    // Set the createdAt timestamp.
    stats.createdAt = Date.now();

    // Check if the document already exists.
    const existingMatch = await statsCollection.findOne({
      matchId: stats.matchId,
    });

    // If the document exists, replace it.
    if (existingMatch) {
      await statsCollection.replaceOne({ matchId: stats.matchId }, stats);
      console.log(
        `✅ Updated ${stats.homeTeamName} | ${stats.awayTeamName} stats in the database successfully!`
      );
      res.send(
        `✅ Updated ${stats.homeTeamName} | ${stats.awayTeamName} stats in the database successfully!`
      );
      return;
    }

    // If the document does not exist, insert it.
    await statsCollection.insertOne(stats);
    console.log(
      `✅ Inserted ${stats.homeTeamName} | ${stats.awayTeamName} stats added to the database successfully!`
    );
    res.send(
      `✅ Inserted ${stats.homeTeamName} | ${stats.awayTeamName} stats added to the database successfully!`
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};
