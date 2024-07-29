---
layout: page
title: MV2DArray, MV2DPtr, and MV2DMask
permalink: /docs/0.10.2/quickjs/mv2darray/
---

# MV2DArray, MV2DPtr, and MV2DMask

`MV2DArray` is based on `MVArray`, but it stores 2-dimensional
`[ horizontal, vertical ]` motion vectors instead of a single array.
`MV2DArray` provides optimized functions which can greatly speed up
processing large chunks of 2-dimensional motion vectors.

`MV2DArray` is `fixed length`, which means that once it is created, it
**cannot** be made larger or smaller.

`MV2DArray` is a `dense array` (in contrast to a `sparse array`), which
means there are no holes in the array.
All rows are available as `MVPtr`s.
If any motion vector in a row is not available (i.e.: it wasn't
available in the input file to start with) it will be represented as a
`null`, but it will be an `MV(null)`, so all the methods from `MV` can
be used. All motion vectors from `[0][0]` to `[height-1][width-1]` can
be read/written.

`MV2DPtr` is very similar to `MV2DArray`, and shares all the same
methods. The main difference is that `MV2DPtr` does not have any memory
allocated for its data. Instead, it points to data from `MV2DArray`.

Be careful not to play around with `MV2DPtr`s once the object they were
created from has run out of its scope. You will write into unallocated
memory and the program will segfault.

`MV2DMask` is a 2-dimensional array of `boolean`s that can be used with
certain methods from `MV2DArray`/`MV2DPtr`. This allows for very
efficient code which does not need to check for conditions inside loops
every time. The conditions are tested once to create the `MV2DMask`,
and then the mask is applied on subsequent calls.

All of `MV2DArray`, `MV2DPtr`, and `MV2DMask` contain a `width` and
`height` constant property, determined at creation time.

<hr />
## MV2DArray Constructor

The constructor is used to create a new `MV2DArray` object of width
`width` and height `height`. All motion vectors are initialized to
`[0,0]`.

### Syntax
```js
new MV2DArray(width, height)
```

### Parameters
`width` must be a non-zero positive number that specifies the width
of the 2-dimensional array to be created.

`height` must be a non-zero positive number that specifies the height
of the 2-dimensional array to be created.

### Return value
The new `MV2DArray` object.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
print(mv2darr);
// [
//  [[0,0],[0,0],[0,0]],
//  [[0,0],[0,0],[0,0]]
// ]
print(mv2darr.width);
// 3
print(mv2darr.height);
// 2
```

<hr />
## MV2DPtr Constructor

The constructor is used to create a new `MV2DPtr` object from either an
`MV2DArray` object or another `MV2DPtr` object. The new object will
have the same width/height as the `source` object.

### Syntax
```js
new MV2DPtr(source)
```

### Parameters
`source` must be either an `MV2DArray` or an `MV2DPtr` object.

### Return value
The new `MV2DPtr` object.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
print(mv2darr);
// [
//  [[0,0],[0,0],[0,0]],
//  [[0,0],[0,0],[0,0]]
// ]
print(mv2darr instanceof MV2DArray);    // true
print(mv2darr instanceof MV2DPtr);      // false
const mv2dptr = new MV2DPtr(mv2darr);
print(mv2dptr instanceof MV2DArray);    // false
print(mv2dptr instanceof MV2DPtr);      // true
mv2dptr[1][1] = MV(1,1);
print(mv2darr);
// [
//  [[0,0],[0,0],[0,0]],
//  [[0,0],[1,1],[0,0]]
// ]
print(mv2dptr);
// [
//  [[0,0],[0,0],[0,0]],
//  [[0,0],[1,1],[0,0]]
// ]
print(mv2dptr.width);
// 3
print(mv2dptr.height);
// 2
```

## MV2DMask Constructor

The constructor is used to create a new `MV2DMask` object of width
`width` and height `height`. All elements are initialized to `true`.

### Syntax
```js
new MV2DMask(width, height)
```

### Parameters
`width` must be a non-zero positive number that specifies the width
of the 2-dimensional mask array to be created.

`height` must be a non-zero positive number that specifies the height
of the 2-dimensional mask array to be created.

### Return value
The new `MV2DMask` object.

### Examples
```js
const mv2dmask = new MV2DMask(3, 2);
print(mv2dmask);
// [
//  [true,true,true],
//  [true,true,true]
// ]
for ( let i = 0; i < mv2dmask.height; i++ )
    for ( let j = 0; j < mv2dmask.width; j++ )
        mv2dmask[i][j] = ((i+j) & 1);
print(mv2dmask);
// [
//  [false,true,false],
//  [true,false,true]
// ]
print(mv2dmask.width);
// 3
print(mv2dmask.height);
// 2
```

<hr />
## MV2DArray.prototype.toString()

The `toString()` method returns a string representing the specified
2-dimensional array and its motion vectors.

### Syntax
```js
toString()
```

### Return value
The string representation.

### Examples
```js
const mv2dmask = new MV2DMask(3, 2);
print(mv2dmask.toString());
// [
//  [true,true,true],
//  [true,true,true]
// ]
```

<!-- ## MV2DArray.prototype.join() -->
<!-- ## MV2DArray.prototype.copyWithin() -->

<hr />
## MV2DArray.prototype.subarray()

The `subarray()` method returns an `MV2DPtr` that points to a chunk of
data inside the current object, starting from index `begin` and ending
in index `end`.

### Syntax
```js
subarray()
subarray(begin)
subarray(begin, end)
```

### Parameters
`begin` (optional) is the starting `[horizontal, vertical]` index where
the new object will point to.
If this value is omitted, `begin` is `[0,0]`.

`end` (optional) is the end `[horizontal, vertical]` index where the
new object will point to.
If this value is omitted, `end` is `[width,height]`.

**Note**: the `begin` and `end` parameters can contain negative values.
In that case, the values wrap around from the last index.

