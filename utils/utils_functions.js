/**
 * Generates a filename based on the given parameters.
 *
 * @param {string} prefix The prefix for the filename.
 * @param {string} suffix The suffix for the filename.
 * @returns {string} The generated filename.
 */
export function generateFileName(prefix, suffix) {
  // Generate a unique timestamp.
  const timestamp = new Date().toISOString().slice(0, 10);

  // Generate the filename.
  const filename = `${prefix}-${timestamp}${suffix}`;

  return filename;
}

/**
 * Adds an ID field to each item in the input data, starting at 1.
 *
 * @param {Array | Object} inputData The data to add IDs to.
 * @returns {Array | Object} The data with IDs added.
 */
export const addIdToData = (inputData) => {
  if (Array.isArray(inputData)) {
    return inputData.map((item, index) => ({
      ID: index + 1,
      ...item,
    }));
  } else if (typeof inputData === "object") {
    return {
      ID: 1,
      ...inputData,
    };
  } else {
    throw new Error("Invalid input data type");
  }
};

import chalk from "chalk";

/**
 * Logs a message to the console with a specified level.
 *
 * @param {string} message The message to log.
 * @param {string} level The log level, which can be "error", "info", or "success".
 */
export const emitLogMessage = (message, level) => {
  // Validate the log level.
  if (!["error", "info", "success"].includes(level)) {
    throw new Error(`Invalid log level: ${level}`);
  }

  // Get the appropriate chalk color for the log level.
  const chalkColor = {
    error: chalk.bgRedBright.whiteBright.bold,
    info: chalk.bgYellowBright.whiteBright.bold,
    success: chalk.bgGreenBright.bold.redBright,
  }[level];

  // Log the message to the console.
  console.log(chalkColor(` ${message} `));
};
