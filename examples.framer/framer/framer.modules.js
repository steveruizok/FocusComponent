require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"FocusComponent":[function(require,module,exports){
var FocusComponent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

FocusComponent = (function(superClass) {
  extend(FocusComponent, superClass);

  function FocusComponent(options) {
    var ref, ref1, ref10, ref11, ref12, ref13, ref14, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
    if (options == null) {
      options = {};
    }
    this._subjects = [];
    this._focusedSubjects = [];
    this._maxFocused = (ref = options.maxFocused) != null ? ref : 1;
    this._toggle = (ref1 = options.toggle) != null ? ref1 : true;
    this._toggleLock = (ref2 = options.toggleLock) != null ? ref2 : false;
    this._trigger = (ref3 = options.trigger) != null ? ref3 : 'Tap';
    this._defaultFocused = (ref4 = (ref5 = options.states) != null ? ref5.focused : void 0) != null ? ref4 : {
      opacity: 1
    };
    this._defaultUnfocused = (ref6 = (ref7 = options.states) != null ? ref7.unfocused : void 0) != null ? ref6 : ((ref8 = options.states) != null ? ref8.focused : void 0) != null ? void 0 : {
      opacity: .5
    };
    this._defaultFocus = (ref9 = options.focus) != null ? ref9 : function() {
      return null;
    };
    this._defaultUnfocus = (ref10 = options.unfocus) != null ? ref10 : function() {
      return null;
    };
    this._defaultNotify = (ref11 = options.notify) != null ? ref11 : function() {
      return null;
    };
    this._notifyOnFocus = (ref12 = options.notifyOnFocus) != null ? ref12 : true;
    this._useFocusStates = (ref13 = options.useFocusStates) != null ? ref13 : true;
    this._useFocusFunctions = (ref14 = options.useFocusFunctions) != null ? ref14 : true;
    FocusComponent.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      size: Screen.size,
      backgroundColor: null
    }));
  }

  FocusComponent.prototype.notifyFocusedSubjects = function(func) {
    var i, len, ref, results, subject;
    if (func == null) {
      func = this._defaultFocus;
    }
    ref = this._focusedSubjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(_.bind(func, subject)());
    }
    return results;
  };

  FocusComponent.prototype.notifyUnfocusedSubjects = function(func) {
    var i, len, ref, results, subject;
    if (func == null) {
      func = this._defaultUnfocus;
    }
    ref = this._unfocusedSubjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(_.bind(func, subject)());
    }
    return results;
  };

  FocusComponent.prototype.notifySubjects = function(func) {
    var i, len, ref, results, subject;
    if (func == null) {
      func = this._defaultNotify;
    }
    ref = this._subjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(_.bind(func, subject)());
    }
    return results;
  };

  FocusComponent.prototype.notifySelected = function(subjects, func) {
    var i, len, ref, results, subject;
    if (subjects == null) {
      subjects = this._subjects;
    }
    if (func == null) {
      func = this._defaultNotify;
    }
    if (typeof subjects === 'object') {
      subjects = [subjects];
    }
    ref = this._subjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(_.bind(func, subject)());
    }
    return results;
  };

  FocusComponent.prototype.unfocusAll = function(instant) {
    var i, len, ref, results, subject;
    if (instant == null) {
      instant = false;
    }
    ref = this._focusedSubjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(this._setFocused(false, instant));
    }
    return results;
  };

  FocusComponent.prototype._focus = function(subject) {
    return _.bind(this._defaultFocus, subject)();
  };

  FocusComponent.prototype._unfocus = function(subject) {
    return _.bind(this._defaultUnfocus, subject)();
  };

  FocusComponent.prototype.addTrigger = function(subject, eventName) {
    if (eventName == null) {
      eventName = this._trigger;
    }
    return subject.on(Events[eventName], (function(_this) {
      return function() {
        if (_this._isFocused(subject) === true && _this._toggle === false) {
          return;
        }
        return _this._setFocused(subject, true);
      };
    })(this));
  };

  FocusComponent.prototype.removeTrigger = function(subject, eventName) {
    if (eventName == null) {
      eventName = this._trigger;
    }
    return subject.off(Events[eventName], (function(_this) {
      return function() {
        if (_this._isFocused(subject) === true && _this._toggle === false) {
          return;
        }
        return _this._setFocused(subject, true);
      };
    })(this));
  };

  FocusComponent.prototype._setFocused = function(subject, bool, instant) {
    if (bool === true) {
      if (this._isFocused(subject) === true) {
        if (this._toggle === true) {
          this._setFocused(subject, false, instant);
        }
        return null;
      }
      if (_.size(this._focusedSubjects) >= this._maxFocused && this._toggleLock === true) {
        return;
      }
      this._addToFocusedSubjects(subject, instant);
      if (this._useFocusStates === true) {
        if (instant) {
          subject.stateSwitch('focused');
        } else {
          subject.animate('focused');
        }
      }
      if (this._useFocusFunctions === true) {
        return this._focus(subject);
      }
    } else {
      if (this._isFocused(subject) === false) {
        return;
      }
      this._removeFromFocusedSubjects(subject);
      if (this._useFocusStates === true) {
        if (instant) {
          subject.stateSwitch('unfocused');
        } else {
          subject.animate('unfocused');
        }
      }
      if (this._useFocusFunctions === true) {
        return this._unfocus(subject);
      }
    }
  };

  FocusComponent.prototype.addSubject = function(newSubject, options) {
    var focused, focusedState, ref, ref1, ref2, ref3, ref4, trigger, unfocusedState;
    if (options == null) {
      options = {};
    }
    trigger = (ref = options.trigger) != null ? ref : this._trigger;
    focused = (ref1 = options.focused) != null ? ref1 : false;
    focusedState = (ref2 = options.focusedState) != null ? ref2 : newSubject.states.focused;
    unfocusedState = (ref3 = options.unfocusedState) != null ? ref3 : newSubject.states.unfocused;
    if (newSubject instanceof Layer === false) {
      throw "Observer can only add layers to its list of subjects. " + layer + ", id " + layer.id + " is not a layer.";
    }
    this.addTrigger(newSubject, trigger);
    newSubject.states.focused = focusedState != null ? focusedState : this._defaultFocused;
    newSubject.states.unfocused = (ref4 = unfocusedState != null ? unfocusedState : this._defaultUnfocused) != null ? ref4 : newSubject.states["default"];
    this._subjects.push(newSubject);
    this._setFocused(newSubject, focused, true);
    if (this._useFocusStates === true) {
      newSubject.stateSwitch('unfocused');
    }
    if (this._useFocusFunctions === true) {
      return this._unfocus(newSubject);
    }
  };

  FocusComponent.prototype.removeSubject = function(subject) {
    var ref;
    if (_.includes(this._subjects, subject) === false) {
      if (subject instanceof Layer === true) {
        throw "That layer (" + ((ref = layer.name) != null ? ref : layer) + ", id: " + layer.id + ") isn't a subject.";
      } else {
        throw "That isn't a layer. Observer can only remove layers that are on its list of subject layers.";
      }
    }
    if (this._isFocused(subject)) {
      this._removeFromFocusedSubjects(subject, false);
    }
    _.pull(this._subjects, subject);
    return this.removeTrigger(subject);
  };

  FocusComponent.define("trigger", {
    get: function() {
      return this._trigger;
    },
    set: function(eventName) {
      if (typeof eventName !== 'string') {
        throw "FocusComponent.trigger requires an event name as string, like 'Tap' or 'MouseOver'.";
      }
      return this._trigger = eventName;
    }
  });

  FocusComponent.define("notify", {
    get: function() {
      return this._defaultNotify;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "FocusComponent.notify requires a function value.";
      }
      return this._defaultNotify = func;
    }
  });

  FocusComponent.define("notifyOnFocus", {
    get: function() {
      return this._notifyOnFocus;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "FocusComponent.notifyOnFocus requires a boolean (true or false) value.";
      }
      return this._notifyOnFocus = bool;
    }
  });

  FocusComponent.define("maxFocused", {
    get: function() {
      return this._maxFocused;
    },
    set: function(number) {
      if (typeof number !== 'number') {
        throw "FocusComponent.maxFocused requires a number value.";
      }
      return this._maxFocused = number;
    }
  });

  FocusComponent.define("toggleLock", {
    get: function() {
      return this._toggleLock;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "FocusComponent.toggleLock requires a boolean (true or false) value.";
      }
      return this._toggleLock = bool;
    }
  });

  FocusComponent.define("useFocusFunctions", {
    get: function() {
      return this._useFocusFunctions;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "FocusComponent.useFocusFunctions requires a boolean (true or false) value.";
      }
      return this._useFocusFunctions = bool;
    }
  });

  FocusComponent.define("focus", {
    get: function() {
      return this._defaultFocus;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "FocusComponent.focus requires a function value.";
      }
      return this._defaultFocus = func;
    }
  });

  FocusComponent.define("unfocus", {
    get: function() {
      return this._defaultUnfocus;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "FocusComponent.unfocus requires a function value.";
      }
      return this._defaultUnfocus = func;
    }
  });

  FocusComponent.define("focused", {
    get: function() {
      return this._focusedSubjects;
    },
    set: function(layers) {
      if (_.isArray(layers) === false) {
        layers = [layers];
      }
      return layers.forEach((function(_this) {
        return function(layer) {
          if (_this._isFocused(layer) === false) {
            return _this._addToFocusedSubjects(layer, true);
          }
        };
      })(this));
    }
  });

  FocusComponent.define("unfocused", {
    get: function() {
      return _.without(this._subjects, this._focusedSubjects);
    },
    set: function(layers) {
      if (_.isArray(layers) === false) {
        layers = [layers];
      }
      return layers.forEach((function(_this) {
        return function(layer) {
          if (_this._isFocused(layer) === true) {
            return _this._removeFromFocusedSubjects(layer, true);
          }
        };
      })(this));
    }
  });

  FocusComponent.define("useFocusStates", {
    get: function() {
      return this._useFocusStates;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "FocusComponent.useFocusStates requires a boolean value.";
      }
      return this._useFocusStates = bool;
    }
  });

  FocusComponent.define("subjects", {
    get: function() {
      return this._subjects;
    },
    set: function(layers) {
      var adiosSubjects, i, j, k, layer, len, len1, len2, ref, subject;
      if (_.isArray(layers) === false || layers.length < 0) {
        throw 'Subjects requires an array.';
      }
      this._focusedSubjects = _.intersection(this._focusedSubjects, layers);
      adiosSubjects = _.difference(this._subjects, layers);
      for (i = 0, len = adiosSubjects.length; i < len; i++) {
        subject = adiosSubjects[i];
        this.removeSubject(subject);
      }
      for (j = 0, len1 = layers.length; j < len1; j++) {
        layer = layers[j];
        this.addSubject(layer);
      }
      ref = this._subjects;
      for (k = 0, len2 = ref.length; k < len2; k++) {
        subject = ref[k];
        subject.observer = this;
      }
      if (!_.includes(this._subjects, this._focusedSubject)) {
        return this._focusedSubject = void 0;
      }
    }
  });

  FocusComponent.prototype._isFocused = function(subject) {
    return _.includes(this._focusedSubjects, subject);
  };

  FocusComponent.prototype._addToFocusedSubjects = function(subject, instant) {
    if (instant == null) {
      instant = false;
    }
    if (this._isFocused(subject) === true) {
      throw "Focused on a focused subject. Is that right?";
    }
    if (_.size(this._focusedSubjects) >= this._maxFocused) {
      this._setFocused(this._focusedSubjects[0], false, instant);
      return this._addToFocusedSubjects(subject, instant);
    } else {
      this._focusedSubjects.push(subject);
      if (this._notifyOnFocus === true) {
        return this.notifySubjects();
      }
    }
  };

  FocusComponent.prototype._removeFromFocusedSubjects = function(subject, instant) {
    if (instant == null) {
      instant = false;
    }
    if (this._isFocused(subject) === false) {
      throw "Tried to remove a layer that wasn't focused.";
    }
    return _.pull(this._focusedSubjects, subject);
  };

  return FocusComponent;

})(Layer);

exports.FocusComponent = FocusComponent;


},{}],"ObserverComponent":[function(require,module,exports){
var ObserverComponent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ObserverComponent = (function(superClass) {
  extend(ObserverComponent, superClass);

  function ObserverComponent(options) {
    var ref, ref1, ref10, ref11, ref12, ref13, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
    if (options == null) {
      options = {};
    }
    this._subscribers = [];
    this._focusedSubscribers = [];
    this._maxFocused = (ref = options.maxFocused) != null ? ref : 1;
    this._toggle = (ref1 = options.toggle) != null ? ref1 : true;
    this._trigger = (ref2 = options.trigger) != null ? ref2 : 'Tap';
    this._defaultFocused = (ref3 = (ref4 = options.states) != null ? ref4.focused : void 0) != null ? ref3 : {
      opacity: 1
    };
    this._defaultUnfocused = (ref5 = (ref6 = options.states) != null ? ref6.unfocused : void 0) != null ? ref5 : ((ref7 = options.states) != null ? ref7.focused : void 0) != null ? void 0 : {
      opacity: .5
    };
    this._defaultFocus = (ref8 = options.focus) != null ? ref8 : function() {
      return null;
    };
    this._defaultUnfocus = (ref9 = options.unfocus) != null ? ref9 : function() {
      return null;
    };
    this._defaultNotify = (ref10 = options.notify) != null ? ref10 : function() {
      return null;
    };
    this._notifyOnFocus = (ref11 = options.notifyOnFocus) != null ? ref11 : true;
    this._useFocusStates = (ref12 = options.useFocusStates) != null ? ref12 : true;
    this._useFocusFunctions = (ref13 = options.useFocusFunctions) != null ? ref13 : true;
    ObserverComponent.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      size: Screen.size,
      backgroundColor: null
    }));
  }

  ObserverComponent.prototype.notifyFocusedSubscribers = function(func) {
    var i, len, ref, results, subscriber;
    if (func == null) {
      func = this._defaultFocus;
    }
    ref = this._focusedSubscribers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subscriber = ref[i];
      results.push(_.bind(func, subscriber)());
    }
    return results;
  };

  ObserverComponent.prototype.notifyUnfocusedSubscribers = function(func) {
    var i, len, ref, results, subscriber;
    if (func == null) {
      func = this._defaultUnfocus;
    }
    ref = this._unfocusedSubscribers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subscriber = ref[i];
      results.push(_.bind(func, subscriber)());
    }
    return results;
  };

  ObserverComponent.prototype.notifySubscribers = function(func) {
    var i, len, ref, results, subscriber;
    if (func == null) {
      func = this._defaultNotify;
    }
    ref = this._subscribers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subscriber = ref[i];
      results.push(_.bind(func, subscriber)());
    }
    return results;
  };

  ObserverComponent.prototype.notifySelected = function(subscribers, func) {
    var i, len, ref, results, subscriber;
    if (subscribers == null) {
      subscribers = this._subscribers;
    }
    if (func == null) {
      func = this._defaultNotify;
    }
    if (typeof subscribers === 'object') {
      subscribers = [subscribers];
    }
    ref = this._subscribers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subscriber = ref[i];
      results.push(_.bind(func, subscriber)());
    }
    return results;
  };

  ObserverComponent.prototype.unfocusAll = function(instant) {
    var i, len, ref, results, subscriber;
    if (instant == null) {
      instant = false;
    }
    ref = this._focusedSubscribers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subscriber = ref[i];
      results.push(this._setFocused(false, instant));
    }
    return results;
  };

  ObserverComponent.prototype._focus = function(subscriber) {
    return _.bind(this._defaultFocus, subscriber)();
  };

  ObserverComponent.prototype._unfocus = function(subscriber) {
    return _.bind(this._defaultUnfocus, subscriber)();
  };

  ObserverComponent.prototype.addFocusTrigger = function(subscriber, eventName) {
    if (eventName == null) {
      eventName = this._trigger;
    }
    return subscriber.on(Events[eventName], (function(_this) {
      return function() {
        return _this._setFocused(subscriber, true);
      };
    })(this));
  };

  ObserverComponent.prototype.removeFocusTrigger = function(subscriber, eventName) {
    if (eventName == null) {
      eventName = this._trigger;
    }
    return subscriber.off(Events[eventName], (function(_this) {
      return function() {
        return _this._setFocused(subscriber, true);
      };
    })(this));
  };

  ObserverComponent.prototype._setFocused = function(subscriber, bool, instant) {
    if (bool === true) {
      if (this._isFocused(subscriber) === true) {
        if (this._toggle === true) {
          this._setFocused(subscriber, false, instant);
        }
        return null;
      }
      this._addToFocusedSubscribers(subscriber, instant);
      if (this._useFocusStates === true) {
        if (instant) {
          subscriber.stateSwitch('focused');
        } else {
          subscriber.animate('focused');
        }
      }
      if (this._useFocusFunctions === true) {
        return this._focus(subscriber);
      }
    } else {
      if (this._isFocused(subscriber) === false) {
        return null;
      }
      this._removeFromFocusedSubscribers(subscriber);
      if (this._useFocusStates === true) {
        if (instant) {
          subscriber.stateSwitch('unfocused');
        } else {
          subscriber.animate('unfocused');
        }
      }
      if (this._useFocusFunctions === true) {
        return this._unfocus(subscriber);
      }
    }
  };

  ObserverComponent.prototype.addSubscriber = function(newSubscriber, options) {
    var focused, focusedState, ref, ref1, ref2, ref3, ref4, trigger, unfocusedState;
    if (options == null) {
      options = {};
    }
    trigger = (ref = options.trigger) != null ? ref : this._trigger;
    focused = (ref1 = options.focused) != null ? ref1 : false;
    focusedState = (ref2 = options.focusedState) != null ? ref2 : newSubscriber.states.focused;
    unfocusedState = (ref3 = options.unfocusedState) != null ? ref3 : newSubscriber.states.unfocused;
    if (newSubscriber instanceof Layer === false) {
      throw "Observer can only add layers to its list of subscribers. " + layer + ", id " + layer.id + " is not a layer.";
    }
    this.addFocusTrigger(newSubscriber, trigger);
    newSubscriber.states.focused = focusedState != null ? focusedState : this._defaultFocused;
    newSubscriber.states.unfocused = (ref4 = unfocusedState != null ? unfocusedState : this._defaultUnfocused) != null ? ref4 : newSubscriber.states["default"];
    this._subscribers.push(newSubscriber);
    this._setFocused(newSubscriber, focused, true);
    if (this._useFocusStates === true) {
      newSubscriber.stateSwitch('unfocused');
    }
    if (this._useFocusFunctions === true) {
      return this._unfocus(newSubscriber);
    }
  };

  ObserverComponent.prototype.removeSubscriber = function(layer) {
    var ref;
    if (_.includes(this._subscribers, layer) === false) {
      if (layer instanceof Layer === true) {
        throw "That layer (" + ((ref = layer.name) != null ? ref : layer) + ", id: " + layer.id + ") isn't a subscriber.";
      } else {
        throw "That isn't a layer. Observer can only remove layers that are on its list of subscriber layers.";
      }
    }
    if (this._isFocused(layer)) {
      this._removeFromFocusedSubscribers(layer, false);
    }
    _.pull(this._subscribers, layer);
    layer.observer = void 0;
    layer.focus = void 0;
    layer.unfocus = void 0;
    layer.notify = void 0;
    return layer.removeFocusTrigger(layer._trigger);
  };

  ObserverComponent.define("notify", {
    get: function() {
      return this._defaultNotify;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "ObserverComponent.notify requires a function value.";
      }
      return this._defaultNotify = func;
    }
  });

  ObserverComponent.define("notifyOnFocus", {
    get: function() {
      return this._notifyOnFocus;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "ObserverComponent.notifyOnFocus requires a boolean (true or false) value.";
      }
      return this._notifyOnFocus = bool;
    }
  });

  ObserverComponent.define("maxFocused", {
    get: function() {
      return this._maxFocused;
    },
    set: function(number) {
      if (typeof number !== 'number') {
        throw "ObserverComponent.maxFocused requires a number value.";
      }
      return this._maxFocused = number;
    }
  });

  ObserverComponent.define("useFocusFunctions", {
    get: function() {
      return this._useFocusFunctions;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "ObserverComponent.focusFunctions requires a boolean (true or false) value.";
      }
      return this._useFocusFunctions = bool;
    }
  });

  ObserverComponent.define("focus", {
    get: function() {
      return this._defaultFocus;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "ObserverComponent.focus requires a function value.";
      }
      return this._defaultFocus = func;
    }
  });

  ObserverComponent.define("unfocus", {
    get: function() {
      return this._defaultUnfocus;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "ObserverComponent.unfocus requires a function value.";
      }
      return this._defaultUnfocus = func;
    }
  });

  ObserverComponent.define("focused", {
    get: function() {
      return this._focusedSubscribers;
    },
    set: function(layers) {
      if (_.isArray(layers) === false) {
        layers = [layers];
      }
      return layers.forEach((function(_this) {
        return function(layer) {
          if (_this._isFocused(layer) === false) {
            return _this._addToFocusedSubscribers(layer, true);
          }
        };
      })(this));
    }
  });

  ObserverComponent.define("unfocused", {
    get: function() {
      return _.without(this._subscribers, this._focusedSubscribers);
    },
    set: function(layers) {
      if (_.isArray(layers) === false) {
        layers = [layers];
      }
      return layers.forEach((function(_this) {
        return function(layer) {
          if (_this._isFocused(layer) === true) {
            return _this._removeFromFocusedSubscribers(layer, true);
          }
        };
      })(this));
    }
  });

  ObserverComponent.define("useFocusStates", {
    get: function() {
      return this._useFocusStates;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "ObserverComponent.useFocusStates requires a boolean value.";
      }
      return this._useFocusStates = bool;
    }
  });

  ObserverComponent.define("focusedState", {
    get: function() {
      return this._defaultFocused;
    },
    set: function(state) {
      if (state == null) {
        state = {};
      }
      if (typeof state !== 'object') {
        throw "ObserverComponent.focusState requires an object (a Layer state).";
      }
      return this._defaultFocused = state;
    }
  });

  ObserverComponent.define("unfocusedState", {
    get: function() {
      return this._defaultUnfocused;
    },
    set: function(state) {
      if (state == null) {
        state = {};
      }
      if (typeof state !== 'object') {
        throw "ObserverComponent.focusState requires an object (a Layer state).";
      }
      return this._defaultUnfocused = state;
    }
  });

  ObserverComponent.define("subscribers", {
    get: function() {
      return this._subscribers;
    },
    set: function(layers) {
      var adiosSubscribers, i, j, k, layer, len, len1, len2, ref, subscriber;
      if (_.isArray(layers) === false || layers.length < 0) {
        throw 'Subscribers requires an array.';
      }
      this._focusedSubscribers = _.intersection(this._focusedSubscribers, layers);
      adiosSubscribers = _.difference(this._subscribers, layers);
      for (i = 0, len = adiosSubscribers.length; i < len; i++) {
        subscriber = adiosSubscribers[i];
        this.removeSubscriber(subscriber);
      }
      for (j = 0, len1 = layers.length; j < len1; j++) {
        layer = layers[j];
        this.addSubscriber(layer);
      }
      ref = this._subscribers;
      for (k = 0, len2 = ref.length; k < len2; k++) {
        subscriber = ref[k];
        subscriber.observer = this;
      }
      if (!_.includes(this._subscribers, this._focusedSubscriber)) {
        return this._focusedSubscriber = void 0;
      }
    }
  });

  ObserverComponent.prototype._isFocused = function(layer) {
    return _.includes(this._focusedSubscribers, layer);
  };

  ObserverComponent.prototype._addToFocusedSubscribers = function(layer, instant) {
    if (instant == null) {
      instant = false;
    }
    if (this._isFocused(layer) === true) {
      throw "Focused on a focused subscriber. Is that right?";
    }
    if (_.size(this._focusedSubscribers) >= this._maxFocused) {
      this._setFocused(this._focusedSubscribers[0], false, instant);
      return this._addToFocusedSubscribers(layer, instant);
    } else {
      this._focusedSubscribers.push(layer);
      if (this._notifyOnFocus === true) {
        return this.notifySubscribers();
      }
    }
  };

  ObserverComponent.prototype._removeFromFocusedSubscribers = function(layer, instant) {
    if (instant == null) {
      instant = false;
    }
    if (this._isFocused(layer) === false) {
      throw "Tried to remove a layer that wasn't focused.";
    }
    return _.pull(this._focusedSubscribers, layer);
  };

  return ObserverComponent;

})(Layer);

