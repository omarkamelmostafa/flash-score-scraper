/**
 * Sleeps the current process for the specified amount of time in seconds.
 * By default, sleeps for a random amount of time between 1 and 20 seconds.
 *
 * @param {number} sleepTime The number of seconds to sleep.
 * @returns {Promise} A promise that resolves after the sleep time.
 */
export const sleep = async (sleepTime) => {
  // Set default sleep times.
  const DEFAULT_MIN_SLEEP_TIME = 1;
  const DEFAULT_MAX_SLEEP_TIME = 20;

  // Generate a random sleep time if none is provided.
  const sleepDuration =
    sleepTime * 1000 ||
    Math.floor(
      Math.random() * (DEFAULT_MAX_SLEEP_TIME - DEFAULT_MIN_SLEEP_TIME + 1) +
        DEFAULT_MIN_SLEEP_TIME
    ) * 1000;

  // Log the sleep time and create a promise that resolves after the sleep time.
  console.log(`😴 Zzz... sleeping for ${sleepDuration / 1000} seconds... 😴`);
  const sleepPromise = new Promise((resolve) => {
    setTimeout(resolve, sleepDuration);
  });

  // Wait for the sleep promise to resolve.
  await sleepPromise;
};