### Return value
The new `MV2DPtr` object.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
const mv2dptr = mv2darr.subarray();
print(mv2dptr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
print(mv2dptr instanceof MV2DArray); // false
print(mv2dptr instanceof MV2DPtr);  // true
print(mv2darr.subarray([0,1]));
// [
//  [[1,0],[1,1],[1,2]]
// ]
print(mv2darr.subarray([0,-1]));
// [
//  [[1,0],[1,1],[1,2]]
// ]
print(mv2darr.subarray([1,1], [3,2]));
// [
//  [[1,1],[1,2]]
// ]
```

<!-- ## MV2DArray.prototype.set() -->

<hr />
## MV2DArray.prototype.fill()

The `fill()` method fills all the motion vectors of a 2-dimensional
array from an `start` index to an `end` index with a motion vector
`mv`.

### Syntax
```js
fill(mv)
fill(mv, start)
fill(mv, start, end)
```

### Parameters
`mv` to fill the array with.

`start` (optional) is the `[horizontal, vertical]` index where the
filling starts.
If this value is omitted, `begin` is `[0,0]`.

`end` (optional) is the end `[horizontal, vertical]` index where the
filling starts.
If this value is omitted, `end` is `[width,height]`.

**Note**: the `start` and `end` parameters can contain negative values.
In that case, the values wrap around from the last index.

### Return value
The modified 2-dimensional motion vector array.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
print(mv2darr);
// [
//  [[0,0],[0,0],[0,0]],
//  [[0,0],[0,0],[0,0]]
// ]
print(mv2darr.fill(MV(1,1)));
// [
//  [[1,1],[1,1],[1,1]],
//  [[1,1],[1,1],[1,1]]
// ]
print(mv2darr.fill(MV(2,2), [1,0]));
// [
//  [[1,1],[2,2],[2,2]],
//  [[1,1],[2,2],[2,2]]
// ]
print(mv2darr.fill(MV(3,3), [1,0], [2,2]));
// [
//  [[1,1],[3,3],[2,2]],
//  [[1,1],[3,3],[2,2]]
// ]
```

<hr />
## MVArray.prototype.reverse()

The `reverse()` method reverses all motion vectors in the 2-dimensional
array **in-place**, both horizontally and vertically.
This operation applies to the entire 2-dimensional array (there are no
range arguments).
If you want to reverse just a small chunk of the array, use the
`subarray()` method and call `reverse()` on that.

### Syntax
```js
reverse()
```

### Return value
The modified 2-dimensional motion vector array.

### Examples
```js
const mv2darr = new MV2DArray(3, 4);
mv2darr.forEach((mv, i, j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]],
//  [[2,0],[2,1],[2,2]],
//  [[3,0],[3,1],[3,2]]
// ]
print(mv2darr.reverse());
// [
//  [[3,2],[3,1],[3,0]],
//  [[2,2],[2,1],[2,0]],
//  [[1,2],[1,1],[1,0]],
//  [[0,2],[0,1],[0,0]]
// ]
const subarray = mv2darr.subarray([1,1], [3,3]);
print(subarray);
// [
//  [[2,1],[2,0]],
//  [[1,1],[1,0]]
// ]
print(subarray.reverse());
// [
//  [[1,0],[1,1]],
//  [[2,0],[2,1]]
// ]
print(mv2darr);
// [
//  [[3,2],[3,1],[3,0]],
//  [[2,2],[1,0],[1,1]],
//  [[1,2],[2,0],[2,1]],
//  [[0,2],[0,1],[0,0]]
// ]
```

<hr />
## MVArray.prototype.reverse_h()

The `reverse_h()` method reverses all motion vectors in the
2-dimensional array **in-place**, but only horizontally.
This operation applies to the entire 2-dimensional array (there are no
range arguments).
If you want to horizontally reverse just a small chunk of the array,
use the `subarray()` method and call `reverse_h()` on that.

### Syntax
```js
reverse_h()
```

### Return value
The modified 2-dimensional motion vector array.

### Examples
```js
const mv2darr = new MV2DArray(3, 4);
mv2darr.forEach((mv, i, j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]],
//  [[2,0],[2,1],[2,2]],
//  [[3,0],[3,1],[3,2]]
// ]
print(mv2darr.reverse_h());
// [
//  [[0,2],[0,1],[0,0]],
//  [[1,2],[1,1],[1,0]],
//  [[2,2],[2,1],[2,0]],
//  [[3,2],[3,1],[3,0]]
// ]
const subarray = mv2darr.subarray([1,1], [3,3]);
print(subarray);
// [
//  [[1,1],[1,0]],
//  [[2,1],[2,0]]
// ]
print(subarray.reverse_h());
// [
//  [[1,0],[1,1]],
//  [[2,0],[2,1]]
// ]
print(mv2darr);
// [
//  [[0,2],[0,1],[0,0]],
//  [[1,2],[1,0],[1,1]],
//  [[2,2],[2,0],[2,1]],
//  [[3,2],[3,1],[3,0]]
// ]
```

<hr />
## MVArray.prototype.reverse_v()

The `reverse_v()` method reverses all motion vectors in the
2-dimensional array **in-place**, but only vertically.
This operation applies to the entire 2-dimensional array (there are no
range arguments).
If you want to vertically reverse just a small chunk of the array, use
the `subarray()` method and call `reverse_v()` on that.

### Syntax
```js
reverse_v()
```

### Return value
The modified 2-dimensional motion vector array.

### Examples
```js
const mv2darr = new MV2DArray(3, 4);
mv2darr.forEach((mv, i, j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]],
//  [[2,0],[2,1],[2,2]],
//  [[3,0],[3,1],[3,2]]
// ]
print(mv2darr.reverse_v());
// [
//  [[3,0],[3,1],[3,2]],
//  [[2,0],[2,1],[2,2]],
//  [[1,0],[1,1],[1,2]],
//  [[0,0],[0,1],[0,2]]
// ]
const subarray = mv2darr.subarray([1,1], [3,3]);
print(subarray);
// [
//  [[2,1],[2,2]],
//  [[1,1],[1,2]]
// ]
print(subarray.reverse_v());
// [
//  [[1,1],[1,2]],
//  [[2,1],[2,2]]
// ]
print(mv2darr);
// [
//  [[3,0],[3,1],[3,2]],
//  [[2,0],[1,1],[1,2]],
//  [[1,0],[2,1],[2,2]],
//  [[0,0],[0,1],[0,2]]
// ]
```

<!-- ## MV2DArray.prototype.sort() -->

<hr />
## MV2DArray.prototype.slice()

The `slice()` method returns a new `MV2DArray` object with a copy of
the data specified in the (optional) `start` and `end` range arguments.
If no range is specified, the entire 2-dimensional array is copied,
effectively performing a `deep copy` of the current object.

### Syntax
```js
slice()
slice(start)
slice(start, end)
```

### Parameters
`start` (optional) is the `[horizontal, vertical]` index where the
filling starts.
If this value is omitted, `begin` is `[0,0]`.

`end` (optional) is the end `[horizontal, vertical]` index where the
filling starts.
If this value is omitted, `end` is `[width,height]`.

**Note**: the `start` and `end` parameters can contain negative values.
In that case, the values wrap around from the last index.

### Return value
The new `MV2DArray` object.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
const mv2dslc = mv2darr.slice();
mv2dslc[1][1] = MV(3,3);
print(mv2dslc);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[3,3],[1,2]]
// ]
print(mv2darr.slice([1,0]));
// [
//  [[0,1],[0,2]],
//  [[1,1],[1,2]]
// ]
print(mv2darr.slice([1,0], [2,2]));
// [
//  [[0,1]],
//  [[1,1]]
// ]
```

<hr />
## MV2DArray.prototype.dup()

The `dup()` method performs a `deep copy` of the current object.
It has the same behaviour as calling `slice()` with no range arguments.

### Syntax
```js
dup()
```

### Return value
The new `MV2DArray` object.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
const mv2ddup = mv2darr.dup();
mv2ddup[1][1] = MV(3,3);
print(mv2ddup);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[3,3],[1,2]]
// ]
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
```

