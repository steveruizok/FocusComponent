class FocusComponent extends Layer
	constructor: (options = {}) ->

		# The FocusComponent may focus on one or more subjects at a time.

		@_subjects = []
		@_focusedSubjects = []

		@_maxFocused = options.maxFocused ? 1
		@_toggle = options.toggle ? true
		@_trigger = options.trigger ? 'Tap'
		@_focusTrigger = options.focusTrigger ? @_trigger
		@_unfocusTrigger = options.unfocusTrigger ? @_trigger
		@_defaultFocused = options.states?.focused ? {opacity: 1}
		@_defaultUnfocused = options.states?.unfocused ? if options.states?.focused? then undefined else {opacity: .5}
		@_defaultFocus = options.focus ? -> return null
		@_defaultUnfocus = options.unfocus ? -> return null
		@_defaultNotify = options.notify ? -> return null
		@_notifyOnFocus = options.notifyOnFocus ? true
		@_useFocusStates = options.useFocusStates ? true
		@_useFocusFunctions = options.useFocusFunctions ? true

		super _.defaults options,
			name: '.'
			size: Screen.size
			backgroundColor: null

	# notify subjects
	notifyFocusedSubjects: (func = @_defaultFocus) -> do _.bind(func, subject) for subject in @_focusedSubjects
	notifyUnfocusedSubjects: (func = @_defaultUnfocus) -> do _.bind(func, subject) for subject in @_unfocusedSubjects
	notifySubjects: (func = @_defaultNotify) -> do _.bind(func, subject) for subject in @_subjects
	notifySelected: (subjects = @_subjects, func = @_defaultNotify) -> 
		if typeof subjects is 'object' then subjects = [subjects]
		do _.bind(func, subject) for subject in @_subjects

	# unfocus all focused subjects
	unfocusAll: (instant = false) -> @_setFocused(false, instant) for subject in @_focusedSubjects

	# run focus function for subject
	_focus: (subject) -> do _.bind(@_defaultFocus, subject)

	# run unfocus function for subject
	_unfocus: (subject) -> do _.bind(@_defaultUnfocus, subject)

	# add or remove focus triggers to a subject
	addFocusTrigger: (subject, eventName = @_focusTrigger) -> subject.on Events[eventName], => @_setFocused(subject, true)
	removeFocusTrigger: (subject, eventName = @_focusTrigger) -> subject.off Events[eventName], => @_setFocused(subject, true)

	# add or remove unfocus triggers from a subject
	addUnfocusTrigger: (subject, eventName = @_unfocusTrigger) -> subject.on Events[eventName], => @_setFocused(subject, false)
	removeUnfocusTrigger: (subject, eventName = @_unfocusTrigger) -> subject.off Events[eventName], => @_setFocused(subject, false)


	# set focused state of a subject, cha
	_setFocused: (subject, bool, instant) ->
		# if the subject's focus state should be focused...
		if bool is true
			# if subject is already focused...
			if @_isFocused(subject) is true
				# if toggle mode is on, unfocus the subject
				if @_toggle is true then @_setFocused(subject, false, instant)
				# either way, return
				return null

			# if the subject isn't already focused, add it to focused subjects
			@_addToFocusedSubjects(subject, instant)
			# and if focused states are being used...
			if @_useFocusStates is true
				# either switch or animate to focused state, depending on the instant argument
				if instant then subject.stateSwitch('focused') else subject.animate('focused')
			# and if focus functions are being used... run focus function for subject
			if @_useFocusFunctions is true then @_focus(subject) 

		# if the subject's focus state should be unfocused...
		else
			# if the subject is already unfocused, do nothing
			if @_isFocused(subject) is false then return null

			# if it is, remove it from focused subjects
			@_removeFromFocusedSubjects(subject) 

			# and if focused states are being used...
			if @_useFocusStates is true
				# either switch or animate to the unfocused state, depending on the instant argument
				if instant then subject.stateSwitch('unfocused') else subject.animate('unfocused')
			# and if focus functions are being used... run the unfocus function for subject
			if @_useFocusFunctions is true then @_unfocus(subject)

	# add a new subject to this observer
	addSubject: (newSubject, options = {}) ->
		focusTrigger = options.focusTrigger ? @_focusTrigger
		unfocusTrigger = options.focusTrigger ? @_unfocusTrigger
		focused = options.focused ? false
		focusedState = options.focusedState ? newSubject.states.focused
		unfocusedState = options.unfocusedState ? newSubject.states.unfocused

		# throw an error if layer isn't a layer
		if newSubject instanceof Layer is false then throw "Observer can only add layers to its list of subjects. #{layer}, id #{layer.id} is not a layer."

		# set event trigger (event name provided in options or default event name)
		@addFocusTrigger(newSubject, focusTrigger)
		@addUnfocusTrigger(newSubject, unfocusTrigger)

		# set focused / unfocused layer states (states provided in options, or existing states or default states)
		newSubject.states.focused = focusedState ? @_defaultFocused
		newSubject.states.unfocused = unfocusedState ? @_defaultUnfocused ? newSubject.states.default

		# add layer to subjects array
		@_subjects.push(newSubject)

		# if this subject should start as focused, set it as focused
		@_setFocused(newSubject, focused, true)
		if @_useFocusStates is true then newSubject.stateSwitch('unfocused')
		if @_useFocusFunctions is true then @_unfocus(newSubject)


	# remove a subject from this observer
	removeSubject: (layer) ->

		# throw a warning when trying to remove a layer isn't a subject
		if _.includes(@_subjects, layer) is false
			if layer instanceof Layer is true then throw "That layer (#{layer.name ? layer}, id: #{layer.id}) isn't a subject."
			# throw a more descriptive error if the layer isn't a layer.
			else throw "That isn't a layer. Observer can only remove layers that are on its list of subject layers."
		
		if @_isFocused(layer) then @_removeFromFocusedSubjects(layer, false)

		# remove from list of subjects
		_.pull(@_subjects, layer)
		# remove observer property
		layer.observer = undefined
		# remove observer functions
		layer.focus = undefined
		layer.unfocus = undefined
		layer.notify = undefined
		layer.removeFocusTrigger(layer._trigger)

	@define "notify",
		get: -> return @_defaultNotify
		set: (func) ->
			if typeof func isnt 'function' then throw "ObserverComponent.notify requires a function value."
			# set function as default notify, to be run by all new subjects
			@_defaultNotify = func


	@define "notifyOnFocus",
		get: -> return @_notifyOnFocus
		set: (bool) ->
			if typeof bool isnt 'boolean' then throw "ObserverComponent.notifyOnFocus requires a boolean (true or false) value."
			# set function as default notify, to be run by all new subjects
			@_notifyOnFocus = bool


	@define "maxFocused",
		get: -> return @_maxFocused
		set: (number) ->
			if typeof number isnt 'number' then throw "ObserverComponent.maxFocused requires a number value."
			# set function as default notify, to be run by all new subjects
			@_maxFocused = number


	@define "useFocusFunctions",
		get: -> return @_useFocusFunctions
		set: (bool) ->
			if typeof bool isnt 'boolean' then throw "ObserverComponent.focusFunctions requires a boolean (true or false) value."
			# set function as default notify, to be run by all new subjects
			@_useFocusFunctions = bool


	# get current default focus function, used by all subjects, or set a new one
	@define "focus",
		get: -> return @_defaultFocus
		set: (func) -> 
			if typeof func isnt 'function' then throw "ObserverComponent.focus requires a function value."
			# set function as default focus, to be run by all new subjects when focused
			@_defaultFocus = func


	# get current default unfocus function, used by all subjects, or set a new one
	@define "unfocus",
		get: -> return @_defaultUnfocus
		set: (func) -> 
			if typeof func isnt 'function' then throw "ObserverComponent.unfocus requires a function value."
			
			# set function as default unfocus, to be run by all new subjects when unfocused
			@_defaultUnfocus = func


	# get current focused subjects or set focused subjects
	@define "focused",
		get: -> return @_focusedSubjects
		set: (layers) ->
			# accepts arrays, so make an array if not given one
			if _.isArray(layers) is false then layers = [layers]

			# focus on any of the layers that aren't focused already
			layers.forEach (layer) => if @_isFocused(layer) is false then @_addToFocusedSubjects(layer, true)


	# get current unfocused subjects
	@define "unfocused",
		get: -> return _.without(@_subjects, @_focusedSubjects)
		set: (layers) ->
			# accepts arrays, so make an array if not given one
			if _.isArray(layers) is false then layers = [layers]

			# unfocus any of the layers that are focused
			layers.forEach (layer) => if @_isFocused(layer) is true then @_removeFromFocusedSubjects(layer, true)


	@define "useFocusStates",
		get: -> return @_useFocusStates
		set: (bool) -> 
			if typeof bool isnt 'boolean' then throw "ObserverComponent.useFocusStates requires a boolean value."
			@_useFocusStates = bool


	# get or set default focused state added to new subjects
	@define "focusedState",
		get: -> return @_defaultFocused
		set: (state = {}) -> 
			if typeof state isnt 'object' then throw "ObserverComponent.focusState requires an object (a Layer state)."
			@_defaultFocused = state


	# get or set default unfocused state added to new subjects
	@define "unfocusedState",
		get: -> return @_defaultUnfocused
		set: (state = {}) -> 
			if typeof state isnt 'object' then throw "ObserverComponent.focusState requires an object (a Layer state)."
			@_defaultUnfocused = state
	

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
			
			# add link to observer in subject layers
			subject.observer = @ for subject in @_subjects

			# remove focused subject if new subjects doesn't include it
			if not _.includes(@_subjects, @_focusedSubject)
				@_focusedSubject = undefined

	_isFocused: (layer) -> return _.includes(@_focusedSubjects, layer)

	# add a layer to array of focused subjects, making room if necessary
	_addToFocusedSubjects: (layer, instant = false) ->
		# throw an error if a non-focused layer was sent here
		if @_isFocused(layer) is true then throw "Focused on a focused subject. Is that right?"

		# if we're at the limit of our focused subjects...
		if _.size(@_focusedSubjects) >= @_maxFocused
			# remove the subscribe from the front of the list and set it as unfocused
			@_setFocused(@_focusedSubjects[0], false, instant)
			# repeat until we have room for a new focused subject
			@_addToFocusedSubjects(layer, instant)
		
		# if (or when) there is room...
		else
			# add the new focused subject to the end of the list
			@_focusedSubjects.push(layer)
			if @_notifyOnFocus is true then @notifySubjects()

	# remove a layer from array of focused subjects
	_removeFromFocusedSubjects: (layer, instant = false) ->
		# throw an error if a non-focused layer was sent here
		if @_isFocused(layer) is false then throw "Tried to remove a layer that wasn't focused."
		
		# remove the focused layer and set it as unfocused
		_.pull(@_focusedSubjects, layer)
	

	


exports.ObserverComponent = ObserverComponent

