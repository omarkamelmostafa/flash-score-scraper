import axios from "axios";

// Create an axios proxy instance to interact with the server.
const proxy = axios.create({
  baseURL: "http://localhost:3000",
});

/**
 * Saves a list of teams to the server.
 *
 * @param {object[]} data An array of team objects.
 */
export const saveLeague = async (data) => {
  await proxy.post("/save-teams", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Gets a list of all leagues from the server.
 *
 * @returns {object[]} An array of league objects.
 */
export const getLeagues = async () => {
  const leagueMetadata = await proxy.get("/get-leagues", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return leagueMetadata.data;
};

/**
 * Saves a list of matches to the server.
 *
 * @param {object[]} data An array of match objects.
 */
export const saveMatches = async (data) => {
  await proxy.post("/save-matches", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Gets a list of matches for the current round from the server.
 *
 * @returns {object[]} An array of match objects.
 */
export const getMatchesByRound = async () => {
  const roundMatches = await proxy.get("/get-round-matches", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return roundMatches.data;
};

/**
 * Updates a list of matches with their home and away team URLs on the server.
 *
 * @returns {object[]} An array of updated match objects.
 */
export const updateMatchesWithTeamUrls = async () => {
  const matches = await proxy.put("/update-matches", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return matches.data;
};

/**
 * Saves a list of stats for the last 10 matches for each match to the server.
 *
 * @param {object[]} data An array of stats objects.
 * @returns {object[]} An array of saved stats objects.
 */
export const saveStats = async (data) => {
  const savedStats = await proxy.post("/save-stats", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return savedStats.data;
};
