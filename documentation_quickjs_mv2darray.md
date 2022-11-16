---
layout: page
title: MV2DArray, MV2DPtr, and MV2DMask
permalink: /docs/quickjs/mv2darray
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
The new object.

### Examples
```js
const mv2darr = new MV2DArray(3, 2);
print(mv2darr);
// [
//  [[0,0],[0,0],[0,0]],
//  [[0,0],[0,0],[0,0]]
// ]
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
The new object.

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
The new object.

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

====================================

<hr />
## MV2DArray.prototype.fill()

The `fill()` method fills all the motion vectors of an array from an
`start` index to an `end` index with a static `value`.

### Syntax
```js
fill(value)
fill(value, start)
fill(value, start, end)
```

### Parameters
`value` to fill the array with.

`start` (optional) is the index where the filling starts.
If this value is omitted, `start` is `0`.

`end` (optional) is the index where the filling ends.
If this value is omitted, `end` is `length`.

**Note**: the `start` and `end` parameters can contain negative values.
In that case, the values wrap around from the last index.

### Return value
The modified array.

### Examples
```js
const mv2darr = new MV2DArray(6);
print(mv2darr);                       // [0,0],[0,0],[0,0],[0,0],[0,0],[0,0]
print(mv2darr.fill(MV(1,1)));         // [1,1],[1,1],[1,1],[1,1],[1,1],[1,1]
print(mv2darr.fill(MV(2,2), 4));      // [1,1],[1,1],[1,1],[1,1],[2,2],[2,2]
print(mv2darr.fill(MV(3,3), 2, 4));   // [1,1],[1,1],[3,3],[3,3],[2,2],[2,2]
print(mv2darr.fill(MV(4,4), -4, -2)); // [1,1],[1,1],[4,4],[4,4],[2,2],[2,2]
print(mv2darr.fill(MV(5,5), -4, 4));  // [1,1],[1,1],[5,5],[5,5],[2,2],[2,2]
```

<!-- ## MV2DArray.prototype.reverse() -->
<!-- ## MV2DArray.prototype.sort() -->

<hr />
## MV2DArray.prototype.slice()

The `slice()` method returns a new `MV2DArray` object with a copy of the
data specified in the (optional) `start` and `end` range arguments.
If no range is specified, the entire array is copied, effectively
performing a `deep copy` of the current object.

### Syntax
```js
slice()
slice(start)
slice(start, end)
```

### Parameters
`start` (optional) is the index where the copying starts.
If this value is omitted, `start` is `0`.

`end` (optional) is the index where the copying ends.
If this value is omitted, `end` is `length`.

**Note**: the `start` and `end` parameters can contain negative values.
In that case, the values wrap around from the last index.

### Return value
The new object.

### Examples
```js
const mv2darr = new MV2DArray(6);
for ( let i = 0; i < 6; i++ ) mv2darr[i] = MV(i,i);
const mv2dptr = new MV2DPtr(mv2darr);
const mvslc = mv2darr.slice();
print(mv2darr instanceof MV2DArray);    // true
print(mv2dptr instanceof MV2DPtr);      // true
print(mvslc instanceof MV2DArray);    // true
print(mvslc instanceof MV2DPtr);      // false
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mv2dptr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvslc);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
mvslc.fill(MV(1,1));
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mv2dptr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvslc);                       // [1,1],[1,1],[1,1],[1,1],[1,1],[1,1]
print(mv2darr.slice(2));              // [2,2],[3,3],[4,4],[5,5]
print(mv2darr.slice(-4));             // [2,2],[3,3],[4,4],[5,5]
print(mv2darr.slice(2, 4));           // [2,2],[3,3]
print(mv2darr.slice(2, -2));          // [2,2],[3,3]
print(mv2darr.slice(-4, -2));         // [2,2],[3,3]
print(mv2darr.slice(-4, 4));          // [2,2],[3,3]
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
The new object.

### Examples
```js
const mv2darr = new MV2DArray(6);
for ( let i = 0; i < 6; i++ ) mv2darr[i] = MV(i,i);
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
const mvdup = mv2darr.dup();
print(mvdup);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
mv2darr[1] = MV(-1,-1);
mvdup[1] = MV(-2,-2);
print(mv2darr);                       // [0,0],[-1,-1],[2,2],[3,3],[4,4],[5,5]
print(mvdup);                       // [0,0],[-2,-2],[2,2],[3,3],[4,4],[5,5]
```

<hr />
## MV2DArray.prototype.every()

The `every()` method tests whether **every** motion vector in the array
passes the test implemented by the `callbackFn` function.
If any motion vector **does not** pass the test, the method returns
early with `false`.

