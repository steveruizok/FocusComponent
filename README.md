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

**Default Settings**

By default, a FocusComponent like the ones in the examples above will give its subjects two states: focused {opacity: 1} and unfocused {opacity: .5}. It will also set all of its subjects as **unfocused**, which will animate them to their unfocused state. The default event that will cause a subject to become focused is 'Tap'. Tapping on an unfocused subject will focus it, while tapping on focused subject will unfocus it. When a subject becomes **focused**, that subject will animate to its focused state. As only one subject may be focused at a time, any existing focused subject will become unfocused when a new subject becomes focused. 

The result is a very familiar interface pattern: a group of items that can be selected by tapping on them. Selecting a new item will de-select any previously selected item. Selecting an icon that is already selected will de-select it.

**Custom Settings**

The FocusComponent is designed to be very customizable, allowing it to generate a variety of common interface patterns. The most basic are:

| Property	| Type | Default | Description |
| --- | ---| --- | --- |
| `focusComponent.toggle`              	| boolean           | `true`			| When set to `true`, focusing on focused subjects will become cause them to become unfocused. When set to `false`, focusing on focused subjects will have no effect. |
| `focusComponent.toggleLock` 			| boolean			| `false`			| When set to `true`, focused subjects must be manually unfocused before new subjects may be focused. When set to `false`, focusing on unfocused subjects will automatically unfocus any focused subject. |
| `focusComponent.states.focused`		| object 			| `{opacity: 1}`	| This defines the state that subjects should animate to when they become focused. |
| `focusComponent.states.unfocused`		| object 			| `{opacity: .5}`	| This defines the state that subjects should animate to when they become unfocused. If a custom focus state is provided but this option is left blank, the focusComponent will use the subject's default appearance as its unfocused state instead. |
| `focusComponent.useFocusStates`		| boolean 			| `true`			| When set to `true`, subjects will animate to their focused states when focused and animate to their unfocused states when unfocsed. When set to `false`, the subjects will skip these steps. |
| `focusComponent.maxFocused`			| number			| `1`				| A FocusComponent may have more than one focused subject at a time. When the maximum is reached, the FocusComponent will make room for newly focused subjects by unfocusing its 'oldest' focused subject. |
| `focusComponent.trigger`				| string			| `'Tap'`			| Defines which of Framer's events will cause a subject to become focused. The trigger property uses the name of the Framer event as a string, so `'DoubleTap'` would be valid while `DoubleTap` would not. |
| `focusComponent.release`				| string			| `undefined`		| Defines which of Framer's events will cause a subject to become unfocused, similar to `trigger`. By default, no event is used. Setting a release is usually not necessary and can create conflicts with triggers; they work best in combination with `toggle: false` and `toggleLock: true`. |

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

In the example above, three layers are created. When a user taps on any of the layers, it will animate to fill the screen. Tapping on it again will returned the layer to its former size and position. The example has a bug, however: though the image's size and position changes, its index does not, causing siblings with a higher index to remain visible in front of the maximized layer. We'll address this in the next section.

**Focus Functions**

FocusComponent doesn't stop at states: its biggest asset are its three functions, **focus**, **unfocus** and **notify**. 

By default, the **focus** function is run for a subject each time it becomes focused, while the **unfocused** function is run for a subject each time it becomes unfocused. The **notify** function is slightly different: by default, it is run for *all* subjects each time *any* new subject becomes focused. Like the component's other settings, these can be defined either directly or when creating the FocusComponet.

| Property | Type | Default | Description |
| -------- | ---- | ------- | ----------- |
| `focusComponent.focus`        		| function          | `-> return null`  | A function that runs for any subject when it changes from unfocused to focused. By default, it has no effect. |
| `focusComponent.unfocus` 				| function			| `-> return null`  | A function that runs for any subject when it changes from focused to unfocused. By default, it has no effect. |
| `focusComponent.notify`				| function 			| `-> return null`  | A function that runs for all subjects each time any new subject becomes focused. By default, it has no effect. |
| `focusComponent.useFocusFunctions`	| boolean 			| `true`  			| When set to `false`, the functions `focus`, `unfocus`, and `notify` will not run when subjects become focused or unfocused. |

