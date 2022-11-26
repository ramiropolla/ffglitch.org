---
layout: page
title: MVArray, MVPtr, and MVMask
---

# MVArray, MVPtr, and MVMask

`MVArray` is based on `FFArray`, but it stores
`[ horizontal, vertical ]` motion vectors instead of simple integers.
`MVArray` provides optimized functions which can greatly speed up
processing large chunks of motion vectors.

`MVArray` is `fixed length`, which means that once it is created, it
**cannot** be made larger or smaller.

`MVArray` is a `dense array` (in contrast to a `sparse array`), which
means there are no holes in the array.
If any motion vector is not available (i.e.: it wasn't available in the
input file to start with) it will be represented as a `null`, but it
will be an `MV(null)`, so all the methods from `MV` can be used.
All motion vectors from `0` to `length-1` can be read/written.

`MVPtr` is very similar to `MVArray`, and shares all the same methods.
The main difference is that `MVPtr` does not have any memory allocated
for its data. Instead, it points to data from `MVArray`.

Be careful not to play around with `MVPtr`s once the object they were
created from has run out of its scope. You will write into unallocated
memory and the program will segfault.

`MVMask` is an array of `boolean`s that can be used with certain
methods from `MVArray`/`MVPtr`. This allows for very efficient code
which does not need to check for conditions inside loops every time.
The conditions are tested once to create the `MVMask`, and then the
mask is applied on subsequent calls.

<hr />
## MVArray Constructor

The constructor is used to create a new `MVArray` object of length
`length`. All motion vectors are initialized to `[0,0]`.

### Syntax
```js
new MVArray(length)
```

### Parameters
`length` must be a non-zero positive number that specifies the length
of the array to be created.

### Return value
The new `MVArray` object.

### Examples
```js
const mvarr = new MVArray(6);
print(mvarr);                       // [0,0],[0,0],[0,0],[0,0],[0,0],[0,0]
```

<hr />
## MVPtr Constructor

The constructor is used to create a new `MVPtr` object from either an
`MVArray` object or another `MVPtr` object. The new object will have
the same length as the `source` object.

### Syntax
```js
new MVPtr(source)
```

### Parameters
`source` must be either an `MVArray` or an `MVPtr` object.

### Return value
The new `MVPtr` object.

### Examples
```js
const mvarr = new MVArray(6);
print(mvarr);                       // [0,0],[0,0],[0,0],[0,0],[0,0],[0,0]
print(mvarr instanceof MVArray);    // true
print(mvarr instanceof MVPtr);      // false
const mvptr = new MVPtr(mvarr);
print(mvptr instanceof MVArray);    // false
print(mvptr instanceof MVPtr);      // true
mvptr[1] = MV(1,1);
print(mvarr);                       // [0,0],[1,1],[0,0],[0,0],[0,0],[0,0]
print(mvptr);                       // [0,0],[1,1],[0,0],[0,0],[0,0],[0,0]
```

## MVMask Constructor

The constructor is used to create a new `MVMask` object of length
`length`. All motion vectors are initialized to `true`.

### Syntax
```js
new MVMask(length)
```

### Parameters
`length` must be a non-zero positive number that specifies the length
of the mask array to be created.

### Return value
The new `MVMask` object.

### Examples
```js
const mvmask = new MVMask(6);
print(mvmask);                      // true,true,true,true,true,true
for ( let i = 0; i < 6; i++ ) mvmask[i] = (i&1);
print(mvmask);                      // false,true,false,true,false,true
```

<hr />
## MVArray.prototype.toString()

The `toString()` method returns a string representing the specified
array and its motion vectors.

### Syntax
```js
toString()
```

### Return value
The string representation.

### Examples
```js
const mvarr = new MVArray(6);
print(mvarr.toString());            // [0,0],[0,0],[0,0],[0,0],[0,0],[0,0]
```

<hr />
## MVArray.prototype.join()

The `join()` method is kind of like `toString()`, but it allows you to
specify a custom `separator` for each motion vector. This allows you to
make some funny old-school emoticon sequences...

### Syntax
```js
join()
join(separator)
```

### Parameters
`separator` (optional) is a string that will separate each motion
vector. The default separator is a comma (`,`).

### Return value
The string representation.

### Examples
```js
const mvarr = new MVArray(4);
print(mvarr.join(""))       // [0,0][0,0][0,0][0,0]
print(mvarr.join("^ ^"))    // [0,0]^ ^[0,0]^ ^[0,0]^ ^[0,0] (birds)
```

<hr />
## MVArray.prototype.copyWithin()

The `copyWithin()` method copies the chunk of data from the `start` to
the `end` indexes into the chunk starting at the `target` index.
It works kind of like `memmove()` in `C`.

### Syntax
```js
copyWithin(target, start)
copyWithin(target, start, end)
```

### Parameters
`target` is the starting index where data is copied to.

`start` is the starting index where data is copied from.

`end` (optional) is the end index where data is copied from.
If this value is omitted, `end` is `length`.

**Note**: the `target`, `start`, and `end` parameters can be negative values.
In that case, the values wrap around from the last index.

### Return value
The modified motion vector array.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvarr.copyWithin(0, 4));      // [4,4],[5,5],[2,2],[3,3],[4,4],[5,5]
print(mvarr.copyWithin(2, 4, 5));   // [4,4],[5,5],[4,4],[3,3],[4,4],[5,5]
print(mvarr.copyWithin(-2, -4));    // [4,4],[5,5],[4,4],[3,3],[4,4],[3,3]
print(mvarr.copyWithin(0, -2));     // [4,4],[3,3],[4,4],[3,3],[4,4],[3,3]
```

<hr />
## MVArray.prototype.subarray()

The `subarray()` method returns an `MVPtr` that points to a chunk of
data inside the current object, starting from index `begin` and ending
in index `end`.

### Syntax
```js
subarray()
subarray(begin)
subarray(begin, end)
```

### Parameters
`begin` (optional) is the starting index where the new object will
point to.
If this value is omitted, `begin` is `0`.

`end` (optional) is the end index where the new object will point to.
If this value is omitted, `end` is `length`.

**Note**: the `begin` and `end` parameters can be negative values.
In that case, the values wrap around from the last index.

### Return value
The new `MVPtr` object.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
const mvptr = mvarr.subarray();
print(mvptr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvptr instanceof MVArray);    // false
print(mvptr instanceof MVPtr);      // true
print(mvarr.subarray(4));           // [4,4],[5,5]
print(mvarr.subarray(-2));          // [4,4],[5,5]
print(mvarr.subarray(3, -2));       // [3,3]
```

<hr />
## MVArray.prototype.set()

The `set()` method copies data from the `source` array into the current
object, starting at the optional `targetOffset` index. If the current
object is not large enough to copy the entire data from `source`, an
error is thrown.
It works kind of like `memcpy()` in `C`.

### Syntax
```js
set(source)
set(source, targetOffset)
```

