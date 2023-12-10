/**
 * Mongoose schema for the League collection.
 *
 * Stores information about leagues, such as the league name, URL, country, sport, number of teams, season, matches endpoint, and created at timestamp.
 *
 * Also stores an array of teams that participate in the league.
 */
import { Schema, model } from "mongoose";

const leagueSchema = new Schema({
  leagueName: {
    type: String,
    required: true,
  },
  leagueUrl: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  sport: {
    type: String,
    required: true,
  },
  numberOfTeams: {
    type: Number,
    required: true,
  },
  season: {
    type: String,
    required: true,
  },
  matchesEndpoint: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  leagueTeams: [
    {
      teamName: {
        type: String,
        required: true,
      },
      teamUrl: {
        type: String,
        required: true,
      },
    },
  ],
});

const Leagues = model("League", leagueSchema);

export default Leagues;