exports.ObserverComponent = ObserverComponent;


},{}],"SelectComponent":[function(require,module,exports){
var FocusComponent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

FocusComponent = (function(superClass) {
  extend(FocusComponent, superClass);

  function FocusComponent(options) {
    var ref, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
    if (options == null) {
      options = {};
    }
    this._subjects = [];
    this._focusedSubjects = [];
    this._maxFocused = (ref = options.maxFocused) != null ? ref : 1;
    this._toggle = (ref1 = options.toggle) != null ? ref1 : true;
    this._trigger = (ref2 = options.trigger) != null ? ref2 : 'Tap';
    this._focusTrigger = (ref3 = options.focusTrigger) != null ? ref3 : this._trigger;
    this._unfocusTrigger = (ref4 = options.unfocusTrigger) != null ? ref4 : this._trigger;
    this._defaultFocused = (ref5 = (ref6 = options.states) != null ? ref6.focused : void 0) != null ? ref5 : {
      opacity: 1
    };
    this._defaultUnfocused = (ref7 = (ref8 = options.states) != null ? ref8.unfocused : void 0) != null ? ref7 : ((ref9 = options.states) != null ? ref9.focused : void 0) != null ? void 0 : {
      opacity: .5
    };
    this._defaultFocus = (ref10 = options.focus) != null ? ref10 : function() {
      return null;
    };
    this._defaultUnfocus = (ref11 = options.unfocus) != null ? ref11 : function() {
      return null;
    };
    this._defaultNotify = (ref12 = options.notify) != null ? ref12 : function() {
      return null;
    };
    this._notifyOnFocus = (ref13 = options.notifyOnFocus) != null ? ref13 : true;
    this._useFocusStates = (ref14 = options.useFocusStates) != null ? ref14 : true;
    this._useFocusFunctions = (ref15 = options.useFocusFunctions) != null ? ref15 : true;
    FocusComponent.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      size: Screen.size,
      backgroundColor: null
    }));
  }

  FocusComponent.prototype.notifyFocusedSubjects = function(func) {
    var i, len, ref, results, subject;
    if (func == null) {
      func = this._defaultFocus;
    }
    ref = this._focusedSubjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(_.bind(func, subject)());
    }
    return results;
  };

  FocusComponent.prototype.notifyUnfocusedSubjects = function(func) {
    var i, len, ref, results, subject;
    if (func == null) {
      func = this._defaultUnfocus;
    }
    ref = this._unfocusedSubjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(_.bind(func, subject)());
    }
    return results;
  };

  FocusComponent.prototype.notifySubjects = function(func) {
    var i, len, ref, results, subject;
    if (func == null) {
      func = this._defaultNotify;
    }
    ref = this._subjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(_.bind(func, subject)());
    }
    return results;
  };

  FocusComponent.prototype.notifySelected = function(subjects, func) {
    var i, len, ref, results, subject;
    if (subjects == null) {
      subjects = this._subjects;
    }
    if (func == null) {
      func = this._defaultNotify;
    }
    if (typeof subjects === 'object') {
      subjects = [subjects];
    }
    ref = this._subjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(_.bind(func, subject)());
    }
    return results;
  };

  FocusComponent.prototype.unfocusAll = function(instant) {
    var i, len, ref, results, subject;
    if (instant == null) {
      instant = false;
    }
    ref = this._focusedSubjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(this._setFocused(false, instant));
    }
    return results;
  };

  FocusComponent.prototype._focus = function(subject) {
    return _.bind(this._defaultFocus, subject)();
  };

  FocusComponent.prototype._unfocus = function(subject) {
    return _.bind(this._defaultUnfocus, subject)();
  };

  FocusComponent.prototype.addFocusTrigger = function(subject, eventName) {
    if (eventName == null) {
      eventName = this._focusTrigger;
    }
    return subject.on(Events[eventName], (function(_this) {
      return function() {
        return _this._setFocused(subject, true);
      };
    })(this));
  };

  FocusComponent.prototype.removeFocusTrigger = function(subject, eventName) {
    if (eventName == null) {
      eventName = this._focusTrigger;
    }
    return subject.off(Events[eventName], (function(_this) {
      return function() {
        return _this._setFocused(subject, true);
      };
    })(this));
  };

  FocusComponent.prototype.addUnfocusTrigger = function(subject, eventName) {
    if (eventName == null) {
      eventName = this._unfocusTrigger;
    }
    return subject.on(Events[eventName], (function(_this) {
      return function() {
        return _this._setFocused(subject, false);
      };
    })(this));
  };

  FocusComponent.prototype.removeUnfocusTrigger = function(subject, eventName) {
    if (eventName == null) {
      eventName = this._unfocusTrigger;
    }
    return subject.off(Events[eventName], (function(_this) {
      return function() {
        return _this._setFocused(subject, false);
      };
    })(this));
  };

  FocusComponent.prototype._setFocused = function(subject, bool, instant) {
    if (bool === true) {
      if (this._isFocused(subject) === true) {
        if (this._toggle === true) {
          this._setFocused(subject, false, instant);
        }
        return null;
      }
      this._addToFocusedSubjects(subject, instant);
      if (this._useFocusStates === true) {
        if (instant) {
          subject.stateSwitch('focused');
        } else {
          subject.animate('focused');
        }
      }
      if (this._useFocusFunctions === true) {
        return this._focus(subject);
      }
    } else {
      if (this._isFocused(subject) === false) {
        return null;
      }
      this._removeFromFocusedSubjects(subject);
      if (this._useFocusStates === true) {
        if (instant) {
          subject.stateSwitch('unfocused');
        } else {
          subject.animate('unfocused');
        }
      }
      if (this._useFocusFunctions === true) {
        return this._unfocus(subject);
      }
    }
  };

  FocusComponent.prototype.addSubject = function(newSubject, options) {
    var focusTrigger, focused, focusedState, ref, ref1, ref2, ref3, ref4, ref5, unfocusTrigger, unfocusedState;
    if (options == null) {
      options = {};
    }
    focusTrigger = (ref = options.focusTrigger) != null ? ref : this._focusTrigger;
    unfocusTrigger = (ref1 = options.focusTrigger) != null ? ref1 : this._unfocusTrigger;
    focused = (ref2 = options.focused) != null ? ref2 : false;
    focusedState = (ref3 = options.focusedState) != null ? ref3 : newSubject.states.focused;
    unfocusedState = (ref4 = options.unfocusedState) != null ? ref4 : newSubject.states.unfocused;
    if (newSubject instanceof Layer === false) {
      throw "Observer can only add layers to its list of subjects. " + layer + ", id " + layer.id + " is not a layer.";
    }
    this.addFocusTrigger(newSubject, focusTrigger);
    this.addUnfocusTrigger(newSubject, unfocusTrigger);
    newSubject.states.focused = focusedState != null ? focusedState : this._defaultFocused;
    newSubject.states.unfocused = (ref5 = unfocusedState != null ? unfocusedState : this._defaultUnfocused) != null ? ref5 : newSubject.states["default"];
    this._subjects.push(newSubject);
    this._setFocused(newSubject, focused, true);
    if (this._useFocusStates === true) {
      newSubject.stateSwitch('unfocused');
    }
    if (this._useFocusFunctions === true) {
      return this._unfocus(newSubject);
    }
  };

  FocusComponent.prototype.removeSubject = function(layer) {
    var ref;
    if (_.includes(this._subjects, layer) === false) {
      if (layer instanceof Layer === true) {
        throw "That layer (" + ((ref = layer.name) != null ? ref : layer) + ", id: " + layer.id + ") isn't a subject.";
      } else {
        throw "That isn't a layer. Observer can only remove layers that are on its list of subject layers.";
      }
    }
    if (this._isFocused(layer)) {
      this._removeFromFocusedSubjects(layer, false);
    }
    _.pull(this._subjects, layer);
    layer.observer = void 0;
    layer.focus = void 0;
    layer.unfocus = void 0;
    layer.notify = void 0;
    return layer.removeFocusTrigger(layer._trigger);
  };

  FocusComponent.define("notify", {
    get: function() {
      return this._defaultNotify;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "ObserverComponent.notify requires a function value.";
      }
      return this._defaultNotify = func;
    }
  });

  FocusComponent.define("notifyOnFocus", {
    get: function() {
      return this._notifyOnFocus;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "ObserverComponent.notifyOnFocus requires a boolean (true or false) value.";
      }
      return this._notifyOnFocus = bool;
    }
  });

  FocusComponent.define("maxFocused", {
    get: function() {
      return this._maxFocused;
    },
    set: function(number) {
      if (typeof number !== 'number') {
        throw "ObserverComponent.maxFocused requires a number value.";
      }
      return this._maxFocused = number;
    }
  });

  FocusComponent.define("useFocusFunctions", {
    get: function() {
      return this._useFocusFunctions;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "ObserverComponent.focusFunctions requires a boolean (true or false) value.";
      }
      return this._useFocusFunctions = bool;
    }
  });

  FocusComponent.define("focus", {
    get: function() {
      return this._defaultFocus;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "ObserverComponent.focus requires a function value.";
      }
      return this._defaultFocus = func;
    }
  });

  FocusComponent.define("unfocus", {
    get: function() {
      return this._defaultUnfocus;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "ObserverComponent.unfocus requires a function value.";
      }
      return this._defaultUnfocus = func;
    }
  });

  FocusComponent.define("focused", {
    get: function() {
      return this._focusedSubjects;
    },
    set: function(layers) {
      if (_.isArray(layers) === false) {
        layers = [layers];
      }
      return layers.forEach((function(_this) {
        return function(layer) {
          if (_this._isFocused(layer) === false) {
            return _this._addToFocusedSubjects(layer, true);
          }
        };
      })(this));
    }
  });

  FocusComponent.define("unfocused", {
    get: function() {
      return _.without(this._subjects, this._focusedSubjects);
    },
    set: function(layers) {
      if (_.isArray(layers) === false) {
        layers = [layers];
      }
      return layers.forEach((function(_this) {
        return function(layer) {
          if (_this._isFocused(layer) === true) {
            return _this._removeFromFocusedSubjects(layer, true);
          }
        };
      })(this));
    }
  });

  FocusComponent.define("useFocusStates", {
    get: function() {
      return this._useFocusStates;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "ObserverComponent.useFocusStates requires a boolean value.";
      }
      return this._useFocusStates = bool;
    }
  });

  FocusComponent.define("focusedState", {
    get: function() {
      return this._defaultFocused;
    },
    set: function(state) {
      if (state == null) {
        state = {};
      }
      if (typeof state !== 'object') {
        throw "ObserverComponent.focusState requires an object (a Layer state).";
      }
      return this._defaultFocused = state;
    }
  });

  FocusComponent.define("unfocusedState", {
    get: function() {
      return this._defaultUnfocused;
    },
    set: function(state) {
      if (state == null) {
        state = {};
      }
      if (typeof state !== 'object') {
        throw "ObserverComponent.focusState requires an object (a Layer state).";
      }
      return this._defaultUnfocused = state;
    }
  });

  FocusComponent.define("subjects", {
    get: function() {
      return this._subjects;
    },
    set: function(layers) {
      var adiosSubjects, i, j, k, layer, len, len1, len2, ref, subject;
      if (_.isArray(layers) === false || layers.length < 0) {
        throw 'Subjects requires an array.';
      }
      this._focusedSubjects = _.intersection(this._focusedSubjects, layers);
      adiosSubjects = _.difference(this._subjects, layers);
      for (i = 0, len = adiosSubjects.length; i < len; i++) {
        subject = adiosSubjects[i];
        this.removeSubject(subject);
      }
      for (j = 0, len1 = layers.length; j < len1; j++) {
        layer = layers[j];
        this.addSubject(layer);
      }
      ref = this._subjects;
      for (k = 0, len2 = ref.length; k < len2; k++) {
        subject = ref[k];
        subject.observer = this;
      }
      if (!_.includes(this._subjects, this._focusedSubject)) {
        return this._focusedSubject = void 0;
      }
    }
  });

  FocusComponent.prototype._isFocused = function(layer) {
    return _.includes(this._focusedSubjects, layer);
  };

  FocusComponent.prototype._addToFocusedSubjects = function(layer, instant) {
    if (instant == null) {
      instant = false;
    }
    if (this._isFocused(layer) === true) {
      throw "Focused on a focused subject. Is that right?";
    }
    if (_.size(this._focusedSubjects) >= this._maxFocused) {
      this._setFocused(this._focusedSubjects[0], false, instant);
      return this._addToFocusedSubjects(layer, instant);
    } else {
      this._focusedSubjects.push(layer);
      if (this._notifyOnFocus === true) {
        return this.notifySubjects();
      }
    }
  };

  FocusComponent.prototype._removeFromFocusedSubjects = function(layer, instant) {
    if (instant == null) {
      instant = false;
    }
    if (this._isFocused(layer) === false) {
      throw "Tried to remove a layer that wasn't focused.";
    }
    return _.pull(this._focusedSubjects, layer);
  };

  return FocusComponent;

})(Layer);

exports.ObserverComponent = ObserverComponent;


},{}],"SubjectComponent":[function(require,module,exports){
var ObserverComponent,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ObserverComponent = (function(superClass) {
  extend(ObserverComponent, superClass);

  function ObserverComponent(options) {
    var ref, ref1, ref10, ref11, ref12, ref13, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9;
    if (options == null) {
      options = {};
    }
    this._subscribers = [];
    this._focusedSubscribers = [];
    this._maxFocused = (ref = options.maxFocused) != null ? ref : 1;
    this._toggle = (ref1 = options.toggle) != null ? ref1 : true;
    this._trigger = (ref2 = options.trigger) != null ? ref2 : 'Tap';
    this._defaultFocused = (ref3 = (ref4 = options.states) != null ? ref4.focused : void 0) != null ? ref3 : {
      opacity: 1
    };
    this._defaultUnfocused = (ref5 = (ref6 = options.states) != null ? ref6.unfocused : void 0) != null ? ref5 : ((ref7 = options.states) != null ? ref7.focused : void 0) != null ? void 0 : {
      opacity: .5
    };
    this._defaultFocus = (ref8 = options.focus) != null ? ref8 : function() {
      return null;
    };
    this._defaultUnfocus = (ref9 = options.unfocus) != null ? ref9 : function() {
      return null;
    };
    this._defaultNotify = (ref10 = options.notify) != null ? ref10 : function() {
      return null;
    };
    this._notifyOnFocus = (ref11 = options.notifyOnFocus) != null ? ref11 : true;
    this._useFocusStates = (ref12 = options.useFocusStates) != null ? ref12 : true;
    this._useFocusFunctions = (ref13 = options.useFocusFunctions) != null ? ref13 : true;
    ObserverComponent.__super__.constructor.call(this, _.defaults(options, {
      name: '.',
      size: Screen.size,
      backgroundColor: null
    }));
  }

  ObserverComponent.prototype.notifyFocusedSubscribers = function(func) {
    var i, len, ref, results, subscriber;
    if (func == null) {
      func = this._defaultFocus;
    }
    ref = this._focusedSubscribers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subscriber = ref[i];
      results.push(_.bind(func, subscriber)());
    }
    return results;
  };

  ObserverComponent.prototype.notifyUnfocusedSubscribers = function(func) {
    var i, len, ref, results, subscriber;
    if (func == null) {
      func = this._defaultUnfocus;
    }
    ref = this._unfocusedSubscribers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subscriber = ref[i];
      results.push(_.bind(func, subscriber)());
    }
    return results;
  };

  ObserverComponent.prototype.notifySubscribers = function(func) {
    var i, len, ref, results, subscriber;
    if (func == null) {
      func = this._defaultNotify;
    }
    ref = this._subscribers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subscriber = ref[i];
      results.push(_.bind(func, subscriber)());
    }
    return results;
  };

  ObserverComponent.prototype.notifySelected = function(subscribers, func) {
    var i, len, ref, results, subscriber;
    if (subscribers == null) {
      subscribers = this._subscribers;
    }
    if (func == null) {
      func = this._defaultNotify;
    }
    if (typeof subscribers === 'object') {
      subscribers = [subscribers];
    }
    ref = this._subscribers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subscriber = ref[i];
      results.push(_.bind(func, subscriber)());
    }
    return results;
  };

  ObserverComponent.prototype.unfocusAll = function(instant) {
    var i, len, ref, results, subscriber;
    if (instant == null) {
      instant = false;
    }
    ref = this._focusedSubscribers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subscriber = ref[i];
      results.push(this._setFocused(false, instant));
    }
    return results;
  };

  ObserverComponent.prototype._focus = function(subscriber) {
    return _.bind(this._defaultFocus, subscriber)();
  };

  ObserverComponent.prototype._unfocus = function(subscriber) {
    return _.bind(this._defaultUnfocus, subscriber)();
  };

  ObserverComponent.prototype.addFocusTrigger = function(subscriber, eventName) {
    if (eventName == null) {
      eventName = this._trigger;
    }
    return subscriber.on(Events[eventName], (function(_this) {
      return function() {
        return _this._setFocused(subscriber, true);
      };
    })(this));
  };

  ObserverComponent.prototype.removeFocusTrigger = function(subscriber, eventName) {
    if (eventName == null) {
      eventName = this._trigger;
    }
    return subscriber.off(Events[eventName], (function(_this) {
      return function() {
        return _this._setFocused(subscriber, true);
      };
    })(this));
  };

  ObserverComponent.prototype._setFocused = function(subscriber, bool, instant) {
    if (bool === true) {
      if (this._isFocused(subscriber) === true) {
        if (this._toggle === true) {
          this._setFocused(subscriber, false, instant);
        }
        return null;
      }
      this._addToFocusedSubscribers(subscriber, instant);
      if (this._useFocusStates === true) {
        if (instant) {
          subscriber.stateSwitch('focused');
        } else {
          subscriber.animate('focused');
        }
      }
      if (this._useFocusFunctions === true) {
        return this._focus(subscriber);
      }
    } else {
      if (this._isFocused(subscriber) === false) {
        return null;
      }
      this._removeFromFocusedSubscribers(subscriber);
      if (this._useFocusStates === true) {
        if (instant) {
          subscriber.stateSwitch('unfocused');
        } else {
          subscriber.animate('unfocused');
        }
      }
      if (this._useFocusFunctions === true) {
        return this._unfocus(subscriber);
      }
    }
  };

  ObserverComponent.prototype.addSubscriber = function(newSubscriber, options) {
    var focused, focusedState, ref, ref1, ref2, ref3, ref4, trigger, unfocusedState;
    if (options == null) {
      options = {};
    }
    trigger = (ref = options.trigger) != null ? ref : this._trigger;
    focused = (ref1 = options.focused) != null ? ref1 : false;
    focusedState = (ref2 = options.focusedState) != null ? ref2 : newSubscriber.states.focused;
    unfocusedState = (ref3 = options.unfocusedState) != null ? ref3 : newSubscriber.states.unfocused;
    if (newSubscriber instanceof Layer === false) {
      throw "Observer can only add layers to its list of subscribers. " + layer + ", id " + layer.id + " is not a layer.";
    }
    this.addFocusTrigger(newSubscriber, trigger);
    newSubscriber.states.focused = focusedState != null ? focusedState : this._defaultFocused;
    newSubscriber.states.unfocused = (ref4 = unfocusedState != null ? unfocusedState : this._defaultUnfocused) != null ? ref4 : newSubscriber.states["default"];
    this._subscribers.push(newSubscriber);
    this._setFocused(newSubscriber, focused, true);
    if (this._useFocusStates === true) {
      newSubscriber.stateSwitch('unfocused');
    }
    if (this._useFocusFunctions === true) {
      return this._unfocus(newSubscriber);
    }
  };

  ObserverComponent.prototype.removeSubscriber = function(layer) {
    var ref;
    if (_.includes(this._subscribers, layer) === false) {
      if (layer instanceof Layer === true) {
        throw "That layer (" + ((ref = layer.name) != null ? ref : layer) + ", id: " + layer.id + ") isn't a subscriber.";
      } else {
        throw "That isn't a layer. Observer can only remove layers that are on its list of subscriber layers.";
      }
    }
    if (this._isFocused(layer)) {
      this._removeFromFocusedSubscribers(layer, false);
    }
    _.pull(this._subscribers, layer);
    layer.observer = void 0;
    layer.focus = void 0;
    layer.unfocus = void 0;
    layer.notify = void 0;
    return layer.removeFocusTrigger(layer._trigger);
  };

  ObserverComponent.define("notify", {
    get: function() {
      return this._defaultNotify;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "ObserverComponent.notify requires a function value.";
      }
      return this._defaultNotify = func;
    }
  });

  ObserverComponent.define("notifyOnFocus", {
    get: function() {
      return this._notifyOnFocus;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "ObserverComponent.notifyOnFocus requires a boolean (true or false) value.";
      }
      return this._notifyOnFocus = bool;
    }
  });

  ObserverComponent.define("maxFocused", {
    get: function() {
      return this._maxFocused;
    },
    set: function(number) {
      if (typeof number !== 'number') {
        throw "ObserverComponent.maxFocused requires a number value.";
      }
      return this._maxFocused = number;
    }
  });

  ObserverComponent.define("useFocusFunctions", {
    get: function() {
      return this._useFocusFunctions;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "ObserverComponent.focusFunctions requires a boolean (true or false) value.";
      }
      return this._useFocusFunctions = bool;
    }
  });

  ObserverComponent.define("focus", {
    get: function() {
      return this._defaultFocus;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "ObserverComponent.focus requires a function value.";
      }
      return this._defaultFocus = func;
    }
  });

  ObserverComponent.define("unfocus", {
    get: function() {
      return this._defaultUnfocus;
    },
    set: function(func) {
      if (typeof func !== 'function') {
        throw "ObserverComponent.unfocus requires a function value.";
      }
      return this._defaultUnfocus = func;
    }
  });

  ObserverComponent.define("focused", {
    get: function() {
      return this._focusedSubscribers;
    },
    set: function(layers) {
      if (_.isArray(layers) === false) {
        layers = [layers];
      }
      return layers.forEach((function(_this) {
        return function(layer) {
          if (_this._isFocused(layer) === false) {
            return _this._addToFocusedSubscribers(layer, true);
          }
        };
      })(this));
    }
  });

  ObserverComponent.define("unfocused", {
    get: function() {
      return _.without(this._subscribers, this._focusedSubscribers);
    },
    set: function(layers) {
      if (_.isArray(layers) === false) {
        layers = [layers];
      }
      return layers.forEach((function(_this) {
        return function(layer) {
          if (_this._isFocused(layer) === true) {
            return _this._removeFromFocusedSubscribers(layer, true);
          }
        };
      })(this));
    }
  });

  ObserverComponent.define("useFocusStates", {
    get: function() {
      return this._useFocusStates;
    },
    set: function(bool) {
      if (typeof bool !== 'boolean') {
        throw "ObserverComponent.useFocusStates requires a boolean value.";
      }
      return this._useFocusStates = bool;
    }
  });

  ObserverComponent.define("focusedState", {
    get: function() {
      return this._defaultFocused;
    },
    set: function(state) {
      if (state == null) {
        state = {};
      }
      if (typeof state !== 'object') {
        throw "ObserverComponent.focusState requires an object (a Layer state).";
      }
      return this._defaultFocused = state;
    }
  });

  ObserverComponent.define("unfocusedState", {
    get: function() {
      return this._defaultUnfocused;
    },
    set: function(state) {
      if (state == null) {
        state = {};
      }
      if (typeof state !== 'object') {
        throw "ObserverComponent.focusState requires an object (a Layer state).";
      }
      return this._defaultUnfocused = state;
    }
  });

  ObserverComponent.define("subscribers", {
    get: function() {
      return this._subscribers;
    },
    set: function(layers) {
      var adiosSubscribers, i, j, k, layer, len, len1, len2, ref, subscriber;
      if (_.isArray(layers) === false || layers.length < 0) {
        throw 'Subscribers requires an array.';
      }
      this._focusedSubscribers = _.intersection(this._focusedSubscribers, layers);
      adiosSubscribers = _.difference(this._subscribers, layers);
      for (i = 0, len = adiosSubscribers.length; i < len; i++) {
        subscriber = adiosSubscribers[i];
        this.removeSubscriber(subscriber);
      }
      for (j = 0, len1 = layers.length; j < len1; j++) {
        layer = layers[j];
        this.addSubscriber(layer);
      }
      ref = this._subscribers;
      for (k = 0, len2 = ref.length; k < len2; k++) {
        subscriber = ref[k];
        subscriber.observer = this;
      }
      if (!_.includes(this._subscribers, this._focusedSubscriber)) {
        return this._focusedSubscriber = void 0;
      }
    }
  });

  ObserverComponent.prototype._isFocused = function(layer) {
    return _.includes(this._focusedSubscribers, layer);
  };

  ObserverComponent.prototype._addToFocusedSubscribers = function(layer, instant) {
    if (instant == null) {
      instant = false;
    }
    if (this._isFocused(layer) === true) {
      throw "Focused on a focused subscriber. Is that right?";
    }
    if (_.size(this._focusedSubscribers) >= this._maxFocused) {
      this._setFocused(this._focusedSubscribers[0], false, instant);
      return this._addToFocusedSubscribers(layer, instant);
    } else {
      this._focusedSubscribers.push(layer);
      if (this._notifyOnFocus === true) {
        return this.notifySubscribers();
      }
    }
  };

  ObserverComponent.prototype._removeFromFocusedSubscribers = function(layer, instant) {
    if (instant == null) {
      instant = false;
    }
    if (this._isFocused(layer) === false) {
      throw "Tried to remove a layer that wasn't focused.";
    }
    return _.pull(this._focusedSubscribers, layer);
  };

  return ObserverComponent;

})(Layer);

