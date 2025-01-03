---
layout: page
title: Container formats
permalink: /docs/0.10.2/formats/
---

# Container formats

FFglitch only supports three
[`container formats`](https://en.wikipedia.org/wiki/Container_format)
and it seems to be good enough for the moment.

## rawvideo

The first one can barely be called a container format, and it is the
`rawvideo` format. It is just a sequence of frames concatenated
together. It only supports one `codec`, and that codec sould be good
enough to stand on its own without a container format. `MPEG` codecs
are pretty good at this. So are image files (`JPEG` for example).

To generate such files with `ffgac`, use the `-f rawvideo` option.
<!--I suggest you use this file format as much as possible with FFglitch,
since this is the one I use all the time so it gets the most amount
of testing.-->

## AVI

The second supported container format is
[`AVI`](https://en.wikipedia.org/wiki/Audio_Video_Interleave).
It is supported pretty much everywhere and quite simple. It can have
multiple streams (usually one audio and one video).

FFglitch still doesn't support glitching audio codecs (hint: it might
one day support them). But you can use this format to glitch the video
in media files and still maintain the audio synchronised.

## MOV

[`MOV`](https://en.wikipedia.org/wiki/QuickTime_File_Format) is a pretty
good container format, also known as `MP4` (not to be confused with `MPEG4`).
It has been added in version `0.10.0` of FFglitch, and there might still
be some bugs around.

Similarly to `AVI`, you can use this format to glitch the video
in media files and still maintain the audio synchronised.
