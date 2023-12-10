/**
 * Configuration module for the MongoDB database connection.
 */

import { MongoClient } from "mongodb";
import { emitLogMessage } from "../utils/utils_functions.js";

// Create configuration object for Mongo instance.
const mongoConfig = {
  host: "localhost",
  port: 27017,
  user: "iomarkamel",
  password: "i2lUsAqoUe9HGfEy",
  database: "soccer-scraper-database",
};

// Construct the connection string.
const connectionString =
  // process.env.MONGODB_URL ||
  // `mongodb+srv://iomarkamel:i2lUsAqoUe9HGfEy@cluster0.rld2sga.mongodb.net/soccer-scraper-database`;
// `mongodb://127.0.0.1:27017/soccer-scraper-database`;

// Create a new MongoClient instance.
export const client = new MongoClient(connectionString);

// Export a function to connect to the MongoDB database.
export async function connectToMongo() {
  // Try to connect to the database.
  await client
    .connect()

    .then(() => emitLogMessage("Connected to MongoDB!", "success"))
    .catch((err) =>
      emitLogMessage(
        `Error while connecting to database: ${err.message}`,
        "error"
      )
    );
}
