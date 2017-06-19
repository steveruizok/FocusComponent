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

  FocusComponent.prototype.setFocused = function(subject, bool, instant) {
    if (bool == null) {
      bool = true;
    }
    if (instant == null) {
      instant = false;
    }
    return _setFocused(subject, bool, instant);
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
    newSubject.states.focused = focusedState != null ? focusedState : this._defaultFocused;
    newSubject.states.unfocused = (ref7 = unfocusedState != null ? unfocusedState : this._defaultUnfocused) != null ? ref7 : newSubject.states["default"];
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
    this.removeTrigger(subject);
    if (this._release != null) {
      return this.removeRelease(newSubject);
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL1VzZXJzL3N0ZXZlcnVpei9HaXRIdWIvRm9jdXNDb21wb25lbnQvZXhhbXBsZXMuZnJhbWVyL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vLi4vLi4vLi4vLi4vVXNlcnMvc3RldmVydWl6L0dpdEh1Yi9Gb2N1c0NvbXBvbmVudC9leGFtcGxlcy5mcmFtZXIvbW9kdWxlcy9Gb2N1c0NvbXBvbmVudC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCJjbGFzcyBGb2N1c0NvbXBvbmVudCBleHRlbmRzIExheWVyXG5cdGNvbnN0cnVjdG9yOiAob3B0aW9ucyA9IHt9KSAtPlxuXG5cdFx0IyBUaGUgRm9jdXNDb21wb25lbnQgbWF5IGZvY3VzIG9uIG9uZSBvciBtb3JlIHN1YmplY3RzIGF0IGEgdGltZS5cblxuXHRcdEBfc3ViamVjdHMgPSBbXVxuXHRcdEBfZm9jdXNlZFN1YmplY3RzID0gW11cblxuXHRcdEBfbWF4Rm9jdXNlZCA9IG9wdGlvbnMubWF4Rm9jdXNlZCA/IDFcblx0XHRAX3RvZ2dsZSA9IG9wdGlvbnMudG9nZ2xlID8gdHJ1ZVxuXHRcdEBfdG9nZ2xlTG9jayA9IG9wdGlvbnMudG9nZ2xlTG9jayA/IGZhbHNlXG5cdFx0QF90cmlnZ2VyID0gb3B0aW9ucy50cmlnZ2VyID8gJ1RhcCdcblx0XHRAX3JlbGVhc2UgPSBvcHRpb25zLnJlbGVhc2UgPyB1bmRlZmluZWRcblx0XHRAX2RlZmF1bHRGb2N1c2VkID0gb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQgPyB7b3BhY2l0eTogMX1cblx0XHRAX2RlZmF1bHRVbmZvY3VzZWQgPSBvcHRpb25zLnN0YXRlcz8udW5mb2N1c2VkID8gaWYgb3B0aW9ucy5zdGF0ZXM/LmZvY3VzZWQ/IHRoZW4gdW5kZWZpbmVkIGVsc2Uge29wYWNpdHk6IC41fVxuXHRcdEBfZGVmYXVsdEZvY3VzID0gb3B0aW9ucy5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0VW5mb2N1cyA9IG9wdGlvbnMudW5mb2N1cyA/IC0+IHJldHVybiBudWxsXG5cdFx0QF9kZWZhdWx0Tm90aWZ5ID0gb3B0aW9ucy5ub3RpZnkgPyAtPiByZXR1cm4gbnVsbFxuXHRcdEBfbm90aWZ5T25Gb2N1cyA9IG9wdGlvbnMubm90aWZ5T25Gb2N1cyA/IHRydWVcblx0XHRAX3VzZUZvY3VzU3RhdGVzID0gb3B0aW9ucy51c2VGb2N1c1N0YXRlcyA/IHRydWVcblx0XHRAX3VzZUZvY3VzRnVuY3Rpb25zID0gb3B0aW9ucy51c2VGb2N1c0Z1bmN0aW9ucyA/IHRydWVcblxuXHRcdHN1cGVyIF8uZGVmYXVsdHMgb3B0aW9ucyxcblx0XHRcdG5hbWU6ICcuJ1xuXHRcdFx0c2l6ZTogU2NyZWVuLnNpemVcblx0XHRcdGJhY2tncm91bmRDb2xvcjogbnVsbFxuXG5cblx0IyBub3RpZnkgYWxsIHN1YmplY3RzXG5cdG5vdGlmeVN1YmplY3RzOiAoZnVuYyA9IEBfZGVmYXVsdE5vdGlmeSkgLT4gZG8gXy5iaW5kKGZ1bmMsIHN1YmplY3QpIGZvciBzdWJqZWN0IGluIEBfc3ViamVjdHNcblxuXHQjIG5vdGlmeSBmb2N1c2VkIHN1YmplY3RzXG5cdG5vdGlmeUZvY3VzZWRTdWJqZWN0czogKGZ1bmMgPSBAX2RlZmF1bHRGb2N1cykgLT4gZG8gXy5iaW5kKGZ1bmMsIHN1YmplY3QpIGZvciBzdWJqZWN0IGluIEBfZm9jdXNlZFN1YmplY3RzXG5cdFxuXHQjIG5vdGlmeSB1bmZvY3VzZWQgc3ViamVjdHNcblx0bm90aWZ5VW5mb2N1c2VkU3ViamVjdHM6IChmdW5jID0gQF9kZWZhdWx0VW5mb2N1cykgLT4gZG8gXy5iaW5kKGZ1bmMsIHN1YmplY3QpIGZvciBzdWJqZWN0IGluIEBfdW5mb2N1c2VkU3ViamVjdHNcblx0XG5cdG5vdGlmeVNlbGVjdGVkOiAoc3ViamVjdHMgPSBAX3N1YmplY3RzLCBmdW5jID0gQF9kZWZhdWx0Tm90aWZ5KSAtPiBcblx0XHRpZiB0eXBlb2Ygc3ViamVjdHMgaXMgJ29iamVjdCcgdGhlbiBzdWJqZWN0cyA9IFtzdWJqZWN0c11cblx0XHRkbyBfLmJpbmQoZnVuYywgc3ViamVjdCkgZm9yIHN1YmplY3QgaW4gQF9zdWJqZWN0c1xuXG5cdHNldEZvY3VzZWQ6IChzdWJqZWN0LCBib29sPXRydWUsIGluc3RhbnQ9ZmFsc2UpIC0+IF9zZXRGb2N1c2VkKHN1YmplY3QsIGJvb2wsIGluc3RhbnQpXG5cblx0IyB1bmZvY3VzIGFsbCBmb2N1c2VkIHN1YmplY3RzXG5cdHVuZm9jdXNBbGw6IChpbnN0YW50ID0gZmFsc2UpIC0+IEBfc2V0Rm9jdXNlZChzdWJqZWN0LCBmYWxzZSwgaW5zdGFudCkgZm9yIHN1YmplY3QgaW4gQF9mb2N1c2VkU3ViamVjdHNcblxuXHQjIGZvY3VzIGFsbCB1bmZvY3VzZWQgc3ViamVjdHNcblx0Zm9jdXNBbGw6IChpbnN0YW50ID0gZmFsc2UpIC0+IEBfc2V0Rm9jdXNlZChzdWJqZWN0LCB0cnVlLCBpbnN0YW50KSBmb3Igc3ViamVjdCBpbiBAX3VuZm9jdXNlZFN1YmplY3RzXG5cblxuXG5cblx0IyBydW4gZm9jdXMgZnVuY3Rpb24gZm9yIHN1YmplY3Rcblx0X2ZvY3VzOiAoc3ViamVjdCkgLT4gZG8gXy5iaW5kKEBfZGVmYXVsdEZvY3VzLCBzdWJqZWN0KVxuXG5cdCMgcnVuIHVuZm9jdXMgZnVuY3Rpb24gZm9yIHN1YmplY3Rcblx0X3VuZm9jdXM6IChzdWJqZWN0KSAtPiBkbyBfLmJpbmQoQF9kZWZhdWx0VW5mb2N1cywgc3ViamVjdClcblxuXHQjIGFkZCBvciByZW1vdmUgZm9jdXMgdHJpZ2dlcnMgdG8gYSBzdWJqZWN0XG5cdGFkZFRyaWdnZXI6IChzdWJqZWN0LCBldmVudE5hbWUgPSBAX3RyaWdnZXIpIC0+IHN1YmplY3Qub24gRXZlbnRzW2V2ZW50TmFtZV0sID0+XG5cdFx0cmV0dXJuIGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIHRydWUgYW5kIEBfdG9nZ2xlIGlzIGZhbHNlXG5cdFx0QF9zZXRGb2N1c2VkKHN1YmplY3QsIHRydWUpXG5cdFxuXHRyZW1vdmVUcmlnZ2VyOiAoc3ViamVjdCwgZXZlbnROYW1lID0gQF90cmlnZ2VyKSAtPiBzdWJqZWN0Lm9mZiBFdmVudHNbZXZlbnROYW1lXSwgPT5cblx0XHRyZXR1cm4gaWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgdHJ1ZSBhbmQgQF90b2dnbGUgaXMgZmFsc2Vcblx0XHRAX3NldEZvY3VzZWQoc3ViamVjdCwgdHJ1ZSlcblxuXHRhZGRSZWxlYXNlOiAoc3ViamVjdCwgZXZlbnROYW1lID0gQF9yZWxlYXNlKSAtPiBzdWJqZWN0Lm9uIEV2ZW50c1tldmVudE5hbWVdLCA9PlxuXHRcdHJldHVybiBpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyBmYWxzZVxuXHRcdEBfc2V0Rm9jdXNlZChzdWJqZWN0LCBmYWxzZSlcblxuXHRyZW1vdmVSZWxlYXNlOiAoc3ViamVjdCwgZXZlbnROYW1lID0gQF90cmlnZ2VyKSAtPiBzdWJqZWN0Lm9mZiBFdmVudHNbZXZlbnROYW1lXSwgPT5cblx0XHRyZXR1cm4gaWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgZmFsc2Vcblx0XHRAX3NldEZvY3VzZWQoc3ViamVjdCwgdHJ1ZSlcblxuXG5cdCMgc2V0IGZvY3VzZWQgc3RhdGUgb2YgYSBzdWJqZWN0XG5cdF9zZXRGb2N1c2VkOiAoc3ViamVjdCwgYm9vbD10cnVlLCBpbnN0YW50PWZhbHNlKSAtPlxuXHRcdCMgaWYgdGhlIHN1YmplY3QncyBmb2N1cyBzdGF0ZSBzaG91bGQgYmUgZm9jdXNlZC4uLlxuXHRcdGlmIGJvb2wgaXMgdHJ1ZVxuXHRcdFx0IyBpZiBzdWJqZWN0IGlzIGFscmVhZHkgZm9jdXNlZC4uLlxuXHRcdFx0aWYgQF9pc0ZvY3VzZWQoc3ViamVjdCkgaXMgdHJ1ZVxuXHRcdFx0XHQjIGlmIHRvZ2dsZSBtb2RlIGlzIG9uLCB1bmZvY3VzIHRoZSBzdWJqZWN0XG5cdFx0XHRcdGlmIEBfdG9nZ2xlIGlzIHRydWUgdGhlbiBAX3NldEZvY3VzZWQoc3ViamVjdCwgZmFsc2UsIGluc3RhbnQpXG5cdFx0XHRcdCMgZWl0aGVyIHdheSwgcmV0dXJuXG5cdFx0XHRcdHJldHVybiBudWxsXG5cblx0XHRcdCMgY2FuY2VsIG5ldyBmb2N1cyBpZiB0b2dnbGUgbG9jayBpcyBvblxuXHRcdFx0cmV0dXJuIGlmIF8uc2l6ZShAX2ZvY3VzZWRTdWJqZWN0cykgPj0gQF9tYXhGb2N1c2VkIGFuZCBAX3RvZ2dsZUxvY2sgaXMgdHJ1ZVxuXG5cdFx0XHQjIGlmIHRoZSBzdWJqZWN0IGlzbid0IGFscmVhZHkgZm9jdXNlZCwgYWRkIGl0IHRvIGZvY3VzZWQgc3ViamVjdHNcblx0XHRcdEBfYWRkVG9Gb2N1c2VkU3ViamVjdHMoc3ViamVjdCwgaW5zdGFudClcblx0XHRcdCMgYW5kIGlmIGZvY3VzZWQgc3RhdGVzIGFyZSBiZWluZyB1c2VkLi4uXG5cdFx0XHRpZiBAX3VzZUZvY3VzU3RhdGVzIGlzIHRydWVcblx0XHRcdFx0IyBlaXRoZXIgc3dpdGNoIG9yIGFuaW1hdGUgdG8gZm9jdXNlZCBzdGF0ZSwgZGVwZW5kaW5nIG9uIHRoZSBpbnN0YW50IGFyZ3VtZW50XG5cdFx0XHRcdGlmIGluc3RhbnQgdGhlbiBzdWJqZWN0LnN0YXRlU3dpdGNoKCdmb2N1c2VkJykgZWxzZSBzdWJqZWN0LmFuaW1hdGUoJ2ZvY3VzZWQnKVxuXHRcdFx0IyBhbmQgaWYgZm9jdXMgZnVuY3Rpb25zIGFyZSBiZWluZyB1c2VkLi4uIHJ1biBmb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRcdFx0aWYgQF91c2VGb2N1c0Z1bmN0aW9ucyBpcyB0cnVlIHRoZW4gQF9mb2N1cyhzdWJqZWN0KSBcblxuXHRcdCMgaWYgdGhlIHN1YmplY3QncyBmb2N1cyBzdGF0ZSBzaG91bGQgYmUgdW5mb2N1c2VkLi4uXG5cdFx0ZWxzZVxuXHRcdFx0IyBpZiB0aGUgc3ViamVjdCBpcyBhbHJlYWR5IHVuZm9jdXNlZCwgZG8gbm90aGluZ1xuXHRcdFx0cmV0dXJuIGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIGZhbHNlXG5cblx0XHRcdCMgaWYgaXQgaXMsIHJlbW92ZSBpdCBmcm9tIGZvY3VzZWQgc3ViamVjdHNcblx0XHRcdEBfcmVtb3ZlRnJvbUZvY3VzZWRTdWJqZWN0cyhzdWJqZWN0KSBcblxuXHRcdFx0IyBhbmQgaWYgZm9jdXNlZCBzdGF0ZXMgYXJlIGJlaW5nIHVzZWQuLi5cblx0XHRcdGlmIEBfdXNlRm9jdXNTdGF0ZXMgaXMgdHJ1ZVxuXHRcdFx0XHQjIGVpdGhlciBzd2l0Y2ggb3IgYW5pbWF0ZSB0byB0aGUgdW5mb2N1c2VkIHN0YXRlLCBkZXBlbmRpbmcgb24gdGhlIGluc3RhbnQgYXJndW1lbnRcblx0XHRcdFx0aWYgaW5zdGFudCB0aGVuIHN1YmplY3Quc3RhdGVTd2l0Y2goJ3VuZm9jdXNlZCcpIGVsc2Ugc3ViamVjdC5hbmltYXRlKCd1bmZvY3VzZWQnKVxuXHRcdFx0IyBhbmQgaWYgZm9jdXMgZnVuY3Rpb25zIGFyZSBiZWluZyB1c2VkLi4uIHJ1biB0aGUgdW5mb2N1cyBmdW5jdGlvbiBmb3Igc3ViamVjdFxuXHRcdFx0aWYgQF91c2VGb2N1c0Z1bmN0aW9ucyBpcyB0cnVlIHRoZW4gQF91bmZvY3VzKHN1YmplY3QpXG5cblx0IyBhZGQgYSBuZXcgc3ViamVjdCB0byB0aGlzIGZvY3VzQ29tcG9uZW50XG5cdGFkZFN1YmplY3Q6IChuZXdTdWJqZWN0LCBvcHRpb25zID0ge30pIC0+XG5cdFx0dHJpZ2dlciA9IG9wdGlvbnMudHJpZ2dlciA/IEBfdHJpZ2dlclxuXHRcdHJlbGVhc2UgPSBvcHRpb25zLnJlbGVhc2UgPyBAX3JlbGVhc2Vcblx0XHRmb2N1c2VkID0gb3B0aW9ucy5mb2N1c2VkID8gZmFsc2Vcblx0XHRmb2N1c2VkU3RhdGUgPSBvcHRpb25zLmZvY3VzZWRTdGF0ZSA/IG5ld1N1YmplY3Quc3RhdGVzPy5mb2N1c2VkXG5cdFx0dW5mb2N1c2VkU3RhdGUgPSBvcHRpb25zLnVuZm9jdXNlZFN0YXRlID8gbmV3U3ViamVjdC5zdGF0ZXM/LnVuZm9jdXNlZFxuXG5cdFx0IyB0aHJvdyBhbiBlcnJvciBpZiBsYXllciBpc24ndCBhIGxheWVyXG5cdFx0aWYgbmV3U3ViamVjdCBpbnN0YW5jZW9mIExheWVyIGlzIGZhbHNlIHRoZW4gdGhyb3cgXCJPYnNlcnZlciBjYW4gb25seSBhZGQgbGF5ZXJzIHRvIGl0cyBsaXN0IG9mIHN1YmplY3RzLiAje25ld1N1YmplY3R9LCBpZCAje25ld1N1YmplY3QuaWR9IGlzIG5vdCBhIGxheWVyLlwiXG5cblx0XHQjIHNldCBldmVudCB0cmlnZ2VyIChldmVudCBuYW1lIHByb3ZpZGVkIGluIG9wdGlvbnMgb3IgZGVmYXVsdCBldmVudCBuYW1lKVxuXHRcdEBhZGRUcmlnZ2VyKG5ld1N1YmplY3QsIHRyaWdnZXIpXG5cdFx0aWYgcmVsZWFzZT8gdGhlbiBAYWRkUmVsZWFzZShuZXdTdWJqZWN0LCByZWxlYXNlKVxuXG5cdFx0IyBzZXQgZm9jdXNlZCAvIHVuZm9jdXNlZCBsYXllciBzdGF0ZXMgKHN0YXRlcyBwcm92aWRlZCBpbiBvcHRpb25zLCBvciBleGlzdGluZyBzdGF0ZXMgb3IgZGVmYXVsdCBzdGF0ZXMpXG5cdFx0bmV3U3ViamVjdC5zdGF0ZXMuZm9jdXNlZCA9IGZvY3VzZWRTdGF0ZSA/IEBfZGVmYXVsdEZvY3VzZWRcblx0XHRuZXdTdWJqZWN0LnN0YXRlcy51bmZvY3VzZWQgPSB1bmZvY3VzZWRTdGF0ZSA/IEBfZGVmYXVsdFVuZm9jdXNlZCA/IG5ld1N1YmplY3Quc3RhdGVzLmRlZmF1bHRcblxuXHRcdCMgYWRkIGxheWVyIHRvIHN1YmplY3RzIGFycmF5XG5cdFx0QF9zdWJqZWN0cy5wdXNoKG5ld1N1YmplY3QpXG5cblx0XHQjIGlmIHRoaXMgc3ViamVjdCBzaG91bGQgc3RhcnQgYXMgZm9jdXNlZCwgc2V0IGl0IGFzIGZvY3VzZWRcblx0XHRAX3NldEZvY3VzZWQobmV3U3ViamVjdCwgZm9jdXNlZCwgdHJ1ZSlcblx0XHRpZiBAX3VzZUZvY3VzU3RhdGVzIGlzIHRydWUgdGhlbiBuZXdTdWJqZWN0LnN0YXRlU3dpdGNoKCd1bmZvY3VzZWQnKVxuXHRcdGlmIEBfdXNlRm9jdXNGdW5jdGlvbnMgaXMgdHJ1ZSB0aGVuIEBfdW5mb2N1cyhuZXdTdWJqZWN0KVxuXG5cblx0IyByZW1vdmUgYSBzdWJqZWN0IGZyb20gdGhpcyBmb2N1c0NvbXBvbmVudFxuXHRyZW1vdmVTdWJqZWN0OiAoc3ViamVjdCkgLT5cblxuXHRcdCMgdGhyb3cgYSB3YXJuaW5nIHdoZW4gdHJ5aW5nIHRvIHJlbW92ZSBhIGxheWVyIGlzbid0IGEgc3ViamVjdFxuXHRcdGlmIF8uaW5jbHVkZXMoQF9zdWJqZWN0cywgc3ViamVjdCkgaXMgZmFsc2Vcblx0XHRcdGlmIHN1YmplY3QgaW5zdGFuY2VvZiBMYXllciBpcyB0cnVlIHRoZW4gdGhyb3cgXCJUaGF0IGxheWVyICgje2xheWVyLm5hbWUgPyBsYXllcn0sIGlkOiAje2xheWVyLmlkfSkgaXNuJ3QgYSBzdWJqZWN0LlwiXG5cdFx0XHQjIHRocm93IGEgbW9yZSBkZXNjcmlwdGl2ZSBlcnJvciBpZiB0aGUgbGF5ZXIgaXNuJ3QgYSBsYXllci5cblx0XHRcdGVsc2UgdGhyb3cgXCJUaGF0IGlzbid0IGEgbGF5ZXIuIE9ic2VydmVyIGNhbiBvbmx5IHJlbW92ZSBsYXllcnMgdGhhdCBhcmUgb24gaXRzIGxpc3Qgb2Ygc3ViamVjdCBsYXllcnMuXCJcblx0XHRcblx0XHRpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSB0aGVuIEBfcmVtb3ZlRnJvbUZvY3VzZWRTdWJqZWN0cyhzdWJqZWN0LCBmYWxzZSlcblxuXHRcdCMgcmVtb3ZlIGZyb20gbGlzdCBvZiBzdWJqZWN0c1xuXHRcdF8ucHVsbChAX3N1YmplY3RzLCBzdWJqZWN0KVxuXHRcdCMgcmVtb3ZlIGZvY3VzQ29tcG9uZW50IHRyaWdnZXIgKFRPRE86IHJlbW92ZSBhbGwgYWRkZWQgdHJpZ2dlcnMsIG5vdCBqdXN0IG1vc3QgcmVjZW50KVxuXHRcdEByZW1vdmVUcmlnZ2VyKHN1YmplY3QpXG5cdFx0aWYgQF9yZWxlYXNlPyB0aGVuIEByZW1vdmVSZWxlYXNlKG5ld1N1YmplY3QpXG5cblxuXHRAZGVmaW5lIFwidHJpZ2dlclwiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfdHJpZ2dlclxuXHRcdHNldDogKGV2ZW50TmFtZSkgLT5cblx0XHRcdGlmIHR5cGVvZiBldmVudE5hbWUgaXNudCAnc3RyaW5nJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQudHJpZ2dlciByZXF1aXJlcyBhbiBldmVudCBuYW1lIGFzIHN0cmluZywgbGlrZSAnVGFwJyBvciAnTW91c2VPdmVyJy5cIlxuXHRcdFx0IyBzZXQgdHJpZ2dlciBhcyBkZWZhdWx0IHRyaWdnZXIsIHRvIGJlIGdpdmVuIHRvIGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfdHJpZ2dlciA9IGV2ZW50TmFtZSBcblxuXG5cdEBkZWZpbmUgXCJub3RpZnlcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2RlZmF1bHROb3RpZnlcblx0XHRzZXQ6IChmdW5jKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGZ1bmMgaXNudCAnZnVuY3Rpb24nIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC5ub3RpZnkgcmVxdWlyZXMgYSBmdW5jdGlvbiB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBub3RpZnksIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YmplY3RzXG5cdFx0XHRAX2RlZmF1bHROb3RpZnkgPSBmdW5jXG5cblxuXHRAZGVmaW5lIFwibm90aWZ5T25Gb2N1c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfbm90aWZ5T25Gb2N1c1xuXHRcdHNldDogKGJvb2wpIC0+XG5cdFx0XHRpZiB0eXBlb2YgYm9vbCBpc250ICdib29sZWFuJyB0aGVuIHRocm93IFwiRm9jdXNDb21wb25lbnQubm90aWZ5T25Gb2N1cyByZXF1aXJlcyBhIGJvb2xlYW4gKHRydWUgb3IgZmFsc2UpIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfbm90aWZ5T25Gb2N1cyA9IGJvb2xcblxuXG5cdEBkZWZpbmUgXCJtYXhGb2N1c2VkXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9tYXhGb2N1c2VkXG5cdFx0c2V0OiAobnVtYmVyKSAtPlxuXHRcdFx0aWYgdHlwZW9mIG51bWJlciBpc250ICdudW1iZXInIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC5tYXhGb2N1c2VkIHJlcXVpcmVzIGEgbnVtYmVyIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfbWF4Rm9jdXNlZCA9IG51bWJlclxuXG5cblx0QGRlZmluZSBcInRvZ2dsZUxvY2tcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3RvZ2dsZUxvY2tcblx0XHRzZXQ6IChib29sKSAtPlxuXHRcdFx0aWYgdHlwZW9mIGJvb2wgaXNudCAnYm9vbGVhbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LnRvZ2dsZUxvY2sgcmVxdWlyZXMgYSBib29sZWFuICh0cnVlIG9yIGZhbHNlKSB2YWx1ZS5cIlxuXHRcdFx0IyBzZXQgZnVuY3Rpb24gYXMgZGVmYXVsdCBub3RpZnksIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YmplY3RzXG5cdFx0XHRAX3RvZ2dsZUxvY2sgPSBib29sXG5cblxuXHRAZGVmaW5lIFwidXNlRm9jdXNGdW5jdGlvbnNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX3VzZUZvY3VzRnVuY3Rpb25zXG5cdFx0c2V0OiAoYm9vbCkgLT5cblx0XHRcdGlmIHR5cGVvZiBib29sIGlzbnQgJ2Jvb2xlYW4nIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC51c2VGb2N1c0Z1bmN0aW9ucyByZXF1aXJlcyBhIGJvb2xlYW4gKHRydWUgb3IgZmFsc2UpIHZhbHVlLlwiXG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IG5vdGlmeSwgdG8gYmUgcnVuIGJ5IGFsbCBuZXcgc3ViamVjdHNcblx0XHRcdEBfdXNlRm9jdXNGdW5jdGlvbnMgPSBib29sXG5cblxuXHQjIGdldCBjdXJyZW50IGRlZmF1bHQgZm9jdXMgZnVuY3Rpb24sIHVzZWQgYnkgYWxsIHN1YmplY3RzLCBvciBzZXQgYSBuZXcgb25lXG5cdEBkZWZpbmUgXCJmb2N1c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfZGVmYXVsdEZvY3VzXG5cdFx0c2V0OiAoZnVuYykgLT4gXG5cdFx0XHRpZiB0eXBlb2YgZnVuYyBpc250ICdmdW5jdGlvbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LmZvY3VzIHJlcXVpcmVzIGEgZnVuY3Rpb24gdmFsdWUuXCJcblx0XHRcdCMgc2V0IGZ1bmN0aW9uIGFzIGRlZmF1bHQgZm9jdXMsIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YmplY3RzIHdoZW4gZm9jdXNlZFxuXHRcdFx0QF9kZWZhdWx0Rm9jdXMgPSBmdW5jXG5cblxuXHQjIGdldCBjdXJyZW50IGRlZmF1bHQgdW5mb2N1cyBmdW5jdGlvbiwgdXNlZCBieSBhbGwgc3ViamVjdHMsIG9yIHNldCBhIG5ldyBvbmVcblx0QGRlZmluZSBcInVuZm9jdXNcIixcblx0XHRnZXQ6IC0+IHJldHVybiBAX2RlZmF1bHRVbmZvY3VzXG5cdFx0c2V0OiAoZnVuYykgLT4gXG5cdFx0XHRpZiB0eXBlb2YgZnVuYyBpc250ICdmdW5jdGlvbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LnVuZm9jdXMgcmVxdWlyZXMgYSBmdW5jdGlvbiB2YWx1ZS5cIlxuXHRcdFx0XG5cdFx0XHQjIHNldCBmdW5jdGlvbiBhcyBkZWZhdWx0IHVuZm9jdXMsIHRvIGJlIHJ1biBieSBhbGwgbmV3IHN1YmplY3RzIHdoZW4gdW5mb2N1c2VkXG5cdFx0XHRAX2RlZmF1bHRVbmZvY3VzID0gZnVuY1xuXG5cblx0IyBnZXQgY3VycmVudCBmb2N1c2VkIHN1YmplY3RzIG9yIHNldCBmb2N1c2VkIHN1YmplY3RzXG5cdEBkZWZpbmUgXCJmb2N1c2VkXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF9mb2N1c2VkU3ViamVjdHNcblx0XHRzZXQ6IChsYXllcnMpIC0+XG5cdFx0XHQjIGFjY2VwdHMgYXJyYXlzLCBzbyBtYWtlIGFuIGFycmF5IGlmIG5vdCBnaXZlbiBvbmVcblx0XHRcdGlmIF8uaXNBcnJheShsYXllcnMpIGlzIGZhbHNlIHRoZW4gbGF5ZXJzID0gW2xheWVyc11cblxuXHRcdFx0IyBmb2N1cyBvbiBhbnkgb2YgdGhlIGxheWVycyB0aGF0IGFyZW4ndCBmb2N1c2VkIGFscmVhZHlcblx0XHRcdGxheWVycy5mb3JFYWNoIChsYXllcikgPT4gaWYgQF9pc0ZvY3VzZWQobGF5ZXIpIGlzIGZhbHNlIHRoZW4gQF9hZGRUb0ZvY3VzZWRTdWJqZWN0cyhsYXllciwgdHJ1ZSlcblxuXG5cdCMgZ2V0IGN1cnJlbnQgdW5mb2N1c2VkIHN1YmplY3RzXG5cdEBkZWZpbmUgXCJ1bmZvY3VzZWRcIixcblx0XHRnZXQ6IC0+IHJldHVybiBfLndpdGhvdXQoQF9zdWJqZWN0cywgQF9mb2N1c2VkU3ViamVjdHMpXG5cdFx0c2V0OiAobGF5ZXJzKSAtPlxuXHRcdFx0IyBhY2NlcHRzIGFycmF5cywgc28gbWFrZSBhbiBhcnJheSBpZiBub3QgZ2l2ZW4gb25lXG5cdFx0XHRpZiBfLmlzQXJyYXkobGF5ZXJzKSBpcyBmYWxzZSB0aGVuIGxheWVycyA9IFtsYXllcnNdXG5cblx0XHRcdCMgdW5mb2N1cyBhbnkgb2YgdGhlIGxheWVycyB0aGF0IGFyZSBmb2N1c2VkXG5cdFx0XHRsYXllcnMuZm9yRWFjaCAobGF5ZXIpID0+IGlmIEBfaXNGb2N1c2VkKGxheWVyKSBpcyB0cnVlIHRoZW4gQF9yZW1vdmVGcm9tRm9jdXNlZFN1YmplY3RzKGxheWVyLCB0cnVlKVxuXG5cblx0QGRlZmluZSBcInVzZUZvY3VzU3RhdGVzXCIsXG5cdFx0Z2V0OiAtPiByZXR1cm4gQF91c2VGb2N1c1N0YXRlc1xuXHRcdHNldDogKGJvb2wpIC0+IFxuXHRcdFx0aWYgdHlwZW9mIGJvb2wgaXNudCAnYm9vbGVhbicgdGhlbiB0aHJvdyBcIkZvY3VzQ29tcG9uZW50LnVzZUZvY3VzU3RhdGVzIHJlcXVpcmVzIGEgYm9vbGVhbiB2YWx1ZS5cIlxuXHRcdFx0QF91c2VGb2N1c1N0YXRlcyA9IGJvb2xcblxuXG5cdCMgIyBnZXQgb3Igc2V0IGRlZmF1bHQgZm9jdXNlZCBzdGF0ZSBhZGRlZCB0byBuZXcgc3ViamVjdHNcblx0IyBAZGVmaW5lIFwic3RhdGVzLmZvY3VzZWRcIixcblx0IyBcdGdldDogLT4gcmV0dXJuIEBzdGF0ZXMuZm9jdXNlZFxuXHQjIFx0c2V0OiAoc3RhdGUgPSB7fSkgLT4gXG5cdCMgXHRcdGlmIHR5cGVvZiBzdGF0ZSBpc250ICdvYmplY3QnIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC5mb2N1c1N0YXRlIHJlcXVpcmVzIGFuIG9iamVjdCAoYSBMYXllciBzdGF0ZSkuXCJcblx0IyBcdFx0QHN0YXRlcy5mb2N1c2VkID0gc3RhdGVcblxuXG5cdCMgIyBnZXQgb3Igc2V0IGRlZmF1bHQgdW5mb2N1c2VkIHN0YXRlIGFkZGVkIHRvIG5ldyBzdWJqZWN0c1xuXHQjIEBkZWZpbmUgXCJzdGF0ZXMudW5mb2N1c2VkXCIsXG5cdCMgXHRnZXQ6IC0+IHJldHVybiBAc3RhdGVzLnVuZm9jdXNlZFxuXHQjIFx0c2V0OiAoc3RhdGUgPSB7fSkgLT4gXG5cdCMgXHRcdGlmIHR5cGVvZiBzdGF0ZSBpc250ICdvYmplY3QnIHRoZW4gdGhyb3cgXCJGb2N1c0NvbXBvbmVudC5mb2N1c1N0YXRlIHJlcXVpcmVzIGFuIG9iamVjdCAoYSBMYXllciBzdGF0ZSkuXCJcblx0IyBcdFx0QHN0YXRlcy51bmZvY3VzZWQgPSBzdGF0ZVxuXHRcblxuXHQjIGdldCBvciBzZXQgdGhlIGFycmF5IG9mIHN1YmplY3RzICggbmVlZHMgd29yayApXG5cdEBkZWZpbmUgXCJzdWJqZWN0c1wiLFxuXHRcdGdldDogLT4gcmV0dXJuIEBfc3ViamVjdHNcblx0XHRzZXQ6IChsYXllcnMpIC0+XG5cdFx0XHQjIHRocm93IGVycm9yIGlmIGxheWVycyBpc250IGFuIGFycmF5XG5cdFx0XHRpZiBfLmlzQXJyYXkobGF5ZXJzKSBpcyBmYWxzZSBvciBsYXllcnMubGVuZ3RoIDwgMCB0aGVuIHRocm93ICdTdWJqZWN0cyByZXF1aXJlcyBhbiBhcnJheS4nXG5cblx0XHRcdCMgcHJlc2VydmUgZm9jdXNlZCBzdWJqZWN0cyB0aGF0IGFyZSBhbHNvIGluY2x1ZGVkIGluIHRoZSBuZXcgbGF5ZXJzIGFycmF5XG5cdFx0XHRAX2ZvY3VzZWRTdWJqZWN0cyA9IF8uaW50ZXJzZWN0aW9uKEBfZm9jdXNlZFN1YmplY3RzLCBsYXllcnMpXG5cdFx0XHRcblx0XHRcdCMgcmVtb3ZlIGV4aXN0aW5nIHN1YmplY3RzIHRoYXQgYXJlIG5vdCBvbiB0aGUgbmV3IGxpc3Rcblx0XHRcdGFkaW9zU3ViamVjdHMgPSBfLmRpZmZlcmVuY2UoQF9zdWJqZWN0cywgbGF5ZXJzKVxuXHRcdFx0QHJlbW92ZVN1YmplY3Qoc3ViamVjdCkgZm9yIHN1YmplY3QgaW4gYWRpb3NTdWJqZWN0c1xuXHRcdFxuXHRcdFx0IyBkZWZpbmUgbmV3IHN1YmplY3RzXG5cdFx0XHRAYWRkU3ViamVjdChsYXllcikgZm9yIGxheWVyIGluIGxheWVyc1xuXHRcdFx0XG5cdFx0XHQjIGFkZCBsaW5rIHRvIG9ic2VydmVyIGluIHN1YmplY3QgbGF5ZXJzXG5cdFx0XHRzdWJqZWN0Lm9ic2VydmVyID0gQCBmb3Igc3ViamVjdCBpbiBAX3N1YmplY3RzXG5cblx0XHRcdCMgcmVtb3ZlIGZvY3VzZWQgc3ViamVjdCBpZiBuZXcgc3ViamVjdHMgZG9lc24ndCBpbmNsdWRlIGl0XG5cdFx0XHRpZiBub3QgXy5pbmNsdWRlcyhAX3N1YmplY3RzLCBAX2ZvY3VzZWRTdWJqZWN0KVxuXHRcdFx0XHRAX2ZvY3VzZWRTdWJqZWN0ID0gdW5kZWZpbmVkXG5cblx0X2lzRm9jdXNlZDogKHN1YmplY3QpIC0+IHJldHVybiBfLmluY2x1ZGVzKEBfZm9jdXNlZFN1YmplY3RzLCBzdWJqZWN0KVxuXG5cdCMgYWRkIGEgbGF5ZXIgdG8gYXJyYXkgb2YgZm9jdXNlZCBzdWJqZWN0cywgbWFraW5nIHJvb20gaWYgbmVjZXNzYXJ5XG5cdF9hZGRUb0ZvY3VzZWRTdWJqZWN0czogKHN1YmplY3QsIGluc3RhbnQgPSBmYWxzZSkgLT5cblx0XHQjIHRocm93IGFuIGVycm9yIGlmIGEgbm9uLWZvY3VzZWQgbGF5ZXIgd2FzIHNlbnQgaGVyZVxuXHRcdGlmIEBfaXNGb2N1c2VkKHN1YmplY3QpIGlzIHRydWUgdGhlbiB0aHJvdyBcIkZvY3VzZWQgb24gYSBmb2N1c2VkIHN1YmplY3QuIElzIHRoYXQgcmlnaHQ/XCJcblxuXHRcdCMgaWYgd2UncmUgYXQgdGhlIGxpbWl0IG9mIG91ciBmb2N1c2VkIHN1YmplY3RzLi4uXG5cdFx0aWYgXy5zaXplKEBfZm9jdXNlZFN1YmplY3RzKSA+PSBAX21heEZvY3VzZWRcblx0XHRcdCMgcmVtb3ZlIHRoZSBzdWJzY3JpYmUgZnJvbSB0aGUgZnJvbnQgb2YgdGhlIGxpc3QgYW5kIHNldCBpdCBhcyB1bmZvY3VzZWRcblx0XHRcdEBfc2V0Rm9jdXNlZChAX2ZvY3VzZWRTdWJqZWN0c1swXSwgZmFsc2UsIGluc3RhbnQpXG5cdFx0XHQjIHJlcGVhdCB1bnRpbCB3ZSBoYXZlIHJvb20gZm9yIGEgbmV3IGZvY3VzZWQgc3ViamVjdFxuXHRcdFx0QF9hZGRUb0ZvY3VzZWRTdWJqZWN0cyhzdWJqZWN0LCBpbnN0YW50KVxuXHRcdFxuXHRcdCMgaWYgKG9yIHdoZW4pIHRoZXJlIGlzIHJvb20uLi5cblx0XHRlbHNlXG5cdFx0XHQjIGFkZCB0aGUgbmV3IGZvY3VzZWQgc3ViamVjdCB0byB0aGUgZW5kIG9mIHRoZSBsaXN0XG5cdFx0XHRAX2ZvY3VzZWRTdWJqZWN0cy5wdXNoKHN1YmplY3QpXG5cdFx0XHRpZiBAX25vdGlmeU9uRm9jdXMgaXMgdHJ1ZSB0aGVuIEBub3RpZnlTdWJqZWN0cygpXG5cblx0IyByZW1vdmUgYSBsYXllciBmcm9tIGFycmF5IG9mIGZvY3VzZWQgc3ViamVjdHNcblx0X3JlbW92ZUZyb21Gb2N1c2VkU3ViamVjdHM6IChzdWJqZWN0LCBpbnN0YW50ID0gZmFsc2UpIC0+XG5cdFx0IyB0aHJvdyBhbiBlcnJvciBpZiBhIG5vbi1mb2N1c2VkIGxheWVyIHdhcyBzZW50IGhlcmVcblx0XHRpZiBAX2lzRm9jdXNlZChzdWJqZWN0KSBpcyBmYWxzZSB0aGVuIHRocm93IFwiVHJpZWQgdG8gcmVtb3ZlIGEgbGF5ZXIgdGhhdCB3YXNuJ3QgZm9jdXNlZC5cIlxuXHRcdFxuXHRcdCMgcmVtb3ZlIHRoZSBmb2N1c2VkIGxheWVyIGFuZCBzZXQgaXQgYXMgdW5mb2N1c2VkXG5cdFx0Xy5wdWxsKEBfZm9jdXNlZFN1YmplY3RzLCBzdWJqZWN0KVxuXHRcblxuXHRcblxuXG5leHBvcnRzLkZvY3VzQ29tcG9uZW50ID0gRm9jdXNDb21wb25lbnRcblxuIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFFQUE7QURBQSxJQUFBLGNBQUE7RUFBQTs7O0FBQU07OztFQUNRLHdCQUFDLE9BQUQ7QUFJWixRQUFBOztNQUphLFVBQVU7O0lBSXZCLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsZ0JBQUQsR0FBb0I7SUFFcEIsSUFBQyxDQUFBLFdBQUQsOENBQW9DO0lBQ3BDLElBQUMsQ0FBQSxPQUFELDRDQUE0QjtJQUM1QixJQUFDLENBQUEsV0FBRCxnREFBb0M7SUFDcEMsSUFBQyxDQUFBLFFBQUQsNkNBQThCO0lBQzlCLElBQUMsQ0FBQSxRQUFELDZDQUE4QjtJQUM5QixJQUFDLENBQUEsZUFBRCxxRkFBNkM7TUFBQyxPQUFBLEVBQVMsQ0FBVjs7SUFDN0MsSUFBQyxDQUFBLGlCQUFELHVGQUFvRCxpRUFBSCxHQUFpQyxNQUFqQyxHQUFnRDtNQUFDLE9BQUEsRUFBUyxFQUFWOztJQUNqRyxJQUFDLENBQUEsYUFBRCw2Q0FBaUMsU0FBQTtBQUFHLGFBQU87SUFBVjtJQUNqQyxJQUFDLENBQUEsZUFBRCwrQ0FBcUMsU0FBQTtBQUFHLGFBQU87SUFBVjtJQUNyQyxJQUFDLENBQUEsY0FBRCw4Q0FBbUMsU0FBQTtBQUFHLGFBQU87SUFBVjtJQUNuQyxJQUFDLENBQUEsY0FBRCxxREFBMEM7SUFDMUMsSUFBQyxD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
