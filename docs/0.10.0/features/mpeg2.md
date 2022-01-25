---
layout: page
title: MPEG2 features
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
### Quantized DCT coefficients

<!-------------------------------------------------------------------->
<div id="mpeg2-q_dct_delta"></div>
### Quantized DCT coefficients (with DC delta)

<!-------------------------------------------------------------------->
<div id="mpeg2-q_dc"></div>
### Quantized DCT coefficients (DC only)

<!-------------------------------------------------------------------->
<div id="mpeg2-q_dc_delta"></div>
### Quantized DCT coefficients (DC delta only)

<!-------------------------------------------------------------------->
<div id="mpeg2-mv"></div>
### Motion vectors

<!-------------------------------------------------------------------->
<div id="mpeg2-mv_delta"></div>
### Motion vectors (delta only)

<!-------------------------------------------------------------------->
<div id="mpeg2-qscale"></div>
### Quantization scale

<!-------------------------------------------------------------------->
<div id="mpeg2-mb"></div>
### Macroblock

<!-------------------------------------------------------------------->
<script type="module" src="mpeg2.js"></script>
