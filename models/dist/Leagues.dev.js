"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = require("mongoose");

var leagueSchema = new _mongoose.Schema({
  _id: (0, _mongoose.ObjectId)(),
  leagueName: String,
  leagueUrl: String,
  country: String,
  sport: String,
  numberOfTeams: Number,
  season: String,
  matchesEndpoint: String,
  createdAt: {
    type: Date,
    "default": Date.now
  },
  leagueTeams: [{
    teamName: String,
    teamUrl: String
  }]
});
var Leagues = (0, _mongoose.model)("League", leagueSchema);
var _default = Leagues;
exports["default"] = _default;