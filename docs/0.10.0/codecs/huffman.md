---
layout: page
title: Huffman Coding
permalink: /docs/0.10.0/codecs/huffman/
---

# Huffman Coding

[Huffman Coding](https://en.wikipedia.org/wiki/Huffman_coding)
is a beautifully simple `variable-length` `entropy coding` method used
in lossless data compression.

It works by replacing `fixed-length` **symbols** (for example, 8-bit
[bytes](../bitstream#byte)) by `variable-length` **codes**.
These **codes** can be shorter or longer than the original **symbols**
(hence why they are called **variable**-length).

The **symbols** that occur more often will be represented by small
**codes** with fewer bits, and the **symbols** that rarely appear will
be represented by longer **codes** with potentially more bits than the
original **symbol** itself.

This way, the resulting encoded bitstream should be smaller than the
original bitstream, while not losing any information (it is a lossless
process).

<!--
TODO make an interactive huffman code generator.
Input: text and "Generate" button (also maybe checkbox with automatic table generation for each keystroke).
Middle: bitstream (also hex maybe?) for the input text
Output: huffman coded bitstream.
Hovering over symbols in the input should highlight the codes in the output (and vice-versa).
-->
<!--
But how does that apply to our JPEG? Well, we first need to know what it is that we will be encoding.
Let's have another look at the `flattened` **quantized coefficients**
we had at the end of the
[`Zig-Zag and Run-Length Encoding` overview](../zigzag).

<div id="zz_line_zigzag_rle"></div>


How do we know when one VLC ends and the next one starts? Because Huffman Coding is FUCKING MAJESTIC.

## The Code

## DC Prediction

and level shifting.
FFmpeg does level shifting by resetting last_dc to (4 << s->bits),
instead of +128 for all pixels before each fdct.

## bla

Interesting: No, you're wrong. The OP asked "Assuming that I have an 8x8 matrix of 8 bit unsigned values" and, as in my answer, you see that the range will be from 0 to 2040 for the DC coefficient and from -1020 to 1020 for the AC coefficients, meaning that 11 bits are enough. MPEG has to use 12 bits because in P and B pictures you encode differences, so the input value is from -255 to 255 effectively adding one more bit.
https://dsp.stackexchange.com/questions/43588/what-is-the-maximum-value-that-can-result-from-a-2d-dct

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

<script type="module" src="../huffman.js"></script>

<p markdown="1" class="centered">
![Unter Konstruktion!](/assets/images/under_construction.gif)
</p>
