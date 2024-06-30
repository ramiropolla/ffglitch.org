---
layout: page
title: Bitstream
permalink: /docs/0.10.0/codecs/bitstream/
---

# Bitstream

FFglitch is a **multimedia bitstream editor**.
But what exactly does the word **bitstream** mean?

<p markdown="1" style="text-align: center; font-size: 2em;">A **bitstream** is a **stream** of **bits**.</p>

You didn't see that one coming, did you? No, but seriously...

**Multimedia** files such as
[AVI](https://en.wikipedia.org/wiki/Audio_Video_Interleave),
[MOV](https://en.wikipedia.org/wiki/QuickTime_File_Format),
[MKV](https://en.wikipedia.org/wiki/Matroska),
and [MP4](https://en.wikipedia.org/wiki/MP4_file_format)
(or any other kind of file, for that matter) are made up by a
**sequence** of **ones** and **zeros**, which could also be called a
**sequence** of **bits**, which could also be called a **stream** of
**bits**, which could also be called a **bitstream**.

But... what is a **bit**?

## Bit

I asked [ChatGPT](https://openai.com/blog/chatgpt) to define a **bit**
for me, and this was the response:

> A bit is the tiniest unit of information that can be processed by a
  computer, which is just a fancy way of saying that it's the amount of
  time you can spend watching cat videos before realizing you have work
  to do.

Ha! Isn't AI funny?

Anyways... a **bit** is the tiniest unit of information that can be
processed by a computer.
That **bit** is a number that is either a **zero** (**0**) or a
**one** (**1**).
Basically it just tells you that _something_ is either **on** or
**off**, and this _something_ can be _whatever you want_.

For example:

| Bit | Meaning                |
|-----|------------------------|
| `0` | The lights are **off** |
| `1` | The lights are **on**  |

But it could also be using **inverted** logic, and therefore be:

| Bit | Meaning                |
|-----|------------------------|
| `0` | The lights are **on**  |
| `1` | The lights are **off** |

But one **bit** by itself is just **one** tiny unit of information.
We're going to need more **bits** to get more useful information.

For example, the [ASCII](https://en.wikipedia.org/wiki/ASCII) standard
can be used to represent characters in text, such as:

| Sequence  | Meaning |
|-----------|---------|
| `0100011` | The number sign `#` (no, this is not a _hashtag_) |
| `0110111` | The number `7` |
| `1000001` | The uppercase letter `A` |
| `1100001` | The lowercase letter `a` |

Note that the ASCII sequences above are all 7 bits long.

## Byte

A **byte** is a **sequence** of **eight** (**8**) bits.

In [UTF-8](https://en.wikipedia.org/wiki/UTF-8), the previous `ASCII`
sequences would be:

| Bit sequence | Byte (decimal) | Byte (hex) | Meaning |
|--------------|----------------|------------|---------|
| `00100011`   | `35`           | `0x23`     | The number sign `#` (no, this is _still_ not a _hashtag_) |
| `00110111`   | `55`           | `0x37`     | The number `7` |
| `01000001`   | `65`           | `0x41`     | The uppercase letter `A` |
| `01100001`   | `97`           | `0x61`     | The lowercase letter `a` |

## Bytestream

<p markdown="1" style="text-align: center; font-size: 2em;">A **bytestream** is a **stream** of **bytes**.</p>

We could also argue that a **bytestream** is a **bitstream**, since a
**byte** is made up of **bits**.
But normally we only use the expression **bytestream** when the
sequence of information is clearly split across byte boundaries.

Usually the **headers** and the **metadata** in a **multimedia** file
format are **byte**-oriented, and the encoded **audio** and **video**
frames themselves are **bit**-oriented.

<!--TODO: improve and give an example of non-byte-oriented data-->

It is relatively easy to edit the **bytestream** of a file in a
[hex editor](https://en.wikipedia.org/wiki/Hex_editor).
It is much harder to edit a **bitstream** though, since the data is not
aligned to byte boundaries, and adding/removing a single bit would have
to change the values of all bytes following the edit.

And that's what makes FFglitch so special, since it works on the
**bitstream** level, and not only the **bytestream** level.
