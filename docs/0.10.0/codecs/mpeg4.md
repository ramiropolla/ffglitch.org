---
layout: page
title: MPEG-4
---

# MPEG-4

Differently from `MPEG-2`, which is a very simple and beautiful video
codec, [`MPEG-4`](https://en.wikipedia.org/wiki/MPEG-4) is a huge and
ugly beast.

It added support for
**Global Motion Compenstion**,
**Direct Mode Motion Compensation**,
**Quarter Sample Mode Interpolation**,
**Grayscale Alpha planes**,
**Sprites**,
**3D Mesh Objects**,
**Face and Body Animation** (yes, you can encode faces and bodies in `MPEG-4`),
**Wavelet transform**,
**N-bit** (whatever that means),
and a bunch of things more.

It didn't really reflect the reality of what was needed for codec
technology at the time, and it still doesn't reflect reality of what
would be needed for codec technology today. `MPEG-4` is kind of like
what Dr. Henry Wu says in Jurassic World:
<!--"But you didn't ask for reality. You asked for **MORE TEETH**!".-->

<p markdown="1" class="centered">
![**MORE TEETH**](/assets/images/more_teeth.gif)
</p>

This added an enormous amount of complexity to the codec.
Even things that used to be simple to understand, such as the concept
of a `video frame`, was rebranded as a `Video Object Plane`, or `VOP`.
And there are four types of `VOP`s: `I`, `P`, `B`, and `S(GMC)`, where
`GMC` stands for `Global Motion Compensation`.
I don't like the expression `VOP`, I'll just keep calling them frames.

Most decoders don't support most of the features that should have gone
into `MPEG-4`. But that's ok, we kind of settled on a subset of
features that make sense.

There are many different well-known implementations of `MPEG-4`.
Remember **DivX ;-)**, with its watermarked logo ruining a bunch of
videos? Remember **Xvid**, which was very confusing in the beginning
because we'd ask ourselves "wait, what? wasn't it spelled the other way
around?"? They were `MPEG-4` too (and not `MPEG-2` for </pun>).
Remember **RealVideo**? That shit was based on `MPEG-4` (well, mostly
`H.263`, which was a saner codec, and mostly interoperable with `MPEG-4`).
**RealVideo**, on the other hand, was not sane, and definitely not
interoperable with anything.

Anyways...

<p markdown="1" class="centered">
![Unter Konstruktion!](/assets/images/under_construction.gif)
</p>
