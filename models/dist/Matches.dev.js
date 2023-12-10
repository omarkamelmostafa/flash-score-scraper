"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var matchesSchema = new _mongoose.Schema({
  _id: ObjectId(),
  matchRoundNumber: Number,
  matchHour: String,
  matchDate: String,
  homeTeamName: String,
  homeTeamUrl: String,
  homeTeamId: String,
  awayTeamName: String,
  awayTeamUrl: String,
  awayTeamId: String,
  createdAt: {
    type: Date,
    "default": Date.now
  },
  leagueName: String,
  leagueId: String
});
var Matches = (0, _mongoose.model)("Matches", matchesSchema);
var _default = Matches; // league: { type: Schema.Types.ObjectId, ref: "Leagues" },

exports["default"] = _default;