<hr />
## MV2DArray.prototype.every()

The `every()` method tests whether **every** motion vector in the
2-dimensional array passes the test implemented by the `callbackFn`
function.
If any motion vector **does not** pass the test, the method returns
early with `false`.

### Syntax
```js
every(callbackFn(mv, i, j, array))
every(callbackFn(mv, i, j, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the 2-dimensional array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `i` (the vertical index it corresponds to in the
2-dimensional array), `j` (the horizontal index it correspons to in the
2-dimensional array), and `array` (the 2-dimensional array itself).
The function should return either `true` or `false`.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`true` or `false`.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
print(mv2darr.every((mv,i,j) => mv[0] == i && j == mv[1])); // true
print(mv2darr.every((mv) => mv[0] >= 0)); // true
print(mv2darr.every((mv) => mv[0] > 0)); // false
```

<hr />
## MV2DArray.prototype.some()

The `some()` method tests whether **at least one** motion vector in the
2-dimensional array passes the test implemented by the `callbackFn`
function.
If any motion vector **does** pass the test, the method returns early
with `true`.

### Syntax
```js
some(callbackFn(mv, i, j, array))
some(callbackFn(mv, i, j, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the 2-dimensional array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `i` (the vertical index it corresponds to in the
2-dimensional array), `j` (the horizontal index it correspons to in the
2-dimensional array), and `array` (the 2-dimensional array itself).
The function should return either `true` or `false`.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`true` or `false`.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
print(mv2darr.some((mv) => mv[0] <= 0)); // true
print(mv2darr.some((mv) => mv[0] < 0)); // false
```

<hr />
## MV2DArray.prototype.forEach()

The `forEach()` method calls the `callbackFn` function for each motion
vector of the 2-dimensional array. It has the same functionality as
calling the code below, but it's slightly faster.
Note that you **can** modify `mv` directly, since it is passed as an
`MVRef`.

```js
for ( let i = 0; i < mv2darr.height; i++ )
    for ( let j = 0; j < mv2darr.width; j++ )
        callbackFn(mv2darr[i][j], i, j, mv2darr);
```

### Syntax
```js
forEach(callbackFn(mv, i, j, array))
forEach(callbackFn(mv, i, j, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the 2-dimensional array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `i` (the vertical index it corresponds to in the
2-dimensional array), `j` (the horizontal index it correspons to in the
2-dimensional array), and `array` (the 2-dimensional array itself).

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`undefined`.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
mv2darr.forEach((mv) => mv = MV(4,4));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
// Note that the previous call to `forEach()` did not modify the array
// since the scoped variable mv was replaced instead of modified.
mv2darr.forEach((mv) => mv[0] = 0);
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[0,0],[0,1],[0,2]]
// ]
function is_zero_zero(mv, i, j) {
    const not_str = (mv.compare_neq(0,0)) ? "not " : "";
    print(`mv [${i}][${j}] is ${mv}, which is ${not_str}[zero,zero]`);
}
mv2darr.forEach(is_zero_zero);
// mv [0][0] is [0,0], which is [zero,zero]
// mv [0][1] is [0,1], which is not [zero,zero]
// mv [0][2] is [0,2], which is not [zero,zero]
// mv [1][0] is [0,0], which is [zero,zero]
// mv [1][1] is [0,1], which is not [zero,zero]
// mv [1][2] is [0,2], which is not [zero,zero]
```

<hr />
## MV2DArray.prototype.maskedForEach()

The `maskedForEach()` method calls the `callbackFn` function for each
motion vector of the 2-dimensional array that is selected by the
`mv2dmask` argument.
It has the same functionality as calling the code below, but it's
slightly faster.
Note that you **can** modify `mv` directly, since it is passed as an
`MVRef`.

```js
for ( let i = 0; i < mv2darr.height; i++ )
    for ( let j = 0; j < mv2darr.width; j++ )
        if ( mv2dmask[i][j] )
            callbackFn(mv2darr[i][j], i, j, mv2darr);
```

### Syntax
```js
maskedForEach(mv2dmask, callbackFn(mv, i, j, array))
maskedForEach(mv2dmask, callbackFn(mv, i, j, array), thisArg)
```

### Parameters
`mv2dmask` is an `MV2DMask` that specifies on which motion vectors the
`callbackFn` function should be called on.

