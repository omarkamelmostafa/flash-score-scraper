/**
 * Mongoose schema for the Matches collection.
 *
 * Stores information about matches, such as the match round number, hour, date, home team name, URL, and ID, away team name, URL, and ID, the league name, and league ID.
 *
 * Also stores a createdAt timestamp to track when each match record was created.
 */
import { Schema, model } from "mongoose";

const matchesSchema = new Schema({
  matchRoundNumber: {
    type: Number,
    required: true,
  },
  matchHour: {
    type: String,
    required: true,
  },
  matchDate: {
    type: String,
    required: true,
  },
  homeTeamName: {
    type: String,
    required: true,
  },
  homeTeamUrl: {
    type: String,
    required: true,
  },
  homeTeamId: {
    type: String,
    required: true,
  },
  awayTeamName: {
    type: String,
    required: true,
  },
  awayTeamUrl: {
    type: String,
    required: true,
  },
  awayTeamId: {
    type: String,
    required: true,
  },
  leagueName: {
    type: String,
    required: true,
  },
  leagueId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Matches = model("Matches", matchesSchema);

export default Matches;
