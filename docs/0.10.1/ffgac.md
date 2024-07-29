---
layout: page
title: ffgac
permalink: /docs/0.10.1/ffgac/
---

# ffgac

For those that didn't know it, `ffmpeg` stands for `fast forward MPEG`,
where `MPEG` stands for `Moving Picture Experts Group`, which I have
always found a rather silly and pompous name. `ffgac` is meant for
glitch artists, where the `GAC` stands for
[`Glitch Artists Collective`](https://www.facebook.com/groups/Glitchcollective/).

Please refer to the [`ffmpeg` documentation](https://ffmpeg.org/ffmpeg.html)
or any other `ffmpeg` tutorial to first get a basic idea on how `ffmpeg`
works.

`ffgac` is just `ffmpeg`, with the following extra features, described
below.

## MPEG2 and MPEG4 encoding

### Force writing of null motion vectors

Many `ffglitch` scripts work on `motion vectors`.
But motion vectors only occur when the encoder that created the file
in the first place detected that there was any motion at all to encode.
And in case there was no motion, the encoder just says `no motion vectors`
instead of saying `motion vector of [ 0, 0 ]` (gross oversimplification
but it should get the point across).

If the encoder were to write out `[ 0, 0 ]` motion vectors for every
macroblock that did not have any motion, that would not be a very smart
encoder. The resulting file would be unnecessarily larger than it should
be.

But since glitching motion vectors is fun, `ffgac` has an option to do
just that: make the encoder dumber and write out `[ 0, 0 ]` when there
is no motion in the macroblock. This lets us edit those values later
with `ffedit` or `fflive`.

To do that, while encoding an `MPEG2` or `MPEG4` file, add the following
option to the `ffgac` command line:

`-mpv_flags +forcemv`

<p class="centered">
<video preload="auto" loop autoplay muted controls width="100%">
  <source src="/assets/images/moulin_before.mp4" type="video/mp4">
</video>
Glitched video without +forcemv. Only part of the image is moving down.
</p>

<p class="centered">
<video preload="auto" loop autoplay muted controls width="100%">
  <source src="/assets/images/moulin_forcemv_after.mp4" type="video/mp4">
</video>
Glitched video with +forcemv. Did you notice that the entire image is moving down?
</p>

### Prevent `I` macroblocks in `P` frames

Have you ever been working on a really amazing glitch, your video is
fluent and awesome, and then all of a sudden there are tiny little
chunks of the image that get restored to their original and unglitched
version and all the magic is gone?

What is happening there is that, on a `P` frame, the encoder that
created the file decided that some of the `macroblocks` are so incredibly
hard to predict that it basically said "*fuck it, let's just write out
an `I` macroblock*". This is actually a smart move by the encoder, since
the `I` macroblock will take fewer bits to encode than a `P` macroblock
in these cases.

But we don't want the encoder to ruin the magic of our glitching process,
so we can purposely make it dumber by forcing it to **never** write out
`I` macroblocks in `P` frames.

To do that, while encoding an `MPEG2` or `MPEG4` file, add the following
option to the `ffgac` command line:

`-mpv_flags +nopimb`

`nopimb` stands for `no I macroblocks in P frames`. It should actually
be `noimbp`, but `nopimb` sounded funnier.

<p class="centered">
<video preload="auto" loop autoplay muted controls width="100%">
  <source src="/assets/images/moulin_all_after.mp4" type="video/mp4">
</video>
Glitched video with +forcemv+nopimb. That one annoying grass in the foreground is no longer cleaning up the image as it moves along.
</p>

### Infinite keyframe interval

`ffmpeg` has an arbitrary limitation of `600` frames between
`keyframes` in `MPEG2` and `MPEG4` encoders. That's about `20` seconds
if you're going at `30` fps.
There is also a [`scene change`](https://en.wikipedia.org/wiki/Shot_transition_detection)
algorithm in `ffmpeg` that might force a `keyframe` in the encoder.
And with each `keyframe`, you get an `I` frame, which resets all your glitches.

But what if you want your glitch to last ***your entire acid trip***?
It'd be a bummer if you would get called back to reality every `20`
seconds.

Sure, you *could* remove the `I` frames with some other glitch tool,
but what about just not having them there in the first place?

To do that, while encoding an `MPEG2` or `MPEG4` file, you need to set
the [Group of Pictures (GOP)](https://en.wikipedia.org/wiki/Group_of_pictures)
size to a large value, and also raise the scene change threshold to a
large value.
You can achieve that by adding the following options to the `ffgac` command line:

`-g max -sc_threshold max`

and there you go. No more `I` frames.

### Macroblock type (script)

If you want a finer control on which macroblocks will be of type `I`
and which will be of type `P`, you can write a script for this.

```js
let frame_num;
export function setup()
{
  // this function is called once at the beginning
  frame_num = 0;
}
export function mb_type_func(args)
{
  // this function is called once for each frame.
  // args contains a 2d array with an int for each macroblock which can
  // be set to a combination of any of the following values:
  // #define CANDIDATE_MB_TYPE_INTRA      (1 <<  0)
  // #define CANDIDATE_MB_TYPE_INTER      (1 <<  1)
  // #define CANDIDATE_MB_TYPE_INTER4V    (1 <<  2)
  // #define CANDIDATE_MB_TYPE_SKIPPED    (1 <<  3)
  // #define CANDIDATE_MB_TYPE_DIRECT     (1 <<  4)
  // #define CANDIDATE_MB_TYPE_FORWARD    (1 <<  5)
  // #define CANDIDATE_MB_TYPE_BACKWARD   (1 <<  6)
  // #define CANDIDATE_MB_TYPE_BIDIR      (1 <<  7)
  // #define CANDIDATE_MB_TYPE_INTER_I    (1 <<  8)
  // #define CANDIDATE_MB_TYPE_FORWARD_I  (1 <<  9)
  // #define CANDIDATE_MB_TYPE_BACKWARD_I (1 << 10)
  // #define CANDIDATE_MB_TYPE_BIDIR_I    (1 << 11)
  // #define CANDIDATE_MB_TYPE_DIRECT0    (1 << 12)

  // In practice, you either want to set it to 1 for an `I` macroblock,
  // or 2 for a `P` macroblock.
  const CANDIDATE_MB_TYPE_INTRA = (1 <<  0);
  const CANDIDATE_MB_TYPE_INTER = (1 <<  1);
  // The following example alternates between `I` and `P` macroblocks.
  const mb_types = args.mb_types;
  const mb_height = mb_types.length;
  const mb_width = mb_types[0].length;
  for ( let mb_y = 0; mb_y < mb_height; mb_y++ )
    for ( let mb_x = 0; mb_x < mb_width; mb_x++ )
      mb_types[mb_y][mb_x] = ((frame_num + mb_y + mb_x) & 1)
                           ? CANDIDATE_MB_TYPE_INTRA
                           : CANDIDATE_MB_TYPE_INTER;

  frame_num++;
}
```

To do that, while encoding an `MPEG2` or `MPEG4` file, add the following
option to the `ffgac` command line:

`-mb_type_script <script file>`

### Picture type (script)

If you want to force an `I` frame programatically (not individual
macroblocks, but the whole frame itself), you can also script it.

```js
let frame_num;
export function setup()
{
  // this function is called once at the beginning
  frame_num = 0;
}
export function pict_type_func()
{
  // this function is called once for each frame.
  if ( (frame_num++ & 3) )
    return "P";
  return "I";
}
```

To do that, while encoding an `MPEG2` or `MPEG4` file, add the following
option to the `ffgac` command line:

`-pict_type_script <script file>`

### Motion vector range

The minimum and maximum values that can be encoded for motion vectors
depends on a value called the `fcode`.
The higher the value of `fcode`, the higher the range of the motion
vectors.
This value is set once per frame.

Normally, the encoder itself will choose the best `fcode` for each
frame, but this can be overriden with the following option in the
`ffgac` command line:

`-fcode <arg>`

where `<arg>` is an expression that evaluates to a number from 1 to 7
(depending on the codec).

**NOTE**: This option will probably be removed in favour of using a
script.

## libxvid encoding

### Force writing of null motion vectors

This option does the same thing as `-mpv_flags +forcemv` but for the
`libxvid` encoder.

While encoding an `MPEG4` file with libxvid, add the following option
to the `ffgac` command line:

`-forcemv 1`

### Prevent `I` macroblocks in `P` frames

This option does the same thing as `-mpv_flags +nopimb` but for the
`libxvid` encoder.

While encoding an `MPEG4` file with libxvid, add the following option
to the `ffgac` command line:

`-intra_penalty max`

## MJPEG encoding

### Define quantization table

`ffmpeg` calculates the `quantization table` for `JPEG` based on the
`-q` option. But what if we want to force our own quantization table
in the encoding process instead of letting `ffmpeg` calculate it?

To do that, while encoding a `JPEG` or `MJPEG` file, add the following
option to the `ffgac` command line:

`-dqt <dqt.json>`

For example we want a super high quality image (quantization coefficients
of 1) except for the first `AC` coefficient, which will be of horrible
quality (quantization coefficient of 255).
Create a file named `dqt.json` with the following contents:

```js
{
  "luma": [
    1, 255, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1
  ],
  "chroma": [
    1, 255, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1
  ]
}
```

then run:

```bash
$ ffgac -i dawson.jpg -dct int -dqt dqt.json -y dqtawson.jpg
```

and you'll get:

![Dawson's Creek](/assets/images/dqtawson.jpg)

The `-dct int` option above is used to prevent `ffmpeg` from using a
fast DCT algorithm which could cause overflow bugs.

If you want to explore those overflow bugs, create a file named
`dqt_overflow.json` with the `DC` coefficient being greater than `128`:

```js
{
  "luma": [
   129, 12, 14, 16, 19, 20, 21, 25,
    12, 12, 16, 18, 20, 21, 25, 27,
    14, 16, 19, 20, 21, 25, 25, 28,
    16, 16, 19, 20, 21, 25, 27, 30,
    16, 19, 20, 21, 24, 26, 30, 36,
    19, 20, 21, 24, 26, 30, 36, 43,
    19, 20, 21, 25, 28, 34, 42, 51,
    20, 21, 26, 28, 34, 42, 51, 62
  ],
  "chroma": [
   129, 12, 14, 16, 19, 20, 21, 25,
    12, 12, 16, 18, 20, 21, 25, 27,
    14, 16, 19, 20, 21, 25, 25, 28,
    16, 16, 19, 20, 21, 25, 27, 30,
    16, 19, 20, 21, 24, 26, 30, 36,
    19, 20, 21, 24, 26, 30, 36, 43,
    19, 20, 21, 25, 28, 34, 42, 51,
    20, 21, 26, 28, 34, 42, 51, 62
  ]
}
```

then run:

```bash
$ ffgac -i dawson.jpg -dqt dqt_overflow.json -y dqtawson_bug.jpg
```

and you'll get:

![Dawson's Creek](/assets/images/dqtawson_bug.jpg)

What's interesting about this type of glitch is that the `DCT`
algorithm in the `JPEG` standard is **not** an
*exact match inverse transform*.
`JPEG` encoders and decoders are free to implement things differently
within an error tolerance bound.
This means that different decoders will decode slightly differently.
But when it comes to handling overflows, they might behave very
differently.

So the resulting glitch will be very different depending on what
browser or platform you're using! Try uploading it to Facebook to see
what happens...

## PNG and APNG encoding

### Filter row (script)

If you want to modify the `filter_type` or the image data itself while
encoding, you can script it.

The main function in the script `filter_row_func` takes `args` as
parameters, which has the following fields:
* `png_filter_row`: the function that will filter the data
* `dst`: an `Uint8FFPtr` with the filtered data to be written.
* `top`: an `Uint8FFPtr` with the source data from the previous row (or `undefined` for the first row).
* `src`: an `Uint8FFPtr` with the source data from the current row.
* `bpp`: a `number` with the bytes per pixel.

The function must return the `filter_type` to be written in the bitstream
(note: it may differ from what was actually used, for greater glitching effect).

```js
// PNG filter type values
const PNG_FILTER_VALUE_NONE   = 0;
const PNG_FILTER_VALUE_SUB    = 1;
const PNG_FILTER_VALUE_UP     = 2;
const PNG_FILTER_VALUE_AVG    = 3;
const PNG_FILTER_VALUE_PAETH  = 4;
// parameters to use while filtering, and to write to the bitstream.
const use_filter_type = PNG_FILTER_VALUE_UP;
const ret_filter_type = PNG_FILTER_VALUE_AVG;
export function setup()
{
  // this function is called once at the beginning
}
export function filter_row_func(args)
{
  const png_filter_row = args.png_filter_row;
  const dst = args.dst;
  const top = args.top;
  const src = args.src;
  const bpp = args.bpp;
  // on the first line, we must use NONE or SUB because there is no top
  if ( !top )
  {
    png_filter_row(PNG_FILTER_VALUE_SUB, dst, src, top, bpp);
    return PNG_FILTER_VALUE_SUB;
  }
  png_filter_row(use_filter_type, dst, src, top, bpp);
  return ret_filter_type;
}
```

To do that, while encoding an `PNG` or `APNG` file, add the following
option to the `ffgac` command line:

`-filter_row_script <script file>`

For example, with the script above and the following commane line:

```bash
$ ffgac -i lena420.jpg -filter_row_script png_filter.js -y lena420_up_avg.png
```

you get:

![Lena Up Avg Png](/assets/images/lena420_up_avg.png)

## vf_script

`ffgac` includes the `script` video filter.
This filter lets you edit the **pixels** of a video (this filter does
**not** work on the **bitstream**, like `ffedit` does), one frame at a
time, with a custom
[JavaScript](https://en.wikipedia.org/wiki/JavaScript)
or
[Python3](https://en.wikipedia.org/wiki/Python_%28programming_language%29)
script.

This filter takes one parameter. It's `file=<javascript or python script file>`.

The entire script will be evaluated once before filtering starts.
The script must have one global function named `filter(args)`.
This function will be called once per frame, with the following arguments:

- `args["frame_num"]` is an integer value with the current frame number
- `args["pts"]` is an integer value with the timestamp of the current frame
- `args["data"]` is an array with the pixels for the frame

The layout of `args["data"]` depends on the pixel format of the video.
For `YUV` videos, `args["data"]` will be an array with 3 elements:
the first one being a 2d array for the pixels in the `Y` plane, and the
second the third elements being 2d arrays for the pixels in the `U` and
`V` planes.

Note that the 2d arrays are **not normal arrays** in either scripting
languages. They are abstractions that point directly to the image data
inside `ffgac`. So you will not be able to do funky stuff like
reordering rows with simple array operations. They should be used only
for reading and writing to the data.

For example, create a file named `uv.js` with the following contents:

```js
function filter(args)
{
  let data = args["data"];
  // planes are [ Y, U, V ]
  const plen = data.length;
  for ( let p = 0; p < plen; p++ )
  {
    // skip plane Y, leave it as-is
    if ( p == 0 )
      continue;
    // for planes U and V, draw a color plane
    let plane = data[p];
    const ilen = plane.length;
    for ( let i = 0; i < ilen; i++ )
    {
      let row = plane[i];
      const jlen = row.length;
      for ( let j = 0; j < jlen; j++ )
      {
        if ( p == 1 )
          row[j] = j+j;
        else
          row[j] = 254-(i+i);
      }
    }
  }
}
```

Then run `ffgac` on top of the `testsrc2` video source with:

```bash
$ ffgac -f lavfi -i testsrc2="duration=10:size=256x256" -vf script="file=uv.js" -y output.mp4
```

and you'll end up with this nice video:

<video preload="auto" loop autoplay muted controls width="100%">
  <source src="/assets/images/testsrc2_uv.mp4" type="video/mp4">
</video>

You can alternatively achieve the same result with the following `Python3` script:

```py
def filter(args):
  data = args["data"]
  # planes are [ Y, U, V ]
  for p, plane in enumerate(data):
    # skip plane Y
    if p == 0:
      continue
    # for planes U and V, draw a color plane
    for i, row in enumerate(plane):
      for j in range(len(row)):
        if p == 1:
          row[j] = j+j
        else:
          row[j] = 254-(i+i)
```

and this command line:

```bash
$ ffgac -f lavfi -i testsrc2="duration=10:size=256x256" -vf script="file=uv.py" -y output.mp4
```

### Pixelsorting

Remember `pixelsorting`, the most **amazing** datamoshing algorithm out there?

Well, one day I was bored and decided to implement it.

So... `ffgac` also supports `pixelsorting`, using the `script` video
filter.

The `pixelsort` method is added to the global `ffgac` object in the
`JavaScript` scripts (`Python3` is not supported).
The function parameters are as follows:

```
ffgac.pixelsort(data, [ range y ], [ range x ], options);
```

Where

`range_y` is an array with two elements: the first and last rows to pixelsort.
To pixelsort all rows, use `[ 0, data[0].length ]`.

and

`range_x` is an array with two elements: the first and last columns to pixelsort.
To pixelsort all columns, use `[ 0, data[0][0].length ]`.

and

`options` is an object `{}` with a bunch of options.

The options are:
- `mode` must be one of `"threshold"` or `"random"`
- `colorspace` must be one of `"yuv"`, `"rgb"`, `"hsv"`, or `"hsl"`
- `order` must be one of `"columns"` or `"rows"`
- `trigger_by` is which element you want to trigger by:
  - `"yuv"`: `'y'`, `'u'`, or `'v'`
  - `"rgb"`: `'r'`, `'g'`, or `'b'`
  - `"hsv"`: `'h'`, `'s'`, or `'v'`
  - `"hsl"`: `'h'`, `'s'`, or `'l'`
- `sort_by` is which element you want to sort by:
  - `"yuv"`: `'y'`, `'u'`, or `'v'`
  - `"rgb"`: `'r'`, `'g'`, or `'b'`
  - `"hsv"`: `'h'`, `'s'`, or `'v'`
  - `"hsl"`: `'h'`, `'s'`, or `'l'`
- `threshold` is used in the `"threshold"` mode. It is an array `[ lower, upper ]`, where `lower` and `upper` are between `0` and `1`.
- `clength` is used in the `"random"` mode. It is a value between `0` and `1`.

So, to pixelsort the entire image, use:
```
ffgac.pixelsort(data, [ 0, data[0].length ], [ 0, data[0][0].length ], options);
```

For example, with the following `pixelsort.js` script:

```js
const opt_pix_fmt    = "gbrp";          // supported pixel formats are "gbrp" and "yuv444p"
const opt_colorspace = "hsv";           // yuv444p: "yuv";
                                        // gbrp:    "rgb", "hsv", "hsl"
const opt_range_y    = [ 0, 1 ];        // [ [0 .. 1], [0 .. 1] ]
const opt_range_x    = [ 0, 1 ];        // [ [0 .. 1], [0 .. 1] ]
const opt_threshold  = [ 0.25, 0.75 ];  // [ [0 .. 1], [0 .. 1] ]
const opt_clength    = 0;               // [0 .. 1]
const opt_order      = 0;               // 0: vertical; 1: horizontal
const opt_trigger_by = 2;               // 0, 1, or 2
const opt_sort_by    = 2;               // 0, 1, or 2
const opt_mode       = 0;               // 0: threshold; 1: random

const opt_frame_period = 120;

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
}

/*********************************************************************/
let frame_num = 0;
export function filter(args)
{
  // input data
  const data = args["data"];
  const height = data[0].height;
  const width  = data[0].width;

  // per-frame parameters
  const div_frame_num = (frame_num / opt_frame_period);
  const x = (frame_num % opt_frame_period) / opt_frame_period;
  frame_num++;

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

  // order: "vertical", "horizontal"
  // const order = (opt_order === 0) ? "vertical" : "horizontal";
  const order = (div_frame_num > 1) ? "vertical" : "horizontal";

  // mode: "threshold", "random"
  const mode = (opt_mode === 0) ? "threshold" : "random";

  // reverse_sort: boolean
  const reverse_sort = (div_frame_num > 1) ? true : false;

  // threshold
  let y_low;
  let y_high;
  if ( x < 0.25 )
  {
    y_low  = 0;
    y_high = 0 + (4 * (x - 0.00));
  }
  else if ( x < 0.50 )
  {
    y_low  = 0 + (4 * (x - 0.25));
    y_high = 1;
  }
  else if ( x < 0.75 )
  {
    y_low  = 1 - (4 * (x - 0.50));
    y_high = 1;
  }
  else /* if ( x < 1.00 ) */
  {
    y_low  = 0;
    y_high = 1 - (4 * (x - 0.75));
  }
  const threshold_low  = scaleValue(y_low,  0, 1, opt_threshold[0], opt_threshold[1]);
  const threshold_high = scaleValue(y_high, 0, 1, opt_threshold[0], opt_threshold[1]);
  const threshold = [ threshold_low, threshold_high ];

  // random
  const clength = (opt_order === 0)
                ? Math.lround(scaleValue(opt_clength, 0, 1, 0, (x_end - x_begin)))
                : Math.lround(scaleValue(opt_clength, 0, 1, 0, (y_end - y_begin)));

  // options
  const options = {
    colorspace: colorspace,
    trigger_by: trigger_by,
    sort_by: sort_by,
    order: order,
    mode: mode,
    reverse_sort: reverse_sort,
    threshold: threshold,                   // can be high low or low high
    clength: clength,
  };

  // call the internal pixelsort function
  ffgac.pixelsort(data, range_y, range_x, options);
}
```

and the following command line:

```bash
$ ffgac -r 30 -loop 1 -i lena.png -vf script=pixelsort.js -vframes 240 -c:v libx264 -preset ultrafast -qp 0 -y lena_pixelsorted.mkv
```

you get the following video:

<p class="centered">
<video preload="auto" loop autoplay muted controls width="100%">
  <source src="/assets/images/lena_pixelsorted.mp4" type="video/mp4">
</video>
Pixelsorted Lena.
</p>
