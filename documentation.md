---
layout: page
title: Documentation
permalink: /docs/
---

FFglitch is three different programs:
- `ffedit` is the main tool for FFglitch. It is a **multimedia bitstream editor**.
- `fflive` is a **video player** that integrates `ffedit` so you can create live glitch in real-time.
- `ffgac` is just [`ffmpeg`](https://ffmpeg.org), but with some extra features for glitch artists.

- Go to [`ffedit` documentation](ffedit)
- Go to [`fflive` documentation](fflive)
- Go to [`ffgac` documentation](ffgac)

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