`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the 2-dimensional array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `i` (the vertical index it corresponds to in the
2-dimensional array), `j` (the horizontal index it correspons to in the
2-dimensional array), and `array` (the 2-dimensional array itself).

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`undefined`.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
const mv2dmask = new MV2DMask(3, 2);
mv2dmask.forEach((_,i,j,arr) => arr[i][j] = (i == j));
print(mv2dmask);
// [
//  [true,false,false],
//  [false,true,false]
// ]
mv2darr.maskedForEach(mv2dmask, (mv) => mv.assign(MV(3,3)));
print(mv2darr);
// [
//  [[3,3],[0,1],[0,2]],
//  [[1,0],[3,3],[1,2]]
// ]
```

<hr />
## MV2DArray.prototype.map()

The `map()` method creates a new `MV2DArray` and calls the `callbackFn`
on each motion vector of the 2-dimensional source array, storing the
result in the corresponding motion vector in the new 2-dimensional
array.

### Syntax
```js
map(callbackFn(mv, i, j, array))
map(callbackFn(mv, i, j, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the 2-dimensional array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `i` (the vertical index it corresponds to in the
2-dimensional array), `j` (the horizontal index it correspons to in the
2-dimensional array), and `array` (the 2-dimensional array itself).
The function should return a motion vector value to be stored in the
new 2-dimensional array.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
The new `MV2DArray` object.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
const mv2dmap = mv2darr.map((mv) => MV(mv[0]+2,mv[1]+2));
print(mv2dmap);
// [
//  [[2,2],[2,3],[2,4]],
//  [[3,2],[3,3],[3,4]]
// ]
```

<!-- ## MV2DArray.prototype.find() -->
<!-- ## MV2DArray.prototype.findIndex() -->
<!-- ## MV2DArray.prototype.indexOf() -->
<!-- ## MV2DArray.prototype.lastIndexOf() -->
<!-- ## MV2DArray.prototype.includes() -->
<!-- ## MV2DArray.prototype.reduce() -->
<!-- ## MV2DArray.prototype.reduceRight() -->
<!-- ## MV2DArray.prototype.values() -->
<!-- ## MV2DArray.prototype.keys() -->
<!-- ## MV2DArray.prototype.entries() -->

<hr />
## MV2DArray.prototype.largest_sq()

The `largest_sq()` method returns an `[ index, mv.magnitude_sq() ]`
array with the index and the value of the squared magnitude of the
motion vector with the largest squared magnitude in the 2-dimensional
array.

### Syntax
```js
largest_sq()
```

### Return value
An `[ i, j, mv.magnitude_sq() ]` array of the largest motion vector.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i+2,j+2)));
print(mv2darr);
// [
//  [[2,2],[2,3],[2,4]],
//  [[3,2],[3,3],[3,4]]
// ]
print(mv2darr.largest_sq());        // 1,2,25
// array element [1][2] ([3,4]) has a squared magnitude of 3*3+4*4 = 25.
```

<hr />
## MV2DArray.prototype.smallest_sq()

The `smallest_sq()` method returns an `[ index, mv.magnitude_sq() ]`
array with the index and the value of the squared magnitude of the
motion vector with the smallest squared magnitude in the 2-dimensional
array.

### Syntax
```js
smallest_sq()
```

### Return value
An `[ i, j, mv.magnitude_sq() ]` array of the smallest motion vector.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i+2,j+2)));
print(mv2darr);
// [
//  [[2,2],[2,3],[2,4]],
//  [[3,2],[3,3],[3,4]]
// ]
print(mv2darr.smallest_sq());       // 0,0,8
// array element [0][0] ([2,2]) has a squared magnitude of 2*2+2*2 = 8.
```

<hr />
## MV2DArray.prototype.swap_hv()

The `swap_hv()` method swaps the horizontal and vertical elements of
all the motion vectors in the 2-dimensional array **in-place**.
If you want to swap just a small chunk of the 2-dimensional array, use
the `subarray()` method and call `swap_hv()` on that.

### Syntax
```js
swap_hv()
```

### Return value
The modified 2-dimensional motion vector array.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
print(mv2darr.swap_hv());
// [
//  [[0,0],[1,0],[2,0]],
//  [[0,1],[1,1],[2,1]]
// ]
print(mv2darr);
// [
//  [[0,0],[1,0],[2,0]],
//  [[0,1],[1,1],[2,1]]
// ]
```

<hr />
## MV2DArray.prototype.clear()

The `clear()` method zeroes the horizontal and vertical elements of all
of the motion vectors in the 2-dimensional array **in-place**.
If you want to clear just a small chunk of the 2-dimensional array, use
the `subarray()` method and call `clear()` on that.

### Syntax
```js
clear()
```

### Return value
The modified 2-dimensional motion vector array.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
print(mv2darr.clear());
// [
//  [[0,0],[0,0],[0,0]],
//  [[0,0],[0,0],[0,0]]
// ]
print(mv2darr);
// [
//  [[0,0],[0,0],[0,0]],
//  [[0,0],[0,0],[0,0]]
// ]
```

<hr />
## MV2DArray.prototype.mathOp()

There is no real `mathOp()` method in the `MV2DArray` prototype.
Instead, there are a bunch of math operation methods, listed below:
```js
add()
sub()
mul()
div()
assign()
```
The arguments passed to the methods above should first start with a
source of motion vectors, and then an optional mask.

The source of motion vectors should be either an `MV2DArray` (of the
same width/height as the 2-dimensional array), an `MVArray` (of the
same length as the 2-dimensional array's width), `null` (only for the
`assign` operation), an `MV` constant, an `MV` object, or an `MVRef`
object, or a motion vector specified in terms of its horizontal and
vertical components.

