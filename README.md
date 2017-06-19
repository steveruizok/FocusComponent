# FocusComponent
A Framer component that connects events between layers. Provides core functionality for a variety of common interface patterns.

## Installation
1. Download the `FocusComponent.coffee` file
2. Move the file to the `/modules` folder of your Framer project (or drag it into the code editor, if using the Framer application)
3. Add the following line to the top of your project: `{FocusComponent} = require "FocusComponent"`

## Usage

A focusComponent is a layer with special properties and methods that allow it to manage events among a group of layers. These layers are referred to as its *subjects*. The focusComponent is capable of three main actions: it can *focus* on one or more of its subjects, it can *unfocus* on its other subjects, and it can *notify* all of its subjects.

Using the focusComponent normally follows this pattern:
1. Create an array of related layers, such as buttons in a grid.
2. Create a FocusComponent and set the array of layers as its subjects.

```coffeescript
icons = []
for i in [0..2]
	icons[i] = new Layer
		y: 210 * i

focus = new FocusComponent
	subjects: icons
```

Subjects may be added or removed at any time, so an alternative pattern could be:
1. Create a FocusComponent and customize its focus, unfocus and notify actions.
2. Create several related layers and add them to the FocusComponent using focusComponent.addSubject()

```coffeescript
focus = new FocusComponent

for i in [0..2]
	icon = new Layer
		y: 210 * i
	focus.addSubject(icon)
```

*Default Settings*
By default, a FocusComponent like the ones in the examples above will give its subjects two states: focused {opacity: 1} and unfocused {opacity: .5}. It will also set all of its subjects as **unfocused**, which will animate them to their unfocused state. The default event that will cause a subject to become focused is 'Tap'. Tapping on an unfocused subject will focus it, while tapping on focused subject will unfocus it. When a subject becomes **focused**, that subject will animate to its focused state. As only one subject may be focused at a time, any existing focused subject will become unfocused when a new subject becomes focused. 

The result is a very familiar interface pattern: a group of items that can be selected by tapping on them. Selecting a new item will de-select any previously selected item. Selecting an icon that is already selected will de-select it.

*Custom Settings*
The FocusComponent is designed to be very customizable, allowing it to generate a variety of common interface patterns. The most basic are:

| Property ----------------------------	| Type ------------ | Default --------- | Description --------- |
| `focusComponent.toggle`              	| boolean           | `true`			| When set to `true`, focusing on focused subjects will become cause them to become unfocused. When set to `false`, focusing on focused subjects will have no effect. |
| `focusComponent.toggleLock` 			| boolean			| `false`			| When set to `true`, focused subjects must be manually unfocused before new subjects may be focused. When set to `false`, focusing on unfocused subjects will automatically unfocus any focused subject. |
| `focusComponent.states.focused`		| object 			| `{opacity: 1}`	| This defines the state that subjects should animate to when they become focused. |
| `focusComponent.states.unfocused`		| object 			| `{opacity: .5}`	| This defines the state that subjects should animate to when they become unfocused. If a custom focus state is provided but this option is left blank, the focusComponent will use the subject's default appearance as its unfocused state instead. |
| `focusComponent.useFocusStates`		| boolean 			| `true`			| When set to `true`, subjects will animate to their focused states when focused and animate to their unfocused states when unfocsed. When set to `false`, the subjects will skip these steps. |
| `focusComponent.maxFocused`			| number			| `1`				| A FocusComponent may have more than one focused subject at a time. When the maximum is reached, the FocusComponent will make room for newly focused subjects by unfocusing its 'oldest' focused subject. |
| `focusComponent.trigger`				| string			| `'Tap'`			| Defines which of Framer's events will cause a subject to become focused. The trigger property uses the name of the Framer event as a string, so `'DoubleTap'` would be valid while `DoubleTap` would not. |

Using the above settings, a FocusComponent can be used to create a very different interface element.

```coffeescript
icons = []
for i in [0..2]
	icons[i] = new Layer
		y: 210 * i
		image: Utils.randomImage()

focus = new FocusComponent
	subjects: icons
	toggleLock: true
	states:
		focused:
			frame: Screen.frame
			options:
				curve: Spring
```

*Focus Functions*

FocusComponent doesn't stop at states: its biggest asset are its three functions, *focus*, *unfocus* and *notify*. By default, the *focus* function is run for a subject each time it becomes focused, while the *unfocused* function is run for a subject each time it becomes unfocused. The *notify* function is slightly different: by default, it is run for **all** subjects each time any new subject becomes focused. Like the component's other settings, these can be defined either directly or when creating the FocusComponet.

