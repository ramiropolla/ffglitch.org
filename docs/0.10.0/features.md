---
layout: page
title: Features
---

# Features

## JPEG

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

The following `features` are supported for `MPEG-2`:
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

The following `features` are supported for `MPEG-4`:
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
