---
layout: page
title: MPEG2 features
permalink: /docs/0.10.0/features/mpeg2/
---

# MPEG-2 features

The following `features` are supported for `MPEG-2`:
* [Info](#mpeg2-info)
* [Quantized DCT coefficients](#mpeg2-q_dct)
* [Quantized DCT coefficients (with DC delta)](#mpeg2-q_dct_delta)
* [Quantized DCT coefficients (DC only)](#mpeg2-q_dc)
* [Quantized DCT coefficients (DC delta only)](#mpeg2-q_dc_delta)
* [Motion vectors](#mpeg2-mv)
* [Motion vectors (delta only)](#mpeg2-mv_delta)
* [Quantization scale](#mpeg2-qscale)
* [Macroblock](#mpeg2-mb)

<!-------------------------------------------------------------------->
<div id="mpeg2-info"></div>
### Info

The `"info"` feature for `MPEG-2` exports some information about the
picture type and the macroblock types. This feature is purely
informative, no changes here will be applied back when transplicating.

<div id="mpeg2_info_desc"></div>
<div id="mpeg2_info_path"></div>

<span id="mpeg2_info_pict_type">TODO</span>: `string`:<br />
Picture type. This can either be:
* `"I"` for `I-frames`
* `"P"` for `P-frames`
* `"B"` for `B-frames`

<span id="mpeg2_info_interlaced">TODO</span>: `boolean`:<br />
* **true** for interlaced frame
  (note: I have **never** seen a file that has this set to **true**)
* **false** for non-interlaced frame

<span id="mpeg2_info_field">TODO</span>: `string`: (optional when `interlaced` is true)<br />
* **top** for top field.
* **bottom** for bottom field;

<span id="mpeg2_info_mb_type">TODO</span>:
* `null` if the macroblock was skipped
* a `string`, where each letter in the string corresponds to a
  certain macroblock feature:
  * `'I'` for an `intra` macroblock (`I`, `P`, and `B` frames)
  * `'q'` for macroblocks that change the `quantization scale` (`I`, `P`, and `B` frames)
  * `'c'` for macroblocks that change the `DCT coefficients` (`P` and `B` frames)
  * `'f'` for forward motion vectors (`P` and `B` frames)
  * `'b'` for backward motion vectors (`B` frames)

<!-------------------------------------------------------------------->
<div id="mpeg2-q_dct"></div>
## Quantized DCT coefficients

The `"q_dct"` feature for `MPEG-2` exports the quantized coefficients of
the `DCT` transform that are encoded in the bitstream.

<div id="mpeg2_q_dct_desc"></div>
<div id="mpeg2_q_dct_path"></div>

<span id="mpeg2_q_dct_dct_coeff_dc">TODO</span>: `number`:<br />
* The `DC` coefficient for this block.

<span id="mpeg2_q_dct_dct_coeff_ac">TODO</span>: `number`:<br />
* An `AC` coefficient for this block (from 1 to 63), in the `zig-zag` scan order.

<span id="mpeg2_q_dct_v_count">TODO</span>: (informative) `number`:<br />
* The count of `vertical` blocks per macroblock for each component.

<span id="mpeg2_q_dct_h_count">TODO</span>: (informative) `number`:<br />
* The count of `horizontal` blocks per macroblock for each component.

<span id="mpeg2_q_dct_quant_index">TODO</span>: (informative) `number`:<br />
* The index for the `Quantization Table` for each plane, as defined in the `"dqt"` feature.

<!-------------------------------------------------------------------->
<div id="mpeg2-q_dct_delta"></div>
## Quantized DCT coefficients (with DC delta)

The `"q_dct_delta"` feature for `MPEG-2` is similar to the `"q_dct"` feature,
but the `DC` coefficient is expressed as a **delta** value from the previous
`DC` coefficient.

Note that the *previous* `DC` coefficient is not necessarily the one from
the block immediately to the left since there might be multiple `blocks`
inside a `macroblock`, which will be encoded in a raster scan order (left
to right, top to bottom) **per-macroblock**.

<div id="mpeg2_q_dct_delta_desc"></div>
<div id="mpeg2_q_dct_delta_path"></div>

<span id="mpeg2_q_dct_delta_dct_coeff_dc_delta">TODO</span>: `number`:<br />
* The `DC` coefficient delta for this block.

<span id="mpeg2_q_dct_delta_dct_coeff_ac">TODO</span>: `number`:<br />
* An `AC` coefficient for this block (from 1 to 63), in the `zig-zag` scan order.

<span id="mpeg2_q_dct_delta_v_count">TODO</span>: (informative) `number`:<br />
* The count of `vertical` blocks per macroblock for each component.

<span id="mpeg2_q_dct_delta_h_count">TODO</span>: (informative) `number`:<br />
* The count of `horizontal` blocks per macroblock for each component.

<span id="mpeg2_q_dct_delta_quant_index">TODO</span>: (informative) `number`:<br />
* The index for the `Quantization Table` for each plane, as defined in the `"dqt"` feature.

<!-------------------------------------------------------------------->
<div id="mpeg2-q_dc"></div>
## Quantized DCT coefficients (DC only)

The `"q_dc"` feature for `MPEG-2` is similar to the `"q_dct"` feature,
but only the `DC` coefficients are available.

<div id="mpeg2_q_dc_desc"></div>
<div id="mpeg2_q_dc_path"></div>

<span id="mpeg2_q_dc_dct_coeff_dc">TODO</span>: `number`:<br />
* The `DC` coefficient for this block.

<span id="mpeg2_q_dc_v_count">TODO</span>: (informative) `number`:<br />
* The count of `vertical` blocks per macroblock for each component.

<span id="mpeg2_q_dc_h_count">TODO</span>: (informative) `number`:<br />
* The count of `horizontal` blocks per macroblock for each component.

<span id="mpeg2_q_dc_quant_index">TODO</span>: (informative) `number`:<br />
* The index for the `Quantization Table` for each plane, as defined in the `"dqt"` feature.

<!-------------------------------------------------------------------->
<div id="mpeg2-q_dc_delta"></div>
## Quantized DCT coefficients (DC delta only)

The `"q_dc_delta"` feature for `MPEG-2` is similar to the `"q_dc"` feature,
but the `DC` coefficient is expressed as a **delta** value from the previous
`DC` coefficient.

<div id="mpeg2_q_dc_delta_desc"></div>
<div id="mpeg2_q_dc_delta_path"></div>

<span id="mpeg2_q_dc_delta_dct_coeff_dc_delta">TODO</span>: `number`:<br />
* The `DC` coefficient delta for this block.

<span id="mpeg2_q_dc_delta_v_count">TODO</span>: (informative) `number`:<br />
* The count of `vertical` blocks per macroblock for each component.

<span id="mpeg2_q_dc_delta_h_count">TODO</span>: (informative) `number`:<br />
* The count of `horizontal` blocks per macroblock for each component.

<span id="mpeg2_q_dc_delta_quant_index">TODO</span>: (informative) `number`:<br />
* The index for the `Quantization Table` for each plane, as defined in the `"dqt"` feature.

<!-------------------------------------------------------------------->
<div id="mpeg2-mv"></div>
## Motion vectors

The `"mv"` feature for `MPEG-2` exports the motion vectors that are
encoded in the bitstream.

There may be `"forward"` and `"backward"` motion vectors.

<div id="mpeg2_mv_desc"></div>
<div id="mpeg2_mv_path"></div>

<span id="mpeg2_mv_MV">TODO</span>: `MV`:<br />
* `null` if there is no motion vector for this macroblock
* an `Array` with two numbers, the first being `horizontal`
  and the second being `vertical`.

<span id="mpeg2_mv_fcode">TODO</span>: (informative) `fcode`:<br />
* `fcode` is an `Array` with two numbers, the first being `horizontal`
  and the second being `vertical`.
* This field is informative. It tells you the `fcode` that was encoded
  for this frame. This can be used to calculate the minimum and maximum
  values allowed for the motion vectors.
* For `MPEG-2`, the motion vector range is calculated by:
  ```js
  const min_val = -(1<<(3 + fcode));
  const max_val =  (1<<(3 + fcode))-1;
  ```

<span id="mpeg2_mv_overflow">TODO</span>: `string`:<br />
* The `"overflow"` field will instruct `FFglitch` on what to do when
  it imports motion vector values that overflow the limit defined by
  `fcode`. Possible values are:
  * `"assert"`: exits `FFglitch` on overflow.
  * `"truncate"`: truncates motion vector values within range (I suggest using this one).
  * `"ignore"`: does nothing (allows overflow).
  * `"warn"`: warns once, but then ignores.

<!-------------------------------------------------------------------->
<div id="mpeg2-mv_delta"></div>
## Motion vectors (delta only)

The `"mv_delta"` feature for `MPEG-2` is similar to the `"mv"` feature,
but the motion vectors are expressed as a **delta** value from the
previous motion vector.

There may be `"forward"` and `"backward"` motion vectors.

<div id="mpeg2_mv_delta_desc"></div>
<div id="mpeg2_mv_delta_path"></div>

<span id="mpeg2_mv_delta_MV_delta">TODO</span>: `MV_delta`:<br />
* `null` if there is no motion vector delta for this macroblock
* an `Array` with two numbers, the first being `horizontal`
  and the second being `vertical`.

<span id="mpeg2_mv_delta_fcode">TODO</span>: (informative) `fcode`:<br />
* `fcode` is an `Array` with two numbers, the first being `horizontal`
  and the second being `vertical`.
* This field is informative. It tells you the `fcode` that was encoded
  for this frame. This can be used to calculate the minimum and maximum
  values allowed for the motion vectors.
* For `MPEG-2`, the motion vector range is calculated by:
  ```js
  const min_val = -(1<<(3 + fcode));
  const max_val =  (1<<(3 + fcode))-1;
  ```

<span id="mpeg2_mv_delta_overflow">TODO</span>: `string`:<br />
* The `"overflow"` field will instruct `FFglitch` on what to do when
  it imports motion vector values that overflow the limit defined by
  `fcode`. Possible values are:
  * `"assert"`: exits `FFglitch` on overflow.
  * `"truncate"`: truncates motion vector values within range (I suggest using this one).
  * `"ignore"`: does nothing (allows overflow).
  * `"warn"`: warns once, but then ignores.

<!-------------------------------------------------------------------->
<div id="mpeg2-qscale"></div>
## Quantization scale

The `"qscale"` feature for `MPEG-2` exports the quantization scale value
for slices/macroblocks.

**TODO**

**NOTE**: this feature is not very thread-friendly in its current state
          in FFglitch. It will change in the future.

<!--
The qscale value is written in slice headers
(mpeg_decode_slice/ff_mpeg1_encode_slice_header)
and may also be present per-macroblock.
When it's set in a macroblock, it changes the qscale value for the rest of the slice.
The problem I have is that mb_x is written to the bitstream **after** qscale in
the slice header, so I don't know how to thread-safely create a list of qscale
values in the order they appear.
-->

<!-------------------------------------------------------------------->
<div id="mpeg2-mb"></div>
## Macroblock

The `"mb"` feature for `MPEG-2` exports the bytestream of each
macroblock as a string `value`.

Macroblocks are mostly self-sufficient, so it might be possible to
reorder them and still have a valid bitstream.

<div id="mpeg2_mb_desc"></div>
<div id="mpeg2_mb_path"></div>

<span id="mpeg2_mb_macroblock">TODO</span>: `macroblock`:<br />
* `null` if the macroblock was skipped.
* a `string` with the hexadecimal representation of the bytestream
  for this macroblock

<span id="mpeg2_mb_size">TODO</span>: (informative) `number`:<br />
* the size in bits of the macroblock.
  This is used by FFglitch to properly align the bitstream when
  transplicating. Do not change these values.

<!-------------------------------------------------------------------->
<script type="module" src="../mpeg2.js"></script>