| Property -------------------- | Type ------------ | Default --------- | Description --------- |
| `focusComponent.focus`        | boolean           | `-> return null`  | When set to `true`, focusing on focused subjects will become cause them to become unfocused. When set to `false`, focusing on focused subjects will have no effect. |
| `focusComponent.unfocus` 		| boolean			| `-> return null`  | When set to `true`, focused subjects must be manually unfocused before new subjects may be focused. When set to `false`, focusing on unfocused subjects will automatically unfocus any focused subject. |
| `focusComponent.notify`		| object 			| `-> return null`  | This defines the state that subjects should animate to when they become focused. |






The key to this customization are the FocusComponent's three functions, *focus*, *unfocus* and *notify*.





The FocusComponent uses two conceptual models: *focusing* and *notifying*.

Imagine a security guard observing a grid of security monitors. Depending on where the guard is looking, each monitor may be either *focused* or *unfocused*. The guard can only focus on a single monitor at a time, so whenever he focuses on a new monitor, the monitor that was previously focused becomes unfocused.

Now imagine a live auction. The auctioneer stands before a crowd of bidders, observing them as they place bids. Each bidder knows the highest bid and is able to raise the bid by sending a higher bid to the auctioneer. When this happens, the auctioneer must *notify* each bidder that there is a new highest bid, so that they may continue to bid correctly.

Both operations just described involve a relationship between an focusComponent and a list of objects. The objects that have this relationship with the focusComponent are called *subjects*. In the first example, the focusComponent was the security guard and his subjects were the monitors. In the second example, the focusComponent was the auctioneer and his subjects were the bidders.

With the FocusComponent module, the FocusComponent is the focusComponent and its subjects are an array of layers.

### The FocusComponent

The FocusComponent (or focusComponent) has several functions and properties. Many of these may be set using an options object, similar to how initial properties of a layer are set.



| Property                            | Type              | Description          |
| ----------------------------------- | ----------------- | -------------------- |
| `focusComponent.maxFocused`         | number            | Sets how many focused subjects the focusComponent may have at once. By default, this value is `1`, however it may be set to any number. When the current number of focused subjects is exceeded, the oldest focused subject will become unfocused, making room for the new focused subject. |
| `focusComponent.toggle`             | boolean           | Enables or disables focus toggling. If set with true, then focusing on a subject that is already focused will cause that subject to become unfocused. By default, this property is `false`. |
| `focusComponent.trigger`            | string            | Sets the default trigger event for all new and existing subjects. It accepts any of Framer’s Event names as a string. For example, `focusComponent.trigger = ‘DoubleTap’` will cause each of the focusComponent’s subjects to become focused when the user double taps on it. By default, this property is `Tap`.|
| `focusComponent.states.focused`     | object            | Sets the default focused state given to all new subjects. See the focus states section for more information. By default, this property is `{opacity: 1}`.|
| `focusComponent.states.unfocused`   | object            | Sets the default unfocused state given to all new subjects. See the focus states section for more information. By default, this property is `{opacity: .5}`.|
| `focusComponent.useFocusStates`     | boolean           | Sets whether subjects should change to their focused or unfocused states when they become focused or unfocused. If set to false, subjects will not change states when they become focused or unfocused.|
| `focusComponent.focus`              | function          | Sets the function run by each subject when it becomes focused. By default, this function is `-> return null`, though it may be set to any function.|
| `focusComponent.unfocus`            | function          | Sets the function run by each subject when it becomes unfocused. By default, this function is  By default, this function is `-> return null`, though it may be set to any function.|
| `focusComponent.useFocusFunctions`  | boolean           | Sets whether subjects should change to their focused or unfocused states when they become focused or unfocused. If set to false, subjects will not change states when they become focused or unfocused.|
| `focusComponent.notify`             | function          | Sets the function run by each subject when the focusComponent notifies it. If `focusComponent.alwaysNotify` is set to `true`, the focusComponent will notify its subjects (which will, in turn, each run this function) every time any subject becomes focused. If `focusComponent.alwaysNotify` is set to `false`, the focusComponent will only notify its subjects when called.|
| `focusComponent.notifyOnFocus`      | boolean           | Sets whether `focusComponent.notify` will run each time any subject becomes focused. |
| `focusComponent.addSubject`         | function          | Used to add a new subject. See the next section for more details.|
| `focusComponent.removeSubject`      | function          | Used to to remove an existing subject. See the next section for more details.|
| `focusComponent.subjects`           | array             | Returns the focusComponent’s current subjects. A focusComponent’s subjects may also be set using this property. See the next section for more details.|
| `focusComponent.focused`            | array             | Returns the focusComponent’s currently focused subject(s). The focusComponent’s focused subjects may also be set with this property, using a subject or an array of subjects. If the subject (or any of the subjects in the array) is unfocused, it will become focused.|
| `focusComponent.unfocused`          | array             | Returns the focusComponent’s currently unfocused subject(s). The focusComponent’s unfocused subjects may also be set with this property, using a subject or an array of subjects. If the subject (or any of the subjects in the array) is focused, it will become unfocused.| 

