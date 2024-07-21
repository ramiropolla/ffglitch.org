---
layout: page
title: fflive
permalink: /docs/0.10.1/fflive/
---

# fflive

`fflive` is a **video player** (it's just a hacked up [`ffplay`](https://ffmpeg.org/ffplay.html)) that integrates `ffedit` so you can create live glitch in real-time.

# Usage

Its usage is very similar to `ffedit` in
[`Transplicate with script`](../ffedit#transplicate-with-script) mode,
so go read that documentation if you haven't already.
The main difference is that you will get live video playback while transplicating.

For example, this command line will play `input.avi` while glitching
with `script.js` (and an optional script parameter with the `-sp` option).

```bash
$ fflive -i input.avi -s script.js -sp 42
```

## Input support

Remember that FFglitch supports
keyboard, mouse, and joysticks as input devices with [`SDL`](../quickjs/sdl),
MIDI controllers as input devices with [`RtMidi`](../quickjs/rtmidi),
and network communication with [`ZeroMQ`](../quickjs/zeromq).
(hint hint click the links above).

<!--
TODO
-asap
-scaling_quality
-->
