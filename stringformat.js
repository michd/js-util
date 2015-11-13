/**
 * Based on C#'s string.Format. Built because string concatenation gets boring.
 *
 * Usage: `stringFormat("Look, some data! foo: {0}, bar: {1}", foo, bar);`
 *
 * The above example replaces {0} with foo's string representation, and so on.
 *
 * @note If you're into extending native prototypes, you could set this up to
 * extend String.prototype, and then use it as:
 * `"here is a format string {0} {1}".format(foo, bar);`
 *
 * @param {string} formatString Base text containing "{0}", "{1}" to denote
 * where data is to be inserted
 * @param {anything}... As many additional args as you like, data to put embed
 * in the output string.
 * @return {string}
 * @throws {TypeError} When formatString is not a string
 */
function stringFormat(formatString, data) {
  var dataObjects = [],
      outStr,
      i;

  if (typeof formatString !== "string") {
    throw new TypeError(stringFormat(
      "stringFormat: formatString should be string, {0} given.",
       typeof(formatString)));
  }

  if (arguments.length === 1) return formatString;

  outStr = formatString;

  for (i = 1; i < arguments.length; i++) {
    outStr = outStr.replace('{' + (i - 1) + '}', arguments[i]);
  }

  return outStr;
}