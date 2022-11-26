---
layout: page
title: Features
---

# Features

FFglitch supports the following codecs for now:
- [`JPEG`](https://en.wikipedia.org/wiki/JPEG)
- [`MPEG-2`](https://en.wikipedia.org/wiki/MPEG-2)
- [`MPEG-4`](https://en.wikipedia.org/wiki/MPEG-4)

## JPEG

`JPEG` is probably the most widely used codec for digital images.

The following `features` are supported:
* [Info](#mjpeg-info)
* [Quantized DCT](#mjpeg-q_dct)
* Quantized DC coefficient of the DCT
* Quantization Table
* Huffman Table

<div id="mjpeg-info"></div>
## Info
The `"info"` feature for `MJPEG` is currently empty. It doesn't export anything.

<div id="mjpeg-q_dct"></div>
## Quantized DCT

The `"q_dct"` feature for `MJPEG` exports the quantized coefficients of
the `DCT` transform that are encoded in the bitstream.

Instead of encoding each pixel of the image like a
[`bitmap`](https://en.wikipedia.org/wiki/BMP_file_format) file would,
the `MJPEG` codec will transform those pixels into the frequency domain
using the
[`Discrete Cosine Transform`](https://en.wikipedia.org/wiki/Discrete_cosine_transform),
[`quantize`](https://en.wikipedia.org/wiki/Quantization_%28signal_processing%29)
those coefficients, and encode them instead.
You don't really need to understand what all this means.

What is important to know here is that the first coefficient will give
one "background" color for the macroblock, and each subsequent
coefficient will add finer and finer details into the macroblock (the
"texture" of the macroblock).

The `q_dct` object has one `key/value` pair, where the key is called
**data**, and the value is a 4-dimensional array, where each of the
dimensions represent the following:
* **planes**: there are three planes in an `MJPEG` file. One for the
  luminance (`Y`), and two for chrominance (`U` and `V`).
* **rows**: there will be `image_height / 8` rows for the luma plane,
  and either `image_height / 8` or `image_height / 16` rows for the
  chroma planes, depending on the `pixel format` that was used.
* **columns**: there will be `image_width / 8` columns for the luma
  plane, and either `image_width / 8` or `image_width / 16` columns for
  the chroma planes, depending on the `pixel format` that was used.
* **coefficients**: there will be 64 quantized `DCT` coefficients for
  each macroblock. Instead of being represented as a 2-dimensional
  array, the coefficients are represented as a 1-dimensional array in
  the `zig-zag` scanning order, following the green line below from the
  top left corner to the bottom right corner:

![empty JPEG](/assets/images/zigzag.svg){: .zig_zag }

## MPEG-2

`MPEG-2` is a very simple and beautiful video codec. It used to be
**THE THING** back in the late 90's and the days where DVDs reigned
supreme.

It's still a good codec for glitching, since it's not very complex and
it's very resilient to corruption.

The following `features` are supported:
* [Info](#mpeg2-info)
* Motion Vectors
* Motion Vector Deltas
* Quantization Scale
* Quantized DCT
* Full Macroblocks

<div id="mpeg2-info"></div>
## Info
The `"info"` feature for `MPEG-2` exports some information about the
picture type and the macroblock types. This feature is purely
informative, no changes here will be applied back when transplicating.

The `info` object has the following `key/value` pairs:
* **pict_type**: (informative)
  picture type. This can either be:
  * `"I"` for `I-frames`
  * `"P"` for `P-frames`
  * `"B"` for `B-frames`
* **interlaced**: (informative)
  a boolean of whether the frame is interlaced or not (I have **never**
  seen a file that has this set to **true**). If `interlaced` were
  true, there would be another key called **field**, with the possible
  values of **top** or **bottom**.
* **mb_type**: (informative)
  a 2-dimensional array containing information about each macroblock.
  Each element of the 2-dimensional array can be either
  * `null` if the macroblock was skipped
  * a `string`, where each letter in the string corresponds to a
    certain macroblock feature

The `mb_type` string for each macroblock is encoded as follows:
  * `'I'` for an `intra` macroblock (`I`, `P`, and `B` frames)
  * `'q'` for macroblocks that change the `quantization scale` (`I`, `P`, and `B` frames)
  * `'c'` for macroblocks that change the `DCT coefficients` (`P` and `B` frames)
  * `'f'` for forward motion vectors (`P` and `B` frames)
  * `'b'` for backward motion vectors (`B` frames)

## MPEG-4

Differently from `MPEG-2`, which is a very simple and beautiful video
codec, `MPEG-4` is a huge and ugly beast.

It added support for
**Global Motion Compenstion**,
**Direct Mode Motion Compensation**,
**Quarter Sample Mode Interpolation**,
**Grayscale Alpha planes**,
**Sprites**,
**3D Mesh Objects**,
**Face and Body Animation** (yes, you can encode faces and bodies in `MPEG-4`),
**Wavelet transform**,
**N-bit** (whatever that means),
and a bunch of things more.

It didn't really reflect the reality of what was needed for codec
technology at the time, and it still doesn't reflect reality of what
would be needed for codec technology today. `MPEG-4` is kind of like
what Dr. Henry Wu says in Jurassic World:
"But you didn't ask for reality. You asked for **MORE TEETH**!".

This added an enormous amount of complexity to the codec.
Even things that used to be simple to understand, such as the concept
of a `video frame`, was rebranded as a `Video Object Plane`, or `VOP`.
And there are four types of `VOP`s: `I`, `P`, `B`, and `S(GMC)`, where
`GMC` stands for `Global Motion Compensation`.
I don't like the expression `VOP`, I'll just keep calling them frames.

Most decoders don't support most of the features that should have gone
into `MPEG-4`. But that's ok, we kind of settled on a subset of
features that make sense.

There are many different well-known implementations of `MPEG-4`.
Remember **DivX ;-)**, with its watermarked logo ruining a bunch of
videos? Remember **Xvid**, which was very confusing in the beginning
because we'd ask ourselves "wait, what? wasn't it spelled the other way
around?"? They were `MPEG-4` too (and not `MPEG-2` for </pun>).
Remember **RealVideo**? That shit was based on `MPEG-4` (well, mostly
`H.263`, which was a saner codec, and mostly interoperable with `MPEG-4`).
**RealVideo**, on the other hand, was not sane, and definitely not
interoperable with anything.

Anyways... Just like most implementations of `MPEG-4` encoders and
decoders, FFmpeg supports only some of its features, and since FFglitch
is based on FFmpeg, only the following `features` are supported for now:
* [Info](#mpeg4-info)
* Motion Vectors
* Motion Vector Deltas
* Full Macroblocks
* Global Motion Compensation

<div id="mpeg4-info"></div>
## Info

The `"info"` feature for `MPEG-4` exports some information about the
picture type and the macroblock types. This feature is purely
informative, no changes here will be applied back when transplicating.

The `info` object has the following `key/value` pairs:
* **pict_type**: (informative)
  picture type. This can either be:
  * `"I"` for `I-frames`
  * `"P"` for `P-frames`
  * `"B"` for `B-frames`
  * `"S"` for `S(GMC)-frames`
* **mb_type**: (informative)
  a 2-dimensional array containing information about each macroblock.
  Each element of the 2-dimensional array can be either
  * `null` if the macroblock was skipped
  * a `string`, where each letter in the string corresponds to a
    certain macroblock feature

The `mb_type` string for each macroblock is encoded as follows:
  * `'I'` for an `intra` macroblock (`I`, `P`, and `S(GMC)` frames)
  * `'a'` for macroblocks with `AC Prediction` (`I` frames)
  * `'q'` for macroblocks that change the `quantization scale` (`I`, `P`, `B`, and `S(GMC)` frames)
  * `'f'` for forward motion vectors (`P`, `B`, and `S(GMC)` frames)
  * `'b'` for backward motion vectors (`B` frames)
  * `'d'` for direct motion vectors (`B` frames)
  * `'G'` for `Global Motion Compensation` (`S(GMC)` frames)
  * `'4'` for macroblocks with 4 `8x8` motion vectors instead of 1 `16x16` (`P` and `S(GMC)` frames)
  * `'i'` for Interlaced macroblocks (motion vectors are `16x8` in this case) (`P`, `B`, and `S(GMC)` frames)
  * `'1'` for macroblocks that change the `DCT coefficients` of the first luma block
  * `'2'` for macroblocks that change the `DCT coefficients` of the second luma block
  * `'3'` for macroblocks that change the `DCT coefficients` of the third luma block
  * `'4'` for macroblocks that change the `DCT coefficients` of the fourth luma block
  * `'5'` for macroblocks that change the `DCT coefficients` of the U chroma block
  * `'6'` for macroblocks that change the `DCT coefficients` of the V chroma block