### Parameters
`source` is either an `MVArray` or an `MVPtr`.

`targetOffset` (optional) specifies which index to start copying to.
If this value is omitted, `targetOffset` is `0`.

**Note**: the `targetOffset` parameter can be a negative value.
In that case, the value wraps around from the last index.

### Return value
The modified motion vector array.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
const mvarr2 = new MVArray(2);
for ( let i = 0; i < 4; i++ ) mvarr2[i] = MV(-i,-i);
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvarr2);                      // [0,0],[-1,-1]
print(mvarr.set(mvarr2));           // [0,0],[-1,-1],[2,2],[3,3],[4,4],[5,5]
print(mvarr.set(mvarr2, 2));        // [0,0],[-1,-1],[0,0],[-1,-1],[4,4],[5,5]
print(mvarr.set(mvarr2, -1));       // RangeError: out-of-bound access
const mvptr = mvarr.subarray(0, 1);
print(mvptr);                       // [0,0]
print(mvarr.set(mvptr, -1));        // [0,0],[-1,-1],[0,0],[-1,-1],[4,4],[0,0]
```

<hr />
## MVArray.prototype.fill()

The `fill()` method fills all the motion vectors of an array from an
`start` index to an `end` index with a motion vector `mv`.

### Syntax
```js
fill(mv)
fill(mv, start)
fill(mv, start, end)
```

### Parameters
`mv` to fill the array with.

`start` (optional) is the index where the filling starts.
If this value is omitted, `start` is `0`.

`end` (optional) is the index where the filling ends.
If this value is omitted, `end` is `length`.

**Note**: the `start` and `end` parameters can be negative values.
In that case, the values wrap around from the last index.

### Return value
The modified motion vector array.

### Examples
```js
const mvarr = new MVArray(6);
print(mvarr);                       // [0,0],[0,0],[0,0],[0,0],[0,0],[0,0]
print(mvarr.fill(MV(1,1)));         // [1,1],[1,1],[1,1],[1,1],[1,1],[1,1]
print(mvarr.fill(MV(2,2), 4));      // [1,1],[1,1],[1,1],[1,1],[2,2],[2,2]
print(mvarr.fill(MV(3,3), 2, 4));   // [1,1],[1,1],[3,3],[3,3],[2,2],[2,2]
print(mvarr.fill(MV(4,4), -4, -2)); // [1,1],[1,1],[4,4],[4,4],[2,2],[2,2]
print(mvarr.fill(MV(5,5), -4, 4));  // [1,1],[1,1],[5,5],[5,5],[2,2],[2,2]
```

<hr />
## MVArray.prototype.reverse()

The `reverse()` method reverses all motion vectors in the array **in-place**.
This operation applies to the entire array (there are no range arguments).
If you want to reverse just a small chunk of the array, use the
`subarray()` method and call `reverse()` on that.

### Syntax
```js
reverse()
```

### Return value
The modified motion vector array.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvarr.reverse());             // [5,5],[4,4],[3,3],[2,2],[1,1],[0,0]
print(mvarr.subarray(2,4).reverse()); // [2,2],[3,3]
print(mvarr);                       // [5,5],[4,4],[2,2],[3,3],[1,1],[0,0]
```

<hr />
## MVArray.prototype.sort()

The `sort()` method sorts all motion vectors in the array **in-place**.
If the optional `compareFn` argument is not supplied, a numerical
comparison of the **squared magnitude** of the motion vectors is
performed.
This operation applies to the entire array (there are no range arguments).
If you want to sort just a small chunk of the array, use the
`subarray()` method and call `sort()` on that.

### Syntax
```js
sort()
sort(compareFn(a,b))
```

### Parameters
`compareFn` (optional) is a function (`inline`, `arrow`, or normal)
that is called for each pair of motion vectors during the sorting
algorithm.
The function's parameters are `a` and `b` (a pair of motion vectors
from the array).
The function should return a negative number for (`a` > `b`), a
positive number for (`a` < `b`), and zero if (`b` == `a`).

### Return value
The modified motion vector array.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,-i);
print(mvarr);                       // [0,0],[1,-1],[2,-2],[3,-3],[4,-4],[5,-5]
print(mvarr.sort((a,b) => b[0]-a[0])); // [5,-5],[4,-4],[3,-3],[2,-2],[1,-1],[0,0]
print(mvarr.sort((a,b) => b[1]-a[1])); //[0,0],[1,-1],[2,-2],[3,-3],[4,-4],[5,-5]
const mvptr = mvarr.subarray(2, 4);
print(mvptr);                       // [2,-2],[3,-3]
print(mvptr.sort((a,b) => b[1]-a[1])); // [3,-3],[2,-2]
print(mvarr);                       // [0,0],[1,-1],[3,-3],[2,-2],[4,-4],[5,-5]
print(mvarr.sort());                // [0,0],[1,-1],[2,-2],[3,-3],[4,-4],[5,-5]
function compareFn(a, b) {
    return b.magnitude_sq() - a.magnitude_sq();
};
print(mvarr.sort(compareFn));       // [5,-5],[4,-4],[3,-3],[2,-2],[1,-1],[0,0]
```

<hr />
## MVArray.prototype.slice()

The `slice()` method returns a new `MVArray` object with a copy of the
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

**Note**: the `start` and `end` parameters can be negative values.
In that case, the values wrap around from the last index.

### Return value
The new `MVArray` object.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
const mvptr = new MVPtr(mvarr);
const mvslc = mvarr.slice();
print(mvarr instanceof MVArray);    // true
print(mvptr instanceof MVPtr);      // true
print(mvslc instanceof MVArray);    // true
print(mvslc instanceof MVPtr);      // false
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvptr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvslc);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
mvslc.fill(MV(1,1));
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvptr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvslc);                       // [1,1],[1,1],[1,1],[1,1],[1,1],[1,1]
print(mvarr.slice(2));              // [2,2],[3,3],[4,4],[5,5]
print(mvarr.slice(-4));             // [2,2],[3,3],[4,4],[5,5]
print(mvarr.slice(2, 4));           // [2,2],[3,3]
print(mvarr.slice(2, -2));          // [2,2],[3,3]
print(mvarr.slice(-4, -2));         // [2,2],[3,3]
print(mvarr.slice(-4, 4));          // [2,2],[3,3]
```

<hr />
## MVArray.prototype.dup()

The `dup()` method performs a `deep copy` of the current object.
It has the same behaviour as calling `slice()` with no range arguments.

### Syntax
```js
dup()
```

