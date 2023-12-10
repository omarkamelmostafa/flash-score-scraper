/**
 * Mongoose schema for the Stats collection.
 *
 * Stores statistical information about matches, such as the match ID, league ID, home team name, away team name, home team prior match stats, and away team prior match stats.
 *
 * Also stores a createdAt timestamp to track when each stat record was created.
 */
import { Schema, model } from "mongoose";

const statsSchema = new Schema({
  matchId: {
    type: String,
    required: true,
  },
  leagueId: {
    type: String,
    required: true,
  },
  homeTeamName: {
    type: String,
    required: true,
  },
  awayTeamName: {
    type: String,
    required: true,
  },
  homeTeamPriorMatchStats: {
    type: Object,
    required: true,
  },
  awayTeamPriorMatchStats: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Stats = model("Stats", statsSchema);

export default Stats;
