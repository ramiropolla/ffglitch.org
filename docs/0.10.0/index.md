---
layout: page
title: Documentation
---

Welcome to the documentation for `FFglitch 0.10.0`.

FFglitch is three different programs:
- `ffedit` is the main tool for FFglitch. It is a **multimedia bitstream editor**.
- `fflive` is a **video player** that integrates `ffedit` so you can create live glitch in real-time.
- `ffgac` is just [`ffmpeg`](https://ffmpeg.org), but with some extra features for glitch artists.

They are all **command-line** programs. At least some basic knowledge
about the command-line is expected.
(I don't have the patience to teach command-line basics anymore.
If anyone has some good tutorials about the basics of command-line in
Windows/macOS/Linux, please let me know and I'll add links here).

- Go to [`ffedit` documentation](ffedit)
- Go to [`fflive` documentation](fflive)
- Go to [`ffgac` documentation](ffgac)

FFglitch supports some
[`container formats`](https://en.wikipedia.org/wiki/Container_format)
and some `features` inside some
[`codecs`](https://en.wikipedia.org/wiki/Codec).
This is where the main glitching happens, but you need to know what you
dealing with in order to glitch well.

- Go to [`container formats` documentation](formats)
- Go to [`codecs` documentation](codecs)
- Go to [`features` documentation](features)

FFglitch makes extensive use of **scripts** for many different functionalities.
The scripting languages supported are
[`Python3`](https://en.wikipedia.org/wiki/Python_%28programming_language%29)
and
[`JavaScript`](https://en.wikipedia.org/wiki/JavaScript).
`Python3` support is fairly basic and has no optimizations for FFglitch itself.
`JavaScript` support is built into FFglitch using the
[`quickjs`](http://quickjs.org) engine, along with a bunch of extensions and
optimizations that are documented below.

- Go to [`JavaScript` documentation](quickjs)