### Return value
The new `MVArray` object.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
const mvdup = mvarr.dup();
print(mvdup);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
mvarr[1] = MV(-1,-1);
mvdup[1] = MV(-2,-2);
print(mvarr);                       // [0,0],[-1,-1],[2,2],[3,3],[4,4],[5,5]
print(mvdup);                       // [0,0],[-2,-2],[2,2],[3,3],[4,4],[5,5]
```

<hr />
## MVArray.prototype.every()

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
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvarr.every((mv) => mv[0] >= 0)); // true
print(mvarr.every((mv) => mv[0] > 0)); // false
function is_monotonic(mv, i, arr) {
    if ( i > 0 )
        return mv[0] > arr[i-1][0] && mv[1] > arr[i-1][1];
    return true;
}
print(mvarr.every(is_monotonic));   // true
mvarr[3] = MV(-1,-1);
print(mvarr);                       // [0,0],[1,1],[2,2],[-1,-1],[4,4],[5,5]
print(mvarr.every(is_monotonic));   // false
```

<hr />
## MVArray.prototype.some()

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
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvarr.some((mv) => mv[0] <= 0)); // true
print(mvarr.some((mv) => mv[0] < 0)); // false
```

<hr />
## MVArray.prototype.forEach()

The `forEach()` method calls the `callbackFn` function for each motion
vector of the array. It has the same functionality as calling the code
below, but it's slightly faster.
Note that you **can** modify `mv` directly, since it is passed as an
`MVRef`.

```js
for ( let i = 0; i < mvarr.length; i++ )
    callbackFn(mvarr[i], i, mvarr);
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
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
mvarr.forEach((mv, i, arr) => mv = MV(4,4));
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
// Note that the previous call to `forEach()` did not modify the array
// since the scoped variable mv was replaced instead of modified.
mvarr.forEach((mv, i, arr) => mv.assign(MV(i+2,i+2)));
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5],[6,6],[7,7]
function is_four_four(mv, i, arr) {
    let not_str = (mv.compare_neq(4,4)) ? "not " : "";
    print(`mv [${i}] is ${mv}, which is ${not_str}[four,four]`);
}
mvarr.forEach(is_four_four);
// mv [0] is [2,2], which is not [four,four]
// mv [1] is [3,3], which is not [four,four]
// mv [2] is [4,4], which is [four,four]
// mv [3] is [5,5], which is not [four,four]
// mv [4] is [6,6], which is not [four,four]
// mv [5] is [7,7], which is not [four,four]
```

<hr />
## MVArray.prototype.maskedForEach()

The `maskedForEach()` method calls the `callbackFn` function for each
motion vector of the array that is selected by the `mvmask` argument.
It has the same functionality as calling the code below, but it's
slightly faster.
Note that you **can** modify `mv` directly, since it is passed as an
`MVRef`.

```js
for ( let i = 0; i < arr.length; i++ )
    if ( mvmask[i] )
        callbackFn(arr[i], i, arr);
```

### Syntax
```js
maskedForEach(mvmask, callbackFn(mv, index, array))
maskedForEach(mvmask, callbackFn(mv, index, array), thisArg)
```

### Parameters
`mvmask` is an `MVMask` that specifies on which motion vectors the
`callbackFn` function should be called on.

`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the array that is selected by the
`mvmask` argument.
The function's parameters are `mv` (an `MVRef` to the current motion
vector being tested), `index` (the index it corresponds to in the
array), and `array` (the array itself).

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`undefined`.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
const mvmask = new MVMask(6);
for ( let i = 0; i < 6; i++ ) mvmask[i] = (i&1);
print(mvmask);                      // false,true,false,true,false,true
mvarr.maskedForEach(mvmask, (mv) => mv.clear());
print(mvarr);                       // [0,0],[0,0],[2,2],[0,0],[4,4],[0,0]
```

<hr />
## MVArray.prototype.map()

The `map()` method creates a new `MVArray` and calls the `callbackFn`
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
The new `MVArray` object.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
const mvmap = mvarr.map((mv) => MV(mv[0]*mv[0],mv[1]*mv[1]));
print(mvmap instanceof MVArray);    // true
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
print(mvmap);                       // [0,0],[1,1],[4,4],[9,9],[16,16],[25,25]
```

<hr />
## MVArray.prototype.find()

The `find()` method returns a value of a motion vector in the array,
if it satisfies the provided `callbackFn` testing function.
Otherwise `undefined` is returned.

### Syntax
```js
find(callbackFn(mv, index, array))
find(callbackFn(mv, index, array), thisArg)
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
A value in the array if a motion vector passes the test; otherwise, `undefined`.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i+2,i+2);
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5],[6,6],[7,7]
print(mvarr.find((mv) => mv.compare_eq(1,1))); // undefined
print(mvarr.find((mv) => mv.compare_eq(4,4))); // [4,4]
```

<hr />
## MVArray.prototype.findIndex()

The `findIndex()` method returns the index of a value of a motion
vector in the array, if it satisfies the provided `callbackFn` testing
function. Otherwise `-1` is returned.

### Syntax
```js
findIndex(callbackFn(mv, index, array))
findIndex(callbackFn(mv, index, array), thisArg)
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
The index of a value in the array if a motion vector passes the test; otherwise, `-1`.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i+2,i+2);
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5],[6,6],[7,7]
print(mvarr.findIndex((mv) => mv.compare_eq(1,1))); // -1
print(mvarr.findIndex((mv) => mv.compare_eq(4,4))); // 2
```

<hr />
## MVArray.prototype.indexOf()

The `indexOf()` method returns the first index at which a given motion
vector `searchMV` can be found in the array (starting from the optional
`fromIndex` argument), or `-1` if it is not present.

### Syntax
```js
indexOf(searchMV)
indexOf(searchMV, fromIndex)
```

### Parameters
`searchMV` is the motion vector to search for in the array.

`fromIndex` (optional) specifies which index to start the search from.
If this value is omitted, `fromIndex` is `0`.

**Note**: the `fromIndex` parameter can be a negative value.
In that case, the value wraps around from the last index.

### Return value
The first index of the motion vector in the array; `-1` if not found.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i+2,i+2);
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5],[6,6],[7,7]
print(mvarr.indexOf(MV(1,1)));      // -1
print(mvarr.indexOf(MV(4,4)));      // 2
print(mvarr.indexOf(MV(4,4), 1));   // 2
print(mvarr.indexOf(MV(4,4), 2));   // 2
print(mvarr.indexOf(MV(4,4), 3));   // -1
print(mvarr.fill(MV(4,4)));         // [4,4],[4,4],[4,4],[4,4],[4,4],[4,4]
print(mvarr.indexOf(MV(4,4)));      // 0
```

<hr />
## MVArray.prototype.lastIndexOf()

The `lastIndexOf()` method returns the last index at which a given
motion vector `searchMV` can be found in the array (starting from the
optional `fromIndex` argument), or `-1` if it is not present.

### Syntax
```js
lastIndexOf(searchMV)
lastIndexOf(searchMV, fromIndex)
```

### Parameters
`searchMV` is the motion vector to search for in the array.

`fromIndex` (optional) specifies which index to start the search from.
If this value is omitted, `fromIndex` is `0`.

**Note**: the `fromIndex` parameter can be a negative value.
In that case, the value wraps around from the last index.

### Return value
The last index of the motion vector in the array; `-1` if not found.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i+2,i+2);
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5],[6,6],[7,7]
print(mvarr.lastIndexOf(MV(1,1)));  // -1
print(mvarr.lastIndexOf(MV(4,4)));  // 2
print(mvarr.lastIndexOf(MV(4,4), 1)); // -1
print(mvarr.lastIndexOf(MV(4,4), 2)); // 2
print(mvarr.lastIndexOf(MV(4,4), 3)); // 2
print(mvarr.fill(MV(4,4)));         // [4,4],[4,4],[4,4],[4,4],[4,4],[4,4]
print(mvarr.lastIndexOf(MV(4,4)));  // 5
```

