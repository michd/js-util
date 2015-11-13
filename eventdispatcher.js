// Note: this tool has no dependencies; you can pretty much drop it in as-is.

(function (namespace) {

  /**
   * A simple publisher/subscriber system.
   *
   * Maintains a list of interested parties for given event names. Once trigger
   * is called with that event name, all the interested parties are notified.
   *
   * Usage:
   * Create a new instance: `var eventDispatcher = new EventDispatcher();`
   *
   * Send events to anyone who cares:
   * `eventDispatcher.trigger(eventName, data);`
   *
   * Sign up to be notified of a given event name when it happens:
   * `eventDispatcher.subscribe(eventName, functionCallback);`
   *
   * Stop receiving notifications for an event:
   * `eventDispatcher.unsubscribe(eventName, functionCallback);`
   *
   * A good way to use this is create an instance of this in your module,
   * and then expose the subscribe and unsubscribe methods. This way your module
   * becomes an EventDispatcher itself, but can only trigger events from the
   * inside.
   */
  function EventDispatcher() {
        // Dictionary of event listeners. Each eventName entry gets an array of
        // subscribed callback functions assigned to it.
    var eventSubscribers = {},
        // Self-reference to get around the meaning of `this` changing depending
        // on context.
        self = this;

    /**
     * Triggers an event with a given name, associated data, and `this` context.
     *
     * Invokes all the callbacks registered through subscribe for this eventName
     *
     * @param {string} eventName
     * @param {*} data Any data to pass along to the callback
     * @param {object} context An optional context that will be accessible by
     * `this` in the callback function
     * @return {void}
     */
    function trigger(eventName, data, context) {
          // Retrieve the array of subscribes for this event name
      var subscribers = eventSubscribers[eventName],
          i, iMax;

      // This is a kind of hidden neat feature:
      // if data is an array, each item will be passed as an individual argument
      // to the callback function. If not, we wrap it in an array so data is
      // simple the first argument.
      // In essence, `trigger("foo", [a, b, c])` becomes `callback(a, b, c)`
      data = (data instanceof Array) ? data : [data];

      // If no context is supplied, map `this` in the callback to the event
      // dispatcher itself.
      // Note: this is exactly something you might want to prevent when using
      // EventDispatcher inside a module - it would expose the actual
      // EventDispatcher. You probably want to supply a reference to your
      // own module instead.
      context = context || self;

      // If there are no subscribers for this eventName, there is nothing to do
      if (typeof subscribers === "undefined") return;

      // Iterate over subscribers for this event and invoke them.
      for (i = 0, iMax = subscribers.length; i < iMax; i++) {
        subscribers[i].apply(context, data);
      }
    }

    /**
     * Add a callback function to be invoked when eventName is triggered
     *
     * Whenever trigger is called with the same eventName supplied here, the
     * callback function will be run.
     *
     * If the exact same callback function is already subscribed to eventName,
     * it won't get added again.
     *
     * @param {string} eventName
     * @param {function} callback
     * @throws {TypeError} if eventName is not a string
     * @throws {TypeError} if callback is not a function
     */
    function subscribe(eventName, callback) {
      if (typeof eventName !== "string") {
        throw new TypeError("subscribe: expecting string eventName");
      }

      if (typeof callback !== "function") {
        throw new TypeError("subscribe: expecting function callback");
      }

      // Retrieve the list of callbacks already subscribe to this event
      var subscribers = eventSubscribers[eventName];

      // If no list was found, start a new one
      if (typeof subscribers === "undefined") {
        subscribers = eventSubscribers[eventName] = [];
      }

      // If this callback was already subscribed, abort
      if (subscribers.indexOf(callback) > -1) return;

      // Add the callback to the list
      subscribers.push(callback);
    }

    /**
     * Stops a previously subscribed callback function from being invoked
     * when eventName is triggered.
     *
     * If the function wasn't subscribed, nothing happens.
     *
     * @param {string} eventName Event to unsubscribe from
     * @param {function} existingCallback Function to be removed from list
     */
    function unsubscribe(eventName, existingCallback) {
          // Retrieve the list of subscribed callbacks for eventName
      var subscribers = eventSubscribers[eventName],
          index;

      // If the list of subscribers didn't exist, abort
      if (typeof subscribers === "undefined") return;

      // Find the position of existingCallback in the list
      index = subscribers.indexOf(existingCallback);

      // if existingCallback existed in the list, remove it
      if (index > -1) subscribers.splice(index, 1);
    }

    // Expose the methods
    this.trigger = trigger;
    this.subscribe = subscribe;
    this.unsubscribe = unsubscribe;
  }

  // Make EventDispatcher available to other code.
  // Here `namespace` would best be some namespace for your application,
  // instead of the global object.
  namespace.EventDispatcher = EventDispatcher;

}(this));