---
layout: page
title: SDL
permalink: /docs/0.10.0/quickjs/sdl/
---

# SDL

[`SDL`](https://www.libsdl.org/) enables [`fflive`](../fflive) to use input devices such as
[keyboard](https://en.wikipedia.org/wiki/Computer_keyboard),
[mouse](https://en.wikipedia.org/wiki/Mouse), and
[joysticks](https://en.wikipedia.org/wiki/Joystick).

A global constructor `SDL()` is built-in to the `quickjs` engine.
This is a simple wrapper around `SDL` functionality.

This page is mostly based on [`SDL` documentation](https://wiki.libsdl.org/SDL2/Introduction) itself.

**NOTE**: Currently, you need to explicitly poll for the events.
I plan on moving this to using
[`async` functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
in the future.

**NOTE2**: `SDL` support only works with `fflive` (and not `ffgac` or `ffedit`).

<hr />
## SDL Constructor
The `new SDL()` constructor is used to create a new `SDL` object.

### Syntax
```js
new SDL()
```

### Return value
The new `SDL` object.

### Examples
```js
const sdl = new SDL();
if ( sdl )
  print("SDL initialized");
```

<hr />
## SDL.prototype.numJoysticks()
This is a wrapper around [SDL_NumJoysticks()](https://wiki.libsdl.org/SDL2/SDL_NumJoysticks).

### Syntax
```js
numJoysticks()
```

### Return value
Returns the number of attached joysticks on success or a negative error code on failure.

### Examples
```js
const sdl = new SDL();
const numJoysticks = sdl.numJoysticks();
print(`numJoysticks: ${numJoysticks}`);
```

<hr />
## SDL.prototype.joystickOpen()
This is a wrapper around [SDL_JoystickOpen()](https://wiki.libsdl.org/SDL2/SDL_JoystickOpen).

**NOTE**: The resulting object is kept internally in the `SDL` object.

### Syntax
```js
joystickOpen(device_index)
```

### Parameters
`device_index` is the index of the joystick to query.

### Return value
Nothing useful.

### Examples
```js
const sdl = new SDL();
sdl.joystickOpen(0);
```

<hr />
## SDL.prototype.joystickClose()
This is a wrapper around [SDL_JoystickClose()](https://wiki.libsdl.org/SDL2/SDL_JoystickClose).

**NOTE**: The input parameter is obtained internally from the `SDL` object
(`joystickOpen()` must have already been called).

### Syntax
```js
joystickClose()
```

### Return value
Nothing useful.

### Examples
```js
const sdl = new SDL();
sdl.joystickOpen(0);
sdl.joystickClose();
```

<hr />
## SDL.prototype.gameControllerOpen()
This is a wrapper around [SDL_GameControllerOpen()](https://wiki.libsdl.org/SDL2/SDL_GameControllerOpen).

**NOTE**: The resulting object is kept internally in the `SDL` object.

### Syntax
```js
gameControllerOpen(joystick_index)
```

### Parameters
`joystick_index` is the device_index of a device, up to `SDL_NumJoysticks()`.

### Return value
Nothing useful.

### Examples
```js
const sdl = new SDL();
sdl.gameControllerOpen(0);
```

<hr />
## SDL.prototype.gameControllerClose()
This is a wrapper around [SDL_GameControllerClose()](https://wiki.libsdl.org/SDL2/SDL_GameControllerClose).

**NOTE**: The input parameter is obtained internally fromt the `SDL` object
(`gameControllerOpen()` must have already been called).

### Syntax
```js
gameControllerClose()
```

### Return value
Nothing useful.

### Examples
```js
const sdl = new SDL();
sdl.gameControllerOpen(0);
sdl.gameControllerClose();
```

<hr />
## SDL.prototype.getEvent()
This is a poll-based abstraction around [SDL_PeepEvents()](https://wiki.libsdl.org/SDL2/SDL_PeepEvents).

You should call this function repeatedly and process the resulting `SDL_Event` until the function returns `null`.

### Syntax
```js
getEvent()
```

### Return value
An `SDL_Event` (defined below) if available, `null` otherwise.

### Examples
```js
const sdl = new SDL();
sdl.joystickOpen(0);
while ( true )
{
  const e = sdl.getEvent();
  if ( e === null )
    break;
  print(JSON.stringify(e));
}
sdl.joystickClose();
```

<hr />
## SDL_Event

The `SDL_Event`s returned by `getEvent()` are a representation of the
[`SDL_Event`](https://wiki.libsdl.org/SDL2/SDL_Event) structure from `SDL`.

The structure is different depending on the `type` of event.

### SDL_KeyboardEvent
<div id="SDL_KeyboardEvent_event_desc"></div>
<div id="SDL_KeyboardEvent_event_path"></div>

<span id="SDL_KeyboardEvent_event_type">TODO</span>: `number`:
`SDL.SDL_KEYDOWN` or `SDL.SDL_KEYUP`.

<span id="SDL_KeyboardEvent_event_timestamp">TODO</span>: `number`:
Event timestamp, in milliseconds.

<span id="SDL_KeyboardEvent_event_state">TODO</span>: `number`:
`SDL.SDL_PRESSED` or `SDL.SDL_RELEASED`.

<span id="SDL_KeyboardEvent_event_repeat">TODO</span>: `number`:
Non-zero if this is a key repeat.

<span id="SDL_KeyboardEvent_event_scancode">TODO</span>: `number`:
`SDL` physical key code - see [`SDL_Scancode`](https://wiki.libsdl.org/SDL2/SDL_Scancode) for details.
* The key codes are available in the global `SDL` object, i.e.: `SDL.SDL_SCANCODE_UNKNOWN`.

<span id="SDL_KeyboardEvent_event_sym">TODO</span>: `number`:
`SDL` virtual key code - see [`SDL_Keycode`](https://wiki.libsdl.org/SDL2/SDLKeycodeLookup) for details.
* The key codes are available in the global `SDL` object, i.e.: `SDL.SDLK_UNKNOWN`.

<span id="SDL_KeyboardEvent_event_mod">TODO</span>: `number`:
Current key modifiers.

### SDL_JoyAxisEvent
<div id="SDL_JoyAxisEvent_event_desc"></div>
<div id="SDL_JoyAxisEvent_event_path"></div>

<span id="SDL_JoyAxisEvent_event_type">TODO</span>: `number`:
`SDL.SDL_JOYAXISMOTION`.

<span id="SDL_JoyAxisEvent_event_timestamp">TODO</span>: `number`:
Event timestamp, in milliseconds.

<span id="SDL_JoyAxisEvent_event_which">TODO</span>: `number`:
The joystick instance id.

<span id="SDL_JoyAxisEvent_event_axis">TODO</span>: `number`:
The joystick axis index.

<span id="SDL_JoyAxisEvent_event_value">TODO</span>: `number`:
The axis value (range: `-32768` to `32767`).

### SDL_JoyBallEvent
<div id="SDL_JoyBallEvent_event_desc"></div>
<div id="SDL_JoyBallEvent_event_path"></div>

<span id="SDL_JoyBallEvent_event_type">TODO</span>: `number`:
`SDL.SDL_JOYBALLMOTION`.

<span id="SDL_JoyBallEvent_event_timestamp">TODO</span>: `number`:
Event timestamp, in milliseconds.

<span id="SDL_JoyBallEvent_event_which">TODO</span>: `number`:
The joystick instance id.

<span id="SDL_JoyBallEvent_event_ball">TODO</span>: `number`:
The joystick trackball index.

<span id="SDL_JoyBallEvent_event_xrel">TODO</span>: `number`:
The relative motion in the X direction.

<span id="SDL_JoyBallEvent_event_yrel">TODO</span>: `number`:
The relative motion in the Y direction.

### SDL_JoyHatEvent
<div id="SDL_JoyHatEvent_event_desc"></div>
<div id="SDL_JoyHatEvent_event_path"></div>

<span id="SDL_JoyHatEvent_event_type">TODO</span>: `number`:
`SDL.SDL_JOYHATMOTION`.

<span id="SDL_JoyHatEvent_event_timestamp">TODO</span>: `number`:
Event timestamp, in milliseconds.

<span id="SDL_JoyHatEvent_event_which">TODO</span>: `number`:
The joystick instance id.

<span id="SDL_JoyHatEvent_event_hat">TODO</span>: `number`:
The joystick trackball index.

<span id="SDL_JoyHatEvent_event_value">TODO</span>: `number`:
The hat position value.

### SDL_JoyButtonEvent
<div id="SDL_JoyButtonEvent_event_desc"></div>
<div id="SDL_JoyButtonEvent_event_path"></div>

<span id="SDL_JoyButtonEvent_event_type">TODO</span>: `number`:
`SDL.SDL_JOYBUTTONDOWN` or `SDL.SDL_JOYBUTTONUP`.

<span id="SDL_JoyButtonEvent_event_timestamp">TODO</span>: `number`:
Event timestamp, in milliseconds.

<span id="SDL_JoyButtonEvent_event_which">TODO</span>: `number`:
The joystick instance id.

<span id="SDL_JoyButtonEvent_event_button">TODO</span>: `number`:
The joystick button index.

<span id="SDL_JoyButtonEvent_event_state">TODO</span>: `number`:
`SDL.SDL_PRESSED` or `SDL.SDL_RELEASED`.

### SDL_ControllerAxisEvent
<div id="SDL_ControllerAxisEvent_event_desc"></div>
<div id="SDL_ControllerAxisEvent_event_path"></div>

<span id="SDL_ControllerAxisEvent_event_type">TODO</span>: `number`:
`SDL.SDL_CONTROLLERAXISMOTION`.

<span id="SDL_ControllerAxisEvent_event_timestamp">TODO</span>: `number`:
Event timestamp, in milliseconds.

<span id="SDL_ControllerAxisEvent_event_which">TODO</span>: `number`:
The joystick instance id.

<span id="SDL_ControllerAxisEvent_event_axis">TODO</span>: `number`:
The controller axis (`SDL_GameControllerAxis`).

<span id="SDL_ControllerAxisEvent_event_value">TODO</span>: `number`:
The axis value (range: `-32768` to `32767`).

### SDL_ControllerButtonEvent
<div id="SDL_ControllerButtonEvent_event_desc"></div>
<div id="SDL_ControllerButtonEvent_event_path"></div>

<span id="SDL_ControllerButtonEvent_event_type">TODO</span>: `number`:
`SDL.SDL_CONTROLLERBUTTONDOWN` or `SDL.SDL_CONTROLLERBUTTONUP`.

<span id="SDL_ControllerButtonEvent_event_timestamp">TODO</span>: `number`:
Event timestamp, in milliseconds.

<span id="SDL_ControllerButtonEvent_event_which">TODO</span>: `number`:
The joystick instance id.

<span id="SDL_ControllerButtonEvent_event_button">TODO</span>: `number`:
The controller button (`SDL_GameControllerButton`).

<span id="SDL_ControllerButtonEvent_event_state">TODO</span>: `number`:
`SDL.SDL_PRESSED` or `SDL.SDL_RELEASED`.

## Full Example

This example will open the first joystick found (I use a cheap `SNES USB` controller),
and use the arrow keys to add motion to the entire frame.

```js
let sdl;
let cur_pan_mv = new MV(0,0);
let step = 0;

export function setup(args)
{
  // select motion vectors
  args.features = [ "mv" ];

  // parse params from command line (a number is expected)
  if ( !("params" in args) )
    throw new Error("A parameter is expected for the step in the command line (use -sp <step>).");
  step = args.params;

  // initialize SDL with first joystick
  sdl = new SDL();
  const numJoysticks = sdl.numJoysticks();
  console.log(`numJoysticks: ${numJoysticks}`);
  if ( numJoysticks > 0 )
    sdl.joystickOpen(0);
}

export function glitch_frame(frame)
{
  const fwd_mvs = frame.mv?.forward;
  if ( !fwd_mvs )
    return;

  // set motion vector overflow behaviour in ffglitch to "truncate"
  frame.mv.overflow = "truncate";

  // parse all SDL events
  while ( true )
  {
    const event = sdl.getEvent();
    if ( event === null )
      break;
    // Uncomment the following line to debug the event structure.
    // console.log(JSON.stringify(event));
    if ( event.type === SDL.SDL_JOYAXISMOTION )
    {
      // Update current MV on arrow keys
      switch ( event.value )
      {
        case -32768: cur_pan_mv[event.axis] += step; break;
        case  32767: cur_pan_mv[event.axis] -= step; break;
      }
    }
  }

  // pan entire frame with current MV
  fwd_mvs.add(cur_pan_mv);
}
```

Run it with:

```bash
$ fflive -i input.avi -s script.js -sp 3
```

<!-------------------------------------------------------------------->
<script type="module" src="../sdl.js"></script>
