(function () {
'use strict';

class Color {
    constructor(args) {
        /**
         * underlying representation
         * r,g,b: 0-255
         * a: 0-1
         */
        this.rgba = [undefined, undefined, undefined, undefined];
        if (Array.isArray(args) && args.length === 4) {
            this.rgba = args.slice(); // clone
        }
        else if (args instanceof Color) {
            this.rgba = args.rgba.slice(); // clone
        }
        else if (typeof args === 'string') {
            const value = args;
            this.setColorFromString(value);
        }
        else {
            throw 'invalid parameters for constructor';
        }
    }
    get red() {
        return this.rgba[0];
    }
    get green() {
        return this.rgba[1];
    }
    get blue() {
        return this.rgba[2];
    }
    get alpha() {
        return this.rgba[3];
    }
    get rgbaString() {
        return `rgba(${this.rgba[0]}, ${this.rgba[1]}, ${this.rgba[2]}, ${this.rgba[3]})`;
    }
    get hexString() {
        return `#${this.convert256toHex(this.rgba[0])}${this.convert256toHex(this.rgba[1])}${this.convert256toHex(this.rgba[2])}`;
    }
    get luminance() {
        return .2126 * this.getLuminanceComponent(this.rgba[0]) + .7152 * this.getLuminanceComponent(this.rgba[1]) + 0.0722 * this.getLuminanceComponent(this.rgba[2]);
    }
    getContrastOnBackground(color) {
        // TODO support transparent foreground
        if (this.alpha !== 1 || color.alpha !== 1) {
            throw 'transparent color contrast not supported yet';
        }
        // https://www.w3.org/TR/WCAG20/#contrast-ratiodef
        const contrast = this.luminance > color.luminance ? (this.luminance + 0.05) / (color.luminance + 0.05) : (color.luminance + 0.05) / (this.luminance + 0.05);
        return this.roundToPrecision(contrast, 1);
    }
    setColorFromString(value) {
        const type = inferValueType(value);
        switch (type) {
            case 'hex':
                this.setColorFromHex(value);
                break;
            case 'rgba':
                this.setColorFromRbga(value);
                break;
            default:
                const exhaustiveCheck = type;
        }
    }
    setColorFromHex(hexString) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexString);
        if (result && result.length === 4) {
            this.rgba[0] = parseInt(result[1], 16);
            this.rgba[1] = parseInt(result[2], 16);
            this.rgba[2] = parseInt(result[3], 16);
            this.rgba[3] = 1;
        }
        else {
            throw 'invalid hex value';
        }
    }
    setColorFromRbga(rbgaString) {
        let result = /^rgba\(([\d]+), *([\d]+), *([\d]+), *(\d*\.?\d*)\)$/.exec(rbgaString);
        if (result && result.length === 5) {
            this.rgba[0] = parseInt(result[1]);
            this.rgba[1] = parseInt(result[2]);
            this.rgba[2] = parseInt(result[3]);
            this.rgba[3] = parseFloat(result[4]);
        }
        else {
            throw 'invalid rgba value';
        }
    }
    convert256toHex(value) {
        return ("0" + value.toString(16)).slice(-2).toUpperCase();
    }
    /**
     * get R, G, or B from R_8bit, G_8bit, or B_8bit
     * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
     */
    getLuminanceComponent(rawValue) {
        let result = rawValue / 255; // 8bit -> sRGB
        return result < .03928 ? result / 12.92 : Math.pow((result + .055) / 1.055, 2.4);
    }
    roundToPrecision(value, precision) {
        precision = +precision || 0;
        var multiplier = Math.pow(10, precision);
        return Math.round(value * multiplier) / multiplier;
    }
}
function inferValueType(value) {
    if (!value.length) {
        throw 'invalid color';
    }
    else if (value[0] === '#') {
        return 'hex';
    }
    else if (value.length > 4 && value.substr(0, 4) === 'rgba') {
        return 'rgba';
    }
    else {
        throw 'unsupported color';
    }
}

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

// CommonJS / Node have global context exposed as "global" variable.
// We don't want to include the whole node.d.ts this this compilation unit so we'll just fake
// the global "global" var for now.
var __window = typeof window !== 'undefined' && window;
var __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
var __global = typeof commonjsGlobal !== 'undefined' && commonjsGlobal;
var _root = __window || __global || __self;
var root_1 = _root;
// Workaround Closure Compiler restriction: The body of a goog.module cannot use throw.
// This is needed when used with angular/tsickle which inserts a goog.module statement.
// Wrap in IIFE
(function () {
    if (!_root) {
        throw new Error('RxJS could not find any global context (window, self, global)');
    }
})();