<hr />
## MVArray.prototype.includes()

The `includes()` method determines whether an array includes a certain
motion vector `searchMV` (starting from the optional `fromIndex`
argument), returning `true` or `false` as appropriate.

### Syntax
```js
includes(searchMV)
includes(searchMV, fromIndex)
```

### Parameters
`searchMV` is the motion vector to search for in the array.

`fromIndex` (optional) specifies which index to start the search from.
If this value is omitted, `fromIndex` is `0`.

**Note**: the `fromIndex` parameter can be a negative value.
In that case, the value wraps around from the last index.

### Return value
`true` or `false`.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i+2,i+2);
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5],[6,6],[7,7]
print(mvarr.includes(MV(1,1)));     // false
print(mvarr.includes(MV(2,2)));     // true
```

<hr />
## MVArray.prototype.reduce()

The `reduce()` method, much like `forEach()`, calls the `callbackFn`
function for each motion vector of the array. The difference here is an
extra argument `accumulator` being passed to `callbackFn`, which is
actually just the return value from the previous call to the function.

### Syntax
```js
reduce(callbackFn(accumulator, mv, index, array))
reduce(callbackFn(accumulator, mv, index, array), initialValue)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the array.
The function's parameters are `accumulator` (the return value from the
previous call to the function), `mv` (the current motion vector being
tested), `index` (the index it corresponds to in the array), and
`array` (the array itself).
The function should return an updated `accumulator`.

`initialValue` (optional) is the value to be passed to the first call
to `callbackFn`.
If this value is omitted, `initialValue` is the first motion vector
from the array, and `callbackFn` starts being called from the second
motion vector of the array.

### Return value
The `accumulator`.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i/2,i/2);
print(mvarr);                       // [0,0],[0,0],[1,1],[1,1],[2,2],[2,2]
let mvsum = mvarr.reduce((acc, mv) => acc.add(mv));
print(mvsum);                       // [6,6] (sum of all motion vectors)
// find extreme values (accumulator is [ smallest, largest ], where
// smallest and largest are arrays with [ index, new MV() ]).
function find_extremes(acc, mv, i) {
    // first iteration, return initial value
    if ( acc === null )
        return [ [ new MV(mv), i ], [ new MV(mv), i ] ];
    // subsequente iterations, update accumulator with largest and
    // smallest values
    if ( mv.magnitude_sq() < acc[0][0].magnitude_sq() )
        acc[0] = [ new MV(mv), i ];
    if ( mv.magnitude_sq() > acc[1][0].magnitude_sq() )
        acc[1] = [ new MV(mv), i ];
    return acc;
}
// note the use of initialValue being set to null!
e = mvarr.reduce(find_extremes, null);
print(`the smallest motion vector '${e[0][0]}' is at index ${e[0][1]}`);
// the smallest motion vector '[0,0]' is at index 0
print(`the largest motion vector '${e[1][0]}' is at index ${e[1][1]}`);
// the largest motion vector '[2,2]' is at index 4
```

<hr />
## MVArray.prototype.reduceRight()

The `reduceRight()` method does the same thing as the `reduce()`
method, but it runs through the array from right-to-left instead
of left-to-right.

The `reduceRight()` method, much like `forEach()`, calls the
`callbackFn` function for each motion vector of the array (starting
with the last motion vector). The difference here is an extra argument
`accumulator` being passed to `callbackFn`, which is actually just the
return value from the previous call to the function.

### Syntax
```js
reduceRight(callbackFn(accumulator, mv, index, array))
reduceRight(callbackFn(accumulator, mv, index, array), initialValue)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each motion vector of the array, starting from the last
motion vector and going down to the first motion vector.
The function's parameters are `accumulator` (the return value from the
previous call to the function), `mv` (the current motion vector being
tested), `index` (the index it corresponds to in the array), and
`array` (the array itself).
The function should return an updated `accumulator`.

`initialValue` (optional) is the value to be passed to the first call
to `callbackFn`.
If this value is omitted, `initialValue` is the last motion vector from
the array, and `callbackFn` starts being called from the penultimate
motion vector of the array.

