---
layout: page
title: ffedit
permalink: /docs/ffedit
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
* `-i <input file>` specifies the input media file `ffedit` will be reading.
* `-o <output file>` specifies the output media file `ffedit` will be writing to.
* `-a <JSON file>` specifies the JSON file `ffedit` will use to read data from.
* `-e <JSON file>` specifies the JSON file `ffedit` will use to export data to.
* `-s <script file>` specifies the script file `ffedit` will run while transplicating.
* `-sp <JSON string>` specifies a JSON string that will be passed to the script file's `setup()` function.
* `-f <feature>` specifies which features `ffedit` will be processing.
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

For this mode of operation, only
an input media file must be specified with the `-i` option.
No output (`-o`), applying (`-a`), exporting (`-e`), or scripting (`-s`) must be specified.

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

Another example, note that the `MOV` file format is not supported:
```
$ ffedit -i input.mp4
Input #0, mov,mp4,m4a,3gp,3g2,mj2, from 'input.mp4':
  Duration: 00:00:24.49, start: 0.000000, bitrate: 112142 kb/s
  Stream #0:0[0x1](und): Video: mpeg4 (Simple Profile) (mp4v / 0x7634706D), yuv420p, 1920x1080 [SAR 1:1 DAR 16:9], 111944 kb/s, 59.94 fps, 59.94 tbr, 60k tbn (default)
    Metadata:
      handler_name    : VideoHandler
      vendor_id       : [0][0][0][0]
  Stream #0:1[0x2](und): Audio: aac (LC) (mp4a / 0x6134706D), 48000 Hz, stereo, fltp, 192 kb/s (default)
    Metadata:
      handler_name    : SoundHandler
      vendor_id       : [0][0][0][0]

FFEdit does not support format 'QuickTime / MOV'.
```

Description of options:
* `-i input.mp4`, the media file `input.mp4` will be used as input for `ffedit`.

### Replicate file

For this mode of operation,
an input media file must be specified with the `-i` option and
an output media file must be specified with the `-o` option.
No applying (`-a`), exporting (`-e`), or scripting (`-s`) must be specified.

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

```
$ md5sum input.avi output.avi
e09be2ab204bf19bc02f207e0598da68  input.avi
e09be2ab204bf19bc02f207e0598da68  output.avi
```

Note that the `md5sum` hashes for both the input and the output match.

### Export JSON data

For this mode of operation,
an input media file must be specified with the `-i` option and
an [output JSON file](#overview-of-json-file) must be specified with the `-e` option.
No output (`-o`), applying (`-a`), or scripting (`-s`) must be specified.

Features must be selected with the `-f` option. The supported features
depend on the codec. i.e.: `info`, `mv`, `mv_delta`, `mb` for the
`MPEG-4 part 2` codec as seen above in [Print features](#print-features).

The `Export JSON data` mode of operation will read all the internal
values from each codec from the input file, and **export** the selected
features into a [`JSON` file](#overview-of-json-file).

In this example, we will export the `motion vectors` from a simple
`MPEG2` file that consists of just two frames:
```
$ ffedit -t -i input.avi -f mv -e mv.json
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
an input media file must be specified with the `-i` option,
an [input JSON file](#overview-of-json-file) must be specified with the `-a` option, and
an output media file must be specified with the `-o` option.
No exporting (`-e`) or scripting (`-s`) must be specified.

Features must be selected with the `-f` option. The supported features
depend on the codec. i.e.: `info`, `mv`, `mv_delta`, `mb` for the
`MPEG-4 part 2` codec as seen above in [Print features](#print-features).

Once you have your [modified `JSON` file](#overview-of-json-file),
use it as an input with the following command-line invocation:
```
$ ffedit -t -i input.avi -f mv -a modified.json -o output.avi
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
an input media file must be specified with the `-i` option,
an script file must be specified with the `-s` option, and
an output media file must be specified with the `-o` option.
No applying (`-a`) or exporting (`-e`) must be specified.

The script file can be either `Python3` or `JavaScript`.
The scripts must export a function called `glitch_frame()`, and they
may also export a function called `setup()`.

The `setup()` function takes one argument

XXXXXXXXXXXXXXXXXXXXXXXXXX
I can't think anymore

#### glitch_frame()

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
  "ffedit_version":"ffglitch-0.10.0-rc0",
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

Objects contain `key/value` pairs. The `key` is a string, and the `value`
can be anything.

The `top-level` object has the following `key/value` pairs:

* **ffedit_version**: (informative)
  ffedit version used to generate this `JSON` file.
  In this example, it was made using an unreleased version of `ffedit`
  named `"ffglitch-0.10.0-rc0"`.
* **filename**: (informative)
  the input media file used to generate this `JSON` file.
  In this example, it was `"input.avi"`.
* **sha1sum**: (informative)
  the [sha1sum](https://en.wikipedia.org/wiki/Sha1sum) of
  the input media file used to generate this `JSON` file.
  In this example, it was `"9c37878623c27a5cba7aac099767e5a4463b09fd"`.
* **features**: (constant)
  an `array` with the `features` selected to be exported
  from the input media file used to generate this `JSON` file.
  In this example, only one feature was selected, and it was `"mv"`
  (`motion vectors`).
* **streams**: (constant)
  an `array` with the data from each `stream`. Most files will have
  only one video stream, but it is theoretically possible to glitch
  files with multiple video streams.

Each entry in the `streams` array has the following `key/value` pairs:

* **codec**: (informative)
  the codec name for this stream.
  In this example, it was an `"mpeg2video"` stream.
* **frames**: (constant)
  an `array` with the data from each `frame` in the `stream`.

Each entry in the `frames` array has the following `key/value` pairs:

* **pkt_pos**: (constant) byte position inside the `input` file where
  the first packet that contains this frame was located. This is used
  by `ffedit` in the `transplication` process, so please don't change
  it.
* **pts**: (informative) presentation timestamp for the frame.
* **dts**: (informative) decoding timestamp for the frame.

And then, finally, each frame will have one or more `key/value` pairs
related to each of the `feature`s selected for this stream.
In this case we have an entry with `mv` (`motion vector`).
Go to the [`features` documentation](/docs/features) page for more
information on each feature.

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