var root = {
	root: root_1
};

function isFunction(x) {
    return typeof x === 'function';
}
var isFunction_2 = isFunction;


var isFunction_1 = {
	isFunction: isFunction_2
};

var isArray_1 = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });


var isArray = {
	isArray: isArray_1
};

function isObject(x) {
    return x != null && typeof x === 'object';
}
var isObject_2 = isObject;


var isObject_1 = {
	isObject: isObject_2
};

// typeof any so that it we don't have to cast when comparing a result to the error object
var errorObject_1 = { e: {} };


var errorObject = {
	errorObject: errorObject_1
};

var tryCatchTarget;
function tryCatcher() {
    try {
        return tryCatchTarget.apply(this, arguments);
    }
    catch (e) {
        errorObject.errorObject.e = e;
        return errorObject.errorObject;
    }
}
function tryCatch(fn) {
    tryCatchTarget = fn;
    return tryCatcher;
}
var tryCatch_2 = tryCatch;



var tryCatch_1 = {
	tryCatch: tryCatch_2
};

var __extends$2 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
var UnsubscriptionError = (function (_super) {
    __extends$2(UnsubscriptionError, _super);
    function UnsubscriptionError(errors) {
        _super.call(this);
        this.errors = errors;
        var err = Error.call(this, errors ?
            errors.length + " errors occurred during unsubscription:\n  " + errors.map(function (err, i) { return ((i + 1) + ") " + err.toString()); }).join('\n  ') : '');
        this.name = err.name = 'UnsubscriptionError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return UnsubscriptionError;
}(Error));
var UnsubscriptionError_2 = UnsubscriptionError;


var UnsubscriptionError_1 = {
	UnsubscriptionError: UnsubscriptionError_2
};

/**
 * Represents a disposable resource, such as the execution of an Observable. A
 * Subscription has one important method, `unsubscribe`, that takes no argument
 * and just disposes the resource held by the subscription.
 *
 * Additionally, subscriptions may be grouped together through the `add()`
 * method, which will attach a child Subscription to the current Subscription.
 * When a Subscription is unsubscribed, all its children (and its grandchildren)
 * will be unsubscribed as well.
 *
 * @class Subscription
 */
var Subscription = (function () {
    /**
     * @param {function(): void} [unsubscribe] A function describing how to
     * perform the disposal of resources when the `unsubscribe` method is called.
     */
    function Subscription(unsubscribe) {
        /**
         * A flag to indicate whether this Subscription has already been unsubscribed.
         * @type {boolean}
         */
        this.closed = false;
        this._parent = null;
        this._parents = null;
        this._subscriptions = null;
        if (unsubscribe) {
            this._unsubscribe = unsubscribe;
        }
    }
    /**
     * Disposes the resources held by the subscription. May, for instance, cancel
     * an ongoing Observable execution or cancel any other type of work that
     * started when the Subscription was created.
     * @return {void}
     */
    Subscription.prototype.unsubscribe = function () {
        var hasErrors = false;
        var errors;
        if (this.closed) {
            return;
        }
        var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
        this.closed = true;
        this._parent = null;
        this._parents = null;
        // null out _subscriptions first so any child subscriptions that attempt
        // to remove themselves from this subscription will noop
        this._subscriptions = null;
        var index = -1;
        var len = _parents ? _parents.length : 0;
        // if this._parent is null, then so is this._parents, and we
        // don't have to remove ourselves from any parent subscriptions.
        while (_parent) {
            _parent.remove(this);
            // if this._parents is null or index >= len,
            // then _parent is set to null, and the loop exits
            _parent = ++index < len && _parents[index] || null;
        }
        if (isFunction_1.isFunction(_unsubscribe)) {
            var trial = tryCatch_1.tryCatch(_unsubscribe).call(this);
            if (trial === errorObject.errorObject) {
                hasErrors = true;
                errors = errors || (errorObject.errorObject.e instanceof UnsubscriptionError_1.UnsubscriptionError ?
                    flattenUnsubscriptionErrors(errorObject.errorObject.e.errors) : [errorObject.errorObject.e]);
            }
        }
        if (isArray.isArray(_subscriptions)) {
            index = -1;
            len = _subscriptions.length;
            while (++index < len) {
                var sub = _subscriptions[index];
                if (isObject_1.isObject(sub)) {
                    var trial = tryCatch_1.tryCatch(sub.unsubscribe).call(sub);
                    if (trial === errorObject.errorObject) {
                        hasErrors = true;
                        errors = errors || [];
                        var err = errorObject.errorObject.e;
                        if (err instanceof UnsubscriptionError_1.UnsubscriptionError) {
                            errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                        }
                        else {
                            errors.push(err);
                        }
                    }
                }
            }
        }
        if (hasErrors) {
            throw new UnsubscriptionError_1.UnsubscriptionError(errors);
        }
    };
    /**
     * Adds a tear down to be called during the unsubscribe() of this
     * Subscription.
     *
     * If the tear down being added is a subscription that is already
     * unsubscribed, is the same reference `add` is being called on, or is
     * `Subscription.EMPTY`, it will not be added.
     *
     * If this subscription is already in an `closed` state, the passed
     * tear down logic will be executed immediately.
     *
     * @param {TeardownLogic} teardown The additional logic to execute on
     * teardown.
     * @return {Subscription} Returns the Subscription used or created to be
     * added to the inner subscriptions list. This Subscription can be used with
     * `remove()` to remove the passed teardown logic from the inner subscriptions
     * list.
     */
    Subscription.prototype.add = function (teardown) {
        if (!teardown || (teardown === Subscription.EMPTY)) {
            return Subscription.EMPTY;
        }
        if (teardown === this) {
            return this;
        }
        var subscription = teardown;
        switch (typeof teardown) {
            case 'function':
                subscription = new Subscription(teardown);
            case 'object':
                if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                    return subscription;
                }
                else if (this.closed) {
                    subscription.unsubscribe();
                    return subscription;
                }
                else if (typeof subscription._addParent !== 'function' /* quack quack */) {
                    var tmp = subscription;
                    subscription = new Subscription();
                    subscription._subscriptions = [tmp];
                }
                break;
            default:
                throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
        }
        var subscriptions = this._subscriptions || (this._subscriptions = []);
        subscriptions.push(subscription);
        subscription._addParent(this);
        return subscription;
    };
    /**
     * Removes a Subscription from the internal list of subscriptions that will
     * unsubscribe during the unsubscribe process of this Subscription.
     * @param {Subscription} subscription The subscription to remove.
     * @return {void}
     */
    Subscription.prototype.remove = function (subscription) {
        var subscriptions = this._subscriptions;
        if (subscriptions) {
            var subscriptionIndex = subscriptions.indexOf(subscription);
            if (subscriptionIndex !== -1) {
                subscriptions.splice(subscriptionIndex, 1);
            }
        }
    };
    Subscription.prototype._addParent = function (parent) {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        if (!_parent || _parent === parent) {
            // If we don't have a parent, or the new parent is the same as the
            // current parent, then set this._parent to the new parent.
            this._parent = parent;
        }
        else if (!_parents) {
            // If there's already one parent, but not multiple, allocate an Array to
            // store the rest of the parent Subscriptions.
            this._parents = [parent];
        }
        else if (_parents.indexOf(parent) === -1) {
            // Only add the new parent to the _parents list if it's not already there.
            _parents.push(parent);
        }
    };
    Subscription.EMPTY = (function (empty) {
        empty.closed = true;
        return empty;
    }(new Subscription()));
    return Subscription;
}());
var Subscription_2 = Subscription;
function flattenUnsubscriptionErrors(errors) {
    return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError_1.UnsubscriptionError) ? err.errors : err); }, []);
}


