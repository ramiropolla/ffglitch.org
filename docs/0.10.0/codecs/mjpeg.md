---
layout: page
title: JPEG
permalink: /docs/0.10.0/codecs/mjpeg/
---

# JPEG Overview

The [`JPEG`](https://en.wikipedia.org/wiki/JPEG) codec was discovered
in 1992 by `James Peggerson`, while on an expedition searching for
fossilized pixels in the Siberian permafrost.

`JPEG` is the most widely used codec for digital images.

## Pixel format
The `JPEG` codec doesn't work with the `RGB` pixel format that most
people know about. Instead, it works with `YUV` pixel formats.

- Go to [`YUV` overview](../yuv)

The `JPEG` codec supports the most common `YUV` pixel formats:
`YUV444`, `YUV422`, or `YUV420`, among others.

## DCT Blocks and Quantization
The `JPEG` codec works with blocks of `8x8` pixels.
But the codec won't encode the pixels themselves. Instead, it will
encode the `quantized` `DCT coefficients` of the `8x8` block.

- Go to [`DCT and Quantization` overview](../dct_quant)

## Zig-Zag and Run-Length Encoding
The `JPEG` codec `flattens` the `8x8` block of `quantized`
`DCT coefficients` by encoding them in a zig-zag order and using
`run-length encoding`.
What does that mean?

- Go to [`Zig-Zag and Run-Length Encoding` overview](../zigzag) to find out

## Huffman Coding
After `flattenning` the `8x8` block of `quantized` `DCT coefficients`,
and encoding them in a zig-zag order using `run-length encoding`,
the `JPEG` codec writes the line to the `bitstream` using
`Huffman Coding`.

- Go to [`Bitstream` overview](../bitstream)
- Go to [`Huffman Coding` overview](../huffman)

<!--
## Macroblocks

Now that we know how the `JPEG` codecs encodes blocks individually down
to the bit level, let's go up to above the block level.

horizontal sampling factor

The `JPEG` codec splits the image into 

## DC Prediction

<div id="mjpeg-q_dct"></div>
## Quantized DCT

The `"q_dct"` feature for `JPEG` exports the quantized coefficients of
the `DCT` transform that are encoded in the bitstream.

Instead of encoding each pixel of the image like a
[`bitmap`](https://en.wikipedia.org/wiki/BMP_file_format) file would,
the `JPEG` codec will transform those pixels into the frequency domain
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
* **planes**: there are three planes in an `JPEG` file. One for the
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
-->


<!-- ![empty JPEG](/assets/images/zigzag.svg){: .zig_zag } -->

<p markdown="1" class="centered">
![Unter Konstruktion!](/assets/images/under_construction.gif)
</p>
