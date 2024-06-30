---
layout: page
title: MPEG4 features
permalink: /docs/0.10.0/features/mpeg4/
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
## Info

The `"info"` feature for `MPEG-4` exports some information about the
picture type and the macroblock types. This feature is purely
informative, no changes here will be applied back when transplicating.

<div id="mpeg4_info_desc"></div>
<div id="mpeg4_info_path"></div>

<span id="mpeg4_info_pict_type">TODO</span>: `string`:<br />
Picture type. This can either be:
* `"I"` for `I-frames`
* `"P"` for `P-frames`
* `"B"` for `B-frames`
* `"S"` for `S(GMC)-frames`

<span id="mpeg4_info_interlaced">TODO</span>: `boolean`:<br />
* **true** for interlaced frame
  (note: I have **never** seen a file that has this set to **true**)
* **false** for non-interlaced frame

<span id="mpeg4_info_field">TODO</span>: `string`: (optional when `interlaced` is true)<br />
* **top** for top field.
* **bottom** for bottom field;

<span id="mpeg4_info_mb_type">TODO</span>:
* `null` if the macroblock was skipped
* a `string`, where each letter in the string corresponds to a
  certain macroblock feature:
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
## Motion vectors

The `"mv"` feature for `MPEG-4` exports the motion vectors that are
encoded in the bitstream.

There may be `"forward"` and `"backward"` motion vectors.

<div id="mpeg4_mv_desc"></div>
<div id="mpeg4_mv_path"></div>

<span id="mpeg4_mv_MV">TODO</span>: `MV`:<br />
* `null` if there is no motion vector delta for this macroblock
* an `Array` with two numbers, the first being `horizontal`
  and the second being `vertical`.
* an `Array` with **4** elements (in the case where there
  are 4 motion vectors per macroblock).
  Each element is either `null` or an `Array` with two numbers,
  the first being `horizontal` and the second being `vertical`.

<span id="mpeg4_mv_fcode">TODO</span>: (informative) `fcode`:<br />
* `fcode` is an `Array` with two numbers, the first being `horizontal`
  and the second being `vertical`.
* This field is informative. It tells you the `fcode` that was encoded
  for this frame. This can be used to calculate the minimum and maximum
  values allowed for the motion vectors.
* For `MPEG-4`, the motion vector range is calculated by:
  ```js
  const min_val = -(1<<(4 + fcode));
  const max_val =  (1<<(4 + fcode))-1;
  ```

<span id="mpeg4_mv_overflow">TODO</span>: `string`:<br />
* The `"overflow"` field will instruct `FFglitch` on what to do when
  it imports motion vector values that overflow the limit defined by
  `fcode`. Possible values are:
  * `"assert"`: exits `FFglitch` on overflow.
  * `"truncate"`: truncates motion vector values within range (I suggest using this one).
  * `"ignore"`: does nothing (allows overflow).
  * `"warn"`: warns once, but then ignores.

<!-------------------------------------------------------------------->
<div id="mpeg4-mv_delta"></div>
## Motion vectors (delta only)

The `"mv_delta"` feature for `MPEG-4` is similar to the `"mv"` feature,
but the motion vectors are expressed as a **delta** value from the
previous motion vector.

There may be `"forward"` and `"backward"` motion vectors.

<div id="mpeg4_mv_delta_desc"></div>
<div id="mpeg4_mv_delta_path"></div>

<span id="mpeg4_mv_delta_MV_delta">TODO</span>: `MV_delta`:<br />
* `null` if there is no motion vector delta for this macroblock
* an `Array` with two numbers, the first being `horizontal`
  and the second being `vertical`.
* an `Array` with **4** elements (in the case where there
  are 4 motion vectors per macroblock).
  Each element is either `null` or an `Array` with two numbers,
  the first being `horizontal` and the second being `vertical`.

<span id="mpeg4_mv_delta_fcode">TODO</span>: (informative) `fcode`:<br />
* `fcode` is an `Array` with two numbers, the first being `horizontal`
  and the second being `vertical`.
* This field is informative. It tells you the `fcode` that was encoded
  for this frame. This can be used to calculate the minimum and maximum
  values allowed for the motion vectors.
* For `MPEG-4`, the motion vector range is calculated by:
  ```js
  const min_val = -(1<<(4 + fcode));
  const max_val =  (1<<(4 + fcode))-1;
  ```

<span id="mpeg4_mv_delta_overflow">TODO</span>: `string`:<br />
* The `"overflow"` field will instruct `FFglitch` on what to do when
  it imports motion vector values that overflow the limit defined by
  `fcode`. Possible values are:
  * `"assert"`: exits `FFglitch` on overflow.
  * `"truncate"`: truncates motion vector values within range (I suggest using this one).
  * `"ignore"`: does nothing (allows overflow).
  * `"warn"`: warns once, but then ignores.

<!-------------------------------------------------------------------->
<div id="mpeg4-mb"></div>
## Macroblock

The `"mb"` feature for `MPEG-4` exports the bytestream of each
macroblock as a string `value`.

Macroblocks are mostly self-sufficient, so it might be possible to
reorder them and still have a valid bitstream.

<div id="mpeg4_mb_desc"></div>
<div id="mpeg4_mb_path"></div>

<span id="mpeg4_mb_macroblock">TODO</span>: `macroblock`:<br />
* `null` if the macroblock was skipped.
* a `string` with the hexadecimal representation of the bytestream
  for this macroblock

<span id="mpeg4_mb_size">TODO</span>: (informative) `number`:<br />
* the size in bits of the macroblock.
  This is used by FFglitch to properly align the bitstream when
  transplicating. Do not change these values.

<!-------------------------------------------------------------------->
<div id="mpeg4-gmc"></div>
### Global motion compensation

The `"gmc"` feature for `MPEG-4` exports the Global Motion Compensation
parameters for a frame.

`gmc` is an `Array` with up to 3 elements, each being an `Array` with 2
numbers each.

I don't remember how the `gmc` calculation is done.
I'll document this later if anyone reeeeally wants it.

<!--TODO improve-->
<!--
     21           "gmc":[
     22             [ 0, 0 ],
     23             [ 0, -1 ],
     24             [ 0, 0 ]
     25           ]
-->

<!-------------------------------------------------------------------->
<script type="module" src="../mpeg4.js"></script>