var Subscription_1 = {
	Subscription: Subscription_2
};

var empty = {
    closed: true,
    next: function (value) { },
    error: function (err) { throw err; },
    complete: function () { }
};


var Observer = {
	empty: empty
};

var rxSubscriber = createCommonjsModule(function (module, exports) {
"use strict";

var Symbol = root.root.Symbol;
exports.rxSubscriber = (typeof Symbol === 'function' && typeof Symbol.for === 'function') ?
    Symbol.for('rxSubscriber') : '@@rxSubscriber';
/**
 * @deprecated use rxSubscriber instead
 */
exports.$$rxSubscriber = exports.rxSubscriber;

});

var __extends$1 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};




/**
 * Implements the {@link Observer} interface and extends the
 * {@link Subscription} class. While the {@link Observer} is the public API for
 * consuming the values of an {@link Observable}, all Observers get converted to
 * a Subscriber, in order to provide Subscription-like capabilities such as
 * `unsubscribe`. Subscriber is a common type in RxJS, and crucial for
 * implementing operators, but it is rarely used as a public API.
 *
 * @class Subscriber<T>
 */
var Subscriber = (function (_super) {
    __extends$1(Subscriber, _super);
    /**
     * @param {Observer|function(value: T): void} [destinationOrNext] A partially
     * defined Observer or a `next` callback function.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     */
    function Subscriber(destinationOrNext, error, complete) {
        _super.call(this);
        this.syncErrorValue = null;
        this.syncErrorThrown = false;
        this.syncErrorThrowable = false;
        this.isStopped = false;
        switch (arguments.length) {
            case 0:
                this.destination = Observer.empty;
                break;
            case 1:
                if (!destinationOrNext) {
                    this.destination = Observer.empty;
                    break;
                }
                if (typeof destinationOrNext === 'object') {
                    if (destinationOrNext instanceof Subscriber) {
                        this.destination = destinationOrNext;
                        this.destination.add(this);
                    }
                    else {
                        this.syncErrorThrowable = true;
                        this.destination = new SafeSubscriber(this, destinationOrNext);
                    }
                    break;
                }
            default:
                this.syncErrorThrowable = true;
                this.destination = new SafeSubscriber(this, destinationOrNext, error, complete);
                break;
        }
    }
    Subscriber.prototype[rxSubscriber.rxSubscriber] = function () { return this; };
    /**
     * A static factory for a Subscriber, given a (potentially partial) definition
     * of an Observer.
     * @param {function(x: ?T): void} [next] The `next` callback of an Observer.
     * @param {function(e: ?any): void} [error] The `error` callback of an
     * Observer.
     * @param {function(): void} [complete] The `complete` callback of an
     * Observer.
     * @return {Subscriber<T>} A Subscriber wrapping the (partially defined)
     * Observer represented by the given arguments.
     */
    Subscriber.create = function (next, error, complete) {
        var subscriber = new Subscriber(next, error, complete);
        subscriber.syncErrorThrowable = false;
        return subscriber;
    };
    /**
     * The {@link Observer} callback to receive notifications of type `next` from
     * the Observable, with a value. The Observable may call this method 0 or more
     * times.
     * @param {T} [value] The `next` value.
     * @return {void}
     */
    Subscriber.prototype.next = function (value) {
        if (!this.isStopped) {
            this._next(value);
        }
    };
    /**
     * The {@link Observer} callback to receive notifications of type `error` from
     * the Observable, with an attached {@link Error}. Notifies the Observer that
     * the Observable has experienced an error condition.
     * @param {any} [err] The `error` exception.
     * @return {void}
     */
    Subscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            this.isStopped = true;
            this._error(err);
        }
    };
    /**
     * The {@link Observer} callback to receive a valueless notification of type
     * `complete` from the Observable. Notifies the Observer that the Observable
     * has finished sending push-based notifications.
     * @return {void}
     */
    Subscriber.prototype.complete = function () {
        if (!this.isStopped) {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        this.destination.error(err);
        this.unsubscribe();
    };
    Subscriber.prototype._complete = function () {
        this.destination.complete();
        this.unsubscribe();
    };
    Subscriber.prototype._unsubscribeAndRecycle = function () {
        var _a = this, _parent = _a._parent, _parents = _a._parents;
        this._parent = null;
        this._parents = null;
        this.unsubscribe();
        this.closed = false;
        this.isStopped = false;
        this._parent = _parent;
        this._parents = _parents;
        return this;
    };
    return Subscriber;
}(Subscription_1.Subscription));
var Subscriber_2 = Subscriber;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SafeSubscriber = (function (_super) {
    __extends$1(SafeSubscriber, _super);
    function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
        _super.call(this);
        this._parentSubscriber = _parentSubscriber;
        var next;
        var context = this;
        if (isFunction_1.isFunction(observerOrNext)) {
            next = observerOrNext;
        }
        else if (observerOrNext) {
            next = observerOrNext.next;
            error = observerOrNext.error;
            complete = observerOrNext.complete;
            if (observerOrNext !== Observer.empty) {
                context = Object.create(observerOrNext);
                if (isFunction_1.isFunction(context.unsubscribe)) {
                    this.add(context.unsubscribe.bind(context));
                }
                context.unsubscribe = this.unsubscribe.bind(this);
            }
        }
        this._context = context;
        this._next = next;
        this._error = error;
        this._complete = complete;
    }
    SafeSubscriber.prototype.next = function (value) {
        if (!this.isStopped && this._next) {
            var _parentSubscriber = this._parentSubscriber;
            if (!_parentSubscriber.syncErrorThrowable) {
                this.__tryOrUnsub(this._next, value);
            }
            else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._error) {
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._error, err);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, this._error, err);
                    this.unsubscribe();
                }
            }
            else if (!_parentSubscriber.syncErrorThrowable) {
                this.unsubscribe();
                throw err;
            }
            else {
                _parentSubscriber.syncErrorValue = err;
                _parentSubscriber.syncErrorThrown = true;
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.complete = function () {
        var _this = this;
        if (!this.isStopped) {
            var _parentSubscriber = this._parentSubscriber;
            if (this._complete) {
                var wrappedComplete = function () { return _this._complete.call(_this._context); };
                if (!_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(wrappedComplete);
                    this.unsubscribe();
                }
                else {
                    this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                    this.unsubscribe();
                }
            }
            else {
                this.unsubscribe();
            }
        }
    };
    SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            this.unsubscribe();
            throw err;
        }
    };
    SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
        try {
            fn.call(this._context, value);
        }
        catch (err) {
            parent.syncErrorValue = err;
            parent.syncErrorThrown = true;
            return true;
        }
        return false;
    };
    SafeSubscriber.prototype._unsubscribe = function () {
        var _parentSubscriber = this._parentSubscriber;
        this._context = null;
        this._parentSubscriber = null;
        _parentSubscriber.unsubscribe();
    };
    return SafeSubscriber;
}(Subscriber));


