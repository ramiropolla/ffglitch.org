---
layout: page
title: How?
permalink: /how/
---

## How do I use FFglitch?

FFglitch still does not have a nice graphical user interface. It's an ugly command-line based program.

There are two ways to use FFglitch.

### The old way

The old way consists of 3 steps:
1. Export data from media file
2. Glitch data however you see fit
3. Apply glitched data and generate a new file

### The new way

The new way (since [version 0.9.1]({% post_url 2020-07-13-ffglitch_0_9_1 %})) is a one-step process:
1. Run `ffedit` with a [JavaScript](https://en.wikipedia.org/wiki/JavaScript)
(or [Python3](https://en.wikipedia.org/wiki/Python_%28programming_language%29) script since [version 0.9.4]({% post_url 2021-12-20-ffglitch_0_9_4 %}))
file that glitches the frames one by one.

The new way is much simpler to use, but it has some limitations such as
working on a single file at a time, and it might involve having to learn
JavaScript (which might also end up being slower than a script in another
language) or Python3.

### I need examples!

Here are some tutorials with examples on how to use FFglitch:
- [Simple motion vector tutorial]({% post_url 2020-07-13-mv %})
- [Average motion vector tutorial]({% post_url 2020-07-17-mv_avg %})

There are more posts on the <a href="{{ site.url }}">main page</a> to have a better idea on how to use it.