### Return value
The `accumulator`.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i/2,i/2);
print(mvarr);                       // [0,0],[0,0],[1,1],[1,1],[2,2],[2,2]
let mvsum = mvarr.reduceRight((acc, mv) => acc.add(mv));
print(mvsum);                       // [6,6] (sum of all motion vectors)
// find extreme values (accumulator is [ smallest, largest ], where
// smallest and largest are arrays with [ new MV(), index ]).
function find_extremes(acc, mv, i) {
    // first iteration, return initial value
    if ( acc === null )
        return [ [ new MV(mv), i ], [ new MV(mv), i ] ];
    // subsequente iterations, update accumulator with largest and
    // smallest values
    if ( mv.magnitude_sq() < acc[0][0].magnitude_sq() )
        acc[0] = [ new MV(mv), i ];
    if ( mv.magnitude_sq() > acc[1][0].magnitude_sq() )
        acc[1] = [ new MV(mv), i ];
    return acc;
}
// note the use of initialValue being set to null!
e = mvarr.reduceRight(find_extremes, null);
print(`the smallest motion vector '${e[0][0]}' is at index ${e[0][1]}`);
// the smallest motion vector '[0,0]' is at index 1
print(`the largest motion vector '${e[1][0]}' is at index ${e[1][1]}`);
// the largest motion vector '[2,2]' is at index 5
// Note that the smallest and largest indexes are 1 and 5 instead of
// 0 and 4 like it was with reduce(), because of the order the array
// is scanned.
```

<hr />
## MVArray.prototype.values()

The `values()` method returns an `array iterator` object that contains
the values for each index in the array.

### Syntax
```js
values()
```

### Return value
The new `array iterator`.

### Examples
```js
const mvarr = new MVArray(4);
for ( let i = 0; i < 4; i++ ) mvarr[i] = MV(i+2,i+2);
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5]
for ( const mv of mvarr.values() ) print(mv);
// [2,2]
// [3,3]
// [4,4]
// [5,5]
```

<hr />
## MVArray.prototype.keys()

The `keys()` method returns an `array iterator` object that contains
the keys for each index in the array.

### Syntax
```js
keys()
```

### Return value
The new `array iterator`.

### Examples
```js
const mvarr = new MVArray(4);
for ( let i = 0; i < 4; i++ ) mvarr[i] = MV(i+2,i+2);
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5]
for ( const key of mvarr.keys() ) print(key);
// 0
// 1
// 2
// 3
```

<hr />
## MVArray.prototype.entries()

The `entries()` method returns an `array iterator` object that contains
the key/value pairs for each index in the array.

### Syntax
```js
entries()
```

### Return value
The new `array iterator`.

### Examples
```js
const mvarr = new MVArray(4);
for ( let i = 0; i < 4; i++ ) mvarr[i] = MV(i+2,i+2);
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5]
for ( const entry of mvarr.entries() ) print(entry);
// 0,[2,2]
// 1,[3,3]
// 2,[4,4]
// 3,[5,5]
```

<hr />
## MVArray.prototype.largest_sq()

The `largest_sq()` method returns an `[ index, mv.magnitude_sq() ]`
array with the index and the value of the squared magnitude of the
motion vector with the largest squared magnitude in the array.

### Syntax
```js
largest_sq()
```

### Return value
An `[ index, mv.magnitude_sq() ]` array of the largest motion vector.

### Examples
```js
const mvarr = new MVArray(4);
for ( let i = 0; i < 4; i++ ) mvarr[i] = MV(i+2,i+2);
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5]
print(mvarr.largest_sq());          // 3,50
// array element 3 ([5,5]) has a squared magnitude of 5*5+5*5 = 50.
```

<hr />
## MVArray.prototype.smallest_sq()

The `smallest_sq()` method returns an `[ index, mv.magnitude_sq() ]`
array with the index and the value of the squared magnitude of the
motion vector with the smallest squared magnitude in the array.

### Syntax
```js
smallest_sq()
```

### Return value
An `[ index, mv.magnitude_sq() ]` array of the smallest motion vector.

### Examples
```js
const mvarr = new MVArray(4);
for ( let i = 0; i < 4; i++ ) mvarr[i] = MV(i+2,i+2);
print(mvarr);                       // [2,2],[3,3],[4,4],[5,5]
print(mvarr.smallest_sq());         // 0,8
// array element 0 ([2,2]) has a squared magnitude of 2*2+2*2 = 8.
```

<hr />
## MVArray.prototype.swap_hv()

The `swap_hv()` method swaps the horizontal and vertical elements of
all the motion vectors in the array **in-place**.
If you want to swap just a small chunk of the array, use the
`subarray()` method and call `swap_hv()` on that.

### Syntax
```js
swap_hv()
```

### Return value
The modified motion vector array.

### Examples
```js
const mvarr = new MVArray(4);
for ( let i = 0; i < 4; i++ ) mvarr[i] = MV(i,-i);
print(mvarr);                       // [0,0],[1,-1],[2,-2],[3,-3]
print(mvarr.swap_hv());             // [0,0],[-1,1],[-2,2],[-3,3]
print(mvarr);                       // [0,0],[-1,1],[-2,2],[-3,3]
```

<hr />
## MVArray.prototype.clear()

The `clear()` method zeroes the horizontal and vertical elements of all
of the motion vectors in the array **in-place**.
If you want to clear just a small chunk of the array, use the
`subarray()` method and call `clear()` on that.

### Syntax
```js
clear()
```

### Return value
The modified motion vector array.

### Examples
```js
const mvarr = new MVArray(4);
for ( let i = 0; i < 4; i++ ) mvarr[i] = MV(i,-i);
print(mvarr);                       // [0,0],[1,-1],[2,-2],[3,-3]
print(mvarr.clear());               // [0,0],[0,0],[0,0],[0,0]
print(mvarr);                       // [0,0],[0,0],[0,0],[0,0]
```

<hr />
## MVArray.prototype.mathOp()

There is no real `mathOp()` method in the `MVArray` prototype.
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

The source of motion vectors should be either an `MVArray` (of the same
length as the array), `null` (only for the `assign` operation), an
`MV` constant, an `MV` object, or an `MVRef` object, or a motion vector
specified in terms of its horizontal and vertical components.

The `mask` argument is optional, and it must be of type `MVMask`. It
must have the same length as the array. If a mask is supplied, the
operation is only applied to the motion vectors selected by the mask.

The operations do exactly what the names mean. `add()` will add the
argument to the motion vector array, `sub()` will subtract, `mul()`
will multiply, `div()` will divide (rounding to nearest integer), and
`assign()` will assign (just copy).

If the motion vector source is a single motion vector, that motion
vector will be applied to the entire array. If the motion vector source
is an `MVArray`, each element in the `MVArray` will be applied to the
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
mathOp(mvarray)
mathOp(null)
mathOp(mv)
mathOp(horizontal, vertical)
mathOp(mvarray, mask)
mathOp(null, mask)
mathOp(mv, mask)
mathOp(horizontal, vertical, mask)
mathOp_h(mvarray)
mathOp_h(mv)
mathOp_h(horizontal, vertical)
mathOp_h(horizontal)
mathOp_h(mvarray, mask)
mathOp_h(mv, mask)
mathOp_h(horizontal, vertical, mask)
mathOp_h(horizontal, mask)
mathOp_v(mvarray)
mathOp_v(mv)
mathOp_v(horizontal, vertical)
mathOp_v(vertical)
mathOp_v(mvarray, mask)
mathOp_v(mv, mask)
mathOp_v(horizontal, vertical, mask)
mathOp_v(vertical, mask)
```

### Parameters
`mvarray` (optional) is an `MVArray` object.

`mv` (optional) must be either an `MV` constant, an `MV` object, or an `MVRef` object.

`horizontal` (optional) is the horizontal component of the motion vector.

`vertical` (optional) is the vertical component of the motion vector.

`mask` (optional) is an `MVMask` that specifies on which motion vectors
of the array the operation should be carried out on.

### Return value
The modified motion vector array.