var Subscriber_1 = {
	Subscriber: Subscriber_2
};

function toSubscriber(nextOrObserver, error, complete) {
    if (nextOrObserver) {
        if (nextOrObserver instanceof Subscriber_1.Subscriber) {
            return nextOrObserver;
        }
        if (nextOrObserver[rxSubscriber.rxSubscriber]) {
            return nextOrObserver[rxSubscriber.rxSubscriber]();
        }
    }
    if (!nextOrObserver && !error && !complete) {
        return new Subscriber_1.Subscriber(Observer.empty);
    }
    return new Subscriber_1.Subscriber(nextOrObserver, error, complete);
}
var toSubscriber_2 = toSubscriber;


var toSubscriber_1 = {
	toSubscriber: toSubscriber_2
};

var observable = createCommonjsModule(function (module, exports) {
"use strict";

function getSymbolObservable(context) {
    var $$observable;
    var Symbol = context.Symbol;
    if (typeof Symbol === 'function') {
        if (Symbol.observable) {
            $$observable = Symbol.observable;
        }
        else {
            $$observable = Symbol('observable');
            Symbol.observable = $$observable;
        }
    }
    else {
        $$observable = '@@observable';
    }
    return $$observable;
}
exports.getSymbolObservable = getSymbolObservable;
exports.observable = getSymbolObservable(root.root);
/**
 * @deprecated use observable instead
 */
exports.$$observable = exports.observable;

});

