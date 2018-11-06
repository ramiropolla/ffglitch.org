---
layout: post
image: octocat_256.png
title: "How to build FFglitch from source"
author: "Ramiro Polla"
---

It was pointed out in [/'fu:bar/ 2018](https://fubar.space/) that
FFglitch suffers tremendously from a lack of documentation.
I'll try to remend this situation slowly, one post at a time.

This post is about **building FFglitch from source**.

You probably don't need to build FFglitch from source yourself.

Go to the [Download]({{ "/download" | relative_url }}) page to get pre-built binaries for **Windows**, **Linux**, and **macOS**.

But if you really want to build it yourself, here's how:

{% highlight bash %}
# First make sure you have the prerequisites
$ sudo apt-get install git-core yasm
# Get the source code from the github repository
$ git clone https://github.com/ramiropolla/ffglitch-core
$ cd ffglitch-core
# Checkout the latest release branch
$ git checkout ffedit-0.7
# configure...
$ ./configure --enable-static --disable-shared
# ...and build
$ make
# ... wait a while...
# now you have 'ffedit', 'ffmpeg', and 'ffglitch.py'
{% endhighlight %}

Basically you can follow any FFmpeg compilation guide on the Internet
(such as the official [FFmpeg Compilation Guide](https://trac.ffmpeg.org/wiki/CompilationGuide)),
the main differences being that you have to get the source code from the
[FFglitch github repository](https://github.com/ramiropolla/ffglitch-core))
and you **must** checkout a release branch before building
(with the "**git checkout ffedit-0.7**" command shown above).
