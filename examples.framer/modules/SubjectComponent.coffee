class ObserverComponent extends Layer
	constructor: (options = {}) ->

		@_subscribers = []
		@_focusedSubscribers = []

		@_maxFocused = options.maxFocused ? 1
		@_toggle = options.toggle ? true
		@_trigger = options.trigger ? 'Tap'
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

	# notify subscribers
	notifyFocusedSubscribers: (func = @_defaultFocus) -> do _.bind(func, subscriber) for subscriber in @_focusedSubscribers
	notifyUnfocusedSubscribers: (func = @_defaultUnfocus) -> do _.bind(func, subscriber) for subscriber in @_unfocusedSubscribers
	notifySubscribers: (func = @_defaultNotify) -> do _.bind(func, subscriber) for subscriber in @_subscribers
	notifySelected: (subscribers = @_subscribers, func = @_defaultNotify) -> 
		if typeof subscribers is 'object' then subscribers = [subscribers]
		do _.bind(func, subscriber) for subscriber in @_subscribers

	# unfocus all focused subscribers
	unfocusAll: (instant = false) -> @_setFocused(false, instant) for subscriber in @_focusedSubscribers

	# run focus function for subscriber
	_focus: (subscriber) -> do _.bind(@_defaultFocus, subscriber)

	# run unfocus function for subscriber
	_unfocus: (subscriber) -> do _.bind(@_defaultUnfocus, subscriber)

	# add or remove focus triggers to a subscriber
	addFocusTrigger: (subscriber, eventName = @_trigger) -> subscriber.on Events[eventName], => @_setFocused(subscriber, true)
	removeFocusTrigger: (subscriber, eventName = @_trigger) -> subscriber.off Events[eventName], => @_setFocused(subscriber, true)


	# set focused state of a subscriber, cha
	_setFocused: (subscriber, bool, instant) ->
		# if the subscriber's focus state should be focused...
		if bool is true
			# if subscriber is already focused...
			if @_isFocused(subscriber) is true
				# if toggle mode is on, unfocus the subscriber
				if @_toggle is true then @_setFocused(subscriber, false, instant)
				# either way, return
				return null

			# if the subscriber isn't already focused, add it to focused subscribers
			@_addToFocusedSubscribers(subscriber, instant)
			# and if focused states are being used...
			if @_useFocusStates is true
				# either switch or animate to focused state, depending on the instant argument
				if instant then subscriber.stateSwitch('focused') else subscriber.animate('focused')
			# and if focus functions are being used... run focus function for subscriber
			if @_useFocusFunctions is true then @_focus(subscriber) 

		# if the subscriber's focus state should be unfocused...
		else
			# if the subscriber is already unfocused, do nothing
			if @_isFocused(subscriber) is false then return null

			# if it is, remove it from focused subscribers
			@_removeFromFocusedSubscribers(subscriber) 

			# and if focused states are being used...
			if @_useFocusStates is true
				# either switch or animate to the unfocused state, depending on the instant argument
				if instant then subscriber.stateSwitch('unfocused') else subscriber.animate('unfocused')
			# and if focus functions are being used... run the unfocus function for subscriber
			if @_useFocusFunctions is true then @_unfocus(subscriber)

	# add a new subscriber to this observer
	addSubscriber: (newSubscriber, options = {}) ->
		trigger = options.trigger ? @_trigger
		focused = options.focused ? false
		focusedState = options.focusedState ? newSubscriber.states.focused
		unfocusedState = options.unfocusedState ? newSubscriber.states.unfocused

		# throw an error if layer isn't a layer
		if newSubscriber instanceof Layer is false then throw "Observer can only add layers to its list of subscribers. #{layer}, id #{layer.id} is not a layer."

		# set event trigger (event name provided in options or default event name)
		@addFocusTrigger(newSubscriber, trigger)

		# set focused / unfocused layer states (states provided in options, or existing states or default states)
		newSubscriber.states.focused = focusedState ? @_defaultFocused
		newSubscriber.states.unfocused = unfocusedState ? @_defaultUnfocused ? newSubscriber.states.default

		# add layer to subscribers array
		@_subscribers.push(newSubscriber)

		# if this subscriber should start as focused, set it as focused
		@_setFocused(newSubscriber, focused, true)
		if @_useFocusStates is true then newSubscriber.stateSwitch('unfocused')
		if @_useFocusFunctions is true then @_unfocus(newSubscriber)


	# remove a subscriber from this observer
	removeSubscriber: (layer) ->

		# throw a warning when trying to remove a layer isn't a subscriber
		if _.includes(@_subscribers, layer) is false
			if layer instanceof Layer is true then throw "That layer (#{layer.name ? layer}, id: #{layer.id}) isn't a subscriber."
			# throw a more descriptive error if the layer isn't a layer.
			else throw "That isn't a layer. Observer can only remove layers that are on its list of subscriber layers."
		
		if @_isFocused(layer) then @_removeFromFocusedSubscribers(layer, false)

		# remove from list of subscribers
		_.pull(@_subscribers, layer)
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
			# set function as default notify, to be run by all new subscribers
			@_defaultNotify = func


	@define "notifyOnFocus",
		get: -> return @_notifyOnFocus
		set: (bool) ->
			if typeof bool isnt 'boolean' then throw "ObserverComponent.notifyOnFocus requires a boolean (true or false) value."
			# set function as default notify, to be run by all new subscribers
			@_notifyOnFocus = bool


	@define "maxFocused",
		get: -> return @_maxFocused
		set: (number) ->
			if typeof number isnt 'number' then throw "ObserverComponent.maxFocused requires a number value."
			# set function as default notify, to be run by all new subscribers
			@_maxFocused = number


	@define "useFocusFunctions",
		get: -> return @_useFocusFunctions
		set: (bool) ->
			if typeof bool isnt 'boolean' then throw "ObserverComponent.focusFunctions requires a boolean (true or false) value."
			# set function as default notify, to be run by all new subscribers
			@_useFocusFunctions = bool


	# get current default focus function, used by all subscribers, or set a new one
	@define "focus",
		get: -> return @_defaultFocus
		set: (func) -> 
			if typeof func isnt 'function' then throw "ObserverComponent.focus requires a function value."
			# set function as default focus, to be run by all new subscribers when focused
			@_defaultFocus = func


	# get current default unfocus function, used by all subscribers, or set a new one
	@define "unfocus",
		get: -> return @_defaultUnfocus
		set: (func) -> 
			if typeof func isnt 'function' then throw "ObserverComponent.unfocus requires a function value."
			
			# set function as default unfocus, to be run by all new subscribers when unfocused
			@_defaultUnfocus = func


	# get current focused subscribers or set focused subscribers
	@define "focused",
		get: -> return @_focusedSubscribers
		set: (layers) ->
			# accepts arrays, so make an array if not given one
			if _.isArray(layers) is false then layers = [layers]

			# focus on any of the layers that aren't focused already
			layers.forEach (layer) => if @_isFocused(layer) is false then @_addToFocusedSubscribers(layer, true)


	# get current unfocused subscribers
	@define "unfocused",
		get: -> return _.without(@_subscribers, @_focusedSubscribers)
		set: (layers) ->
			# accepts arrays, so make an array if not given one
			if _.isArray(layers) is false then layers = [layers]

			# unfocus any of the layers that are focused
			layers.forEach (layer) => if @_isFocused(layer) is true then @_removeFromFocusedSubscribers(layer, true)


	@define "useFocusStates",
		get: -> return @_useFocusStates
		set: (bool) -> 
			if typeof bool isnt 'boolean' then throw "ObserverComponent.useFocusStates requires a boolean value."
			@_useFocusStates = bool


	# get or set default focused state added to new subscribers
	@define "focusedState",
		get: -> return @_defaultFocused
		set: (state = {}) -> 
			if typeof state isnt 'object' then throw "ObserverComponent.focusState requires an object (a Layer state)."
			@_defaultFocused = state


	# get or set default unfocused state added to new subscribers
	@define "unfocusedState",
		get: -> return @_defaultUnfocused
		set: (state = {}) -> 
			if typeof state isnt 'object' then throw "ObserverComponent.focusState requires an object (a Layer state)."
			@_defaultUnfocused = state
	

	# get or set the array of subscribers ( needs work )
	@define "subscribers",
		get: -> return @_subscribers
		set: (layers) ->
			# throw error if layers isnt an array
			if _.isArray(layers) is false or layers.length < 0 then throw 'Subscribers requires an array.'

			# preserve focused subscribers that are also included in the new layers array
			@_focusedSubscribers = _.intersection(@_focusedSubscribers, layers)
			
			# remove existing subscribers that are not on the new list
			adiosSubscribers = _.difference(@_subscribers, layers)
			@removeSubscriber(subscriber) for subscriber in adiosSubscribers
		
			# define new subscribers
			@addSubscriber(layer) for layer in layers
			
			# add link to observer in subscriber layers
			subscriber.observer = @ for subscriber in @_subscribers

			# remove focused subscriber if new subscribers doesn't include it
			if not _.includes(@_subscribers, @_focusedSubscriber)
				@_focusedSubscriber = undefined

	_isFocused: (layer) -> return _.includes(@_focusedSubscribers, layer)

	# add a layer to array of focused subscribers, making room if necessary
	_addToFocusedSubscribers: (layer, instant = false) ->
		# throw an error if a non-focused layer was sent here
		if @_isFocused(layer) is true then throw "Focused on a focused subscriber. Is that right?"

		# if we're at the limit of our focused subscribers...
		if _.size(@_focusedSubscribers) >= @_maxFocused
			# remove the subscribe from the front of the list and set it as unfocused
			@_setFocused(@_focusedSubscribers[0], false, instant)
			# repeat until we have room for a new focused subscriber
			@_addToFocusedSubscribers(layer, instant)
		
		# if (or when) there is room...
		else
			# add the new focused subscriber to the end of the list
			@_focusedSubscribers.push(layer)
			if @_notifyOnFocus is true then @notifySubscribers()

	# remove a layer from array of focused subscribers
	_removeFromFocusedSubscribers: (layer, instant = false) ->
		# throw an error if a non-focused layer was sent here
		if @_isFocused(layer) is false then throw "Tried to remove a layer that wasn't focused."
		
		# remove the focused layer and set it as unfocused
		_.pull(@_focusedSubscribers, layer)
	

	


exports.ObserverComponent = ObserverComponent