/**
 * A representation of any set of values over any amount of time. This the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = (function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is  called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable$$1 = new Observable();
        observable$$1.source = this;
        observable$$1.operator = operator;
        return observable$$1;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this._trySubscribe(sink));
        }
        if (sink.syncErrorThrowable) {
            sink.syncErrorThrowable = false;
            if (sink.syncErrorThrown) {
                throw sink.syncErrorValue;
            }
        }
        return sink;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.syncErrorThrown = true;
            sink.syncErrorValue = err;
            sink.error(err);
        }
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [PromiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, PromiseCtor) {
        var _this = this;
        if (!PromiseCtor) {
            if (root.root.Rx && root.root.Rx.config && root.root.Rx.config.Promise) {
                PromiseCtor = root.root.Rx.config.Promise;
            }
            else if (root.root.Promise) {
                PromiseCtor = root.root.Promise;
            }
        }
        if (!PromiseCtor) {
            throw new Error('no Promise impl found');
        }
        return new PromiseCtor(function (resolve, reject) {
            // Must be declared in a separate statement to avoid a RefernceError when
            // accessing subscription below in the closure due to Temporal Dead Zone.
            var subscription;
            subscription = _this.subscribe(function (value) {
                if (subscription) {
                    // if there is a subscription, then we can surmise
                    // the next handling is asynchronous. Any errors thrown
                    // need to be rejected explicitly and unsubscribe must be
                    // called manually
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscription.unsubscribe();
                    }
                }
                else {
                    // if there is NO subscription, then we're getting a nexted
                    // value synchronously during subscription. We can just call it.
                    // If it errors, Observable's `subscribe` will ensure the
                    // unsubscription logic is called, then synchronously rethrow the error.
                    // After that, Promise will trap the error and send it
                    // down the rejection path.
                    next(value);
                }
            }, reject, resolve);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        return this.source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable.observable] = function () {
        return this;
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
var Observable_2 = Observable;


var Observable_1 = {
	Observable: Observable_2
};

var __extends$3 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * An error thrown when an action is invalid because the object has been
 * unsubscribed.
 *
 * @see {@link Subject}
 * @see {@link BehaviorSubject}
 *
 * @class ObjectUnsubscribedError
 */
