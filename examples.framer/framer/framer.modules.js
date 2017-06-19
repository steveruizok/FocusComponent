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
      results.push(this._setFocused(subject, false, instant));
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
    var focused, focusedState, ref, ref1, ref2, ref3, ref4, ref5, ref6, trigger, unfocusedState;
    if (options == null) {
      options = {};
    }
    trigger = (ref = options.trigger) != null ? ref : this._trigger;
    focused = (ref1 = options.focused) != null ? ref1 : false;
    focusedState = (ref2 = options.focusedState) != null ? ref2 : (ref3 = newSubject.states) != null ? ref3.focused : void 0;
    unfocusedState = (ref4 = options.unfocusedState) != null ? ref4 : (ref5 = newSubject.states) != null ? ref5.unfocused : void 0;
    if (newSubject instanceof Layer === false) {
      throw "Observer can only add layers to its list of subjects. " + newSubject + ", id " + newSubject.id + " is not a layer.";
    }
    this.addTrigger(newSubject, trigger);
    newSubject.states.focused = focusedState != null ? focusedState : this._defaultFocused;
    newSubject.states.unfocused = (ref6 = unfocusedState != null ? unfocusedState : this._defaultUnfocused) != null ? ref6 : newSubject.states["default"];
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


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXZlcnVpei9HaXRIdWIvRm9jdXNDb21wb25lbnQvZXhhbXBsZXMuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RldmVydWl6L0dpdEh1Yi9Gb2N1c0NvbXBvbmVudC9leGFtcGxlcy5mcmFtZXIvbW9kdWxlcy9Gb2N1c0NvbXBvbmVudC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCJjbGFzcyBGb2N1c0NvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0IyBUaGUgRm9jdXNDb21wb25lbnQgbWF5IGZvY3VzIG9uIG9uZSBvciBtb3JlIHN1YmplY3RzIGF0IGEgdGltZS5cblxuXHRcdEBfc3ViamVjdHMgPSBbXVxuXHRcdEBfZm9jdXNlZFN1YmplY3RzID0gW11cblxuXHRcdEBfbWF4Rm9jdXNlZCA9IG9wdGlvbnMubWF4Rm9jdXNlZCA/IDFcblx0XHRAX3RvZ2dsZSA9IG9wdGlvbnMudG9nZ2xlID8gdHJ1ZVxuXHRcdEBfdG9nZ2xlTG9jayA9IG9wdGlvbnMudG9nZ2xlTG9jayA/IGZhbHNlXG5cdFx0QF90cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyID8gJ1RhcCdcblx0XHRAX2RlZmF1bHRGb2N1c2VkID0gb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQgPyB7b3BhY2l0eTogMX1cblx0XHRAX2RlZmF1bHRVbmZvY3VzZWQgPSBvcHRpb25zLnN0YXRlcz8udW5mb2N1c2VkID8gaWYgb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQ/IHRoZW4gdW5kZWZpbmVkIGVsc2Uge29wYWNpdHk6IC41fVxuXHRcdEBfZGVmYXVsdEZvY3VzID0gb3B0aW9ucy5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0VW5mb2N1cyA9IG9wdGlvbnMudW5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0Tm90aWZ5ID0gb3B0aW9ucy5ub3RpZnkgPyAtPiByZXR1cm4gbnVsbFxuXHRcdEBfbm90aWZ5T25Gb2N1cyA9IG9wdGlvbnMubm90aWZ5T25Gb2N1cyA/IHRydWVcblx0XHRAX3VzZUZvY3VzU3RhdGVzID0gb3B0aW9ucy51c2VGb2N1c1N0YXRlcyA/IHRydWVcblx0XHRAX3VzZUZvY3VzRnVuY3Rpb25zID0gb3B0aW9ucy51c2VGb2N1c0Z1bmN0aW9ucyA/IHRydWVcblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6ICcuJ1xuXHRcdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cdCMgbm90aWZ5IHN1YmplY3RzXG5cdG5vdGlmeUZvY3VzZWRTdWJqZWN0czogKGZ1bmMgPSBAX2RlZmF1bHRGb2N1cykgLT4gZG8gXy5iaW5kKGZ1bmMsIHN1YmplY3QpIGZvciBzdWJqZWN0IGluIEBfZm9jdXNlZFN1YmplY3RzXG5cdFxuXHRub3RpZnlVbmZvY3VzZWRTdWJqZWN0czogKGZ1bmMgPSBAX2RlZmF1bHRVbmZvY3VzKSAtPiBkbyBfLmJpbmQoZnVuYywgc3ViamVjdCkgZm9yIHN1YmplY3QgaW4gQF91bmZvY3VzZWRTdWJqZWN0c1xuXHRcblx0bm90aWZ5U3ViamVjdHM6IChmdW5jID0gQF9kZWZhdWx0Tm90aWZ5KSAtPiBkbyBfLmJpbmQoZnVuYywgc3ViamVjdCkgZm9yIHN1YmplY3QgaW4gQF9zdWJqZWN0c1xuXHRcblx0bm90aWZ5U2VsZWN0ZWQ6IChzdWJqZWN0cyA9IEBfc3ViamVjdHMsIGZ1bmMgPSBAX2RlZmF1bHROb3RpZnkpIC0+IFxuXHRcdGlmIHR5cGVvZiBzdWJqZWN0cyBpcyAnb2JqZWN0JyB0aGVuIHN1YmplY3RzID0gW3N1YmplY3RzXVxuXHRcdGRvIF8uYmluZChmdW5jLCBzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBAX3N1YmplY3RzXG5cblx0IyB1bmZvY3VzIGFsbCBmb2N1c2VkIHN1YmplY3RzXG5cdHVuZm9jdXNBbGw6IChpbnN0YW50ID0gZmFsc2UpIC0+IEBfc2V0Rm9jdXNlZChzdWJqZWN0LCBmYWxzZSwgaW5zdGFudCkgZm9yIHN1YmplY3QgaW4gQF9mb2N1c2VkU3ViamVjdHNcblxuXHQjIHJ1biBmb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRfZm9jdXM6IChzdWJqZWN0KSAtPiBkbyBfLmJpbmQoQF9kZWZhdWx0Rm9jdXMsIHN1YmplY3QpXG5cblx0IyBydW4gdW5mb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRfdW5mb2N1czogKHN1YmplY3QpIC0+IGRvIF8uYmluZChAX2RlZmF1bHRVbmZvY3VzLCBzdWJqZWN0KVxuXG5cdCMgYWRkIG9yIHJlbW92ZSBmb2N1cyB0cmlnZ2VycyB0byBhIHN1YmplY3Rcblx0YWRkVHJpZ2dlcjogKHN1YmplY3QsIGV2ZW50TmFtZSA9IEBfdHJpZ2dlcikgLT4gc3ViamVjdC5vbiBFdmVudHNbZXZlbnROYW1lXSwgPT5cblx0XHRyZXR1cm4gaWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgdHJ1ZSBhbmQgQF90b2dnbGUgaXMgZmFsc2Vcblx0XHRAX3NldEZvY3VzZWQoc3ViamVjdCwgdHJ1ZSlcblx0XG5cdHJlbW92ZVRyaWdnZXI6IChzdWJqZWN0LCBldmVudE5hbWUgPSBAX3RyaWdnZXIpIC0+IHN1YmplY3Qub2ZmIEV2ZW50c1tldmVudE5hbWVdLCA9PlxuXHRcdHJldHVybiBpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyB0cnVlIGFuZCBAX3RvZ2dsZSBpcyBmYWxzZVxuXHRcdEBfc2V0Rm9jdXNlZChzdWJqZWN0LCB0cnVlKVxuXG5cdCMgc2V0IGZvY3VzZWQgc3RhdGUgb2YgYSBzdWJqZWN0XG5cdF9zZXRGb2N1c2VkOiAoc3ViamVjdCwgYm9vbCwgaW5zdGFudCkgLT5cblx0XHQjIGlmIHRoZSBzdWJqZWN0J3MgZm9jdXMgc3RhdGUgc2hvdWxkIGJlIGZvY3VzZWQuLi5cblx0XHRpZiBib29sIGlzIHRydWVcblx0XHRcdCMgaWYgc3ViamVjdCBpcyBhbHJlYWR5IGZvY3VzZWQuLi5cblx0XHRcdGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIHRydWVcblx0XHRcdFx0IyBpZiB0b2dnbGUgbW9kZSBpcyBvbiwgdW5mb2N1cyB0aGUgc3ViamVjdFxuXHRcdFx0XHRpZiBAX3RvZ2dsZSBpcyB0cnVlIHRoZW4gQF9zZXRGb2N1c2VkKHN1YmplY3QsIGZhbHNlLCBpbnN0YW50KVxuXHRcdFx0XHQjIGVpdGhlciB3YXksIHJldHVyblxuXHRcdFx0XHRyZXR1cm4gbnVsbFxuXG5cdFx0XHQjIGNhbmNlbCBuZXcgZm9jdXMgaWYgdG9nZ2xlIGxvY2sgaXMgb25cblx0XHRcdHJldHVybiBpZiBfLnNpemUoQF9mb2N1c2VkU3ViamVjdHMpID49IEBfbWF4Rm9jdXNlZCBhbmQgQF90b2dnbGVMb2NrIGlzIHRydWVcblxuXHRcdFx0IyBpZiB0aGUgc3ViamVjdCBpc24ndCBhbHJlYWR5IGZvY3VzZWQsIGFkZCBpdCB0byBmb2N1c2VkIHN1YmplY3RzXG5cdFx0XHRAX2FkZFRvRm9jdXNlZFN1YmplY3RzKHN1YmplY3QsIGluc3RhbnQpXG5cdFx0XHQjIGFuZCBpZiBmb2N1c2VkIHN0YXRlcyBhcmUgYmVpbmcgdXNlZC4uLlxuXHRcdFx0aWYgQF91c2VGb2N1c1N0YXRlcyBpcyB0cnVlXG5cdFx0XHRcdCMgZWl0aGVyIHN3aXRjaCBvciBhbmltYXRlIHRvIGZvY3VzZWQgc3RhdGUsIGRlcGVuZGluZyBvbiB0aGUgaW5zdGFudCBhcmd1bWVudFxuXHRcdFx0XHRpZiBpbnN0YW50IHRoZW4gc3ViamVjdC5zdGF0ZVN3aXRjaCgnZm9jdXNlZCcpIGVsc2Ugc3ViamVjdC5hbmltYXRlKCdmb2N1c2VkJylcblx0XHRcdCMgYW5kIGlmIGZvY3VzIGZ1bmN0aW9ucyBhcmUgYmVpbmcgdXNlZC4uLiBydW4gZm9jdXMgZnVuY3Rpb24gZm9yIHN1YmplY3Rcblx0XHRcdGlmIEBfdXNlRm9jdXNGdW5jdGlvbnMgaXMgdHJ1ZSB0aGVuIEBfZm9jdXMoc3ViamVjdCkgXG5cblx0XHQjIGlmIHRoZSBzdWJqZWN0J3MgZm9jdXMgc3RhdGUgc2hvdWxkIGJlIHVuZm9jdXNlZC4uLlxuXHRcdGVsc2Vcblx0XHRcdCMgaWYgdGhlIHN1YmplY3QgaXMgYWxyZWFkeSB1bmZvY3VzZWQsIGRvIG5vdGhpbmdcblx0XHRcdHJldHVybiBpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyBmYWxzZVxuXG5cdFx0XHQjIGlmIGl0IGlzLCByZW1vdmUgaXQgZnJvbSBmb2N1c2VkIHN1YmplY3RzXG5cdFx0XHRAX3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCkgXG5cblx0XHRcdCMgYW5kIGlmIGZvY3VzZWQgc3RhdGVzIGFyZSBiZWluZyB1c2VkLi4uXG5cdFx0XHRpZiBAX3VzZUZvY3VzU3RhdGVzIGlzIHRydWVcblx0XHRcdFx0IyBlaXRoZXIgc3dpdGNoIG9yIGFuaW1hdGUgdG8gdGhlIHVuZm9jdXNlZCBzdGF0ZSwgZGVwZW5kaW5nIG9uIHRoZSBpbnN0YW50IGFyZ3VtZW50XG5cdFx0XHRcdGlmIGluc3RhbnQgdGhlbiBzdWJqZWN0LnN0YXRlU3dpdGNoKCd1bmZvY3VzZWQnKSBlbHNlIHN1YmplY3QuYW5pbWF0ZSgndW5mb2N1c2VkJylcblx0XHRcdCMgYW5kIGlmIGZvY3VzIGZ1bmN0aW9ucyBhcmUgYmVpbmcgdXNlZC4uLiBydW4gdGhlIHVuZm9jdXMgZnVuY3Rpb24gZm9yIHN1YmplY3Rcblx0XHRcdGlmIEBfdXNlRm9jdXNGdW5jdGlvbnMgaXMgdHJ1ZSB0aGVuIEBfdW5mb2N1cyhzdWJqZWN0KVxuXG5cdCMgYWRkIGEgbmV3IHN1YmplY3QgdG8gdGhpcyBmb2N1c0NvbXBvbmVudFxuXHRhZGRTdWJqZWN0OiAobmV3U3ViamVjdCwgb3B0aW9ucyA9IHt9KSAtPlxuXHRcdHRyaWdnZXIgPSBvcHRpb25zLnRyaWdnZXIgPyBAX3RyaWdnZXJcblx0XHRmb2N1c2VkID0gb3B0aW9ucy5mb2N1c2VkID8gZmFsc2Vcblx0XHRmb2N1c2VkU3RhdGUgPSBvcHRpb25zLmZvY3VzZWRTdGF0ZSA/IG5ld1N1YmplY3Quc3RhdGVzPy5mb2N1c2VkXG5cdFx0dW5mb2N1c2VkU3RhdGUgPSBvcHRpb25zLnVuZm9jdXNlZFN0YXRlID8gbmV3U3ViamVjdC5zdGF0ZXM/LnVuZm9jdXNlZFxuXG5cdFx0IyB0aHJvdyBhbiBlcnJvciBpZiBsYXllciBpc24ndCBhIGxheWVyXG5cdFx0aWYgbmV3U3ViamVjdCBpbnN0YW5jZW9mIExheWVyIGlzIGZhbHNlIHRoZW4gdGhyb3cgXCJPYnNlcnZlciBjYW4gb25seSBhZGQgbGF5ZXJzIHRvIGl0cyBsaXN0IG9mIHN1YmplY3RzLiAje25ld1N1YmplY3R9LCBpZCAje25ld1N1YmplY3QuaWR9IGlzIG5vdCBhIGxheWVyLlwiXG5cblx0XHQjIHNldCBldmVudCB0cmlnZ2VyIChldmVudCBuYW1lIHByb3ZpZGVkIGluIG9wdGlvbnMgb3IgZGVmYXVsdCBldmVudCBuYW1lKVxuXHRcdEBhZGRUcmlnZ2VyKG5ld1N1YmplY3QsIHRyaWdnZXIpXG5cblx0XHQjIHNldCBmb2N1c2VkIC8gdW5mb2N1c2VkIGxheWVyIHN0YXRlcyAoc3RhdGVzIHByb3ZpZGVkIGluIG9wdGlvbnMsIG9yIGV4aXN0aW5nIHN0YXRlcyBvciBkZWZhdWx0IHN0YXRlcylcblx0XHRuZXdTdWJqZWN0LnN0YXRlcy5mb2N1c2VkID0gZm9jdXNlZFN0YXRlID8gQF9kZWZhdWx0Rm9jdXNlZFxuXHRcdG5ld1N1YmplY3Quc3RhdGVzLnVuZm9jdXNlZCA9IHVuZm9jdXNlZFN0YXRlID8gQF9kZWZhdWx0VW5mb2N1c2VkID8gbmV3U3ViamVjdC5zdGF0ZXMuZGVmYXVsdFxuXG5cdFx0IyBhZGQgbGF5ZXIgdG8gc3ViamVjdHMgYXJyYXlcblx0XHRAX3N1YmplY3RzLnB1c2gobmV3U3ViamVjdClcblxuXHRcdCMgaWYgdGhpcyBzdWJqZWN0IHNob3VsZCBzdGFydCBhcyBmb2N1c2VkLCBzZXQgaXQgYXMgZm9jdXNlZFxuXHRcdEBfc2V0Rm9jdXNlZChuZXdTdWJqZWN0LCBmb2N1c2VkLCB0cnVlKVxuXHRcdGlmIEBfdXNlRm9jdXNTdGF0ZXMgaXMgdHJ1ZSB0aGVuIG5ld1N1YmplY3Quc3RhdGVTd2l0Y2goJ3VuZm9jdXNlZCcpXG5cdFx0aWYgQF91c2VGb2N1c0Z1bmN0aW9ucyBpcyB0cnVlIHRoZW4gQF91bmZvY3VzKG5ld1N1YmplY3QpXG5cblxuXHQjIHJlbW92ZSBhIHN1YmplY3QgZnJvbSB0aGlzIGZvY3VzQ29tcG9uZW50XG5cdHJlbW92ZVN1YmplY3Q6IChzdWJqZWN0KSAtPlxuXG5cdFx0IyB0aHJvdyBhIHdhcm5pbmcgd2hlbiB0cnlpbmcgdG8gcmVtb3ZlIGEgbGF5ZXIgaXNuJ3QgYSBzdWJqZWN0XG5cdFx0aWYgXy5pbmNsdWRlcyhAX3N1YmplY3RzLCBzdWJqZWN0KSBpcyBmYWxzZVxuXHRcdFx0aWYgc3ViamVjdCBpbnN0YW5jZW9mIExheWVyIGlzIHRydWUgdGhlbiB0aHJvdyBcIlRoYXQgbGF5ZXIgKCN7bGF5ZXIubmFtZSA/IGxheWVyfSwgaWQ6ICN7bGF5ZXIuaWR9KSBpc24ndCBhIHN1YmplY3QuXCJcblx0XHRcdCMgdGhyb3cgYSBtb3JlIGRlc2NyaXB0aXZlIGVycm9yIGlmIHRoZSBsYXllciBpc24ndCBhIGxheWVyLlxuXHRcdFx0ZWxzZSB0aHJvdyBcIlRoYXQgaXNuJ3QgYSBsYXllci4gT2JzZXJ2ZXIgY2FuIG9ubHkgcmVtb3ZlIGxheWVycyB0aGF0IGFyZSBvbiBpdHMgbGlzdCBvZiBzdWJqZWN0IGxheWVycy5cIlxuXHRcdFxuXHRcdGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIHRoZW4gQF9yZW1vdmVGcm9tRm9jdXNlZFN1YmplY3RzKHN1YmplY3QsIGZhbHNlKVxuXG5cdFx0IyByZW1vdmUgZnJvbSBsaXN0IG9mIHN1YmplY3RzXG5cdFx0Xy5wdWxsKEBfc3ViamVjdHMsIHN1YmplY3QpXG5cdFx0IyByZW1vdmUgZm9jdXNDb21wb25lbnQgdHJpZ2dlciAoVE9ETzogcmVtb3ZlIGFsbCBhZGRlZCB0cmlnZ2Vycywgbm90IGp1c3QgbW9zdCByZWNlbnQpXG5cdFx0QHJlbW92ZVRyaWdnZXIoc3ViamVjdClcblxuXG5cdEBkZWZpbmUgXCJ0cmlnZ2VyXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF90cmlnZ2VyXG5cdFx0c2V0OiAoZXZlbnROYW1lKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGV2ZW50TmFtZSBpc250ICdzdHJpbmcnIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC50cmlnZ2VyIHJlcXVpcmVzIGFuIGV2ZW50IG5hbWUgYXMgc3RyaW5nLCBsaWtlICdUYXAnIG9yICdNb3VzZU92ZXInLlwiXG5cdFx0XHQjIHNldCB0cmlnZ2VyIGFzIGRlZmF1bHQgdHJpZ2dlciwgdG8gYmUgZ2l2ZW4gdG8gYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF90cmlnZ2VyID0gZXZlbnROYW1lIFxuXG5cblx0QGRlZmluZSBcIm5vdGlmeVwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdE5vdGlmeVxuXHRcdHNldDogKGZ1bmMpIC0+XG5cdFx0XHRpZiB0eXBlb2YgZnVuYyBpc250ICdmdW5jdGlvbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50Lm5vdGlmeSByZXF1aXJlcyBhIGZ1bmN0aW9uIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfZGVmYXVsdE5vdGlmeSA9IGZ1bmNcblxuXG5cdEBkZWZpbmUgXCJub3RpZnlPbkZvY3VzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9ub3RpZnlPbkZvY3VzXG5cdFx0c2V0OiAoYm9vbCkgLT5cblx0XHRcdGlmIHR5cGVvZiBib29sIGlzbnQgJ2Jvb2xlYW4nIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC5ub3RpZnlPbkZvY3VzIHJlcXVpcmVzIGEgYm9vbGVhbiAodHJ1ZSBvciBmYWxzZSkgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF9ub3RpZnlPbkZvY3VzID0gYm9vbFxuXG5cblx0QGRlZmluZSBcIm1heEZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX21heEZvY3VzZWRcblx0XHRzZXQ6IChudW1iZXIpIC0+XG5cdFx0XHRpZiB0eXBlb2YgbnVtYmVyIGlzbnQgJ251bWJlcicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50Lm1heEZvY3VzZWQgcmVxdWlyZXMgYSBudW1iZXIgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF9tYXhGb2N1c2VkID0gbnVtYmVyXG5cblxuXHRAZGVmaW5lIFwidG9nZ2xlTG9ja1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdG9nZ2xlTG9ja1xuXHRcdHNldDogKGJvb2wpIC0+XG5cdFx0XHRpZiB0eXBlb2YgYm9vbCBpc250ICdib29sZWFuJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQudG9nZ2xlTG9jayByZXF1aXJlcyBhIGJvb2xlYW4gKHRydWUgb3IgZmFsc2UpIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfdG9nZ2xlTG9jayA9IGJvb2xcblxuXG5cdEBkZWZpbmUgXCJ1c2VGb2N1c0Z1bmN0aW9uc1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdXNlRm9jdXNGdW5jdGlvbnNcblx0XHRzZXQ6IChib29sKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGJvb2wgaXNudCAnYm9vbGVhbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LnVzZUZvY3VzRnVuY3Rpb25zIHJlcXVpcmVzIGEgYm9vbGVhbiAodHJ1ZSBvciBmYWxzZSkgdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgbm90aWZ5LCB0byBiZSBydW4gYnkgYWxsIG5ldyBzdWJqZWN0c1xuXHRcdFx0QF91c2VGb2N1c0Z1bmN0aW9ucyA9IGJvb2xcblxuXG5cdCMgZ2V0IGN1cnJlbnQgZGVmYXVsdCBmb2N1cyBmdW5jdGlvbiwgdXNlZCBieSBhbGwgc3ViamVjdHMsIG9yIHNldCBhIG5ldyBvbmVcblx0QGRlZmluZSBcImZvY3VzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9kZWZhdWx0Rm9jdXNcblx0XHRzZXQ6IChmdW5jKSAtPiBcblx0XHRcdGlmIHR5cGVvZiBmdW5jIGlzbnQgJ2Z1bmN0aW9uJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQuZm9jdXMgcmVxdWlyZXMgYSBmdW5jdGlvbiB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBmb2N1cywgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHMgd2hlbiBmb2N1c2VkXG5cdFx0XHRAX2RlZmF1bHRGb2N1cyA9IGZ1bmNcblxuXG5cdCMgZ2V0IGN1cnJlbnQgZGVmYXVsdCB1bmZvY3VzIGZ1bmN0aW9uLCB1c2VkIGJ5IGFsbCBzdWJqZWN0cywgb3Igc2V0IGEgbmV3IG9uZVxuXHRAZGVmaW5lIFwidW5mb2N1c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdFVuZm9jdXNcblx0XHRzZXQ6IChmdW5jKSAtPiBcblx0XHRcdGlmIHR5cGVvZiBmdW5jIGlzbnQgJ2Z1bmN0aW9uJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQudW5mb2N1cyByZXF1aXJlcyBhIGZ1bmN0aW9uIHZhbHVlLlwiXG5cdFx0XHRcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgdW5mb2N1cywgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHMgd2hlbiB1bmZvY3VzZWRcblx0XHRcdEBfZGVmYXVsdFVuZm9jdXMgPSBmdW5jXG5cblxuXHQjIGdldCBjdXJyZW50IGZvY3VzZWQgc3ViamVjdHMgb3Igc2V0IGZvY3VzZWQgc3ViamVjdHNcblx0QGRlZmluZSBcImZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2ZvY3VzZWRTdWJqZWN0c1xuXHRcdHNldDogKGxheWVycykgLT5cblx0XHRcdCMgYWNjZXB0cyBhcnJheXMsIHNvIG1ha2UgYW4gYXJyYXkgaWYgbm90IGdpdmVuIG9uZVxuXHRcdFx0aWYgXy5pc0FycmF5KGxheWVycykgaXMgZmFsc2UgdGhlbiBsYXllcnMgPSBbbGF5ZXJzXVxuXG5cdFx0XHQjIGZvY3VzIG9uIGFueSBvZiB0aGUgbGF5ZXJzIHRoYXQgYXJlbid0IGZvY3VzZWQgYWxyZWFkeVxuXHRcdFx0bGF5ZXJzLmZvckVhY2ggKGxheWVyKSA9PiBpZiBAX2lzRm9jdXNlZChsYXllcikgaXMgZmFsc2UgdGhlbiBAX2FkZFRvRm9jdXNlZFN1YmplY3RzKGxheWVyLCB0cnVlKVxuXG5cblx0IyBnZXQgY3VycmVudCB1bmZvY3VzZWQgc3ViamVjdHNcblx0QGRlZmluZSBcInVuZm9jdXNlZFwiLFxuXHRcdGdldDogLT4gcmV0dXJuIF8ud2l0aG91dChAX3N1YmplY3RzLCBAX2ZvY3VzZWRTdWJqZWN0cylcblx0XHRzZXQ6IChsYXllcnMpIC0+XG5cdFx0XHQjIGFjY2VwdHMgYXJyYXlzLCBzbyBtYWtlIGFuIGFycmF5IGlmIG5vdCBnaXZlbiBvbmVcblx0XHRcdGlmIF8uaXNBcnJheShsYXllcnMpIGlzIGZhbHNlIHRoZW4gbGF5ZXJzID0gW2xheWVyc11cblxuXHRcdFx0IyB1bmZvY3VzIGFueSBvZiB0aGUgbGF5ZXJzIHRoYXQgYXJlIGZvY3VzZWRcblx0XHRcdGxheWVycy5mb3JFYWNoIChsYXllcikgPT4gaWYgQF9pc0ZvY3VzZWQobGF5ZXIpIGlzIHRydWUgdGhlbiBAX3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHMobGF5ZXIsIHRydWUpXG5cblxuXHRAZGVmaW5lIFwidXNlRm9jdXNTdGF0ZXNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3VzZUZvY3VzU3RhdGVzXG5cdFx0c2V0OiAoYm9vbCkgLT4gXG5cdFx0XHRpZiB0eXBlb2YgYm9vbCBpc250ICdib29sZWFuJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQudXNlRm9jdXNTdGF0ZXMgcmVxdWlyZXMgYSBib29sZWFuIHZhbHVlLlwiXG5cdFx0XHRAX3VzZUZvY3VzU3RhdGVzID0gYm9vbFxuXG5cblx0IyAjIGdldCBvciBzZXQgZGVmYXVsdCBmb2N1c2VkIHN0YXRlIGFkZGVkIHRvIG5ldyBzdWJqZWN0c1xuXHQjIEBkZWZpbmUgXCJzdGF0ZXMuZm9jdXNlZFwiLFxuXHQjIFx0Z2V0OiAtPiByZXR1cm4gQHN0YXRlcy5mb2N1c2VkXG5cdCMgXHRzZXQ6IChzdGF0ZSA9IHt9KSAtPiBcblx0IyBcdFx0aWYgdHlwZW9mIHN0YXRlIGlzbnQgJ29iamVjdCcgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LmZvY3VzU3RhdGUgcmVxdWlyZXMgYW4gb2JqZWN0IChhIExheWVyIHN0YXRlKS5cIlxuXHQjIFx0XHRAc3RhdGVzLmZvY3VzZWQgPSBzdGF0ZVxuXG5cblx0IyAjIGdldCBvciBzZXQgZGVmYXVsdCB1bmZvY3VzZWQgc3RhdGUgYWRkZWQgdG8gbmV3IHN1YmplY3RzXG5cdCMgQGRlZmluZSBcInN0YXRlcy51bmZvY3VzZWRcIixcblx0IyBcdGdldDogLT4gcmV0dXJuIEBzdGF0ZXMudW5mb2N1c2VkXG5cdCMgXHRzZXQ6IChzdGF0ZSA9IHt9KSAtPiBcblx0IyBcdFx0aWYgdHlwZW9mIHN0YXRlIGlzbnQgJ29iamVjdCcgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LmZvY3VzU3RhdGUgcmVxdWlyZXMgYW4gb2JqZWN0IChhIExheWVyIHN0YXRlKS5cIlxuXHQjIFx0XHRAc3RhdGVzLnVuZm9jdXNlZCA9IHN0YXRlXG5cdFxuXG5cdCMgZ2V0IG9yIHNldCB0aGUgYXJyYXkgb2Ygc3ViamVjdHMgKCBuZWVkcyB3b3JrIClcblx0QGRlZmluZSBcInN1YmplY3RzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9zdWJqZWN0c1xuXHRcdHNldDogKGxheWVycykgLT5cblx0XHRcdCMgdGhyb3cgZXJyb3IgaWYgbGF5ZXJzIGlzbnQgYW4gYXJyYXlcblx0XHRcdGlmIF8uaXNBcnJheShsYXllcnMpIGlzIGZhbHNlIG9yIGxheWVycy5sZW5ndGggPCAwIHRoZW4gdGhyb3cgJ1N1YmplY3RzIHJlcXVpcmVzIGFuIGFycmF5LidcblxuXHRcdFx0IyBwcmVzZXJ2ZSBmb2N1c2VkIHN1YmplY3RzIHRoYXQgYXJlIGFsc28gaW5jbHVkZWQgaW4gdGhlIG5ldyBsYXllcnMgYXJyYXlcblx0XHRcdEBfZm9jdXNlZFN1YmplY3RzID0gXy5pbnRlcnNlY3Rpb24oQF9mb2N1c2VkU3ViamVjdHMsIGxheWVycylcblx0XHRcdFxuXHRcdFx0IyByZW1vdmUgZXhpc3Rpbmcgc3ViamVjdHMgdGhhdCBhcmUgbm90IG9uIHRoZSBuZXcgbGlzdFxuXHRcdFx0YWRpb3NTdWJqZWN0cyA9IF8uZGlmZmVyZW5jZShAX3N1YmplY3RzLCBsYXllcnMpXG5cdFx0XHRAcmVtb3ZlU3ViamVjdChzdWJqZWN0KSBmb3Igc3ViamVjdCBpbiBhZGlvc1N1YmplY3RzXG5cdFx0XG5cdFx0XHQjIGRlZmluZSBuZXcgc3ViamVjdHNcblx0XHRcdEBhZGRTdWJqZWN0KGxheWVyKSBmb3IgbGF5ZXIgaW4gbGF5ZXJzXG5cdFx0XHRcblx0XHRcdCMgYWRkIGxpbmsgdG8gb2JzZXJ2ZXIgaW4gc3ViamVjdCBsYXllcnNcblx0XHRcdHN1YmplY3Qub2JzZXJ2ZXIgPSBAIGZvciBzdWJqZWN0IGluIEBfc3ViamVjdHNcblxuXHRcdFx0IyByZW1vdmUgZm9jdXNlZCBzdWJqZWN0IGlmIG5ldyBzdWJqZWN0cyBkb2Vzbid0IGluY2x1ZGUgaXRcblx0XHRcdGlmIG5vdCBfLmluY2x1ZGVzKEBfc3ViamVjdHMsIEBfZm9jdXNlZFN1YmplY3QpXG5cdFx0XHRcdEBfZm9jdXNlZFN1YmplY3QgPSB1bmRlZmluZWRcblxuXHRfaXNGb2N1c2VkOiAoc3ViamVjdCkgLT4gcmV0dXJuIF8uaW5jbHVkZXMoQF9mb2N1c2VkU3ViamVjdHMsIHN1YmplY3QpXG5cblx0IyBhZGQgYSBsYXllciB0byBhcnJheSBvZiBmb2N1c2VkIHN1YmplY3RzLCBtYWtpbmcgcm9vbSBpZiBuZWNlc3Nhcnlcblx0X2FkZFRvRm9jdXNlZFN1YmplY3RzOiAoc3ViamVjdCwgaW5zdGFudCA9IGZhbHNlKSAtPlxuXHRcdCMgdGhyb3cgYW4gZXJyb3IgaWYgYSBub24tZm9jdXNlZCBsYXllciB3YXMgc2VudCBoZXJlXG5cdFx0aWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgdHJ1ZSB0aGVuIHRocm93IFwiRm9jdXNlZCBvbiBhIGZvY3VzZWQgc3ViamVjdC4gSXMgdGhhdCByaWdodD9cIlxuXG5cdFx0IyBpZiB3ZSdyZSBhdCB0aGUgbGltaXQgb2Ygb3VyIGZvY3VzZWQgc3ViamVjdHMuLi5cblx0XHRpZiBfLnNpemUoQF9mb2N1c2VkU3ViamVjdHMpID49IEBfbWF4Rm9jdXNlZFxuXHRcdFx0IyByZW1vdmUgdGhlIHN1YnNjcmliZSBmcm9tIHRoZSBmcm9udCBvZiB0aGUgbGlzdCBhbmQgc2V0IGl0IGFzIHVuZm9jdXNlZFxuXHRcdFx0QF9zZXRGb2N1c2VkKEBfZm9jdXNlZFN1YmplY3RzWzBdLCBmYWxzZSwgaW5zdGFudClcblx0XHRcdCMgcmVwZWF0IHVudGlsIHdlIGhhdmUgcm9vbSBmb3IgYSBuZXcgZm9jdXNlZCBzdWJqZWN0XG5cdFx0XHRAX2FkZFRvRm9jdXNlZFN1YmplY3RzKHN1YmplY3QsIGluc3RhbnQpXG5cdFx0XG5cdFx0IyBpZiAob3Igd2hlbikgdGhlcmUgaXMgcm9vbS4uLlxuXHRcdGVsc2Vcblx0XHRcdCMgYWRkIHRoZSBuZXcgZm9jdXNlZCBzdWJqZWN0IHRvIHRoZSBlbmQgb2YgdGhlIGxpc3Rcblx0XHRcdEBfZm9jdXNlZFN1YmplY3RzLnB1c2goc3ViamVjdClcblx0XHRcdGlmIEBfbm90aWZ5T25Gb2N1cyBpcyB0cnVlIHRoZW4gQG5vdGlmeVN1YmplY3RzKClcblxuXHQjIHJlbW92ZSBhIGxheWVyIGZyb20gYXJyYXkgb2YgZm9jdXNlZCBzdWJqZWN0c1xuXHRfcmVtb3ZlRnJvbUZvY3VzZWRTdWJqZWN0czogKHN1YmplY3QsIGluc3RhbnQgPSBmYWxzZSkgLT5cblx0XHQjIHRocm93IGFuIGVycm9yIGlmIGEgbm9uLWZvY3VzZWQgbGF5ZXIgd2FzIHNlbnQgaGVyZVxuXHRcdGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIGZhbHNlIHRoZW4gdGhyb3cgXCJUcmllZCB0byByZW1vdmUgYSBsYXllciB0aGF0IHdhc24ndCBmb2N1c2VkLlwiXG5cdFx0XG5cdFx0IyByZW1vdmUgdGhlIGZvY3VzZWQgbGF5ZXIgYW5kIHNldCBpdCBhcyB1bmZvY3VzZWRcblx0XHRfLnB1bGwoQF9mb2N1c2VkU3ViamVjdHMsIHN1YmplY3QpXG5cdFxuXG5cdFxuXG5cbmV4cG9ydHMuRm9jdXNDb21wb25lbnQgPSBGb2N1c0NvbXBvbmVudFxuXG4iLCIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUVBQTtBREFBLElBQUEsY0FBQTtFQUFBOzs7QUFBTTs7O0VBQ1Esd0JBQUMsT0FBRDtBQUlaLFFBQUE7O01BSmEsVUFBVTs7SUFJdkIsSUFBQyxDQUFBLFNBQUQsR0FBYTtJQUNiLElBQUMsQ0FBQSxnQkFBRCxHQUFvQjtJQUVwQixJQUFDLENBQUEsV0FBRCw4Q0FBb0M7SUFDcEMsSUFBQyxDQUFBLE9BQUQsNENBQTRCO0lBQzVCLElBQUMsQ0FBQSxXQUFELGdEQUFvQztJQUNwQyxJQUFDLENBQUEsUUFBRCw2Q0FBOEI7SUFDOUIsSUFBQyxDQUFBLGVBQUQscUZBQTZDO01BQUMsT0FBQSxFQUFTLENBQVY7O0lBQzdDLElBQUMsQ0FBQSxpQkFBRCx1RkFBb0QsaUVBQUgsR0FBaUMsTUFBakMsR0FBZ0Q7TUFBQyxPQUFBLEVBQVMsRUFBVjs7SUFDakcsSUFBQyxDQUFBLGFBQUQsMkNBQWlDLFNBQUE7QUFBRyxhQUFPO0lBQVY7SUFDakMsSUFBQyxDQUFBLGVBQUQsK0NBQXFDLFNBQUE7QUFBRyxhQUFPO0lBQVY7SUFDckMsSUFBQyxDQUFBLGNBQUQsOENBQW1DLFNBQUE7QUFBRyxhQUFPO0lBQVY7SUFDbkMsSUFBQyxD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
