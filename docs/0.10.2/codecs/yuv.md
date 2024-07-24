---
layout: page
title: YUV
permalink: /docs/0.10.1/codecs/yuv/
---

# RGB

You've heard of [`RGB`](https://en.wikipedia.org/wiki/RGB_color_model), right?
It's a pixel format that stands for `R`ed, `G`reen, and `B`lue and it's
used to define a color using three values. Each pixel in a frame has an
`RGB` color associated to it, forming an image.

<div id="rgb_orig"></div>

Well, most image and video codecs don't use that. They use `YUV`
instead.

<!--
TODO: add a zoom feature while hovering over the pixels, so we can see
the effect of subsampling->upsampling
TODO: add arrows to show the subsampling/upsampling scaling
-->

# YUV

The [`YUV`](https://en.wikipedia.org/wiki/YUV) pixel formats split
the frame into three `components`, also called `planes`.
The first plane is the `Y` plane, also called the `luma` or
`luminance` plane. It represents roughly the `greyscale` component
of the frame (also known as `black and white`, but not quite, since it
is made up of [shades of grey](https://en.wikipedia.org/wiki/Fifty_Shades_of_Grey)).
The second and third planes are the `U` and `V` planes, also called
the `chroma` or `chrominance` planes. They represent the `colour`
components of the frame.

<div id="yuv_orig"></div>

There are many different `YUV` pixel formats depending on the chroma
`subsampling`, with the most common being: `YUV444`, `YUV422`, and
`YUV420`. We'll see more about this later.

## Pixels are just numerical values

Pixels are not some magical entity that defies human comprehension.
Pixels are just... numbers.

Let's take for example this small image of `8x8` pixels of a close-up
of Mario's face.
The first row shows the three `YUV` components separately (in `YUV444`).
The second row shows the numbers that represent each `YUV` value of
each pixel of each component.

<div id="yuv_values"></div>

### Value Range

In this example, I used the full range of one `8-bit byte` (from `0` to
`255`) for all values, with the `chroma` values having an offset of
`+128` (the `chroma` values would usually go from `-128` to `127`).
Note that, for the `luma` values, `0` means `black`, going up through
`greyscale` levels until it reaches `255`, which means `white`.
This is the `JPEG` colour range.

It is also possible for `YUV` values to range from `16` to `235` for
`luma` values, and from `-112` to `112` (or from `16` to `240`) for
`chroma` values. This is the `MPEG` colour range.

## Subsampling

The `chroma` planes may be `subsampled`, which means they will throw
away some `colour` information and encode fewer pixels than the `luma`
plane.

This loss of data from the `colour` planes is not a big problem since
our eyes are much more sensitive to `greyscale` than they are to
`colour`, so we barely notice it.
But `subsampling` doesn't work too well with pixelated bitmaps with
sharp edges like Mario's face, so in our next example we'll be working
with Lena.

<div id="yuv_lena"></div>

Now let's `subsample` the `chroma` planes by half both **horizontally**
and **vertically**. The `luma` plane is of size `224x224`, therefore
the `chroma` planes will be of size `112x112`.

<div id="yuv_subsampled"></div>

Now instead of transmitting `224 * 224 * 3 = 150528` pixels, we only
have to transmit `224 * 224 + 112 * 112 * 2 = 75264` pixels, which is
**half** the data.
`Subsampling` allows us to save a lot of data when transmitting images
and video.

But this does not mean that only a small chunk of the image will have
`colour` when displayed. Before the image is displayed again, the
`chroma` planes will go through the opposite of `subsampling`, which
is called `upsampling` (or `interpolation`).

<div id="yuv_upsampled"></div>

And now we merge back the components to display them.

<div id="yuv_merged"></div>

Pretty good, isn't it?

Note that this process is not perfectly reversible: the `colour`
information that was thrown away while `subsampling` cannot be
recovered, not even through `upsampling`

### YUV444

In `YUV444`, all three planes will have the same `width` and `height`
dimensions.

The following image shows the pixels encoded in the **media file**
for all three planes, starting at the top left corner from position
`1,1`, and ending at the bottom right corner at position `H,W`.
- `H` is the frame `height`
- `W` is the frame `width`

<div id="div_yuv444"></div>

### YUV422

In `YUV422`, the `luma` plane has the original `width` and `height`
dimensions, while the `chroma` planes are halved **horizontally**,
which means their dimensions will be `(width/2)` and `height`.
Each pixel in a `chroma` plane corresponds to two pixels
**horizontally** in the `luma` plane.

The following image shows the pixels encoded in the **media file**
for all three planes, starting at the top left corner from position
`1,1`, and ending at the bottom right corner at position `H,W` (for
the `luma` plane) and `H,w` (for the `chroma` planes).
- `H` is the frame `height`
- `W` is the frame `width`
- `w` is `width/2` (**half** the frame `width`)

<div id="div_yuv422"></div>

The following image shows the pixels for all three **upsampled**
planes, where they all have the same `width` and `height` (to form the
final frame).
Notice that the pixels in the `chroma` planes have been duplicated
**horizontally**.

<div id="div_yuv422_upsampled"></div>

### YUV420

In `YUV420`, the `luma` plane has the original `width` and `height`
dimensions, while the `chroma` planes are halved both **horizontally**
and **vertically**,
which means their dimensions will be `(width/2)` and `(height/2)`.
Each pixel in a `chroma` plane corresponds to two pixels
**horizontally** and two pixels **vertically** in the `luma` plane.

The following image shows the pixels encoded in the **media file**
for all three planes, starting at the top left corner from position
`1,1`, and ending at the bottom right corner at position `H,W` (for
the `luma` plane) and `h,w` (for the `chroma` planes).
- `H` is the frame `height`
- `W` is the frame `width`
- `h` is `height/2` (**half** the frame `height`)
- `w` is `width/2` (**half** the frame `width`)

<div id="div_yuv420"></div>

The following image shows the pixels for all three **upsampled**
planes, where they all have the same `width` and `height` (to form the
final frame).
Notice that the pixels in the `chroma` planes have been duplicated both
**horizontally** and **vertically**.

<div id="div_yuv420_upsampled"></div>

<script type="module" src="../yuv.js"></script>
