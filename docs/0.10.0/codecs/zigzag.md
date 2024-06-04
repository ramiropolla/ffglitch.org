---
layout: page
title: Zig-Zag and Run-Length Encoding
permalink: /docs/0.10.0/codecs/zigzag/
---

# Zig-Zag and Run-Length Encoding

From the [`DCT and Quantization` overview](dct_quant), we learned that
some codecs will transform the pixels into the frequency domain using
the
[`Discrete Cosine Transform`](https://en.wikipedia.org/wiki/Discrete_cosine_transform)
and then
[`quantize`](https://en.wikipedia.org/wiki/Quantization_%28signal_processing%29)
those coefficients.

But the **quantized coefficients** are `two-dimensional`, in an `8x8`
block, and any transmission or storage of the stream must be
`one-dimensional`.
Therefore, the codec needs to `flatten` the **quantized coefficients**
from a `two-dimensional` block of `8x8` values into a `one-dimensional`
sequence.

The `JPEG` and `MPEG` codecs do this by using `zig-zag` scan and
`run-length encoding`, as we will see below.

Our sample `8x8` block for this page will be the
[Mona Lisa](https://en.wikipedia.org/wiki/Mona_Lisa).
First, let's convert it to `YUV`:

<div id="zz_block"></div>

Now, let's take the `luma` plane and run it through the `DCT`:

<div id="zz_dct"></div>

And finally, let's `quantize` the **coefficients** using the example
`luma` `JPEG` quantization table:

<div id="zz_quantize"></div>

These are the **quantized coefficients** we'll be working with in this
page.

## Zig-Zag

<!--zig-zag sequence: `Sequential ordering`
After quantization, the DC coefficient and the 63 AC coefficients are prepared for entropy encoding, as shown in Figure 5.
The previous quantized DC coefficient is used to predict the current quantized DC coefficient, and the difference is
encoded. The 63 quantized AC coefficients undergo no such differential encoding, but are converted into a onedimensional zig-zag sequence, as shown in Figure 5.

A.3.6 Zig-zag sequence
After quantization, and in preparation for entropy encoding, the quantized AC coefficients are converted to the zig-zag
sequence. The quantized DC coefficient (coefficient zero in the array) is treated separately, as defined in A.3.5. The zigzag sequence is specified in Figure A.6.

F.1.1.5.2 Encoding model for AC coefficients
Since many coefficients are zero, runs of zeros are identified and coded efficiently. In addition, if the remaining
coefficients in the zig-zag sequence order are all zero, this is coded explicitly as an end-of-block (EOB).-->

First we will `flatten` the `8x8` block of **quantized coefficients**
into a `one-dimensional` sequence of `64` values.

Instead of taking a *naïve* approach and just encoding each row one at
a time, the codec creators came up with a clever way of `flattening`
the block, called a `zig-zag` sequence:

<div id="zz_zz"></div>

The image above shows an **index table**, where each `element` in the
`8x8` table is given an `index` (from `0` to `63`).
The green line shows the order in which those `element`s will be laid
out in the `one-dimensional` sequence, starting at the top left corner,
and ending at the bottom right corner. This is the resulting sequence:

<div id="zz_zigzag_flat_split"></div>

To understand why this makes sense, let's take a closer look at our
**quantized coefficients** again, but now with the `zeros` highlighted
in black:

<div id="zz_q_coeffs"></div>

If you take a closer look at how those `zeros` are positioned in the
table, you will see that they mostly happen on the bottom right side of
the table (especially in parts of the image with less `texture`), and
that they mostly appear across **diagonal** lines, so that when we
`flatten` the block, we start with the bigger values, and get most of
the `zeros` in long sequences, like this:

<div id="zz_line_zigzag"></div>

But why is it interesting to have the `zeros` in long sequences?
To answer this question, let's have a look at the next clever
technique, called **Run-Length Encoding** (`RLE` for short).

## Run-Length Encoding

**Run-length encoding** involves simplifying a sequence of values by
encoding a **value** and the amount of times that value occurs
consecutively in the sequence, also known as the **run** (note: this is
unrelated to having
"[`the runs`](https://en.wikipedia.org/wiki/Diarrhea)").

For example, the sequence `'00011112203333'` could be encoded as
`'0'×3`, `'1'×4`, `'2'×2`, `'0'×1`, `'3'×4`.

The `JPEG` and `MPEG` codecs only encode runs of **coefficients** that
are `zeros`, and not of any other values. Using the same example above,
the sequence would be encoded as `'0'×3`, `'1111'`, `'22'`, `'0'×1`,
`'3333'`. Why aren't other values encoded using `RLE`?
Because the **coefficients** vary so much from one to the next that it
wouldn't help compression if everything was encoded using `RLE`.
But the sequences of `zeros` occur frequently enough to justify using
`RLE` on them.

Also, the `JPEG` and `MPEG` codecs **always** encode runs of `zeros`,
even between two `non-zero` **coefficients**.
The result is that each `element` in the output sequence is encoded as
`<count of preceding zero coefficients, non-zero coefficient>`.
Using the same example above, the sequence would be encoded as
`<3, '1111'>`, `<0, '22'>`, `<1, '3333'>`.

Let's have a look at what our Mona-Lisa **run-length** encoded sequence
would look like with this technique:

<div id="zz_line_zigzag_rle_0"></div>

<p markdown="1" id="p_rle">
Much shorter, right? We're down from `64` elements to `p` elements.
</p>

There are a few more tweaks to improve the **Run-Length Encoding**.

The last element contains a lot of zeros. But it doesn't  really matter
how many zeros are in the last run, since the block will end anyways.
So let's just write an element that says `end-of-block`
(`EOB` for short).

<div id="zz_line_zigzag_rle_1"></div>

Note: if the last element is **non-zero**, we don't need to encode the
`end-of-block`, since the block is complete.

The `DC` coefficient (remember: that's the first coefficient) is a bit
different from the rest. First of all, it has a different range from
the `AC` coefficients ([`DCT and Quantization` overview](dct_quant)).
Also, it will always have a `run` of `0`, since it is the first
element, so we don't need to include the `run` in the code.
So let's encode it differently:

<div id="zz_line_zigzag_rle_2"></div>

Now we have three different types of codes:
- `<DC, DC Coefficient>`
- `<run of zeros, AC Coefficient>`
- `end-of-block`

You might be asking yourself **but how will those codes be represented
in the bitstream?** Or not... You're probably not asking yourself that.
But let's pretend you did ask that.

Well, that's a very good question.
Go on to [`Huffman Coding` overview](huffman) to see how those codes
will be finally encoded in the output.

<script type="module" src="../zigzag.js"></script>
