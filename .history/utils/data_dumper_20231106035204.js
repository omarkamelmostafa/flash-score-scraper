import ExcelJS from "exceljs";
import fs from "fs/promises";
import { mkdirSync, existsSync } from "fs";
import crypto from "crypto";
import chalk from "chalk";

// Creates a directory if it does not exist.
// @param {string} dir The directory path.
const createDirIfNotExists = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

// Generates a unique file name using the current date and time.
// @return {string} The unique file name.
const generateFileName = () => {
  const date = new Date();
  const hour = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${date.toISOString().slice(0, 10)}_T_${hour}-${minutes}-${seconds}`;
};

// Generates a random 20-byte hexadecimal ID.
// @return {string} The random ID.
export const getRandomId = () => crypto.randomBytes(20).toString("hex");

// ### Leagues ### //
/**
 * Writes a list of teams to an Excel file.
 *
 * @param {object[]} data An array of team objects.
 * @param {string} fileName The name of the file to write to.
 */
export const writeTeamsToExcel = async (data, fileName) => {
  // Create the directory for the Excel file if it does not exist.
  const fileDir = `./data/excel/leagues/${fileName}/`;
  createDirIfNotExists(fileDir);

  // Create the Excel workbook.
  const workbook = new ExcelJS.Workbook();

  // Add a worksheet to the workbook.
  const sheet = workbook.addWorksheet(
    `Teams Data-${new Date().toISOString().slice(0, 10)}`
  );

  // Define the columns for the worksheet.
  sheet.columns = [
    { header: "ID", key: "ID", name: "ID" },
    { header: "Team Name", key: "teamName", name: "teamName" },
    { header: "Team URL", key: "teamUrl", name: "teamUrl" },
  ];

  // Add the team data to the worksheet.
  sheet.addRows(data);

  // Write the Excel workbook to a file.
  try {
    await workbook.xlsx.writeFile(
      `./data/excel/leagues/${fileName}/${fileName}-teams.xlsx`
    );
    const numberOfAddedRows = sheet.rowCount - 1;
    console.log(
      `⚽️ Hooray! ${numberOfAddedRows} teams have been added to the Excel file "${fileName}". ⚽️`
    );
  } catch (err) {
    console.error(err);
  }
};

/**
 * Writes a league's teams to a JSON file.
 *
 * @param {object} league A league object.
 * @param {string} fileName The name of the file to write to.
 */
export const writeTeamsToJson = async (league, fileName) => {
  // Create the directory for the JSON file if it does not exist.
  const fileDir = `./data/json/leagues/${fileName}/`;
  createDirIfNotExists(fileDir);

  // Write the league's teams to a JSON file.
  try {
    await fs.writeFile(
      `./data/json/leagues/${fileName}/${fileName}-teams.json`,
      JSON.stringify(league, null, 2)
    );
    console.log(
      `🏆 Success! ${league.leagueTeams.length} teams have been written to the JSON file "${fileName}". 🏆`
    );
  } catch (err) {
    console.error(err);
  }
};

// ### Matches ### //
/**
 * Writes a list of matches to an Excel file.
 *
 * @param {object[]} data An array of match objects.
 * @param {string} fileName The name of the file to write to.
 */
export const writeMatchesToExcel = async (data, fileName) => {
  // Create the directory for the Excel file if it does not exist.
  const fileDir = `./data/excel/matches/${fileName}/`;
  createDirIfNotExists(fileDir);

  // Create the Excel workbook.
  const workbook = new ExcelJS.Workbook();

  // Add a worksheet to the workbook.
  const sheet = workbook.addWorksheet(
    `Matches Data-${new Date().toISOString().slice(0, 10)}`
  );

  // Define the columns for the worksheet.
  sheet.columns = [
    { header: "ID", key: "ID", name: "ID" },
    {
      header: "Match Round Number",
      key: "matchRoundNumber",
      name: "matchRoundNumber",
    },
    { header: "Match Hour", key: "matchHour", name: "matchHour" },
    { header: "Match Date", key: "matchDate", name: "matchDate" },
    { header: "Home Team Name", key: "homeTeamName", name: "homeTeamName" },
    { header: "Away Team Name", key: "awayTeamName", name: "awayTeamName" },
  ];

  // Add the match data to the worksheet.
  sheet.addRows(data);

  // Write the Excel workbook to a file.
  try {
    await workbook.xlsx.writeFile(
      `./data/excel/matches/${fileName}/${fileName}-matches.xlsx`
    );
    const numberOfAddedRows = sheet.rowCount - 1;
    console.log(
      `⚽️ Hooray! ${numberOfAddedRows} matches have been added to the Excel file "${fileName}". ⚽️`
    );
  } catch (err) {
    console.error(err);
  }
};

/**
 * Writes a list of matches to a JSON file.
 *
 * @param {object[]} data An array of match objects.
 * @param {string} fileName The name of the file to write to.
 */
export const writeMatchesToJson = async (data, fileName) => {
  // Create the directory for the JSON file if it does not exist.
  const fileDir = `./data/json/matches/${fileName}/`;
  createDirIfNotExists(fileDir);

  // Write the match data to a JSON file.
  try {
    await fs.writeFile(
      `./data/json/matches/${fileName}/${fileName}-matches.json`,
      JSON.stringify(data, null, 2)
    );
    console.log(
      `🏆 Success! ${data.length} matches have been written to the JSON file "${fileName}". 🏆`
    );
  } catch (err) {
    console.error(err);
  }
};

// ### Updated Matches ### //
/**
 * Writes a list of updated matches to an Excel file.
 *
 * @param {object[]} data An array of updated match objects.
 * @param {string} fileName The name of the file to write to.
 */
export const writeUpdatedMatchesToExcel = async (data, fileName) => {
  // Create the directory for the Excel file if it does not exist.
  const fileDir = `./data/excel/matches/updated_matches/`;
  createDirIfNotExists(fileDir);

  // Create the Excel workbook.
  const workbook = new ExcelJS.Workbook();

  // Add a worksheet to the workbook.
  const sheet = workbook.addWorksheet(
    `Matches Data-${new Date().toISOString().slice(0, 10)}`
  );

  // Define the columns for the worksheet.
  sheet.columns = [
    { header: "ID", key: "ID", name: "ID" },
    {
      header: "Match Round Number",
      key: "matchRoundNumber",
      name: "matchRoundNumber",
    },
    { header: "Match Hour", key: "matchHour", name: "matchHour" },
    { header: "Match Date", key: "matchDate", name: "matchDate" },
    { header: "leagueName", key: "leagueName", name: "leagueName" },
    { header: "Home Team Name", key: "homeTeamName", name: "homeTeamName" },
    { header: "Home Team URL", key: "homeTeamUrl", name: "homeTeamUrl" },
    { header: "Away Team Name", key: "awayTeamName", name: "awayTeamName" },
    { header: "Away Team URL", key: "awayTeamUrl", name: "awayTeamUrl" },
  ];

  // Add the updated match data to the worksheet.
  sheet.addRows(data);

  // Write the Excel workbook to a file.
  try {
    await workbook.xlsx.writeFile(
      `./data/excel/matches/updated_matches/matches-${fileName}.xlsx`
    );
    const numberOfAddedRows = sheet.rowCount - 1;
    console.log(
      `⚽️ Hooray! ${numberOfAddedRows} updated matches have been added to the Excel file "${fileName}". ⚽️`
    );
  } catch (err) {
    console.error(err);
  }
};

/**
 * Writes a list of updated matches to a JSON file.
 *
 * @param {object[]} data An array of updated match objects.
 * @param {string} fileName The name of the file to write to.
 */
export const writeUpdatedMatchesToJson = async (data, fileName) => {
  // Create the directory for the JSON file if it does not exist.
  const fileDir = `./data/json/matches/updated_matches/`;
  createDirIfNotExists(fileDir);

  // Write the updated match data to a JSON file.
  try {
    await fs.writeFile(
      `./data/json/matches/updated_matches/matches-${fileName}.json`,
      JSON.stringify(data, null, 2)
    );
    console.log(
      `🏆 Success! ${data.length} updated matches have been written to the JSON file "${fileName}". 🏆`
    );
  } catch (err) {
    console.error(err);
  }
};

// ### Stats ### //
/**
 * Writes a list of stats to an Excel file.
 *
 * @param {object[]} data An array of stat objects.
 * @param {string} fileName The name of the file to write to.
 *
 * @returns {Promise<void>}
 */
export const writeStatsToExcel = async (data, fileName) => {
  const theLeagueName = data.at()
  // Create the directory for the Excel file if it does not exist.
  const fileDir = `./data/excel/stats/${fileName}/`;
  createDirIfNotExists(fileDir);

  // Create the Excel workbook.
  const workbook = new ExcelJS.Workbook();

  // Add a worksheet for the overall stats.
  const sheet = workbook.addWorksheet(`${fileName}`);

  // Add worksheets for the home and away team prior match stats.
  const homeTeamPriorMatchStatsWorksheet = workbook.addWorksheet(
    "Home Team Prior Stats"
  );
  const awayTeamPriorMatchStatsWorksheet = workbook.addWorksheet(
    "Away Team Prior Stats"
  );

  // Define the columns for the home and away team prior match stats worksheets.
  homeTeamPriorMatchStatsWorksheet.columns = [
    { header: "Statistic", key: "statText" },
    { header: "Value", key: "statValue" },
    { header: "Minimum Value", key: "minimumValue" },
    { header: "Average Value", key: "averageValue" },
    { header: "Maximum Value", key: "maximumValue" },
  ];

  awayTeamPriorMatchStatsWorksheet.columns = [
    { header: "Statistic", key: "statText" },
    { header: "Value", key: "statValue" },
    { header: "Minimum Value", key: "minimumValue" },
    { header: "Average Value", key: "averageValue" },
    { header: "Maximum Value", key: "maximumValue" },
  ];

  function calculateMinMaxValueAndAverage(array) {
    // Convert all of the elements in the array to numbers.
    const numericArray = array.map((item) => {
      if (typeof item === "string") {
        return parseFloat(item);
      } else {
        return item;
      }
    });

    // Calculate the minimum, maximum, and average of the numeric array.
    const min = Math.min(...numericArray);
    const max = Math.max(...numericArray);
    const average = (
      numericArray.reduce((sum, current) => sum + current) / numericArray.length
    ).toFixed(2);

    // Return the minimum, maximum, and average.
    return { min, max, average };
  }

  // Iterate over the stats and add them to the appropriate worksheets.
  for (const row of data) {
    const homeTeamPriorMatchStats = row.homeTeamPriorMatchStats;
    const awayTeamPriorMatchStats = row.awayTeamPriorMatchStats;

    // Add the home team prior match stats to the home team worksheet.
    for (const [statistic, value] of Object.entries(homeTeamPriorMatchStats)) {
      const { min, average, max } = calculateMinMaxValueAndAverage(value);
      const minimumValue = min;
      const averageValue = average;
      const maximumValue = max;
      // const minimumValue = value.reduce((a, b) => Math.min(a, b));
      // const averageValue =
      //   value.reduce((sum, current) => sum + current) / value.length;
      // const maximumValue = value.reduce((a, b) => Math.max(a, b));

      homeTeamPriorMatchStatsWorksheet.addRow({
        statText: statistic,
        statValue: value,
        minimumValue: minimumValue,
        averageValue: averageValue,
        maximumValue: maximumValue,
      });
    }

    // Add the away team prior match stats to the away team worksheet.
    for (const [statistic, value] of Object.entries(awayTeamPriorMatchStats)) {
      const { min, average, max } = calculateMinMaxValueAndAverage(value);
      const minimumValue = min;
      const averageValue = average;
      const maximumValue = max;

      awayTeamPriorMatchStatsWorksheet.addRow({
        statText: statistic,
        statValue: value,
        minimumValue: minimumValue,
        averageValue: averageValue,
        maximumValue: maximumValue,
      });
    }
  }

  // Add the overall stats to the overall worksheet.
  const fields = ["ID", "matchId", "leagueId", "homeTeamName", "awayTeamName"];

  const sheetColumns = [];
  for (const field of fields) {
    sheetColumns.push({ header: field, key: field, name: field });
  }

  sheet.columns = [...sheetColumns.flat()];

  for (const row of data) {
    const newRow = [];

    for (const field of fields) {
      newRow.push(row[field]);
    }

    sheet.addRow(newRow);
  }

  // Write the Excel workbook to a file.
  try {
    await workbook.xlsx.writeFile(
      `./data/excel/stats/${fileName}/${fileName}.xlsx`
    );
    const numberOfAddedRows = data.length;
    console.log(
      chalk.bgBlack.white.bold(
        ` ⚽️ Hooray! ${numberOfAddedRows} stats have been added to the Excel file "${fileName}". ⚽️ `
      )
    );
  } catch (err) {
    console.log(chalk.bgRedBright.whiteBright.bold(` ERROR: ${err.message} `));
  }
};

/**
 * Writes a list of stats to a JSON file.
 *
 * @param {object[]} data An array of stat objects.
 * @param {string} fileName The name of the file to write to.
 *
 * @returns {Promise<void>}
 */
export const writeStatsToJson = async (data, fileName) => {
  // Create the directory for the JSON file if it does not exist.
  const fileDir = `./data/json/stats/${fileName}/`;
  createDirIfNotExists(fileDir);

  // Write the stats to a JSON file.
  try {
    await fs.writeFile(
      `./data/json/stats/${fileName}/${fileName}.json`,
      JSON.stringify(data, null, 2)
    );
    console.log(
      chalk.bgBlack.white.bold(
        ` 🏆 Success! ${data.length} stats have been written to the JSON file "${fileName}". 🏆 `
      )
    );
  } catch (err) {
    console.log(chalk.bgRedBright.whiteBright.bold(` ERROR: ${err.message} `));
  }
};

export { createDirIfNotExists, generateFileName };
