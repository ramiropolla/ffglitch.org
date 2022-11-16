---
layout: page
title: quickjs
permalink: /docs/quickjs
---

FFglitch uses the [`quickjs`](http://quickjs.org) engine to provide
native `JavaScript` support.
FFglitch also provides extra `JavaScript` functionality which can
greatly speed up the glitching process.

Below you will find the technical documentation of these new types and
classes. At least some basic knowledge of `JavaScript` is expected.

<hr />
`FFArrays` and `FFPtrs` are based on the built-in `Typed Arrays`, but
with a lot of functionality and complexity removed to provide a simpler
and faster implementation.

- Go to [`FFArrays and FFPtrs` documentation](ffarrays)

<hr />
`MV` and `MVRef` are a simple representation of a
`[ horizontal, vertical ]` motion vector.

- Go to [`MV` and `MVRef` documentation](mvs)

<hr />
`MVArray` and `MVPtr` are similar to `FFArrays` and `FFPtrs`, but they
contain `motion vectors` instead of simple integer values.
There is also a helper `MVMask` type.

- Go to [`MVArray`, `MVPtr`, and `MVMask` documentation](mvarray)

<hr />
`MV2DArray` and `MV2DPtr` are similar to `MVArray` and `MVPtr`, but
they contain a 2-dimensional array of `motion vectors` instead of a
single array of `motion vectors`.
There is also a helper `MV2DMask` type.

- Go to [`MV2DArray`, `MV2DPtr`, and `MV2DMask` documentation](mv2darray)

<hr />
A `round to nearest integer` method (called `lround()`) has been added
to the `Math` prototype.
It is equivalent to:
```js
Math.lround = (x) => Math.sign(x) * Math.round(Math.abs(x));
```

The reason behind this is that the `JavaScript` `Math.round()` method
behaves differently from most other programming languages, in that it
rounds half-increments **away** from zero, and I don't like that.
For example, I prefer that `-3.5` rounds to `-4` instead of `-3`:
```js
print(Math.round(+3.5));  // 4
print(Math.lround(+3.5)); // 4
print(Math.round(-3.5));  // -3
print(Math.lround(-3.5)); // -4
```
