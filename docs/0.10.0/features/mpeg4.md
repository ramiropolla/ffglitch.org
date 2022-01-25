---
layout: page
title: MPEG4 features
---

# MPEG-4 features

The following `features` are supported for `MPEG-4`:
* [Info](#mpeg4-info)
* [Motion vectors](#mpeg4-mv)
* [Motion vectors (delta only)](#mpeg4-mv_delta)
* [Macroblock](#mpeg4-mb)
* [Global motion compensation](#mpeg4-gmc)

<!-------------------------------------------------------------------->
<div id="mpeg4-info"></div>
### Info

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

<!-------------------------------------------------------------------->
<div id="mpeg4-mv"></div>
### Motion vectors

<!-------------------------------------------------------------------->
<div id="mpeg4-mv_delta"></div>
### Motion vectors (delta only)

<!-------------------------------------------------------------------->
<div id="mpeg4-mb"></div>
### Macroblock

<!-------------------------------------------------------------------->
<div id="mpeg4-gmc"></div>
### Global motion compensation

<!-------------------------------------------------------------------->
<script type="module" src="mpeg4.js"></script>
