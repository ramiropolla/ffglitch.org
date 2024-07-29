---
layout: page
title: DCT and Quantization
permalink: /docs/0.10.2/codecs/dct_quant/
---

# DCT and Quantization

Instead of encoding each **pixel** of the image like a
[`bitmap`](https://en.wikipedia.org/wiki/BMP_file_format) file would,
some codecs will transform those pixels into the frequency domain using
the
[`Discrete Cosine Transform`](https://en.wikipedia.org/wiki/Discrete_cosine_transform),
which gives out **coefficients**, then they will
[`quantize`](https://en.wikipedia.org/wiki/Quantization_%28signal_processing%29)
those coefficients, and encode those **quantized coefficients**.

On the decoder size, those **quantized coefficients** will be
`dequantized`, and then transformed back into **pixels** from the
frequency domain using the `IDCT` (the `Inverse DCT`).

## DCT

**Note**: You don't really need to understand what the `DCT` is.
Just think of it like some kind of **magical box** that takes
**pixels** as input and creates **coefficients** as output.
But if you want at least a small introduction, keep reading this
section.

<p markdown="1" class="centered">
![Mathematical!](/assets/images/adventure-time-mathematical.gif)
</p>

Remember that
[pixels are just numbers](../yuv#pixels-are-just-numerical-values)?
Well, that's pretty convenient, because the `DCT` works with numbers.
This is the result of running Mario's face through the **magical box**
of `DCT`:

<div id="dct_magic"></div>

The numbers at the end are the DCT coefficients. The DCT coefficients
are also not some magical entity that defies human comprehension.
DCT coefficients are just... numbers.

It might be a little complicated to visualize the coefficients table
here. The table is colored using a false-color spectrum, where positive
numbers are `red` and negative numbers are `blue`.
(no need to understand this).

If we were to run those coefficients through the `IDCT` (the
`Inverse DCT`), we would get the same pixel values back, as you can see
here:

<div id="idct_magic"></div>

Now, let's try to understand a little bit of what each coefficient
means.
The first coefficient on the **top left** corner is called the `DC`
coefficient. Its value ranges from `0` to `2040`.
**All other** coefficients are referred to as `AC` coefficients.
Their values range from `-1020` to `1020`.

Let's try leaving **only** the `DC` coefficient, and passing that
through the the `IDCT`:

<div id="idct_dc"></div>

Now let's try leaving **all** `AC` coefficients, but removing the `DC`
coefficient, and passing that through the `IDCT`:

<div id="idct_ac"></div>

Notice that when we left **only** the `DC` coefficient, we got the
same value for all pixels in the output.
And when we left **all** `AC` coefficients, but removed the `DC`
coefficient, we could still see Mario's face in the output, but the
entire image was darker than the original, and each pixel was darker
by subtracting the same value we got from the `DC` coefficient.

<p markdown="1" id="p_ac_dc_math">
i.e.: In the first pixel, the original value was `orig0`, whereas
it was `dc0` for the `DC` coefficient, and `ac0` (`ac0` = `orig0` - `dc0`)
for the `AC` coefficients.
</p>

The reason for this is that the `DC` coefficient represents the
`average` value for all pixels. It does not give `texture` to the
block, but it does give the `background color`.
The `AC` coefficients, on the other hand, will each add or subtract
different values from a different set of pixels, adding finer and finer
details into the block (the `texture`).

## Quantization

If we were to encode all the **coefficients** exactly as they were
output from the `DCT`, there wouldn't really be much benefit at all
from all this **mathemagic**.
The final output file would be almost as big (or just as big, or even
bigger) than the original uncompressed file, and the codec would have
done a pretty poor job.

So why do codecs go through all this trouble of transforming to the
frequency domain?

Well, it turns out you can do **even more magic** in the frequency
domain by tweaking the coefficient values quite a bit and still ending
up with a relatively good reconstruction of the block
after running them through the `IDCT`.

And the way we do this is with **quantization**. Each **coefficient**
is divided by a certain number, and is then rounded to the nearest
integer.

<p markdown="1" id="p_quant">
For example, let's divide all our **coefficients** by `q`, and we'll
get:
</p>

<div id="quantized_coeffs"></div>

<p markdown="1" id="p_dequant">
Wow! Those values are much smaller. There are also a bunch of zeros
in there. Now let's pretend we're the **decoder**, and **dequantize**
those values by multiplying them all by `q` again.
</p>

<div id="dequantized_coeffs"></div>

They are all pretty close to the original **coefficients**.
Now let's run that through the `IDCT` and look at the reconstructed
block.

<div id="quant_idct_value"></div>

That still looks a lot like Mario's face, doesn't it?
Let's have a closer look at the difference between the original and the
reconstructed image, side by side:

<div id="diff_blocks"></div>

It's hard to notice the difference, right? Let's have a closer look at
the difference in values:

<div id="diff_values"></div>

<p markdown="1" class="centered">
(so small)
</p>

You can use the slider below to change the **quantizer** value, and
this entire page will be updated with the new value.

<p class="centered">
  quantizer:
  <input type="range" min="2" max="48" value="16" id="quantizer_slide">
  <span id="quantizer_span">16</span>
</p>

## Quantization tables

In reality, instead of using a single **quantizer** value for all
coefficients like we did in the section above, codecs use a
`quantization table`.

Since our eyes are better at perceiving **low frequency** changes over
**high frequency** changes, the quantizer values nearest to the `DC`
coefficient will be smaller, while the quantizer values nearest to the
last `AC` coefficient will be greater (roughly speaking).

The `MPEG-2` standard specifies default quantization tables for `intra`
blocks and `non-intra` blocks (with no distinction between `luma` and
`chroma`):

<div id="mpeg2_quant_tables"></div>

The `MPEG-4` standard also specifies default quantization tables for
`intra` blocks and `non-intra` blocks (also with no distinction between
`luma` and `chroma`):

<div id="mpeg4_quant_tables"></div>

The `JPEG` standard gives examples of `luma` and `chroma` quantization
tables that are *"based on psychovisual thresholding and are derived
empirically using luminance and chrominance and 2:1 horizontal
subsampling"* (that's some fancy wording there...):

<div id="jpeg_quant_tables"></div>

Now let's take Mario's face's **coefficients**, and `quantize` them
using the example `luma` `JPEG` quantization table from above:

<div id="jpeg_example_quant"></div>

Then we `dequantize` those **quantized coefficients**:

<div id="jpeg_example_dequant"></div>

And finally, we pass the **reconstructed coefficients** through the
`IDCT`, and we get:

<div id="jpeg_example_idct"></div>

<p markdown="1" class="centered">
(not bad, right? also, not very good either...)
</p>

Those quantization tables in the standards are mere **suggestions**.
The encoder is free to create the quantization table it wants, allowing
for greater or lower quality.
In fact, for most encoders, when you change the **quality** settings,
the encoder is just changing the **quantization table** behind the
scenes.

There are `8` x `8` = `64` values in total in a **quantization table**,
and they can each go from `1` to `255`.
That's a whopping `254`<sup>64</sup> possibilities, or
`8.116`×`10`<sup>153</sup>.

[Google](https://www.google.com/) even went as far as creating a whole
new `JPEG` encoder (called [Guetzli](https://en.wikipedia.org/wiki/Guetzli))
that basically tweaks the **quantization table** up to a point where
your puny little eyes can barely notice that anything changed at all,
while at the same time achieving very high levels of compression.

<script type="module" src="../dct_quant.js"></script>
