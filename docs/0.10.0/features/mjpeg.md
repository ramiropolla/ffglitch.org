---
layout: page
title: JPEG features
permalink: /docs/0.10.0/features/mjpeg/
---

# JPEG features

The following `features` are supported for `JPEG`:
* [Info](#mjpeg-info)
* [Quantized DCT coefficients](#mjpeg-q_dct)
* [Quantized DCT coefficients (with DC delta)](#mjpeg-q_dct_delta)
* [Quantized DCT coefficients (DC only)](#mjpeg-q_dc)
* [Quantized DCT coefficients (DC delta only)](#mjpeg-q_dc_delta)
* [Quantization Table](#mjpeg-dqt)
* [Huffman Table](#mjpeg-dht)

<!-------------------------------------------------------------------->
<div id="mjpeg-info"></div>
## Info

The `"info"` feature for `JPEG` is currently empty. It doesn't export anything.

<!-------------------------------------------------------------------->
<div id="mjpeg-q_dct"></div>
## Quantized DCT coefficients

The `"q_dct"` feature for `JPEG` exports the quantized coefficients of
the `DCT` transform that are encoded in the bitstream.

<div id="mjpeg_q_dct_desc"></div>
<div id="mjpeg_q_dct_path"></div>

<span id="mjpeg_q_dct_dct_coeff_dc">TODO</span>: `number`:<br />
* The `DC` coefficient for this block.

<span id="mjpeg_q_dct_dct_coeff_ac">TODO</span>: `number`:<br />
* An `AC` coefficient for this block (from 1 to 63), in the `zig-zag` scan order.

<span id="mjpeg_q_dct_v_count">TODO</span>: (informative) `number`:<br />
* The count of `vertical` blocks per macroblock for each component.

<span id="mjpeg_q_dct_h_count">TODO</span>: (informative) `number`:<br />
* The count of `horizontal` blocks per macroblock for each component.

<span id="mjpeg_q_dct_quant_index">TODO</span>: (informative) `number`:<br />
* The index for the `Quantization Table` for each plane, as defined in the `"dqt"` feature.

<!-------------------------------------------------------------------->
<div id="mjpeg-q_dct_delta"></div>
## Quantized DCT coefficients (with DC delta)

The `"q_dct_delta"` feature for `JPEG` is similar to the `"q_dct"` feature,
but the `DC` coefficient is expressed as a **delta** value from the previous
`DC` coefficient.

<!--
### Blocks and Macroblocks in JPEG

The `JPEG` codec divides the image into `blocks` of `8x8` pixels.
These blocks are grouped into `macroblocks` (in the `JPEG` specification
they're called `MCUs`, for `minimum coded units`, but we'll call them
`macroblocks`).

The grouping of `block`s into a `macroblock` will depend on the chroma
subsampling used. Read the [YUV overview](../codecs/yuv) for a better
understanding of chroma subsampling.

In the following `YUV420` `macroblock`, we have 4 `Y` `block`s for each
1 `U` and 1 `V` block. Therefore, we have 6 blocks inside 1 macroblock.

<div id="yuv420_macroblock"></div>

NOTE draw_yuv on my box draws 174x174px
320x240 -> 160x120
QCIF 176x144 -> QQCIF 88x72

The sequence in which the `blocks` are encoded inside a `macroblock` is
in raster scan order (left to right, top to bottom), starting with the
first component (`Y`), then `U`, and then `V`.

<div id="yuv420_macroblock_raster"></div>
12 5 6
34

Now look at how this `YUV422` macroblock is encoded.

<div id="yuv422_macroblock_raster_2"></div>
12 5 7
34 6 8

But it could also equally be encoded as:

<div id="yuv422_macroblock_raster_1"></div>
12 3 4

So in `JPEG` we have the vertical and horizontal sampling factor.
It specifies how many blocks are encoded by macroblock.

Why does this matter (1 or 2)? Well, the DC prediction will be in a different order.
-->
<!--
https://zpl.fi/chroma-subsampling-and-jpeg-sampling-factors
-->

Note that the *previous* `DC` coefficient is not necessarily the one from
the block immediately to the left since there might be multiple `blocks`
inside a `macroblock`, which will be encoded in a raster scan order (left
to right, top to bottom) **per-macroblock**.

<div id="mjpeg_q_dct_delta_desc"></div>
<div id="mjpeg_q_dct_delta_path"></div>

<span id="mjpeg_q_dct_delta_dct_coeff_dc_delta">TODO</span>: `number`:<br />
* The `DC` coefficient delta for this block.

<span id="mjpeg_q_dct_delta_dct_coeff_ac">TODO</span>: `number`:<br />
* An `AC` coefficient for this block (from 1 to 63), in the `zig-zag` scan order.

<span id="mjpeg_q_dct_delta_v_count">TODO</span>: (informative) `number`:<br />
* The count of `vertical` blocks per macroblock for each component.

<span id="mjpeg_q_dct_delta_h_count">TODO</span>: (informative) `number`:<br />
* The count of `horizontal` blocks per macroblock for each component.

<span id="mjpeg_q_dct_delta_quant_index">TODO</span>: (informative) `number`:<br />
* The index for the `Quantization Table` for each plane, as defined in the `"dqt"` feature.

<!-------------------------------------------------------------------->
<div id="mjpeg-q_dc"></div>
## Quantized DCT coefficients (DC only)

The `"q_dc"` feature for `JPEG` is similar to the `"q_dct"` feature,
but only the `DC` coefficients are available.

<div id="mjpeg_q_dc_desc"></div>
<div id="mjpeg_q_dc_path"></div>

<span id="mjpeg_q_dc_dct_coeff_dc">TODO</span>: `number`:<br />
* The `DC` coefficient for this block.

<span id="mjpeg_q_dc_v_count">TODO</span>: (informative) `number`:<br />
* The count of `vertical` blocks per macroblock for each component.

<span id="mjpeg_q_dc_h_count">TODO</span>: (informative) `number`:<br />
* The count of `horizontal` blocks per macroblock for each component.

<span id="mjpeg_q_dc_quant_index">TODO</span>: (informative) `number`:<br />
* The index for the `Quantization Table` for each plane, as defined in the `"dqt"` feature.

<!-------------------------------------------------------------------->
<div id="mjpeg-q_dc_delta"></div>
## Quantized DCT coefficients (DC delta only)

The `"q_dc_delta"` feature for `JPEG` is similar to the `"q_dc"` feature,
but the `DC` coefficient is expressed as a **delta** value from the previous
`DC` coefficient.

<div id="mjpeg_q_dc_delta_desc"></div>
<div id="mjpeg_q_dc_delta_path"></div>

<span id="mjpeg_q_dc_delta_dct_coeff_dc_delta">TODO</span>: `number`:<br />
* The `DC` coefficient delta for this block.

<span id="mjpeg_q_dc_delta_v_count">TODO</span>: (informative) `number`:<br />
* The count of `vertical` blocks per macroblock for each component.

<span id="mjpeg_q_dc_delta_h_count">TODO</span>: (informative) `number`:<br />
* The count of `horizontal` blocks per macroblock for each component.

<span id="mjpeg_q_dc_delta_quant_index">TODO</span>: (informative) `number`:<br />
* The index for the `Quantization Table` for each plane, as defined in the `"dqt"` feature.

<!-------------------------------------------------------------------->
<div id="mjpeg-dqt"></div>
## Quantization Table

The `"dqt"` feature for `JPEG` exports the `quantization tables`.
These values will be used to multiply the quantized coefficients before
they go through the `IDCT`.

There may be one or multiple tables (for `luminance` or `chrominance`
planes for example), depending on the encoder.

<div id="mjpeg_dqt_desc"></div>
<div id="mjpeg_dqt_path"></div>

<span id="mjpeg_dqt_quant_value">TODO</span>: `number`:<br />
* The quantization value for this index.

<!-------------------------------------------------------------------->
<div id="mjpeg-dht"></div>
## Huffman Table

Honestly, you don't want to mess with this one...
You **will** break the glitched file in incomprehensible ways.
I don't even know why I implemented it...
So I won't even bother explaining it.

<div id="mjpeg_dht_desc"></div>
<div id="mjpeg_dht_path"></div>

<span id="mjpeg_dht_class">TODO</span>: `number`:<br />
* The Huffman Table class.

<span id="mjpeg_dht_index">TODO</span>: `number`:<br />
* The Huffman Table index.

<span id="mjpeg_dht_value">TODO</span>: `number`:<br />
* The Huffman Table value for this amount of bits.

<!-------------------------------------------------------------------->
<script type="module" src="../mjpeg.js"></script>
