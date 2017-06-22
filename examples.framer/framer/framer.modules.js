require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"FocusComponent":[function(require,module,exports){
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
    this._uniqId = _.random(1000);
    this._subjects = [];
    this._focusedSubjects = [];
    this._maxFocused = (ref = options.maxFocused) != null ? ref : 1;
    this._toggle = (ref1 = options.toggle) != null ? ref1 : true;
    this._toggleLock = (ref2 = options.toggleLock) != null ? ref2 : false;
    this._trigger = (ref3 = options.trigger) != null ? ref3 : 'Tap';
    this._release = (ref4 = options.release) != null ? ref4 : void 0;
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
      size: Screen.size,
      backgroundColor: null
    }));
  }

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

  FocusComponent.prototype.isFocused = function(subject) {
    return this._isFocused(subject);
  };

  FocusComponent.prototype.setFocused = function(subject, bool, instant) {
    if (bool == null) {
      bool = true;
    }
    if (instant == null) {
      instant = false;
    }
    return this._setFocused(subject, bool, instant);
  };

  FocusComponent.prototype.focusAll = function(instant) {
    var i, len, ref, results, subject;
    if (instant == null) {
      instant = false;
    }
    ref = this._unfocusedSubjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(this._setFocused(subject, true, instant));
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
      results.push(this._setFocused(subject, false, instant));
    }
    return results;
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

  FocusComponent.prototype.addRelease = function(subject, eventName) {
    if (eventName == null) {
      eventName = this._release;
    }
    return subject.on(Events[eventName], (function(_this) {
      return function() {
        if (_this._isFocused(subject) === false) {
          return;
        }
        return _this._setFocused(subject, false);
      };
    })(this));
  };

  FocusComponent.prototype.removeRelease = function(subject, eventName) {
    if (eventName == null) {
      eventName = this._trigger;
    }
    return subject.off(Events[eventName], (function(_this) {
      return function() {
        if (_this._isFocused(subject) === false) {
          return;
        }
        return _this._setFocused(subject, true);
      };
    })(this));
  };

  FocusComponent.prototype.isSubject = function(layer) {
    return _isSubject(layer);
  };

  FocusComponent.prototype.addSubject = function(newSubject, options) {
    var focused, focusedState, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, release, trigger, unfocusedState;
    if (options == null) {
      options = {};
    }
    trigger = (ref = options.trigger) != null ? ref : this._trigger;
    release = (ref1 = options.release) != null ? ref1 : this._release;
    focused = (ref2 = options.focused) != null ? ref2 : false;
    focusedState = (ref3 = options.focusedState) != null ? ref3 : (ref4 = newSubject.states) != null ? ref4.focused : void 0;
    unfocusedState = (ref5 = options.unfocusedState) != null ? ref5 : (ref6 = newSubject.states) != null ? ref6.unfocused : void 0;
    if (newSubject instanceof Layer === false) {
      throw "Observer can only add layers to its list of subjects. " + newSubject + ", id " + newSubject.id + " is not a layer.";
    }
    this.addTrigger(newSubject, trigger);
    if (release != null) {
      this.addRelease(newSubject, release);
    }
    newSubject.states["_focused" + this._uniqId] = focusedState != null ? focusedState : this._defaultFocused;
    newSubject.states["_unfocused" + this._uniqId] = (ref7 = unfocusedState != null ? unfocusedState : this._defaultUnfocused) != null ? ref7 : newSubject.states["default"];
    newSubject[this.name] = this;
    this._subjects.push(newSubject);
    if (focused === true) {
      this._setFocused(newSubject, focused, true);
    } else {
      if (this._useFocusStates === true) {
        newSubject.stateSwitch("_unfocused" + this._uniqId);
      }
    }
    return this.emit("change:subjects", newSubject, this._subjects);
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
    subject[this.name] = this;
    _.pull(this._subjects, subject);
    this.removeTrigger(subject);
    if (this._release != null) {
      this.removeRelease(subject);
    }
    return this.emit("change:subjects", subject, this._subjects);
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
    set: function(subject, bool) {
      var subjects;
      if (bool == null) {
        bool = false;
      }
      if (_.isArray(subjects) === false) {
        subjects = [subjects];
      }
      return subjects.forEach((function(_this) {
        return function(subject) {
          switch (_this._isFocused(subject)) {
            case void 0:
              throw 'FocusComponet.focused requires subjects to set as focused.';
              break;
            case false:
              return _this._addToFocusedSubjects(subject, bool);
          }
        };
      })(this));
    }
  });

  FocusComponent.define("unfocused", {
    get: function() {
      return _.without(this._subjects, this._focusedSubjects);
    },
    set: function(subjects, bool) {
      if (bool == null) {
        bool = false;
      }
      if (_.isArray(subjects) === false) {
        subjects = [subjects];
      }
      return subjects.forEach((function(_this) {
        return function(subject) {
          switch (_this._isFocused(subject)) {
            case void 0:
              throw 'FocusComponet.unfocused requires subjects to set as unfocused.';
              break;
            case true:
              return _this._removeFromFocusedSubjects(subject, bool);
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
      var adiosSubjects, i, j, layer, len, len1, subject;
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
      if (!_.includes(this._subjects, this._focusedSubject)) {
        return this._focusedSubject = void 0;
      }
    }
  });

  FocusComponent.prototype._focus = function(subject) {
    return _.bind(this._defaultFocus, subject)();
  };

  FocusComponent.prototype._unfocus = function(subject) {
    return _.bind(this._defaultUnfocus, subject)();
  };

  FocusComponent.prototype._setFocused = function(subject, bool, instant) {
    if (bool == null) {
      bool = true;
    }
    if (instant == null) {
      instant = false;
    }
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
      subject.emit("change:focused", bool);
      if (this._useFocusStates === true) {
        if (instant) {
          subject.stateSwitch("_focused" + this._uniqId);
        } else {
          subject.animate("_focused" + this._uniqId);
        }
      }
      if (this._useFocusFunctions === true) {
        return this._focus(subject);
      }
    } else {
      if (this._isFocused(subject) === false) {
        return;
      }
      this._removeFromFocusedSubjects(subject, instant);
      subject.emit("change:focused", bool);
      if (this._useFocusStates === true) {
        if (instant) {
          subject.stateSwitch("_unfocused" + this._uniqId);
        } else {
          subject.animate("_unfocused" + this._uniqId);
        }
      }
      if (this._useFocusFunctions === true) {
        return this._unfocus(subject);
      }
    }
  };

  FocusComponent.prototype._isFocused = function(subject) {
    return _.includes(this._focusedSubjects, subject);
  };

  FocusComponent.prototype._isSubject = function(layer) {
    return _.includes(this._subjects, layer);
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
      this.emit("change:focused", subject, this._focusedSubjects);
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
    _.pull(this._focusedSubjects, subject);
    return this.emit("change:unfocused", subject, this._unfocusedSubjects);
  };

  return FocusComponent;

})(Layer);

exports.FocusComponent = FocusComponent;


},{}],"app":[function(require,module,exports){
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
    this._uniqId = _.random(1000);
    this._subjects = [];
    this._focusedSubjects = [];
    this._maxFocused = (ref = options.maxFocused) != null ? ref : 1;
    this._toggle = (ref1 = options.toggle) != null ? ref1 : true;
    this._toggleLock = (ref2 = options.toggleLock) != null ? ref2 : false;
    this._trigger = (ref3 = options.trigger) != null ? ref3 : 'Tap';
    this._release = (ref4 = options.release) != null ? ref4 : void 0;
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

  FocusComponent.prototype.isFocused = function(subject) {
    return this._isFocused(subject);
  };

  FocusComponent.prototype.setFocused = function(subject, bool, instant) {
    if (bool == null) {
      bool = true;
    }
    if (instant == null) {
      instant = false;
    }
    return _setFocused(subject, bool, instant);
  };

  FocusComponent.prototype.focusAll = function(instant) {
    var i, len, ref, results, subject;
    if (instant == null) {
      instant = false;
    }
    ref = this._unfocusedSubjects;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      subject = ref[i];
      results.push(this._setFocused(subject, true, instant));
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
      results.push(this._setFocused(subject, false, instant));
    }
    return results;
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

  FocusComponent.prototype.addRelease = function(subject, eventName) {
    if (eventName == null) {
      eventName = this._release;
    }
    return subject.on(Events[eventName], (function(_this) {
      return function() {
        if (_this._isFocused(subject) === false) {
          return;
        }
        return _this._setFocused(subject, false);
      };
    })(this));
  };

  FocusComponent.prototype.removeRelease = function(subject, eventName) {
    if (eventName == null) {
      eventName = this._trigger;
    }
    return subject.off(Events[eventName], (function(_this) {
      return function() {
        if (_this._isFocused(subject) === false) {
          return;
        }
        return _this._setFocused(subject, true);
      };
    })(this));
  };

  FocusComponent.prototype.addSubject = function(newSubject, options) {
    var focused, focusedState, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, release, trigger, unfocusedState;
    if (options == null) {
      options = {};
    }
    trigger = (ref = options.trigger) != null ? ref : this._trigger;
    release = (ref1 = options.release) != null ? ref1 : this._release;
    focused = (ref2 = options.focused) != null ? ref2 : false;
    focusedState = (ref3 = options.focusedState) != null ? ref3 : (ref4 = newSubject.states) != null ? ref4.focused : void 0;
    unfocusedState = (ref5 = options.unfocusedState) != null ? ref5 : (ref6 = newSubject.states) != null ? ref6.unfocused : void 0;
    if (newSubject instanceof Layer === false) {
      throw "Observer can only add layers to its list of subjects. " + newSubject + ", id " + newSubject.id + " is not a layer.";
    }
    this.addTrigger(newSubject, trigger);
    if (release != null) {
      this.addRelease(newSubject, release);
    }
    newSubject.states["_focused" + this._uniqId] = focusedState != null ? focusedState : this._defaultFocused;
    newSubject.states["_unfocused" + this._uniqId] = (ref7 = unfocusedState != null ? unfocusedState : this._defaultUnfocused) != null ? ref7 : newSubject.states["default"];
    this._subjects.push(newSubject);
    if (focused === true) {
      this._setFocused(newSubject, focused, true);
    } else {
      if (this._useFocusStates === true) {
        newSubject.stateSwitch("_unfocused" + this._uniqId);
      }
      if (this._useFocusFunctions === true) {
        this._unfocus(newSubject);
      }
    }
    return this.emit("change:subjects", this._subjects);
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
    this.removeTrigger(subject);
    if (this._release != null) {
      this.removeRelease(newSubject);
    }
    return this.emit("change:subjects", this._subjects);
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
    set: function(subject, bool) {
      var subjects;
      if (bool == null) {
        bool = false;
      }
      if (_.isArray(subjects) === false) {
        subjects = [subjects];
      }
      return subjects.forEach((function(_this) {
        return function(subject) {
          switch (_this._isFocused(subject)) {
            case void 0:
              throw 'FocusComponet.focused requires subjects to set as focused.';
              break;
            case false:
              return _this._addToFocusedSubjects(subject, bool);
          }
        };
      })(this));
    }
  });

  FocusComponent.define("unfocused", {
    get: function() {
      return _.without(this._subjects, this._focusedSubjects);
    },
    set: function(subjects, bool) {
      if (bool == null) {
        bool = false;
      }
      if (_.isArray(subjects) === false) {
        subjects = [subjects];
      }
      return subjects.forEach((function(_this) {
        return function(subject) {
          switch (_this._isFocused(subject)) {
            case void 0:
              throw 'FocusComponet.unfocused requires subjects to set as unfocused.';
              break;
            case true:
              return _this._removeFromFocusedSubjects(subject, bool);
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
      var adiosSubjects, i, j, layer, len, len1, subject;
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
      if (!_.includes(this._subjects, this._focusedSubject)) {
        return this._focusedSubject = void 0;
      }
    }
  });

  FocusComponent.prototype._focus = function(subject) {
    return _.bind(this._defaultFocus, subject)();
  };

  FocusComponent.prototype._unfocus = function(subject) {
    return _.bind(this._defaultUnfocus, subject)();
  };

  FocusComponent.prototype._setFocused = function(subject, bool, instant) {
    if (bool == null) {
      bool = true;
    }
    if (instant == null) {
      instant = false;
    }
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
      subject.emit("change:focused", bool);
      if (this._useFocusStates === true) {
        if (instant) {
          subject.stateSwitch("_focused" + this._uniqId);
        } else {
          subject.animate("_focused" + this._uniqId);
        }
      }
      if (this._useFocusFunctions === true) {
        return this._focus(subject);
      }
    } else {
      if (this._isFocused(subject) === false) {
        return;
      }
      this._removeFromFocusedSubjects(subject, instant);
      subject.emit("change:focused", bool);
      if (this._useFocusStates === true) {
        if (instant) {
          subject.stateSwitch("_unfocused" + this._uniqId);
        } else {
          subject.animate("_unfocused" + this._uniqId);
        }
      }
      if (this._useFocusFunctions === true) {
        return this._unfocus(subject);
      }
    }
  };

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
      this.emit("change:focused", subject, this._focusedSubjects);
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
    _.pull(this._focusedSubjects, subject);
    return this.emit("change:unfocused", subject, this._unfocusedSubjects);
  };

  return FocusComponent;

})(Layer);

exports.FocusComponent = FocusComponent;


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXZlcnVpei9HaXRIdWIvRm9jdXNDb21wb25lbnQvZXhhbXBsZXMuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RldmVydWl6L0dpdEh1Yi9Gb2N1c0NvbXBvbmVudC9leGFtcGxlcy5mcmFtZXIvbW9kdWxlcy9hcHAuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RldmVydWl6L0dpdEh1Yi9Gb2N1c0NvbXBvbmVudC9leGFtcGxlcy5mcmFtZXIvbW9kdWxlcy9Gb2N1c0NvbXBvbmVudC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCJjbGFzcyBGb2N1c0NvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0IyBUT0RPOiBhbGxvdyBmb2N1c2VkIC8gdW5mb2N1c2VkIHN0YXRlcyBvdGhlciB0aGFuIHN0YXRlcy5mb2N1c2VkIGFuZCBzdGF0ZXMudW5mb2N1c2VkLlxuXG5cdFx0QF91bmlxSWQgPSBfLnJhbmRvbSgxMDAwKVxuXHRcdEBfc3ViamVjdHMgPSBbXVxuXHRcdEBfZm9jdXNlZFN1YmplY3RzID0gW11cblxuXHRcdEBfbWF4Rm9jdXNlZCA9IG9wdGlvbnMubWF4Rm9jdXNlZCA/IDFcblx0XHRAX3RvZ2dsZSA9IG9wdGlvbnMudG9nZ2xlID8gdHJ1ZVxuXHRcdEBfdG9nZ2xlTG9jayA9IG9wdGlvbnMudG9nZ2xlTG9jayA/IGZhbHNlXG5cdFx0QF90cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyID8gJ1RhcCdcblx0XHRAX3JlbGVhc2UgPSBvcHRpb25zLnJlbGVhc2UgPyB1bmRlZmluZWRcblx0XHRAX2RlZmF1bHRGb2N1c2VkID0gb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQgPyB7b3BhY2l0eTogMX1cblx0XHRAX2RlZmF1bHRVbmZvY3VzZWQgPSBvcHRpb25zLnN0YXRlcz8udW5mb2N1c2VkID8gaWYgb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQ/IHRoZW4gdW5kZWZpbmVkIGVsc2Uge29wYWNpdHk6IC41fVxuXHRcdEBfZGVmYXVsdEZvY3VzID0gb3B0aW9ucy5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0VW5mb2N1cyA9IG9wdGlvbnMudW5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0Tm90aWZ5ID0gb3B0aW9ucy5ub3RpZnkgPyAtPiByZXR1cm4gbnVsbFxuXHRcdEBfbm90aWZ5T25Gb2N1cyA9IG9wdGlvbnMubm90aWZ5T25Gb2N1cyA/IHRydWVcblx0XHRAX3VzZUZvY3VzU3RhdGVzID0gb3B0aW9ucy51c2VGb2N1c1N0YXRlcyA/IHRydWVcblx0XHRAX3VzZUZvY3VzRnVuY3Rpb25zID0gb3B0aW9ucy51c2VGb2N1c0Z1bmN0aW9ucyA/IHRydWVcblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6ICcuJ1xuXHRcdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cdFxuXHQjIHB1YmxpYyBmdW5jdGlvbnNcblxuXG5cdCMgbm90aWZ5IGFsbCBzdWJqZWN0c1xuXHRub3RpZnlTdWJqZWN0czogKGZ1bmMgPSBAX2RlZmF1bHROb3RpZnkpIC0+IGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX3N1YmplY3RzXG5cblx0IyBub3RpZnkgZm9jdXNlZCBzdWJqZWN0c1xuXHRub3RpZnlGb2N1c2VkU3ViamVjdHM6IChmdW5jID0gQF9kZWZhdWx0Rm9jdXMpIC0+IGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX2ZvY3VzZWRTdWJqZWN0c1xuXHRcblx0IyBub3RpZnkgdW5mb2N1c2VkIHN1YmplY3RzXG5cdG5vdGlmeVVuZm9jdXNlZFN1YmplY3RzOiAoZnVuYyA9IEBfZGVmYXVsdFVuZm9jdXMpIC0+IGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX3VuZm9jdXNlZFN1YmplY3RzXG5cdFxuXHQjIG5vdGlmeSBhIHNwZWNpZmljIHNldCBvZiBzdWJqZWN0cyAoVE9ETzogcmVtb3ZlPylcblx0bm90aWZ5U2VsZWN0ZWQ6IChzdWJqZWN0cyA9IEBfc3ViamVjdHMsIGZ1bmMgPSBAX2RlZmF1bHROb3RpZnkpIC0+IFxuXHRcdGlmIHR5cGVvZiBzdWJqZWN0cyBpcyAnb2JqZWN0JyB0aGVuIHN1YmplY3RzID0gW3N1YmplY3RzXVxuXHRcdGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX3N1YmplY3RzXG5cblx0IyBnZXQgd2hldGhlciBhIHN1YmplY3QgaXMgZm9jdXNlZCBvciB1bmZvY3VzZWRcblx0aXNGb2N1c2VkOiAoc3ViamVjdCkgLT4gcmV0dXJuIEBfaXNGb2N1c2VkKHN1YmplY3QpXG5cblx0IyBzZXQgYSBzcGVjaWZpYyBzdWJqZWN0IGFzIGZvY3VzZWQgb3IgdW5mb2N1c2VkXG5cdHNldEZvY3VzZWQ6IChzdWJqZWN0LCBib29sID0gdHJ1ZSwgaW5zdGFudCA9IGZhbHNlKSAtPiBfc2V0Rm9jdXNlZChzdWJqZWN0LCBib29sLCBpbnN0YW50KVxuXG5cdCMgZm9jdXMgYWxsIHVuZm9jdXNlZCBzdWJqZWN0c1xuXHRmb2N1c0FsbDogKGluc3RhbnQgPSBmYWxzZSkgLT4gQF9zZXRGb2N1c2VkKHN1YmplY3QsIHRydWUsIGluc3RhbnQpIGZvciBzdWJqZWN0IGluIEBfdW5mb2N1c2VkU3ViamVjdHNcblxuXHQjIHVuZm9jdXMgYWxsIGZvY3VzZWQgc3ViamVjdHNcblx0dW5mb2N1c0FsbDogKGluc3RhbnQgPSBmYWxzZSkgLT4gQF9zZXRGb2N1c2VkKHN1YmplY3QsIGZhbHNlLCBpbnN0YW50KSBmb3Igc3ViamVjdCBpbiBAX2ZvY3VzZWRTdWJqZWN0c1xuXG5cdCMgYWRkIGEgZm9jdXMgZXZlbnQgdG8gYSBzdWJqZWN0XG5cdGFkZFRyaWdnZXI6IChzdWJqZWN0LCBldmVudE5hbWUgPSBAX3RyaWdnZXIpIC0+IHN1YmplY3Qub24gRXZlbnRzW2V2ZW50TmFtZV0sID0+XG5cdFx0cmV0dXJuIGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIHRydWUgYW5kIEBfdG9nZ2xlIGlzIGZhbHNlXG5cdFx0QF9zZXRGb2N1c2VkKHN1YmplY3QsIHRydWUpXG5cdFxuXHQjIHJlbW92ZSBhIGZvY3VzIGV2ZW50IGZyb20gYSBzdWJqZWN0XG5cdHJlbW92ZVRyaWdnZXI6IChzdWJqZWN0LCBldmVudE5hbWUgPSBAX3RyaWdnZXIpIC0+IHN1YmplY3Qub2ZmIEV2ZW50c1tldmVudE5hbWVdLCA9PlxuXHRcdHJldHVybiBpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyB0cnVlIGFuZCBAX3RvZ2dsZSBpcyBmYWxzZVxuXHRcdEBfc2V0Rm9jdXNlZChzdWJqZWN0LCB0cnVlKVxuXG5cdCMgYWRkIGEgZm9jdXMgZXZlbnQgZnJvbSBhIHN1YmplY3Rcblx0YWRkUmVsZWFzZTogKHN1YmplY3QsIGV2ZW50TmFtZSA9IEBfcmVsZWFzZSkgLT4gc3ViamVjdC5vbiBFdmVudHNbZXZlbnROYW1lXSwgPT5cblx0XHRyZXR1cm4gaWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgZmFsc2Vcblx0XHRAX3NldEZvY3VzZWQoc3ViamVjdCwgZmFsc2UpXG5cblx0IyByZW1vdmUgYSBmb2N1cyBldmVudCBmcm9tIGEgc3ViamVjdFxuXHRyZW1vdmVSZWxlYXNlOiAoc3ViamVjdCwgZXZlbnROYW1lID0gQF90cmlnZ2VyKSAtPiBzdWJqZWN0Lm9mZiBFdmVudHNbZXZlbnROYW1lXSwgPT5cblx0XHRyZXR1cm4gaWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgZmFsc2Vcblx0XHRAX3NldEZvY3VzZWQoc3ViamVjdCwgdHJ1ZSlcblxuXHQjIGFkZCBhIG5ldyBzdWJqZWN0IHRvIHRoaXMgRm9jdXNDb21wb25lbnRcblx0YWRkU3ViamVjdDogKG5ld1N1YmplY3QsIG9wdGlvbnMgPSB7fSkgLT5cblx0XHR0cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyID8gQF90cmlnZ2VyXG5cdFx0cmVsZWFzZSA9IG9wdGlvbnMucmVsZWFzZSA/IEBfcmVsZWFzZVxuXHRcdGZvY3VzZWQgPSBvcHRpb25zLmZvY3VzZWQgPyBmYWxzZVxuXHRcdGZvY3VzZWRTdGF0ZSA9IG9wdGlvbnMuZm9jdXNlZFN0YXRlID8gbmV3U3ViamVjdC5zdGF0ZXM/LmZvY3VzZWRcblx0XHR1bmZvY3VzZWRTdGF0ZSA9IG9wdGlvbnMudW5mb2N1c2VkU3RhdGUgPyBuZXdTdWJqZWN0LnN0YXRlcz8udW5mb2N1c2VkXG5cblx0XHQjIHRocm93IGFuIGVycm9yIGlmIGxheWVyIGlzbid0IGEgbGF5ZXJcblx0XHRpZiBuZXdTdWJqZWN0IGluc3RhbmNlb2YgTGF5ZXIgaXMgZmFsc2UgdGhlbiB0aHJvdyBcIk9ic2VydmVyIGNhbiBvbmx5IGFkZCBsYXllcnMgdG8gaXRzIGxpc3Qgb2Ygc3ViamVjdHMuICN7bmV3U3ViamVjdH0sIGlkICN7bmV3U3ViamVjdC5pZH0gaXMgbm90IGEgbGF5ZXIuXCJcblxuXHRcdCMgc2V0IGV2ZW50IHRyaWdnZXIgKGV2ZW50IG5hbWUgcHJvdmlkZWQgaW4gb3B0aW9ucyBvciBkZWZhdWx0IGV2ZW50IG5hbWUpXG5cdFx0QGFkZFRyaWdnZXIobmV3U3ViamVjdCwgdHJpZ2dlcilcblx0XHRpZiByZWxlYXNlPyB0aGVuIEBhZGRSZWxlYXNlKG5ld1N1YmplY3QsIHJlbGVhc2UpXG5cblx0XHQjIHNldCBmb2N1c2VkIC8gdW5mb2N1c2VkIGxheWVyIHN0YXRlcyAoc3RhdGVzIHByb3ZpZGVkIGluIG9wdGlvbnMsIG9yIGV4aXN0aW5nIHN0YXRlcyBvciBkZWZhdWx0IHN0YXRlcylcblx0XHRuZXdTdWJqZWN0LnN0YXRlc1tcIl9mb2N1c2VkI3tAX3VuaXFJZH1cIl0gPSBmb2N1c2VkU3RhdGUgPyBAX2RlZmF1bHRGb2N1c2VkXG5cdFx0bmV3U3ViamVjdC5zdGF0ZXNbXCJfdW5mb2N1c2VkI3tAX3VuaXFJZH1cIl0gPSB1bmZvY3VzZWRTdGF0ZSA/IEBfZGVmYXVsdFVuZm9jdXNlZCA/IG5ld1N1YmplY3Quc3RhdGVzLmRlZmF1bHRcblxuXHRcdCMgYWRkIGxheWVyIHRvIHN1YmplY3RzIGFycmF5XG5cdFx0QF9zdWJqZWN0cy5wdXNoKG5ld1N1YmplY3QpXG5cblx0XHQjIGlmIHRoaXMgc3ViamVjdCBzaG91bGQgc3RhcnQgYXMgZm9jdXNlZCwgc2V0IGl0IGFzIGZvY3VzZWRcblx0XHRpZiBmb2N1c2VkIGlzIHRydWUgdGhlbiBAX3NldEZvY3VzZWQobmV3U3ViamVjdCwgZm9jdXNlZCwgdHJ1ZSlcblx0XHRlbHNlICMgY3JlYXRlIHVuZm9jdXNlZCBlZmZlY3RzXG5cdFx0XHRpZiBAX3VzZUZvY3VzU3RhdGVzIGlzIHRydWUgdGhlbiBuZXdTdWJqZWN0LnN0YXRlU3dpdGNoKFwiX3VuZm9jdXNlZCN7QF91bmlxSWR9XCIpXG5cdFx0XHRpZiBAX3VzZUZvY3VzRnVuY3Rpb25zIGlzIHRydWUgdGhlbiBAX3VuZm9jdXMobmV3U3ViamVjdClcblxuXHRcdCMgZW1pdCBhbiBldmVudCBvbiBGb2N1c0NvbXBvbmVudFxuXHRcdEBlbWl0KFwiY2hhbmdlOnN1YmplY3RzXCIsIEBfc3ViamVjdHMpXG5cblx0IyByZW1vdmUgYSBzdWJqZWN0IGZyb20gdGhpcyBGb2N1c0NvbXBvbmVudFxuXHRyZW1vdmVTdWJqZWN0OiAoc3ViamVjdCkgLT5cblxuXHRcdCMgdGhyb3cgYSB3YXJuaW5nIHdoZW4gdHJ5aW5nIHRvIHJlbW92ZSBhIGxheWVyIGlzbid0IGEgc3ViamVjdFxuXHRcdGlmIF8uaW5jbHVkZXMoQF9zdWJqZWN0cywgc3ViamVjdCkgaXMgZmFsc2Vcblx0XHRcdGlmIHN1YmplY3QgaW5zdGFuY2VvZiBMYXllciBpcyB0cnVlIHRoZW4gdGhyb3cgXCJUaGF0IGxheWVyICgje2xheWVyLm5hbWUgPyBsYXllcn0sIGlkOiAje2xheWVyLmlkfSkgaXNuJ3QgYSBzdWJqZWN0LlwiXG5cdFx0XHQjIHRocm93IGEgbW9yZSBkZXNjcmlwdGl2ZSBlcnJvciBpZiB0aGUgbGF5ZXIgaXNuJ3QgYSBsYXllci5cblx0XHRcdGVsc2UgdGhyb3cgXCJUaGF0IGlzbid0IGEgbGF5ZXIuIE9ic2VydmVyIGNhbiBvbmx5IHJlbW92ZSBsYXllcnMgdGhhdCBhcmUgb24gaXRzIGxpc3Qgb2Ygc3ViamVjdCBsYXllcnMuXCJcblx0XHRcblx0XHRpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSB0aGVuIEBfcmVtb3ZlRnJvbUZvY3VzZWRTdWJqZWN0cyhzdWJqZWN0LCBmYWxzZSlcblxuXHRcdCMgcmVtb3ZlIGZyb20gbGlzdCBvZiBzdWJqZWN0c1xuXHRcdF8ucHVsbChAX3N1YmplY3RzLCBzdWJqZWN0KVxuXHRcdCMgcmVtb3ZlIGZvY3VzQ29tcG9uZW50IHRyaWdnZXIgKFRPRE86IHJlbW92ZSBhbGwgYWRkZWQgdHJpZ2dlcnMsIG5vdCBqdXN0IG1vc3QgcmVjZW50KVxuXHRcdEByZW1vdmVUcmlnZ2VyKHN1YmplY3QpXG5cdFx0aWYgQF9yZWxlYXNlPyB0aGVuIEByZW1vdmVSZWxlYXNlKG5ld1N1YmplY3QpXG5cblx0XHQjIGVtaXQgYW4gZXZlbnQgb24gRm9jdXNDb21wb25lbnRcblx0XHRAZW1pdChcImNoYW5nZTpzdWJqZWN0c1wiLCBAX3N1YmplY3RzKVxuXG5cblx0IyBwdWJsaWMgcHJvcGVydGllc1xuXG5cdEBkZWZpbmUgXCJ0cmlnZ2VyXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF90cmlnZ2VyXG5cdFx0c2V0OiAoZXZlbnROYW1lKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGV2ZW50TmFtZSBpc250ICdzdHJpbmcnIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC50cmlnZ2VyIHJlcXVpcmVzIGFuIGV2ZW50IG5hbWUgYXMgc3RyaW5nLCBsaWtlICdUYXAnIG9yICdNb3VzZU92ZXInLlwiXG5cdFx0XHQjIHNldCB0cmlnZ2VyIGFzIGRlZmF1bHQgdHJpZ2dlciwgdG8gYmUgZ2l2ZW4gdG8gYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF90cmlnZ2VyID0gZXZlbnROYW1lIFxuXG5cblx0QGRlZmluZSBcIm5vdGlmeVwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdE5vdGlmeVxuXHRcdHNldDogKGZ1bmMpIC0+XG5cdFx0XHRpZiB0eXBlb2YgZnVuYyBpc250ICdmdW5jdGlvbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50Lm5vdGlmeSByZXF1aXJlcyBhIGZ1bmN0aW9uIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfZGVmYXVsdE5vdGlmeSA9IGZ1bmNcblxuXG5cdEBkZWZpbmUgXCJub3RpZnlPbkZvY3VzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9ub3RpZnlPbkZvY3VzXG5cdFx0c2V0OiAoYm9vbCkgLT5cblx0XHRcdGlmIHR5cGVvZiBib29sIGlzbnQgJ2Jvb2xlYW4nIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC5ub3RpZnlPbkZvY3VzIHJlcXVpcmVzIGEgYm9vbGVhbiAodHJ1ZSBvciBmYWxzZSkgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF9ub3RpZnlPbkZvY3VzID0gYm9vbFxuXG5cblx0QGRlZmluZSBcIm1heEZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX21heEZvY3VzZWRcblx0XHRzZXQ6IChudW1iZXIpIC0+XG5cdFx0XHRpZiB0eXBlb2YgbnVtYmVyIGlzbnQgJ251bWJlcicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50Lm1heEZvY3VzZWQgcmVxdWlyZXMgYSBudW1iZXIgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF9tYXhGb2N1c2VkID0gbnVtYmVyXG5cblxuXHRAZGVmaW5lIFwidG9nZ2xlTG9ja1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdG9nZ2xlTG9ja1xuXHRcdHNldDogKGJvb2wpIC0+XG5cdFx0XHRpZiB0eXBlb2YgYm9vbCBpc250ICdib29sZWFuJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQudG9nZ2xlTG9jayByZXF1aXJlcyBhIGJvb2xlYW4gKHRydWUgb3IgZmFsc2UpIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfdG9nZ2xlTG9jayA9IGJvb2xcblxuXG5cdEBkZWZpbmUgXCJ1c2VGb2N1c0Z1bmN0aW9uc1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdXNlRm9jdXNGdW5jdGlvbnNcblx0XHRzZXQ6IChib29sKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGJvb2wgaXNudCAnYm9vbGVhbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LnVzZUZvY3VzRnVuY3Rpb25zIHJlcXVpcmVzIGEgYm9vbGVhbiAodHJ1ZSBvciBmYWxzZSkgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF91c2VGb2N1c0Z1bmN0aW9ucyA9IGJvb2xcblxuXG5cdCMgZ2V0IGN1cnJlbnQgZGVmYXVsdCBmb2N1cyBmdW5jdGlvbiwgdXNlZCBieSBhbGwgc3ViamVjdHMsIG9yIHNldCBhIG5ldyBvbmVcblx0QGRlZmluZSBcImZvY3VzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9kZWZhdWx0Rm9jdXNcblx0XHRzZXQ6IChmdW5jKSAtPiBcblx0XHRcdGlmIHR5cGVvZiBmdW5jIGlzbnQgJ2Z1bmN0aW9uJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQuZm9jdXMgcmVxdWlyZXMgYSBmdW5jdGlvbiB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBmb2N1cywgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHMgd2hlbiBmb2N1c2VkXG5cdFx0XHRAX2RlZmF1bHRGb2N1cyA9IGZ1bmNcblxuXG5cdCMgZ2V0IGN1cnJlbnQgZGVmYXVsdCB1bmZvY3VzIGZ1bmN0aW9uLCB1c2VkIGJ5IGFsbCBzdWJqZWN0cywgb3Igc2V0IGEgbmV3IG9uZVxuXHRAZGVmaW5lIFwidW5mb2N1c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdFVuZm9jdXNcblx0XHRzZXQ6IChmdW5jKSAtPiBcblx0XHRcdGlmIHR5cGVvZiBmdW5jIGlzbnQgJ2Z1bmN0aW9uJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQudW5mb2N1cyByZXF1aXJlcyBhIGZ1bmN0aW9uIHZhbHVlLlwiXG5cdFx0XHRcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgdW5mb2N1cywgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHMgd2hlbiB1bmZvY3VzZWRcblx0XHRcdEBfZGVmYXVsdFVuZm9jdXMgPSBmdW5jXG5cblxuXHQjIGdldCBjdXJyZW50IGZvY3VzZWQgc3ViamVjdHMgb3Igc2V0IGZvY3VzZWQgc3ViamVjdHNcblx0QGRlZmluZSBcImZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2ZvY3VzZWRTdWJqZWN0c1xuXHRcdHNldDogKHN1YmplY3QsIGJvb2wgPSBmYWxzZSkgLT5cblx0XHRcdCMgYWNjZXB0cyBhcnJheXMsIHNvIG1ha2UgYW4gYXJyYXkgaWYgbm90IGdpdmVuIG9uZVxuXHRcdFx0aWYgXy5pc0FycmF5KHN1YmplY3RzKSBpcyBmYWxzZSB0aGVuIHN1YmplY3RzID0gW3N1YmplY3RzXVxuXG5cdFx0XHQjIGZvY3VzIG9uIGFueSBvZiB0aGUgbGF5ZXJzIHRoYXQgYXJlbid0IGZvY3VzZWQgYWxyZWFkeVxuXHRcdFx0c3ViamVjdHMuZm9yRWFjaCAoc3ViamVjdCkgPT4gXG5cdFx0XHRcdHN3aXRjaCBAX2lzRm9jdXNlZChzdWJqZWN0KSBcblx0XHRcdFx0XHR3aGVuIHVuZGVmaW5lZCB0aGVuIHRocm93ICdGb2N1c0NvbXBvbmV0LmZvY3VzZWQgcmVxdWlyZXMgc3ViamVjdHMgdG8gc2V0IGFzIGZvY3VzZWQuJ1xuXHRcdFx0XHRcdHdoZW4gZmFsc2UgdGhlbiBAX2FkZFRvRm9jdXNlZFN1YmplY3RzKHN1YmplY3QsIGJvb2wpXG5cblxuXHQjIGdldCBjdXJyZW50IHVuZm9jdXNlZCBzdWJqZWN0c1xuXHRAZGVmaW5lIFwidW5mb2N1c2VkXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gXy53aXRob3V0KEBfc3ViamVjdHMsIEBfZm9jdXNlZFN1YmplY3RzKVxuXHRcdHNldDogKHN1YmplY3RzLCBib29sID0gZmFsc2UpIC0+XG5cdFx0XHQjIGFjY2VwdHMgYXJyYXlzLCBzbyBtYWtlIGFuIGFycmF5IGlmIG5vdCBnaXZlbiBvbmVcblx0XHRcdGlmIF8uaXNBcnJheShzdWJqZWN0cykgaXMgZmFsc2UgdGhlbiBzdWJqZWN0cyA9IFtzdWJqZWN0c11cblxuXHRcdFx0IyB1bmZvY3VzIGFueSBvZiB0aGUgc3ViamVjdHMgdGhhdCBhcmUgZm9jdXNlZFxuXHRcdFx0c3ViamVjdHMuZm9yRWFjaCAoc3ViamVjdCkgPT4gXG5cdFx0XHRcdHN3aXRjaCBAX2lzRm9jdXNlZChzdWJqZWN0KSBcblx0XHRcdFx0XHR3aGVuIHVuZGVmaW5lZCB0aGVuIHRocm93ICdGb2N1c0NvbXBvbmV0LnVuZm9jdXNlZCByZXF1aXJlcyBzdWJqZWN0cyB0byBzZXQgYXMgdW5mb2N1c2VkLidcblx0XHRcdFx0XHR3aGVuIHRydWUgdGhlbiBAX3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCwgYm9vbClcblxuXG5cdEBkZWZpbmUgXCJ1c2VGb2N1c1N0YXRlc1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdXNlRm9jdXNTdGF0ZXNcblx0XHRzZXQ6IChib29sKSAtPiBcblx0XHRcdGlmIHR5cGVvZiBib29sIGlzbnQgJ2Jvb2xlYW4nIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC51c2VGb2N1c1N0YXRlcyByZXF1aXJlcyBhIGJvb2xlYW4gdmFsdWUuXCJcblx0XHRcdEBfdXNlRm9jdXNTdGF0ZXMgPSBib29sXG5cblxuXHQjIGdldCBvciBzZXQgdGhlIGFycmF5IG9mIHN1YmplY3RzICggbmVlZHMgd29yayApXG5cdEBkZWZpbmUgXCJzdWJqZWN0c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfc3ViamVjdHNcblx0XHRzZXQ6IChsYXllcnMpIC0+XG5cdFx0XHQjIHRocm93IGVycm9yIGlmIGxheWVycyBpc250IGFuIGFycmF5XG5cdFx0XHRpZiBfLmlzQXJyYXkobGF5ZXJzKSBpcyBmYWxzZSBvciBsYXllcnMubGVuZ3RoIDwgMCB0aGVuIHRocm93ICdTdWJqZWN0cyByZXF1aXJlcyBhbiBhcnJheS4nXG5cblx0XHRcdCMgcHJlc2VydmUgZm9jdXNlZCBzdWJqZWN0cyB0aGF0IGFyZSBhbHNvIGluY2x1ZGVkIGluIHRoZSBuZXcgbGF5ZXJzIGFycmF5XG5cdFx0XHRAX2ZvY3VzZWRTdWJqZWN0cyA9IF8uaW50ZXJzZWN0aW9uKEBfZm9jdXNlZFN1YmplY3RzLCBsYXllcnMpXG5cdFx0XHRcblx0XHRcdCMgcmVtb3ZlIGV4aXN0aW5nIHN1YmplY3RzIHRoYXQgYXJlIG5vdCBvbiB0aGUgbmV3IGxpc3Rcblx0XHRcdGFkaW9zU3ViamVjdHMgPSBfLmRpZmZlcmVuY2UoQF9zdWJqZWN0cywgbGF5ZXJzKVxuXHRcdFx0QHJlbW92ZVN1YmplY3Qoc3ViamVjdCkgZm9yIHN1YmplY3QgaW4gYWRpb3NTdWJqZWN0c1xuXHRcdFxuXHRcdFx0IyBkZWZpbmUgbmV3IHN1YmplY3RzXG5cdFx0XHRAYWRkU3ViamVjdChsYXllcikgZm9yIGxheWVyIGluIGxheWVyc1xuXG5cdFx0XHQjIHJlbW92ZSBmb2N1c2VkIHN1YmplY3QgaWYgbmV3IHN1YmplY3RzIGRvZXNuJ3QgaW5jbHVkZSBpdFxuXHRcdFx0aWYgbm90IF8uaW5jbHVkZXMoQF9zdWJqZWN0cywgQF9mb2N1c2VkU3ViamVjdClcblx0XHRcdFx0QF9mb2N1c2VkU3ViamVjdCA9IHVuZGVmaW5lZFxuXG5cblx0IyBwcml2YXRlIGZ1bmN0aW9uc1xuXG5cblx0IyBydW4gZm9jdXMgZnVuY3Rpb24gZm9yIHN1YmplY3Rcblx0X2ZvY3VzOiAoc3ViamVjdCkgLT4gZG8gXy5iaW5kKEBfZGVmYXVsdEZvY3VzLCBzdWJqZWN0KVxuXG5cblx0IyBydW4gdW5mb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRfdW5mb2N1czogKHN1YmplY3QpIC0+IGRvIF8uYmluZChAX2RlZmF1bHRVbmZvY3VzLCBzdWJqZWN0KVxuXG5cblx0IyBzZXQgZm9jdXNlZCBzdGF0ZSBvZiBhIHN1YmplY3Rcblx0X3NldEZvY3VzZWQ6IChzdWJqZWN0LCBib29sPXRydWUsIGluc3RhbnQgPSBmYWxzZSkgLT5cblx0XHQjIGlmIHRoZSBzdWJqZWN0J3MgZm9jdXMgc3RhdGUgc2hvdWxkIGJlIGZvY3VzZWQuLi5cblx0XHRpZiBib29sIGlzIHRydWVcblx0XHRcdCMgaWYgc3ViamVjdCBpcyBhbHJlYWR5IGZvY3VzZWQuLi5cblx0XHRcdGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIHRydWVcblx0XHRcdFx0IyBpZiB0b2dnbGUgbW9kZSBpcyBvbiwgdW5mb2N1cyB0aGUgc3ViamVjdFxuXHRcdFx0XHRpZiBAX3RvZ2dsZSBpcyB0cnVlIHRoZW4gQF9zZXRGb2N1c2VkKHN1YmplY3QsIGZhbHNlLCBpbnN0YW50KVxuXHRcdFx0XHQjIGVpdGhlciB3YXksIHJldHVyblxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0XHQjIGNhbmNlbCBuZXcgZm9jdXMgaWYgdG9nZ2xlIGxvY2sgaXMgb25cblx0XHRcdHJldHVybiBpZiBfLnNpemUoQF9mb2N1c2VkU3ViamVjdHMpID49IEBfbWF4Rm9jdXNlZCBhbmQgQF90b2dnbGVMb2NrIGlzIHRydWVcblxuXHRcdFx0IyBpZiB0aGUgc3ViamVjdCBpc24ndCBhbHJlYWR5IGZvY3VzZWQsIGFkZCBpdCB0byBmb2N1c2VkIHN1YmplY3RzXG5cdFx0XHRAX2FkZFRvRm9jdXNlZFN1YmplY3RzKHN1YmplY3QsIGluc3RhbnQpXG5cdFx0XHRcblx0XHRcdCMgZW1pdCBhbiBldmVudCBvbiB0aGUgc3ViamVjdFxuXHRcdFx0c3ViamVjdC5lbWl0KFwiY2hhbmdlOmZvY3VzZWRcIiwgYm9vbClcblx0XHRcdFxuXHRcdFx0IyBhbmQgaWYgZm9jdXNlZCBzdGF0ZXMgYXJlIGJlaW5nIHVzZWQuLi5cblx0XHRcdGlmIEBfdXNlRm9jdXNTdGF0ZXMgaXMgdHJ1ZVxuXHRcdFx0XHQjIGVpdGhlciBzd2l0Y2ggb3IgYW5pbWF0ZSB0byBmb2N1c2VkIHN0YXRlLCBkZXBlbmRpbmcgb24gdGhlIGluc3RhbnQgYXJndW1lbnRcblx0XHRcdFx0aWYgaW5zdGFudCB0aGVuIHN1YmplY3Quc3RhdGVTd2l0Y2goXCJfZm9jdXNlZCN7QF91bmlxSWR9XCIpIGVsc2Ugc3ViamVjdC5hbmltYXRlKFwiX2ZvY3VzZWQje0BfdW5pcUlkfVwiKVxuXHRcdFx0IyBhbmQgaWYgZm9jdXMgZnVuY3Rpb25zIGFyZSBiZWluZyB1c2VkLi4uIHJ1biBmb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRcdFx0aWYgQF91c2VGb2N1c0Z1bmN0aW9ucyBpcyB0cnVlIHRoZW4gQF9mb2N1cyhzdWJqZWN0KSBcblxuXHRcdCMgaWYgdGhlIHN1YmplY3QncyBmb2N1cyBzdGF0ZSBzaG91bGQgYmUgdW5mb2N1c2VkLi4uXG5cdFx0ZWxzZVxuXHRcdFx0IyBpZiB0aGUgc3ViamVjdCBpcyBhbHJlYWR5IHVuZm9jdXNlZC4uLiBkbyBub3RoaW5nXG5cdFx0XHRyZXR1cm4gaWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgZmFsc2VcblxuXHRcdFx0IyBpZiB0aGUgc3ViamVjdCBpcyBmb2N1c2VkLCByZW1vdmUgaXQgZnJvbSBmb2N1c2VkIHN1YmplY3RzXG5cdFx0XHRAX3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCwgaW5zdGFudCkgXG5cblx0XHRcdCMgZW1pdCBhbiBldmVudCBvbiB0aGUgc3ViamVjdFxuXHRcdFx0c3ViamVjdC5lbWl0KFwiY2hhbmdlOmZvY3VzZWRcIiwgYm9vbClcblxuXHRcdFx0IyBhbmQgaWYgZm9jdXNlZCBzdGF0ZXMgYXJlIGJlaW5nIHVzZWQuLi5cblx0XHRcdGlmIEBfdXNlRm9jdXNTdGF0ZXMgaXMgdHJ1ZVxuXHRcdFx0XHQjIGVpdGhlciBzd2l0Y2ggb3IgYW5pbWF0ZSB0byB0aGUgdW5mb2N1c2VkIHN0YXRlLCBkZXBlbmRpbmcgb24gdGhlIGluc3RhbnQgYXJndW1lbnRcblx0XHRcdFx0aWYgaW5zdGFudCB0aGVuIHN1YmplY3Quc3RhdGVTd2l0Y2goXCJfdW5mb2N1c2VkI3tAX3VuaXFJZH1cIikgZWxzZSBzdWJqZWN0LmFuaW1hdGUoXCJfdW5mb2N1c2VkI3tAX3VuaXFJZH1cIilcblx0XHRcdCMgYW5kIGlmIGZvY3VzIGZ1bmN0aW9ucyBhcmUgYmVpbmcgdXNlZC4uLiBydW4gdGhlIHVuZm9jdXMgZnVuY3Rpb24gZm9yIHN1YmplY3Rcblx0XHRcdGlmIEBfdXNlRm9jdXNGdW5jdGlvbnMgaXMgdHJ1ZSB0aGVuIEBfdW5mb2N1cyhzdWJqZWN0KVxuXG5cblx0IyBnZXQgd2hldGhlciBhIHN1YmplY3QgaXMgZm9jdXNlZCBvciBub3Rcblx0X2lzRm9jdXNlZDogKHN1YmplY3QpIC0+IHJldHVybiBfLmluY2x1ZGVzKEBfZm9jdXNlZFN1YmplY3RzLCBzdWJqZWN0KVxuXG5cblx0IyBhZGQgYSBsYXllciB0byBhcnJheSBvZiBmb2N1c2VkIHN1YmplY3RzLCBtYWtpbmcgcm9vbSBpZiBuZWNlc3Nhcnlcblx0X2FkZFRvRm9jdXNlZFN1YmplY3RzOiAoc3ViamVjdCwgaW5zdGFudCA9IGZhbHNlKSAtPlxuXHRcdCMgdGhyb3cgYW4gZXJyb3IgaWYgYSBmb2N1c2VkIGxheWVyIHdhcyBzZW50IGhlcmVcblx0XHRpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyB0cnVlIHRoZW4gdGhyb3cgXCJGb2N1c2VkIG9uIGEgZm9jdXNlZCBzdWJqZWN0LiBJcyB0aGF0IHJpZ2h0P1wiXG5cblx0XHQjIGlmIHdlJ3JlIGF0IHRoZSBsaW1pdCBvZiBvdXIgZm9jdXNlZCBzdWJqZWN0cy4uLlxuXHRcdGlmIF8uc2l6ZShAX2ZvY3VzZWRTdWJqZWN0cykgPj0gQF9tYXhGb2N1c2VkXG5cdFx0XHQjIHJlbW92ZSB0aGUgc3Vic2NyaWJlIGZyb20gdGhlIGZyb250IG9mIHRoZSBsaXN0IGFuZCBzZXQgaXQgYXMgdW5mb2N1c2VkXG5cdFx0XHRAX3NldEZvY3VzZWQoQF9mb2N1c2VkU3ViamVjdHNbMF0sIGZhbHNlLCBpbnN0YW50KVxuXHRcdFx0IyByZXBlYXQgdW50aWwgd2UgaGF2ZSByb29tIGZvciBhIG5ldyBmb2N1c2VkIHN1YmplY3Rcblx0XHRcdEBfYWRkVG9Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCwgaW5zdGFudClcblx0XHRcblx0XHQjIGlmIChvciB3aGVuKSB0aGVyZSBpcyByb29tLi4uXG5cdFx0ZWxzZVxuXHRcdFx0IyBhZGQgdGhlIG5ldyBmb2N1c2VkIHN1YmplY3QgdG8gdGhlIGVuZCBvZiB0aGUgbGlzdFxuXHRcdFx0QF9mb2N1c2VkU3ViamVjdHMucHVzaChzdWJqZWN0KVxuXG5cdFx0XHQjIGVtaXQgYW4gZXZlbnQgb24gdGhlIEZvY3VzQ29tcG9uZW50XG5cdFx0XHRAZW1pdChcImNoYW5nZTpmb2N1c2VkXCIsIHN1YmplY3QsIEBfZm9jdXNlZFN1YmplY3RzKVxuXG5cdFx0XHQjIG5vdGlmeSBzdWJqZWN0cyBpZiBcblx0XHRcdGlmIEBfbm90aWZ5T25Gb2N1cyBpcyB0cnVlIHRoZW4gQG5vdGlmeVN1YmplY3RzKClcblxuXG5cdCMgcmVtb3ZlIGEgbGF5ZXIgZnJvbSBhcnJheSBvZiBmb2N1c2VkIHN1YmplY3RzXG5cdF9yZW1vdmVGcm9tRm9jdXNlZFN1YmplY3RzOiAoc3ViamVjdCwgaW5zdGFudCA9IGZhbHNlKSAtPlxuXHRcdCMgdGhyb3cgYW4gZXJyb3IgaWYgYSBub24tZm9jdXNlZCBsYXllciB3YXMgc2VudCBoZXJlXG5cdFx0aWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgZmFsc2UgdGhlbiB0aHJvdyBcIlRyaWVkIHRvIHJlbW92ZSBhIGxheWVyIHRoYXQgd2Fzbid0IGZvY3VzZWQuXCJcblx0XHRcblx0XHQjIHJlbW92ZSB0aGUgZm9jdXNlZCBzdWJqZWN0ZFxuXHRcdF8ucHVsbChAX2ZvY3VzZWRTdWJqZWN0cywgc3ViamVjdClcblxuXHRcdCMgZW1pdCBhbiBldmVudCBvbiB0aGUgRm9jdXNDb21wb25lbnRcblx0XHRAZW1pdChcImNoYW5nZTp1bmZvY3VzZWRcIiwgc3ViamVjdCwgQF91bmZvY3VzZWRTdWJqZWN0cylcblx0XG5cblx0XG5cblxuZXhwb3J0cy5Gb2N1c0NvbXBvbmVudCA9IEZvY3VzQ29tcG9uZW50XG5cbiIsImNsYXNzIEZvY3VzQ29tcG9uZW50IGV4dGVuZHMgTGF5ZXJcblx0Y29uc3RydWN0b3I6IChvcHRpb25zID0ge30pIC0+XG5cblx0XHQjIFRPRE86IGFsbG93IGZvY3VzZWQgLyB1bmZvY3VzZWQgc3RhdGVzIG90aGVyIHRoYW4gc3RhdGVzLmZvY3VzZWQgYW5kIHN0YXRlcy51bmZvY3VzZWQuXG5cblx0XHRAX3VuaXFJZCA9IF8ucmFuZG9tKDEwMDApXG5cdFx0QF9zdWJqZWN0cyA9IFtdXG5cdFx0QF9mb2N1c2VkU3ViamVjdHMgPSBbXVxuXG5cdFx0QF9tYXhGb2N1c2VkID0gb3B0aW9ucy5tYXhGb2N1c2VkID8gMVxuXHRcdEBfdG9nZ2xlID0gb3B0aW9ucy50b2dnbGUgPyB0cnVlXG5cdFx0QF90b2dnbGVMb2NrID0gb3B0aW9ucy50b2dnbGVMb2NrID8gZmFsc2Vcblx0XHRAX3RyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXIgPyAnVGFwJ1xuXHRcdEBfcmVsZWFzZSA9IG9wdGlvbnMucmVsZWFzZSA/IHVuZGVmaW5lZFxuXHRcdEBfZGVmYXVsdEZvY3VzZWQgPSBvcHRpb25zLnN0YXRlcz8uZm9jdXNlZCA/IHtvcGFjaXR5OiAxfVxuXHRcdEBfZGVmYXVsdFVuZm9jdXNlZCA9IG9wdGlvbnMuc3RhdGVzPy51bmZvY3VzZWQgPyBpZiBvcHRpb25zLnN0YXRlcz8uZm9jdXNlZD8gdGhlbiB1bmRlZmluZWQgZWxzZSB7b3BhY2l0eTogLjV9XG5cdFx0QF9kZWZhdWx0Rm9jdXMgPSBvcHRpb25zLmZvY3VzID8gLT4gcmV0dXJuIG51bGxcblx0XHRAX2RlZmF1bHRVbmZvY3VzID0gb3B0aW9ucy51bmZvY3VzID8gLT4gcmV0dXJuIG51bGxcblx0XHRAX2RlZmF1bHROb3RpZnkgPSBvcHRpb25zLm5vdGlmeSA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9ub3RpZnlPbkZvY3VzID0gb3B0aW9ucy5ub3RpZnlPbkZvY3VzID8gdHJ1ZVxuXHRcdEBfdXNlRm9jdXNTdGF0ZXMgPSBvcHRpb25zLnVzZUZvY3VzU3RhdGVzID8gdHJ1ZVxuXHRcdEBfdXNlRm9jdXNGdW5jdGlvbnMgPSBvcHRpb25zLnVzZUZvY3VzRnVuY3Rpb25zID8gdHJ1ZVxuXG5cdFx0c3VwZXIgXy5kZWZhdWx0cyBvcHRpb25zLFxuXHRcdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cdFxuXHQjIHB1YmxpYyBmdW5jdGlvbnNcblxuXG5cdCMgbm90aWZ5IGFsbCBzdWJqZWN0c1xuXHRub3RpZnlTdWJqZWN0czogKGZ1bmMgPSBAX2RlZmF1bHROb3RpZnkpIC0+IGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX3N1YmplY3RzXG5cblx0IyBub3RpZnkgZm9jdXNlZCBzdWJqZWN0c1xuXHRub3RpZnlGb2N1c2VkU3ViamVjdHM6IChmdW5jID0gQF9kZWZhdWx0Rm9jdXMpIC0+IGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX2ZvY3VzZWRTdWJqZWN0c1xuXHRcblx0IyBub3RpZnkgdW5mb2N1c2VkIHN1YmplY3RzXG5cdG5vdGlmeVVuZm9jdXNlZFN1YmplY3RzOiAoZnVuYyA9IEBfZGVmYXVsdFVuZm9jdXMpIC0+IGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX3VuZm9jdXNlZFN1YmplY3RzXG5cdFxuXHQjIG5vdGlmeSBhIHNwZWNpZmljIHNldCBvZiBzdWJqZWN0cyAoVE9ETzogcmVtb3ZlPylcblx0bm90aWZ5U2VsZWN0ZWQ6IChzdWJqZWN0cyA9IEBfc3ViamVjdHMsIGZ1bmMgPSBAX2RlZmF1bHROb3RpZnkpIC0+IFxuXHRcdGlmIHR5cGVvZiBzdWJqZWN0cyBpcyAnb2JqZWN0JyB0aGVuIHN1YmplY3RzID0gW3N1YmplY3RzXVxuXHRcdGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX3N1YmplY3RzXG5cblx0IyBnZXQgd2hldGhlciBhIHN1YmplY3QgaXMgZm9jdXNlZCBvciB1bmZvY3VzZWRcblx0aXNGb2N1c2VkOiAoc3ViamVjdCkgLT4gcmV0dXJuIEBfaXNGb2N1c2VkKHN1YmplY3QpXG5cblx0IyBzZXQgYSBzcGVjaWZpYyBzdWJqZWN0IGFzIGZvY3VzZWQgb3IgdW5mb2N1c2VkXG5cdHNldEZvY3VzZWQ6IChzdWJqZWN0LCBib29sID0gdHJ1ZSwgaW5zdGFudCA9IGZhbHNlKSAtPiBAX3NldEZvY3VzZWQoc3ViamVjdCwgYm9vbCwgaW5zdGFudClcblxuXHQjIGZvY3VzIGFsbCB1bmZvY3VzZWQgc3ViamVjdHNcblx0Zm9jdXNBbGw6IChpbnN0YW50ID0gZmFsc2UpIC0+IEBfc2V0Rm9jdXNlZChzdWJqZWN0LCB0cnVlLCBpbnN0YW50KSBmb3Igc3ViamVjdCBpbiBAX3VuZm9jdXNlZFN1YmplY3RzXG5cblx0IyB1bmZvY3VzIGFsbCBmb2N1c2VkIHN1YmplY3RzXG5cdHVuZm9jdXNBbGw6IChpbnN0YW50ID0gZmFsc2UpIC0+IEBfc2V0Rm9jdXNlZChzdWJqZWN0LCBmYWxzZSwgaW5zdGFudCkgZm9yIHN1YmplY3QgaW4gQF9mb2N1c2VkU3ViamVjdHNcblxuXHQjIGFkZCBhIGZvY3VzIGV2ZW50IHRvIGEgc3ViamVjdFxuXHRhZGRUcmlnZ2VyOiAoc3ViamVjdCwgZXZlbnROYW1lID0gQF90cmlnZ2VyKSAtPiBzdWJqZWN0Lm9uIEV2ZW50c1tldmVudE5hbWVdLCA9PlxuXHRcdHJldHVybiBpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyB0cnVlIGFuZCBAX3RvZ2dsZSBpcyBmYWxzZVxuXHRcdEBfc2V0Rm9jdXNlZChzdWJqZWN0LCB0cnVlKVxuXHRcblx0IyByZW1vdmUgYSBmb2N1cyBldmVudCBmcm9tIGEgc3ViamVjdFxuXHRyZW1vdmVUcmlnZ2VyOiAoc3ViamVjdCwgZXZlbnROYW1lID0gQF90cmlnZ2VyKSAtPiBzdWJqZWN0Lm9mZiBFdmVudHNbZXZlbnROYW1lXSwgPT5cblx0XHRyZXR1cm4gaWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgdHJ1ZSBhbmQgQF90b2dnbGUgaXMgZmFsc2Vcblx0XHRAX3NldEZvY3VzZWQoc3ViamVjdCwgdHJ1ZSlcblxuXHQjIGFkZCBhIGZvY3VzIGV2ZW50IGZyb20gYSBzdWJqZWN0XG5cdGFkZFJlbGVhc2U6IChzdWJqZWN0LCBldmVudE5hbWUgPSBAX3JlbGVhc2UpIC0+IHN1YmplY3Qub24gRXZlbnRzW2V2ZW50TmFtZV0sID0+XG5cdFx0cmV0dXJuIGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIGZhbHNlXG5cdFx0QF9zZXRGb2N1c2VkKHN1YmplY3QsIGZhbHNlKVxuXG5cdCMgcmVtb3ZlIGEgZm9jdXMgZXZlbnQgZnJvbSBhIHN1YmplY3Rcblx0cmVtb3ZlUmVsZWFzZTogKHN1YmplY3QsIGV2ZW50TmFtZSA9IEBfdHJpZ2dlcikgLT4gc3ViamVjdC5vZmYgRXZlbnRzW2V2ZW50TmFtZV0sID0+XG5cdFx0cmV0dXJuIGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIGZhbHNlXG5cdFx0QF9zZXRGb2N1c2VkKHN1YmplY3QsIHRydWUpXG5cdFxuXHQjIGdldCB3aGV0aGVyIGEgbGF5ZXIgaXMgYSBzdWJqZWN0IG9mIHRoaXMgRm9jdXNDb21wb25lbnRcblx0aXNTdWJqZWN0OiAobGF5ZXIpIC0+IHJldHVybiBfaXNTdWJqZWN0KGxheWVyKVxuXG5cdCMgYWRkIGEgbmV3IHN1YmplY3QgdG8gdGhpcyBGb2N1c0NvbXBvbmVudFxuXHRhZGRTdWJqZWN0OiAobmV3U3ViamVjdCwgb3B0aW9ucyA9IHt9KSAtPlxuXHRcdHRyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXIgPyBAX3RyaWdnZXJcblx0XHRyZWxlYXNlID0gb3B0aW9ucy5yZWxlYXNlID8gQF9yZWxlYXNlXG5cdFx0Zm9jdXNlZCA9IG9wdGlvbnMuZm9jdXNlZCA/IGZhbHNlXG5cdFx0Zm9jdXNlZFN0YXRlID0gb3B0aW9ucy5mb2N1c2VkU3RhdGUgPyBuZXdTdWJqZWN0LnN0YXRlcz8uZm9jdXNlZFxuXHRcdHVuZm9jdXNlZFN0YXRlID0gb3B0aW9ucy51bmZvY3VzZWRTdGF0ZSA/IG5ld1N1YmplY3Quc3RhdGVzPy51bmZvY3VzZWRcblxuXHRcdCMgdGhyb3cgYW4gZXJyb3IgaWYgbGF5ZXIgaXNuJ3QgYSBsYXllclxuXHRcdGlmIG5ld1N1YmplY3QgaW5zdGFuY2VvZiBMYXllciBpcyBmYWxzZSB0aGVuIHRocm93IFwiT2JzZXJ2ZXIgY2FuIG9ubHkgYWRkIGxheWVycyB0byBpdHMgbGlzdCBvZiBzdWJqZWN0cy4gI3tuZXdTdWJqZWN0fSwgaWQgI3tuZXdTdWJqZWN0LmlkfSBpcyBub3QgYSBsYXllci5cIlxuXG5cdFx0IyBzZXQgZXZlbnQgdHJpZ2dlciAoZXZlbnQgbmFtZSBwcm92aWRlZCBpbiBvcHRpb25zIG9yIGRlZmF1bHQgZXZlbnQgbmFtZSlcblx0XHRAYWRkVHJpZ2dlcihuZXdTdWJqZWN0LCB0cmlnZ2VyKVxuXHRcdGlmIHJlbGVhc2U/IHRoZW4gQGFkZFJlbGVhc2UobmV3U3ViamVjdCwgcmVsZWFzZSlcblxuXHRcdCMgc2V0IGZvY3VzZWQgLyB1bmZvY3VzZWQgbGF5ZXIgc3RhdGVzIChzdGF0ZXMgcHJvdmlkZWQgaW4gb3B0aW9ucywgb3IgZXhpc3Rpbmcgc3RhdGVzIG9yIGRlZmF1bHQgc3RhdGVzKVxuXHRcdG5ld1N1YmplY3Quc3RhdGVzW1wiX2ZvY3VzZWQje0BfdW5pcUlkfVwiXSA9IGZvY3VzZWRTdGF0ZSA/IEBfZGVmYXVsdEZvY3VzZWRcblx0XHRuZXdTdWJqZWN0LnN0YXRlc1tcIl91bmZvY3VzZWQje0BfdW5pcUlkfVwiXSA9IHVuZm9jdXNlZFN0YXRlID8gQF9kZWZhdWx0VW5mb2N1c2VkID8gbmV3U3ViamVjdC5zdGF0ZXMuZGVmYXVsdFxuXG5cdFx0IyBzdG9yZSByZWZlcmVuY2UgdG8gdGhpcyBGb2N1c0NvbXBvbmVudFxuXHRcdG5ld1N1YmplY3RbQG5hbWVdID0gQFxuXG5cdFx0IyBhZGQgbGF5ZXIgdG8gc3ViamVjdHMgYXJyYXlcblx0XHRAX3N1YmplY3RzLnB1c2gobmV3U3ViamVjdClcblxuXHRcdCMgaWYgdGhpcyBzdWJqZWN0IHNob3VsZCBzdGFydCBhcyBmb2N1c2VkLCBzZXQgaXQgYXMgZm9jdXNlZFxuXHRcdGlmIGZvY3VzZWQgaXMgdHJ1ZSB0aGVuIEBfc2V0Rm9jdXNlZChuZXdTdWJqZWN0LCBmb2N1c2VkLCB0cnVlKVxuXHRcdGVsc2UgIyBjcmVhdGUgdW5mb2N1c2VkIGVmZmVjdHNcblx0XHRcdGlmIEBfdXNlRm9jdXNTdGF0ZXMgaXMgdHJ1ZSB0aGVuIG5ld1N1YmplY3Quc3RhdGVTd2l0Y2goXCJfdW5mb2N1c2VkI3tAX3VuaXFJZH1cIilcblx0XHRcdCMgc2tpcCB0aGlzICMgaWYgQF91c2VGb2N1c0Z1bmN0aW9ucyBpcyB0cnVlIHRoZW4gQF91bmZvY3VzKG5ld1N1YmplY3QpXG5cblx0XHQjIGVtaXQgYW4gZXZlbnQgb24gRm9jdXNDb21wb25lbnRcblx0XHRAZW1pdChcImNoYW5nZTpzdWJqZWN0c1wiLCBuZXdTdWJqZWN0LCBAX3N1YmplY3RzKVxuXG5cdCMgcmVtb3ZlIGEgc3ViamVjdCBmcm9tIHRoaXMgRm9jdXNDb21wb25lbnRcblx0cmVtb3ZlU3ViamVjdDogKHN1YmplY3QpIC0+XG5cblx0XHQjIHRocm93IGEgd2FybmluZyB3aGVuIHRyeWluZyB0byByZW1vdmUgYSBsYXllciBpc24ndCBhIHN1YmplY3Rcblx0XHRpZiBfLmluY2x1ZGVzKEBfc3ViamVjdHMsIHN1YmplY3QpIGlzIGZhbHNlXG5cdFx0XHRpZiBzdWJqZWN0IGluc3RhbmNlb2YgTGF5ZXIgaXMgdHJ1ZSB0aGVuIHRocm93IFwiVGhhdCBsYXllciAoI3tsYXllci5uYW1lID8gbGF5ZXJ9LCBpZDogI3tsYXllci5pZH0pIGlzbid0IGEgc3ViamVjdC5cIlxuXHRcdFx0IyB0aHJvdyBhIG1vcmUgZGVzY3JpcHRpdmUgZXJyb3IgaWYgdGhlIGxheWVyIGlzbid0IGEgbGF5ZXIuXG5cdFx0XHRlbHNlIHRocm93IFwiVGhhdCBpc24ndCBhIGxheWVyLiBPYnNlcnZlciBjYW4gb25seSByZW1vdmUgbGF5ZXJzIHRoYXQgYXJlIG9uIGl0cyBsaXN0IG9mIHN1YmplY3QgbGF5ZXJzLlwiXG5cdFx0XG5cdFx0aWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgdGhlbiBAX3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCwgZmFsc2UpXG5cblx0XHQjIHJlbW92ZSByZWZlcmVuY2UgdG8gdGhpcyBGb2N1c0NvbXBvbmVudFxuXHRcdHN1YmplY3RbQG5hbWVdID0gQFxuXG5cdFx0IyByZW1vdmUgZnJvbSBsaXN0IG9mIHN1YmplY3RzXG5cdFx0Xy5wdWxsKEBfc3ViamVjdHMsIHN1YmplY3QpXG5cdFx0IyByZW1vdmUgZm9jdXNDb21wb25lbnQgdHJpZ2dlciAoVE9ETzogcmVtb3ZlIGFsbCBhZGRlZCB0cmlnZ2Vycywgbm90IGp1c3QgbW9zdCByZWNlbnQpXG5cdFx0QHJlbW92ZVRyaWdnZXIoc3ViamVjdClcblx0XHRpZiBAX3JlbGVhc2U/IHRoZW4gQHJlbW92ZVJlbGVhc2Uoc3ViamVjdClcblxuXHRcdCMgZW1pdCBhbiBldmVudCBvbiBGb2N1c0NvbXBvbmVudFxuXHRcdEBlbWl0KFwiY2hhbmdlOnN1YmplY3RzXCIsIHN1YmplY3QsIEBfc3ViamVjdHMpXG5cblxuXHQjIHB1YmxpYyBwcm9wZXJ0aWVzXG5cblx0QGRlZmluZSBcInRyaWdnZXJcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3RyaWdnZXJcblx0XHRzZXQ6IChldmVudE5hbWUpIC0+XG5cdFx0XHRpZiB0eXBlb2YgZXZlbnROYW1lIGlzbnQgJ3N0cmluZycgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LnRyaWdnZXIgcmVxdWlyZXMgYW4gZXZlbnQgbmFtZSBhcyBzdHJpbmcsIGxpa2UgJ1RhcCcgb3IgJ01vdXNlT3ZlcicuXCJcblx0XHRcdCMgc2V0IHRyaWdnZXIgYXMgZGVmYXVsdCB0cmlnZ2VyLCB0byBiZSBnaXZlbiB0byBhbGwgbmV3IHN1YmplY3RzXG5cdFx0XHRAX3RyaWdnZXIgPSBldmVudE5hbWUgXG5cblxuXHRAZGVmaW5lIFwibm90aWZ5XCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9kZWZhdWx0Tm90aWZ5XG5cdFx0c2V0OiAoZnVuYykgLT5cblx0XHRcdGlmIHR5cGVvZiBmdW5jIGlzbnQgJ2Z1bmN0aW9uJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQubm90aWZ5IHJlcXVpcmVzIGEgZnVuY3Rpb24gdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF9kZWZhdWx0Tm90aWZ5ID0gZnVuY1xuXG5cblx0QGRlZmluZSBcIm5vdGlmeU9uRm9jdXNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX25vdGlmeU9uRm9jdXNcblx0XHRzZXQ6IChib29sKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGJvb2wgaXNudCAnYm9vbGVhbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50Lm5vdGlmeU9uRm9jdXMgcmVxdWlyZXMgYSBib29sZWFuICh0cnVlIG9yIGZhbHNlKSB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBub3RpZnksIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YmplY3RzXG5cdFx0XHRAX25vdGlmeU9uRm9jdXMgPSBib29sXG5cblxuXHRAZGVmaW5lIFwibWF4Rm9jdXNlZFwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfbWF4Rm9jdXNlZFxuXHRcdHNldDogKG51bWJlcikgLT5cblx0XHRcdGlmIHR5cGVvZiBudW1iZXIgaXNudCAnbnVtYmVyJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQubWF4Rm9jdXNlZCByZXF1aXJlcyBhIG51bWJlciB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBub3RpZnksIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YmplY3RzXG5cdFx0XHRAX21heEZvY3VzZWQgPSBudW1iZXJcblxuXG5cdEBkZWZpbmUgXCJ0b2dnbGVMb2NrXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF90b2dnbGVMb2NrXG5cdFx0c2V0OiAoYm9vbCkgLT5cblx0XHRcdGlmIHR5cGVvZiBib29sIGlzbnQgJ2Jvb2xlYW4nIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC50b2dnbGVMb2NrIHJlcXVpcmVzIGEgYm9vbGVhbiAodHJ1ZSBvciBmYWxzZSkgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF90b2dnbGVMb2NrID0gYm9vbFxuXG5cblx0QGRlZmluZSBcInVzZUZvY3VzRnVuY3Rpb25zXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF91c2VGb2N1c0Z1bmN0aW9uc1xuXHRcdHNldDogKGJvb2wpIC0+XG5cdFx0XHRpZiB0eXBlb2YgYm9vbCBpc250ICdib29sZWFuJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQudXNlRm9jdXNGdW5jdGlvbnMgcmVxdWlyZXMgYSBib29sZWFuICh0cnVlIG9yIGZhbHNlKSB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBub3RpZnksIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YmplY3RzXG5cdFx0XHRAX3VzZUZvY3VzRnVuY3Rpb25zID0gYm9vbFxuXG5cblx0IyBnZXQgY3VycmVudCBkZWZhdWx0IGZvY3VzIGZ1bmN0aW9uLCB1c2VkIGJ5IGFsbCBzdWJqZWN0cywgb3Igc2V0IGEgbmV3IG9uZVxuXHRAZGVmaW5lIFwiZm9jdXNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2RlZmF1bHRGb2N1c1xuXHRcdHNldDogKGZ1bmMpIC0+IFxuXHRcdFx0aWYgdHlwZW9mIGZ1bmMgaXNudCAnZnVuY3Rpb24nIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC5mb2N1cyByZXF1aXJlcyBhIGZ1bmN0aW9uIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IGZvY3VzLCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0cyB3aGVuIGZvY3VzZWRcblx0XHRcdEBfZGVmYXVsdEZvY3VzID0gZnVuY1xuXG5cblx0IyBnZXQgY3VycmVudCBkZWZhdWx0IHVuZm9jdXMgZnVuY3Rpb24sIHVzZWQgYnkgYWxsIHN1YmplY3RzLCBvciBzZXQgYSBuZXcgb25lXG5cdEBkZWZpbmUgXCJ1bmZvY3VzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9kZWZhdWx0VW5mb2N1c1xuXHRcdHNldDogKGZ1bmMpIC0+IFxuXHRcdFx0aWYgdHlwZW9mIGZ1bmMgaXNudCAnZnVuY3Rpb24nIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC51bmZvY3VzIHJlcXVpcmVzIGEgZnVuY3Rpb24gdmFsdWUuXCJcblx0XHRcdFxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCB1bmZvY3VzLCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0cyB3aGVuIHVuZm9jdXNlZFxuXHRcdFx0QF9kZWZhdWx0VW5mb2N1cyA9IGZ1bmNcblxuXG5cdCMgZ2V0IGN1cnJlbnQgZm9jdXNlZCBzdWJqZWN0cyBvciBzZXQgZm9jdXNlZCBzdWJqZWN0c1xuXHRAZGVmaW5lIFwiZm9jdXNlZFwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZm9jdXNlZFN1YmplY3RzXG5cdFx0c2V0OiAoc3ViamVjdCwgYm9vbCA9IGZhbHNlKSAtPlxuXHRcdFx0IyBhY2NlcHRzIGFycmF5cywgc28gbWFrZSBhbiBhcnJheSBpZiBub3QgZ2l2ZW4gb25lXG5cdFx0XHRpZiBfLmlzQXJyYXkoc3ViamVjdHMpIGlzIGZhbHNlIHRoZW4gc3ViamVjdHMgPSBbc3ViamVjdHNdXG5cblx0XHRcdCMgZm9jdXMgb24gYW55IG9mIHRoZSBsYXllcnMgdGhhdCBhcmVuJ3QgZm9jdXNlZCBhbHJlYWR5XG5cdFx0XHRzdWJqZWN0cy5mb3JFYWNoIChzdWJqZWN0KSA9PiBcblx0XHRcdFx0c3dpdGNoIEBfaXNGb2N1c2VkKHN1YmplY3QpIFxuXHRcdFx0XHRcdHdoZW4gdW5kZWZpbmVkIHRoZW4gdGhyb3cgJ0ZvY3VzQ29tcG9uZXQuZm9jdXNlZCByZXF1aXJlcyBzdWJqZWN0cyB0byBzZXQgYXMgZm9jdXNlZC4nXG5cdFx0XHRcdFx0d2hlbiBmYWxzZSB0aGVuIEBfYWRkVG9Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCwgYm9vbClcblxuXG5cdCMgZ2V0IGN1cnJlbnQgdW5mb2N1c2VkIHN1YmplY3RzXG5cdEBkZWZpbmUgXCJ1bmZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBfLndpdGhvdXQoQF9zdWJqZWN0cywgQF9mb2N1c2VkU3ViamVjdHMpXG5cdFx0c2V0OiAoc3ViamVjdHMsIGJvb2wgPSBmYWxzZSkgLT5cblx0XHRcdCMgYWNjZXB0cyBhcnJheXMsIHNvIG1ha2UgYW4gYXJyYXkgaWYgbm90IGdpdmVuIG9uZVxuXHRcdFx0aWYgXy5pc0FycmF5KHN1YmplY3RzKSBpcyBmYWxzZSB0aGVuIHN1YmplY3RzID0gW3N1YmplY3RzXVxuXG5cdFx0XHQjIHVuZm9jdXMgYW55IG9mIHRoZSBzdWJqZWN0cyB0aGF0IGFyZSBmb2N1c2VkXG5cdFx0XHRzdWJqZWN0cy5mb3JFYWNoIChzdWJqZWN0KSA9PiBcblx0XHRcdFx0c3dpdGNoIEBfaXNGb2N1c2VkKHN1YmplY3QpIFxuXHRcdFx0XHRcdHdoZW4gdW5kZWZpbmVkIHRoZW4gdGhyb3cgJ0ZvY3VzQ29tcG9uZXQudW5mb2N1c2VkIHJlcXVpcmVzIHN1YmplY3RzIHRvIHNldCBhcyB1bmZvY3VzZWQuJ1xuXHRcdFx0XHRcdHdoZW4gdHJ1ZSB0aGVuIEBfcmVtb3ZlRnJvbUZvY3VzZWRTdWJqZWN0cyhzdWJqZWN0LCBib29sKVxuXG5cblx0QGRlZmluZSBcInVzZUZvY3VzU3RhdGVzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF91c2VGb2N1c1N0YXRlc1xuXHRcdHNldDogKGJvb2wpIC0+IFxuXHRcdFx0aWYgdHlwZW9mIGJvb2wgaXNudCAnYm9vbGVhbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LnVzZUZvY3VzU3RhdGVzIHJlcXVpcmVzIGEgYm9vbGVhbiB2YWx1ZS5cIlxuXHRcdFx0QF91c2VGb2N1c1N0YXRlcyA9IGJvb2xcblxuXG5cdCMgZ2V0IG9yIHNldCB0aGUgYXJyYXkgb2Ygc3ViamVjdHMgKCBuZWVkcyB3b3JrIClcblx0QGRlZmluZSBcInN1YmplY3RzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9zdWJqZWN0c1xuXHRcdHNldDogKGxheWVycykgLT5cblx0XHRcdCMgdGhyb3cgZXJyb3IgaWYgbGF5ZXJzIGlzbnQgYW4gYXJyYXlcblx0XHRcdGlmIF8uaXNBcnJheShsYXllcnMpIGlzIGZhbHNlIG9yIGxheWVycy5sZW5ndGggPCAwIHRoZW4gdGhyb3cgJ1N1YmplY3RzIHJlcXVpcmVzIGFuIGFycmF5LidcblxuXHRcdFx0IyBwcmVzZXJ2ZSBmb2N1c2VkIHN1YmplY3RzIHRoYXQgYXJlIGFsc28gaW5jbHVkZWQgaW4gdGhlIG5ldyBsYXllcnMgYXJyYXlcblx0XHRcdEBfZm9jdXNlZFN1YmplY3RzID0gXy5pbnRlcnNlY3Rpb24oQF9mb2N1c2VkU3ViamVjdHMsIGxheWVycylcblx0XHRcdFxuXHRcdFx0IyByZW1vdmUgZXhpc3Rpbmcgc3ViamVjdHMgdGhhdCBhcmUgbm90IG9uIHRoZSBuZXcgbGlzdFxuXHRcdFx0YWRpb3NTdWJqZWN0cyA9IF8uZGlmZmVyZW5jZShAX3N1YmplY3RzLCBsYXllcnMpXG5cdFx0XHRAcmVtb3ZlU3ViamVjdChzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBhZGlvc1N1YmplY3RzXG5cdFx0XG5cdFx0XHQjIGRlZmluZSBuZXcgc3ViamVjdHNcblx0XHRcdEBhZGRTdWJqZWN0KGxheWVyKSBmb3IgbGF5ZXIgaW4gbGF5ZXJzXG5cblx0XHRcdCMgcmVtb3ZlIGZvY3VzZWQgc3ViamVjdCBpZiBuZXcgc3ViamVjdHMgZG9lc24ndCBpbmNsdWRlIGl0XG5cdFx0XHRpZiBub3QgXy5pbmNsdWRlcyhAX3N1YmplY3RzLCBAX2ZvY3VzZWRTdWJqZWN0KVxuXHRcdFx0XHRAX2ZvY3VzZWRTdWJqZWN0ID0gdW5kZWZpbmVkXG5cblxuXHQjIHByaXZhdGUgZnVuY3Rpb25zXG5cblxuXHQjIHJ1biBmb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRfZm9jdXM6IChzdWJqZWN0KSAtPiBkbyBfLmJpbmQoQF9kZWZhdWx0Rm9jdXMsIHN1YmplY3QpXG5cblxuXHQjIHJ1biB1bmZvY3VzIGZ1bmN0aW9uIGZvciBzdWJqZWN0XG5cdF91bmZvY3VzOiAoc3ViamVjdCkgLT4gZG8gXy5iaW5kKEBfZGVmYXVsdFVuZm9jdXMsIHN1YmplY3QpXG5cblxuXHQjIHNldCBmb2N1c2VkIHN0YXRlIG9mIGEgc3ViamVjdFxuXHRfc2V0Rm9jdXNlZDogKHN1YmplY3QsIGJvb2w9dHJ1ZSwgaW5zdGFudCA9IGZhbHNlKSAtPlxuXHRcdCMgaWYgdGhlIHN1YmplY3QncyBmb2N1cyBzdGF0ZSBzaG91bGQgYmUgZm9jdXNlZC4uLlxuXHRcdGlmIGJvb2wgaXMgdHJ1ZVxuXHRcdFx0IyBpZiBzdWJqZWN0IGlzIGFscmVhZHkgZm9jdXNlZC4uLlxuXHRcdFx0aWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgdHJ1ZVxuXHRcdFx0XHQjIGlmIHRvZ2dsZSBtb2RlIGlzIG9uLCB1bmZvY3VzIHRoZSBzdWJqZWN0XG5cdFx0XHRcdGlmIEBfdG9nZ2xlIGlzIHRydWUgdGhlbiBAX3NldEZvY3VzZWQoc3ViamVjdCwgZmFsc2UsIGluc3RhbnQpXG5cdFx0XHRcdCMgZWl0aGVyIHdheSwgcmV0dXJuXG5cdFx0XHRcdHJldHVybiBudWxsXG5cblx0XHRcdCMgY2FuY2VsIG5ldyBmb2N1cyBpZiB0b2dnbGUgbG9jayBpcyBvblxuXHRcdFx0cmV0dXJuIGlmIF8uc2l6ZShAX2ZvY3VzZWRTdWJqZWN0cykgPj0gQF9tYXhGb2N1c2VkIGFuZCBAX3RvZ2dsZUxvY2sgaXMgdHJ1ZVxuXG5cdFx0XHQjIGlmIHRoZSBzdWJqZWN0IGlzbid0IGFscmVhZHkgZm9jdXNlZCwgYWRkIGl0IHRvIGZvY3VzZWQgc3ViamVjdHNcblx0XHRcdEBfYWRkVG9Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCwgaW5zdGFudClcblx0XHRcdFxuXHRcdFx0IyBlbWl0IGFuIGV2ZW50IG9uIHRoZSBzdWJqZWN0XG5cdFx0XHRzdWJqZWN0LmVtaXQoXCJjaGFuZ2U6Zm9jdXNlZFwiLCBib29sKVxuXHRcdFx0XG5cdFx0XHQjIGFuZCBpZiBmb2N1c2VkIHN0YXRlcyBhcmUgYmVpbmcgdXNlZC4uLlxuXHRcdFx0aWYgQF91c2VGb2N1c1N0YXRlcyBpcyB0cnVlXG5cdFx0XHRcdCMgZWl0aGVyIHN3aXRjaCBvciBhbmltYXRlIHRvIGZvY3VzZWQgc3RhdGUsIGRlcGVuZGluZyBvbiB0aGUgaW5zdGFudCBhcmd1bWVudFxuXHRcdFx0XHRpZiBpbnN0YW50IHRoZW4gc3ViamVjdC5zdGF0ZVN3aXRjaChcIl9mb2N1c2VkI3tAX3VuaXFJZH1cIikgZWxzZSBzdWJqZWN0LmFuaW1hdGUoXCJfZm9jdXNlZCN7QF91bmlxSWR9XCIpXG5cdFx0XHQjIGFuZCBpZiBmb2N1cyBmdW5jdGlvbnMgYXJlIGJlaW5nIHVzZWQuLi4gcnVuIGZvY3VzIGZ1bmN0aW9uIGZvciBzdWJqZWN0XG5cdFx0XHRpZiBAX3VzZUZvY3VzRnVuY3Rpb25zIGlzIHRydWUgdGhlbiBAX2ZvY3VzKHN1YmplY3QpIFxuXG5cdFx0IyBpZiB0aGUgc3ViamVjdCdzIGZvY3VzIHN0YXRlIHNob3VsZCBiZSB1bmZvY3VzZWQuLi5cblx0XHRlbHNlXG5cdFx0XHQjIGlmIHRoZSBzdWJqZWN0IGlzIGFscmVhZHkgdW5mb2N1c2VkLi4uIGRvIG5vdGhpbmdcblx0XHRcdHJldHVybiBpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyBmYWxzZVxuXG5cdFx0XHQjIGlmIHRoZSBzdWJqZWN0IGlzIGZvY3VzZWQsIHJlbW92ZSBpdCBmcm9tIGZvY3VzZWQgc3ViamVjdHNcblx0XHRcdEBfcmVtb3ZlRnJvbUZvY3VzZWRTdWJqZWN0cyhzdWJqZWN0LCBpbnN0YW50KSBcblxuXHRcdFx0IyBlbWl0IGFuIGV2ZW50IG9uIHRoZSBzdWJqZWN0XG5cdFx0XHRzdWJqZWN0LmVtaXQoXCJjaGFuZ2U6Zm9jdXNlZFwiLCBib29sKVxuXG5cdFx0XHQjIGFuZCBpZiBmb2N1c2VkIHN0YXRlcyBhcmUgYmVpbmcgdXNlZC4uLlxuXHRcdFx0aWYgQF91c2VGb2N1c1N0YXRlcyBpcyB0cnVlXG5cdFx0XHRcdCMgZWl0aGVyIHN3aXRjaCBvciBhbmltYXRlIHRvIHRoZSB1bmZvY3VzZWQgc3RhdGUsIGRlcGVuZGluZyBvbiB0aGUgaW5zdGFudCBhcmd1bWVudFxuXHRcdFx0XHRpZiBpbnN0YW50IHRoZW4gc3ViamVjdC5zdGF0ZVN3aXRjaChcIl91bmZvY3VzZWQje0BfdW5pcUlkfVwiKSBlbHNlIHN1YmplY3QuYW5pbWF0ZShcIl91bmZvY3VzZWQje0BfdW5pcUlkfVwiKVxuXHRcdFx0IyBhbmQgaWYgZm9jdXMgZnVuY3Rpb25zIGFyZSBiZWluZyB1c2VkLi4uIHJ1biB0aGUgdW5mb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRcdFx0aWYgQF91c2VGb2N1c0Z1bmN0aW9ucyBpcyB0cnVlIHRoZW4gQF91bmZvY3VzKHN1YmplY3QpXG5cblxuXHQjIGdldCB3aGV0aGVyIGEgc3ViamVjdCBpcyBmb2N1c2VkIG9yIG5vdFxuXHRfaXNGb2N1c2VkOiAoc3ViamVjdCkgLT4gcmV0dXJuIF8uaW5jbHVkZXMoQF9mb2N1c2VkU3ViamVjdHMsIHN1YmplY3QpXG5cblx0IyBnZXQgd2hldGhlciBhIGxheWVyIGlzIGEgc3ViamVjdCBvZiB0aGlzIEZvY3VzQ29tcG9uZW50XG5cdF9pc1N1YmplY3Q6IChsYXllcikgLT4gcmV0dXJuIF8uaW5jbHVkZXMoQF9zdWJqZWN0cywgbGF5ZXIpXG5cblxuXHQjIGFkZCBhIGxheWVyIHRvIGFycmF5IG9mIGZvY3VzZWQgc3ViamVjdHMsIG1ha2luZyByb29tIGlmIG5lY2Vzc2FyeVxuXHRfYWRkVG9Gb2N1c2VkU3ViamVjdHM6IChzdWJqZWN0LCBpbnN0YW50ID0gZmFsc2UpIC0+XG5cdFx0IyB0aHJvdyBhbiBlcnJvciBpZiBhIGZvY3VzZWQgbGF5ZXIgd2FzIHNlbnQgaGVyZVxuXHRcdGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIHRydWUgdGhlbiB0aHJvdyBcIkZvY3VzZWQgb24gYSBmb2N1c2VkIHN1YmplY3QuIElzIHRoYXQgcmlnaHQ/XCJcblxuXHRcdCMgaWYgd2UncmUgYXQgdGhlIGxpbWl0IG9mIG91ciBmb2N1c2VkIHN1YmplY3RzLi4uXG5cdFx0aWYgXy5zaXplKEBfZm9jdXNlZFN1YmplY3RzKSA+PSBAX21heEZvY3VzZWRcblx0XHRcdCMgcmVtb3ZlIHRoZSBzdWJzY3JpYmUgZnJvbSB0aGUgZnJvbnQgb2YgdGhlIGxpc3QgYW5kIHNldCBpdCBhcyB1bmZvY3VzZWRcblx0XHRcdEBfc2V0Rm9jdXNlZChAX2ZvY3VzZWRTdWJqZWN0c1swXSwgZmFsc2UsIGluc3RhbnQpXG5cdFx0XHQjIHJlcGVhdCB1bnRpbCB3ZSBoYXZlIHJvb20gZm9yIGEgbmV3IGZvY3VzZWQgc3ViamVjdFxuXHRcdFx0QF9hZGRUb0ZvY3VzZWRTdWJqZWN0cyhzdWJqZWN0LCBpbnN0YW50KVxuXHRcdFxuXHRcdCMgaWYgKG9yIHdoZW4pIHRoZXJlIGlzIHJvb20uLi5cblx0XHRlbHNlXG5cdFx0XHQjIGFkZCB0aGUgbmV3IGZvY3VzZWQgc3ViamVjdCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0XG5cdFx0XHRAX2ZvY3VzZWRTdWJqZWN0cy5wdXNoKHN1YmplY3QpXG5cblx0XHRcdCMgZW1pdCBhbiBldmVudCBvbiB0aGUgRm9jdXNDb21wb25lbnRcblx0XHRcdEBlbWl0KFwiY2hhbmdlOmZvY3VzZWRcIiwgc3ViamVjdCwgQF9mb2N1c2VkU3ViamVjdHMpXG5cblx0XHRcdCMgbm90aWZ5IHN1YmplY3RzIGlmIFxuXHRcdFx0aWYgQF9ub3RpZnlPbkZvY3VzIGlzIHRydWUgdGhlbiBAbm90aWZ5U3ViamVjdHMoKVxuXG5cblx0IyByZW1vdmUgYSBsYXllciBmcm9tIGFycmF5IG9mIGZvY3VzZWQgc3ViamVjdHNcblx0X3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHM6IChzdWJqZWN0LCBpbnN0YW50ID0gZmFsc2UpIC0+XG5cdFx0IyB0aHJvdyBhbiBlcnJvciBpZiBhIG5vbi1mb2N1c2VkIGxheWVyIHdhcyBzZW50IGhlcmVcblx0XHRpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyBmYWxzZSB0aGVuIHRocm93IFwiVHJpZWQgdG8gcmVtb3ZlIGEgbGF5ZXIgdGhhdCB3YXNuJ3QgZm9jdXNlZC5cIlxuXHRcdFxuXHRcdCMgcmVtb3ZlIHRoZSBmb2N1c2VkIHN1YmplY3RkXG5cdFx0Xy5wdWxsKEBfZm9jdXNlZFN1YmplY3RzLCBzdWJqZWN0KVxuXG5cdFx0IyBlbWl0IGFuIGV2ZW50IG9uIHRoZSBGb2N1c0NvbXBvbmVudFxuXHRcdEBlbWl0KFwiY2hhbmdlOnVuZm9jdXNlZFwiLCBzdWJqZWN0LCBAX3VuZm9jdXNlZFN1YmplY3RzKVxuXHRcblxuXHRcblxuXG5leHBvcnRzLkZvY3VzQ29tcG9uZW50ID0gRm9jdXNDb21wb25lbnRcblxuIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFHQUE7QURBQSxJQUFBLGNBQUE7RUFBQTs7O0FBQU07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
