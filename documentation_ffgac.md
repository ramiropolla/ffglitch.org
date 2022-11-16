---
layout: page
title: ffgac
permalink: /docs/ffgac
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

`ffgac` is just `ffmpeg`, with the following extra features:

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
if you're going at `30` fps. And with each `keyframe`, you get an `I`
frame, which resets all your glitches.

But what if you want your glitch to last ***your entire acid trip***?
It'd be a bummer if you would get called back to reality every `20`
seconds.

Sure, you *could* remove the `I` frames with some other glitch tool,
but what about just not having them there in the first place?

To do that, while encoding an `MPEG2` or `MPEG4` file, add the following
option to the `ffgac` command line:

`-g max`

and there you go. No more `I` frames.

### `-fcode <arg>`

TODO

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
$ ffgac -i dawson.jpg -dct int -dqt dqt0.json -y dqtawson.jpg
```

and you'll get:

![Dawson's Creek](/assets/images/dqtawson.jpg)

The `-dct int` option above is used to prevent `ffmpeg` from using a
fast DCT algorithm which could cause overflow bugs.

If you want to explore those overflow bugs, create a file named
`dqt.json` with the `DC` coefficient being greater than `128`:

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
$ ffgac -i dawson.jpg -dqt dqt0.json -y dqtawson_bug.jpg
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

## vf_script

`ffgac` includes the `script` video filter.
This filter lets you edit the **pixels** of a video (this filter does
**not** work on the **bitstream**, like `ffedit` does), one frame at a
time, with a custom
[JavaScript](https://en.wikipedia.org/wiki/JavaScript)
or
[Python3](https://en.wikipedia.org/wiki/Python_%28programming_language%29)
script.

This filter takes one parameter. It's either `py=<python script file>`
or `js=<javascript file>`.

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
$ ffgac -f lavfi -i testsrc2="duration=10:size=256x256" -vf script="js=uv.js" -y output.mp4
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
$ ffgac -f lavfi -i testsrc2="duration=10:size=256x256" -vf script="py=uv.py" -y output.mp4
```

### Pixelsorting

ffgac.pixelsort()

```
ffgac.pixelsort(data, [ range y ], [ range x ], options)
```

`range_y` is an array with two elements: the first and last lines to pixelsort.
To pixelsort all lines, use `[ 0, data[0].length ]`.

`range_x` is an array with two elements: the first and last rows to pixelsort.
To pixelsort all rows, use `[ 0, data[0][0].length ]`.

So, to pixelsort the entire image, use:
```
ffgac.pixelsort(data, [ 0, data[0].length ], [ 0, data[0][0].length ], options);
```

`options` is an object `{}` with a bunch of options. They are:
- `mode` must be one of `threshold` or `random`
- `pix_fmt` must be one of `yuv`, `rgb`, `hsv`, or `hsl`
- `order` must be an array with `columns` and `rows` TODO this sucks. it should be columns **or** rows, and pixelsort should be called multiple times
- `trigger_by` is which element you want to trigger by. yuv, rgb, hsv, hsl
- `sort_by` is which element you want to sort by. yuv, rgb, hsv, hsl
- `threshold` is an array `[ lower, upper ]`
- `clength` is a value for random

h  is [ 0, 360 )
s  is [ 0, 1 )
vl is [ 0, 1 )

