# FocusComponent
A Framer component that connects events between layers. 

## Installation
1. Download the `FocusComponent.coffee` file
2. Move the file to the `/modules` folder of your Framer project (or drag it into the code editor, if using the Framer application)
3. Add the following line to the top of your project: `{FocusComponent} = require "FocusComponent"`

## Usage
The FocusComponent uses two conceptual models: *focusing* and *notifying*.

Imagine a security guard observing a grid of security monitors. Depending on where the guard is looking, each monitor may be either *focused* or *unfocused*. The guard can only focus on a single monitor at a time, so whenever he focuses on a new monitor, the monitor that was previously focused becomes unfocused.

Now imagine a live auction. The auctioneer stands before a crowd of bidders, observing them as they place bids. Each bidder knows the highest bid and is able to raise the bid by sending a higher bid to the auctioneer. When this happens, the auctioneer must *notify* each bidder that there is a new highest bid, so that they may continue to bid correctly.

Both operations just described involve a relationship between an observer and a list of objects. The objects that have this relationship with the observer are called *subjects*. In the first example, the observer was the security guard and his subjects were the monitors. In the second example, the observer was the auctioneer and his subjects were the bidders.

With the FocusComponent module, the FocusComponent is the observer and its subjects are an array of layers.

### The FocusComponent

The FocusComponent (or observer) has several functions and properties. Many of these may be set using an options object, similar to how initial properties of a layer are set.



| Property                      | Type              | Description          |
| ----------------------------- | ----------------- | -------------------- |
| `observer.subjects`           | array             | Returns the observer’s current subjects. An observer’s subjects may also be set using this property. See the next section for more details.|
| `observer.focused`            | array             | Returns the observer’s currently focused subject(s). The observer’s focused subjects may also be set with this property, using a subject or an array of subjects. If the subject (or any of the subjects in the array) is unfocused, it will become focused.|
| `observer.unfocused`          | array             | Returns the observer’s currently unfocused subject(s). The observer’s unfocused subjects may also be set with this property, using a subject or an array of subjects. If the subject (or any of the subjects in the array) is focused, it will become unfocused.| 
| `observer.maxFocused`         | number            | Sets how many focused subjects the observer may have at once. By default, this value is `1`, however it may be set to any number. When the current number of focused subjects is exceeded, the oldest focused subject will become unfocused, making room for the new focused subject. |
| `observer.toggle`             | boolean           | Enables or disables focus toggling. If set with true, then focusing on a subject that is already focused will cause that subject to become unfocused. By default, this property is `false`. |
| `observer.trigger`            | string            | Sets the default trigger event for all new and existing subjects. It accepts any of Framer’s Event names as a string. For example, `observer.trigger = ‘DoubleTap’` will cause each of the observer’s subjects to become focused when the user double taps on it. By default, this property is `Tap`.|
| `observer.states.focused`     | object            | Sets the default focused state given to all new subjects. See the focus states section for more information. By default, this property is `{opacity: 1}`.|
| `observer.states.unfocused`   | object            | Sets the default unfocused state given to all new subjects. See the focus states section for more information. By default, this property is `{opacity: .5}`.|
| `observer.useFocusStates`     | boolean           | Sets whether subjects should change to their focused or unfocused states when they become focused or unfocused. If set to false, subjects will not change states when they become focused or unfocused.|
| `observer.focus`              | function          | Sets the function run by each subject when it becomes focused. By default, this function is `-> return null`, though it may be set to any function.|
| `observer.unfocus`            | function          | Sets the function run by each subject when it becomes unfocused. By default, this function is  By default, this function is `-> return null`, though it may be set to any function.|
| `observer.useFocusFunctions`  | boolean           | Sets whether subjects should change to their focused or unfocused states when they become focused or unfocused. If set to false, subjects will not change states when they become focused or unfocused.|
| `observer.notify`             | function          | Sets the function run by each subject when the observer notifies it. If `observer.alwaysNotify` is set to `true`, the observer will notify its subjects (which will, in turn, each run this function) every time any subject becomes focused. If `observer.alwaysNotify` is set to `false`, the observer will only notify its subjects when called.|
| `observer.notifyOnFocus`      | boolean           | Sets whether `observer.notify` will run each time any subject becomes focused. |
| `observer.addSubject`         | function          | Used to add a new subject. See the next section for more details.|
| `observer.removeSubject`      | function          | Used to to remove an existing subject. See the next section for more details.|

### Subjects

Layers may be **added** to the observer’s array of subjects in two ways: 
1.  One at a time, using the function `observer.addSubject(layerA)`
2. As an array, using the property `observer.subjects = [layerA, layerB]`

They may be **removed** from the observer’s array of subjects in two ways:
1. One at a time, using the function `observer.removeSubject(layerA)`
2. By sending an array that does not include previously added subjects. For example, `observer.subjects = [layerC, layerD]` would remove the previously added subjects `layerA` and `layerB`.

When a layer is added to as a subject, it receives several new properties, functions and states.

| Property                      | Type      | Description          |
| ----------------------------- | --------- | -------------------- |
| `layer.observer` | object | Defined as the ObserverComponent |
|  `layer.focus` | function | Cause this layer to become focused |
|  `layer.unfocus` | function | Cause this layer to become unfocused |
|  `layer.states.focused` | object | A Framer state used by the layer to show that it is focused. If the layer already has a state named `focused`, that existing state will be preserved; otherwise, the layer will receive a default focused state of `{opacity:  1}`. |
|  `layer.states.unfocused` | object | A Framer state used by the layer to show that it is unfocused. If the layer already has a state named `unfocused`, that existing state will be preserved. If the layer had a state named `focused` before being added as a subject, the observer will use the layer’s `default` state as its `unfocused` state. If it did not (and if `layer.states.focused` was therefore set to `{opacity: 1}`), the layer’s `unfocused` state will be set to `{opacity: .5}`. |
|  `layer.focusedStates` | boolean | Sets whether this subject should use its `focused` and `unfocused` Framer states. When set with `layer.focusedStates = true`, the subject will animate to its `focused` state when it becomes focused and animate to its `unfocused` state when it becomes unfocused. If set with `layer.focusedStates = false`, it will not change states when it becomes either focused or unfocused. |
|  `layer.addFocusTrigger` | function | Set a new event that will cause this subject to become focused. It accepts any of Framer’s Event names as a string. For example, `layer.addFocusTrigger(‘DoubleTap’)` will cause this layer to become focused when the user double taps on it. |
|  `layer.removeFocusTrigger` | function | Remove a previously set trigger event. If a DoubleTap event trigger had been previously added to this subject, then `layer.removeFocusTrigger(‘DoubleTap’)` would remove this event listener, and double tapping on this subject would no longer cause it to become focused. |
|  `layer.notify` | function | Runs each time the observer runs its `notify` function. By default, this function will each time this subject becomes focused; however, its value is by default ` -> return null`, so nothing will occur. It can be set to any function. |
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