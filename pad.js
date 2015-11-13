/**
 * Pad the start or end of a string with a given character, so it meets the
 * desired length. If the string is already at or above desiredLength, the
 * string is returned unaltered.
 *
 * @param {string} str The string to pad
 * @param {string} padChar - Must be exactly one character. Used to pad str.
 * @param {number} desiredLength
 * @param {bool} padEnd If true, pads the end instead of start of str
 * @return {string}
 * @throws {Error} when padChar is not exactly one character long
 */
function pad(str, padChar, desiredLength, padEnd) {
  var padding;

  // Normalize arguments
  str = "" + str;
  desiredLength = Math.floor(Number(desiredLength));
  padChar = "" + padChar;
  padEnd = !!padEnd;

  if (padChar.length !== 1) {
    throw new Error(
      "pad: padChar should be exactly one character long, but is " +
      padChar.length + " characters long");
  }

  if (str.length >= desiredLength) return str;

  padding = new Array(desiredLength - str.Length + 1).join(padChar);

  return padEnd ? (str + padEnd) : (padEnd + str);
}