exports.ObserverComponent = ObserverComponent;


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXZlcnVpei9HaXRIdWIvRm9jdXNDb21wb25lbnQvZXhhbXBsZXMuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RldmVydWl6L0dpdEh1Yi9Gb2N1c0NvbXBvbmVudC9leGFtcGxlcy5mcmFtZXIvbW9kdWxlcy9TdWJqZWN0Q29tcG9uZW50LmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXZlcnVpei9HaXRIdWIvRm9jdXNDb21wb25lbnQvZXhhbXBsZXMuZnJhbWVyL21vZHVsZXMvU2VsZWN0Q29tcG9uZW50LmNvZmZlZSIsIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXZlcnVpei9HaXRIdWIvRm9jdXNDb21wb25lbnQvZXhhbXBsZXMuZnJhbWVyL21vZHVsZXMvT2JzZXJ2ZXJDb21wb25lbnQuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RldmVydWl6L0dpdEh1Yi9Gb2N1c0NvbXBvbmVudC9leGFtcGxlcy5mcmFtZXIvbW9kdWxlcy9Gb2N1c0NvbXBvbmVudC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCJjbGFzcyBPYnNlcnZlckNvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0QF9zdWJzY3JpYmVycyA9IFtdXG5cdFx0QF9mb2N1c2VkU3Vic2NyaWJlcnMgPSBbXVxuXG5cdFx0QF9tYXhGb2N1c2VkID0gb3B0aW9ucy5tYXhGb2N1c2VkID8gMVxuXHRcdEBfdG9nZ2xlID0gb3B0aW9ucy50b2dnbGUgPyB0cnVlXG5cdFx0QF90cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyID8gJ1RhcCdcblx0XHRAX2RlZmF1bHRGb2N1c2VkID0gb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQgPyB7b3BhY2l0eTogMX1cblx0XHRAX2RlZmF1bHRVbmZvY3VzZWQgPSBvcHRpb25zLnN0YXRlcz8udW5mb2N1c2VkID8gaWYgb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQ/IHRoZW4gdW5kZWZpbmVkIGVsc2Uge29wYWNpdHk6IC41fVxuXHRcdEBfZGVmYXVsdEZvY3VzID0gb3B0aW9ucy5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0VW5mb2N1cyA9IG9wdGlvbnMudW5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0Tm90aWZ5ID0gb3B0aW9ucy5ub3RpZnkgPyAtPiByZXR1cm4gbnVsbFxuXHRcdEBfbm90aWZ5T25Gb2N1cyA9IG9wdGlvbnMubm90aWZ5T25Gb2N1cyA/IHRydWVcblx0XHRAX3VzZUZvY3VzU3RhdGVzID0gb3B0aW9ucy51c2VGb2N1c1N0YXRlcyA/IHRydWVcblx0XHRAX3VzZUZvY3VzRnVuY3Rpb25zID0gb3B0aW9ucy51c2VGb2N1c0Z1bmN0aW9ucyA/IHRydWVcblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6ICcuJ1xuXHRcdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cdCMgbm90aWZ5IHN1YnNjcmliZXJzXG5cdG5vdGlmeUZvY3VzZWRTdWJzY3JpYmVyczogKGZ1bmMgPSBAX2RlZmF1bHRGb2N1cykgLT4gZG8gXy5iaW5kKGZ1bmMsIHN1YnNjcmliZXIpIGZvciBzdWJzY3JpYmVyIGluIEBfZm9jdXNlZFN1YnNjcmliZXJzXG5cdG5vdGlmeVVuZm9jdXNlZFN1YnNjcmliZXJzOiAoZnVuYyA9IEBfZGVmYXVsdFVuZm9jdXMpIC0+IGRvIF8uYmluZChmdW5jLCBzdWJzY3JpYmVyKSBmb3Igc3Vic2NyaWJlciBpbiBAX3VuZm9jdXNlZFN1YnNjcmliZXJzXG5cdG5vdGlmeVN1YnNjcmliZXJzOiAoZnVuYyA9IEBfZGVmYXVsdE5vdGlmeSkgLT4gZG8gXy5iaW5kKGZ1bmMsIHN1YnNjcmliZXIpIGZvciBzdWJzY3JpYmVyIGluIEBfc3Vic2NyaWJlcnNcblx0bm90aWZ5U2VsZWN0ZWQ6IChzdWJzY3JpYmVycyA9IEBfc3Vic2NyaWJlcnMsIGZ1bmMgPSBAX2RlZmF1bHROb3RpZnkpIC0+IFxuXHRcdGlmIHR5cGVvZiBzdWJzY3JpYmVycyBpcyAnb2JqZWN0JyB0aGVuIHN1YnNjcmliZXJzID0gW3N1YnNjcmliZXJzXVxuXHRcdGRvIF8uYmluZChmdW5jLCBzdWJzY3JpYmVyKSBmb3Igc3Vic2NyaWJlciBpbiBAX3N1YnNjcmliZXJzXG5cblx0IyB1bmZvY3VzIGFsbCBmb2N1c2VkIHN1YnNjcmliZXJzXG5cdHVuZm9jdXNBbGw6IChpbnN0YW50ID0gZmFsc2UpIC0+IEBfc2V0Rm9jdXNlZChmYWxzZSwgaW5zdGFudCkgZm9yIHN1YnNjcmliZXIgaW4gQF9mb2N1c2VkU3Vic2NyaWJlcnNcblxuXHQjIHJ1biBmb2N1cyBmdW5jdGlvbiBmb3Igc3Vic2NyaWJlclxuXHRfZm9jdXM6IChzdWJzY3JpYmVyKSAtPiBkbyBfLmJpbmQoQF9kZWZhdWx0Rm9jdXMsIHN1YnNjcmliZXIpXG5cblx0IyBydW4gdW5mb2N1cyBmdW5jdGlvbiBmb3Igc3Vic2NyaWJlclxuXHRfdW5mb2N1czogKHN1YnNjcmliZXIpIC0+IGRvIF8uYmluZChAX2RlZmF1bHRVbmZvY3VzLCBzdWJzY3JpYmVyKVxuXG5cdCMgYWRkIG9yIHJlbW92ZSBmb2N1cyB0cmlnZ2VycyB0byBhIHN1YnNjcmliZXJcblx0YWRkRm9jdXNUcmlnZ2VyOiAoc3Vic2NyaWJlciwgZXZlbnROYW1lID0gQF90cmlnZ2VyKSAtPiBzdWJzY3JpYmVyLm9uIEV2ZW50c1tldmVudE5hbWVdLCA9PiBAX3NldEZvY3VzZWQoc3Vic2NyaWJlciwgdHJ1ZSlcblx0cmVtb3ZlRm9jdXNUcmlnZ2VyOiAoc3Vic2NyaWJlciwgZXZlbnROYW1lID0gQF90cmlnZ2VyKSAtPiBzdWJzY3JpYmVyLm9mZiBFdmVudHNbZXZlbnROYW1lXSwgPT4gQF9zZXRGb2N1c2VkKHN1YnNjcmliZXIsIHRydWUpXG5cblxuXHQjIHNldCBmb2N1c2VkIHN0YXRlIG9mIGEgc3Vic2NyaWJlciwgY2hhXG5cdF9zZXRGb2N1c2VkOiAoc3Vic2NyaWJlciwgYm9vbCwgaW5zdGFudCkgLT5cblx0XHQjIGlmIHRoZSBzdWJzY3JpYmVyJ3MgZm9jdXMgc3RhdGUgc2hvdWxkIGJlIGZvY3VzZWQuLi5cblx0XHRpZiBib29sIGlzIHRydWVcblx0XHRcdCMgaWYgc3Vic2NyaWJlciBpcyBhbHJlYWR5IGZvY3VzZWQuLi5cblx0XHRcdGlmIEBfaXNGb2N1c2VkKHN1YnNjcmliZXIpIGlzIHRydWVcblx0XHRcdFx0IyBpZiB0b2dnbGUgbW9kZSBpcyBvbiwgdW5mb2N1cyB0aGUgc3Vic2NyaWJlclxuXHRcdFx0XHRpZiBAX3RvZ2dsZSBpcyB0cnVlIHRoZW4gQF9zZXRGb2N1c2VkKHN1YnNjcmliZXIsIGZhbHNlLCBpbnN0YW50KVxuXHRcdFx0XHQjIGVpdGhlciB3YXksIHJldHVyblxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0XHQjIGlmIHRoZSBzdWJzY3JpYmVyIGlzbid0IGFscmVhZHkgZm9jdXNlZCwgYWRkIGl0IHRvIGZvY3VzZWQgc3Vic2NyaWJlcnNcblx0XHRcdEBfYWRkVG9Gb2N1c2VkU3Vic2NyaWJlcnMoc3Vic2NyaWJlciwgaW5zdGFudClcblx0XHRcdCMgYW5kIGlmIGZvY3VzZWQgc3RhdGVzIGFyZSBiZWluZyB1c2VkLi4uXG5cdFx0XHRpZiBAX3VzZUZvY3VzU3RhdGVzIGlzIHRydWVcblx0XHRcdFx0IyBlaXRoZXIgc3dpdGNoIG9yIGFuaW1hdGUgdG8gZm9jdXNlZCBzdGF0ZSwgZGVwZW5kaW5nIG9uIHRoZSBpbnN0YW50IGFyZ3VtZW50XG5cdFx0XHRcdGlmIGluc3RhbnQgdGhlbiBzdWJzY3JpYmVyLnN0YXRlU3dpdGNoKCdmb2N1c2VkJykgZWxzZSBzdWJzY3JpYmVyLmFuaW1hdGUoJ2ZvY3VzZWQnKVxuXHRcdFx0IyBhbmQgaWYgZm9jdXMgZnVuY3Rpb25zIGFyZSBiZWluZyB1c2VkLi4uIHJ1biBmb2N1cyBmdW5jdGlvbiBmb3Igc3Vic2NyaWJlclxuXHRcdFx0aWYgQF91c2VGb2N1c0Z1bmN0aW9ucyBpcyB0cnVlIHRoZW4gQF9mb2N1cyhzdWJzY3JpYmVyKSBcblxuXHRcdCMgaWYgdGhlIHN1YnNjcmliZXIncyBmb2N1cyBzdGF0ZSBzaG91bGQgYmUgdW5mb2N1c2VkLi4uXG5cdFx0ZWxzZVxuXHRcdFx0IyBpZiB0aGUgc3Vic2NyaWJlciBpcyBhbHJlYWR5IHVuZm9jdXNlZCwgZG8gbm90aGluZ1xuXHRcdFx0aWYgQF9pc0ZvY3VzZWQoc3Vic2NyaWJlcikgaXMgZmFsc2UgdGhlbiByZXR1cm4gbnVsbFxuXG5cdFx0XHQjIGlmIGl0IGlzLCByZW1vdmUgaXQgZnJvbSBmb2N1c2VkIHN1YnNjcmliZXJzXG5cdFx0XHRAX3JlbW92ZUZyb21Gb2N1c2VkU3Vic2NyaWJlcnMoc3Vic2NyaWJlcikgXG5cblx0XHRcdCMgYW5kIGlmIGZvY3VzZWQgc3RhdGVzIGFyZSBiZWluZyB1c2VkLi4uXG5cdFx0XHRpZiBAX3VzZUZvY3VzU3RhdGVzIGlzIHRydWVcblx0XHRcdFx0IyBlaXRoZXIgc3dpdGNoIG9yIGFuaW1hdGUgdG8gdGhlIHVuZm9jdXNlZCBzdGF0ZSwgZGVwZW5kaW5nIG9uIHRoZSBpbnN0YW50IGFyZ3VtZW50XG5cdFx0XHRcdGlmIGluc3RhbnQgdGhlbiBzdWJzY3JpYmVyLnN0YXRlU3dpdGNoKCd1bmZvY3VzZWQnKSBlbHNlIHN1YnNjcmliZXIuYW5pbWF0ZSgndW5mb2N1c2VkJylcblx0XHRcdCMgYW5kIGlmIGZvY3VzIGZ1bmN0aW9ucyBhcmUgYmVpbmcgdXNlZC4uLiBydW4gdGhlIHVuZm9jdXMgZnVuY3Rpb24gZm9yIHN1YnNjcmliZXJcblx0XHRcdGlmIEBfdXNlRm9jdXNGdW5jdGlvbnMgaXMgdHJ1ZSB0aGVuIEBfdW5mb2N1cyhzdWJzY3JpYmVyKVxuXG5cdCMgYWRkIGEgbmV3IHN1YnNjcmliZXIgdG8gdGhpcyBvYnNlcnZlclxuXHRhZGRTdWJzY3JpYmVyOiAobmV3U3Vic2NyaWJlciwgb3B0aW9ucyA9IHt9KSAtPlxuXHRcdHRyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXIgPyBAX3RyaWdnZXJcblx0XHRmb2N1c2VkID0gb3B0aW9ucy5mb2N1c2VkID8gZmFsc2Vcblx0XHRmb2N1c2VkU3RhdGUgPSBvcHRpb25zLmZvY3VzZWRTdGF0ZSA/IG5ld1N1YnNjcmliZXIuc3RhdGVzLmZvY3VzZWRcblx0XHR1bmZvY3VzZWRTdGF0ZSA9IG9wdGlvbnMudW5mb2N1c2VkU3RhdGUgPyBuZXdTdWJzY3JpYmVyLnN0YXRlcy51bmZvY3VzZWRcblxuXHRcdCMgdGhyb3cgYW4gZXJyb3IgaWYgbGF5ZXIgaXNuJ3QgYSBsYXllclxuXHRcdGlmIG5ld1N1YnNjcmliZXIgaW5zdGFuY2VvZiBMYXllciBpcyBmYWxzZSB0aGVuIHRocm93IFwiT2JzZXJ2ZXIgY2FuIG9ubHkgYWRkIGxheWVycyB0byBpdHMgbGlzdCBvZiBzdWJzY3JpYmVycy4gI3tsYXllcn0sIGlkICN7bGF5ZXIuaWR9IGlzIG5vdCBhIGxheWVyLlwiXG5cblx0XHQjIHNldCBldmVudCB0cmlnZ2VyIChldmVudCBuYW1lIHByb3ZpZGVkIGluIG9wdGlvbnMgb3IgZGVmYXVsdCBldmVudCBuYW1lKVxuXHRcdEBhZGRGb2N1c1RyaWdnZXIobmV3U3Vic2NyaWJlciwgdHJpZ2dlcilcblxuXHRcdCMgc2V0IGZvY3VzZWQgLyB1bmZvY3VzZWQgbGF5ZXIgc3RhdGVzIChzdGF0ZXMgcHJvdmlkZWQgaW4gb3B0aW9ucywgb3IgZXhpc3Rpbmcgc3RhdGVzIG9yIGRlZmF1bHQgc3RhdGVzKVxuXHRcdG5ld1N1YnNjcmliZXIuc3RhdGVzLmZvY3VzZWQgPSBmb2N1c2VkU3RhdGUgPyBAX2RlZmF1bHRGb2N1c2VkXG5cdFx0bmV3U3Vic2NyaWJlci5zdGF0ZXMudW5mb2N1c2VkID0gdW5mb2N1c2VkU3RhdGUgPyBAX2RlZmF1bHRVbmZvY3VzZWQgPyBuZXdTdWJzY3JpYmVyLnN0YXRlcy5kZWZhdWx0XG5cblx0XHQjIGFkZCBsYXllciB0byBzdWJzY3JpYmVycyBhcnJheVxuXHRcdEBfc3Vic2NyaWJlcnMucHVzaChuZXdTdWJzY3JpYmVyKVxuXG5cdFx0IyBpZiB0aGlzIHN1YnNjcmliZXIgc2hvdWxkIHN0YXJ0IGFzIGZvY3VzZWQsIHNldCBpdCBhcyBmb2N1c2VkXG5cdFx0QF9zZXRGb2N1c2VkKG5ld1N1YnNjcmliZXIsIGZvY3VzZWQsIHRydWUpXG5cdFx0aWYgQF91c2VGb2N1c1N0YXRlcyBpcyB0cnVlIHRoZW4gbmV3U3Vic2NyaWJlci5zdGF0ZVN3aXRjaCgndW5mb2N1c2VkJylcblx0XHRpZiBAX3VzZUZvY3VzRnVuY3Rpb25zIGlzIHRydWUgdGhlbiBAX3VuZm9jdXMobmV3U3Vic2NyaWJlcilcblxuXG5cdCMgcmVtb3ZlIGEgc3Vic2NyaWJlciBmcm9tIHRoaXMgb2JzZXJ2ZXJcblx0cmVtb3ZlU3Vic2NyaWJlcjogKGxheWVyKSAtPlxuXG5cdFx0IyB0aHJvdyBhIHdhcm5pbmcgd2hlbiB0cnlpbmcgdG8gcmVtb3ZlIGEgbGF5ZXIgaXNuJ3QgYSBzdWJzY3JpYmVyXG5cdFx0aWYgXy5pbmNsdWRlcyhAX3N1YnNjcmliZXJzLCBsYXllcikgaXMgZmFsc2Vcblx0XHRcdGlmIGxheWVyIGluc3RhbmNlb2YgTGF5ZXIgaXMgdHJ1ZSB0aGVuIHRocm93IFwiVGhhdCBsYXllciAoI3tsYXllci5uYW1lID8gbGF5ZXJ9LCBpZDogI3tsYXllci5pZH0pIGlzbid0IGEgc3Vic2NyaWJlci5cIlxuXHRcdFx0IyB0aHJvdyBhIG1vcmUgZGVzY3JpcHRpdmUgZXJyb3IgaWYgdGhlIGxheWVyIGlzbid0IGEgbGF5ZXIuXG5cdFx0XHRlbHNlIHRocm93IFwiVGhhdCBpc24ndCBhIGxheWVyLiBPYnNlcnZlciBjYW4gb25seSByZW1vdmUgbGF5ZXJzIHRoYXQgYXJlIG9uIGl0cyBsaXN0IG9mIHN1YnNjcmliZXIgbGF5ZXJzLlwiXG5cdFx0XG5cdFx0aWYgQF9pc0ZvY3VzZWQobGF5ZXIpIHRoZW4gQF9yZW1vdmVGcm9tRm9jdXNlZFN1YnNjcmliZXJzKGxheWVyLCBmYWxzZSlcblxuXHRcdCMgcmVtb3ZlIGZyb20gbGlzdCBvZiBzdWJzY3JpYmVyc1xuXHRcdF8ucHVsbChAX3N1YnNjcmliZXJzLCBsYXllcilcblx0XHQjIHJlbW92ZSBvYnNlcnZlciBwcm9wZXJ0eVxuXHRcdGxheWVyLm9ic2VydmVyID0gdW5kZWZpbmVkXG5cdFx0IyByZW1vdmUgb2JzZXJ2ZXIgZnVuY3Rpb25zXG5cdFx0bGF5ZXIuZm9jdXMgPSB1bmRlZmluZWRcblx0XHRsYXllci51bmZvY3VzID0gdW5kZWZpbmVkXG5cdFx0bGF5ZXIubm90aWZ5ID0gdW5kZWZpbmVkXG5cdFx0bGF5ZXIucmVtb3ZlRm9jdXNUcmlnZ2VyKGxheWVyLl90cmlnZ2VyKVxuXG5cdEBkZWZpbmUgXCJub3RpZnlcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2RlZmF1bHROb3RpZnlcblx0XHRzZXQ6IChmdW5jKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGZ1bmMgaXNudCAnZnVuY3Rpb24nIHRoZW4gdGhyb3cgXCJPYnNlcnZlckNvbXBvbmVudC5ub3RpZnkgcmVxdWlyZXMgYSBmdW5jdGlvbiB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBub3RpZnksIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YnNjcmliZXJzXG5cdFx0XHRAX2RlZmF1bHROb3RpZnkgPSBmdW5jXG5cblxuXHRAZGVmaW5lIFwibm90aWZ5T25Gb2N1c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfbm90aWZ5T25Gb2N1c1xuXHRcdHNldDogKGJvb2wpIC0+XG5cdFx0XHRpZiB0eXBlb2YgYm9vbCBpc250ICdib29sZWFuJyB0aGVuIHRocm93IFwiT2JzZXJ2ZXJDb21wb25lbnQubm90aWZ5T25Gb2N1cyByZXF1aXJlcyBhIGJvb2xlYW4gKHRydWUgb3IgZmFsc2UpIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3Vic2NyaWJlcnNcblx0XHRcdEBfbm90aWZ5T25Gb2N1cyA9IGJvb2xcblxuXG5cdEBkZWZpbmUgXCJtYXhGb2N1c2VkXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9tYXhGb2N1c2VkXG5cdFx0c2V0OiAobnVtYmVyKSAtPlxuXHRcdFx0aWYgdHlwZW9mIG51bWJlciBpc250ICdudW1iZXInIHRoZW4gdGhyb3cgXCJPYnNlcnZlckNvbXBvbmVudC5tYXhGb2N1c2VkIHJlcXVpcmVzIGEgbnVtYmVyIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3Vic2NyaWJlcnNcblx0XHRcdEBfbWF4Rm9jdXNlZCA9IG51bWJlclxuXG5cblx0QGRlZmluZSBcInVzZUZvY3VzRnVuY3Rpb25zXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF91c2VGb2N1c0Z1bmN0aW9uc1xuXHRcdHNldDogKGJvb2wpIC0+XG5cdFx0XHRpZiB0eXBlb2YgYm9vbCBpc250ICdib29sZWFuJyB0aGVuIHRocm93IFwiT2JzZXJ2ZXJDb21wb25lbnQuZm9jdXNGdW5jdGlvbnMgcmVxdWlyZXMgYSBib29sZWFuICh0cnVlIG9yIGZhbHNlKSB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBub3RpZnksIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YnNjcmliZXJzXG5cdFx0XHRAX3VzZUZvY3VzRnVuY3Rpb25zID0gYm9vbFxuXG5cblx0IyBnZXQgY3VycmVudCBkZWZhdWx0IGZvY3VzIGZ1bmN0aW9uLCB1c2VkIGJ5IGFsbCBzdWJzY3JpYmVycywgb3Igc2V0IGEgbmV3IG9uZVxuXHRAZGVmaW5lIFwiZm9jdXNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2RlZmF1bHRGb2N1c1xuXHRcdHNldDogKGZ1bmMpIC0+IFxuXHRcdFx0aWYgdHlwZW9mIGZ1bmMgaXNudCAnZnVuY3Rpb24nIHRoZW4gdGhyb3cgXCJPYnNlcnZlckNvbXBvbmVudC5mb2N1cyByZXF1aXJlcyBhIGZ1bmN0aW9uIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IGZvY3VzLCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJzY3JpYmVycyB3aGVuIGZvY3VzZWRcblx0XHRcdEBfZGVmYXVsdEZvY3VzID0gZnVuY1xuXG5cblx0IyBnZXQgY3VycmVudCBkZWZhdWx0IHVuZm9jdXMgZnVuY3Rpb24sIHVzZWQgYnkgYWxsIHN1YnNjcmliZXJzLCBvciBzZXQgYSBuZXcgb25lXG5cdEBkZWZpbmUgXCJ1bmZvY3VzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9kZWZhdWx0VW5mb2N1c1xuXHRcdHNldDogKGZ1bmMpIC0+IFxuXHRcdFx0aWYgdHlwZW9mIGZ1bmMgaXNudCAnZnVuY3Rpb24nIHRoZW4gdGhyb3cgXCJPYnNlcnZlckNvbXBvbmVudC51bmZvY3VzIHJlcXVpcmVzIGEgZnVuY3Rpb24gdmFsdWUuXCJcblx0XHRcdFxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCB1bmZvY3VzLCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJzY3JpYmVycyB3aGVuIHVuZm9jdXNlZFxuXHRcdFx0QF9kZWZhdWx0VW5mb2N1cyA9IGZ1bmNcblxuXG5cdCMgZ2V0IGN1cnJlbnQgZm9jdXNlZCBzdWJzY3JpYmVycyBvciBzZXQgZm9jdXNlZCBzdWJzY3JpYmVyc1xuXHRAZGVmaW5lIFwiZm9jdXNlZFwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZm9jdXNlZFN1YnNjcmliZXJzXG5cdFx0c2V0OiAobGF5ZXJzKSAtPlxuXHRcdFx0IyBhY2NlcHRzIGFycmF5cywgc28gbWFrZSBhbiBhcnJheSBpZiBub3QgZ2l2ZW4gb25lXG5cdFx0XHRpZiBfLmlzQXJyYXkobGF5ZXJzKSBpcyBmYWxzZSB0aGVuIGxheWVycyA9IFtsYXllcnNdXG5cblx0XHRcdCMgZm9jdXMgb24gYW55IG9mIHRoZSBsYXllcnMgdGhhdCBhcmVuJ3QgZm9jdXNlZCBhbHJlYWR5XG5cdFx0XHRsYXllcnMuZm9yRWFjaCAobGF5ZXIpID0+IGlmIEBfaXNGb2N1c2VkKGxheWVyKSBpcyBmYWxzZSB0aGVuIEBfYWRkVG9Gb2N1c2VkU3Vic2NyaWJlcnMobGF5ZXIsIHRydWUpXG5cblxuXHQjIGdldCBjdXJyZW50IHVuZm9jdXNlZCBzdWJzY3JpYmVyc1xuXHRAZGVmaW5lIFwidW5mb2N1c2VkXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gXy53aXRob3V0KEBfc3Vic2NyaWJlcnMsIEBfZm9jdXNlZFN1YnNjcmliZXJzKVxuXHRcdHNldDogKGxheWVycykgLT5cblx0XHRcdCMgYWNjZXB0cyBhcnJheXMsIHNvIG1ha2UgYW4gYXJyYXkgaWYgbm90IGdpdmVuIG9uZVxuXHRcdFx0aWYgXy5pc0FycmF5KGxheWVycykgaXMgZmFsc2UgdGhlbiBsYXllcnMgPSBbbGF5ZXJzXVxuXG5cdFx0XHQjIHVuZm9jdXMgYW55IG9mIHRoZSBsYXllcnMgdGhhdCBhcmUgZm9jdXNlZFxuXHRcdFx0bGF5ZXJzLmZvckVhY2ggKGxheWVyKSA9PiBpZiBAX2lzRm9jdXNlZChsYXllcikgaXMgdHJ1ZSB0aGVuIEBfcmVtb3ZlRnJvbUZvY3VzZWRTdWJzY3JpYmVycyhsYXllciwgdHJ1ZSlcblxuXG5cdEBkZWZpbmUgXCJ1c2VGb2N1c1N0YXRlc1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdXNlRm9jdXNTdGF0ZXNcblx0XHRzZXQ6IChib29sKSAtPiBcblx0XHRcdGlmIHR5cGVvZiBib29sIGlzbnQgJ2Jvb2xlYW4nIHRoZW4gdGhyb3cgXCJPYnNlcnZlckNvbXBvbmVudC51c2VGb2N1c1N0YXRlcyByZXF1aXJlcyBhIGJvb2xlYW4gdmFsdWUuXCJcblx0XHRcdEBfdXNlRm9jdXNTdGF0ZXMgPSBib29sXG5cblxuXHQjIGdldCBvciBzZXQgZGVmYXVsdCBmb2N1c2VkIHN0YXRlIGFkZGVkIHRvIG5ldyBzdWJzY3JpYmVyc1xuXHRAZGVmaW5lIFwiZm9jdXNlZFN0YXRlXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9kZWZhdWx0Rm9jdXNlZFxuXHRcdHNldDogKHN0YXRlID0ge30pIC0+IFxuXHRcdFx0aWYgdHlwZW9mIHN0YXRlIGlzbnQgJ29iamVjdCcgdGhlbiB0aHJvdyBcIk9ic2VydmVyQ29tcG9uZW50LmZvY3VzU3RhdGUgcmVxdWlyZXMgYW4gb2JqZWN0IChhIExheWVyIHN0YXRlKS5cIlxuXHRcdFx0QF9kZWZhdWx0Rm9jdXNlZCA9IHN0YXRlXG5cblxuXHQjIGdldCBvciBzZXQgZGVmYXVsdCB1bmZvY3VzZWQgc3RhdGUgYWRkZWQgdG8gbmV3IHN1YnNjcmliZXJzXG5cdEBkZWZpbmUgXCJ1bmZvY3VzZWRTdGF0ZVwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdFVuZm9jdXNlZFxuXHRcdHNldDogKHN0YXRlID0ge30pIC0+IFxuXHRcdFx0aWYgdHlwZW9mIHN0YXRlIGlzbnQgJ29iamVjdCcgdGhlbiB0aHJvdyBcIk9ic2VydmVyQ29tcG9uZW50LmZvY3VzU3RhdGUgcmVxdWlyZXMgYW4gb2JqZWN0IChhIExheWVyIHN0YXRlKS5cIlxuXHRcdFx0QF9kZWZhdWx0VW5mb2N1c2VkID0gc3RhdGVcblx0XG5cblx0IyBnZXQgb3Igc2V0IHRoZSBhcnJheSBvZiBzdWJzY3JpYmVycyAoIG5lZWRzIHdvcmsgKVxuXHRAZGVmaW5lIFwic3Vic2NyaWJlcnNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3N1YnNjcmliZXJzXG5cdFx0c2V0OiAobGF5ZXJzKSAtPlxuXHRcdFx0IyB0aHJvdyBlcnJvciBpZiBsYXllcnMgaXNudCBhbiBhcnJheVxuXHRcdFx0aWYgXy5pc0FycmF5KGxheWVycykgaXMgZmFsc2Ugb3IgbGF5ZXJzLmxlbmd0aCA8IDAgdGhlbiB0aHJvdyAnU3Vic2NyaWJlcnMgcmVxdWlyZXMgYW4gYXJyYXkuJ1xuXG5cdFx0XHQjIHByZXNlcnZlIGZvY3VzZWQgc3Vic2NyaWJlcnMgdGhhdCBhcmUgYWxzbyBpbmNsdWRlZCBpbiB0aGUgbmV3IGxheWVycyBhcnJheVxuXHRcdFx0QF9mb2N1c2VkU3Vic2NyaWJlcnMgPSBfLmludGVyc2VjdGlvbihAX2ZvY3VzZWRTdWJzY3JpYmVycywgbGF5ZXJzKVxuXHRcdFx0XG5cdFx0XHQjIHJlbW92ZSBleGlzdGluZyBzdWJzY3JpYmVycyB0aGF0IGFyZSBub3Qgb24gdGhlIG5ldyBsaXN0XG5cdFx0XHRhZGlvc1N1YnNjcmliZXJzID0gXy5kaWZmZXJlbmNlKEBfc3Vic2NyaWJlcnMsIGxheWVycylcblx0XHRcdEByZW1vdmVTdWJzY3JpYmVyKHN1YnNjcmliZXIpIGZvciBzdWJzY3JpYmVyIGluIGFkaW9zU3Vic2NyaWJlcnNcblx0XHRcblx0XHRcdCMgZGVmaW5lIG5ldyBzdWJzY3JpYmVyc1xuXHRcdFx0QGFkZFN1YnNjcmliZXIobGF5ZXIpIGZvciBsYXllciBpbiBsYXllcnNcblx0XHRcdFxuXHRcdFx0IyBhZGQgbGluayB0byBvYnNlcnZlciBpbiBzdWJzY3JpYmVyIGxheWVyc1xuXHRcdFx0c3Vic2NyaWJlci5vYnNlcnZlciA9IEAgZm9yIHN1YnNjcmliZXIgaW4gQF9zdWJzY3JpYmVyc1xuXG5cdFx0XHQjIHJlbW92ZSBmb2N1c2VkIHN1YnNjcmliZXIgaWYgbmV3IHN1YnNjcmliZXJzIGRvZXNuJ3QgaW5jbHVkZSBpdFxuXHRcdFx0aWYgbm90IF8uaW5jbHVkZXMoQF9zdWJzY3JpYmVycywgQF9mb2N1c2VkU3Vic2NyaWJlcilcblx0XHRcdFx0QF9mb2N1c2VkU3Vic2NyaWJlciA9IHVuZGVmaW5lZFxuXG5cdF9pc0ZvY3VzZWQ6IChsYXllcikgLT4gcmV0dXJuIF8uaW5jbHVkZXMoQF9mb2N1c2VkU3Vic2NyaWJlcnMsIGxheWVyKVxuXG5cdCMgYWRkIGEgbGF5ZXIgdG8gYXJyYXkgb2YgZm9jdXNlZCBzdWJzY3JpYmVycywgbWFraW5nIHJvb20gaWYgbmVjZXNzYXJ5XG5cdF9hZGRUb0ZvY3VzZWRTdWJzY3JpYmVyczogKGxheWVyLCBpbnN0YW50ID0gZmFsc2UpIC0+XG5cdFx0IyB0aHJvdyBhbiBlcnJvciBpZiBhIG5vbi1mb2N1c2VkIGxheWVyIHdhcyBzZW50IGhlcmVcblx0XHRpZiBAX2lzRm9jdXNlZChsYXllcikgaXMgdHJ1ZSB0aGVuIHRocm93IFwiRm9jdXNlZCBvbiBhIGZvY3VzZWQgc3Vic2NyaWJlci4gSXMgdGhhdCByaWdodD9cIlxuXG5cdFx0IyBpZiB3ZSdyZSBhdCB0aGUgbGltaXQgb2Ygb3VyIGZvY3VzZWQgc3Vic2NyaWJlcnMuLi5cblx0XHRpZiBfLnNpemUoQF9mb2N1c2VkU3Vic2NyaWJlcnMpID49IEBfbWF4Rm9jdXNlZFxuXHRcdFx0IyByZW1vdmUgdGhlIHN1YnNjcmliZSBmcm9tIHRoZSBmcm9udCBvZiB0aGUgbGlzdCBhbmQgc2V0IGl0IGFzIHVuZm9jdXNlZFxuXHRcdFx0QF9zZXRGb2N1c2VkKEBfZm9jdXNlZFN1YnNjcmliZXJzWzBdLCBmYWxzZSwgaW5zdGFudClcblx0XHRcdCMgcmVwZWF0IHVudGlsIHdlIGhhdmUgcm9vbSBmb3IgYSBuZXcgZm9jdXNlZCBzdWJzY3JpYmVyXG5cdFx0XHRAX2FkZFRvRm9jdXNlZFN1YnNjcmliZXJzKGxheWVyLCBpbnN0YW50KVxuXHRcdFxuXHRcdCMgaWYgKG9yIHdoZW4pIHRoZXJlIGlzIHJvb20uLi5cblx0XHRlbHNlXG5cdFx0XHQjIGFkZCB0aGUgbmV3IGZvY3VzZWQgc3Vic2NyaWJlciB0byB0aGUgZW5kIG9mIHRoZSBsaXN0XG5cdFx0XHRAX2ZvY3VzZWRTdWJzY3JpYmVycy5wdXNoKGxheWVyKVxuXHRcdFx0aWYgQF9ub3RpZnlPbkZvY3VzIGlzIHRydWUgdGhlbiBAbm90aWZ5U3Vic2NyaWJlcnMoKVxuXG5cdCMgcmVtb3ZlIGEgbGF5ZXIgZnJvbSBhcnJheSBvZiBmb2N1c2VkIHN1YnNjcmliZXJzXG5cdF9yZW1vdmVGcm9tRm9jdXNlZFN1YnNjcmliZXJzOiAobGF5ZXIsIGluc3RhbnQgPSBmYWxzZSkgLT5cblx0XHQjIHRocm93IGFuIGVycm9yIGlmIGEgbm9uLWZvY3VzZWQgbGF5ZXIgd2FzIHNlbnQgaGVyZVxuXHRcdGlmIEBfaXNGb2N1c2VkKGxheWVyKSBpcyBmYWxzZSB0aGVuIHRocm93IFwiVHJpZWQgdG8gcmVtb3ZlIGEgbGF5ZXIgdGhhdCB3YXNuJ3QgZm9jdXNlZC5cIlxuXHRcdFxuXHRcdCMgcmVtb3ZlIHRoZSBmb2N1c2VkIGxheWVyIGFuZCBzZXQgaXQgYXMgdW5mb2N1c2VkXG5cdFx0Xy5wdWxsKEBfZm9jdXNlZFN1YnNjcmliZXJzLCBsYXllcilcblx0XG5cblx0XG5cblxuZXhwb3J0cy5PYnNlcnZlckNvbXBvbmVudCA9IE9ic2VydmVyQ29tcG9uZW50XG5cbiIsImNsYXNzIEZvY3VzQ29tcG9uZW50IGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG5cblx0XHQjIFRoZSBGb2N1c0NvbXBvbmVudCBtYXkgZm9jdXMgb24gb25lIG9yIG1vcmUgc3ViamVjdHMgYXQgYSB0aW1lLlxuXG5cdFx0QF9zdWJqZWN0cyA9IFtdXG5cdFx0QF9mb2N1c2VkU3ViamVjdHMgPSBbXVxuXG5cdFx0QF9tYXhGb2N1c2VkID0gb3B0aW9ucy5tYXhGb2N1c2VkID8gMVxuXHRcdEBfdG9nZ2xlID0gb3B0aW9ucy50b2dnbGUgPyB0cnVlXG5cdFx0QF90cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyID8gJ1RhcCdcblx0XHRAX2ZvY3VzVHJpZ2dlciA9IG9wdGlvbnMuZm9jdXNUcmlnZ2VyID8gQF90cmlnZ2VyXG5cdFx0QF91bmZvY3VzVHJpZ2dlciA9IG9wdGlvbnMudW5mb2N1c1RyaWdnZXIgPyBAX3RyaWdnZXJcblx0XHRAX2RlZmF1bHRGb2N1c2VkID0gb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQgPyB7b3BhY2l0eTogMX1cblx0XHRAX2RlZmF1bHRVbmZvY3VzZWQgPSBvcHRpb25zLnN0YXRlcz8udW5mb2N1c2VkID8gaWYgb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQ/IHRoZW4gdW5kZWZpbmVkIGVsc2Uge29wYWNpdHk6IC41fVxuXHRcdEBfZGVmYXVsdEZvY3VzID0gb3B0aW9ucy5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0VW5mb2N1cyA9IG9wdGlvbnMudW5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0Tm90aWZ5ID0gb3B0aW9ucy5ub3RpZnkgPyAtPiByZXR1cm4gbnVsbFxuXHRcdEBfbm90aWZ5T25Gb2N1cyA9IG9wdGlvbnMubm90aWZ5T25Gb2N1cyA/IHRydWVcblx0XHRAX3VzZUZvY3VzU3RhdGVzID0gb3B0aW9ucy51c2VGb2N1c1N0YXRlcyA/IHRydWVcblx0XHRAX3VzZUZvY3VzRnVuY3Rpb25zID0gb3B0aW9ucy51c2VGb2N1c0Z1bmN0aW9ucyA/IHRydWVcblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6ICcuJ1xuXHRcdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cdCMgbm90aWZ5IHN1YmplY3RzXG5cdG5vdGlmeUZvY3VzZWRTdWJqZWN0czogKGZ1bmMgPSBAX2RlZmF1bHRGb2N1cykgLT4gZG8gXy5iaW5kKGZ1bmMsIHN1YmplY3QpIGZvciBzdWJqZWN0IGluIEBfZm9jdXNlZFN1YmplY3RzXG5cdG5vdGlmeVVuZm9jdXNlZFN1YmplY3RzOiAoZnVuYyA9IEBfZGVmYXVsdFVuZm9jdXMpIC0+IGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX3VuZm9jdXNlZFN1YmplY3RzXG5cdG5vdGlmeVN1YmplY3RzOiAoZnVuYyA9IEBfZGVmYXVsdE5vdGlmeSkgLT4gZG8gXy5iaW5kKGZ1bmMsIHN1YmplY3QpIGZvciBzdWJqZWN0IGluIEBfc3ViamVjdHNcblx0bm90aWZ5U2VsZWN0ZWQ6IChzdWJqZWN0cyA9IEBfc3ViamVjdHMsIGZ1bmMgPSBAX2RlZmF1bHROb3RpZnkpIC0+IFxuXHRcdGlmIHR5cGVvZiBzdWJqZWN0cyBpcyAnb2JqZWN0JyB0aGVuIHN1YmplY3RzID0gW3N1YmplY3RzXVxuXHRcdGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX3N1YmplY3RzXG5cblx0IyB1bmZvY3VzIGFsbCBmb2N1c2VkIHN1YmplY3RzXG5cdHVuZm9jdXNBbGw6IChpbnN0YW50ID0gZmFsc2UpIC0+IEBfc2V0Rm9jdXNlZChmYWxzZSwgaW5zdGFudCkgZm9yIHN1YmplY3QgaW4gQF9mb2N1c2VkU3ViamVjdHNcblxuXHQjIHJ1biBmb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRfZm9jdXM6IChzdWJqZWN0KSAtPiBkbyBfLmJpbmQoQF9kZWZhdWx0Rm9jdXMsIHN1YmplY3QpXG5cblx0IyBydW4gdW5mb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRfdW5mb2N1czogKHN1YmplY3QpIC0+IGRvIF8uYmluZChAX2RlZmF1bHRVbmZvY3VzLCBzdWJqZWN0KVxuXG5cdCMgYWRkIG9yIHJlbW92ZSBmb2N1cyB0cmlnZ2VycyB0byBhIHN1YmplY3Rcblx0YWRkRm9jdXNUcmlnZ2VyOiAoc3ViamVjdCwgZXZlbnROYW1lID0gQF9mb2N1c1RyaWdnZXIpIC0+IHN1YmplY3Qub24gRXZlbnRzW2V2ZW50TmFtZV0sID0+IEBfc2V0Rm9jdXNlZChzdWJqZWN0LCB0cnVlKVxuXHRyZW1vdmVGb2N1c1RyaWdnZXI6IChzdWJqZWN0LCBldmVudE5hbWUgPSBAX2ZvY3VzVHJpZ2dlcikgLT4gc3ViamVjdC5vZmYgRXZlbnRzW2V2ZW50TmFtZV0sID0+IEBfc2V0Rm9jdXNlZChzdWJqZWN0LCB0cnVlKVxuXG5cdCMgYWRkIG9yIHJlbW92ZSB1bmZvY3VzIHRyaWdnZXJzIGZyb20gYSBzdWJqZWN0XG5cdGFkZFVuZm9jdXNUcmlnZ2VyOiAoc3ViamVjdCwgZXZlbnROYW1lID0gQF91bmZvY3VzVHJpZ2dlcikgLT4gc3ViamVjdC5vbiBFdmVudHNbZXZlbnROYW1lXSwgPT4gQF9zZXRGb2N1c2VkKHN1YmplY3QsIGZhbHNlKVxuXHRyZW1vdmVVbmZvY3VzVHJpZ2dlcjogKHN1YmplY3QsIGV2ZW50TmFtZSA9IEBfdW5mb2N1c1RyaWdnZXIpIC0+IHN1YmplY3Qub2ZmIEV2ZW50c1tldmVudE5hbWVdLCA9PiBAX3NldEZvY3VzZWQoc3ViamVjdCwgZmFsc2UpXG5cblxuXHQjIHNldCBmb2N1c2VkIHN0YXRlIG9mIGEgc3ViamVjdCwgY2hhXG5cdF9zZXRGb2N1c2VkOiAoc3ViamVjdCwgYm9vbCwgaW5zdGFudCkgLT5cblx0XHQjIGlmIHRoZSBzdWJqZWN0J3MgZm9jdXMgc3RhdGUgc2hvdWxkIGJlIGZvY3VzZWQuLi5cblx0XHRpZiBib29sIGlzIHRydWVcblx0XHRcdCMgaWYgc3ViamVjdCBpcyBhbHJlYWR5IGZvY3VzZWQuLi5cblx0XHRcdGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIHRydWVcblx0XHRcdFx0IyBpZiB0b2dnbGUgbW9kZSBpcyBvbiwgdW5mb2N1cyB0aGUgc3ViamVjdFxuXHRcdFx0XHRpZiBAX3RvZ2dsZSBpcyB0cnVlIHRoZW4gQF9zZXRGb2N1c2VkKHN1YmplY3QsIGZhbHNlLCBpbnN0YW50KVxuXHRcdFx0XHQjIGVpdGhlciB3YXksIHJldHVyblxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0XHQjIGlmIHRoZSBzdWJqZWN0IGlzbid0IGFscmVhZHkgZm9jdXNlZCwgYWRkIGl0IHRvIGZvY3VzZWQgc3ViamVjdHNcblx0XHRcdEBfYWRkVG9Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCwgaW5zdGFudClcblx0XHRcdCMgYW5kIGlmIGZvY3VzZWQgc3RhdGVzIGFyZSBiZWluZyB1c2VkLi4uXG5cdFx0XHRpZiBAX3VzZUZvY3VzU3RhdGVzIGlzIHRydWVcblx0XHRcdFx0IyBlaXRoZXIgc3dpdGNoIG9yIGFuaW1hdGUgdG8gZm9jdXNlZCBzdGF0ZSwgZGVwZW5kaW5nIG9uIHRoZSBpbnN0YW50IGFyZ3VtZW50XG5cdFx0XHRcdGlmIGluc3RhbnQgdGhlbiBzdWJqZWN0LnN0YXRlU3dpdGNoKCdmb2N1c2VkJykgZWxzZSBzdWJqZWN0LmFuaW1hdGUoJ2ZvY3VzZWQnKVxuXHRcdFx0IyBhbmQgaWYgZm9jdXMgZnVuY3Rpb25zIGFyZSBiZWluZyB1c2VkLi4uIHJ1biBmb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRcdFx0aWYgQF91c2VGb2N1c0Z1bmN0aW9ucyBpcyB0cnVlIHRoZW4gQF9mb2N1cyhzdWJqZWN0KSBcblxuXHRcdCMgaWYgdGhlIHN1YmplY3QncyBmb2N1cyBzdGF0ZSBzaG91bGQgYmUgdW5mb2N1c2VkLi4uXG5cdFx0ZWxzZVxuXHRcdFx0IyBpZiB0aGUgc3ViamVjdCBpcyBhbHJlYWR5IHVuZm9jdXNlZCwgZG8gbm90aGluZ1xuXHRcdFx0aWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgZmFsc2UgdGhlbiByZXR1cm4gbnVsbFxuXG5cdFx0XHQjIGlmIGl0IGlzLCByZW1vdmUgaXQgZnJvbSBmb2N1c2VkIHN1YmplY3RzXG5cdFx0XHRAX3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCkgXG5cblx0XHRcdCMgYW5kIGlmIGZvY3VzZWQgc3RhdGVzIGFyZSBiZWluZyB1c2VkLi4uXG5cdFx0XHRpZiBAX3VzZUZvY3VzU3RhdGVzIGlzIHRydWVcblx0XHRcdFx0IyBlaXRoZXIgc3dpdGNoIG9yIGFuaW1hdGUgdG8gdGhlIHVuZm9jdXNlZCBzdGF0ZSwgZGVwZW5kaW5nIG9uIHRoZSBpbnN0YW50IGFyZ3VtZW50XG5cdFx0XHRcdGlmIGluc3RhbnQgdGhlbiBzdWJqZWN0LnN0YXRlU3dpdGNoKCd1bmZvY3VzZWQnKSBlbHNlIHN1YmplY3QuYW5pbWF0ZSgndW5mb2N1c2VkJylcblx0XHRcdCMgYW5kIGlmIGZvY3VzIGZ1bmN0aW9ucyBhcmUgYmVpbmcgdXNlZC4uLiBydW4gdGhlIHVuZm9jdXMgZnVuY3Rpb24gZm9yIHN1YmplY3Rcblx0XHRcdGlmIEBfdXNlRm9jdXNGdW5jdGlvbnMgaXMgdHJ1ZSB0aGVuIEBfdW5mb2N1cyhzdWJqZWN0KVxuXG5cdCMgYWRkIGEgbmV3IHN1YmplY3QgdG8gdGhpcyBvYnNlcnZlclxuXHRhZGRTdWJqZWN0OiAobmV3U3ViamVjdCwgb3B0aW9ucyA9IHt9KSAtPlxuXHRcdGZvY3VzVHJpZ2dlciA9IG9wdGlvbnMuZm9jdXNUcmlnZ2VyID8gQF9mb2N1c1RyaWdnZXJcblx0XHR1bmZvY3VzVHJpZ2dlciA9IG9wdGlvbnMuZm9jdXNUcmlnZ2VyID8gQF91bmZvY3VzVHJpZ2dlclxuXHRcdGZvY3VzZWQgPSBvcHRpb25zLmZvY3VzZWQgPyBmYWxzZVxuXHRcdGZvY3VzZWRTdGF0ZSA9IG9wdGlvbnMuZm9jdXNlZFN0YXRlID8gbmV3U3ViamVjdC5zdGF0ZXMuZm9jdXNlZFxuXHRcdHVuZm9jdXNlZFN0YXRlID0gb3B0aW9ucy51bmZvY3VzZWRTdGF0ZSA/IG5ld1N1YmplY3Quc3RhdGVzLnVuZm9jdXNlZFxuXG5cdFx0IyB0aHJvdyBhbiBlcnJvciBpZiBsYXllciBpc24ndCBhIGxheWVyXG5cdFx0aWYgbmV3U3ViamVjdCBpbnN0YW5jZW9mIExheWVyIGlzIGZhbHNlIHRoZW4gdGhyb3cgXCJPYnNlcnZlciBjYW4gb25seSBhZGQgbGF5ZXJzIHRvIGl0cyBsaXN0IG9mIHN1YmplY3RzLiAje2xheWVyfSwgaWQgI3tsYXllci5pZH0gaXMgbm90IGEgbGF5ZXIuXCJcblxuXHRcdCMgc2V0IGV2ZW50IHRyaWdnZXIgKGV2ZW50IG5hbWUgcHJvdmlkZWQgaW4gb3B0aW9ucyBvciBkZWZhdWx0IGV2ZW50IG5hbWUpXG5cdFx0QGFkZEZvY3VzVHJpZ2dlcihuZXdTdWJqZWN0LCBmb2N1c1RyaWdnZXIpXG5cdFx0QGFkZFVuZm9jdXNUcmlnZ2VyKG5ld1N1YmplY3QsIHVuZm9jdXNUcmlnZ2VyKVxuXG5cdFx0IyBzZXQgZm9jdXNlZCAvIHVuZm9jdXNlZCBsYXllciBzdGF0ZXMgKHN0YXRlcyBwcm92aWRlZCBpbiBvcHRpb25zLCBvciBleGlzdGluZyBzdGF0ZXMgb3IgZGVmYXVsdCBzdGF0ZXMpXG5cdFx0bmV3U3ViamVjdC5zdGF0ZXMuZm9jdXNlZCA9IGZvY3VzZWRTdGF0ZSA/IEBfZGVmYXVsdEZvY3VzZWRcblx0XHRuZXdTdWJqZWN0LnN0YXRlcy51bmZvY3VzZWQgPSB1bmZvY3VzZWRTdGF0ZSA/IEBfZGVmYXVsdFVuZm9jdXNlZCA/IG5ld1N1YmplY3Quc3RhdGVzLmRlZmF1bHRcblxuXHRcdCMgYWRkIGxheWVyIHRvIHN1YmplY3RzIGFycmF5XG5cdFx0QF9zdWJqZWN0cy5wdXNoKG5ld1N1YmplY3QpXG5cblx0XHQjIGlmIHRoaXMgc3ViamVjdCBzaG91bGQgc3RhcnQgYXMgZm9jdXNlZCwgc2V0IGl0IGFzIGZvY3VzZWRcblx0XHRAX3NldEZvY3VzZWQobmV3U3ViamVjdCwgZm9jdXNlZCwgdHJ1ZSlcblx0XHRpZiBAX3VzZUZvY3VzU3RhdGVzIGlzIHRydWUgdGhlbiBuZXdTdWJqZWN0LnN0YXRlU3dpdGNoKCd1bmZvY3VzZWQnKVxuXHRcdGlmIEBfdXNlRm9jdXNGdW5jdGlvbnMgaXMgdHJ1ZSB0aGVuIEBfdW5mb2N1cyhuZXdTdWJqZWN0KVxuXG5cblx0IyByZW1vdmUgYSBzdWJqZWN0IGZyb20gdGhpcyBvYnNlcnZlclxuXHRyZW1vdmVTdWJqZWN0OiAobGF5ZXIpIC0+XG5cblx0XHQjIHRocm93IGEgd2FybmluZyB3aGVuIHRyeWluZyB0byByZW1vdmUgYSBsYXllciBpc24ndCBhIHN1YmplY3Rcblx0XHRpZiBfLmluY2x1ZGVzKEBfc3ViamVjdHMsIGxheWVyKSBpcyBmYWxzZVxuXHRcdFx0aWYgbGF5ZXIgaW5zdGFuY2VvZiBMYXllciBpcyB0cnVlIHRoZW4gdGhyb3cgXCJUaGF0IGxheWVyICgje2xheWVyLm5hbWUgPyBsYXllcn0sIGlkOiAje2xheWVyLmlkfSkgaXNuJ3QgYSBzdWJqZWN0LlwiXG5cdFx0XHQjIHRocm93IGEgbW9yZSBkZXNjcmlwdGl2ZSBlcnJvciBpZiB0aGUgbGF5ZXIgaXNuJ3QgYSBsYXllci5cblx0XHRcdGVsc2UgdGhyb3cgXCJUaGF0IGlzbid0IGEgbGF5ZXIuIE9ic2VydmVyIGNhbiBvbmx5IHJlbW92ZSBsYXllcnMgdGhhdCBhcmUgb24gaXRzIGxpc3Qgb2Ygc3ViamVjdCBsYXllcnMuXCJcblx0XHRcblx0XHRpZiBAX2lzRm9jdXNlZChsYXllcikgdGhlbiBAX3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHMobGF5ZXIsIGZhbHNlKVxuXG5cdFx0IyByZW1vdmUgZnJvbSBsaXN0IG9mIHN1YmplY3RzXG5cdFx0Xy5wdWxsKEBfc3ViamVjdHMsIGxheWVyKVxuXHRcdCMgcmVtb3ZlIG9ic2VydmVyIHByb3BlcnR5XG5cdFx0bGF5ZXIub2JzZXJ2ZXIgPSB1bmRlZmluZWRcblx0XHQjIHJlbW92ZSBvYnNlcnZlciBmdW5jdGlvbnNcblx0XHRsYXllci5mb2N1cyA9IHVuZGVmaW5lZFxuXHRcdGxheWVyLnVuZm9jdXMgPSB1bmRlZmluZWRcblx0XHRsYXllci5ub3RpZnkgPSB1bmRlZmluZWRcblx0XHRsYXllci5yZW1vdmVGb2N1c1RyaWdnZXIobGF5ZXIuX3RyaWdnZXIpXG5cblx0QGRlZmluZSBcIm5vdGlmeVwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdE5vdGlmeVxuXHRcdHNldDogKGZ1bmMpIC0+XG5cdFx0XHRpZiB0eXBlb2YgZnVuYyBpc250ICdmdW5jdGlvbicgdGhlbiB0aHJvdyBcIk9ic2VydmVyQ29tcG9uZW50Lm5vdGlmeSByZXF1aXJlcyBhIGZ1bmN0aW9uIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfZGVmYXVsdE5vdGlmeSA9IGZ1bmNcblxuXG5cdEBkZWZpbmUgXCJub3RpZnlPbkZvY3VzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9ub3RpZnlPbkZvY3VzXG5cdFx0c2V0OiAoYm9vbCkgLT5cblx0XHRcdGlmIHR5cGVvZiBib29sIGlzbnQgJ2Jvb2xlYW4nIHRoZW4gdGhyb3cgXCJPYnNlcnZlckNvbXBvbmVudC5ub3RpZnlPbkZvY3VzIHJlcXVpcmVzIGEgYm9vbGVhbiAodHJ1ZSBvciBmYWxzZSkgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF9ub3RpZnlPbkZvY3VzID0gYm9vbFxuXG5cblx0QGRlZmluZSBcIm1heEZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX21heEZvY3VzZWRcblx0XHRzZXQ6IChudW1iZXIpIC0+XG5cdFx0XHRpZiB0eXBlb2YgbnVtYmVyIGlzbnQgJ251bWJlcicgdGhlbiB0aHJvdyBcIk9ic2VydmVyQ29tcG9uZW50Lm1heEZvY3VzZWQgcmVxdWlyZXMgYSBudW1iZXIgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF9tYXhGb2N1c2VkID0gbnVtYmVyXG5cblxuXHRAZGVmaW5lIFwidXNlRm9jdXNGdW5jdGlvbnNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3VzZUZvY3VzRnVuY3Rpb25zXG5cdFx0c2V0OiAoYm9vbCkgLT5cblx0XHRcdGlmIHR5cGVvZiBib29sIGlzbnQgJ2Jvb2xlYW4nIHRoZW4gdGhyb3cgXCJPYnNlcnZlckNvbXBvbmVudC5mb2N1c0Z1bmN0aW9ucyByZXF1aXJlcyBhIGJvb2xlYW4gKHRydWUgb3IgZmFsc2UpIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfdXNlRm9jdXNGdW5jdGlvbnMgPSBib29sXG5cblxuXHQjIGdldCBjdXJyZW50IGRlZmF1bHQgZm9jdXMgZnVuY3Rpb24sIHVzZWQgYnkgYWxsIHN1YmplY3RzLCBvciBzZXQgYSBuZXcgb25lXG5cdEBkZWZpbmUgXCJmb2N1c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdEZvY3VzXG5cdFx0c2V0OiAoZnVuYykgLT4gXG5cdFx0XHRpZiB0eXBlb2YgZnVuYyBpc250ICdmdW5jdGlvbicgdGhlbiB0aHJvdyBcIk9ic2VydmVyQ29tcG9uZW50LmZvY3VzIHJlcXVpcmVzIGEgZnVuY3Rpb24gdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgZm9jdXMsIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YmplY3RzIHdoZW4gZm9jdXNlZFxuXHRcdFx0QF9kZWZhdWx0Rm9jdXMgPSBmdW5jXG5cblxuXHQjIGdldCBjdXJyZW50IGRlZmF1bHQgdW5mb2N1cyBmdW5jdGlvbiwgdXNlZCBieSBhbGwgc3ViamVjdHMsIG9yIHNldCBhIG5ldyBvbmVcblx0QGRlZmluZSBcInVuZm9jdXNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2RlZmF1bHRVbmZvY3VzXG5cdFx0c2V0OiAoZnVuYykgLT4gXG5cdFx0XHRpZiB0eXBlb2YgZnVuYyBpc250ICdmdW5jdGlvbicgdGhlbiB0aHJvdyBcIk9ic2VydmVyQ29tcG9uZW50LnVuZm9jdXMgcmVxdWlyZXMgYSBmdW5jdGlvbiB2YWx1ZS5cIlxuXHRcdFx0XG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IHVuZm9jdXMsIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YmplY3RzIHdoZW4gdW5mb2N1c2VkXG5cdFx0XHRAX2RlZmF1bHRVbmZvY3VzID0gZnVuY1xuXG5cblx0IyBnZXQgY3VycmVudCBmb2N1c2VkIHN1YmplY3RzIG9yIHNldCBmb2N1c2VkIHN1YmplY3RzXG5cdEBkZWZpbmUgXCJmb2N1c2VkXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9mb2N1c2VkU3ViamVjdHNcblx0XHRzZXQ6IChsYXllcnMpIC0+XG5cdFx0XHQjIGFjY2VwdHMgYXJyYXlzLCBzbyBtYWtlIGFuIGFycmF5IGlmIG5vdCBnaXZlbiBvbmVcblx0XHRcdGlmIF8uaXNBcnJheShsYXllcnMpIGlzIGZhbHNlIHRoZW4gbGF5ZXJzID0gW2xheWVyc11cblxuXHRcdFx0IyBmb2N1cyBvbiBhbnkgb2YgdGhlIGxheWVycyB0aGF0IGFyZW4ndCBmb2N1c2VkIGFscmVhZHlcblx0XHRcdGxheWVycy5mb3JFYWNoIChsYXllcikgPT4gaWYgQF9pc0ZvY3VzZWQobGF5ZXIpIGlzIGZhbHNlIHRoZW4gQF9hZGRUb0ZvY3VzZWRTdWJqZWN0cyhsYXllciwgdHJ1ZSlcblxuXG5cdCMgZ2V0IGN1cnJlbnQgdW5mb2N1c2VkIHN1YmplY3RzXG5cdEBkZWZpbmUgXCJ1bmZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBfLndpdGhvdXQoQF9zdWJqZWN0cywgQF9mb2N1c2VkU3ViamVjdHMpXG5cdFx0c2V0OiAobGF5ZXJzKSAtPlxuXHRcdFx0IyBhY2NlcHRzIGFycmF5cywgc28gbWFrZSBhbiBhcnJheSBpZiBub3QgZ2l2ZW4gb25lXG5cdFx0XHRpZiBfLmlzQXJyYXkobGF5ZXJzKSBpcyBmYWxzZSB0aGVuIGxheWVycyA9IFtsYXllcnNdXG5cblx0XHRcdCMgdW5mb2N1cyBhbnkgb2YgdGhlIGxheWVycyB0aGF0IGFyZSBmb2N1c2VkXG5cdFx0XHRsYXllcnMuZm9yRWFjaCAobGF5ZXIpID0+IGlmIEBfaXNGb2N1c2VkKGxheWVyKSBpcyB0cnVlIHRoZW4gQF9yZW1vdmVGcm9tRm9jdXNlZFN1YmplY3RzKGxheWVyLCB0cnVlKVxuXG5cblx0QGRlZmluZSBcInVzZUZvY3VzU3RhdGVzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF91c2VGb2N1c1N0YXRlc1xuXHRcdHNldDogKGJvb2wpIC0+IFxuXHRcdFx0aWYgdHlwZW9mIGJvb2wgaXNudCAnYm9vbGVhbicgdGhlbiB0aHJvdyBcIk9ic2VydmVyQ29tcG9uZW50LnVzZUZvY3VzU3RhdGVzIHJlcXVpcmVzIGEgYm9vbGVhbiB2YWx1ZS5cIlxuXHRcdFx0QF91c2VGb2N1c1N0YXRlcyA9IGJvb2xcblxuXG5cdCMgZ2V0IG9yIHNldCBkZWZhdWx0IGZvY3VzZWQgc3RhdGUgYWRkZWQgdG8gbmV3IHN1YmplY3RzXG5cdEBkZWZpbmUgXCJmb2N1c2VkU3RhdGVcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2RlZmF1bHRGb2N1c2VkXG5cdFx0c2V0OiAoc3RhdGUgPSB7fSkgLT4gXG5cdFx0XHRpZiB0eXBlb2Ygc3RhdGUgaXNudCAnb2JqZWN0JyB0aGVuIHRocm93IFwiT2JzZXJ2ZXJDb21wb25lbnQuZm9jdXNTdGF0ZSByZXF1aXJlcyBhbiBvYmplY3QgKGEgTGF5ZXIgc3RhdGUpLlwiXG5cdFx0XHRAX2RlZmF1bHRGb2N1c2VkID0gc3RhdGVcblxuXG5cdCMgZ2V0IG9yIHNldCBkZWZhdWx0IHVuZm9jdXNlZCBzdGF0ZSBhZGRlZCB0byBuZXcgc3ViamVjdHNcblx0QGRlZmluZSBcInVuZm9jdXNlZFN0YXRlXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9kZWZhdWx0VW5mb2N1c2VkXG5cdFx0c2V0OiAoc3RhdGUgPSB7fSkgLT4gXG5cdFx0XHRpZiB0eXBlb2Ygc3RhdGUgaXNudCAnb2JqZWN0JyB0aGVuIHRocm93IFwiT2JzZXJ2ZXJDb21wb25lbnQuZm9jdXNTdGF0ZSByZXF1aXJlcyBhbiBvYmplY3QgKGEgTGF5ZXIgc3RhdGUpLlwiXG5cdFx0XHRAX2RlZmF1bHRVbmZvY3VzZWQgPSBzdGF0ZVxuXHRcblxuXHQjIGdldCBvciBzZXQgdGhlIGFycmF5IG9mIHN1YmplY3RzICggbmVlZHMgd29yayApXG5cdEBkZWZpbmUgXCJzdWJqZWN0c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfc3ViamVjdHNcblx0XHRzZXQ6IChsYXllcnMpIC0+XG5cdFx0XHQjIHRocm93IGVycm9yIGlmIGxheWVycyBpc250IGFuIGFycmF5XG5cdFx0XHRpZiBfLmlzQXJyYXkobGF5ZXJzKSBpcyBmYWxzZSBvciBsYXllcnMubGVuZ3RoIDwgMCB0aGVuIHRocm93ICdTdWJqZWN0cyByZXF1aXJlcyBhbiBhcnJheS4nXG5cblx0XHRcdCMgcHJlc2VydmUgZm9jdXNlZCBzdWJqZWN0cyB0aGF0IGFyZSBhbHNvIGluY2x1ZGVkIGluIHRoZSBuZXcgbGF5ZXJzIGFycmF5XG5cdFx0XHRAX2ZvY3VzZWRTdWJqZWN0cyA9IF8uaW50ZXJzZWN0aW9uKEBfZm9jdXNlZFN1YmplY3RzLCBsYXllcnMpXG5cdFx0XHRcblx0XHRcdCMgcmVtb3ZlIGV4aXN0aW5nIHN1YmplY3RzIHRoYXQgYXJlIG5vdCBvbiB0aGUgbmV3IGxpc3Rcblx0XHRcdGFkaW9zU3ViamVjdHMgPSBfLmRpZmZlcmVuY2UoQF9zdWJqZWN0cywgbGF5ZXJzKVxuXHRcdFx0QHJlbW92ZVN1YmplY3Qoc3ViamVjdCkgZm9yIHN1YmplY3QgaW4gYWRpb3NTdWJqZWN0c1xuXHRcdFxuXHRcdFx0IyBkZWZpbmUgbmV3IHN1YmplY3RzXG5cdFx0XHRAYWRkU3ViamVjdChsYXllcikgZm9yIGxheWVyIGluIGxheWVyc1xuXHRcdFx0XG5cdFx0XHQjIGFkZCBsaW5rIHRvIG9ic2VydmVyIGluIHN1YmplY3QgbGF5ZXJzXG5cdFx0XHRzdWJqZWN0Lm9ic2VydmVyID0gQCBmb3Igc3ViamVjdCBpbiBAX3N1YmplY3RzXG5cblx0XHRcdCMgcmVtb3ZlIGZvY3VzZWQgc3ViamVjdCBpZiBuZXcgc3ViamVjdHMgZG9lc24ndCBpbmNsdWRlIGl0XG5cdFx0XHRpZiBub3QgXy5pbmNsdWRlcyhAX3N1YmplY3RzLCBAX2ZvY3VzZWRTdWJqZWN0KVxuXHRcdFx0XHRAX2ZvY3VzZWRTdWJqZWN0ID0gdW5kZWZpbmVkXG5cblx0X2lzRm9jdXNlZDogKGxheWVyKSAtPiByZXR1cm4gXy5pbmNsdWRlcyhAX2ZvY3VzZWRTdWJqZWN0cywgbGF5ZXIpXG5cblx0IyBhZGQgYSBsYXllciB0byBhcnJheSBvZiBmb2N1c2VkIHN1YmplY3RzLCBtYWtpbmcgcm9vbSBpZiBuZWNlc3Nhcnlcblx0X2FkZFRvRm9jdXNlZFN1YmplY3RzOiAobGF5ZXIsIGluc3RhbnQgPSBmYWxzZSkgLT5cblx0XHQjIHRocm93IGFuIGVycm9yIGlmIGEgbm9uLWZvY3VzZWQgbGF5ZXIgd2FzIHNlbnQgaGVyZVxuXHRcdGlmIEBfaXNGb2N1c2VkKGxheWVyKSBpcyB0cnVlIHRoZW4gdGhyb3cgXCJGb2N1c2VkIG9uIGEgZm9jdXNlZCBzdWJqZWN0LiBJcyB0aGF0IHJpZ2h0P1wiXG5cblx0XHQjIGlmIHdlJ3JlIGF0IHRoZSBsaW1pdCBvZiBvdXIgZm9jdXNlZCBzdWJqZWN0cy4uLlxuXHRcdGlmIF8uc2l6ZShAX2ZvY3VzZWRTdWJqZWN0cykgPj0gQF9tYXhGb2N1c2VkXG5cdFx0XHQjIHJlbW92ZSB0aGUgc3Vic2NyaWJlIGZyb20gdGhlIGZyb250IG9mIHRoZSBsaXN0IGFuZCBzZXQgaXQgYXMgdW5mb2N1c2VkXG5cdFx0XHRAX3NldEZvY3VzZWQoQF9mb2N1c2VkU3ViamVjdHNbMF0sIGZhbHNlLCBpbnN0YW50KVxuXHRcdFx0IyByZXBlYXQgdW50aWwgd2UgaGF2ZSByb29tIGZvciBhIG5ldyBmb2N1c2VkIHN1YmplY3Rcblx0XHRcdEBfYWRkVG9Gb2N1c2VkU3ViamVjdHMobGF5ZXIsIGluc3RhbnQpXG5cdFx0XG5cdFx0IyBpZiAob3Igd2hlbikgdGhlcmUgaXMgcm9vbS4uLlxuXHRcdGVsc2Vcblx0XHRcdCMgYWRkIHRoZSBuZXcgZm9jdXNlZCBzdWJqZWN0IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Rcblx0XHRcdEBfZm9jdXNlZFN1YmplY3RzLnB1c2gobGF5ZXIpXG5cdFx0XHRpZiBAX25vdGlmeU9uRm9jdXMgaXMgdHJ1ZSB0aGVuIEBub3RpZnlTdWJqZWN0cygpXG5cblx0IyByZW1vdmUgYSBsYXllciBmcm9tIGFycmF5IG9mIGZvY3VzZWQgc3ViamVjdHNcblx0X3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHM6IChsYXllciwgaW5zdGFudCA9IGZhbHNlKSAtPlxuXHRcdCMgdGhyb3cgYW4gZXJyb3IgaWYgYSBub24tZm9jdXNlZCBsYXllciB3YXMgc2VudCBoZXJlXG5cdFx0aWYgQF9pc0ZvY3VzZWQobGF5ZXIpIGlzIGZhbHNlIHRoZW4gdGhyb3cgXCJUcmllZCB0byByZW1vdmUgYSBsYXllciB0aGF0IHdhc24ndCBmb2N1c2VkLlwiXG5cdFx0XG5cdFx0IyByZW1vdmUgdGhlIGZvY3VzZWQgbGF5ZXIgYW5kIHNldCBpdCBhcyB1bmZvY3VzZWRcblx0XHRfLnB1bGwoQF9mb2N1c2VkU3ViamVjdHMsIGxheWVyKVxuXHRcblxuXHRcblxuXG5leHBvcnRzLk9ic2VydmVyQ29tcG9uZW50ID0gT2JzZXJ2ZXJDb21wb25lbnRcblxuIiwiY2xhc3MgT2JzZXJ2ZXJDb21wb25lbnQgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKG9wdGlvbnMgPSB7fSkgLT5cblxuXHRcdEBfc3Vic2NyaWJlcnMgPSBbXVxuXHRcdEBfZm9jdXNlZFN1YnNjcmliZXJzID0gW11cblxuXHRcdEBfbWF4Rm9jdXNlZCA9IG9wdGlvbnMubWF4Rm9jdXNlZCA/IDFcblx0XHRAX3RvZ2dsZSA9IG9wdGlvbnMudG9nZ2xlID8gdHJ1ZVxuXHRcdEBfdHJpZ2dlciA9IG9wdGlvbnMudHJpZ2dlciA/ICdUYXAnXG5cdFx0QF9kZWZhdWx0Rm9jdXNlZCA9IG9wdGlvbnMuc3RhdGVzPy5mb2N1c2VkID8ge29wYWNpdHk6IDF9XG5cdFx0QF9kZWZhdWx0VW5mb2N1c2VkID0gb3B0aW9ucy5zdGF0ZXM/LnVuZm9jdXNlZCA/IGlmIG9wdGlvbnMuc3RhdGVzPy5mb2N1c2VkPyB0aGVuIHVuZGVmaW5lZCBlbHNlIHtvcGFjaXR5OiAuNX1cblx0XHRAX2RlZmF1bHRGb2N1cyA9IG9wdGlvbnMuZm9jdXMgPyAtPiByZXR1cm4gbnVsbFxuXHRcdEBfZGVmYXVsdFVuZm9jdXMgPSBvcHRpb25zLnVuZm9jdXMgPyAtPiByZXR1cm4gbnVsbFxuXHRcdEBfZGVmYXVsdE5vdGlmeSA9IG9wdGlvbnMubm90aWZ5ID8gLT4gcmV0dXJuIG51bGxcblx0XHRAX25vdGlmeU9uRm9jdXMgPSBvcHRpb25zLm5vdGlmeU9uRm9jdXMgPyB0cnVlXG5cdFx0QF91c2VGb2N1c1N0YXRlcyA9IG9wdGlvbnMudXNlRm9jdXNTdGF0ZXMgPyB0cnVlXG5cdFx0QF91c2VGb2N1c0Z1bmN0aW9ucyA9IG9wdGlvbnMudXNlRm9jdXNGdW5jdGlvbnMgPyB0cnVlXG5cblx0XHRzdXBlciBfLmRlZmF1bHRzIG9wdGlvbnMsXG5cdFx0XHRuYW1lOiAnLidcblx0XHRcdHNpemU6IFNjcmVlbi5zaXplXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblxuXHQjIG5vdGlmeSBzdWJzY3JpYmVyc1xuXHRub3RpZnlGb2N1c2VkU3Vic2NyaWJlcnM6IChmdW5jID0gQF9kZWZhdWx0Rm9jdXMpIC0+IGRvIF8uYmluZChmdW5jLCBzdWJzY3JpYmVyKSBmb3Igc3Vic2NyaWJlciBpbiBAX2ZvY3VzZWRTdWJzY3JpYmVyc1xuXHRub3RpZnlVbmZvY3VzZWRTdWJzY3JpYmVyczogKGZ1bmMgPSBAX2RlZmF1bHRVbmZvY3VzKSAtPiBkbyBfLmJpbmQoZnVuYywgc3Vic2NyaWJlcikgZm9yIHN1YnNjcmliZXIgaW4gQF91bmZvY3VzZWRTdWJzY3JpYmVyc1xuXHRub3RpZnlTdWJzY3JpYmVyczogKGZ1bmMgPSBAX2RlZmF1bHROb3RpZnkpIC0+IGRvIF8uYmluZChmdW5jLCBzdWJzY3JpYmVyKSBmb3Igc3Vic2NyaWJlciBpbiBAX3N1YnNjcmliZXJzXG5cdG5vdGlmeVNlbGVjdGVkOiAoc3Vic2NyaWJlcnMgPSBAX3N1YnNjcmliZXJzLCBmdW5jID0gQF9kZWZhdWx0Tm90aWZ5KSAtPiBcblx0XHRpZiB0eXBlb2Ygc3Vic2NyaWJlcnMgaXMgJ29iamVjdCcgdGhlbiBzdWJzY3JpYmVycyA9IFtzdWJzY3JpYmVyc11cblx0XHRkbyBfLmJpbmQoZnVuYywgc3Vic2NyaWJlcikgZm9yIHN1YnNjcmliZXIgaW4gQF9zdWJzY3JpYmVyc1xuXG5cdCMgdW5mb2N1cyBhbGwgZm9jdXNlZCBzdWJzY3JpYmVyc1xuXHR1bmZvY3VzQWxsOiAoaW5zdGFudCA9IGZhbHNlKSAtPiBAX3NldEZvY3VzZWQoZmFsc2UsIGluc3RhbnQpIGZvciBzdWJzY3JpYmVyIGluIEBfZm9jdXNlZFN1YnNjcmliZXJzXG5cblx0IyBydW4gZm9jdXMgZnVuY3Rpb24gZm9yIHN1YnNjcmliZXJcblx0X2ZvY3VzOiAoc3Vic2NyaWJlcikgLT4gZG8gXy5iaW5kKEBfZGVmYXVsdEZvY3VzLCBzdWJzY3JpYmVyKVxuXG5cdCMgcnVuIHVuZm9jdXMgZnVuY3Rpb24gZm9yIHN1YnNjcmliZXJcblx0X3VuZm9jdXM6IChzdWJzY3JpYmVyKSAtPiBkbyBfLmJpbmQoQF9kZWZhdWx0VW5mb2N1cywgc3Vic2NyaWJlcilcblxuXHQjIGFkZCBvciByZW1vdmUgZm9jdXMgdHJpZ2dlcnMgdG8gYSBzdWJzY3JpYmVyXG5cdGFkZEZvY3VzVHJpZ2dlcjogKHN1YnNjcmliZXIsIGV2ZW50TmFtZSA9IEBfdHJpZ2dlcikgLT4gc3Vic2NyaWJlci5vbiBFdmVudHNbZXZlbnROYW1lXSwgPT4gQF9zZXRGb2N1c2VkKHN1YnNjcmliZXIsIHRydWUpXG5cdHJlbW92ZUZvY3VzVHJpZ2dlcjogKHN1YnNjcmliZXIsIGV2ZW50TmFtZSA9IEBfdHJpZ2dlcikgLT4gc3Vic2NyaWJlci5vZmYgRXZlbnRzW2V2ZW50TmFtZV0sID0+IEBfc2V0Rm9jdXNlZChzdWJzY3JpYmVyLCB0cnVlKVxuXG5cblx0IyBzZXQgZm9jdXNlZCBzdGF0ZSBvZiBhIHN1YnNjcmliZXIsIGNoYVxuXHRfc2V0Rm9jdXNlZDogKHN1YnNjcmliZXIsIGJvb2wsIGluc3RhbnQpIC0+XG5cdFx0IyBpZiB0aGUgc3Vic2NyaWJlcidzIGZvY3VzIHN0YXRlIHNob3VsZCBiZSBmb2N1c2VkLi4uXG5cdFx0aWYgYm9vbCBpcyB0cnVlXG5cdFx0XHQjIGlmIHN1YnNjcmliZXIgaXMgYWxyZWFkeSBmb2N1c2VkLi4uXG5cdFx0XHRpZiBAX2lzRm9jdXNlZChzdWJzY3JpYmVyKSBpcyB0cnVlXG5cdFx0XHRcdCMgaWYgdG9nZ2xlIG1vZGUgaXMgb24sIHVuZm9jdXMgdGhlIHN1YnNjcmliZXJcblx0XHRcdFx0aWYgQF90b2dnbGUgaXMgdHJ1ZSB0aGVuIEBfc2V0Rm9jdXNlZChzdWJzY3JpYmVyLCBmYWxzZSwgaW5zdGFudClcblx0XHRcdFx0IyBlaXRoZXIgd2F5LCByZXR1cm5cblx0XHRcdFx0cmV0dXJuIG51bGxcblxuXHRcdFx0IyBpZiB0aGUgc3Vic2NyaWJlciBpc24ndCBhbHJlYWR5IGZvY3VzZWQsIGFkZCBpdCB0byBmb2N1c2VkIHN1YnNjcmliZXJzXG5cdFx0XHRAX2FkZFRvRm9jdXNlZFN1YnNjcmliZXJzKHN1YnNjcmliZXIsIGluc3RhbnQpXG5cdFx0XHQjIGFuZCBpZiBmb2N1c2VkIHN0YXRlcyBhcmUgYmVpbmcgdXNlZC4uLlxuXHRcdFx0aWYgQF91c2VGb2N1c1N0YXRlcyBpcyB0cnVlXG5cdFx0XHRcdCMgZWl0aGVyIHN3aXRjaCBvciBhbmltYXRlIHRvIGZvY3VzZWQgc3RhdGUsIGRlcGVuZGluZyBvbiB0aGUgaW5zdGFudCBhcmd1bWVudFxuXHRcdFx0XHRpZiBpbnN0YW50IHRoZW4gc3Vic2NyaWJlci5zdGF0ZVN3aXRjaCgnZm9jdXNlZCcpIGVsc2Ugc3Vic2NyaWJlci5hbmltYXRlKCdmb2N1c2VkJylcblx0XHRcdCMgYW5kIGlmIGZvY3VzIGZ1bmN0aW9ucyBhcmUgYmVpbmcgdXNlZC4uLiBydW4gZm9jdXMgZnVuY3Rpb24gZm9yIHN1YnNjcmliZXJcblx0XHRcdGlmIEBfdXNlRm9jdXNGdW5jdGlvbnMgaXMgdHJ1ZSB0aGVuIEBfZm9jdXMoc3Vic2NyaWJlcikgXG5cblx0XHQjIGlmIHRoZSBzdWJzY3JpYmVyJ3MgZm9jdXMgc3RhdGUgc2hvdWxkIGJlIHVuZm9jdXNlZC4uLlxuXHRcdGVsc2Vcblx0XHRcdCMgaWYgdGhlIHN1YnNjcmliZXIgaXMgYWxyZWFkeSB1bmZvY3VzZWQsIGRvIG5vdGhpbmdcblx0XHRcdGlmIEBfaXNGb2N1c2VkKHN1YnNjcmliZXIpIGlzIGZhbHNlIHRoZW4gcmV0dXJuIG51bGxcblxuXHRcdFx0IyBpZiBpdCBpcywgcmVtb3ZlIGl0IGZyb20gZm9jdXNlZCBzdWJzY3JpYmVyc1xuXHRcdFx0QF9yZW1vdmVGcm9tRm9jdXNlZFN1YnNjcmliZXJzKHN1YnNjcmliZXIpIFxuXG5cdFx0XHQjIGFuZCBpZiBmb2N1c2VkIHN0YXRlcyBhcmUgYmVpbmcgdXNlZC4uLlxuXHRcdFx0aWYgQF91c2VGb2N1c1N0YXRlcyBpcyB0cnVlXG5cdFx0XHRcdCMgZWl0aGVyIHN3aXRjaCBvciBhbmltYXRlIHRvIHRoZSB1bmZvY3VzZWQgc3RhdGUsIGRlcGVuZGluZyBvbiB0aGUgaW5zdGFudCBhcmd1bWVudFxuXHRcdFx0XHRpZiBpbnN0YW50IHRoZW4gc3Vic2NyaWJlci5zdGF0ZVN3aXRjaCgndW5mb2N1c2VkJykgZWxzZSBzdWJzY3JpYmVyLmFuaW1hdGUoJ3VuZm9jdXNlZCcpXG5cdFx0XHQjIGFuZCBpZiBmb2N1cyBmdW5jdGlvbnMgYXJlIGJlaW5nIHVzZWQuLi4gcnVuIHRoZSB1bmZvY3VzIGZ1bmN0aW9uIGZvciBzdWJzY3JpYmVyXG5cdFx0XHRpZiBAX3VzZUZvY3VzRnVuY3Rpb25zIGlzIHRydWUgdGhlbiBAX3VuZm9jdXMoc3Vic2NyaWJlcilcblxuXHQjIGFkZCBhIG5ldyBzdWJzY3JpYmVyIHRvIHRoaXMgb2JzZXJ2ZXJcblx0YWRkU3Vic2NyaWJlcjogKG5ld1N1YnNjcmliZXIsIG9wdGlvbnMgPSB7fSkgLT5cblx0XHR0cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyID8gQF90cmlnZ2VyXG5cdFx0Zm9jdXNlZCA9IG9wdGlvbnMuZm9jdXNlZCA/IGZhbHNlXG5cdFx0Zm9jdXNlZFN0YXRlID0gb3B0aW9ucy5mb2N1c2VkU3RhdGUgPyBuZXdTdWJzY3JpYmVyLnN0YXRlcy5mb2N1c2VkXG5cdFx0dW5mb2N1c2VkU3RhdGUgPSBvcHRpb25zLnVuZm9jdXNlZFN0YXRlID8gbmV3U3Vic2NyaWJlci5zdGF0ZXMudW5mb2N1c2VkXG5cblx0XHQjIHRocm93IGFuIGVycm9yIGlmIGxheWVyIGlzbid0IGEgbGF5ZXJcblx0XHRpZiBuZXdTdWJzY3JpYmVyIGluc3RhbmNlb2YgTGF5ZXIgaXMgZmFsc2UgdGhlbiB0aHJvdyBcIk9ic2VydmVyIGNhbiBvbmx5IGFkZCBsYXllcnMgdG8gaXRzIGxpc3Qgb2Ygc3Vic2NyaWJlcnMuICN7bGF5ZXJ9LCBpZCAje2xheWVyLmlkfSBpcyBub3QgYSBsYXllci5cIlxuXG5cdFx0IyBzZXQgZXZlbnQgdHJpZ2dlciAoZXZlbnQgbmFtZSBwcm92aWRlZCBpbiBvcHRpb25zIG9yIGRlZmF1bHQgZXZlbnQgbmFtZSlcblx0XHRAYWRkRm9jdXNUcmlnZ2VyKG5ld1N1YnNjcmliZXIsIHRyaWdnZXIpXG5cblx0XHQjIHNldCBmb2N1c2VkIC8gdW5mb2N1c2VkIGxheWVyIHN0YXRlcyAoc3RhdGVzIHByb3ZpZGVkIGluIG9wdGlvbnMsIG9yIGV4aXN0aW5nIHN0YXRlcyBvciBkZWZhdWx0IHN0YXRlcylcblx0XHRuZXdTdWJzY3JpYmVyLnN0YXRlcy5mb2N1c2VkID0gZm9jdXNlZFN0YXRlID8gQF9kZWZhdWx0Rm9jdXNlZFxuXHRcdG5ld1N1YnNjcmliZXIuc3RhdGVzLnVuZm9jdXNlZCA9IHVuZm9jdXNlZFN0YXRlID8gQF9kZWZhdWx0VW5mb2N1c2VkID8gbmV3U3Vic2NyaWJlci5zdGF0ZXMuZGVmYXVsdFxuXG5cdFx0IyBhZGQgbGF5ZXIgdG8gc3Vic2NyaWJlcnMgYXJyYXlcblx0XHRAX3N1YnNjcmliZXJzLnB1c2gobmV3U3Vic2NyaWJlcilcblxuXHRcdCMgaWYgdGhpcyBzdWJzY3JpYmVyIHNob3VsZCBzdGFydCBhcyBmb2N1c2VkLCBzZXQgaXQgYXMgZm9jdXNlZFxuXHRcdEBfc2V0Rm9jdXNlZChuZXdTdWJzY3JpYmVyLCBmb2N1c2VkLCB0cnVlKVxuXHRcdGlmIEBfdXNlRm9jdXNTdGF0ZXMgaXMgdHJ1ZSB0aGVuIG5ld1N1YnNjcmliZXIuc3RhdGVTd2l0Y2goJ3VuZm9jdXNlZCcpXG5cdFx0aWYgQF91c2VGb2N1c0Z1bmN0aW9ucyBpcyB0cnVlIHRoZW4gQF91bmZvY3VzKG5ld1N1YnNjcmliZXIpXG5cblxuXHQjIHJlbW92ZSBhIHN1YnNjcmliZXIgZnJvbSB0aGlzIG9ic2VydmVyXG5cdHJlbW92ZVN1YnNjcmliZXI6IChsYXllcikgLT5cblxuXHRcdCMgdGhyb3cgYSB3YXJuaW5nIHdoZW4gdHJ5aW5nIHRvIHJlbW92ZSBhIGxheWVyIGlzbid0IGEgc3Vic2NyaWJlclxuXHRcdGlmIF8uaW5jbHVkZXMoQF9zdWJzY3JpYmVycywgbGF5ZXIpIGlzIGZhbHNlXG5cdFx0XHRpZiBsYXllciBpbnN0YW5jZW9mIExheWVyIGlzIHRydWUgdGhlbiB0aHJvdyBcIlRoYXQgbGF5ZXIgKCN7bGF5ZXIubmFtZSA/IGxheWVyfSwgaWQ6ICN7bGF5ZXIuaWR9KSBpc24ndCBhIHN1YnNjcmliZXIuXCJcblx0XHRcdCMgdGhyb3cgYSBtb3JlIGRlc2NyaXB0aXZlIGVycm9yIGlmIHRoZSBsYXllciBpc24ndCBhIGxheWVyLlxuXHRcdFx0ZWxzZSB0aHJvdyBcIlRoYXQgaXNuJ3QgYSBsYXllci4gT2JzZXJ2ZXIgY2FuIG9ubHkgcmVtb3ZlIGxheWVycyB0aGF0IGFyZSBvbiBpdHMgbGlzdCBvZiBzdWJzY3JpYmVyIGxheWVycy5cIlxuXHRcdFxuXHRcdGlmIEBfaXNGb2N1c2VkKGxheWVyKSB0aGVuIEBfcmVtb3ZlRnJvbUZvY3VzZWRTdWJzY3JpYmVycyhsYXllciwgZmFsc2UpXG5cblx0XHQjIHJlbW92ZSBmcm9tIGxpc3Qgb2Ygc3Vic2NyaWJlcnNcblx0XHRfLnB1bGwoQF9zdWJzY3JpYmVycywgbGF5ZXIpXG5cdFx0IyByZW1vdmUgb2JzZXJ2ZXIgcHJvcGVydHlcblx0XHRsYXllci5vYnNlcnZlciA9IHVuZGVmaW5lZFxuXHRcdCMgcmVtb3ZlIG9ic2VydmVyIGZ1bmN0aW9uc1xuXHRcdGxheWVyLmZvY3VzID0gdW5kZWZpbmVkXG5cdFx0bGF5ZXIudW5mb2N1cyA9IHVuZGVmaW5lZFxuXHRcdGxheWVyLm5vdGlmeSA9IHVuZGVmaW5lZFxuXHRcdGxheWVyLnJlbW92ZUZvY3VzVHJpZ2dlcihsYXllci5fdHJpZ2dlcilcblxuXHRAZGVmaW5lIFwibm90aWZ5XCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9kZWZhdWx0Tm90aWZ5XG5cdFx0c2V0OiAoZnVuYykgLT5cblx0XHRcdGlmIHR5cGVvZiBmdW5jIGlzbnQgJ2Z1bmN0aW9uJyB0aGVuIHRocm93IFwiT2JzZXJ2ZXJDb21wb25lbnQubm90aWZ5IHJlcXVpcmVzIGEgZnVuY3Rpb24gdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJzY3JpYmVyc1xuXHRcdFx0QF9kZWZhdWx0Tm90aWZ5ID0gZnVuY1xuXG5cblx0QGRlZmluZSBcIm5vdGlmeU9uRm9jdXNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX25vdGlmeU9uRm9jdXNcblx0XHRzZXQ6IChib29sKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGJvb2wgaXNudCAnYm9vbGVhbicgdGhlbiB0aHJvdyBcIk9ic2VydmVyQ29tcG9uZW50Lm5vdGlmeU9uRm9jdXMgcmVxdWlyZXMgYSBib29sZWFuICh0cnVlIG9yIGZhbHNlKSB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBub3RpZnksIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YnNjcmliZXJzXG5cdFx0XHRAX25vdGlmeU9uRm9jdXMgPSBib29sXG5cblxuXHRAZGVmaW5lIFwibWF4Rm9jdXNlZFwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfbWF4Rm9jdXNlZFxuXHRcdHNldDogKG51bWJlcikgLT5cblx0XHRcdGlmIHR5cGVvZiBudW1iZXIgaXNudCAnbnVtYmVyJyB0aGVuIHRocm93IFwiT2JzZXJ2ZXJDb21wb25lbnQubWF4Rm9jdXNlZCByZXF1aXJlcyBhIG51bWJlciB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBub3RpZnksIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YnNjcmliZXJzXG5cdFx0XHRAX21heEZvY3VzZWQgPSBudW1iZXJcblxuXG5cdEBkZWZpbmUgXCJ1c2VGb2N1c0Z1bmN0aW9uc1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdXNlRm9jdXNGdW5jdGlvbnNcblx0XHRzZXQ6IChib29sKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGJvb2wgaXNudCAnYm9vbGVhbicgdGhlbiB0aHJvdyBcIk9ic2VydmVyQ29tcG9uZW50LmZvY3VzRnVuY3Rpb25zIHJlcXVpcmVzIGEgYm9vbGVhbiAodHJ1ZSBvciBmYWxzZSkgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJzY3JpYmVyc1xuXHRcdFx0QF91c2VGb2N1c0Z1bmN0aW9ucyA9IGJvb2xcblxuXG5cdCMgZ2V0IGN1cnJlbnQgZGVmYXVsdCBmb2N1cyBmdW5jdGlvbiwgdXNlZCBieSBhbGwgc3Vic2NyaWJlcnMsIG9yIHNldCBhIG5ldyBvbmVcblx0QGRlZmluZSBcImZvY3VzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9kZWZhdWx0Rm9jdXNcblx0XHRzZXQ6IChmdW5jKSAtPiBcblx0XHRcdGlmIHR5cGVvZiBmdW5jIGlzbnQgJ2Z1bmN0aW9uJyB0aGVuIHRocm93IFwiT2JzZXJ2ZXJDb21wb25lbnQuZm9jdXMgcmVxdWlyZXMgYSBmdW5jdGlvbiB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBmb2N1cywgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3Vic2NyaWJlcnMgd2hlbiBmb2N1c2VkXG5cdFx0XHRAX2RlZmF1bHRGb2N1cyA9IGZ1bmNcblxuXG5cdCMgZ2V0IGN1cnJlbnQgZGVmYXVsdCB1bmZvY3VzIGZ1bmN0aW9uLCB1c2VkIGJ5IGFsbCBzdWJzY3JpYmVycywgb3Igc2V0IGEgbmV3IG9uZVxuXHRAZGVmaW5lIFwidW5mb2N1c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdFVuZm9jdXNcblx0XHRzZXQ6IChmdW5jKSAtPiBcblx0XHRcdGlmIHR5cGVvZiBmdW5jIGlzbnQgJ2Z1bmN0aW9uJyB0aGVuIHRocm93IFwiT2JzZXJ2ZXJDb21wb25lbnQudW5mb2N1cyByZXF1aXJlcyBhIGZ1bmN0aW9uIHZhbHVlLlwiXG5cdFx0XHRcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgdW5mb2N1cywgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3Vic2NyaWJlcnMgd2hlbiB1bmZvY3VzZWRcblx0XHRcdEBfZGVmYXVsdFVuZm9jdXMgPSBmdW5jXG5cblxuXHQjIGdldCBjdXJyZW50IGZvY3VzZWQgc3Vic2NyaWJlcnMgb3Igc2V0IGZvY3VzZWQgc3Vic2NyaWJlcnNcblx0QGRlZmluZSBcImZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2ZvY3VzZWRTdWJzY3JpYmVyc1xuXHRcdHNldDogKGxheWVycykgLT5cblx0XHRcdCMgYWNjZXB0cyBhcnJheXMsIHNvIG1ha2UgYW4gYXJyYXkgaWYgbm90IGdpdmVuIG9uZVxuXHRcdFx0aWYgXy5pc0FycmF5KGxheWVycykgaXMgZmFsc2UgdGhlbiBsYXllcnMgPSBbbGF5ZXJzXVxuXG5cdFx0XHQjIGZvY3VzIG9uIGFueSBvZiB0aGUgbGF5ZXJzIHRoYXQgYXJlbid0IGZvY3VzZWQgYWxyZWFkeVxuXHRcdFx0bGF5ZXJzLmZvckVhY2ggKGxheWVyKSA9PiBpZiBAX2lzRm9jdXNlZChsYXllcikgaXMgZmFsc2UgdGhlbiBAX2FkZFRvRm9jdXNlZFN1YnNjcmliZXJzKGxheWVyLCB0cnVlKVxuXG5cblx0IyBnZXQgY3VycmVudCB1bmZvY3VzZWQgc3Vic2NyaWJlcnNcblx0QGRlZmluZSBcInVuZm9jdXNlZFwiLFxuXHRcdGdldDogLT4gcmV0dXJuIF8ud2l0aG91dChAX3N1YnNjcmliZXJzLCBAX2ZvY3VzZWRTdWJzY3JpYmVycylcblx0XHRzZXQ6IChsYXllcnMpIC0+XG5cdFx0XHQjIGFjY2VwdHMgYXJyYXlzLCBzbyBtYWtlIGFuIGFycmF5IGlmIG5vdCBnaXZlbiBvbmVcblx0XHRcdGlmIF8uaXNBcnJheShsYXllcnMpIGlzIGZhbHNlIHRoZW4gbGF5ZXJzID0gW2xheWVyc11cblxuXHRcdFx0IyB1bmZvY3VzIGFueSBvZiB0aGUgbGF5ZXJzIHRoYXQgYXJlIGZvY3VzZWRcblx0XHRcdGxheWVycy5mb3JFYWNoIChsYXllcikgPT4gaWYgQF9pc0ZvY3VzZWQobGF5ZXIpIGlzIHRydWUgdGhlbiBAX3JlbW92ZUZyb21Gb2N1c2VkU3Vic2NyaWJlcnMobGF5ZXIsIHRydWUpXG5cblxuXHRAZGVmaW5lIFwidXNlRm9jdXNTdGF0ZXNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3VzZUZvY3VzU3RhdGVzXG5cdFx0c2V0OiAoYm9vbCkgLT4gXG5cdFx0XHRpZiB0eXBlb2YgYm9vbCBpc250ICdib29sZWFuJyB0aGVuIHRocm93IFwiT2JzZXJ2ZXJDb21wb25lbnQudXNlRm9jdXNTdGF0ZXMgcmVxdWlyZXMgYSBib29sZWFuIHZhbHVlLlwiXG5cdFx0XHRAX3VzZUZvY3VzU3RhdGVzID0gYm9vbFxuXG5cblx0IyBnZXQgb3Igc2V0IGRlZmF1bHQgZm9jdXNlZCBzdGF0ZSBhZGRlZCB0byBuZXcgc3Vic2NyaWJlcnNcblx0QGRlZmluZSBcImZvY3VzZWRTdGF0ZVwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdEZvY3VzZWRcblx0XHRzZXQ6IChzdGF0ZSA9IHt9KSAtPiBcblx0XHRcdGlmIHR5cGVvZiBzdGF0ZSBpc250ICdvYmplY3QnIHRoZW4gdGhyb3cgXCJPYnNlcnZlckNvbXBvbmVudC5mb2N1c1N0YXRlIHJlcXVpcmVzIGFuIG9iamVjdCAoYSBMYXllciBzdGF0ZSkuXCJcblx0XHRcdEBfZGVmYXVsdEZvY3VzZWQgPSBzdGF0ZVxuXG5cblx0IyBnZXQgb3Igc2V0IGRlZmF1bHQgdW5mb2N1c2VkIHN0YXRlIGFkZGVkIHRvIG5ldyBzdWJzY3JpYmVyc1xuXHRAZGVmaW5lIFwidW5mb2N1c2VkU3RhdGVcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2RlZmF1bHRVbmZvY3VzZWRcblx0XHRzZXQ6IChzdGF0ZSA9IHt9KSAtPiBcblx0XHRcdGlmIHR5cGVvZiBzdGF0ZSBpc250ICdvYmplY3QnIHRoZW4gdGhyb3cgXCJPYnNlcnZlckNvbXBvbmVudC5mb2N1c1N0YXRlIHJlcXVpcmVzIGFuIG9iamVjdCAoYSBMYXllciBzdGF0ZSkuXCJcblx0XHRcdEBfZGVmYXVsdFVuZm9jdXNlZCA9IHN0YXRlXG5cdFxuXG5cdCMgZ2V0IG9yIHNldCB0aGUgYXJyYXkgb2Ygc3Vic2NyaWJlcnMgKCBuZWVkcyB3b3JrIClcblx0QGRlZmluZSBcInN1YnNjcmliZXJzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9zdWJzY3JpYmVyc1xuXHRcdHNldDogKGxheWVycykgLT5cblx0XHRcdCMgdGhyb3cgZXJyb3IgaWYgbGF5ZXJzIGlzbnQgYW4gYXJyYXlcblx0XHRcdGlmIF8uaXNBcnJheShsYXllcnMpIGlzIGZhbHNlIG9yIGxheWVycy5sZW5ndGggPCAwIHRoZW4gdGhyb3cgJ1N1YnNjcmliZXJzIHJlcXVpcmVzIGFuIGFycmF5LidcblxuXHRcdFx0IyBwcmVzZXJ2ZSBmb2N1c2VkIHN1YnNjcmliZXJzIHRoYXQgYXJlIGFsc28gaW5jbHVkZWQgaW4gdGhlIG5ldyBsYXllcnMgYXJyYXlcblx0XHRcdEBfZm9jdXNlZFN1YnNjcmliZXJzID0gXy5pbnRlcnNlY3Rpb24oQF9mb2N1c2VkU3Vic2NyaWJlcnMsIGxheWVycylcblx0XHRcdFxuXHRcdFx0IyByZW1vdmUgZXhpc3Rpbmcgc3Vic2NyaWJlcnMgdGhhdCBhcmUgbm90IG9uIHRoZSBuZXcgbGlzdFxuXHRcdFx0YWRpb3NTdWJzY3JpYmVycyA9IF8uZGlmZmVyZW5jZShAX3N1YnNjcmliZXJzLCBsYXllcnMpXG5cdFx0XHRAcmVtb3ZlU3Vic2NyaWJlcihzdWJzY3JpYmVyKSBmb3Igc3Vic2NyaWJlciBpbiBhZGlvc1N1YnNjcmliZXJzXG5cdFx0XG5cdFx0XHQjIGRlZmluZSBuZXcgc3Vic2NyaWJlcnNcblx0XHRcdEBhZGRTdWJzY3JpYmVyKGxheWVyKSBmb3IgbGF5ZXIgaW4gbGF5ZXJzXG5cdFx0XHRcblx0XHRcdCMgYWRkIGxpbmsgdG8gb2JzZXJ2ZXIgaW4gc3Vic2NyaWJlciBsYXllcnNcblx0XHRcdHN1YnNjcmliZXIub2JzZXJ2ZXIgPSBAIGZvciBzdWJzY3JpYmVyIGluIEBfc3Vic2NyaWJlcnNcblxuXHRcdFx0IyByZW1vdmUgZm9jdXNlZCBzdWJzY3JpYmVyIGlmIG5ldyBzdWJzY3JpYmVycyBkb2Vzbid0IGluY2x1ZGUgaXRcblx0XHRcdGlmIG5vdCBfLmluY2x1ZGVzKEBfc3Vic2NyaWJlcnMsIEBfZm9jdXNlZFN1YnNjcmliZXIpXG5cdFx0XHRcdEBfZm9jdXNlZFN1YnNjcmliZXIgPSB1bmRlZmluZWRcblxuXHRfaXNGb2N1c2VkOiAobGF5ZXIpIC0+IHJldHVybiBfLmluY2x1ZGVzKEBfZm9jdXNlZFN1YnNjcmliZXJzLCBsYXllcilcblxuXHQjIGFkZCBhIGxheWVyIHRvIGFycmF5IG9mIGZvY3VzZWQgc3Vic2NyaWJlcnMsIG1ha2luZyByb29tIGlmIG5lY2Vzc2FyeVxuXHRfYWRkVG9Gb2N1c2VkU3Vic2NyaWJlcnM6IChsYXllciwgaW5zdGFudCA9IGZhbHNlKSAtPlxuXHRcdCMgdGhyb3cgYW4gZXJyb3IgaWYgYSBub24tZm9jdXNlZCBsYXllciB3YXMgc2VudCBoZXJlXG5cdFx0aWYgQF9pc0ZvY3VzZWQobGF5ZXIpIGlzIHRydWUgdGhlbiB0aHJvdyBcIkZvY3VzZWQgb24gYSBmb2N1c2VkIHN1YnNjcmliZXIuIElzIHRoYXQgcmlnaHQ/XCJcblxuXHRcdCMgaWYgd2UncmUgYXQgdGhlIGxpbWl0IG9mIG91ciBmb2N1c2VkIHN1YnNjcmliZXJzLi4uXG5cdFx0aWYgXy5zaXplKEBfZm9jdXNlZFN1YnNjcmliZXJzKSA+PSBAX21heEZvY3VzZWRcblx0XHRcdCMgcmVtb3ZlIHRoZSBzdWJzY3JpYmUgZnJvbSB0aGUgZnJvbnQgb2YgdGhlIGxpc3QgYW5kIHNldCBpdCBhcyB1bmZvY3VzZWRcblx0XHRcdEBfc2V0Rm9jdXNlZChAX2ZvY3VzZWRTdWJzY3JpYmVyc1swXSwgZmFsc2UsIGluc3RhbnQpXG5cdFx0XHQjIHJlcGVhdCB1bnRpbCB3ZSBoYXZlIHJvb20gZm9yIGEgbmV3IGZvY3VzZWQgc3Vic2NyaWJlclxuXHRcdFx0QF9hZGRUb0ZvY3VzZWRTdWJzY3JpYmVycyhsYXllciwgaW5zdGFudClcblx0XHRcblx0XHQjIGlmIChvciB3aGVuKSB0aGVyZSBpcyByb29tLi4uXG5cdFx0ZWxzZVxuXHRcdFx0IyBhZGQgdGhlIG5ldyBmb2N1c2VkIHN1YnNjcmliZXIgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdFxuXHRcdFx0QF9mb2N1c2VkU3Vic2NyaWJlcnMucHVzaChsYXllcilcblx0XHRcdGlmIEBfbm90aWZ5T25Gb2N1cyBpcyB0cnVlIHRoZW4gQG5vdGlmeVN1YnNjcmliZXJzKClcblxuXHQjIHJlbW92ZSBhIGxheWVyIGZyb20gYXJyYXkgb2YgZm9jdXNlZCBzdWJzY3JpYmVyc1xuXHRfcmVtb3ZlRnJvbUZvY3VzZWRTdWJzY3JpYmVyczogKGxheWVyLCBpbnN0YW50ID0gZmFsc2UpIC0+XG5cdFx0IyB0aHJvdyBhbiBlcnJvciBpZiBhIG5vbi1mb2N1c2VkIGxheWVyIHdhcyBzZW50IGhlcmVcblx0XHRpZiBAX2lzRm9jdXNlZChsYXllcikgaXMgZmFsc2UgdGhlbiB0aHJvdyBcIlRyaWVkIHRvIHJlbW92ZSBhIGxheWVyIHRoYXQgd2Fzbid0IGZvY3VzZWQuXCJcblx0XHRcblx0XHQjIHJlbW92ZSB0aGUgZm9jdXNlZCBsYXllciBhbmQgc2V0IGl0IGFzIHVuZm9jdXNlZFxuXHRcdF8ucHVsbChAX2ZvY3VzZWRTdWJzY3JpYmVycywgbGF5ZXIpXG5cdFxuXG5cdFxuXG5cbmV4cG9ydHMuT2JzZXJ2ZXJDb21wb25lbnQgPSBPYnNlcnZlckNvbXBvbmVudFxuXG4iLCJjbGFzcyBGb2N1c0NvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0IyBUaGUgRm9jdXNDb21wb25lbnQgbWF5IGZvY3VzIG9uIG9uZSBvciBtb3JlIHN1YmplY3RzIGF0IGEgdGltZS5cblxuXHRcdEBfc3ViamVjdHMgPSBbXVxuXHRcdEBfZm9jdXNlZFN1YmplY3RzID0gW11cblxuXHRcdEBfbWF4Rm9jdXNlZCA9IG9wdGlvbnMubWF4Rm9jdXNlZCA/IDFcblx0XHRAX3RvZ2dsZSA9IG9wdGlvbnMudG9nZ2xlID8gdHJ1ZVxuXHRcdEBfdG9nZ2xlTG9jayA9IG9wdGlvbnMudG9nZ2xlTG9jayA/IGZhbHNlXG5cdFx0QF90cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyID8gJ1RhcCdcblx0XHRAX2RlZmF1bHRGb2N1c2VkID0gb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQgPyB7b3BhY2l0eTogMX1cblx0XHRAX2RlZmF1bHRVbmZvY3VzZWQgPSBvcHRpb25zLnN0YXRlcz8udW5mb2N1c2VkID8gaWYgb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQ/IHRoZW4gdW5kZWZpbmVkIGVsc2Uge29wYWNpdHk6IC41fVxuXHRcdEBfZGVmYXVsdEZvY3VzID0gb3B0aW9ucy5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0VW5mb2N1cyA9IG9wdGlvbnMudW5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0Tm90aWZ5ID0gb3B0aW9ucy5ub3RpZnkgPyAtPiByZXR1cm4gbnVsbFxuXHRcdEBfbm90aWZ5T25Gb2N1cyA9IG9wdGlvbnMubm90aWZ5T25Gb2N1cyA/IHRydWVcblx0XHRAX3VzZUZvY3VzU3RhdGVzID0gb3B0aW9ucy51c2VGb2N1c1N0YXRlcyA/IHRydWVcblx0XHRAX3VzZUZvY3VzRnVuY3Rpb25zID0gb3B0aW9ucy51c2VGb2N1c0Z1bmN0aW9ucyA/IHRydWVcblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6ICcuJ1xuXHRcdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cdCMgbm90aWZ5IHN1YmplY3RzXG5cdG5vdGlmeUZvY3VzZWRTdWJqZWN0czogKGZ1bmMgPSBAX2RlZmF1bHRGb2N1cykgLT4gZG8gXy5iaW5kKGZ1bmMsIHN1YmplY3QpIGZvciBzdWJqZWN0IGluIEBfZm9jdXNlZFN1YmplY3RzXG5cdFxuXHRub3RpZnlVbmZvY3VzZWRTdWJqZWN0czogKGZ1bmMgPSBAX2RlZmF1bHRVbmZvY3VzKSAtPiBkbyBfLmJpbmQoZnVuYywgc3ViamVjdCkgZm9yIHN1YmplY3QgaW4gQF91bmZvY3VzZWRTdWJqZWN0c1xuXHRcblx0bm90aWZ5U3ViamVjdHM6IChmdW5jID0gQF9kZWZhdWx0Tm90aWZ5KSAtPiBkbyBfLmJpbmQoZnVuYywgc3ViamVjdCkgZm9yIHN1YmplY3QgaW4gQF9zdWJqZWN0c1xuXHRcblx0bm90aWZ5U2VsZWN0ZWQ6IChzdWJqZWN0cyA9IEBfc3ViamVjdHMsIGZ1bmMgPSBAX2RlZmF1bHROb3RpZnkpIC0+IFxuXHRcdGlmIHR5cGVvZiBzdWJqZWN0cyBpcyAnb2JqZWN0JyB0aGVuIHN1YmplY3RzID0gW3N1YmplY3RzXVxuXHRcdGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX3N1YmplY3RzXG5cblx0IyB1bmZvY3VzIGFsbCBmb2N1c2VkIHN1YmplY3RzXG5cdHVuZm9jdXNBbGw6IChpbnN0YW50ID0gZmFsc2UpIC0+IEBfc2V0Rm9jdXNlZChmYWxzZSwgaW5zdGFudCkgZm9yIHN1YmplY3QgaW4gQF9mb2N1c2VkU3ViamVjdHNcblxuXHQjIHJ1biBmb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRfZm9jdXM6IChzdWJqZWN0KSAtPiBkbyBfLmJpbmQoQF9kZWZhdWx0Rm9jdXMsIHN1YmplY3QpXG5cblx0IyBydW4gdW5mb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRfdW5mb2N1czogKHN1YmplY3QpIC0+IGRvIF8uYmluZChAX2RlZmF1bHRVbmZvY3VzLCBzdWJqZWN0KVxuXG5cdCMgYWRkIG9yIHJlbW92ZSBmb2N1cyB0cmlnZ2VycyB0byBhIHN1YmplY3Rcblx0YWRkVHJpZ2dlcjogKHN1YmplY3QsIGV2ZW50TmFtZSA9IEBfdHJpZ2dlcikgLT4gc3ViamVjdC5vbiBFdmVudHNbZXZlbnROYW1lXSwgPT5cblx0XHRyZXR1cm4gaWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgdHJ1ZSBhbmQgQF90b2dnbGUgaXMgZmFsc2Vcblx0XHRAX3NldEZvY3VzZWQoc3ViamVjdCwgdHJ1ZSlcblx0XG5cdHJlbW92ZVRyaWdnZXI6IChzdWJqZWN0LCBldmVudE5hbWUgPSBAX3RyaWdnZXIpIC0+IHN1YmplY3Qub2ZmIEV2ZW50c1tldmVudE5hbWVdLCA9PlxuXHRcdHJldHVybiBpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyB0cnVlIGFuZCBAX3RvZ2dsZSBpcyBmYWxzZVxuXHRcdEBfc2V0Rm9jdXNlZChzdWJqZWN0LCB0cnVlKVxuXG5cdCMgc2V0IGZvY3VzZWQgc3RhdGUgb2YgYSBzdWJqZWN0XG5cdF9zZXRGb2N1c2VkOiAoc3ViamVjdCwgYm9vbCwgaW5zdGFudCkgLT5cblx0XHQjIGlmIHRoZSBzdWJqZWN0J3MgZm9jdXMgc3RhdGUgc2hvdWxkIGJlIGZvY3VzZWQuLi5cblx0XHRpZiBib29sIGlzIHRydWVcblx0XHRcdCMgaWYgc3ViamVjdCBpcyBhbHJlYWR5IGZvY3VzZWQuLi5cblx0XHRcdGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIHRydWVcblx0XHRcdFx0IyBpZiB0b2dnbGUgbW9kZSBpcyBvbiwgdW5mb2N1cyB0aGUgc3ViamVjdFxuXHRcdFx0XHRpZiBAX3RvZ2dsZSBpcyB0cnVlIHRoZW4gQF9zZXRGb2N1c2VkKHN1YmplY3QsIGZhbHNlLCBpbnN0YW50KVxuXHRcdFx0XHQjIGVpdGhlciB3YXksIHJldHVyblxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0XHQjIGNhbmNlbCBuZXcgZm9jdXMgaWYgdG9nZ2xlIGxvY2sgaXMgb25cblx0XHRcdHJldHVybiBpZiBfLnNpemUoQF9mb2N1c2VkU3ViamVjdHMpID49IEBfbWF4Rm9jdXNlZCBhbmQgQF90b2dnbGVMb2NrIGlzIHRydWVcblxuXHRcdFx0IyBpZiB0aGUgc3ViamVjdCBpc24ndCBhbHJlYWR5IGZvY3VzZWQsIGFkZCBpdCB0byBmb2N1c2VkIHN1YmplY3RzXG5cdFx0XHRAX2FkZFRvRm9jdXNlZFN1YmplY3RzKHN1YmplY3QsIGluc3RhbnQpXG5cdFx0XHQjIGFuZCBpZiBmb2N1c2VkIHN0YXRlcyBhcmUgYmVpbmcgdXNlZC4uLlxuXHRcdFx0aWYgQF91c2VGb2N1c1N0YXRlcyBpcyB0cnVlXG5cdFx0XHRcdCMgZWl0aGVyIHN3aXRjaCBvciBhbmltYXRlIHRvIGZvY3VzZWQgc3RhdGUsIGRlcGVuZGluZyBvbiB0aGUgaW5zdGFudCBhcmd1bWVudFxuXHRcdFx0XHRpZiBpbnN0YW50IHRoZW4gc3ViamVjdC5zdGF0ZVN3aXRjaCgnZm9jdXNlZCcpIGVsc2Ugc3ViamVjdC5hbmltYXRlKCdmb2N1c2VkJylcblx0XHRcdCMgYW5kIGlmIGZvY3VzIGZ1bmN0aW9ucyBhcmUgYmVpbmcgdXNlZC4uLiBydW4gZm9jdXMgZnVuY3Rpb24gZm9yIHN1YmplY3Rcblx0XHRcdGlmIEBfdXNlRm9jdXNGdW5jdGlvbnMgaXMgdHJ1ZSB0aGVuIEBfZm9jdXMoc3ViamVjdCkgXG5cblx0XHQjIGlmIHRoZSBzdWJqZWN0J3MgZm9jdXMgc3RhdGUgc2hvdWxkIGJlIHVuZm9jdXNlZC4uLlxuXHRcdGVsc2Vcblx0XHRcdCMgaWYgdGhlIHN1YmplY3QgaXMgYWxyZWFkeSB1bmZvY3VzZWQsIGRvIG5vdGhpbmdcblx0XHRcdHJldHVybiBpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyBmYWxzZVxuXG5cdFx0XHQjIGlmIGl0IGlzLCByZW1vdmUgaXQgZnJvbSBmb2N1c2VkIHN1YmplY3RzXG5cdFx0XHRAX3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCkgXG5cblx0XHRcdCMgYW5kIGlmIGZvY3VzZWQgc3RhdGVzIGFyZSBiZWluZyB1c2VkLi4uXG5cdFx0XHRpZiBAX3VzZUZvY3VzU3RhdGVzIGlzIHRydWVcblx0XHRcdFx0IyBlaXRoZXIgc3dpdGNoIG9yIGFuaW1hdGUgdG8gdGhlIHVuZm9jdXNlZCBzdGF0ZSwgZGVwZW5kaW5nIG9uIHRoZSBpbnN0YW50IGFyZ3VtZW50XG5cdFx0XHRcdGlmIGluc3RhbnQgdGhlbiBzdWJqZWN0LnN0YXRlU3dpdGNoKCd1bmZvY3VzZWQnKSBlbHNlIHN1YmplY3QuYW5pbWF0ZSgndW5mb2N1c2VkJylcblx0XHRcdCMgYW5kIGlmIGZvY3VzIGZ1bmN0aW9ucyBhcmUgYmVpbmcgdXNlZC4uLiBydW4gdGhlIHVuZm9jdXMgZnVuY3Rpb24gZm9yIHN1YmplY3Rcblx0XHRcdGlmIEBfdXNlRm9jdXNGdW5jdGlvbnMgaXMgdHJ1ZSB0aGVuIEBfdW5mb2N1cyhzdWJqZWN0KVxuXG5cdCMgYWRkIGEgbmV3IHN1YmplY3QgdG8gdGhpcyBmb2N1c0NvbXBvbmVudFxuXHRhZGRTdWJqZWN0OiAobmV3U3ViamVjdCwgb3B0aW9ucyA9IHt9KSAtPlxuXHRcdHRyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXIgPyBAX3RyaWdnZXJcblx0XHRmb2N1c2VkID0gb3B0aW9ucy5mb2N1c2VkID8gZmFsc2Vcblx0XHRmb2N1c2VkU3RhdGUgPSBvcHRpb25zLmZvY3VzZWRTdGF0ZSA/IG5ld1N1YmplY3Quc3RhdGVzLmZvY3VzZWRcblx0XHR1bmZvY3VzZWRTdGF0ZSA9IG9wdGlvbnMudW5mb2N1c2VkU3RhdGUgPyBuZXdTdWJqZWN0LnN0YXRlcy51bmZvY3VzZWRcblxuXHRcdCMgdGhyb3cgYW4gZXJyb3IgaWYgbGF5ZXIgaXNuJ3QgYSBsYXllclxuXHRcdGlmIG5ld1N1YmplY3QgaW5zdGFuY2VvZiBMYXllciBpcyBmYWxzZSB0aGVuIHRocm93IFwiT2JzZXJ2ZXIgY2FuIG9ubHkgYWRkIGxheWVycyB0byBpdHMgbGlzdCBvZiBzdWJqZWN0cy4gI3tsYXllcn0sIGlkICN7bGF5ZXIuaWR9IGlzIG5vdCBhIGxheWVyLlwiXG5cblx0XHQjIHNldCBldmVudCB0cmlnZ2VyIChldmVudCBuYW1lIHByb3ZpZGVkIGluIG9wdGlvbnMgb3IgZGVmYXVsdCBldmVudCBuYW1lKVxuXHRcdEBhZGRUcmlnZ2VyKG5ld1N1YmplY3QsIHRyaWdnZXIpXG5cblx0XHQjIHNldCBmb2N1c2VkIC8gdW5mb2N1c2VkIGxheWVyIHN0YXRlcyAoc3RhdGVzIHByb3ZpZGVkIGluIG9wdGlvbnMsIG9yIGV4aXN0aW5nIHN0YXRlcyBvciBkZWZhdWx0IHN0YXRlcylcblx0XHRuZXdTdWJqZWN0LnN0YXRlcy5mb2N1c2VkID0gZm9jdXNlZFN0YXRlID8gQF9kZWZhdWx0Rm9jdXNlZFxuXHRcdG5ld1N1YmplY3Quc3RhdGVzLnVuZm9jdXNlZCA9IHVuZm9jdXNlZFN0YXRlID8gQF9kZWZhdWx0VW5mb2N1c2VkID8gbmV3U3ViamVjdC5zdGF0ZXMuZGVmYXVsdFxuXG5cdFx0IyBhZGQgbGF5ZXIgdG8gc3ViamVjdHMgYXJyYXlcblx0XHRAX3N1YmplY3RzLnB1c2gobmV3U3ViamVjdClcblxuXHRcdCMgaWYgdGhpcyBzdWJqZWN0IHNob3VsZCBzdGFydCBhcyBmb2N1c2VkLCBzZXQgaXQgYXMgZm9jdXNlZFxuXHRcdEBfc2V0Rm9jdXNlZChuZXdTdWJqZWN0LCBmb2N1c2VkLCB0cnVlKVxuXHRcdGlmIEBfdXNlRm9jdXNTdGF0ZXMgaXMgdHJ1ZSB0aGVuIG5ld1N1YmplY3Quc3RhdGVTd2l0Y2goJ3VuZm9jdXNlZCcpXG5cdFx0aWYgQF91c2VGb2N1c0Z1bmN0aW9ucyBpcyB0cnVlIHRoZW4gQF91bmZvY3VzKG5ld1N1YmplY3QpXG5cblxuXHQjIHJlbW92ZSBhIHN1YmplY3QgZnJvbSB0aGlzIGZvY3VzQ29tcG9uZW50XG5cdHJlbW92ZVN1YmplY3Q6IChzdWJqZWN0KSAtPlxuXG5cdFx0IyB0aHJvdyBhIHdhcm5pbmcgd2hlbiB0cnlpbmcgdG8gcmVtb3ZlIGEgbGF5ZXIgaXNuJ3QgYSBzdWJqZWN0XG5cdFx0aWYgXy5pbmNsdWRlcyhAX3N1YmplY3RzLCBzdWJqZWN0KSBpcyBmYWxzZVxuXHRcdFx0aWYgc3ViamVjdCBpbnN0YW5jZW9mIExheWVyIGlzIHRydWUgdGhlbiB0aHJvdyBcIlRoYXQgbGF5ZXIgKCN7bGF5ZXIubmFtZSA/IGxheWVyfSwgaWQ6ICN7bGF5ZXIuaWR9KSBpc24ndCBhIHN1YmplY3QuXCJcblx0XHRcdCMgdGhyb3cgYSBtb3JlIGRlc2NyaXB0aXZlIGVycm9yIGlmIHRoZSBsYXllciBpc24ndCBhIGxheWVyLlxuXHRcdFx0ZWxzZSB0aHJvdyBcIlRoYXQgaXNuJ3QgYSBsYXllci4gT2JzZXJ2ZXIgY2FuIG9ubHkgcmVtb3ZlIGxheWVycyB0aGF0IGFyZSBvbiBpdHMgbGlzdCBvZiBzdWJqZWN0IGxheWVycy5cIlxuXHRcdFxuXHRcdGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIHRoZW4gQF9yZW1vdmVGcm9tRm9jdXNlZFN1YmplY3RzKHN1YmplY3QsIGZhbHNlKVxuXG5cdFx0IyByZW1vdmUgZnJvbSBsaXN0IG9mIHN1YmplY3RzXG5cdFx0Xy5wdWxsKEBfc3ViamVjdHMsIHN1YmplY3QpXG5cdFx0IyByZW1vdmUgZm9jdXNDb21wb25lbnQgdHJpZ2dlciAoVE9ETzogcmVtb3ZlIGFsbCBhZGRlZCB0cmlnZ2Vycywgbm90IGp1c3QgbW9zdCByZWNlbnQpXG5cdFx0QHJlbW92ZVRyaWdnZXIoc3ViamVjdClcblxuXG5cdEBkZWZpbmUgXCJ0cmlnZ2VyXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF90cmlnZ2VyXG5cdFx0c2V0OiAoZXZlbnROYW1lKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGV2ZW50TmFtZSBpc250ICdzdHJpbmcnIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC50cmlnZ2VyIHJlcXVpcmVzIGFuIGV2ZW50IG5hbWUgYXMgc3RyaW5nLCBsaWtlICdUYXAnIG9yICdNb3VzZU92ZXInLlwiXG5cdFx0XHQjIHNldCB0cmlnZ2VyIGFzIGRlZmF1bHQgdHJpZ2dlciwgdG8gYmUgZ2l2ZW4gdG8gYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF90cmlnZ2VyID0gZXZlbnROYW1lIFxuXG5cblx0QGRlZmluZSBcIm5vdGlmeVwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdE5vdGlmeVxuXHRcdHNldDogKGZ1bmMpIC0+XG5cdFx0XHRpZiB0eXBlb2YgZnVuYyBpc250ICdmdW5jdGlvbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50Lm5vdGlmeSByZXF1aXJlcyBhIGZ1bmN0aW9uIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfZGVmYXVsdE5vdGlmeSA9IGZ1bmNcblxuXG5cdEBkZWZpbmUgXCJub3RpZnlPbkZvY3VzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9ub3RpZnlPbkZvY3VzXG5cdFx0c2V0OiAoYm9vbCkgLT5cblx0XHRcdGlmIHR5cGVvZiBib29sIGlzbnQgJ2Jvb2xlYW4nIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC5ub3RpZnlPbkZvY3VzIHJlcXVpcmVzIGEgYm9vbGVhbiAodHJ1ZSBvciBmYWxzZSkgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF9ub3RpZnlPbkZvY3VzID0gYm9vbFxuXG5cblx0QGRlZmluZSBcIm1heEZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX21heEZvY3VzZWRcblx0XHRzZXQ6IChudW1iZXIpIC0+XG5cdFx0XHRpZiB0eXBlb2YgbnVtYmVyIGlzbnQgJ251bWJlcicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50Lm1heEZvY3VzZWQgcmVxdWlyZXMgYSBudW1iZXIgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF9tYXhGb2N1c2VkID0gbnVtYmVyXG5cblxuXHRAZGVmaW5lIFwidG9nZ2xlTG9ja1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdG9nZ2xlTG9ja1xuXHRcdHNldDogKGJvb2wpIC0+XG5cdFx0XHRpZiB0eXBlb2YgYm9vbCBpc250ICdib29sZWFuJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQudG9nZ2xlTG9jayByZXF1aXJlcyBhIGJvb2xlYW4gKHRydWUgb3IgZmFsc2UpIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfdG9nZ2xlTG9jayA9IGJvb2xcblxuXG5cdEBkZWZpbmUgXCJ1c2VGb2N1c0Z1bmN0aW9uc1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdXNlRm9jdXNGdW5jdGlvbnNcblx0XHRzZXQ6IChib29sKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGJvb2wgaXNudCAnYm9vbGVhbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LnVzZUZvY3VzRnVuY3Rpb25zIHJlcXVpcmVzIGEgYm9vbGVhbiAodHJ1ZSBvciBmYWxzZSkgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF91c2VGb2N1c0Z1bmN0aW9ucyA9IGJvb2xcblxuXG5cdCMgZ2V0IGN1cnJlbnQgZGVmYXVsdCBmb2N1cyBmdW5jdGlvbiwgdXNlZCBieSBhbGwgc3ViamVjdHMsIG9yIHNldCBhIG5ldyBvbmVcblx0QGRlZmluZSBcImZvY3VzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9kZWZhdWx0Rm9jdXNcblx0XHRzZXQ6IChmdW5jKSAtPiBcblx0XHRcdGlmIHR5cGVvZiBmdW5jIGlzbnQgJ2Z1bmN0aW9uJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQuZm9jdXMgcmVxdWlyZXMgYSBmdW5jdGlvbiB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBmb2N1cywgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHMgd2hlbiBmb2N1c2VkXG5cdFx0XHRAX2RlZmF1bHRGb2N1cyA9IGZ1bmNcblxuXG5cdCMgZ2V0IGN1cnJlbnQgZGVmYXVsdCB1bmZvY3VzIGZ1bmN0aW9uLCB1c2VkIGJ5IGFsbCBzdWJqZWN0cywgb3Igc2V0IGEgbmV3IG9uZVxuXHRAZGVmaW5lIFwidW5mb2N1c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdFVuZm9jdXNcblx0XHRzZXQ6IChmdW5jKSAtPiBcblx0XHRcdGlmIHR5cGVvZiBmdW5jIGlzbnQgJ2Z1bmN0aW9uJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQudW5mb2N1cyByZXF1aXJlcyBhIGZ1bmN0aW9uIHZhbHVlLlwiXG5cdFx0XHRcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgdW5mb2N1cywgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHMgd2hlbiB1bmZvY3VzZWRcblx0XHRcdEBfZGVmYXVsdFVuZm9jdXMgPSBmdW5jXG5cblxuXHQjIGdldCBjdXJyZW50IGZvY3VzZWQgc3ViamVjdHMgb3Igc2V0IGZvY3VzZWQgc3ViamVjdHNcblx0QGRlZmluZSBcImZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2ZvY3VzZWRTdWJqZWN0c1xuXHRcdHNldDogKGxheWVycykgLT5cblx0XHRcdCMgYWNjZXB0cyBhcnJheXMsIHNvIG1ha2UgYW4gYXJyYXkgaWYgbm90IGdpdmVuIG9uZVxuXHRcdFx0aWYgXy5pc0FycmF5KGxheWVycykgaXMgZmFsc2UgdGhlbiBsYXllcnMgPSBbbGF5ZXJzXVxuXG5cdFx0XHQjIGZvY3VzIG9uIGFueSBvZiB0aGUgbGF5ZXJzIHRoYXQgYXJlbid0IGZvY3VzZWQgYWxyZWFkeVxuXHRcdFx0bGF5ZXJzLmZvckVhY2ggKGxheWVyKSA9PiBpZiBAX2lzRm9jdXNlZChsYXllcikgaXMgZmFsc2UgdGhlbiBAX2FkZFRvRm9jdXNlZFN1YmplY3RzKGxheWVyLCB0cnVlKVxuXG5cblx0IyBnZXQgY3VycmVudCB1bmZvY3VzZWQgc3ViamVjdHNcblx0QGRlZmluZSBcInVuZm9jdXNlZFwiLFxuXHRcdGdldDogLT4gcmV0dXJuIF8ud2l0aG91dChAX3N1YmplY3RzLCBAX2ZvY3VzZWRTdWJqZWN0cylcblx0XHRzZXQ6IChsYXllcnMpIC0+XG5cdFx0XHQjIGFjY2VwdHMgYXJyYXlzLCBzbyBtYWtlIGFuIGFycmF5IGlmIG5vdCBnaXZlbiBvbmVcblx0XHRcdGlmIF8uaXNBcnJheShsYXllcnMpIGlzIGZhbHNlIHRoZW4gbGF5ZXJzID0gW2xheWVyc11cblxuXHRcdFx0IyB1bmZvY3VzIGFueSBvZiB0aGUgbGF5ZXJzIHRoYXQgYXJlIGZvY3VzZWRcblx0XHRcdGxheWVycy5mb3JFYWNoIChsYXllcikgPT4gaWYgQF9pc0ZvY3VzZWQobGF5ZXIpIGlzIHRydWUgdGhlbiBAX3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHMobGF5ZXIsIHRydWUpXG5cblxuXHRAZGVmaW5lIFwidXNlRm9jdXNTdGF0ZXNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3VzZUZvY3VzU3RhdGVzXG5cdFx0c2V0OiAoYm9vbCkgLT4gXG5cdFx0XHRpZiB0eXBlb2YgYm9vbCBpc250ICdib29sZWFuJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQudXNlRm9jdXNTdGF0ZXMgcmVxdWlyZXMgYSBib29sZWFuIHZhbHVlLlwiXG5cdFx0XHRAX3VzZUZvY3VzU3RhdGVzID0gYm9vbFxuXG5cblx0IyAjIGdldCBvciBzZXQgZGVmYXVsdCBmb2N1c2VkIHN0YXRlIGFkZGVkIHRvIG5ldyBzdWJqZWN0c1xuXHQjIEBkZWZpbmUgXCJzdGF0ZXMuZm9jdXNlZFwiLFxuXHQjIFx0Z2V0OiAtPiByZXR1cm4gQHN0YXRlcy5mb2N1c2VkXG5cdCMgXHRzZXQ6IChzdGF0ZSA9IHt9KSAtPiBcblx0IyBcdFx0aWYgdHlwZW9mIHN0YXRlIGlzbnQgJ29iamVjdCcgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LmZvY3VzU3RhdGUgcmVxdWlyZXMgYW4gb2JqZWN0IChhIExheWVyIHN0YXRlKS5cIlxuXHQjIFx0XHRAc3RhdGVzLmZvY3VzZWQgPSBzdGF0ZVxuXG5cblx0IyAjIGdldCBvciBzZXQgZGVmYXVsdCB1bmZvY3VzZWQgc3RhdGUgYWRkZWQgdG8gbmV3IHN1YmplY3RzXG5cdCMgQGRlZmluZSBcInN0YXRlcy51bmZvY3VzZWRcIixcblx0IyBcdGdldDogLT4gcmV0dXJuIEBzdGF0ZXMudW5mb2N1c2VkXG5cdCMgXHRzZXQ6IChzdGF0ZSA9IHt9KSAtPiBcblx0IyBcdFx0aWYgdHlwZW9mIHN0YXRlIGlzbnQgJ29iamVjdCcgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LmZvY3VzU3RhdGUgcmVxdWlyZXMgYW4gb2JqZWN0IChhIExheWVyIHN0YXRlKS5cIlxuXHQjIFx0XHRAc3RhdGVzLnVuZm9jdXNlZCA9IHN0YXRlXG5cdFxuXG5cdCMgZ2V0IG9yIHNldCB0aGUgYXJyYXkgb2Ygc3ViamVjdHMgKCBuZWVkcyB3b3JrIClcblx0QGRlZmluZSBcInN1YmplY3RzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9zdWJqZWN0c1xuXHRcdHNldDogKGxheWVycykgLT5cblx0XHRcdCMgdGhyb3cgZXJyb3IgaWYgbGF5ZXJzIGlzbnQgYW4gYXJyYXlcblx0XHRcdGlmIF8uaXNBcnJheShsYXllcnMpIGlzIGZhbHNlIG9yIGxheWVycy5sZW5ndGggPCAwIHRoZW4gdGhyb3cgJ1N1YmplY3RzIHJlcXVpcmVzIGFuIGFycmF5LidcblxuXHRcdFx0IyBwcmVzZXJ2ZSBmb2N1c2VkIHN1YmplY3RzIHRoYXQgYXJlIGFsc28gaW5jbHVkZWQgaW4gdGhlIG5ldyBsYXllcnMgYXJyYXlcblx0XHRcdEBfZm9jdXNlZFN1YmplY3RzID0gXy5pbnRlcnNlY3Rpb24oQF9mb2N1c2VkU3ViamVjdHMsIGxheWVycylcblx0XHRcdFxuXHRcdFx0IyByZW1vdmUgZXhpc3Rpbmcgc3ViamVjdHMgdGhhdCBhcmUgbm90IG9uIHRoZSBuZXcgbGlzdFxuXHRcdFx0YWRpb3NTdWJqZWN0cyA9IF8uZGlmZmVyZW5jZShAX3N1YmplY3RzLCBsYXllcnMpXG5cdFx0XHRAcmVtb3ZlU3ViamVjdChzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBhZGlvc1N1YmplY3RzXG5cdFx0XG5cdFx0XHQjIGRlZmluZSBuZXcgc3ViamVjdHNcblx0XHRcdEBhZGRTdWJqZWN0KGxheWVyKSBmb3IgbGF5ZXIgaW4gbGF5ZXJzXG5cdFx0XHRcblx0XHRcdCMgYWRkIGxpbmsgdG8gb2JzZXJ2ZXIgaW4gc3ViamVjdCBsYXllcnNcblx0XHRcdHN1YmplY3Qub2JzZXJ2ZXIgPSBAIGZvciBzdWJqZWN0IGluIEBfc3ViamVjdHNcblxuXHRcdFx0IyByZW1vdmUgZm9jdXNlZCBzdWJqZWN0IGlmIG5ldyBzdWJqZWN0cyBkb2Vzbid0IGluY2x1ZGUgaXRcblx0XHRcdGlmIG5vdCBfLmluY2x1ZGVzKEBfc3ViamVjdHMsIEBfZm9jdXNlZFN1YmplY3QpXG5cdFx0XHRcdEBfZm9jdXNlZFN1YmplY3QgPSB1bmRlZmluZWRcblxuXHRfaXNGb2N1c2VkOiAoc3ViamVjdCkgLT4gcmV0dXJuIF8uaW5jbHVkZXMoQF9mb2N1c2VkU3ViamVjdHMsIHN1YmplY3QpXG5cblx0IyBhZGQgYSBsYXllciB0byBhcnJheSBvZiBmb2N1c2VkIHN1YmplY3RzLCBtYWtpbmcgcm9vbSBpZiBuZWNlc3Nhcnlcblx0X2FkZFRvRm9jdXNlZFN1YmplY3RzOiAoc3ViamVjdCwgaW5zdGFudCA9IGZhbHNlKSAtPlxuXHRcdCMgdGhyb3cgYW4gZXJyb3IgaWYgYSBub24tZm9jdXNlZCBsYXllciB3YXMgc2VudCBoZXJlXG5cdFx0aWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgdHJ1ZSB0aGVuIHRocm93IFwiRm9jdXNlZCBvbiBhIGZvY3VzZWQgc3ViamVjdC4gSXMgdGhhdCByaWdodD9cIlxuXG5cdFx0IyBpZiB3ZSdyZSBhdCB0aGUgbGltaXQgb2Ygb3VyIGZvY3VzZWQgc3ViamVjdHMuLi5cblx0XHRpZiBfLnNpemUoQF9mb2N1c2VkU3ViamVjdHMpID49IEBfbWF4Rm9jdXNlZFxuXHRcdFx0IyByZW1vdmUgdGhlIHN1YnNjcmliZSBmcm9tIHRoZSBmcm9udCBvZiB0aGUgbGlzdCBhbmQgc2V0IGl0IGFzIHVuZm9jdXNlZFxuXHRcdFx0QF9zZXRGb2N1c2VkKEBfZm9jdXNlZFN1YmplY3RzWzBdLCBmYWxzZSwgaW5zdGFudClcblx0XHRcdCMgcmVwZWF0IHVudGlsIHdlIGhhdmUgcm9vbSBmb3IgYSBuZXcgZm9jdXNlZCBzdWJqZWN0XG5cdFx0XHRAX2FkZFRvRm9jdXNlZFN1YmplY3RzKHN1YmplY3QsIGluc3RhbnQpXG5cdFx0XG5cdFx0IyBpZiAob3Igd2hlbikgdGhlcmUgaXMgcm9vbS4uLlxuXHRcdGVsc2Vcblx0XHRcdCMgYWRkIHRoZSBuZXcgZm9jdXNlZCBzdWJqZWN0IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Rcblx0XHRcdEBfZm9jdXNlZFN1YmplY3RzLnB1c2goc3ViamVjdClcblx0XHRcdGlmIEBfbm90aWZ5T25Gb2N1cyBpcyB0cnVlIHRoZW4gQG5vdGlmeVN1YmplY3RzKClcblxuXHQjIHJlbW92ZSBhIGxheWVyIGZyb20gYXJyYXkgb2YgZm9jdXNlZCBzdWJqZWN0c1xuXHRfcmVtb3ZlRnJvbUZvY3VzZWRTdWJqZWN0czogKHN1YmplY3QsIGluc3RhbnQgPSBmYWxzZSkgLT5cblx0XHQjIHRocm93IGFuIGVycm9yIGlmIGEgbm9uLWZvY3VzZWQgbGF5ZXIgd2FzIHNlbnQgaGVyZVxuXHRcdGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIGZhbHNlIHRoZW4gdGhyb3cgXCJUcmllZCB0byByZW1vdmUgYSBsYXllciB0aGF0IHdhc24ndCBmb2N1c2VkLlwiXG5cdFx0XG5cdFx0IyByZW1vdmUgdGhlIGZvY3VzZWQgbGF5ZXIgYW5kIHNldCBpdCBhcyB1bmZvY3VzZWRcblx0XHRfLnB1bGwoQF9mb2N1c2VkU3ViamVjdHMsIHN1YmplY3QpXG5cdFxuXG5cdFxuXG5cbmV4cG9ydHMuRm9jdXNDb21wb25lbnQgPSBGb2N1c0NvbXBvbmVudFxuXG4iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUtBQTtBREFBLElBQUEsY0FBQTtFQUFBOzs7QUFBTTs7O0VBQ1Esd0JBQUMsT0FBRDtBQUlaLFFBQUE7O01BSmEs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