### Syntax
```js
every(callbackFn(mv, index, array))
every(callbackFn(mv, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `index` (the index it corresponds to in the
array), and `array` (the array itself).
The function should return either `true` or `false`.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`true` or `false`.

### Examples
```js
const mv2darr = new MV2DArray(6);
for ( let i = 0; i < 6; i++ ) mv2darr[i] = MV(i,i);
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mv2darr.every((mv) => mv[0] >= 0)); // true
print(mv2darr.every((mv) => mv[0] > 0)); // false
function is_monotonic(mv, i, arr) {
    if ( i > 0 )
        return mv[0] > arr[i-1][0] && mv[1] > arr[i-1][1];
    return true;
}
print(mv2darr.every(is_monotonic));   // true
mv2darr[3] = MV(-1,-1);
print(mv2darr);                       // [0,0],[1,1],[2,2],[-1,-1],[4,4],[5,5]
print(mv2darr.every(is_monotonic));   // false
```

<hr />
## MV2DArray.prototype.some()

The `some()` method tests whether **at least one** motion vector in the
array passes the test implemented by the `callbackFn` function.
If any motion vector **does** pass the test, the method returns early
with `true`.

### Syntax
```js
some(callbackFn(mv, index, array))
some(callbackFn(mv, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `index` (the index it corresponds to in the
array), and `array` (the array itself).
The function should return either `true` or `false`.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`true` or `false`.

### Examples
```js
const mv2darr = new MV2DArray(6);
for ( let i = 0; i < 6; i++ ) mv2darr[i] = MV(i,i);
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mv2darr.some((mv) => mv[0] <= 0)); // true
print(mv2darr.some((mv) => mv[0] < 0)); // false
```

<hr />
## MV2DArray.prototype.forEach()

The `forEach()` method calls the `callbackFn` function for each motion
vector of the array. It has the same functionality as calling the code
below, but it's slightly faster.
Note that you **can** modify `mv` directly, since it is passed as an
`MVRef`.

```js
for ( let i = 0; i < arr.length; i++ )
    callbackFn(arr[i], i, arr);
```

### Syntax
```js
forEach(callbackFn(mv, index, array))
forEach(callbackFn(mv, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `index` (the index it corresponds to in the
array), and `array` (the array itself).

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`undefined`.

### Examples
```js
const mv2darr = new MV2DArray(6);
for ( let i = 0; i < 6; i++ ) mv2darr[i] = MV(i,i);
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
mv2darr.forEach((mv, i, arr) => mv = MV(4,4));
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
// Note that the previous call to `forEach()` did not modify the array
// since the local variable mv was replaced instead of changed.
mv2darr.forEach((mv, i, arr) => mv.assign(MV(i+2,i+2)));
print(mv2darr);                       // [2,2],[3,3],[4,4],[5,5],[6,6],[7,7]
function is_four_four(mv, i, arr) {
    let not_str = (mv.compare_neq(4,4)) ? "not " : "";
    print(`mv [${i}] is ${mv}, which is ${not_str}[four,four]`);
}
mv2darr.forEach(is_four_four);
mv [0] is [2,2], which is not [four,four]
mv [1] is [3,3], which is not [four,four]
mv [2] is [4,4], which is [four,four]
mv [3] is [5,5], which is not [four,four]
mv [4] is [6,6], which is not [four,four]
mv [5] is [7,7], which is not [four,four]
```

<hr />
## MV2DArray.prototype.maskedForEach()

The `maskedForEach()` method calls the `callbackFn` function for each
motion vector of the array that is selected by the `mv2dmask` argument.
It has the same functionality as calling the code below, but it's
slightly faster.
Note that you **can** modify `mv` directly, since it is passed as an
`MVRef`.

```js
for ( let i = 0; i < arr.length; i++ )
    if ( mv2dmask[i] )
        callbackFn(arr[i], i, arr);
```

### Syntax
```js
maskedForEach(mv2dmask, callbackFn(mv, index, array))
maskedForEach(mv2dmask, callbackFn(mv, index, array), thisArg)
```

### Parameters
`mv2dmask` is an `MV2DMask` that specifies on which motion vectors the
`callbackFn` function should be called on.

`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the array that is selected by the
`mv2dmask` argument.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `index` (the index it corresponds to in the
array), and `array` (the array itself).

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`undefined`.

### Examples
```js
const mv2darr = new MV2DArray(6);
for ( let i = 0; i < 6; i++ ) mv2darr[i] = MV(i,i);
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
const mv2dmask = new MV2DMask(6);
for ( let i = 0; i < 6; i++ ) mv2dmask[i] = (i&1);
print(mv2dmask);                      // false,true,false,true,false,true
mv2darr.maskedForEach(mv2dmask, (mv) => mv.clear());
print(mv2darr);                       // [0,0],[0,0],[2,2],[0,0],[4,4],[0,0]
```

<hr />
## MV2DArray.prototype.map()

The `map()` method creates a new `MV2DArray` and calls the `callbackFn`
on each motion vector of the source array, storing the result in the
corresponding motion vector in the new array.

### Syntax
```js
map(callbackFn(mv, index, array))
map(callbackFn(mv, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `index` (the index it corresponds to in the
array), and `array` (the array itself).
The function should return a motion vector value to be stored in the
new array.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
The new array.

### Examples
```js
const mv2darr = new MV2DArray(6);
for ( let i = 0; i < 6; i++ ) mv2darr[i] = MV(i,i);
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
const mvmap = mv2darr.map((mv) => MV(mv[0]*mv[0],mv[1]*mv[1]));
print(mvmap instanceof MV2DArray);    // true
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvmap);                       // [0,0],[1,1],[4,4],[9,9],[16,16],[25,25]
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
motion vector with the largest squared magnitude in the array.

### Syntax
```js
largest_sq()
```

### Return value
`[ index, mv.magnitude_sq() ]` of the largest motion vector.

### Examples
```js
const mv2darr = new MV2DArray(4);
for ( let i = 0; i < 4; i++ ) mv2darr[i] = MV(i+2,i+2);
print(mv2darr);                       // [2,2],[3,3],[4,4],[5,5]
print(mv2darr.largest_sq());          // 3,50
// array element 3 ([5,5]) has a squared magnitude of 5*5+5*5 = 50.
```

<hr />
## MV2DArray.prototype.smallest_sq()

The `smallest_sq()` method returns an `[ index, mv.magnitude_sq() ]`
array with the index and the value of the squared magnitude of the
motion vector with the smallest squared magnitude in the array.

### Syntax
```js
smallest_sq()
```

### Return value
`[ index, mv.magnitude_sq() ]` of the smallest motion vector.

### Examples
```js
const mv2darr = new MV2DArray(4);
for ( let i = 0; i < 4; i++ ) mv2darr[i] = MV(i+2,i+2);
print(mv2darr);                       // [2,2],[3,3],[4,4],[5,5]
print(mv2darr.smallest_sq());         // 0,8
// array element 0 ([2,2]) has a squared magnitude of 2*2+2*2 = 8.
```

<hr />
## MV2DArray.prototype.swap_hv()

The `swap_hv()` method swaps the horizontal and vertical elements of
all the motion vectors in the array **in-place**.

### Syntax
```js
swap_hv()
```

### Return value
The modified array.

### Examples
```js
const mv2darr = new MV2DArray(4);
for ( let i = 0; i < 4; i++ ) mv2darr[i] = MV(i,-i);
print(mv2darr);                       // [0,0],[1,-1],[2,-2],[3,-3]
print(mv2darr.swap_hv());             // [0,0],[-1,1],[-2,2],[-3,3]
print(mv2darr);                       // [0,0],[-1,1],[-2,2],[-3,3]
```

<hr />
## MV2DArray.prototype.clear()

The `clear()` method zeroes the horizontal and vertical elements of all
of the motion vectors in the array **in-place**.

### Syntax
```js
clear()
```

### Return value
The modified motion vector.

### Examples
```js
const mv2darr = new MV2DArray(4);
for ( let i = 0; i < 4; i++ ) mv2darr[i] = MV(i,-i);
print(mv2darr);                       // [0,0],[1,-1],[2,-2],[3,-3]
print(mv2darr.clear());               // [0,0],[0,0],[0,0],[0,0]
print(mv2darr);                       // [0,0],[0,0],[0,0],[0,0]
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

The source of motion vectors should be either an `MV2DArray` (of the same
length as the array), `null` (only for the `assign` operation), an
`MV` constant, an `MV` object, or an `MVRef` object, or a motion vector
specified in terms of its horizontal and vertical components.

The `mv2dmask` argument is optional, and it must be of type `MV2DMask`. If
a mask is supplied, the operation is only applied to the motion vectors
selected by the mask.

The operations do exactly what the names mean. `add()` will add the
argument to the motion vector array, `sub()` will subtract, `mul()`
will multiply, `div()` will divide (rounding to nearest), and
`assign()` will assign (just copy).

If the motion vector source is a single motion vector, that motion
vector will be applied to the entire array. If the motion vector source
is an `MV2DArray`, each element in the `MV2DArray` will be applied to the
corresponding element of the array.

There are also similar methods that operate only on the horizontal or
vertical elements of the motion vector array. These methods have either
`_h` (horizontal) or `_v` (vertical) appended to the names.
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
mathOp(null)
mathOp(mv)
mathOp(horizontal, vertical)
mathOp(mv2darray, mv2dmask)
mathOp(null, mv2dmask)
mathOp(mv, mv2dmask)
mathOp(horizontal, vertical, mv2dmask)
mathOp_h(mv2darray)
mathOp_h(mv)
mathOp_h(horizontal, vertical)
mathOp_h(horizontal)
mathOp_h(mv2darray, mv2dmask)
mathOp_h(mv, mv2dmask)
mathOp_h(horizontal, vertical, mv2dmask)
mathOp_h(horizontal, mv2dmask)
mathOp_v(mv2darray)
mathOp_v(mv)
mathOp_v(horizontal, vertical)
mathOp_v(vertical)
mathOp_v(mv2darray, mv2dmask)
mathOp_v(mv, mv2dmask)
mathOp_v(horizontal, vertical, mv2dmask)
mathOp_v(vertical, mv2dmask)
```

### Parameters
`mv2darray` (optional) is an `MV2DArray` object.

`mv` (optional) must be either an `MV` constant, an `MV` object, or an `MVRef` object.

`horizontal` (optional) is the horizontal component of the motion vector.

`vertical` (optional) is the vertical component of the motion vector.

`mv2dmask` (optional) is an `MV2DMask` that specifies on which motion
vectors of the array the operation should be carried out on.

### Return value
The modified motion vector.

### Examples
```js
const mv12 = MV(1,2);
const mv2darr = new MV2DArray(4);
for ( let i = 0; i < 4; i++ ) mv2darr[i] = MV(i,i);
const mv2darr2 = mv2darr.dup().reverse();
const mv2dmask = new MV2DMask(4);
for ( let i = 0; i < 4; i++ ) mv2dmask[i] = (i&1);
print(mv2darr2);                      // [3,3],[2,2],[1,1],[0,0]
print(mv2dmask);                      // false,true,false,true
// good luck keeping track of the value of the motion vectors!
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3]
print("add");                       // add
print(mv2darr.add(mv2darr2));           // [3,3],[3,3],[3,3],[3,3]
print(mv2darr.add(mv12));             // [4,5],[4,5],[4,5],[4,5]
print(mv2darr.add(2, 1));             // [6,6],[6,6],[6,6],[6,6]
print(mv2darr.add(mv2darr2, mv2dmask));   // [6,6],[8,8],[6,6],[6,6]
print(mv2darr.add(mv12, mv2dmask));     // [6,6],[9,10],[6,6],[7,8]
print(mv2darr.add(2, 1, mv2dmask));     // [6,6],[11,11],[6,6],[9,9]
print(mv2darr.add_h(mv2darr2));         // [9,6],[13,11],[7,6],[9,9]
print(mv2darr.add_h(mv12));           // [10,6],[14,11],[8,6],[10,9]
print(mv2darr.add_h(2, 1));           // [12,6],[16,11],[10,6],[12,9]
print(mv2darr.add_h(2));              // [14,6],[18,11],[12,6],[14,9]
print(mv2darr.add_h(mv2darr2, mv2dmask)); // [14,6],[20,11],[12,6],[14,9]
print(mv2darr.add_h(mv12, mv2dmask));   // [14,6],[21,11],[12,6],[15,9]
print(mv2darr.add_h(2, 1, mv2dmask));   // [14,6],[23,11],[12,6],[17,9]
print(mv2darr.add_h(2, mv2dmask));      // [14,6],[25,11],[12,6],[19,9]
print(mv2darr.add_v(mv2darr2));         // [14,9],[25,13],[12,7],[19,9]
print(mv2darr.add_v(mv12));           // [14,11],[25,15],[12,9],[19,11]
print(mv2darr.add_v(2, 1));           // [14,12],[25,16],[12,10],[19,12]
print(mv2darr.add_v(2));              // [14,14],[25,18],[12,12],[19,14]
print(mv2darr.add_v(mv2darr2, mv2dmask)); // [14,14],[25,20],[12,12],[19,14]
print(mv2darr.add_v(mv12, mv2dmask));   // [14,14],[25,22],[12,12],[19,16]
print(mv2darr.add_v(2, 1, mv2dmask));   // [14,14],[25,23],[12,12],[19,17]
print(mv2darr.add_v(2, mv2dmask));      // [14,14],[25,25],[12,12],[19,19]
print("sub");                       // sub
print(mv2darr.sub(mv2darr2));           // [11,11],[23,23],[11,11],[19,19]
print(mv2darr.sub(mv12));             // [10,9],[22,21],[10,9],[18,17]
print(mv2darr.sub(2, 1));             // [8,8],[20,20],[8,8],[16,16]
print(mv2darr.sub(mv2darr2, mv2dmask));   // [8,8],[18,18],[8,8],[16,16]
print(mv2darr.sub(mv12, mv2dmask));     // [8,8],[17,16],[8,8],[15,14]
print(mv2darr.sub(2, 1, mv2dmask));     // [8,8],[15,15],[8,8],[13,13]
print(mv2darr.sub_h(mv2darr2));         // [5,8],[13,15],[7,8],[13,13]
print(mv2darr.sub_h(mv12));           // [4,8],[12,15],[6,8],[12,13]
print(mv2darr.sub_h(2, 1));           // [2,8],[10,15],[4,8],[10,13]
print(mv2darr.sub_h(2));              // [0,8],[8,15],[2,8],[8,13]
print(mv2darr.sub_h(mv2darr2, mv2dmask)); // [0,8],[6,15],[2,8],[8,13]
print(mv2darr.sub_h(mv12, mv2dmask));   // [0,8],[5,15],[2,8],[7,13]
print(mv2darr.sub_h(2, 1, mv2dmask));   // [0,8],[3,15],[2,8],[5,13]
print(mv2darr.sub_h(2, mv2dmask));      // [0,8],[1,15],[2,8],[3,13]
print(mv2darr.sub_v(mv2darr2));         // [0,5],[1,13],[2,7],[3,13]
print(mv2darr.sub_v(mv12));           // [0,3],[1,11],[2,5],[3,11]
print(mv2darr.sub_v(2, 1));           // [0,2],[1,10],[2,4],[3,10]
print(mv2darr.sub_v(2));              // [0,0],[1,8],[2,2],[3,8]
print(mv2darr.sub_v(mv2darr2, mv2dmask)); // [0,0],[1,6],[2,2],[3,8]
print(mv2darr.sub_v(mv12, mv2dmask));   // [0,0],[1,4],[2,2],[3,6]
print(mv2darr.sub_v(2, 1, mv2dmask));   // [0,0],[1,3],[2,2],[3,5]
print(mv2darr.sub_v(2, mv2dmask));      // [0,0],[1,1],[2,2],[3,3]
print("mul");                       // mul
print(mv2darr.mul(mv2darr2));           // [0,0],[2,2],[2,2],[0,0]
print(mv2darr.mul(mv12));             // [0,0],[2,4],[2,4],[0,0]
print(mv2darr.mul(2, 1));             // [0,0],[4,4],[4,4],[0,0]
print(mv2darr.mul(mv2darr2, mv2dmask));   // [0,0],[8,8],[4,4],[0,0]
print(mv2darr.mul(mv12, mv2dmask));     // [0,0],[8,16],[4,4],[0,0]
print(mv2darr.mul(2, 1, mv2dmask));     // [0,0],[16,16],[4,4],[0,0]
print(mv2darr.mul_h(mv2darr2));         // [0,0],[32,16],[4,4],[0,0]
print(mv2darr.mul_h(mv12));           // [0,0],[32,16],[4,4],[0,0]
print(mv2darr.mul_h(2, 1));           // [0,0],[64,16],[8,4],[0,0]
print(mv2darr.mul_h(2));              // [0,0],[128,16],[16,4],[0,0]
print(mv2darr.mul_h(mv2darr2, mv2dmask)); // [0,0],[256,16],[16,4],[0,0]
print(mv2darr.mul_h(mv12, mv2dmask));   // [0,0],[256,16],[16,4],[0,0]
print(mv2darr.mul_h(2, 1, mv2dmask));   // [0,0],[512,16],[16,4],[0,0]
print(mv2darr.mul_h(2, mv2dmask));      // [0,0],[1024,16],[16,4],[0,0]
print(mv2darr.mul_v(mv2darr2));         // [0,0],[1024,32],[16,4],[0,0]
print(mv2darr.mul_v(mv12));           // [0,0],[1024,64],[16,8],[0,0]
print(mv2darr.mul_v(2, 1));           // [0,0],[1024,64],[16,8],[0,0]
print(mv2darr.mul_v(2));              // [0,0],[1024,128],[16,16],[0,0]
print(mv2darr.mul_v(mv2darr2, mv2dmask)); // [0,0],[1024,256],[16,16],[0,0]
print(mv2darr.mul_v(mv12, mv2dmask));   // [0,0],[1024,512],[16,16],[0,0]
print(mv2darr.mul_v(2, 1, mv2dmask));   // [0,0],[1024,512],[16,16],[0,0]
print(mv2darr.mul_v(2, mv2dmask));      // [0,0],[1024,1024],[16,16],[0,0]
print("div");                       // div
print(mv2darr.div(mv2darr2));           // [0,0],[512,512],[16,16],[0,0]
print(mv2darr.div(mv12));             // [0,0],[512,256],[16,8],[0,0]
print(mv2darr.div(2, 1));             // [0,0],[256,256],[8,8],[0,0]
print(mv2darr.div(mv2darr2, mv2dmask));   // [0,0],[128,128],[8,8],[0,0]
print(mv2darr.div(mv12, mv2dmask));     // [0,0],[128,64],[8,8],[0,0]
print(mv2darr.div(2, 1, mv2dmask));     // [0,0],[64,64],[8,8],[0,0]
print(mv2darr.div_h(mv2darr2));         // [0,0],[32,64],[8,8],[0,0]
print(mv2darr.div_h(mv12));           // [0,0],[32,64],[8,8],[0,0]
print(mv2darr.div_h(2, 1));           // [0,0],[16,64],[4,8],[0,0]
print(mv2darr.div_h(2));              // [0,0],[8,64],[2,8],[0,0]
print(mv2darr.div_h(mv2darr2, mv2dmask)); // [0,0],[4,64],[2,8],[0,0]
print(mv2darr.div_h(mv12, mv2dmask));   // [0,0],[4,64],[2,8],[0,0]
print(mv2darr.div_h(2, 1, mv2dmask));   // [0,0],[2,64],[2,8],[0,0]
print(mv2darr.div_h(2, mv2dmask));      // [0,0],[1,64],[2,8],[0,0]
print(mv2darr.div_v(mv2darr2));         // [0,0],[1,32],[2,8],[0,0]
print(mv2darr.div_v(mv12));           // [0,0],[1,16],[2,4],[0,0]
print(mv2darr.div_v(2, 1));           // [0,0],[1,16],[2,4],[0,0]
print(mv2darr.div_v(2));              // [0,0],[1,8],[2,2],[0,0]
print(mv2darr.div_v(mv2darr2, mv2dmask)); // [0,0],[1,4],[2,2],[0,0]
print(mv2darr.div_v(mv12, mv2dmask));   // [0,0],[1,2],[2,2],[0,0]
print(mv2darr.div_v(2, 1, mv2dmask));   // [0,0],[1,2],[2,2],[0,0]
print(mv2darr.div_v(2, mv2dmask));      // [0,0],[1,1],[2,2],[0,0]
print("assign");                    // assign
print(mv2darr.assign(mv2darr2));        // [3,3],[2,2],[1,1],[0,0]
print(mv2darr.assign(mv12));          // [1,2],[1,2],[1,2],[1,2]
print(mv2darr.assign(2, 1));          // [2,1],[2,1],[2,1],[2,1]
print(mv2darr.assign(mv2darr2, mv2dmask));// [2,1],[2,2],[2,1],[0,0]
print(mv2darr.assign(mv12, mv2dmask));  // [2,1],[1,2],[2,1],[1,2]
print(mv2darr.assign(3, 4, mv2dmask));  // [2,1],[3,4],[2,1],[3,4]
print(mv2darr.assign_h(5));           // [5,1],[5,4],[5,1],[5,4]
print(mv2darr.assign_h(6, mv2dmask));   // [5,1],[6,4],[5,1],[6,4]
print(mv2darr.assign_h(7, 8, mv2dmask));// [5,1],[7,4],[5,1],[7,4]
print(mv2darr.assign_v(5));           // [5,5],[7,5],[5,5],[7,5]
print(mv2darr.assign_v(6, mv2dmask));   // [5,5],[7,6],[5,5],[7,6]
print(mv2darr.assign_v(0, 9, mv2dmask));// [5,5],[7,9],[5,5],[7,9]
// the null argument is only allowed when assigning
print(mv2darr.assign(null, mv2dmask));  // [5,5],null,[5,5],null
print(mv2darr.assign(null));          // null,null,null,null
```

<hr />
## MV2DArray.prototype.compare()

The `compare()` returns an `MV2DMask` with the result from running the
provided `compareFn()` function on all elements of the array.

### Syntax
```js
compare(compareFn(mv, index, array))
compare(compareFn(mv, index, array), thisArg)
```

### Parameters
`compareFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the array.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `index` (the index it corresponds to in the
array), and `array` (the array itself).
The function should return either `true` or `false`.

`thisArg` (optional) is a value to use as `this` when executing
`compareFn`.

### Return value
`true` or `false`.

### Examples
```js
const mv2darr = new MV2DArray(6);
for ( let i = 0; i < 6; i++ ) mv2darr[i] = MV(i,i);
print(mv2darr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
function is_even(mv, i, arr) {
    return !(mv[0] & 1) && !(mv[1] & 1);
}
const mv2dmask = mv2darr.compare(is_even);
print(mv2dmask instanceof MV2DMask);    // true
print(mv2dmask);                      // true,false,true,false,true,false
```

<hr />
## MV.prototype.compareOp()

There is no real `compareOp()` method in the `MV` prototype.
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

The arguments passed to the methods above should be either an `MV2DArray`
(of the same length as the array), `null` (only for the `compare_eq()`
and `compare_neq()` methods), specified as an `MV` constant, an `MV`
object, or an `MVRef` object, a motion vector specified in terms of
its horizontal and vertical components, or a single integer, which will
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
compareOp(mv)
compareOp(magnitude_sq)
compareOp(horizontal, vertical)
compareOp_h(horizontal)
compareOp_v(vertical)
```

### Parameters
`mv2darray` (optional) is an `MV2DArray` object.

`mv` (optional) must be either an `MV` constant, an `MV` object, or an `MVRef` object.

`magnitude_sq` (optional) is the squared magnitude to compare against.

`horizontal` (optional) is the horizontal component of the motion vector.

`vertical` (optional) is the vertical component of the motion vector.

### Return value
An `MV2DMask` filled with the results from each comparison.

### Examples
```js
let mv2darray = new MV2DArray(7);
for ( let i = 0; i < 6; i++ ) mv2darray[i] = MV(i,i%3);
mv2darray[6] = null;
let mv2darr2 = new MV2DArray(7);
for ( let i = 0; i < 7; i++ ) mv2darr2[i] = MV(i,i%2);
mv11 = new MV(1,1);
let mg_sq = 8;
print(mv11);                        // [1,1]
print(mv2darray);                     // [0,0],[1,1],[2,2],[3,0],[4,1],[5,2],null
print(mv2darr2);                      // [0,0],[1,1],[2,0],[3,1],[4,0],[5,1],[6,0]
print("compare_eq");                // compare_eq
print(mv2darray.compare_eq(mv2darr2));  // true,true,false,false,false,false,false
print(mv2darray.compare_eq(mv11));    // false,true,false,false,false,false,false
print(mv2darray.compare_eq(0,0));     // true,false,false,false,false,false,false
print(mv2darray.compare_eq(mg_sq));   // false,false,true,false,false,false,false
print(mv2darray.compare_eq(null));    // false,false,false,false,false,false,true
print(mv2darray.compare_eq_h(1));     // false,true,false,false,false,false,false
print(mv2darray.compare_eq_h(2));     // false,false,true,false,false,false,false
print(mv2darray.compare_eq_v(1));     // false,true,false,false,true,false,false
print(mv2darray.compare_eq_v(2));     // false,false,true,false,false,true,false
print("compare_neq");               // compare_neq
print(mv2darray.compare_neq(mv2darr2)); // false,false,true,true,true,true,true
print(mv2darray.compare_neq(mv11));   // true,false,true,true,true,true,true
print(mv2darray.compare_neq(0,0));    // false,true,true,true,true,true,true
print(mv2darray.compare_neq(mg_sq));  // true,true,false,true,true,true,true
print(mv2darray.compare_neq(null));   // true,true,true,true,true,true,false
print(mv2darray.compare_neq_h(1));    // true,false,true,true,true,true,true
print(mv2darray.compare_neq_h(2));    // true,true,false,true,true,true,true
print(mv2darray.compare_neq_v(1));    // true,false,true,true,false,true,true
print(mv2darray.compare_neq_v(2));    // true,true,false,true,true,false,true
print("compare_gt");                // compare_gt
print(mv2darray.compare_gt(mv2darr2));  // false,false,true,false,true,true,false
print(mv2darray.compare_gt(mv11));    // false,false,true,true,true,true,false
print(mv2darray.compare_gt(0,0));     // false,true,true,true,true,true,false
print(mv2darray.compare_gt(mg_sq));   // false,false,false,true,true,true,false
print(mv2darray.compare_gt_h(1));     // false,false,true,true,true,true,false
print(mv2darray.compare_gt_h(2));     // false,false,false,true,true,true,false
print(mv2darray.compare_gt_v(1));     // false,false,true,false,false,true,false
print(mv2darray.compare_gt_v(2));     // false,false,false,false,false,false,false
print("compare_gte");               // compare_gte
print(mv2darray.compare_gte(mv2darr2)); // true,true,true,false,true,true,false
print(mv2darray.compare_gte(mv11));   // false,true,true,true,true,true,false
print(mv2darray.compare_gte(0,0));    // true,true,true,true,true,true,false
print(mv2darray.compare_gte(mg_sq));  // false,false,true,true,true,true,false
print(mv2darray.compare_gte_h(1));    // false,true,true,true,true,true,false
print(mv2darray.compare_gte_h(2));    // false,false,true,true,true,true,false
print(mv2darray.compare_gte_v(1));    // false,true,true,false,true,true,false
print(mv2darray.compare_gte_v(2));    // false,false,true,false,false,true,false
print("compare_lt");                // compare_lt
print(mv2darray.compare_lt(mv2darr2));  // false,false,false,true,false,false,false
print(mv2darray.compare_lt(mv11));    // true,false,false,false,false,false,false
print(mv2darray.compare_lt(0,0));     // false,false,false,false,false,false,false
print(mv2darray.compare_lt(mg_sq));   // true,true,false,false,false,false,false
print(mv2darray.compare_lt_h(1));     // true,false,false,false,false,false,false
print(mv2darray.compare_lt_h(2));     // true,true,false,false,false,false,false
print(mv2darray.compare_lt_v(1));     // true,false,false,true,false,false,false
print(mv2darray.compare_lt_v(2));     // true,true,false,true,true,false,false
print("compare_lte");               // compare_lte
print(mv2darray.compare_lte(mv2darr2)); // true,true,false,true,false,false,false
print(mv2darray.compare_lte(mv11));   // true,true,false,false,false,false,false
print(mv2darray.compare_lte(0,0));    // true,false,false,false,false,false,false
print(mv2darray.compare_lte(mg_sq));  // true,true,true,false,false,false,false
print(mv2darray.compare_lte_h(1));    // true,true,false,false,false,false,false
print(mv2darray.compare_lte_h(2));    // true,true,true,false,false,false,false
print(mv2darray.compare_lte_v(1));    // true,true,false,true,true,false,false
print(mv2darray.compare_lte_v(2));    // true,true,true,true,true,true,false
```

<hr />
## MV2DMask.prototype.fill()

The `fill()` method fills all the elements of a mask array from an
`start` index to an `end` index with the boolean `value`.

### Syntax
```js
fill(value)
fill(value, start)
fill(value, start, end)
```

### Parameters
`value` boolean to fill the mask array with.

`start` (optional) is the index where the filling starts.
If this value is omitted, `start` is `0`.

`end` (optional) is the index where the filling ends.
If this value is omitted, `end` is `length`.

**Note**: the `start` and `end` parameters can contain negative values.
In that case, the values wrap around from the last index.

### Return value
The modified mask array.

### Examples
```js
const mv2dmask = new MV2DMask(8);
print(mv2dmask);                      // true,true,true,true,true,true,true,true
print(mv2dmask.fill(false));          // false,false,false,false,false,false,false,false
print(mv2dmask.fill(true, 4));        // false,false,false,false,true,true,true,true
print(mv2dmask.fill(true, 2, 3));     // false,false,true,false,true,true,true,true
print(mv2dmask.fill(false, -4, -2));  // false,false,true,false,false,false,true,true
print(mv2dmask.fill(false, -4, 5));   // false,false,true,false,false,false,true,true
```

<hr />
## MV2DMask.prototype.not()

The `not()` method inverts all the elements of a mask array from an
`start` index to an `end` index.

### Syntax
```js
not()
not(start)
not(start, end)
```

### Parameters
`start` (optional) is the index where the filling starts.
If this value is omitted, `start` is `0`.

`end` (optional) is the index where the filling ends.
If this value is omitted, `end` is `length`.

**Note**: the `start` and `end` parameters can contain negative values.
In that case, the values wrap around from the last index.

### Return value
The modified mask array.

### Examples
```js
const mv2dmask = new MV2DMask(8);
print(mv2dmask);                      // true,true,true,true,true,true,true,true
print(mv2dmask.not());                // false,false,false,false,false,false,false,false
print(mv2dmask.not(4));               // false,false,false,false,true,true,true,true
print(mv2dmask.not(2, 3));            // false,false,true,false,true,true,true,true
print(mv2dmask.not(-4, -2));          // false,false,true,false,false,false,true,true
print(mv2dmask.not(-4, 5));           // false,false,true,false,true,false,true,true
```

<hr />
## MV2DMask.prototype.and()

The `and` method performs an `AND` binary operator with the `mv2dmask` argument.

### Syntax
```js
and(mv2dmask)
```

### Parameters
`mv2dmask` is the source mask array for the binary operation.

### Return value
The modified mask array.

### Examples
```js
const mv2dmaskx = new MV2DMask(8);
for ( let i = 0; i < 8; i++ ) mv2dmaskx[i] = (i & 1) ? true : false;
const mv2dmask = new MV2DMask(8);
print(mv2dmask);                      // true,true,true,true,true,true,true,true
print(mv2dmaskx);                     // false,true,false,true,false,true,false,true
print(mv2dmask.and(mv2dmaskx));         // false,true,false,true,false,true,false,true
```

<hr />
## MV2DMask.prototype.or()

The `or` method performs an `OR` binary operator with the `mv2dmask` argument.

### Syntax
```js
or(mv2dmask)
```

### Parameters
`mv2dmask` is the source mask array for the binary operation.

### Return value
The modified mask array.

### Examples
```js
const mv2dmaskx = new MV2DMask(8);
for ( let i = 0; i < 8; i++ ) mv2dmaskx[i] = (i & 1) ? true : false;
const mv2dmask = new MV2DMask(8);
print(mv2dmask.fill(false));          // false,false,false,false,false,false,false,false
print(mv2dmaskx);                     // false,true,false,true,false,true,false,true
print(mv2dmask.or(mv2dmaskx));          // false,true,false,true,false,true,false,true
```

<hr />
## MV2DMask.prototype.xor()

The `xor` method performs an `XOR` binary operator with the `mv2dmask` argument.

### Syntax
```js
xor(mv2dmask)
```

### Parameters
`mv2dmask` is the source mask array for the binary operation.

### Return value
The modified mask array.

### Examples
```js
const mv2dmaskx = new MV2DMask(8);
for ( let i = 0; i < 8; i++ ) mv2dmaskx[i] = (i & 1) ? true : false;
const mv2dmask = new MV2DMask(8);
print(mv2dmask);                      // true,true,true,true,true,true,true,true
print(mv2dmaskx);                     // false,true,false,true,false,true,false,true
print(mv2dmask.xor(mv2dmaskx));         // true,false,true,false,true,false,true,false
print(mv2dmask.xor(mv2dmaskx));         // true,true,true,true,true,true,true,true
print(mv2dmask.xor(mv2dmask));          // false,false,false,false,false,false,false,false
```


















THIS IS FOR MV2DARRAY

<hr />
## MV2DMask.prototype.fill()

The `fill()` method fills all the elements of an array from a
`[start_h, start_v]` index to an `[end_h, end_v]` index with the
boolean `value`.

### Syntax
```js
fill(value)
fill(value, [start_h, start_v])
fill(value, [start_h, start_v], [end_h, end_v])
```

### Parameters
`value` to fill the array with.

`[start_h, start_v]` (optional) are the `horizontal` and `vertical`
indexes where the filling starts.
If this value is omitted, `[start_h, start_v]` is `[0,0]`.

`[end_h, end_v]` (optional) are the `horizontal` and `vertical`
indexes where the filling ends.
If this value is omitted, `[end_h, end_v]` is `[length,length]`.

**Note**: the `start_h`, `start_v`, `end_h`, and `end_v` parameters can
contain negative values.
In that case, the values wrap around from the last index.