### Examples
```js
const mv12 = MV(1,2);
const mvarr = new MVArray(4);
for ( let i = 0; i < 4; i++ ) mvarr[i] = MV(i,i);
const mvarr2 = mvarr.dup().reverse();
const mvmask = new MVMask(4);
for ( let i = 0; i < 4; i++ ) mvmask[i] = (i&1);
print(mvarr2);                      // [3,3],[2,2],[1,1],[0,0]
print(mvmask);                      // false,true,false,true
// good luck keeping track of the value of the motion vectors!
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3]
print("add");                       // add
print(mvarr.add(mvarr2));           // [3,3],[3,3],[3,3],[3,3]
print(mvarr.add(mv12));             // [4,5],[4,5],[4,5],[4,5]
print(mvarr.add(2, 1));             // [6,6],[6,6],[6,6],[6,6]
print(mvarr.add(mvarr2, mvmask));   // [6,6],[8,8],[6,6],[6,6]
print(mvarr.add(mv12, mvmask));     // [6,6],[9,10],[6,6],[7,8]
print(mvarr.add(2, 1, mvmask));     // [6,6],[11,11],[6,6],[9,9]
print(mvarr.add_h(mvarr2));         // [9,6],[13,11],[7,6],[9,9]
print(mvarr.add_h(mv12));           // [10,6],[14,11],[8,6],[10,9]
print(mvarr.add_h(2, 1));           // [12,6],[16,11],[10,6],[12,9]
print(mvarr.add_h(2));              // [14,6],[18,11],[12,6],[14,9]
print(mvarr.add_h(mvarr2, mvmask)); // [14,6],[20,11],[12,6],[14,9]
print(mvarr.add_h(mv12, mvmask));   // [14,6],[21,11],[12,6],[15,9]
print(mvarr.add_h(2, 1, mvmask));   // [14,6],[23,11],[12,6],[17,9]
print(mvarr.add_h(2, mvmask));      // [14,6],[25,11],[12,6],[19,9]
print(mvarr.add_v(mvarr2));         // [14,9],[25,13],[12,7],[19,9]
print(mvarr.add_v(mv12));           // [14,11],[25,15],[12,9],[19,11]
print(mvarr.add_v(2, 1));           // [14,12],[25,16],[12,10],[19,12]
print(mvarr.add_v(2));              // [14,14],[25,18],[12,12],[19,14]
print(mvarr.add_v(mvarr2, mvmask)); // [14,14],[25,20],[12,12],[19,14]
print(mvarr.add_v(mv12, mvmask));   // [14,14],[25,22],[12,12],[19,16]
print(mvarr.add_v(2, 1, mvmask));   // [14,14],[25,23],[12,12],[19,17]
print(mvarr.add_v(2, mvmask));      // [14,14],[25,25],[12,12],[19,19]
print("sub");                       // sub
print(mvarr.sub(mvarr2));           // [11,11],[23,23],[11,11],[19,19]
print(mvarr.sub(mv12));             // [10,9],[22,21],[10,9],[18,17]
print(mvarr.sub(2, 1));             // [8,8],[20,20],[8,8],[16,16]
print(mvarr.sub(mvarr2, mvmask));   // [8,8],[18,18],[8,8],[16,16]
print(mvarr.sub(mv12, mvmask));     // [8,8],[17,16],[8,8],[15,14]
print(mvarr.sub(2, 1, mvmask));     // [8,8],[15,15],[8,8],[13,13]
print(mvarr.sub_h(mvarr2));         // [5,8],[13,15],[7,8],[13,13]
print(mvarr.sub_h(mv12));           // [4,8],[12,15],[6,8],[12,13]
print(mvarr.sub_h(2, 1));           // [2,8],[10,15],[4,8],[10,13]
print(mvarr.sub_h(2));              // [0,8],[8,15],[2,8],[8,13]
print(mvarr.sub_h(mvarr2, mvmask)); // [0,8],[6,15],[2,8],[8,13]
print(mvarr.sub_h(mv12, mvmask));   // [0,8],[5,15],[2,8],[7,13]
print(mvarr.sub_h(2, 1, mvmask));   // [0,8],[3,15],[2,8],[5,13]
print(mvarr.sub_h(2, mvmask));      // [0,8],[1,15],[2,8],[3,13]
print(mvarr.sub_v(mvarr2));         // [0,5],[1,13],[2,7],[3,13]
print(mvarr.sub_v(mv12));           // [0,3],[1,11],[2,5],[3,11]
print(mvarr.sub_v(2, 1));           // [0,2],[1,10],[2,4],[3,10]
print(mvarr.sub_v(2));              // [0,0],[1,8],[2,2],[3,8]
print(mvarr.sub_v(mvarr2, mvmask)); // [0,0],[1,6],[2,2],[3,8]
print(mvarr.sub_v(mv12, mvmask));   // [0,0],[1,4],[2,2],[3,6]
print(mvarr.sub_v(2, 1, mvmask));   // [0,0],[1,3],[2,2],[3,5]
print(mvarr.sub_v(2, mvmask));      // [0,0],[1,1],[2,2],[3,3]
print("mul");                       // mul
print(mvarr.mul(mvarr2));           // [0,0],[2,2],[2,2],[0,0]
print(mvarr.mul(mv12));             // [0,0],[2,4],[2,4],[0,0]
print(mvarr.mul(2, 1));             // [0,0],[4,4],[4,4],[0,0]
print(mvarr.mul(mvarr2, mvmask));   // [0,0],[8,8],[4,4],[0,0]
print(mvarr.mul(mv12, mvmask));     // [0,0],[8,16],[4,4],[0,0]
print(mvarr.mul(2, 1, mvmask));     // [0,0],[16,16],[4,4],[0,0]
print(mvarr.mul_h(mvarr2));         // [0,0],[32,16],[4,4],[0,0]
print(mvarr.mul_h(mv12));           // [0,0],[32,16],[4,4],[0,0]
print(mvarr.mul_h(2, 1));           // [0,0],[64,16],[8,4],[0,0]
print(mvarr.mul_h(2));              // [0,0],[128,16],[16,4],[0,0]
print(mvarr.mul_h(mvarr2, mvmask)); // [0,0],[256,16],[16,4],[0,0]
print(mvarr.mul_h(mv12, mvmask));   // [0,0],[256,16],[16,4],[0,0]
print(mvarr.mul_h(2, 1, mvmask));   // [0,0],[512,16],[16,4],[0,0]
print(mvarr.mul_h(2, mvmask));      // [0,0],[1024,16],[16,4],[0,0]
print(mvarr.mul_v(mvarr2));         // [0,0],[1024,32],[16,4],[0,0]
print(mvarr.mul_v(mv12));           // [0,0],[1024,64],[16,8],[0,0]
print(mvarr.mul_v(2, 1));           // [0,0],[1024,64],[16,8],[0,0]
print(mvarr.mul_v(2));              // [0,0],[1024,128],[16,16],[0,0]
print(mvarr.mul_v(mvarr2, mvmask)); // [0,0],[1024,256],[16,16],[0,0]
print(mvarr.mul_v(mv12, mvmask));   // [0,0],[1024,512],[16,16],[0,0]
print(mvarr.mul_v(2, 1, mvmask));   // [0,0],[1024,512],[16,16],[0,0]
print(mvarr.mul_v(2, mvmask));      // [0,0],[1024,1024],[16,16],[0,0]
print("div");                       // div
print(mvarr.div(mvarr2));           // [0,0],[512,512],[16,16],[0,0]
print(mvarr.div(mv12));             // [0,0],[512,256],[16,8],[0,0]
print(mvarr.div(2, 1));             // [0,0],[256,256],[8,8],[0,0]
print(mvarr.div(mvarr2, mvmask));   // [0,0],[128,128],[8,8],[0,0]
print(mvarr.div(mv12, mvmask));     // [0,0],[128,64],[8,8],[0,0]
print(mvarr.div(2, 1, mvmask));     // [0,0],[64,64],[8,8],[0,0]
print(mvarr.div_h(mvarr2));         // [0,0],[32,64],[8,8],[0,0]
print(mvarr.div_h(mv12));           // [0,0],[32,64],[8,8],[0,0]
print(mvarr.div_h(2, 1));           // [0,0],[16,64],[4,8],[0,0]
print(mvarr.div_h(2));              // [0,0],[8,64],[2,8],[0,0]
print(mvarr.div_h(mvarr2, mvmask)); // [0,0],[4,64],[2,8],[0,0]
print(mvarr.div_h(mv12, mvmask));   // [0,0],[4,64],[2,8],[0,0]
print(mvarr.div_h(2, 1, mvmask));   // [0,0],[2,64],[2,8],[0,0]
print(mvarr.div_h(2, mvmask));      // [0,0],[1,64],[2,8],[0,0]
print(mvarr.div_v(mvarr2));         // [0,0],[1,32],[2,8],[0,0]
print(mvarr.div_v(mv12));           // [0,0],[1,16],[2,4],[0,0]
print(mvarr.div_v(2, 1));           // [0,0],[1,16],[2,4],[0,0]
print(mvarr.div_v(2));              // [0,0],[1,8],[2,2],[0,0]
print(mvarr.div_v(mvarr2, mvmask)); // [0,0],[1,4],[2,2],[0,0]
print(mvarr.div_v(mv12, mvmask));   // [0,0],[1,2],[2,2],[0,0]
print(mvarr.div_v(2, 1, mvmask));   // [0,0],[1,2],[2,2],[0,0]
print(mvarr.div_v(2, mvmask));      // [0,0],[1,1],[2,2],[0,0]
print("assign");                    // assign
print(mvarr.assign(mvarr2));        // [3,3],[2,2],[1,1],[0,0]
print(mvarr.assign(mv12));          // [1,2],[1,2],[1,2],[1,2]
print(mvarr.assign(2, 1));          // [2,1],[2,1],[2,1],[2,1]
print(mvarr.assign(mvarr2, mvmask));// [2,1],[2,2],[2,1],[0,0]
print(mvarr.assign(mv12, mvmask));  // [2,1],[1,2],[2,1],[1,2]
print(mvarr.assign(3, 4, mvmask));  // [2,1],[3,4],[2,1],[3,4]
print(mvarr.assign_h(5));           // [5,1],[5,4],[5,1],[5,4]
print(mvarr.assign_h(6, mvmask));   // [5,1],[6,4],[5,1],[6,4]
print(mvarr.assign_h(7, 8, mvmask));// [5,1],[7,4],[5,1],[7,4]
print(mvarr.assign_v(5));           // [5,5],[7,5],[5,5],[7,5]
print(mvarr.assign_v(6, mvmask));   // [5,5],[7,6],[5,5],[7,6]
print(mvarr.assign_v(0, 9, mvmask));// [5,5],[7,9],[5,5],[7,9]
// the null argument is only allowed when assigning
print(mvarr.assign(null, mvmask));  // [5,5],null,[5,5],null
print(mvarr.assign(null));          // null,null,null,null
```

