class FocusComponent extends Layer
	constructor: (options = {}) ->

		# TODO: allow focused / unfocused states other than states.focused and states.unfocused.

		@_uniqId = _.random(1000)
		@_subjects = []
		@_focusedSubjects = []

		@_maxFocused = options.maxFocused ? 1
		@_toggle = options.toggle ? true
		@_toggleLock = options.toggleLock ? false
		@_trigger = options.trigger ? 'Tap'
		@_release = options.release ? undefined
		@_defaultFocused = options.states?.focused ? {opacity: 1}
		@_defaultUnfocused = options.states?.unfocused ? if options.states?.focused? then undefined else {opacity: .5}
		@_defaultFocus = options.focus ? -> return null
		@_defaultUnfocus = options.unfocus ? -> return null
		@_defaultNotify = options.notify ? -> return null
		@_notifyOnFocus = options.notifyOnFocus ? true
		@_useFocusStates = options.useFocusStates ? true
		@_useFocusFunctions = options.useFocusFunctions ? true

		super _.defaults options,
			size: Screen.size
			backgroundColor: null

	
	# public functions


	# notify all subjects
	notifySubjects: (func = @_defaultNotify) -> do _.bind(func, subject) for subject in @_subjects

	# notify focused subjects
	notifyFocusedSubjects: (func = @_defaultFocus) -> do _.bind(func, subject) for subject in @_focusedSubjects
	
	# notify unfocused subjects
	notifyUnfocusedSubjects: (func = @_defaultUnfocus) -> do _.bind(func, subject) for subject in @_unfocusedSubjects
	
	# notify a specific set of subjects (TODO: remove?)
	notifySelected: (subjects = @_subjects, func = @_defaultNotify) -> 
		if typeof subjects is 'object' then subjects = [subjects]
		do _.bind(func, subject) for subject in @_subjects

	# get whether a subject is focused or unfocused
	isFocused: (subject) -> return @_isFocused(subject)

	# set a specific subject as focused or unfocused
	setFocused: (subject, bool = true, instant = false) -> @_setFocused(subject, bool, instant)

	# focus all unfocused subjects
	focusAll: (instant = false) -> @_setFocused(subject, true, instant) for subject in @_unfocusedSubjects

	# unfocus all focused subjects
	unfocusAll: (instant = false) -> @_setFocused(subject, false, instant) for subject in @_focusedSubjects

	# add a focus event to a subject
	addTrigger: (subject, eventName = @_trigger) -> subject.on Events[eventName], =>
		return if @_isFocused(subject) is true and @_toggle is false
		@_setFocused(subject, true)
	
	# remove a focus event from a subject
	removeTrigger: (subject, eventName = @_trigger) -> subject.off Events[eventName], =>
		return if @_isFocused(subject) is true and @_toggle is false
		@_setFocused(subject, true)

	# add a focus event from a subject
	addRelease: (subject, eventName = @_release) -> subject.on Events[eventName], =>
		return if @_isFocused(subject) is false
		@_setFocused(subject, false)

	# remove a focus event from a subject
	removeRelease: (subject, eventName = @_trigger) -> subject.off Events[eventName], =>
		return if @_isFocused(subject) is false
		@_setFocused(subject, true)
	
	# get whether a layer is a subject of this FocusComponent
	isSubject: (layer) -> return _isSubject(layer)

	# add a new subject to this FocusComponent
	addSubject: (newSubject, options = {}) ->
		trigger = options.trigger ? @_trigger
		release = options.release ? @_release
		focused = options.focused ? false
		focusedState = options.focusedState ? newSubject.states?.focused
		unfocusedState = options.unfocusedState ? newSubject.states?.unfocused

		# set event trigger (event name provided in options or default event name)
		@addTrigger(newSubject, trigger)
		if release? then @addRelease(newSubject, release)

		# set focused / unfocused layer states (states provided in options, or existing states or default states)
		newSubject.states["_focused#{@_uniqId}"] = focusedState ? @_defaultFocused
		newSubject.states["_unfocused#{@_uniqId}"] = unfocusedState ? @_defaultUnfocused ? newSubject.states.default

		# store reference to this FocusComponent
		newSubject[@name] = @

		# add layer to subjects array
		@_subjects.push(newSubject)

		# if this subject should start as focused, set it as focused
		if focused is true then @_setFocused(newSubject, focused, true)
		else # create unfocused effects
			if @_useFocusStates is true then newSubject.stateSwitch("_unfocused#{@_uniqId}")
			# skip this # if @_useFocusFunctions is true then @_unfocus(newSubject)

		# emit an event on FocusComponent
		@emit("change:subjects", newSubject, @_subjects)

	# remove a subject from this FocusComponent
	removeSubject: (subject) ->

		# throw a warning when trying to remove a layer isn't a subject
		if _.includes(@_subjects, subject) is false
			if subject instanceof Layer is true then throw "That layer (#{layer.name ? layer}, id: #{layer.id}) isn't a subject."
			# throw a more descriptive error if the layer isn't a layer.
			else throw "That isn't a layer. Observer can only remove layers that are on its list of subject layers."
		
		if @_isFocused(subject) then @_removeFromFocusedSubjects(subject, false)

		# remove reference to this FocusComponent
		subject[@name] = @

		# remove from list of subjects
		_.pull(@_subjects, subject)
		# remove focusComponent trigger (TODO: remove all added triggers, not just most recent)
		@removeTrigger(subject)
		if @_release? then @removeRelease(subject)

		# emit an event on FocusComponent
		@emit("change:subjects", subject, @_subjects)


	# public properties

	@define "trigger",
		get: -> return @_trigger
		set: (eventName) ->
			if typeof eventName isnt 'string' then throw "FocusComponent.trigger requires an event name as string, like 'Tap' or 'MouseOver'."
			# set trigger as default trigger, to be given to all new subjects
			@_trigger = eventName 


	@define "notify",
		get: -> return @_defaultNotify
		set: (func) ->
			if typeof func isnt 'function' then throw "FocusComponent.notify requires a function value."
			# set function as default notify, to be run by all new subjects
			@_defaultNotify = func


	@define "notifyOnFocus",
		get: -> return @_notifyOnFocus
		set: (bool) ->
			if typeof bool isnt 'boolean' then throw "FocusComponent.notifyOnFocus requires a boolean (true or false) value."
			# set function as default notify, to be run by all new subjects
			@_notifyOnFocus = bool


	@define "maxFocused",
		get: -> return @_maxFocused
		set: (number) ->
			if typeof number isnt 'number' then throw "FocusComponent.maxFocused requires a number value."
			# set function as default notify, to be run by all new subjects
			@_maxFocused = number


	@define "toggleLock",
		get: -> return @_toggleLock
		set: (bool) ->
			if typeof bool isnt 'boolean' then throw "FocusComponent.toggleLock requires a boolean (true or false) value."
			# set function as default notify, to be run by all new subjects
			@_toggleLock = bool


	@define "useFocusFunctions",
		get: -> return @_useFocusFunctions
		set: (bool) ->
			if typeof bool isnt 'boolean' then throw "FocusComponent.useFocusFunctions requires a boolean (true or false) value."
			# set function as default notify, to be run by all new subjects
			@_useFocusFunctions = bool


	# get current default focus function, used by all subjects, or set a new one
	@define "focus",
		get: -> return @_defaultFocus
		set: (func) -> 
			if typeof func isnt 'function' then throw "FocusComponent.focus requires a function value."
			# set function as default focus, to be run by all new subjects when focused
			@_defaultFocus = func


	# get current default unfocus function, used by all subjects, or set a new one
	@define "unfocus",
		get: -> return @_defaultUnfocus
		set: (func) -> 
			if typeof func isnt 'function' then throw "FocusComponent.unfocus requires a function value."
			
			# set function as default unfocus, to be run by all new subjects when unfocused
			@_defaultUnfocus = func


	# get current focused subjects or set focused subjects
	@define "focused",
		get: -> return @_focusedSubjects
		set: (subject, bool = false) ->
			# accepts arrays, so make an array if not given one
			if _.isArray(subjects) is false then subjects = [subjects]

			# focus on any of the layers that aren't focused already
			subjects.forEach (subject) => 
				switch @_isFocused(subject) 
					when undefined then throw 'FocusComponet.focused requires subjects to set as focused.'
					when false then @_addToFocusedSubjects(subject, bool)


	# get current unfocused subjects
	@define "unfocused",
		get: -> return _.without(@_subjects, @_focusedSubjects)
		set: (subjects, bool = false) ->
			# accepts arrays, so make an array if not given one
			if _.isArray(subjects) is false then subjects = [subjects]

			# unfocus any of the subjects that are focused
			subjects.forEach (subject) => 
				switch @_isFocused(subject) 
					when undefined then throw 'FocusComponet.unfocused requires subjects to set as unfocused.'
					when true then @_removeFromFocusedSubjects(subject, bool)


	@define "useFocusStates",
		get: -> return @_useFocusStates
		set: (bool) -> 
			if typeof bool isnt 'boolean' then throw "FocusComponent.useFocusStates requires a boolean value."
			@_useFocusStates = bool


	# get or set the array of subjects ( needs work )
	@define "subjects",
		get: -> return @_subjects
		set: (layers) ->
			# throw error if layers isnt an array
			if _.isArray(layers) is false or layers.length < 0 then throw 'Subjects requires an array.'

			# preserve focused subjects that are also included in the new layers array
			@_focusedSubjects = _.intersection(@_focusedSubjects, layers)
			
			# remove existing subjects that are not on the new list
			adiosSubjects = _.difference(@_subjects, layers)
			@removeSubject(subject) for subject in adiosSubjects
		
			# define new subjects
			@addSubject(layer) for layer in layers

			# remove focused subject if new subjects doesn't include it
			if not _.includes(@_subjects, @_focusedSubject)
				@_focusedSubject = undefined


	# private functions


	# run focus function for subject
	_focus: (subject) -> do _.bind(@_defaultFocus, subject)


	# run unfocus function for subject
	_unfocus: (subject) -> do _.bind(@_defaultUnfocus, subject)


	# set focused state of a subject
	_setFocused: (subject, bool=true, instant = false) ->
		# if the subject's focus state should be focused...
		if bool is true
			# if subject is already focused...
			if @_isFocused(subject) is true
				# if toggle mode is on, unfocus the subject
				if @_toggle is true then @_setFocused(subject, false, instant)
				# either way, return
				return null

			# cancel new focus if toggle lock is on
			return if _.size(@_focusedSubjects) >= @_maxFocused and @_toggleLock is true

			# if the subject isn't already focused, add it to focused subjects
			@_addToFocusedSubjects(subject, instant)
			
			# emit an event on the subject
			subject.emit("change:focused", bool)
			
			# and if focused states are being used...
			if @_useFocusStates is true
				# either switch or animate to focused state, depending on the instant argument
				if instant then subject.stateSwitch("_focused#{@_uniqId}") else subject.animate("_focused#{@_uniqId}")
			# and if focus functions are being used... run focus function for subject
			if @_useFocusFunctions is true then @_focus(subject) 

		# if the subject's focus state should be unfocused...
		else
			# if the subject is already unfocused... do nothing
			return if @_isFocused(subject) is false

			# if the subject is focused, remove it from focused subjects
			@_removeFromFocusedSubjects(subject, instant) 

			# emit an event on the subject
			subject.emit("change:focused", bool)

			# and if focused states are being used...
			if @_useFocusStates is true
				# either switch or animate to the unfocused state, depending on the instant argument
				if instant then subject.stateSwitch("_unfocused#{@_uniqId}") else subject.animate("_unfocused#{@_uniqId}")
			# and if focus functions are being used... run the unfocus function for subject
			if @_useFocusFunctions is true then @_unfocus(subject)


	# get whether a subject is focused or not
	_isFocused: (subject) -> return _.includes(@_focusedSubjects, subject)

	# get whether a layer is a subject of this FocusComponent
	_isSubject: (layer) -> return _.includes(@_subjects, layer)


	# add a layer to array of focused subjects, making room if necessary
	_addToFocusedSubjects: (subject, instant = false) ->
		# throw an error if a focused layer was sent here
		if @_isFocused(subject) is true then throw "Focused on a focused subject. Is that right?"

		# if we're at the limit of our focused subjects...
		if _.size(@_focusedSubjects) >= @_maxFocused
			# remove the subscribe from the front of the list and set it as unfocused
			@_setFocused(@_focusedSubjects[0], false, instant)
			# repeat until we have room for a new focused subject
			@_addToFocusedSubjects(subject, instant)
		
		# if (or when) there is room...
		else
			# add the new focused subject to the end of the list
			@_focusedSubjects.push(subject)

			# emit an event on the FocusComponent
			@emit("change:focused", subject, @_focusedSubjects)

			# notify subjects if 
			if @_notifyOnFocus is true then @notifySubjects()


	# remove a layer from array of focused subjects
	_removeFromFocusedSubjects: (subject, instant = false) ->
		# throw an error if a non-focused layer was sent here
		if @_isFocused(subject) is false then throw "Tried to remove a layer that wasn't focused."
		
		# remove the focused subjectd
		_.pull(@_focusedSubjects, subject)

		# emit an event on the FocusComponent
		@emit("change:unfocused", subject, @_unfocusedSubjects)
	

	


exports.FocusComponent = FocusComponent

