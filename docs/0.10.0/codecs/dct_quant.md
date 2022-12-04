---
layout: page
title: DCT and Quantization
---

# DCT and Quantization

Instead of encoding each pixel of the image like a
[`bitmap`](https://en.wikipedia.org/wiki/BMP_file_format) file would,
some codecs will transform those pixels into the frequency domain using
the
[`Discrete Cosine Transform`](https://en.wikipedia.org/wiki/Discrete_cosine_transform),
then they will
[`quantize`](https://en.wikipedia.org/wiki/Quantization_%28signal_processing%29)
those coefficients, and encode those quantized coefficients.

On the decoder size, those coefficients will be `dequantized`, and then
transformed back into pixels from the frequency domain using the `IDCT`
(the `Inverse DCT`).

**Note**: You don't really need to understand what the `DCT` is.
Just think of it like some kind of **magical box** that takes
**pixels** as input and creates **coefficients** as output.
But if you want at least a small introduction, keep reading this
section.

## DCT

Remembering that
[pixels are just numbers](yuv#pixels-are-just-numbers),
this is the result of passing Mario's face through the `DCT`:

<div id="dct_magic"></div>

<div id="idct_magic"></div>

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

<script type="module" src="{{ base.url | prepend: site.url }}/assets/js/dct.js"></script>
