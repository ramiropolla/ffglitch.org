---
layout: page
title: PNG features
permalink: /docs/0.10.2/features/png/
---

# PNG and APNG features

The following `features` are supported for `PNG` and `APNG`:
* [Headers](#png-headers)
* [Image Data](#png-idat)

<!-------------------------------------------------------------------->
<div id="png-headers"></div>
## Headers

The `"headers"` feature for `PNG` and `APNG` exports all data from the
header chunks (all chunks which are not `IDAT` or `fdAT`).

Each type of chunk exports an object with the name of its `tag`.
For chunks that may appear multiple times, an `Array` is exported
instead of an object.

I won't go into detail for each field in each header.
You should read the [`PNG` specification](https://www.w3.org/TR/png-3/) for that.

<div id="png_headers_desc"></div>
<div id="png_headers_path"></div>

<span id="png_headers_number">TODO</span>: `number`<br />
<span id="png_headers_string">TODO</span>: `string`<br />
<span id="png_headers_rgb">TODO</span>: an `Array` with 3 numbers: `[ red, green, blue ]`<br />
<span id="png_headers_hist">TODO</span>: an `Array` of numbers with the histogram<br />
<span id="png_headers_splt_entry">TODO</span>: an `Array` with 5 numbers: `[ red, green, blue, alpha, frequency ]`<br />
<span id="png_headers_bkgd">TODO</span>: depending on `IHDR.color_type`:<br />
* `0` or `4`: an `Object` with 1 number: `"grey"`
* `2` or `6`: an `Object` with 3 numbers: `"red"`, `"green"`, and `"blue"`
* `3`: an `Array` with numbers

<span id="png_headers_sbit">TODO</span>: depending on `IHDR.color_type`:<br />
* `0`: an `Object` with 1 number: `"grey"`
* `2` or `3`: an `Object` with 3 numbers: `"red"`, `"green"`, and `"blue"`
* `4`: an `Object` with 2 numbers: `"grey"` and `"alpha"`
* `6`: an `Object` with 4 numbers: `"red"`, `"green"`, `"blue"`, and `"alpha"`

<span id="png_headers_trns">TODO</span>: depending on `IHDR.color_type`:<br />
* `0`: an `Object` with 1 number: `"grey"`
* `2`: an `Object` with 3 numbers: `"red"`, `"green"`, and `"blue"`
* `3`: an `Array` with numbers

<span id="png_headers_zdata">TODO</span>: an `Array` of bytes with custom (decompressed) `zlib` data<br />
<span id="png_headers_itext">TODO</span>: a `string` (possibly decompressed `zlib` data, depending on the `flag` field)<br />

<!-------------------------------------------------------------------->
<div id="png-idat"></div>
## Image Data

The `"idat"` feature for `PNG` and `APNG` exports all image data
(`IDAT` and `fdAT` chunks).

`NOTE`: `interlaced` `PNG` images will have a `"passes"` array instead of `"rows"`.
        It works differently, using `Adam7` interlacing.
        Each pass has a different number of bytes in the row (`TODO`: describe).

<div id="png_idat_desc"></div>
<div id="png_idat_path"></div>

<span id="png_idat_row">TODO</span>: `row`:<br />
* Each `row` of image data is an `Array` with numbers.
* The first value in the `Array` is the `filter_type`, which can be
  * `0`: None
  * `1`: Sub
  * `2`: Up
  * `3`: Average
  * `4`: Paeth
* All subsequent values in the `Array` are numbers that represent the
  image data compressed with the `filter_type` above.

<span id="png_idat_compression_level">TODO</span>: `number`:<br />
* The `"compression_level"` field will instruct `FFglitch` on what
  compression level to use in the `zlib` library to compress the data.
  Default is `-1`, and values may go from `0` (no compression) to `9` (best compression).

<span id="png_idat_sequence_number">TODO</span>: `number`:<br />
* `fdAT` chunks have an extra `sequence_number` field.

<!-------------------------------------------------------------------->
<script type="module" src="../png.js"></script>