var ObjectUnsubscribedError = (function (_super) {
    __extends$3(ObjectUnsubscribedError, _super);
    function ObjectUnsubscribedError() {
        var err = _super.call(this, 'object unsubscribed');
        this.name = err.name = 'ObjectUnsubscribedError';
        this.stack = err.stack;
        this.message = err.message;
    }
    return ObjectUnsubscribedError;
}(Error));
var ObjectUnsubscribedError_2 = ObjectUnsubscribedError;


var ObjectUnsubscribedError_1 = {
	ObjectUnsubscribedError: ObjectUnsubscribedError_2
};

var __extends$4 = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};

/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubjectSubscription = (function (_super) {
    __extends$4(SubjectSubscription, _super);
    function SubjectSubscription(subject, subscriber) {
        _super.call(this);
        this.subject = subject;
        this.subscriber = subscriber;
        this.closed = false;
    }
    SubjectSubscription.prototype.unsubscribe = function () {
        if (this.closed) {
            return;
        }
        this.closed = true;
        var subject = this.subject;
        var observers = subject.observers;
        this.subject = null;
        if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
            return;
        }
        var subscriberIndex = observers.indexOf(this.subscriber);
        if (subscriberIndex !== -1) {
            observers.splice(subscriberIndex, 1);
        }
    };
    return SubjectSubscription;
}(Subscription_1.Subscription));
var SubjectSubscription_2 = SubjectSubscription;


var SubjectSubscription_1 = {
	SubjectSubscription: SubjectSubscription_2
};

var __extends = (commonjsGlobal && commonjsGlobal.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};






/**
 * @class SubjectSubscriber<T>
 */
var SubjectSubscriber = (function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        _super.call(this, destination);
        this.destination = destination;
    }
    return SubjectSubscriber;
}(Subscriber_1.Subscriber));
/**
 * @class Subject<T>
 */
var Subject = (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        _super.call(this);
        this.observers = [];
        this.closed = false;
        this.isStopped = false;
        this.hasError = false;
        this.thrownError = null;
    }
    Subject.prototype[rxSubscriber.rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription_1.Subscription.EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return Subscription_1.Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
        }
    };
    Subject.prototype.asObservable = function () {
        var observable = new Observable_1.Observable();
        observable.source = this;
        return observable;
    };
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable_1.Observable));
/**
 * @class AnonymousSubject<T>
 */
var AnonymousSubject = (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        _super.call(this);
        this.destination = destination;
        this.source = source;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription_1.Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject));

