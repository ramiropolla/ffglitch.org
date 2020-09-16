---
layout: post
image: concatenated_cats_2.png
title: "Cat videos (part 2)"
author: "Ramiro Polla"
---

The [previous post]({% post_url 2020-09-06-cat_videos %}) gave a simple
tutorial on how to datamosh cat videos using FFmpeg and simple Unix commands.
This post is a follow-up, with more FFmpeg usage, more Unix commands,
and more cats.

The difference is that this post is more precise, using FFmpeg to split
the videos one frame at a time.

0 - Choosing cat videos
=======================

Use the same cat videos from the [previous post]({% post_url 2020-09-06-cat_videos %}).

1 - Preparing cat videos
========================

Prepare the cat videos in the same way as the [previous post]({% post_url 2020-09-06-cat_videos %}).

```bash
$ mkdir mpeg2
$ for I in *.mp4;
  do
    ./ffmpeg -i "$I" \
             -an -vcodec mpeg2video -f rawvideo \
             -mpv_flags +nopimb \
             -qscale:v 6 \
             -r 30 \
             -g 90 \
             -s 1280x720 \
             -y mpeg2/"${I/.mp4/.mpg}";
  done
```

(remember that `-qscale`, `-r`, `-g`, and `-s` are tweakable).

2 - Splitting the cats
======================

Instead of splitting the cats using the `split` command, we will use
FFmpeg to split the video in individual frames.

```bash
$ cd mpeg2
$ mkdir frames
$ let x=10
$ for I in *.mpg;
  do
    ffmpeg -i "$I" -vcodec copy frames/cat_${x}_%04d.raw;
    let x=x+1;
  done
```

Each file in the `frames` directory will contain one frame of an input
video file. These may be `I` frames or `P` frames.

I decided to start the counter at `10` this time instead of `1` so that
all video files are prefixed with two digits (assuming we have fewer
than 90 input files). Otherwise we'd end up with `cat_1_0001.raw` between
`cat_10_0019.raw` and `cat_10_0020.raw` and the output would be weird.

Change into the `frames` directory and see that you will have hundreds
or possibly thousands of cat frames:
```bash
$ cd frames
$ ls -1
cat_10_0001.raw
cat_10_0002.raw
cat_10_0003.raw
[...]
cat_21_0702.raw
cat_21_0703.raw
cat_21_0704.raw
```

3 - Concatenating the cats
==========================

Now we will randomly concatenate the cat frames to create our
final datamoshed cat video.

The difference from this post and the [previous post]({% post_url 2020-09-06-cat_videos %})
is that in the [previous post]({% post_url 2020-09-06-cat_videos %})
each 1 megabyte chunk would contain many frames, and in this post
each frame file contains only one frame. So we have to be creative
in choosing which files we will use to concatenate to create the
datamoshed video.

For example:
```bash
$ cat cat_11_0001.raw $(ls | xargs -n 60 | sort --random-sort) > /tmp/concatenated_cats.mpg
```

This command will randomly sort the chunked cats, `60` frames at a time
(by using the `xargs` Unix command),
and concatenate them all into one cat video file at `/tmp/concatenated_cats.mpg`
(you can repeat this command many times to get different random
combinations of concatenated cats).

This file is not corrupted, because MPEG-2 is so awesome that you can
just concatenate frames together and all will be fine, so there's no
need to bake the cats.

Since 60 frames were used for each chunk, the video is more evenly
split (there are two seconds from each randomly selected chunk of
video, not necessarily starting with an I frame).

<video preload="auto" loop autoplay muted controls width="100%">
  <source src="/assets/images/concatenated_cats_2.mp4" type="video/mp4">
</video>
