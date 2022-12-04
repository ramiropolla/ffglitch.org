---
layout: page
title: YUV
---

# YUV
The [`YUV`](https://en.wikipedia.org/wiki/YUV) pixel formats split
the frame into three `planes`.
The first plane is the `Y` plane, also called the `luma` or
`luminance` plane. It represents roughly the `greyscale` component
of the frame.
The second and third planes are the `U` and `V` planes, also called
the `chroma` or `chrominance` planes. They represent the colour
components of the frame. It is possible that the `chroma` planes are
`subsampled`, which means they will have fewer pixels than the `luma`
plane.

There are many different `YUV` pixel formats, with the most common
being: `YUV444`, `YUV422`, and `YUV420`.

## YUV444
In `YUV444`, all three planes will have the same `width` and `height`
dimensions.

The following image shows the pixels encoded in the **media file**
for all three planes, starting at the top left corner from position
`1,1`, and ending at the bottom right corner at position `H,W`.
- `H` is the frame `height`
- `W` is the frame `width`

<div id="div_yuv444"></div>

## YUV422
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

The following image shows the pixels for all three **reconstructed**
planes, where they all have the same `width` and `height` (to form the
final frame).
Notice that the pixels in the `chroma` planes have been duplicated
**horizontally**.

<div id="div_yuv422_reconstructed"></div>

## YUV420
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

The following image shows the pixels for all three **reconstructed**
planes, where they all have the same `width` and `height` (to form the
final frame).
Notice that the pixels in the `chroma` planes have been duplicated both
**horizontally** and **vertically**.

<div id="div_yuv420_reconstructed"></div>

## Pixels are just numbers
Pixels are not some magical entity that defies human comprehension.
Pixels are just... numbers.

Let's take for example this small image of `8x8` pixels of a close-up
of Mario's face.
The first row shows the original image.
The second row shows the three `YUV` components separately (in `YUV444`).
The third row shows the numbers that represent each `YUV` value of
each pixel of each component.

<div id="pixel_numbers"></div>

In this example, I used the full range of one `8-bit byte` (from `0` to
`255`) for all values, with the `chroma` values having an offset of
`+128` (the `chroma` values would usually go from `-128` to `127`).

But it is more common to find `YUV` values that go from `16` to `235`
for `luma` values, and from `-112` to `112` (or from `16` to `240`) for
`chroma` values.

<script type="module" src="{{ base.url | prepend: site.url }}/assets/js/yuv.js"></script>
