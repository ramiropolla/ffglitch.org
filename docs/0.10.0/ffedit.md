---
layout: page
title: ffedit
permalink: /docs/0.10.0/ffedit/
---

# ffedit

`ffedit` is the main tool for FFglitch.
It is a **multimedia bitstream editor**.

In this documentation we will explore:
* The [command-line options](#command-line-options),
  which briefly explain how to use `ffedit`'s command-line interface.
* The five different [modes of operation](#modes-of-operation),
  which explain how to actually **do things** with `ffedit`.
  **This is probably what you're looking for**.
* The [overview of the `JSON` file](#overview-of-json-file) and its contents.
* The [overview of the functionality](#overview-of-the-functionality),
  which explains **how** `ffedit` works. It might be a bit too
  technical. It is safe to ignore this section.

## Command-line options

Here is a very brief description of each option:
* `-i <input file>` specifies the **input** media file `ffedit` will be reading.
* `-o <output file>` specifies the **output** media file `ffedit` will be writing to.
* `-a <JSON file>` specifies the JSON file `ffedit` will use to **read** data from.
* `-e <JSON file>` specifies the JSON file `ffedit` will use to **export** data to.
* `-s <script file>` specifies the **script** file `ffedit` will run while transplicating.
* `-sp <JSON string>` specifies a JSON string **argument** that will be passed to the script file's `setup()` function.
* `-f <feature>` specifies which **features** `ffedit` will be processing.
* `-y` tells `ffedit` to overwrite output files without asking for permission.
* `-threads <n>` sets the number of threads `ffedit` will be using (default is all available CPU cores).
* `-t` specifies test mode, used for debugging.
* `-benchmark` tells `ffedit` to print some benchmarks, used for debugging.

This will all make more sense later.

## Modes of operation

`ffedit` has five different modes of operation. They are:
* [Print features](#print-features)
* [Replicate file](#replicate-file)
* [Export JSON data](#export-json-data)
* [Transplicate with imported JSON data](#transplicate-with-imported-json-data)
* [Transplicate with script](#transplicate-with-script) (my favourite)

The modes of operation are selected by using the appropriate
command-line options.

**You probably don't care about the first two modes**.
Feel free to skip directly to
[exporting](#export-json-data),
[applying](#transplicate-with-imported-json-data),
and [transplicating with a script](#transplicate-with-script).

### Print features

For this mode of operation,
an input media file **must** be specified with the `-i` option.
The output (`-o`), apply (`-a`), export (`-e`), and scripting (`-s`) options **must not** be used.

The simplest mode of operation for `ffedit` prints information about
the `input` file. It will say whether the input file `format` and
all the input file `codec`s are supported by `ffedit`.
It will also list the `feature`s of the codecs that are supported by
`ffedit`.

For example, list the supported features from `input.avi`. Note that
the `AAC` codec is listed as not supported:
```
$ ffedit -i input.avi
Input #0, avi, from 'input.avi':
  Duration: 00:00:24.49, start: 0.000000, bitrate: 112160 kb/s
  Stream #0:0: Video: mpeg4 (Simple Profile) (FMP4 / 0x34504D46), yuv420p, 1920x1080 [SAR 1:1 DAR 16:9], 112021 kb/s, 59.94 fps, 59.94 tbr, 59.94 tbn
  Stream #0:1: Audio: aac (LC) ([255][0][0][0] / 0x00FF), 48000 Hz, stereo, fltp, 192 kb/s

FFEdit support for codec 'MPEG-4 part 2':
    [info      ]: info
    [mv        ]: motion vectors
    [mv_delta  ]: motion vectors (delta only)
    [mb        ]: macroblock

FFEdit does not support codec 'AAC (Advanced Audio Coding)'.
```

Description of options:
* `-i input.avi`, the media file `input.avi` will be used as input for `ffedit`.

Another example, note that the `Matroska` file format is not supported:
```
$ ffedit -i input.mkv
Input #0, matroska,webm, from 'input.mkv':
  Metadata:
    ENCODER         : Lavf61.1.100
  Duration: 00:00:08.00, start: 0.000000, bitrate: 9626 kb/s
  Stream #0:0: Video: h264 (High 4:4:4 Predictive), yuv444p(tv, unknown/bt709/iec61966-2-1, progressive), 512x512, 30 fps, 30 tbr, 1k tbn
      Metadata:
        ENCODER         : Lavc61.3.100 libx264
        DURATION        : 00:00:08.000000000

FFEdit does not support format 'Matroska / WebM'.
```

Description of options:
* `-i input.mkv`, the media file `input.mkv` will be used as input for `ffedit`.

### Replicate file

For this mode of operation,
an input media file **must** be specified with the `-i` option and
an output media file **must** be specified with the `-o` option.
The apply (`-a`), export (`-e`), and scripting (`-s`) options **must not** be used.

The `Replicate file` mode of operation is mostly used for debugging.
This will check whether `ffedit` can do the entire `transplication` of
the input file (explained in the
[overview of the functionality](#overview-of-the-functionality)),
without modifying anything, and still end up with an output file which
is exactly the same as the input file.

```
$ ffedit -i input.avi -o output.avi
Input #0, avi, from 'input.avi':
  Metadata:
    software        : Lavf59.16.100
  Duration: 00:00:09.34, start: 0.000000, bitrate: 11283 kb/s
  Stream #0:0: Video: mpeg2video (Main) (mpg2 / 0x3267706D), yuv420p(tv, bt470bg/bt470m/bt470m, progressive), 720x480 [SAR 8:9 DAR 4:3], 11306 kb/s, 59.94 fps, 29.97 tbr, 59.94 tbn
    Side data:
      cpb: bitrate max/min/avg: 0/0/0 buffer size: 49152 vbv_delay: N/A
frame=  280 fps=0.0 Lsize=   12859kB time=00:00:09.30  speed=27.3x
```

Description of options:
* `-i input.avi`, the media file `input.avi` will be used as input for `ffedit`.
* `-o output.avi`, the media file `output.avi` will be used as output for `ffedit`.

Note that the `md5sum` hashes for both the input and the output should match:

```
$ md5sum input.avi output.avi
e09be2ab204bf19bc02f207e0598da68  input.avi
e09be2ab204bf19bc02f207e0598da68  output.avi
```

### Export JSON data

For this mode of operation,
an input media file **must** be specified with the `-i` option and
an [output JSON file](#overview-of-json-file) **must** be specified with the `-e` option.
The output (`-o`), apply (`-a`), and scripting (`-s`) options **must not** be used.

Features **must** be selected with the `-f` option. The supported features
depend on the codec. i.e.: `info`, `mv`, `mv_delta`, `mb` for the
`MPEG-4 part 2` codec as seen above in [Print features](#print-features).

The `Export JSON data` mode of operation will read all the internal
values from each codec from the input file, and **export** the selected
features into a [`JSON` file](#overview-of-json-file).

In this example, we will export the `motion vectors` from a simple
`MPEG2` file that consists of just two frames:
```
$ ffedit -i input.avi -f mv -e mv.json
Input #0, avi, from 'input.avi':
  Metadata:
    software        : Lavf59.16.100
  Duration: 00:00:00.07, start: 0.000000, bitrate: 5702 kb/s
  Stream #0:0: Video: mpeg2video (Main) (mpg2 / 0x3267706D), yuv420p(tv, bt470bg/bt470m/bt470m, progressive), 320x240 [SAR 1:1 DAR 4:3], 29.97 fps, 29.97 tbr, 29.97 tbn
    Side data:
      cpb: bitrate max/min/avg: 0/0/0 buffer size: 49152 vbv_delay: N/A
frame=    2 fps=0.0 Lsize=N/A time=00:00:00.03  speed=4.59x
```

Description of options:
* `-i input.avi`, the media file `input.avi` will be used as input for `ffedit`.
* `-f mv`, the `mv` (`motion vector`) feature will be selected by `ffedit`.
* `-e mv.json`, the `JSON` file `mv.json` will be used as output for `ffedit`.

For an overview of the exported `JSON` file, read
[overview of the `JSON` file](#overview-of-json-file) below.

You may then modify the values from this `JSON` file, and use it in the
next mode of operation, [Transplicate with imported JSON data](#transplicate-with-imported-json-data).

There are many ways to modify this `JSON` file. You could either do it
manually in a text-editor, or write a script (in `Python3`,
`JavaScript`, or whatever language you prefer), or go wild and use
`UNIX`'s [`sed`](https://en.wikipedia.org/wiki/Sed) command (you probably don't want to do this).

### Transplicate with imported JSON data

For this mode of operation,
an input media file **must** be specified with the `-i` option,
an [input JSON file](#overview-of-json-file) **must** be specified with the `-a` option, and
an output media file **must** be specified with the `-o` option.
The export (`-e`) and scripting (`-s`) options **must not** be used.

Features **must** be selected with the `-f` option. The supported features
depend on the codec. i.e.: `info`, `mv`, `mv_delta`, `mb` for the
`MPEG-4 part 2` codec as seen above in [Print features](#print-features).

Once you have your [modified `JSON` file](#overview-of-json-file),
use it as an input with the following command-line invocation:
```
$ ffedit -i input.avi -f mv -a modified.json -o output.avi
Input #0, avi, from 'input.avi':
  Metadata:
    software        : Lavf59.16.100
  Duration: 00:00:00.07, start: 0.000000, bitrate: 5702 kb/s
  Stream #0:0: Video: mpeg2video (Main) (mpg2 / 0x3267706D), yuv420p(tv, bt470bg/bt470m/bt470m, progressive), 320x240 [SAR 1:1 DAR 4:3], 29.97 fps, 29.97 tbr, 29.97 tbn
    Side data:
      cpb: bitrate max/min/avg: 0/0/0 buffer size: 49152 vbv_delay: N/A
frame=    2 fps=0.0 Lsize=      46kB time=00:00:00.03  speed=18.7x
```

Description of options:
* `-i input.avi`, the media file `input.avi` will be used as input for `ffedit`.
* `-f mv`, the `mv` (`motion vector`) feature will be selected by `ffedit`.
* `-a modified.json`, the `JSON` file `modified.json` will be used as input for `ffedit`.
* `-o output.avi`, the media file `output.avi` will be used as output for `ffedit`.

Success! You should now have a glitched `output.avi` file, which still
has a valid bitstream (which means you can watch it in any player or
even upload it to YouTube, Facebook, or Instagram).

### Transplicate with script

For this mode of operation,
an input media file **must** be specified with the `-i` option,
a script file **must** be specified with the `-s` option,
features **may** be specified with the `-f` option, and
an output media file **may** be specified with the `-o` option.
The apply (`-a`) and export (`-e`) options **must not** be used.

The script file can be either `Python3` or `JavaScript`.
The scripts **must** export a function called `glitch_frame()`,
and they **may** also export a function called `setup()`.

Features **may** be selected with the `-f` option, or they **may** be set
through the `setup()` function (see below), but they **must** be present.
The supported features
depend on the codec. i.e.: `info`, `mv`, `mv_delta`, `mb` for the
`MPEG-4 part 2` codec as seen above in [Print features](#print-features).

The output media file **may** be selected with the `-o` option, or it **may** be set
through the `setup()` function (see below).
It does not have be present (in this case, no transplication takes place).

#### setup()

The `setup()` function, if provided, will be called once at the start of the transplication.
It is meant to be used for you to **set up** your script (parse command parameters, initialize devices, etc).
The function will receive one argument, which we'll call `args`:

`setup(args)`

The argument `args` is an object that will contain the following `key/value` pairs:

<div id="ffedit_setup_args_desc"></div>
<div id="ffedit_setup_args_path"></div>

<span id="ffedit_setup_args_feature">TODO</span>: `string`:<br />
* The supported `features` depend on the codec. i.e.: `info`, `mv`, `mv_delta`, `mb` for `MPEG-4 part 2`.
* The `features` that have been passed with the `-f` option (if any) will be populated in this array.
* You may add (or remove) any `features` you want to this array.

<span id="ffedit_setup_args_input">TODO</span>: (informative) `string`:<br />
* The `input` that has been passed with the `-i` option will be populated in this value.

<span id="ffedit_setup_args_output">TODO</span>: `string`:<br />
* The `output` that has been passed with the `-o` option (if any) will be populated in this value.
* You may set the `output` file name in this value.

<span id="ffedit_setup_args_params">TODO</span>: `object`:<br />
* The `params` object may be present if the `-sp` option has been used.

#### glitch_frame()

The `glitch_frame()` function will be called once for each frame.
In this function, you may read the exported values and modify them so
that `ffedit` can transplicate the modified values into the `output` file.

The function will receive two arguments, `frame` and `stream`:

`glitch_frame(frame, stream)`

The argument `frame` is an object that will contain one entry for each `feature` selected:

<div id="ffedit_glitch_frame_frame_desc"></div>
<div id="ffedit_glitch_frame_frame_path"></div>

<span id="ffedit_glitch_frame_frame_feature">TODO</span>: `object`:<br />
* Each `feature` object has a different `keyname` (such as `info`, `mv`, `mv_delta`, etc).
* Each `feature` object has a different structure for its `value`, as detailed in the [features overview](features).

The argument `stream` is an (informative) object that will contain the following `key/value` pairs:

<div id="ffedit_glitch_frame_stream_desc"></div>
<div id="ffedit_glitch_frame_stream_path"></div>

<span id="ffedit_glitch_frame_stream_codec">TODO</span>: `string`:<br />
* The `codec` name (as a string) for this stream.

<span id="ffedit_glitch_frame_stream_stream_index">TODO</span>: `string`:<br />
* The `stream_index` number (as an int) for this stream.

#### Script example

The following example (`script.js`) shows how to interact with the
`setup()` and `glitch_frame()` function arguments.

In the `setup()` function, it will request an additional feature
(`mv`), set the output filename based on the current time and the input
filename, and process the script parameter provided with `-sp`.

In the `glitch_frame()` function, it will stream and frame information
and override all motion vectors with the script parameter provided with
`-sp`.

```js
// global variable to keep track of frame number
let frame_num = 0;
let mv_param;

export function setup(args)
{
  // add motion vectors ("mv") to selected features
  args.features.push("mv");

  // get input filename
  const input_fname = args.input;

  // create a new output filename based on the current time
  // and the input filename
  const date_str = new Date().toISOString().replaceAll(':', '_');
  const output_fname = `glitched_${date_str}_${input_fname}`;
  args.output = output_fname;
  console.log(`Output filename is "${output_fname}"`);

  // initialize variables from input parameter
  try {
    mv_param = MV(args.params);
  } catch (TypeError) {
    throw new Error("A parameter is expected for the motion vector in the command line (use -sp <'[x,y]'>).");
  }
  console.log(`Motion vector parameter is ${mv_param}`);
}

export function glitch_frame(frame, stream)
{
  // print stream information from this frame
  console.log(`[${frame_num}] ${JSON.stringify(stream)}`);

  // print available features from this frame
  const features = Object.keys(frame).join(' ');
  console.log(`Available features: ${features}`);

  // override motion vectors
  const mvs = frame.mv?.forward;
  if ( mvs )
  {
    console.log("Overriding motion vectors");
    mvs.fill(mv_param);
  }

  // increment frame_num
  frame_num++;
}
```

This is the `ffedit` invocation and the output I got:

```bash
$ ffedit -i input.avi -f info -s script.js -sp "[1,1]"
[quickjs @ 0x7fe844000900] Output filename is "glitched_2024-05-30T19_24_42.872Z_input.avi"
[quickjs @ 0x7fe844000900] Motion vector parameter is [1,1]
Input #0, avi, from 'input.avi':
  Metadata:
    software        : Lavf59.16.100
  Duration: 00:00:00.07, start: 0.000000, bitrate: 5702 kb/s
  Stream #0:0: Video: mpeg2video (Main) (mpg2 / 0x3267706D), yuv420p(tv, bt470bg/bt470m/bt470m, progressive), 320x240 [SAR 1:1 DAR 4:3], 29.97 fps, 29.97 tbr, 29.97 tbn
      Side data:
        cpb: bitrate max/min/avg: 0/0/0 buffer size: 49152 vbv_delay: N/A
frame=    2 fps=0.0 Lsize=N/A time=00:00:00.03  speed=  23x    
[quickjs @ 0x7fe844000900] [0] {"codec":"mpeg2video","stream_index":0}
[quickjs @ 0x7fe844000900] Available features: info mv
[quickjs @ 0x7fe844000900] [1] {"codec":"mpeg2video","stream_index":0}
[quickjs @ 0x7fe844000900] Available features: info mv
[quickjs @ 0x7fe844000900] Overriding motion vectors
```

## Overview of JSON file

`JSON` stands for `JavaScript Object Notation`. It is a very simple
data interchange file format that is relatively human-readable.
This way we can easily parse it with scripts, but we can also easily
read it in a text-editor.
Wikipedia explains it pretty well: [`JSON`](https://en.wikipedia.org/wiki/JSON).

Some of the entries in the `JSON` file are merely **informative**, others
are **constant**s used by `ffedit` and **should not be changed**, and the
rest can be modified by the user.

Here's the resulting `JSON` file (`mv.json`) from above:
```js
{
  "ffedit_version":"ffglitch-0.10.0",
  "filename":"input.avi",
  "sha1sum":"9c37878623c27a5cba7aac099767e5a4463b09fd",
  "features":[
    "mv"
  ],
  "streams":[
    {
      "codec":"mpeg2video",
      "frames":[
        {
          "pkt_pos":5762,
          "pts":null,
          "dts":1,
          "mv":{
          }
        },
        {
          "pkt_pos":24444,
          "pts":null,
          "dts":null,
          "mv":{
            "forward":[
              [ null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null ],
              [ null, [0,-1], [0,-1], [0,-1], [0,-1], [-1,-1], [1,-1], [-1,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [1,-2], [0,-1], [0,-1], null ],
              [ null, [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], null ],
              [ null, [-1,0], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], null ],
              [ null, [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], null ],
              [ null, null, [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], null, [0,-1], [0,-1], null, null, [1,0], null, [0,-1], [0,-1], [0,-1], null ],
              [ null, null, [0,-1], [0,-1], [-1,0], null, [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], null, [1,0], [1,0], [1,0], [1,0], [0,-1], [0,-1], null ],
              [ null, null, [0,-1], null, [-1,0], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [1,0], [1,0], [1,0], [1,0], [1,0], null ],
              [ null, null, [-1,0], [-1,0], [-1,0], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [1,0], [1,0], [1,0], [2,0], [1,0], null ],
              [ null, null, [0,-1], [0,-1], [1,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [1,0], [1,0], [1,0], [1,0], null ],
              [ null, [0,-1], null, [1,-1], [1,-2], [0,-1], null, [0,-2], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [0,-1], [1,0], [1,0], [1,0], null ],
              [ null, [-1,0], [1,-1], [1,-2], [1,-2], [0,-1], [1,-2], [0,-2], [0,-2], [0,-1], [0,-2], [0,-2], [0,-1], [0,-1], [-1,-2], [-1,-2], [0,-1], [0,-1], [1,0], [-1,-2] ],
              [ null, [0,-1], [2,-2], [1,-2], [1,-2], [0,-1], [1,-2], [1,-2], [0,-2], [0,-1], [0,-2], [0,-2], [0,-1], [0,-1], [0,-2], [-1,-2], [-1,-2], [1,-1], [0,-1], [-1,-2] ],
              [ null, [2,-3], [1,-3], [1,-3], [0,-1], [1,-1], [1,-3], [1,-3], [0,-2], [0,-1], [-1,-1], [0,-3], [-1,-3], [0,-1], [-1,-2], [-1,-3], [-1,-3], [0,-1], [0,-1], [0,-2] ],
              [ null, [2,-3], [2,-3], [1,-3], null, null, [1,-3], [1,-3], [1,-3], [0,-1], [0,-2], [0,-3], [0,-3], [-1,-3], null, [-1,-3], [-1,-3], [-1,-4], [-2,-4], [0,-2] ]
            ],
            "fcode":[ 1, 1 ],
            "overflow":"warn"
          }
        }
      ]
    }
  ]
}
```

Note that there is some stuff inside `object`s (the curly brackets `{}`),
some inside `array`s (the square brackets `[]`), a bunch of strings
(within double quotes `""`), numbers, and the magical `null` value that
means `not present`.

<div id="ffedit_json_root_desc"></div>
<div id="ffedit_json_root_path"></div>

<span id="ffedit_json_root_ffedit_version">TODO</span>: (informative) `string`:<br />
* `ffedit` version used to generate this `JSON` file.
* In this example, it was made using version `"ffglitch-0.10.0"`.

<span id="ffedit_json_root_filename">TODO</span>: (informative) `string`:<br />
* The input media file used to generate this `JSON` file.
* In this example, it was `"input.avi"`.

<span id="ffedit_json_root_sha1sum">TODO</span>: (informative) `string`:<br />
* The [sha1sum](https://en.wikipedia.org/wiki/Sha1sum) of
* The input media file used to generate this `JSON` file.
* In this example, it was `"9c37878623c27a5cba7aac099767e5a4463b09fd"`.

<span id="ffedit_json_root_feature">TODO</span>: (informative) `string`:<br />
* The name of a `feature` selected to be exported from the input media file used to generate this `JSON` file.
* In this example, only one feature was selected, and it was `"mv"` (`motion vectors`).

<span id="ffedit_json_root_stream_codec">TODO</span>: (informative) `string`:<br />
* The codec name for this stream.
* In this example, it was an `"mpeg2video"` stream.

<span id="ffedit_json_root_frame_pkt_pos">TODO</span>: (informative) `number`:<br />
* Byte position inside the `input` file where the first packet that
  contains this frame was located. This is used by `ffedit` in the
  `transplication` process, so please don't change it.

<span id="ffedit_json_root_frame_pts">TODO</span>: (informative) `number`:<br />
* Presentation timestamp for the frame.

<span id="ffedit_json_root_frame_dts">TODO</span>: (informative) `number`:<br />
* Decoding timestamp for the frame.

<span id="ffedit_json_root_frame_feature">TODO</span>: `Object`:<br />
* **THIS IS WHAT YOU WANT TO EDIT FOR GLITCHING**
* And then, finally, each frame will have one or more `key/value` pairs
  related to each of the `feature`s selected for this stream.
  In this case we have an entry with `mv` (`motion vector`).
* Go to the [`features` documentation](features) page for more
  information on each feature.

<!--
* **streams**: (constant)
  an `array` with the data from each `stream`. Most files will have
  only one video stream, but it is theoretically possible to glitch
  files with multiple video streams.

Each entry in the `streams` array has the following `key/value` pairs:

* **frames**: (constant)
  an `array` with the data from each `frame` in the `stream`.

Each entry in the `frames` array has the following `key/value` pairs:
-->

## Overview of the functionality

The basis of the functionality from `ffedit` is a process I call
`transplication`.

`ffedit` will read a media file, demux it, and decode each stream.
Pretty normal behaviour so far for any tool that deals with media
files.

The difference with `ffedit` is that, at the same time that each media
stream is being decoded, `ffedit` is collecting the bits that were read
from the **bitstream** for each value of each codec, and then rewriting
a new valid bitstream with those values, which are
**possibly modified**.

This means that the modifications happen way down inside the encoded
values for each codec, and not on the bytestream like would be done
with a hex editor.

The bitstream for each codec is written to a new media file, using the
same input file, by just tweaking a few size and error-detection
-related fields.

The whole process **does not** involve any re-encoding of the codecs,
nor does it do any re-muxing of the file.
Everything works in the **bitstream** level.

<!-------------------------------------------------------------------->
<script type="module" src="../ffedit.js"></script>