The `mask` argument is optional, and it should be either an `MV2DMask`
(of the same width/height as the 2-dimensional array), or an `MVMask`
(of the same length as the 2-dimensional array's width). If a mask is
supplied, the operation is only applied to the motion vectors selected
by the mask.

The operations do exactly what the names mean. `add()` will add the
argument to the 2-dimensional motion vector array, `sub()` will
subtract, `mul()` will multiply, `div()` will divide (rounding to
nearest integer), and `assign()` will assign (just copy).

If the motion vector source is a single motion vector, that motion
vector will be applied to the entire 2-dimensional array. If the motion
vector source is an `MV2DArray`, each element in the `MV2DArray` will
be applied to the corresponding element of the 2-dimensional array. If
the motion vector source is an `MVArray`, each element in the `MVArray`
will be applied to the corresponding element of each row of the
2-dimensional array.

There are also similar methods that operate only on the horizontal or
vertical elements of the 2-dimensional motion vector array. These
methods have either `_h` (horizontal) or `_v` (vertical) appended to
the names.
These methods also take a mandatory source of motion vectors as
argument, and then an optional mask. They can also take only one
argument (the `horizontal` or `vertical` element) as motion vector
source.
They are listed below:
```js
add_h()
sub_h()
mul_h()
div_h()
assign_h()
add_v()
sub_v()
mul_v()
div_v()
assign_v()
```

### Syntax
```js
mathOp(mv2darray)
mathOp(mvarray)
mathOp(null)
mathOp(mv)
mathOp(horizontal, vertical)
mathOp(mv2darray, mask)
mathOp(mvarray, mask)
mathOp(null, mask)
mathOp(mv, mask)
mathOp(horizontal, vertical, mask)
mathOp_h(mv2darray)
mathOp_h(mvarray)
mathOp_h(mv)
mathOp_h(horizontal, vertical)
mathOp_h(horizontal)
mathOp_h(mv2darray, mask)
mathOp_h(mvarray, mask)
mathOp_h(mv, mask)
mathOp_h(horizontal, vertical, mask)
mathOp_h(horizontal, mask)
mathOp_v(mv2darray)
mathOp_v(mvarray)
mathOp_v(mv)
mathOp_v(horizontal, vertical)
mathOp_v(vertical)
mathOp_v(mv2darray, mask)
mathOp_v(mvarray, mask)
mathOp_v(mv, mask)
mathOp_v(horizontal, vertical, mask)
mathOp_v(vertical, mask)
```

### Parameters
`mv2darray` (optional) is an `MV2DArray` object.

`mvarray` (optional) is an `MVArray` object.

`mv` (optional) must be either an `MV` constant, an `MV` object, or an `MVRef` object.

`horizontal` (optional) is the horizontal component of the motion vector.

`vertical` (optional) is the vertical component of the motion vector.

`mask` (optional) is either an `MV2DMask` that specifies on which
motion vectors of the 2-dimensional array the operation should be
carried out on, or an `MVMask` that specifies on which motion vectors
for each row of the 2-dimensional array the operation should be carried
out on.

### Return value
The modified 2-dimensional motion vector array.

### Examples
```js
// create sources of motion vectors
const mv2dsrc = new MV2DArray(3, 2);
mv2dsrc.forEach((_,i,j,arr) => arr[i][j] = MV(i+j+1,i-j-1));
const mvarr = mv2dsrc[0].dup();
const mvsrc = new MV(mvarr[0]);
print(mv2dsrc instanceof MV2DArray); // true
print(mvarr instanceof MVArray);     // true
print(mvsrc instanceof MV);          // true
print(mv2dsrc);
// [
//  [[1,-1],[2,-2],[3,-3]],
//  [[2,0],[3,-1],[4,-2]]
// ]
print(mvarr);
// [1,-1],[2,-2],[3,-3]
print(mvsrc);
// [1,-1]
// create mask
const mv2dmask = new MV2DMask(3, 2);
mv2dmask.forEach((_,i,j,arr) => arr[i][j] = ((i+j) & 1));
const mvmask = mv2dmask[0];
print(mv2dmask instanceof MV2DMask); // true
print(mvmask instanceof MVMask);     // true
print(mv2dmask);
// [
//  [false,true,false],
//  [true,false,true]
// ]
print(mvmask);
// false,true,false
// create work mv2darray
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i,j)));
// good luck keeping track of the value of the motion vectors!
print(mv2darr);
// [
//  [[0,0],[0,1],[0,2]],
//  [[1,0],[1,1],[1,2]]
// ]
print("add");
// add
print(mv2darr.add(mv2dsrc));
// [
//  [[1,-1],[2,-1],[3,-1]],
//  [[3,0],[4,0],[5,0]]
// ]
print(mv2darr.add(mvarr));
// [
//  [[2,-2],[4,-3],[6,-4]],
//  [[4,-1],[6,-2],[8,-3]]
// ]
print(mv2darr.add(mvsrc));
// [
//  [[3,-3],[5,-4],[7,-5]],
//  [[5,-2],[7,-3],[9,-4]]
// ]
print(mv2darr.add(mv2dsrc, mv2dmask));
// [
//  [[3,-3],[7,-6],[7,-5]],
//  [[7,-2],[7,-3],[13,-6]]
// ]
print(mv2darr.add(mvarr, mv2dmask));
// [
//  [[3,-3],[9,-8],[7,-5]],
//  [[8,-3],[7,-3],[16,-9]]
// ]
print(mv2darr.add(mvsrc, mv2dmask));
// [
//  [[3,-3],[10,-9],[7,-5]],
//  [[9,-4],[7,-3],[17,-10]]
// ]
print(mv2darr.add(mv2dsrc, mvmask));
// [
//  [[3,-3],[12,-11],[7,-5]],
//  [[9,-4],[10,-4],[17,-10]]
// ]
print(mv2darr.add(mvarr, mvmask));
// [
//  [[3,-3],[14,-13],[7,-5]],
//  [[9,-4],[12,-6],[17,-10]]
// ]
print(mv2darr.add(mvsrc, mvmask));
// [
//  [[3,-3],[15,-14],[7,-5]],
//  [[9,-4],[13,-7],[17,-10]]
// ]
print(mv2darr.add_h(mv2dsrc));
// [
//  [[4,-3],[17,-14],[10,-5]],
//  [[11,-4],[16,-7],[21,-10]]
// ]
print(mv2darr.add_h(mvarr));
// [
//  [[5,-3],[19,-14],[13,-5]],
//  [[12,-4],[18,-7],[24,-10]]
// ]
print(mv2darr.add_h(mvsrc));
// [
//  [[6,-3],[20,-14],[14,-5]],
//  [[13,-4],[19,-7],[25,-10]]
// ]
print(mv2darr.add_h(2));
// [
//  [[8,-3],[22,-14],[16,-5]],
//  [[15,-4],[21,-7],[27,-10]]
// ]
print(mv2darr.add_h(mv2dsrc, mv2dmask));
// [
//  [[8,-3],[24,-14],[16,-5]],
//  [[17,-4],[21,-7],[31,-10]]
// ]
print(mv2darr.add_h(mvarr, mv2dmask));
// [
//  [[8,-3],[26,-14],[16,-5]],
//  [[18,-4],[21,-7],[34,-10]]
// ]
print(mv2darr.add_h(mvsrc, mv2dmask));
// [
//  [[8,-3],[27,-14],[16,-5]],
//  [[19,-4],[21,-7],[35,-10]]
// ]
print(mv2darr.add_h(2, mv2dmask));
// [
//  [[8,-3],[29,-14],[16,-5]],
//  [[21,-4],[21,-7],[37,-10]]
// ]
print(mv2darr.add_h(mv2dsrc, mvmask));
// [
//  [[8,-3],[31,-14],[16,-5]],
//  [[21,-4],[24,-7],[37,-10]]
// ]
print(mv2darr.add_h(mvarr, mvmask));
// [
//  [[8,-3],[33,-14],[16,-5]],
//  [[21,-4],[26,-7],[37,-10]]
// ]
print(mv2darr.add_h(mvsrc, mvmask));
// [
//  [[8,-3],[34,-14],[16,-5]],
//  [[21,-4],[27,-7],[37,-10]]
// ]
print(mv2darr.add_h(2, mvmask));
// [
//  [[8,-3],[36,-14],[16,-5]],
//  [[21,-4],[29,-7],[37,-10]]
// ]
print(mv2darr.add_v(mv2dsrc));
// [
//  [[8,-4],[36,-16],[16,-8]],
//  [[21,-4],[29,-8],[37,-12]]
// ]
print(mv2darr.add_v(mvarr));
// [
//  [[8,-5],[36,-18],[16,-11]],
//  [[21,-5],[29,-10],[37,-15]]
// ]
print(mv2darr.add_v(mvsrc));
// [
//  [[8,-6],[36,-19],[16,-12]],
//  [[21,-6],[29,-11],[37,-16]]
// ]
print(mv2darr.add_v(2));
// [
//  [[8,-4],[36,-17],[16,-10]],
//  [[21,-4],[29,-9],[37,-14]]
// ]
print(mv2darr.add_v(mv2dsrc, mv2dmask));
// [
//  [[8,-4],[36,-19],[16,-10]],
//  [[21,-4],[29,-9],[37,-16]]
// ]
print(mv2darr.add_v(mvarr, mv2dmask));
// [
//  [[8,-4],[36,-21],[16,-10]],
//  [[21,-5],[29,-9],[37,-19]]
// ]
print(mv2darr.add_v(mvsrc, mv2dmask));
// [
//  [[8,-4],[36,-22],[16,-10]],
//  [[21,-6],[29,-9],[37,-20]]
// ]
print(mv2darr.add_v(2, mv2dmask));
// [
//  [[8,-4],[36,-20],[16,-10]],
//  [[21,-4],[29,-9],[37,-18]]
// ]
print(mv2darr.add_v(mv2dsrc, mvmask));
// [
//  [[8,-4],[36,-22],[16,-10]],
//  [[21,-4],[29,-10],[37,-18]]
// ]
print(mv2darr.add_v(mvarr, mvmask));
// [
//  [[8,-4],[36,-24],[16,-10]],
//  [[21,-4],[29,-12],[37,-18]]
// ]
print(mv2darr.add_v(mvsrc, mvmask));
// [
//  [[8,-4],[36,-25],[16,-10]],
//  [[21,-4],[29,-13],[37,-18]]
// ]
print(mv2darr.add_v(2, mvmask));
// [
//  [[8,-4],[36,-23],[16,-10]],
//  [[21,-4],[29,-11],[37,-18]]
// ]
// you get the idea, I won't repeat for "sub", "mul", and "div".
print("assign");
// assign
print(mv2darr.assign(mv2dsrc));
// [
//  [[1,-1],[2,-2],[3,-3]],
//  [[2,0],[3,-1],[4,-2]]
// ]
print(mv2darr.assign(mvarr));
// [
//  [[1,-1],[2,-2],[3,-3]],
//  [[1,-1],[2,-2],[3,-3]]
// ]
print(mv2darr.assign(mvsrc));
// [
//  [[1,-1],[1,-1],[1,-1]],
//  [[1,-1],[1,-1],[1,-1]]
// ]
// the null argument is only allowed when assigning
print(mv2darr.assign(null, mv2dmask));
// [
//  [[8,-4],null,[16,-10]],
//  [null,[29,-11],null]
// ]
print(mv2darr.assign(null, mvmask));
// [
//  [[8,-4],null,[16,-10]],
//  [null,null,null]
// ]
print(mv2darr.assign(null));
// [
//  [null,null,null],
//  [null,null,null]
// ]
```

Note: check `MVArray.prototype.mathOp()` for more examples.

<hr />
## MV2DArray.prototype.compare()

The `compare()` returns an `MV2DMask` with the result from running the
provided `compareFn()` function on all elements of the 2-dimensional
array.

### Syntax
```js
compare(compareFn(mv, i, j, array))
compare(compareFn(mv, i, j, array), thisArg)
```

### Parameters
`compareFn` is a function (`inline`, `arrow`, or normal) that is called
for each motion vector of the 2-dimensional array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `i` (the vertical index it corresponds to in the
2-dimensional array), `j` (the horizontal index it correspons to in the
2-dimensional array), and `array` (the 2-dimensional array itself).
The function should return either `true` or `false`.

`thisArg` (optional) is a value to use as `this` when executing
`compareFn`.

### Return value
An `MV2DMask` filled with the results from each comparison.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
mv2darr.forEach((mv,i,j) => mv.assign(MV(i+2,j+2)));
print(mv2darr);
// [
//  [[2,2],[2,3],[2,4]],
//  [[3,2],[3,3],[3,4]]
// ]
const mv2dmask = mv2darr.compare((mv) => mv[0] == mv[1]);
print(mv2dmask);
// [
//  [true,false,false],
//  [false,true,false]
// ]
```

<hr />
## MV2DArray.prototype.compareOp()

There is no real `compareOp()` method in the `MV2DArray` prototype.
Instead, there are a bunch of comparison methods, listed below:
```js
compare_eq()
compare_neq()
compare_gt()
compare_gte()
compare_lt()
compare_lte()
```

The difference between the `compare()` method and the `compareOp()`
methods is that `compare()` takes a function, and `compareOp()` will
run some predefined comparisons, which should be much faster than
calling a function for each iteration.

The arguments passed to the methods above should be either an
`MV2DArray` (of the same width/height as the 2-dimensional array), an
`MVArray` (of the same length as the 2-dimensional array's width),
`null` (only for the `assign` operation), an `MV` constant, an `MV`
object, or an `MVRef` object, a motion vector specified in terms of its
horizontal and vertical components, or a single integer, which will
be used as the squared magnitude of a motion vector.

The behaviour of each method is defined as follows:
* `compare_eq()` tests for `equality` (`==`).
* `compare_neq()` tests for `inequality` (`!=`).
* `compare_gt()` tests for `greater than` (`>`)
* `compare_gte()` tests for `greater than or equal` (`>=`).
* `compare_lt()` tests for `less than` (`<`).
* `compare_lte()` tests for `less than or equal` (`<`).

There are also similar methods that operate only on the horizontal or
vertical elements of the motion vector. These methods take only one
argument (the `horizontal` or `vertical` element), and have either
`_h` (horizontal) or `_v` (vertical) appended to the method names.
They are listed below:
```js
compare_eq_h()
compare_neq_h()
compare_gt_h()
compare_gte_h()
compare_lt_h()
compare_lte_h()
compare_eq_v()
compare_neq_v()
compare_gt_v()
compare_gte_v()
compare_lt_v()
compare_lte_v()
```

### Syntax
```js
compareOp(null)
compareOp(mv2darray)
compareOp(mvarray)
compareOp(mv)
compareOp(magnitude_sq)
compareOp(horizontal, vertical)
compareOp_h(horizontal)
compareOp_v(vertical)
```

### Parameters
`mv2darray` (optional) is an `MV2DArray` object.

`mvarray` (optional) is an `MVArray` object.

`mv` (optional) must be either an `MV` constant, an `MV` object, or an `MVRef` object.

`magnitude_sq` (optional) is the squared magnitude to compare against.

`horizontal` (optional) is the horizontal component of the motion vector.

`vertical` (optional) is the vertical component of the motion vector.

### Return value
An `MV2DMask` filled with the results from each comparison.

### Examples
```js
// create sources of motion vectors
const mv2dsrc = new MV2DArray(3, 2);
mv2dsrc.forEach((_,i,j,arr) => arr[i][j] = MV(i+j+1,i-j-1));
const mvarr = mv2dsrc[0].dup();
const mvsrc = new MV(mvarr[0]);
print(mv2dsrc instanceof MV2DArray); // true
print(mvarr instanceof MVArray);     // true
print(mvsrc instanceof MV);          // true
print(mv2dsrc);
// [
//  [[1,-1],[2,-2],[3,-3]],
//  [[2,0],[3,-1],[4,-2]]
// ]
print(mvarr);
// [1,-1],[2,-2],[3,-3]
print(mvsrc);
// [1,-1]
const mg_sq = 18;
// create work mv2darray
const mv2darr = mv2dsrc.dup();
mv2darr[0][2][1] = 3;
mv2darr[1][0] = MV(0,0);
mv2darr[1][1] = MV(2,-2);
mv2darr[1][2] = null;
// good luck keeping track of the value of the motion vectors!
print(mv2darr);
// [
//  [[0,0],[2,-2],[3,3]],
//  [[2,0],[4,2],null]
// ]
print("compare_eq");                // compare_eq
print(mv2darr.compare_eq(mv2dsrc));
// [
//  [true,true,false],
//  [false,false,false]
// ]
print(mv2darr.compare_eq(mvarr));
// [
//  [true,true,false],
//  [false,true,false]
// ]
print(mv2darr.compare_eq(mvsrc));
// [
//  [true,false,false],
//  [false,false,false]
// ]
print(mv2darr.compare_eq(null));
// [
//  [false,false,false],
//  [false,false,true]
// ]
print(mv2darr.compare_eq(mg_sq));
// [
//  [false,false,true],
//  [false,false,false]
// ]
// compare_neq() is just the opposite of compare_eq()
print("compare_gt");                // compare_gt
print(mv2darr.compare_gt(mv2dsrc));
// [
//  [false,false,false],
//  [false,false,false]
// ]
print(mv2darr.compare_gt(mvarr));
// [
//  [false,false,false],
//  [false,false,false]
// ]
print(mv2darr.compare_gt(mvsrc));
// [
//  [false,true,true],
//  [false,true,false]
// ]
print(mv2darr.compare_gt(null));
// [
//  [false,false,false],
//  [false,false,false]
// ]
print(mv2darr.compare_gt(mg_sq));
// [
//  [false,false,false],
//  [false,false,false]
// ]
print("compare_gte");               // compare_gt
print(mv2darr.compare_gte(mv2dsrc));
// [
//  [true,true,true],
//  [false,false,false]
// ]
print(mv2darr.compare_gte(mvarr));
// [
//  [true,true,true],
//  [false,true,false]
// ]
print(mv2darr.compare_gte(mvsrc));
// [
//  [true,true,true],
//  [false,true,false]
// ]
print(mv2darr.compare_gte(null));
// [
//  [false,false,false],
//  [false,false,false]
// ]
print(mv2darr.compare_gte(mg_sq));
// [
//  [false,false,true],
//  [false,false,false]
// ]
// compare_lt() is just the opposite of compare_gte()
// compare_lte() is just the opposite of compare_gt()
```

Note: check `MVArray.prototype.compareOp()` for more examples.

<hr />
## MV2DMask.prototype.fill()

The `fill()` method fills all the elements of a 2-dimensional mask
array from an `start` index to an `end` index with the boolean `value`.

### Syntax
```js
fill(value)
fill(value, start)
fill(value, start, end)
```

### Parameters
`value` boolean to fill the 2-dimensional mask array with.

`start` (optional) is the `[horizontal, vertical]` index where the
filling starts.
If this value is omitted, `begin` is `[0,0]`.

`end` (optional) is the end `[horizontal, vertical]` index where the
filling starts.
If this value is omitted, `end` is `[width,height]`.

**Note**: the `start` and `end` parameters can contain negative values.
In that case, the values wrap around from the last index.

### Return value
The modified 2-dimensional mask array.

### Examples
```js
const mv2dmask = new MV2DMask(3, 2);
print(mv2dmask);
// [
//  [true,true,true],
//  [true,true,true]
// ]
print(mv2dmask.fill(false));
// [
//  [false,false,false],
//  [false,false,false]
// ]
print(mv2dmask.fill(true, [2,0]));
// [
//  [false,false,true],
//  [false,false,true]
// ]
print(mv2dmask.fill(true, [0,1], [3,2]));
// [
//  [false,false,true],
//  [true,true,true]
// ]
```

<hr />
## MV2DMask.prototype.forEach()

The `forEach()` method calls the `callbackFn` function for each element
of the 2-dimensional mask array. It has the same functionality as
calling the code below, but it's slightly faster.

```js
for ( let i = 0; i < mvmask.height; i++ )
    for ( let j = 0; j < mvmask.height; j++ )
        callbackFn(mvmask[i][j], i, j, mvmask);
```

### Syntax
```js
forEach(callbackFn(element, i, j, array))
forEach(callbackFn(element, i, j, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each element of the 2-dimensional mask array.
The function's parameters are `element` (the current element being
tested), `i` (the vertical index it corresponds to in the
2-dimensional mask array), `j` (the horizontal index it correspons to
in the 2-dimensional mask array), and `array` (the 2-dimensional mask
array itself).

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`undefined`.

### Examples
```js
const mv2dmask = new MV2DMask(3, 2);
mv2dmask.forEach((_,i,j,arr) => arr[i][j] = ((i+j) & 1));
print(mv2dmask);
// [
//  [false,true,false],
//  [true,false,true]
// ]
```

<hr />
## MV2DMask.prototype.not()

The `not()` method inverts all the elements of a 2-dimensional mask
array from an `start` index to an `end` index.

### Syntax
```js
not()
not(start)
not(start, end)
```

### Parameters
`start` (optional) is the `[horizontal, vertical]` index where the
filling starts.
If this value is omitted, `begin` is `[0,0]`.

`end` (optional) is the end `[horizontal, vertical]` index where the
filling starts.
If this value is omitted, `end` is `[width,height]`.

**Note**: the `start` and `end` parameters can contain negative values.
In that case, the values wrap around from the last index.

### Return value
The modified 2-dimensional mask array.

### Examples
```js
const mv2dmask = new MV2DMask(3, 2);
print(mv2dmask);
// [
//  [true,true,true],
//  [true,true,true]
// ]
print(mv2dmask.not());
// [
//  [false,false,false],
//  [false,false,false]
// ]
print(mv2dmask.not([2,0]));
// [
//  [false,false,true],
//  [false,false,true]
// ]
print(mv2dmask.not([0,1], [3,2]));
// [
//  [false,false,true],
//  [true,true,false]
// ]
```

<hr />
## MV2DMask.prototype.and()

The `and` method performs an `AND` binary operator with the `mv2dmask` argument.

### Syntax
```js
and(mv2dmask)
```

### Parameters
`mv2dmask` is the source 2-dimensional mask array for the binary operation.

### Return value
The modified 2-dimensional mask array.

### Examples
```js
const mv2dmaskx = new MV2DMask(3, 2);
mv2dmaskx.forEach((_,i,j,arr) => arr[i][j] = ((i+j) & 1));
const mv2dmask = new MV2DMask(3, 2);
print(mv2dmask);
// [
//  [true,true,true],
//  [true,true,true]
// ]
print(mv2dmaskx);
// [
//  [false,true,false],
//  [true,false,true]
// ]
print(mv2dmask.and(mv2dmaskx));
// [
//  [false,true,false],
//  [true,false,true]
// ]
```

<hr />
## MV2DMask.prototype.or()

The `or` method performs an `OR` binary operator with the `mv2dmask` argument.

### Syntax
```js
or(mv2dmask)
```

### Parameters
`mv2dmask` is the 2-dimensional source mask array for the binary operation.

### Return value
The modified 2-dimensional mask array.

### Examples
```js
const mv2dmaskx = new MV2DMask(3, 2);
mv2dmaskx.forEach((_,i,j,arr) => arr[i][j] = ((i+j) & 1));
const mv2dmask = new MV2DMask(3, 2);
print(mv2dmask.fill(false));
// [
//  [false,false,false],
//  [false,false,false]
// ]
print(mv2dmaskx);
// [
//  [false,true,false],
//  [true,false,true]
// ]
print(mv2dmask.or(mv2dmaskx));
// [
//  [false,true,false],
//  [true,false,true]
// ]
```

<hr />
## MV2DMask.prototype.xor()

The `xor` method performs an `XOR` binary operator with the `mv2dmask` argument.

### Syntax
```js
xor(mv2dmask)
```

### Parameters
`mv2dmask` is the 2-dimensional source mask array for the binary operation.

### Return value
The modified 2-dimensional mask array.

### Examples
```js
const mv2dmaskx = new MV2DMask(3, 2);
mv2dmaskx.forEach((_,i,j,arr) => arr[i][j] = ((i+j) & 1));
const mv2dmask = new MV2DMask(3, 2);
print(mv2dmask);
// [
//  [true,true,true],
//  [true,true,true]
// ]
print(mv2dmaskx);
// [
//  [false,true,false],
//  [true,false,true]
// ]
print(mv2dmask.xor(mv2dmaskx));
// [
//  [true,false,true],
//  [false,true,false]
// ]
print(mv2dmask.xor(mv2dmaskx));
// [
//  [true,true,true],
//  [true,true,true]
// ]
print(mv2dmask.xor(mv2dmask));
// [
//  [false,false,false],
//  [false,false,false]
// ]
```
