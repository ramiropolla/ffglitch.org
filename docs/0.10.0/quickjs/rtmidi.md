---
layout: page
title: RtMidi
---

# RtMidi

[`RtMidi`](https://www.music.mcgill.ca/~gary/rtmidi/) enables [`ffgac`](../ffgac), [`ffedit`](../ffedit), and [`fflive`](../fflive) to use
[MIDI controllers](https://en.wikipedia.org/wiki/MIDI_controller) as input devices.

The global constructors `RtMidiIn()` and `RtMidiOut()` are built-in to the `quickjs` engine.
This is a simple wrapper around `RtMidi` functionality.

This page is mostly based on [`RtMidi` documentation](https://www.music.mcgill.ca/~gary/rtmidi/index.html) itself.

**NOTE**: Currently, you need to explicitly poll for the events.
I plan on moving this to using
[`async` functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
in the future.

**NOTE2**: There is no support for `RtMidi`'s `setCallback()`, in case
you are reading `RtMidi`'s documentation and wondering why it's not
here on this page.

<hr />
## RtMidiIn Constructor
The `new RtMidiIn()` constructor is used to create a new `RtMidiIn` object.

### Syntax
```js
new RtMidiIn()
```

### Return value
The new `RtMidiIn` object.

### Examples
```js
const midiin = new RtMidiIn();
```

<hr />
## RtMidiIn.prototype.getVersion()
A static function to determine the current RtMidi version.

### Syntax
```js
getVersion()
```

### Return value
A `string` with the current RtMidi version.

### Examples
```js
const midiin = new RtMidiIn();
print(midiin.getVersion());
```

<hr />
## RtMidiIn.prototype.getCompiledApi()
A static function to determine the available compiled MIDI APIs.

### Syntax
```js
getCompiledApi()
```

### Return value
An `Array` with the IDs of the compiled MIDI APIs.

### Examples
```js
const midiin = new RtMidiIn();
const apis = midiin.getCompiledApi();
print(apis);
```

<hr />
## RtMidiIn.prototype.getApiName()
Return the name of a specified compiled MIDI API.

### Syntax
```js
getApiName(api)
```

### Parameters
`api` is the specified MIDI API.

### Return value
A `string` with the name of the specified MIDI API.

### Examples
```js
const midiin = new RtMidiIn();
const apis = midiin.getCompiledApi();
const first_api_name = midiin.getApiName(apis[0]);
print(first_api_name);
```

<hr />
## RtMidiIn.prototype.getApiDisplayName()
Return the display name of a specified compiled MIDI API.

### Syntax
```js
getApiDisplayName(api)
```

### Parameters
`api` is the specified MIDI API.

### Return value
A `string` with the display name of the specified MIDI API.

### Examples
```js
const midiin = new RtMidiIn();
const apis = midiin.getCompiledApi();
const first_api_display_name = midiin.getApiDisplayName(apis[0]);
print(first_api_display_name);
```

<hr />
## RtMidiIn.prototype.getCompiledApiByName()
Return the compiled MIDI API having the given name.

### Syntax
```js
getCompiledApiByName(name)
```

### Parameters
`name` is the specified MIDI API name.

### Return value
A `number` with the specified MIDI API.

### Examples
```js
const midiin = new RtMidiIn();
const apis = midiin.getCompiledApi();
const first_api_name = midiin.getApiName(apis[0]);
const first_api = midiin.getCompiledApiByName(first_api_name);
// first_api should be the same value as apis[0]
```

<hr />
## RtMidiIn.prototype.setClientName()
This function sets the client name (I don't really know what this means).

### Syntax
```js
setClientName(name)
```

### Parameters
`name` is the name for the client.

### Examples
```js
const midiin = new RtMidiIn();
midiin.setClientName("client");
```

<hr />
## RtMidiIn.prototype.setPortName()
This function sets the port name (I don't really know what this means).

### Syntax
```js
setPortName(name)
```

### Parameters
`name` is the name for the port.

### Examples
```js
const midiin = new RtMidiIn();
midiin.setPortName("port");
```

<hr />
## RtMidiIn.prototype.getCurrentApi()
Returns the MIDI API specifier for the current instance of RtMidiIn.

### Syntax
```js
getCurrentApi()
```

### Return value
A `number` with the current MIDI API specifier for the current instance of RtMidiIn.

### Examples
```js
const midiin = new RtMidiIn();
const current_api = midiin.getCurrentApi();
print(current_api);
```

<hr />
## RtMidiIn.prototype.getPortCount()
Return the number of available MIDI input ports.

### Syntax
```js
getPortCount()
```

### Return value
A `number` with the number of available MIDI input ports.

### Examples
```js
const midiin = new RtMidiIn();
const port_count = midiin.getPortCount();
print(`port_count ${port_count}`);
```

<hr />
## RtMidiIn.prototype.getPortName()
Return a string identifier for the specified MIDI input port number.

### Syntax
```js
getPortName(portNumber)
```

### Parameters
`portNumber` is an optional port number greater than 0 can be specified.

### Return value
A `string` identifier for the specified MIDI input port number.

### Examples
```js
const midiin = new RtMidiIn();
const port_count = midiin.getPortCount();
print(`port_count ${port_count}`);
for ( let i = 0; i < port_count; i++ )
{
  const port_name = midiin.getPortName(i);
  print(`[${i}] ${port_name}`);
}
```

<hr />
## RtMidiIn.prototype.openPort()
Open a MIDI input connection given by enumeration number.

### Syntax
```js
openPort(portNumber, portName)
```

### Parameters
* `portNumber` is an optional port number greater than 0 can be specified. Otherwise, the default or first port found is opened.
* `portName` is an optional name for the application port that is used to connect to portId can be specified.

### Return value
`true` on success, `null` otherwise.

### Examples
```js
const midiin = new RtMidiIn();
midiin.openPort();
```

<hr />
## RtMidiIn.prototype.openVirtualPort()
Create a virtual input port, with optional name, to allow software connections.

### Syntax
```js
openVirtualPort(portName)
```

### Parameters
`portName` is an optional name for the application port that is used to connect to portId can be specified.

### Return value
`true` on success, `null` otherwise.

### Examples
```js
const midiin = new RtMidiIn();
midiin.openVirtualPort();
```

<hr />
## RtMidiIn.prototype.closePort()
Close an open MIDI connection (if one exists).

### Syntax
```js
closePort()
```

### Examples
```js
const midiin = new RtMidiIn();
midiin.openPort();
midiin.closePort();
```

<hr />
## RtMidiIn.prototype.isPortOpen()
Returns true if a port is open and false if not.

### Syntax
```js
isPortOpen()
```

### Return value
A `boolean` with `true` if a port is open and `false` if not.

### Examples
```js
const midiin = new RtMidiIn();
midiin.openPort();
const is_port_open = midiin.isPortOpen();
print(`is_port_open ${is_port_open}`);
midiin.closePort();
```

<hr />
## RtMidiIn.prototype.ignoreTypes()
Specify whether certain MIDI message types should be queued or ignored during input.

### Syntax
```js
ignoreTypes(midiSysex, midiTime, midiSense)
```

### Parameters
* `midiSysex`
* `midiTime`
* `midiSense`

### Examples
```js
const midiin = new RtMidiIn();
midiin.openPort();
midiin.ignoreTypes(false, false, false);
```

<hr />
## RtMidiIn.prototype.getMessage()

You should call this function repeatedly and process the resulting
message until the function returns an empty `Array` (`msg.length === 0`).

**NOTE**:
The `MIDI` message format varies from one device to another, and is
outside the scope of this documentation.
You can find more information on google, or pages
[like this one](https://www.music.mcgill.ca/~ich/classes/mumt306/StandardMIDIfileformat.html).

### Syntax
```js
const midiin = new RtMidiIn();
midiin.openPort();
midiin.ignoreTypes(false, false, false);
while ( true )
{
  const msg = midiin.getMessage();
  if ( msg.length === 0 )
    break;
  print(JSON.stringify(msg));
}
midiin.closePort();
```

### Return value
An `Array` with the bytes from one message received from the `MIDI` device.

### Examples
```js
const midiin = new RtMidiIn();
```

<!--TODO-->

<hr />
## RtMidiOut Constructor

The `new RtMidiOut()` constructor is used to create a new `RtMidiOut` object.

**NOTE**:
`RtMidiOut` is used to send messages to `MIDI` devices.
If you want to receive and send messages from a device, you will have
to open both an `RtMidiIn` and an `RtMidiOut`.

### Syntax
```js
new RtMidiOut()
```

### Return value
The new `RtMidiOut` object.

### Examples
```js
const rtmidiout = new RtMidiOut();
```

<hr />
## RtMidiOut.prototype.getCurrentApi()
Returns the MIDI API specifier for the current instance of RtMidiOut.

### Syntax
```js
getCurrentApi()
```

### Return value
A `number` with the current MIDI API specifier for the current instance of RtMidiOut.

### Examples
```js
const midiout = new RtMidiOut();
const current_api = midiout.getCurrentApi();
print(current_api);
```

<hr />
## RtMidiOut.prototype.getPortCount()
Return the number of available MIDI output ports.

### Syntax
```js
getPortCount()
```

### Return value
A `number` with the number of available MIDI output ports.

### Examples
```js
const midiout = new RtMidiOut();
const port_count = midiout.getPortCount();
print(`port_count ${port_count}`);
```

<hr />
## RtMidiOut.prototype.getPortName()
Return a string identifier for the specified MIDI output port number.

### Syntax
```js
getPortName(portNumber)
```

### Parameters
`portNumber` is an optional port number greater than 0 can be specified.

### Return value
A `string` identifier for the specified MIDI output port number.

### Examples
```js
const midiout = new RtMidiOut();
const port_count = midiout.getPortCount();
print(`port_count ${port_count}`);
for ( let i = 0; i < port_count; i++ )
{
  const port_name = midiout.getPortName(i);
  print(`[${i}] ${port_name}`);
}
```

<hr />
## RtMidiOut.prototype.openPort()
Open a MIDI output connection given by enumeration number.

### Syntax
```js
openPort(portNumber, portName)
```

### Parameters
* `portNumber` is an optional port number greater than 0 can be specified. Otherwise, the default or first port found is opened.
* `portName` is an optional name for the application port that is used to connect to portId can be specified.

### Return value
`true` on success, `null` otherwise.

### Examples
```js
const midiout = new RtMidiOut();
midiout.openPort();
```

<hr />
## RtMidiOut.prototype.openVirtualPort()
Create a virtual output port, with optional name, to allow software connections.

### Syntax
```js
openVirtualPort(portName)
```

### Parameters
`portName` is an optional name for the application port that is used to connect to portId can be specified.

### Return value
`true` on success, `null` otherwise.

### Examples
```js
const midiout = new RtMidiOut();
midiout.openVirtualPort();
```

<hr />
## RtMidiOut.prototype.closePort()
Close an open MIDI connection (if one exists).

### Syntax
```js
closePort()
```

### Examples
```js
const midiout = new RtMidiOut();
midiout.openPort();
midiout.closePort();
```

<hr />
## RtMidiOut.prototype.isPortOpen()
Returns true if a port is open and false if not.

### Syntax
```js
isPortOpen()
```

### Return value
A `boolean` with `true` if a port is open and `false` if not.

### Examples
```js
const midiout = new RtMidiOut();
midiout.openPort();
const is_port_open = midiout.isPortOpen();
print(`is_port_open ${is_port_open}`);
midiout.closePort();
```

<hr />
## RtMidiOut.prototype.sendMessage()
Immediately send a single message out an open MIDI output port.

### Syntax
```js
sendMessage()
```

### Return value
`true` on success, `null` otherwise.

### Examples
```js
const midiout = new RtMidiOut();
midiout.openPort();
midiout.sendMessage([ 0xF0, 0x00, 0xF7 ]);
midiout.closePort();
```

## Full Example

This example will open the `MIDI` device specified by the script
parameter to [`pixelsort`](../ffgac#pixelsorting) the image.

The pixelsorting threshold will be set with the `MIDI` controller using
the first 4 faders in pairs. The low threshold is `fader[1] - fader[0]`
and the high threshold is `fader[3] - fader[2]`.

**NOTE**: Most `MIDI` controllers only send messages when a control
          is changed. Therefore you will probably get no visible change
          in the script below before you start playing around with the
          faders.

```js
let midiin = null;
let midi_threshold_low  = [ 0, 0 ];
let midi_threshold_high = [ 0, 0 ];

// options
const opt_pix_fmt    = "gbrp";          // supported pixel formats are "gbrp" and "yuv444p"
const opt_colorspace = "hsv";           // yuv444p: "yuv";
                                        // gbrp:    "rgb", "hsv", "hsl"
const opt_range_y    = [ 0, 1 ];        // [ [0 .. 1], [0 .. 1] ]
const opt_range_x    = [ 0, 1 ];        // [ [0 .. 1], [0 .. 1] ]
const opt_threshold  = [ 0.25, 0.75 ];  // [ [0 .. 1], [0 .. 1] ]
const opt_order      = "vertical";      // "vertical" or "horizontal"
const opt_reverse    = false;           // true or false
const opt_trigger_by = 2;               // 0, 1, or 2
const opt_sort_by    = 2;               // 0, 1, or 2

/*********************************************************************/
/* scales value from 'from' range to 'to' range */
function scaleValue(value, from_min, from_max, to_min, to_max)
{
  return (value - from_min) * (to_max - to_min) / (from_max - from_min) + to_min;
}

/*********************************************************************/
export function setup(args)
{
  // select pixel format
  args.pix_fmt = opt_pix_fmt;

  // initialize RtMiti and list ports
  midiin = new RtMidiIn();
  const portCount = midiin.getPortCount();
  console.log(`rtmidi port count: ${portCount}`);
  for ( let i = 0; i < portCount; i++ )
  {
    const name = midiin.getPortName(i);
    console.log(`[${i}] ${name}`);
  }

  // parse params (a number is expected)
  const port = args.params;
  const ok = typeof port === 'number'
          && Number.isInteger(port)
          && port >= 0;
  if ( !ok )
    throw("MIDI port number expected as script parameter");

  // open the selected MIDI controller
  if ( midiin.openPort(port) === null )
    throw(`Error opening MIDI controller at port ${port}`);
  console.log(`MIDI controller at port ${port} opened`);
  midiin.ignoreTypes(false, false, false);
}

/*********************************************************************/
function parse_rtmidi_events()
{
  while ( true )
  {
    const msg = midiin.getMessage();
    const msglen = msg.length;
    if ( msglen == 0 )
      break;
    // Uncomment the following line to debug the message structure.
    // console.log(JSON.stringify(msg));
    if ( msglen == 3 )
    {
      if ( msg[0] == 176 )
      {
        switch ( msg[1] )
        {
        /* faders */
        case  0: midi_threshold_low [0] = msg[2]; break;
        case  1: midi_threshold_low [1] = msg[2]; break;
        case  2: midi_threshold_high[0] = msg[2]; break;
        case  3: midi_threshold_high[1] = msg[2]; break;
        }
      }
    }
  }
}

/*********************************************************************/
export function filter(args)
{
  // parse all RtMidi events
  parse_rtmidi_events();

  // input data
  const data = args["data"];
  const height = data[0].height;
  const width  = data[0].width;

  // range
  const y_begin = Math.lround(scaleValue(opt_range_y[0], 0, 1, 0, height));
  const y_end   = Math.lround(scaleValue(opt_range_y[1], 0, 1, 0, height));
  const x_begin = Math.lround(scaleValue(opt_range_x[0], 0, 1, 0, width));
  const x_end   = Math.lround(scaleValue(opt_range_x[1], 0, 1, 0, width));
  const range_y = [ y_begin, y_end ];
  const range_x = [ x_begin, x_end ];

  // colorspace: yuv444p: "yuv";
  //             gbrp:    "rgb", "hsv", "hsl"
  const colorspace = opt_colorspace;

  // trigger_by: yuv444p: 'y', 'u', 'v';
  //             gbrp:    'r', 'g', 'b',
  //                      'h', 's', 'v',
  //                      'h', 's', 'l'
  const trigger_by = opt_colorspace[opt_trigger_by];

  // sort_by: yuv444p: 'y', 'u', 'v';
  //          gbrp:    'r', 'g', 'b',
  //                   'h', 's', 'v',
  //                   'h', 's', 'l'
  const sort_by = opt_colorspace[opt_sort_by];

  // threshold
  const y_low  = midi_threshold_low [1] - midi_threshold_low [0];
  const y_high = midi_threshold_high[1] - midi_threshold_high[0];
  const threshold_low  = scaleValue(y_low,  -127, 127, opt_threshold[0], opt_threshold[1]);
  const threshold_high = scaleValue(y_high, -127, 127, opt_threshold[0], opt_threshold[1]);
  const threshold = [ threshold_low, threshold_high ];

  // options
  const options = {
    colorspace: colorspace,
    trigger_by: trigger_by,
    sort_by: sort_by,
    order: opt_order,
    mode: "threshold",
    reverse_sort: opt_reverse,
    threshold: threshold,                   // can be high low or low high
    clength: 0,
  };

  // call the internal pixelsort function
  // console.log(orig_frame_num, div_frame_num, JSON.stringify(options));
  ffgac.pixelsort(data, range_y, range_x, options);
}
```

Run it with (replace the **&lt;port_number&gt;** with an actual port
number, from the list printed by the script when no parameters are specified):

```bash
$ fflive -i input.avi -vf script="script.js:<port number>"
```

**NOTE2**: You can also use `RtMidi` with all scripts available in FFglitch.
           This means normal bitstream transplication scripts, `vf_script`,
           `pict_type_script`, `mb_type_script`, and so on...