<hr />
## MVArray.prototype.compare()

The `compare()` returns an `MVMask` with the result from running the
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
An `MVMask` filled with the results from each comparison.

### Examples
```js
const mvarr = new MVArray(6);
for ( let i = 0; i < 6; i++ ) mvarr[i] = MV(i,i);
print(mvarr);                       // [0,0],[1,1],[2,2],[3,3],[4,4],[5,5]
function is_even(mv, i, arr) {
    return !(mv[0] & 1) && !(mv[1] & 1);
}
const mvmask = mvarr.compare(is_even);
print(mvmask instanceof MVMask);    // true
print(mvmask);                      // true,false,true,false,true,false
```

<hr />
## MVArray.prototype.compareOp()

There is no real `compareOp()` method in the `MVArray` prototype.
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

The arguments passed to the methods above should be either an `MVArray`
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
compareOp(mvarray)
compareOp(mv)
compareOp(magnitude_sq)
compareOp(horizontal, vertical)
compareOp_h(horizontal)
compareOp_v(vertical)
```

### Parameters
`mvarray` (optional) is an `MVArray` object.

`mv` (optional) must be either an `MV` constant, an `MV` object, or an `MVRef` object.

`magnitude_sq` (optional) is the squared magnitude to compare against.

`horizontal` (optional) is the horizontal component of the motion vector.

`vertical` (optional) is the vertical component of the motion vector.

### Return value
An `MVMask` filled with the results from each comparison.

### Examples
```js
let mvarray = new MVArray(7);
for ( let i = 0; i < 6; i++ ) mvarray[i] = MV(i,i%3);
mvarray[6] = null;
let mvarr2 = new MVArray(7);
for ( let i = 0; i < 7; i++ ) mvarr2[i] = MV(i,i%2);
mv11 = new MV(1,1);
let mg_sq = 8;
print(mv11);                        // [1,1]
print(mvarray);                     // [0,0],[1,1],[2,2],[3,0],[4,1],[5,2],null
print(mvarr2);                      // [0,0],[1,1],[2,0],[3,1],[4,0],[5,1],[6,0]
print("compare_eq");                // compare_eq
print(mvarray.compare_eq(mvarr2));  // true,true,false,false,false,false,false
print(mvarray.compare_eq(mv11));    // false,true,false,false,false,false,false
print(mvarray.compare_eq(0,0));     // true,false,false,false,false,false,false
print(mvarray.compare_eq(mg_sq));   // false,false,true,false,false,false,false
print(mvarray.compare_eq(null));    // false,false,false,false,false,false,true
print(mvarray.compare_eq_h(1));     // false,true,false,false,false,false,false
print(mvarray.compare_eq_h(2));     // false,false,true,false,false,false,false
print(mvarray.compare_eq_v(1));     // false,true,false,false,true,false,false
print(mvarray.compare_eq_v(2));     // false,false,true,false,false,true,false
print("compare_neq");               // compare_neq
print(mvarray.compare_neq(mvarr2)); // false,false,true,true,true,true,true
print(mvarray.compare_neq(mv11));   // true,false,true,true,true,true,true
print(mvarray.compare_neq(0,0));    // false,true,true,true,true,true,true
print(mvarray.compare_neq(mg_sq));  // true,true,false,true,true,true,true
print(mvarray.compare_neq(null));   // true,true,true,true,true,true,false
print(mvarray.compare_neq_h(1));    // true,false,true,true,true,true,true
print(mvarray.compare_neq_h(2));    // true,true,false,true,true,true,true
print(mvarray.compare_neq_v(1));    // true,false,true,true,false,true,true
print(mvarray.compare_neq_v(2));    // true,true,false,true,true,false,true
print("compare_gt");                // compare_gt
print(mvarray.compare_gt(mvarr2));  // false,false,true,false,true,true,false
print(mvarray.compare_gt(mv11));    // false,false,true,true,true,true,false
print(mvarray.compare_gt(0,0));     // false,true,true,true,true,true,false
print(mvarray.compare_gt(mg_sq));   // false,false,false,true,true,true,false
print(mvarray.compare_gt_h(1));     // false,false,true,true,true,true,false
print(mvarray.compare_gt_h(2));     // false,false,false,true,true,true,false
print(mvarray.compare_gt_v(1));     // false,false,true,false,false,true,false
print(mvarray.compare_gt_v(2));     // false,false,false,false,false,false,false
print("compare_gte");               // compare_gte
print(mvarray.compare_gte(mvarr2)); // true,true,true,false,true,true,false
print(mvarray.compare_gte(mv11));   // false,true,true,true,true,true,false
print(mvarray.compare_gte(0,0));    // true,true,true,true,true,true,false
print(mvarray.compare_gte(mg_sq));  // false,false,true,true,true,true,false
print(mvarray.compare_gte_h(1));    // false,true,true,true,true,true,false
print(mvarray.compare_gte_h(2));    // false,false,true,true,true,true,false
print(mvarray.compare_gte_v(1));    // false,true,true,false,true,true,false
print(mvarray.compare_gte_v(2));    // false,false,true,false,false,true,false
print("compare_lt");                // compare_lt
print(mvarray.compare_lt(mvarr2));  // false,false,false,true,false,false,false
print(mvarray.compare_lt(mv11));    // true,false,false,false,false,false,false
print(mvarray.compare_lt(0,0));     // false,false,false,false,false,false,false
print(mvarray.compare_lt(mg_sq));   // true,true,false,false,false,false,false
print(mvarray.compare_lt_h(1));     // true,false,false,false,false,false,false
print(mvarray.compare_lt_h(2));     // true,true,false,false,false,false,false
print(mvarray.compare_lt_v(1));     // true,false,false,true,false,false,false
print(mvarray.compare_lt_v(2));     // true,true,false,true,true,false,false
print("compare_lte");               // compare_lte
print(mvarray.compare_lte(mvarr2)); // true,true,false,true,false,false,false
print(mvarray.compare_lte(mv11));   // true,true,false,false,false,false,false
print(mvarray.compare_lte(0,0));    // true,false,false,false,false,false,false
print(mvarray.compare_lte(mg_sq));  // true,true,true,false,false,false,false
print(mvarray.compare_lte_h(1));    // true,true,false,false,false,false,false
print(mvarray.compare_lte_h(2));    // true,true,true,false,false,false,false
print(mvarray.compare_lte_v(1));    // true,true,false,true,true,false,false
print(mvarray.compare_lte_v(2));    // true,true,true,true,true,true,false
```

<hr />
## MVMask.prototype.fill()

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

**Note**: the `start` and `end` parameters can be negative values.
In that case, the values wrap around from the last index.

### Return value
The modified mask array.

### Examples
```js
const mvmask = new MVMask(8);
print(mvmask);                      // true,true,true,true,true,true,true,true
print(mvmask.fill(false));          // false,false,false,false,false,false,false,false
print(mvmask.fill(true, 4));        // false,false,false,false,true,true,true,true
print(mvmask.fill(true, 2, 3));     // false,false,true,false,true,true,true,true
print(mvmask.fill(false, -4, -2));  // false,false,true,false,false,false,true,true
print(mvmask.fill(false, -4, 5));   // false,false,true,false,false,false,true,true
```

<hr />
## MVMask.prototype.forEach()

The `forEach()` method calls the `callbackFn` function for each element
of the mask array. It has the same functionality as calling the code
below, but it's slightly faster.

```js
for ( let i = 0; i < mvmask.length; i++ )
    callbackFn(mvmask[i], i, mvmask);
