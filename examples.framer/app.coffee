# Import file "sketch-assets"
sketch = Framer.Importer.load("imported/sketch-assets@2x", scale: 1)

# Focus Component Demo
# @steveruizok

# Simplify common UI tasks.

{FocusComponent} = require 'FocusComponent'

Framer.Extras.Preloader.enable()

# PageComponent

pager = new PageComponent
	frame: Screen.frame
	scrollVertical: false
	scrollHorizontal: false

# Current page text

currentPage = new TextLayer
	x: Align.center, y: Align.bottom(-44)
	fontSize: 22, color: '#FFF'
	text: 'Page 0'
	
currentPage.update = ->
	@text = "Page #{pager.horizontalPageIndex(pager.currentPage) + 1} of #{pager.content.children.length}"
	@x = Align.center()

pager.on "change:currentPage", ->
	currentPage.update()

# Next Button

nextButton = new TextLayer
	name: 'Next'
	x: Align.right(-40), y: Align.bottom(-40)
	height: 40
	fontSize: 40, fontWeight: 400, fontFamily: 'Avenir Next'
	textAlign: 'center', color: '#FFF'
	text: '▶'

nextButton.onTap -> pager.snapToNextPage()

# Next Button

prevButton = new TextLayer
	name: 'Previous'
	x: 40, y: Align.bottom(-40)
	height: 40
	fontSize: 40, fontWeight: 400, fontFamily: 'Avenir Next'
	textAlign: 'center', color: '#FFF'
	text: '◀'

prevButton.onTap -> pager.snapToPreviousPage()

# Page

class Page extends Layer
	constructor: (codeImage, options = {}) ->
		super _.defaults options,
			frame: Screen.frame
			backgroundColor: '#1E1E1E'
			
		@buttons = []
		@codeImage = codeImage ? null
		
		for i in [0..8]
			@buttons[i] = new TextLayer
				name: '.', parent: @
				height: 90, width: 90, borderRadius: 12
				x: Align.center(-100 + (100 * (i % 3))), 
				y: 32 + 100 * _.floor(i / 3)
				backgroundColor: 'rgba(32, 186, 255, 1)'
				text: "#{i}", fontSize: 26
				textAlign: 'center', fontFamily: 'Avenir', color: '#FFF'
				padding: {top: 28}
				animationOptions: 
					time: .25
		
		@label = new TextLayer
			name: '.', parent: @
			x: @buttons[0].x, y: _.last(@buttons).maxY + 12
			fontSize: 20, color: '#FFF', text: ''
		
		@code = sketch?[@codeImage]
		@code?.props =
			parent: @
			visible: true
		
		pager.addPage(@)
		currentPage.update()



# page 1, basic focus component

page = new Page 'basic'

focus1 = new FocusComponent
	subjects: page.buttons



# page 2, toggle

page = new Page 'toggle'

focus2 = new FocusComponent
	subjects: page.buttons
	toggle: false



# page 3, toggle lock

page = new Page 'toggleLock'

focus3 = new FocusComponent
	subjects: page.buttons
	toggleLock: true



# page 4, maxFocused

page = new Page 'maxFocused'

focus4 = new FocusComponent
	subjects: page.buttons
	maxFocused: 3



# page 5, focus and unfocus functions

page = new Page 'functions'
label5 = page.label

focus5 = new FocusComponent
	subjects: page.buttons
	focus: -> label5.text = 'Current Focused: Button ' + @text
	unfocus: -> label5.text = 'Current Focused: None'



# page 6 - multiple focus components

page = new Page 'multiple'

focus6_1 = new FocusComponent
	subjects: page.buttons
	trigger: 'MouseOver'

focus6_2 = new FocusComponent
	subjects: page.buttons
	focus: -> @backgroundColor = 'red'
	unfocus: -> @backgroundColor = 'rgba(32, 186, 255, 1)'



# page 7, focused state

page = new Page 'focusedState'
button.text = '' for button in page.buttons

focus7 = new FocusComponent
	subjects: page.buttons
	states:
		focused:
			backgroundColor: 'rgba(51, 193, 120, 1)'



# page 8, focused and unfocused states

page = new Page 'focusStates'

focus8 = new FocusComponent
	subjects: page.buttons
	states:
		focused:
			borderWidth: 5
			opacity: 1
			borderColor: 'rgba(32, 239, 132, 1)'
			backgroundColor: 'rgba(51, 193, 120, 1)'
		unfocused:
			borderWidth: 0
			opacity: .6
			backgroundColor: 'rgba(32, 186, 255, 1)'



# page 9, notifying

page = new Page 'notifying'

focus9 = new FocusComponent
	subjects: page.buttons
	notify: -> @hueRotate += 15



# page 10, whac-a-mole

page = new Page 'whacamole'

button.text = '' for button in page.buttons

focus10 = new FocusComponent
	subjects: page.buttons
	useFocusStates: false
	notifyOnFocus: false
	focus: -> 
		switch @image
			when 'images/yes-fly.jpg'
				@image = 'images/splat-swatter.jpg'
				clearInterval(interval)
			when 'images/no-fly.jpg' then @image = 'images/swatter.jpg'
			when 'images/splat.jpg' then @image = 'images/splat-swatter.jpg'
	unfocus: ->
		switch @image
			when 'images/swatter.jpg' then @image = 'images/no-fly.jpg'
			when 'images/splat-swatter.jpg' then @image = 'images/splat.jpg'
			else @image = 'images/no-fly.jpg'
	notify: ->
		if @image is 'images/yes-fly.jpg' then @image = 'images/no-fly.jpg'

interval = Utils.interval .35, ->
	focus10.notifySubjects()
	target = Utils.randomChoice(focus10.subjects)
	if target.image is 'images/no-fly.jpg' then target.image = 'images/yes-fly.jpg'



# page 11, auction house

page = new Page 'auctionHouse'

label11 = page.label 

label11.text = 'Bidding starts at $1. Do I hear $2?'
button.text = '' for button in page.buttons

focus11 = new FocusComponent
	subjects: page.buttons, toggle: false
	focus: -> 
		@observer.highestBid++
		@bid = focus11.highestBid
		@text = "$#{@bid}"
		label11.text = "Do I hear $#{focus11.highestBid + 1}?"
focus11.highestBid = 1







