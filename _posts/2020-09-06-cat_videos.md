---
layout: post
image: concatenated_cats.png
title: "Cat videos"
author: "Ramiro Polla"
---

This post will show how to do some datamoshing without using FFglitch.

Instead, I'll just be playing around with the FFmpeg build provided
with FFglitch (called `ffgac`) and basic [UNIX](https://en.wikipedia.org/wiki/Unix) commands.
For that, you will need to use either
[Linux](https://en.wikipedia.org/wiki/Linux),
[macOS](https://en.wikipedia.org/wiki/MacOS),
or some Unix shell for
[Windows](https://en.wikipedia.org/wiki/Shit), like Cygwin.

One of the reasons I like using
[MPEG](https://en.wikipedia.org/wiki/Moving_Picture_Experts_Group)
codecs is that they allow us to easily split and concatenate
cat video files, without needing lots of specialized cat video editing
software.

The codecs are robust enough so that you can cut the cat video files
pretty much wherever you want and the decoder will be able to recover
with at most a few scratches (bad pun intended).

0 - Choosing cat videos
=======================

I picked up a bunch of
[CC0](https://en.wikipedia.org/wiki/CC0)
videos of
[cats](https://en.wikipedia.org/wiki/Cat)
from the free stock video
[Pexels](https://www.pexels.com/videos/)
website:

```bash
$ md5sum *.mp4
df5a92a5d44120b5671a0003c0c427cc  Black Cat Eating.mp4
8d0342a06ad3da16a1e33a0796d461e2  Black Cat Getting Out of The Bag.mp4
99d98b82442a456a35f5d000fed73819  Cat Display Figurine.mp4
9f336af49a0c49b17cfad4b5d9dbd81f  Cat Eating.mp4
7333fbdf2bc2463907f3eaa322d25e26  Cat Licking Its Paw.mp4
73ce557a5ac181eba0276efd30c709a6  Cat Looking Around.mp4
e867b12c9be84a1cc02456a3f14d622f  Cat On A Bench.mp4
3fab95d22de8ff542129a41f9e4246ac  Cute Cat Falling Asleep.mp4
1c50cc2ad3aac6a13f5068509212abbf  Lazy Cat.mp4
ee2a9e6e7cebbf2bdf8cdc787c8615cc  Little Kitten Playing His Toy Mouse.mp4
ce07bda0b69f92a998f675a02ca3a71b  Pexels Videos 3909.mp4
be9516f25cd9396b785ee622d614d7a4  Pexels Videos 3910.mp4
b05ec3bbef7b77325b7c85420daef72a  Pexels Videos 3929.mp4
2ca3ecb41784c3f3dd2c9a59c3ff3a86  Pexels Videos 4336.mp4
8efe88870cb8fb39e3d8893e1982f4da  Video Of A Cat.mp4
84648e4adbce47124bfea1348b9286ba  Video Of A Tabby Cat.mp4
bda9db5307821ff91ede98a455960038  Video of Black Cat.mp4
1b5c91f3b128efbc0ad77b9713591705  Video Of Funny Cat.mp4
```

1 - Preparing cat videos
========================

To be able to mix and match our cat videos, we will need to make sure
they all have the same frame rate and width/height. To achieve that, we
will use FFmpeg.

But not any build of FFmpeg. We will use the special build of FFmpeg
that comes packaged with FFglitch (called `ffgac`), since it gives us a few more options
that greatly help preparing cat videos for glitching.

The following commands will create a directory named `mpeg2` and
convert all cat videos to
[MPEG-2](https://en.wikipedia.org/wiki/MPEG-2).

```bash
$ mkdir mpeg2
$ for I in *.mp4;
  do
    ffgac -i "$I" \
             -an -vcodec mpeg2video -f rawvideo \
             -mpv_flags +nopimb \
             -qscale:v 6 \
             -r 30 \
             -g 90 \
             -s 1280x720 \
             -y mpeg2/"${I/.mp4/.mpg}";
  done
```

I'll give a brief explanation of each option passed to `ffgac`:
- `-an`                disable audio since we only care about cats for now
- `-vcodec mpeg2video` use MPEG-2 as output codec
- `-f rawvideo`        output file as raw [MPEG transport stream](https://en.wikipedia.org/wiki/MPEG_transport_stream) (cats don't like avi or anything else)
- `-mpv_flags +nopimb` this option is ffgac-specific, it will make `ffgac` not use intra macroblocks for predictive frames and this is awesome (if you want to know exactly what this changes, repeat this entire post without this option and you will see)
- `-qscale:v 6`        (tweakable) quality factor: the greater the number, the lower the quality, the blockier the cats
- `-r 30`              (tweakable) set frame rate to 30 frames per second
- `-g 90`              (tweakable, may be entirely omitted) output an I frame at every 90 frames (3 seconds)
- `-s 1280x720`        (tweakable) set output size to 1280x720 pixels

Now we will end up with a bunch of MPEG-2 cat videos in the `mpeg2` directory.
Change into that directory and check the files:
```bash
$ cd mpeg2
$ ls -1
Black Cat Eating.mpg
Black Cat Getting Out of The Bag.mpg
Cat Display Figurine.mpg
Cat Eating.mpg
Cat Licking Its Paw.mpg
Cat Looking Around.mpg
Cat On A Bench.mpg
Cute Cat Falling Asleep.mpg
Lazy Cat.mpg
Little Kitten Playing His Toy Mouse.mpg
Pexels Videos 3909.mpg
Pexels Videos 3910.mpg
Pexels Videos 3929.mpg
Pexels Videos 4336.mpg
Video Of A Cat.mpg
Video Of A Tabby Cat.mpg
Video of Black Cat.mpg
Video Of Funny Cat.mpg
```

2 - Splitting the cats
======================

Now we don't really care about the video contents of the files anymore.
They could be cats, or dogs, or unicorns, or anything else.
They're just a bunch of bytes to us. And we will split each file into
a bunch of smaller files.

For that, we will create a new directory called `split` and use the
[split](https://man7.org/linux/man-pages/man1/split.1.html)
command from Unix to cut the files:

```bash
$ cd mpeg2
$ mkdir split
$ let x=0
$ for I in *.mpg;
  do
    let x=x+1;
    split --numeric-suffixes --suffix-length=4 --bytes=1M "$I" split/cat_${x}_;
  done
```

What these commands do is cut each of our MPEG-2 cat files into chunks
of 1 megabyte each and put all the resulting chopped cat files into
the `split` directory. You can tweak the `1M` value as you wish, to
make the cat chunks bigger or smaller.

Change into the `split` directory and see that you will have hundreds
or possibly thousands of cat files:
```bash
$ cd split
$ ls -1
cat_1_0000
cat_10_0000
cat_10_0001
[...]
cat_9_0069
cat_9_0070
cat_9_0071
```

3 - Concatenating the cats
==========================

Now we will randomly concatenate the cat chunks to create our
final datamoshed cat video.

For that, we will use the extremely useful
[cat](https://man7.org/linux/man-pages/man1/cat.1.html)
command from Unix:

```bash
$ cat cat_10_0000 $(ls | sort --random-sort) > /tmp/concatenated_cats.mpg
```

This command will randomly sort the chunked cats and concatenate them
all into one cat video file at `/tmp/concatenated_cats.mpg`
(you can repeat this command many times to get different random
combinations of concatenated cats).

Note the first argument `cat_10_0000`, it's just there so that we're
sure that the file starts with an I frame (any other `cat_*_0000`
file will do).

This file is mostly corrupted, but should play fine with `ffplay`,
`mplayer`, `mpv`, or `vlc`, and probably not with crappy players
like Windows Media Player.

To have an useful output file, we are going to have to bake the concatenated cats.

4 - Baking the cats
===================

Use `ffgac` to bake the cats into a normal h264 mp4 file:
```bash
$ ffgac -i /tmp/concatenated_cats.mpg -y /tmp/concatenated_cats.mp4
```

And there you'll have a nice baked datamoshed concatenated cat video.

<video preload="auto" loop autoplay muted controls width="100%">
  <source src="/assets/images/concatenated_cats_11.mp4" type="video/mp4">
</video>

And yes, this entire post was a pun on the `cat` command we used to
concatenate files.