### Subjects

Layers may be **added** to the focusComponent’s array of subjects in two ways: 
1.  One at a time, using the function `focusComponent.addSubject(layerA)`
2. As an array, using the property `focusComponent.subjects = [layerA, layerB]`

They may be **removed** from the focusComponent’s array of subjects in two ways:
1. One at a time, using the function `focusComponent.removeSubject(layerA)`
2. By sending an array that does not include previously added subjects. For example, `focusComponent.subjects = [layerC, layerD]` would remove the previously added subjects `layerA` and `layerB`.

When a layer is added to as a subject, it receives several new properties, functions and states.

| Property                      | Type      | Description          |
| ----------------------------- | --------- | -------------------- |
| `layer.focusComponent` | object | Defined as the ObserverComponent |
|  `layer.focus` | function | Cause this layer to become focused |
|  `layer.unfocus` | function | Cause this layer to become unfocused |
|  `layer.states.focused` | object | A Framer state used by the layer to show that it is focused. If the layer already has a state named `focused`, that existing state will be preserved; otherwise, the layer will receive a default focused state of `{opacity:  1}`. |
|  `layer.states.unfocused` | object | A Framer state used by the layer to show that it is unfocused. If the layer already has a state named `unfocused`, that existing state will be preserved. If the layer had a state named `focused` before being added as a subject, the focusComponent will use the layer’s `default` state as its `unfocused` state. If it did not (and if `layer.states.focused` was therefore set to `{opacity: 1}`), the layer’s `unfocused` state will be set to `{opacity: .5}`. |
|  `layer.focusedStates` | boolean | Sets whether this subject should use its `focused` and `unfocused` Framer states. When set with `layer.focusedStates = true`, the subject will animate to its `focused` state when it becomes focused and animate to its `unfocused` state when it becomes unfocused. If set with `layer.focusedStates = false`, it will not change states when it becomes either focused or unfocused. |
|  `layer.addFocusTrigger` | function | Set a new event that will cause this subject to become focused. It accepts any of Framer’s Event names as a string. For example, `layer.addFocusTrigger(‘DoubleTap’)` will cause this layer to become focused when the user double taps on it. |
|  `layer.removeFocusTrigger` | function | Remove a previously set trigger event. If a DoubleTap event trigger had been previously added to this subject, then `layer.removeFocusTrigger(‘DoubleTap’)` would remove this event listener, and double tapping on this subject would no longer cause it to become focused. |
|  `layer.notify` | function | Runs each time the focusComponent runs its `notify` function. By default, this function will each time this subject becomes focused; however, its value is by default ` -> return null`, so nothing will occur. It can be set to any function. |
|  `layer.notifyOnFocus` | boolean | Sets whether to run `layer.notify` whenever this subject becomes focused. |

## Example

See the projec at https://framer.cloud/lDxYI for several examples.

```coffeescript
{ObserverComponent} = require 'ObserverComponent'

buttons = []

for i in [0..11]
	buttons[i] = new Layer
		name: 'Button ' + i
		height: Screen.width / 3 - 12, width: Screen.width / 3 - 12, borderRadius: 12, 
		x: Align.center( ( ( 2 * Screen.width / 3 ) * -0.5 ) + ( Screen.width / 3 * (i % 3)) )
		y: 32 + _.floor(i / 3) * Screen.width / 3
		backgroundColor: Utils.randomColor()
		image: Utils.randomImage()
		animationOptions: {time: .25}

floatingText = new TextLayer
	x: Align.center, y: Align.bottom(-64)
	fontSize: 20, color: '#FFF', textAlign: 'center'
	width: Screen.width, backgroundColor: 'rgba(0,0,0,.35)'
	text: ''

page4Observer1 = new ObserverComponent
	subjects: buttons
	focusedState:
		x: 0, y: 0
		width: Screen.width, height: Screen.height
	focus: -> 
		@bringToFront()
		floatingText.bringToFront()
		floatingText.props =
			visible: true
			x: Align.center()
			text: @name
	unfocus: ->
		floatingText.visible = false
  ```


## License
ObserverComponent is released under the MIT license.

## Contact
Twitter: @steveruizok