---
layout: page
title: What?
permalink: /what/
---

## What is FFglitch?

FFglitch is a **multimedia bitstream editor**, based on the open-source project [FFmpeg](http://ffmpeg.org/).

FFglitch allows you to very precisely edit multimedia files.

FFglitch generates files with a **valid bitstream**. This means that VLC and Facebook **won't choke with your files**.

FFglitch is the [Prime Editing](https://en.wikipedia.org/wiki/Prime_editing) of glitching.

FFglitch is so precise, it can barely be considered glitching at all.

## How does FFglitch work?

FFglitch works by decoding a media file with FFmpeg, and replicating the file while doing it.

While performing the replication, FFglitch can selectively alter some values being coded into the file.

By leveraging the FFmpeg source code, FFglitch knows how to properly encode each altered value, producing a **valid bitstream**.

## What files are supported?

Supported formats/codecs/features:

Formats:
* rawvideo
* jpg
* avi (not thoroughly tested)

Codecs (features per codec):
* JPEG/MJPEG
  * DCT coefficients (DC+AC)
  * DCT coefficients (DC-only)
  * Quantization table
  * Huffman table
* MPEG2
  * DCT coefficients
  * Quantization scale
  * Motion vectors
  * Macroblocks
* MPEG4
  * Motion vectors
