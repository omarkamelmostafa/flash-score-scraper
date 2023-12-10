import {
  generateFileName,
  writeUpdatedMatchesToExcel,
  writeUpdatedMatchesToJson,
} from "../utils/data_dumper.js";
import { updateMatchesWithTeamUrls } from "../utils/request_utils.js";
import { addIdToData, emitLogMessage } from "../utils/utils_functions.js";

/**
 * Updates the matches with team URLs and writes them to Excel and JSON.
 */
export const updateMatches = async () => {
  // Log a message to the console indicating that the match update process is starting.
  emitLogMessage(`Starting Updating Matches()...`, "info");

  try {
    // Generate a file name for the updated matches.
    const fileName = generateFileName();
    const updatedMatches = await updateMatchesWithTeamUrls();

    // Get the updated matches from the server.

    // If no matches were sent from the server, log an error message to the console and return.
    if (!updatedMatches) {
      emitLogMessage(
        `error message: no matches were sent from the server`,
        "error"
      );
      return;
    }

    // Add IDs to the updated matches.
    const updatedMatchesWithIds = addIdToData(updatedMatches);

    // Write the updated matches to Excel.
    await writeUpdatedMatchesToExcel(updatedMatchesWithIds, fileName);

    // Write the updated matches to JSON.
    await writeUpdatedMatchesToJson(updatedMatchesWithIds, fileName);

    // Log a message to the console indicating that the match update process was successful.
    emitLogMessage(`Finished Updating Matches() successfully.`, "info");
  } catch (err) {
    // Log the error message to the console.
    emitLogMessage(`error message: ${err.message}`, "error");
  }
};

// updateMatches();