(function () {
    class FilePicker$$1 {
        constructor(inputElement) {
            this.inputElement = inputElement;
            this.observers = [];
            inputElement.addEventListener('change', (event) => {
                const fileList = event.target.files;
                if (fileList.length >= 1) {
                    const file = fileList[0];
                    this.observers.forEach(observer => observer(file));
                }
            });
        }
        addObserver(observer) {
            this.observers.push(observer);
        }
        reset() {
            this.inputElement.value = '';
        }
    }
    class JsonFileParser {
        constructor() {
            this.fileReader = new FileReader();
            this.observers = [];
            this.fileReader.onload = (e) => {
                try {
                    const result = JSON.parse(this.fileReader.result);
                    this.observers.forEach(observer => observer(result));
                }
                catch (error) {
                    window.alert('import palette failed. please start with the sample file and try again.');
                }
            };
        }
        addObserver(observer) {
            this.observers.push(observer);
        }
        parseFile(file) {
            this.fileReader.readAsText(file);
        }
    }
    class Model {
        constructor() {
            // TODO add palette and matrix into model as well
            this.backgrounds = [];
            this.foregrounds = [];
        }
    }
    class View {
        constructor(model) {
            this.model = model;
            this.matrix = document.querySelectorAll('.matrix')[0];
            this.paletteForegrounds = document.querySelectorAll('.palette__foregrounds')[0];
            this.paletteBackgrounds = document.querySelectorAll('.palette__backgrounds')[0];
        }
        render() {
            this.renderMatrix();
            this.renderPalette();
            const model = encodeURIComponent(JSON.stringify(this.model));
            history.replaceState(model, 'matrix', '?m=' + model);
        }
        renderPalette() {
            this.cleanUpElement(this.paletteForegrounds);
            const matrixRows = document.getElementsByClassName('matrix__row');
            for (let i = 0; i < matrixRows.length; i++) {
                let matrixRow = matrixRows[i], background = this.model.backgrounds[i];
                const swatch = document.createElement('div');
                swatch.classList.add('palette__swatch');
                const colorCode = document.createElement('span');
                colorCode.classList.add('palette__color-code');
                colorCode.innerHTML = background.color.hexString;
                swatch.appendChild(colorCode);
                const letterTContainer = document.createElement('span');
                letterTContainer.classList.add('palette__background-demo-container');
                swatch.style.color = background.color.hexString;
                swatch.appendChild(letterTContainer);
                swatch.setAttribute('title', background.name);
                matrixRow.insertBefore(swatch, matrixRow.firstChild);
            }
            // pseudo header. leave blank
            const swatch = document.createElement('div');
            swatch.classList.add('dummy__swatch');
            const letterT = document.createElement('span');
            const letterTContainer = document.createElement('span');
            swatch.appendChild(letterTContainer);
            this.paletteForegrounds.appendChild(swatch);
            for (let foreground of this.model.foregrounds) {
                const swatch = document.createElement('div');
                swatch.classList.add('palette__swatch');
                const colorCode = document.createElement('span');
                colorCode.classList.add('palette__color-code');
                colorCode.innerHTML = foreground.color.hexString;
                swatch.appendChild(colorCode);
                const letterT = document.createElement('span');
                letterT.classList.add('palette__foreground-demo');
                letterT.innerHTML = 'Text';
                const letterTContainer = document.createElement('span');
                letterTContainer.classList.add('palette__foreground-demo-container');
                letterTContainer.appendChild(letterT);
                swatch.style.color = foreground.color.hexString;
                swatch.appendChild(letterTContainer);
                swatch.setAttribute('title', foreground.name);
                this.paletteForegrounds.appendChild(swatch);
            }
        }
        renderMatrix() {
            this.cleanUpElement(this.matrix);
            const fragment = document.createDocumentFragment();
            for (let i = 0; i < this.model.backgrounds.length; i++) {
                const backgroundColor = this.model.backgrounds[i].color;
                const row = document.createElement('div');
                row.classList.add('matrix__row');
                fragment.appendChild(row);
                for (let j = 0; j < this.model.foregrounds.length; j++) {
                    const foregroundColor = this.model.foregrounds[j].color;
                    const swatch = document.createElement('div');
                    swatch.classList.add('matrix__swatch');
                    swatch.style.backgroundColor = backgroundColor.hexString;
                    const contrast = foregroundColor.getContrastOnBackground(backgroundColor);
                    const rating = this.getWCAG2Rating(contrast);
                    swatch.setAttribute('data-fg', foregroundColor.hexString);
                    swatch.setAttribute('data-bg', backgroundColor.hexString);
                    swatch.setAttribute('data-ratio', contrast.toString());
                    swatch.setAttribute('data-rating', rating);
                    const contrastRatio = document.createElement('span');
                    contrastRatio.classList.add('matrix__contrast-ratio');
                    contrastRatio.style.color = foregroundColor.hexString;
                    contrastRatio.innerHTML = contrast.toString();
                    swatch.appendChild(contrastRatio);
                    const displayRating = document.createElement('span');
                    displayRating.classList.add('matrix__rating-badge');
                    displayRating.style.color = backgroundColor.hexString;
                    displayRating.style.backgroundColor = foregroundColor.hexString;
                    displayRating.innerHTML = rating;
                    swatch.appendChild(displayRating);
                    swatch.setAttribute('title', `"${this.model.foregrounds[j].name}" on "${this.model.backgrounds[i].name}"`);
                    swatch.addEventListener('click', () => this.onSelect(i, j, swatch));
                    row.appendChild(swatch);
                }
            }
            this.matrix.appendChild(fragment);
        }
        cleanUpElement(element) {
            while (element.hasChildNodes()) {
                element.removeChild(element.lastChild);
            }
        }
        getWCAG2Rating(contrastRatio) {
            if (contrastRatio <= 3) {
                return 'FAIL';
            }
            else if (contrastRatio <= 4.5) {
                return 'AA LARGE';
            }
            else if (contrastRatio <= 7) {
                return 'AA';
            }
            else if (contrastRatio <= 22) {
                return 'AAA';
            }
            else {
                throw ('invalid ratio contrast ratio');
            }
        }
        onSelect(row, column, swatch) {
            // remove all exist selections
            const selectedPaletteSwatches = document.querySelectorAll('.palette__swatch--selected');
            for (let i = 0; i < selectedPaletteSwatches.length; i++) {
                const selectedBackgroundSwatch = selectedPaletteSwatches[i];
                selectedBackgroundSwatch.classList.remove('palette__swatch--selected');
            }
            const selectedMatrixSwatch = document.querySelectorAll('.matrix__swatch--selected');
            if (selectedMatrixSwatch.length) {
                selectedMatrixSwatch[0].classList.remove('matrix__swatch--selected');
            }
            // select matrix swatch
            swatch.classList.add('matrix__swatch--selected');
            // select palette swatch
            const backgroundPaletteSwatches = document.querySelectorAll('.matrix .palette__swatch');
            for (let i = 0; i < backgroundPaletteSwatches.length; i++) {
                const selectedBackgroundSwatch = backgroundPaletteSwatches[i];
                i === row ? selectedBackgroundSwatch.classList.add('palette__swatch--selected') : selectedBackgroundSwatch.classList.remove('palette__swatch--selected');
            }
            const foregroundPaletteSwatches = document.querySelectorAll('.palette__foregrounds .palette__swatch');
            for (let i = 0; i < foregroundPaletteSwatches.length; i++) {
                const selectedForegroundSwatch = foregroundPaletteSwatches[i];
                i === column ? selectedForegroundSwatch.classList.add('palette__swatch--selected') : selectedForegroundSwatch.classList.remove('palette__swatch--selected');
            }
        }
    }
    class Controller {
        constructor(model, view) {
            this.model = model;
            this.view = view;
            this.addBackground = document.getElementsByClassName('editor__add-background')[0];
            this.addForeground = document.getElementsByClassName('editor__add-foreground')[0];
            this.colorPicker = document.getElementsByClassName('editor__color-picker')[0];
            this.inputElement = document.getElementsByClassName('loader')[0];
            this.loader = new FilePicker$$1(this.inputElement);
            this.parser = new JsonFileParser();
            this.backgroundNewCounter = 0;
            this.foregroundNewCounter = 0;
            this.handleInput();
            this.view.render();
        }
        handleInput() {
            this.addBackground.addEventListener('click', () => {
                try {
                    this.model.backgrounds.unshift({
                        name: "background " + ++this.backgroundNewCounter,
                        color: new Color(this.colorPicker.value)
                    });
                    this.view.render();
                }
                catch (e) {
                    window.alert('invalid color value');
                }
            });
            this.addForeground.addEventListener('click', () => {
                try {
                    this.model.foregrounds.unshift({
                        name: "foreground " + ++this.foregroundNewCounter,
                        color: new Color(this.colorPicker.value)
                    });
                    this.view.render();
                }
                catch (e) {
                    window.alert('invalid color value');
                }
            });
            this.loader.addObserver(file => this.parser.parseFile(file));
            this.parser.addObserver(object => {
                this.model.backgrounds = object.backgrounds.map((item) => ({ name: item.name, color: new Color(item.value) }));
                this.model.foregrounds = object.foregrounds.map((item) => ({ name: item.name, color: new Color(item.value) }));
                this.view.render();
                this.loader.reset();
            });
        }
    }
    window.onload = function () {
        let model;
        // init model from url if avaialbe
        const pathArray = location.search.split('?m=');
        if (pathArray.length > 1) {
            const modelString = pathArray[pathArray.length - 1];
            model = JSON.parse(decodeURIComponent(modelString));
            for (let background of model.backgrounds) {
                background.color = new Color(background.color.rgba); // rebuild color object from string
            }
            for (let foreground of model.foregrounds) {
                foreground.color = new Color(foreground.color.rgba); // rebuild color object from string
            }
        }
        else {
            model = new Model();
            model.backgrounds = [
                { name: 'Absolutely Black', color: new Color('rgba(0, 0, 0, 1)') },
                { name: 'Gandalf the Grey', color: new Color('rgba(120, 120, 120, 1)') },
                { name: 'Absolutely White', color: new Color('rgba(255, 255, 255, 1)') },
            ];
            model.foregrounds = [
                { name: 'Darth Vader Black', color: new Color('rgba(10, 10, 10, 1)') },
                { name: 'The 25th shade of Grey', color: new Color('rgba(128, 128, 128, 1)') },
                { name: 'Not-quite White', color: new Color('rgba(240, 240, 240, 1)') },
            ];
        }
        let view = new View(model);
        let controller = new Controller(model, view);
    };
})();

}());
