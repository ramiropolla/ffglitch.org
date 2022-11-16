---
layout: page
title: ffedit
permalink: /docs/ffedit
---

# ffedit

`ffedit` is the main tool for FFglitch.
It is a **multimedia bitstream editor**.



`ffedit` has two different modes of operation.
The first mode involves exporting.
The second mode 

The old way consists of 3 steps:
1. Export data from media file
2. Glitch data however you see fit
3. Apply glitched data and generate a new file

The new way is much simpler to use, but it has some limitations such as
working on a single file at a time, and it might involve having to learn
JavaScript (which might also end up being slower than a script in another
language) or Python3.

    ACTION_PRINT_FEATURES = 0, //
    ACTION_REPLICATE,          // x
    ACTION_EXPORT,             //   x
    ACTION_TRANSPLICATE,       // x   x
    ACTION_SCRIPT,             // x     x