```

### Syntax
```js
forEach(callbackFn(element, index, array))
forEach(callbackFn(element, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each element of the mask array.
The function's parameters are `element` (the current element being
tested), `index` (the index it corresponds to in the mask array), and
`array` (the mask array itself).

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`undefined`.

### Examples
```js
const mvmask = new MVMask(6);
print(mvmask);                      // true,true,true,true,true,true
mvmask.forEach((el,i,arr) => arr[i] = i&1);
print(mvmask);                      // false,true,false,true,false,true
```

<hr />
## MVMask.prototype.not()

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

**Note**: the `start` and `end` parameters can be negative values.
In that case, the values wrap around from the last index.

### Return value
The modified mask array.

### Examples
```js
const mvmask = new MVMask(8);
print(mvmask);                      // true,true,true,true,true,true,true,true
print(mvmask.not());                // false,false,false,false,false,false,false,false
print(mvmask.not(4));               // false,false,false,false,true,true,true,true
print(mvmask.not(2, 3));            // false,false,true,false,true,true,true,true
print(mvmask.not(-4, -2));          // false,false,true,false,false,false,true,true
print(mvmask.not(-4, 5));           // false,false,true,false,true,false,true,true
```

<hr />
## MVMask.prototype.and()

The `and` method performs an `AND` binary operator with the `mvmask` argument.

### Syntax
```js
and(mvmask)
```

### Parameters
`mvmask` is the source mask array for the binary operation.

### Return value
The modified mask array.

### Examples
```js
const mvmaskx = new MVMask(8);
for ( let i = 0; i < 8; i++ ) mvmaskx[i] = (i & 1);
const mvmask = new MVMask(8);
print(mvmask);                      // true,true,true,true,true,true,true,true
print(mvmaskx);                     // false,true,false,true,false,true,false,true
print(mvmask.and(mvmaskx));         // false,true,false,true,false,true,false,true
```

<hr />
## MVMask.prototype.or()

The `or` method performs an `OR` binary operator with the `mvmask` argument.

### Syntax
```js
or(mvmask)
```

### Parameters
`mvmask` is the source mask array for the binary operation.

### Return value
The modified mask array.

### Examples
```js
const mvmaskx = new MVMask(8);
for ( let i = 0; i < 8; i++ ) mvmaskx[i] = (i & 1);
const mvmask = new MVMask(8);
print(mvmask.fill(false));          // false,false,false,false,false,false,false,false
print(mvmaskx);                     // false,true,false,true,false,true,false,true
print(mvmask.or(mvmaskx));          // false,true,false,true,false,true,false,true
```

<hr />
## MVMask.prototype.xor()

The `xor` method performs an `XOR` binary operator with the `mvmask` argument.

### Syntax
```js
xor(mvmask)
```

### Parameters
`mvmask` is the source mask array for the binary operation.

### Return value
The modified mask array.

### Examples
```js
const mvmaskx = new MVMask(8);
for ( let i = 0; i < 8; i++ ) mvmaskx[i] = (i & 1);
const mvmask = new MVMask(8);
print(mvmask);                      // true,true,true,true,true,true,true,true
print(mvmaskx);                     // false,true,false,true,false,true,false,true
print(mvmask.xor(mvmaskx));         // true,false,true,false,true,false,true,false
print(mvmask.xor(mvmaskx));         // true,true,true,true,true,true,true,true
print(mvmask.xor(mvmask));          // false,false,false,false,false,false,false,false
```
