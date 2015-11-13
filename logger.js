// Note: This depends the `stringFormat` and `pad` functions also in this
// repository. Both dependencies are for the `getPrefix` function, so you
// can rewrite that function to get rid of the dependencies if you wish.

(function (namespace, console, stringFormat, pad) {

  /**
   * Builds a prefix for a log entry
   *
   * @param {string} level Single char indicating log severity
   * @param {string} tag Name for the logger, displayed in square brackets
   * @return {string}
   * @note If you don't want the stringFormat and pad dependency, rewrite it
   * with string concatentation, and maybe your own pad function. Padding is
   * recommended to keep the width of the timestamp constant.
   */
  function getPrefix(level, tag) {
    var d = new Date();

    return stringFormat(
      "{0} ({1}:{2}:{3}.{4}) [{5}]",
      level,
      pad(d.getHours(), '0', 2),
      pad(d.getMinutes(), '0', 2),
      pad(d.getSeconds(), '0', 2),
      pad(d.getMilliseconds(), '0', 3),
      tag);
  }

  /**
   * An Android-like logger "class". Produces logs like
   * "D (12:34:56.123) [ModuleTag] log message"
   * Where D indicates Debug log level, the parentheses wrap a detailed
   * timestamp, ModuleTag is the tag supplied in the constructure, and the
   * rest is arguments supplied to the available methods.
   *
   * If the environment in which it's run doesn't have a console, it will fail
   * silently.
   *
   * The motivation behind this one is to have to write little code to do easy
   * debugging. Plain `console.log` statements can get messy and hard to follow
   * pretty fast.
   *
   * Usage:
   * Create a new logger for a module:
   * `var logger = new Logger("MyModule");`
   *
   * Log a debug message:
   * `logger.debug("Uh-oh, everything is broken!")`
   * Produces: "D (12:34:56.123) [MyModule] Uh-oh, everything is broken!"
   *
   * Further inspiration: Modify Logger to allow disabling of all logging with
   * a single bool flag; enable logging in your dev environment, disable it in
   * producation.
   */
  function Logger(tag) {
    this.tag = tag;
    this.console = console || {};
  }

  /**
   * Send a log-level message to the console
   *
   * If no arguments are supplied, does nothing
   * If the native console has no log function, does nothing
   *
   * @return {void}
   */
  Logger.prototype.log = function () {
    if (arguments.length < 1) return;
    if (typeof this.console.log !== "function") return;

    // arguments is not a proper array, but is array-like. Clone it to a proper
    // array.
    var args = Array.prototype.slice.call(arguments, 0);

    // Prepend a log prefix to the array of arguments
    args.unshift(getPrefix('L', this.tag));

    // Supply the newly constructed arguments to the native function
    // Double .apply because single apply would be equivalen to
    // `this.console.log([args])` instead of
    // `this.console.log(args[0], args[1], ...)`
    // And `this.console.log.apply` doesn't work in IE8/IE9
    // ... If I recall correctly. Definitely a good place to experiment and
    // improve on.
    Function.prototype.apply.apply(this.console.log, [this.console, args]);
  };

  /**
   * Send a debug-level message to the console
   *
   * If no arguments are supplied, does nothing
   * If the native console has no log function, does nothing
   *
   * @return {void}
   */
  Logger.prototype.debug = function () {
    if (arguments.length < 1) return;
    if (typeof this.console.debug !== "function") return;

    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(getPrefix('D', this.tag));
    Function.prototype.apply.apply(this.console.debug, [this.console, args]);
  };

  /**
   * Send an info-level message to the console
   *
   * If no arguments are supplied, does nothing
   * If the native console has no log function, does nothing
   *
   * @return {void}
   */
  Logger.prototype.info = function () {
    if (arguments.length < 1) return;
    if (typeof this.console.info !== "function") return;

    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(getPrefix('I', this.tag));
    Function.prototype.apply.apply(this.console.info, [this.console, args]);
  };

  /**
   * Send a warning-level message to the console
   *
   * If no arguments are supplied, does nothing
   * If the native console has no log function, does nothing
   *
   * @return {void}
   */
  Logger.prototype.warn = function () {
    if (arguments.length < 1) return;
    if (typeof this.console.warn !== "function") return;

    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(getPrefix('W', this.tag));
    Function.prototype.apply.apply(this.console.warn, [this.console, args]);
  };

  /**
   * Send an error-level message to the console
   *
   * If no arguments are supplied, does nothing
   * If the native console has no log function, does nothing
   *
   * @return {void}
   */
  Logger.prototype.error = function () {
    if (arguments.length < 1) return;
    if (typeof this.console.error !== "function") return;

    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(getPrefix('E', this.tag));
    Function.prototype.apply.apply(this.console.error, [this.console, args]);
  };

  // Make Logger available to other code.
  // Here `namespace` would best be some namespace for your application,
  // instead of the global object.
  namespace.Logger = Logger;

}(this, this.console, stringFormat, pad));