For each of the three functions, the object reference (the this in the function's `this`) is the subject itself.

Let's go back to our last example and fix our bug.

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
	focus: -> @bringToFront()
```

In the example above, we've added a focus function that brings the focused subject to front, preventing its siblings from appearing in front of it. As this function will run for each subject when it becomes focused, the focused subject will always remain at the front.

**Manual Operations**

In addition to triggering focus changes with events, you may manually focus, unfocus or notify subjects using the functions below.

| Function                                 | Arguments                                     | Description                                                                                                                                                                                                                                                                                                                                                                                                                        |
|------------------------------------------|-----------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `focusComponent.setFocused`              | subject, focused [boolean], instant [boolean] | Set a specific subject to focused or unfocused, with the option for any state transition to be instant rather than animated. For example, the command `focusComponent.setFocus(mySubject, false)` would unfocus the subject `mySubject` to unfocused and animate it to its unfocused state, while the command `focusComponent.setFocus(mySubject, true, true)` would focus the subject `mySubject` and change its state instantly. |
| `focusComponent.unfocusAll`              | instant [boolean]                             | A command that will set all focused subjects to unfocused.                                                                                                                                                                                                                                                                                                                                                                         |
| `focusComponent.focusAll`                | instant [boolean]                             | A command that will attempt to set all unfocused subjects to focused. If the FocusComponent's `maxFocused` property is less than the total number of subjects, some subjects will become unfocused during this process.                                                                                                                                                                                                            |
| `focusComponent.notifySubjects`          | func [function]                               | A command that will run a function for all subjects. By default, this is the FocusComponent's notify function, however you can provide a custom function as an argument.                                                                                                                                                                                                                                                                                                                                              |
| `focusComponent.notifyFocusedSubjects`   | func [function]                               | A command that will run a function for all of its focused subjects. By default, this is the FocusComponent's notify function, however you can provide a custom function as an argument.                                                                                                                                                                                                                                                                                                                                      |
| `focusComponent.notifyUnfocusedSubjects` | func [function]                               | A command that will run a function for all of its unfocused subjects. By default, this is the FocusComponent's notify function, however you can provide a custom function as an argument.                                                                                                                                                                                                                                                                                                                                    |

**Events**

Finally, the FocusComponent creates several events on itself and on its subjects. When a subject gains or loses focus, it emits an event, `change:focused', which provides a boolean variable referring to whether or not the subject is focused. When a subject gains focus, its argument will be `true`, or `false` on the event created when it is unfocused. The event can be accessed in the following way:

```coffeescript
icons = []
for i in [0..2]
	icons[i] = new Layer
		y: 210 * i
		image: Utils.randomImage()
	icons[i].on "change:focused", (isFocused) ->
		if isFocused is true then @bringToFront()
		else @sendToBack()

focus = new FocusComponent
	subjects: icons
	toggleLock: true
	states:
		focused:
			frame: Screen.frame
			options:
				curve: Spring
```

The FocusComponent iself also generates an event called `focused`. This event occurs when a subject becomes focused, returning two arguments: the subject that has gained focus, and the FocusComponent's array of focused subjects. It may be used in the following way:

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

focus.on "change:focused" (newFocused, focusedSubjects) ->
	newFocused.y = 100
	for subject in focusedSubjects
		subject.y = 150 + (50 * i)

focus.on "change:unfocused" (newUnfocused, unfocusedSubjects) ->
	for subject in unfocusedSubjects
		subject.y = Align.bottom
		subject.x = 20 + (50 * i)
```

**Examples and More**

The FocusComponent module provides the core functionality for a variety of UI patterns. With the exception of adding states named focused and unfocused to layers without them already, FocusComponents do not modify their subject layers. For this reason, multiple focus components can be layered on top of one another, allowing for further variety, control and complexity.

See the examples.framer project for several examples.

## License
ObserverComponent is released under the MIT license.

## Contact
Twitter: @steveruizok