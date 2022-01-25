---
layout: page
title: FFArrays and FFPtrs
---

# FFArrays and FFPtrs

`FFArrays` are based on the built-in `Typed Arrays`, but with a lot of
functionality and complexity removed to provide a simpler and faster
implementation.

`FFArrays` are `fixed length`, which means that once they are created,
they **cannot** be made larger or smaller.

`FFArrays` are `dense arrays` (in contrast to `sparse arrays`), which
means there are no holes in the array.
All elements from `0` to `length-1` can be read/written.

Just like the `Typed Arrays`, the `FFArrays` come in different types
related to the kind of integer values that are being stored. Those can
be `signed` or `unsigned`, from `8-` to `64-`bit values. The eight new
types are:

```
Int8FFArray
Uint8FFArray
Int16FFArray
Uint16FFArray
Int32FFArray
Uint32FFArray
Int64FFArray
Uint64FFArray
```

All of those types provide the same methods described below. This
documentation will use the expression `FFArray` to mean any of the
types above.

`FFPtrs` are very similar to `FFArrays`, and share all the same methods.
The main difference is that `FFPtrs` do not have any memory allocated
for their data. Instead, they point to data from `FFArrays`, and may
sometimes point to data from inside `ffgac` itself. The `FFPtr` types
are:

```
Int8FFPtr
Uint8FFPtr
Int16FFPtr
Uint16FFPtr
Int32FFPtr
Uint32FFPtr
Int64FFPtr
Uint64FFPtr
```

Be careful not to play around with `FFPtrs` once the object they were
created from has run out of its scope. You will write into unallocated
memory and the program will segfault.

<hr />
## FFArray Constructor

The constructor is used to create a new `FFArray` object of length
`length`. All elements are initialized to zero.

### Syntax
```js
new FFArray(length)
```

### Parameters
`length` must be a non-zero positive number that specifies the length
of the array to be created.

### Return value
The new object.

### Examples
```js
const arr = new Int32FFArray(8);
print(arr);                         // 0,0,0,0,0,0,0,0
```

<hr />
## FFPtr Constructor

The constructor is used to create a new `FFPtr` object from either an
`FFArray` object or another `FFPtr` object. The new object will have
the same length as the `source` object.

**Note**: type-casting is not (yet) allowed! For example, you
**cannot** create an `Int32FFPtr` from a `Uint8FFArray`. They differ
both in signedness and bitness.

### Syntax
```js
new FFPtr(source)
```

### Parameters
`source` must be either an `FFArray` or an `FFPtr` object.

### Return value
The new object.

### Examples
```js
const arr = new Int32FFArray(8);
print(arr instanceof Int32FFArray); // true
print(arr instanceof Int32FFPtr);   // false
const ptr = new Int32FFPtr(arr);
print(ptr instanceof Int32FFArray); // false
print(ptr instanceof Int32FFPtr);   // true
print(ptr);                         // 0,0,0,0,0,0,0,0
const xxx = new Uint8FFPtr(arr);    // TypeError: type mismatch
```

<hr />
## FFArray.prototype.toString()

The `toString()` method returns a string representing the specified
array and its elements.

### Syntax
```js
toString()
```

### Return value
The string representation.

### Examples
```js
const arr = new Int32FFArray(8);
print(arr.toString());              // 0,0,0,0,0,0,0,0
```

<hr />
## FFArray.prototype.join()

The `join()` method is kind of like `toString()`, but it allows you to
specify a custom `separator` for each element. This allows you to make
some funny old-school emoticon sequences...

### Syntax
```js
join()
join(separator)
```

### Parameters
`separator` (optional) is a string that will separate each element.
The default separator is a comma (`,`).

### Return value
The string representation.

### Examples
```js
const arr = new Int32FFArray(4);
print(arr.join());         // 0,0,0,0             (boring old comma)
print(arr.join("Oo.oO"));  // 0Oo.oO0Oo.oO0Oo.oO0 (the wave)
print(arr.join("? "));     // 0? 0? 0? 0          (scratching head)
print(arr.join("% "));     // 0% 0% 0% 0          (my social battery)
print(arr.join("/* *\\")); // 0/* *\0/* *\0/* *\0 (cheerleaders)
print(arr.join("w me"));   // 0w me0w me0w me0    (hungry kitten)
```

<hr />
## FFArray.prototype.copyWithin()

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
The modified array.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i;
print(arr);                         // 0,1,2,3,4,5,6,7
print(arr.copyWithin(0, 6));        // 6,7,2,3,4,5,6,7
print(arr.copyWithin(2, 6, 7));     // 6,7,6,3,4,5,6,7
print(arr.copyWithin(-2, -4));      // 6,7,6,3,4,5,4,5
print(arr.copyWithin(0, -2));       // 4,5,6,3,4,5,4,5
```

<hr />
## FFArray.prototype.subarray()

The `subarray()` method returns an `FFPtr` that points to a chunk of
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
The new `FFPtr` object.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i;
const ptr = arr.subarray();
print(ptr);                         // 0,1,2,3,4,5,6,7
print(ptr instanceof Int32FFArray); // false
print(ptr instanceof Int32FFPtr);   // true
print(arr.subarray(4));             // 4,5,6,7
print(arr.subarray(-2));            // 6,7
print(arr.subarray(4, -2));         // 4,5
```

<hr />
## FFArray.prototype.set()

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
`source` is either an `FFArray` or an `FFPtr`.

`targetOffset` (optional) specifies which index to start copying to.
If this value is omitted, `targetOffset` is `0`.

**Note**: the `targetOffset` parameter can be a negative value.
In that case, the value wraps around from the last index.

### Return value
The modified array.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i;
const arr2 = new Int32FFArray(4);
for ( let i = 0; i < 4; i++ ) arr2[i] = -i;
print(arr);                         // 0,1,2,3,4,5,6,7
print(arr2);                        // 0,-1,-2,-3
print(arr.set(arr2));               // 0,-1,-2,-3,4,5,6,7
print(arr.set(arr2, 2));            // 0,-1,0,-1,-2,-3,6,7
print(arr.set(arr2, -2));           // RangeError: out-of-bound access
const sub = arr.subarray(0, 2);
print(sub);                         // 0,-1
print(arr.set(sub, -2));            // 0,-1,0,-1,-2,-3,0,-1
```

<hr />
## FFArray.prototype.fill()

The `fill()` method fills all the elements of an array from a `start`
index to an `end` index with a static `value`.

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

**Note**: the `start` and `end` parameters can be negative values.
In that case, the values wrap around from the last index.

### Return value
The modified array.

### Examples
```js
const arr = new Int32FFArray(8);
print(arr);                         // 0,0,0,0,0,0,0,0
print(arr.fill(1));                 // 1,1,1,1,1,1,1,1
print(arr.fill(2, 6));              // 1,1,1,1,1,1,2,2
print(arr.fill(3, 4, 6));           // 1,1,1,1,3,3,2,2
print(arr.fill(4, -6, -4));         // 1,1,4,4,3,3,2,2
print(arr.fill(5, -5, 5));          // 1,1,4,5,5,3,2,2
```

<hr />
## FFArray.prototype.reverse()

The `reverse()` method reverses all elements in the array **in-place**.
This operation applies to the entire array (there are no range arguments).
If you want to reverse just a small chunk of the array, use the
`subarray()` method and call `reverse()` on that.

### Syntax
```js
reverse()
```

### Return value
The modified array.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i;
print(arr);                         // 0,1,2,3,4,5,6,7
print(arr.reverse());               // 7,6,5,4,3,2,1,0
print(arr.subarray(2,6).reverse()); // 2,3,4,5
print(arr);                         // 7,6,2,3,4,5,1,0
```

<hr />
## FFArray.prototype.sort()

The `sort()` method sorts all elements in the array **in-place**.
If the optional `compareFn` argument is not supplied, a simple
numerical comparison is performed.
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
that is called for each pair of elements during the sorting algorithm.
The function's parameters are `a` and `b` (a pair of elements from the
array).
The function should return a negative number for (`a` > `b`), a
positive number for (`a` < `b`), and zero if (`b` == `a`).

### Return value
The modified array.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i;
print(arr);                         // 0,1,2,3,4,5,6,7
print(arr.sort((a,b) => b - a));    // 7,6,5,4,3,2,1,0
const sub = arr.subarray(2, 6);
print(sub);                         // 5,4,3,2
print(sub.sort());                  // 2,3,4,5
print(arr);                         // 7,6,2,3,4,5,1,0
print(arr.sort());                  // 0,1,2,3,4,5,6,7
function compareFn(a, b) {
    return b - a;
};
print(arr.sort(compareFn));         // 7,6,5,4,3,2,1,0
```

<hr />
## FFArray.prototype.slice()

The `slice()` method returns a new `FFArray` object with a copy of the
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
The new object.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i;
const sub = new Int32FFPtr(arr);
const slc = arr.slice();
print(arr instanceof Int32FFArray); // true
print(sub instanceof Int32FFPtr);   // true
print(slc instanceof Int32FFArray); // true
print(slc instanceof Int32FFPtr);   // false
print(arr);                         // 0,1,2,3,4,5,6,7
print(sub);                         // 0,1,2,3,4,5,6,7
print(slc);                         // 0,1,2,3,4,5,6,7
slc.fill(1);
print(arr);                         // 0,1,2,3,4,5,6,7
print(sub);                         // 0,1,2,3,4,5,6,7
print(slc);                         // 1,1,1,1,1,1,1,1
print(arr.slice(2));                // 2,3,4,5,6,7
print(arr.slice(-6));               // 2,3,4,5,6,7
print(arr.slice(2, 6));             // 2,3,4,5
print(arr.slice(2, -2));            // 2,3,4,5
print(arr.slice(-6, -2));           // 2,3,4,5
print(arr.slice(-6, 6));            // 2,3,4,5
```

<hr />
## FFArray.prototype.dup()

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
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i;
print(arr);                         // 0,1,2,3,4,5,6,7
const dup = arr.dup();
print(dup);                         // 0,1,2,3,4,5,6,7
arr[1] = -1;
dup[1] = -2;
print(arr);                         // 0,-1,2,3,4,5,6,7
print(dup);                         // 0,-2,2,3,4,5,6,7
```

<hr />
## FFArray.prototype.every()

The `every()` method tests whether **every** element in the array
passes the test implemented by the `callbackFn` function.
If any element **does not** pass the test, the method returns early
with `false`.

### Syntax
```js
every(callbackFn(element, index, array))
every(callbackFn(element, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each element of the array.
The function's parameters are `element` (the current element being
tested), `index` (the index it corresponds to in the array), and
`array` (the array itself).
The function should return either `true` or `false`.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`true` or `false`.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i;
print(arr);                         // 0,1,2,3,4,5,6,7
print(arr.every((el) => el >= 0));  // true
print(arr.every((el) => el > 0));   // false
function is_monotonic(el, i, arr) {
    if ( i > 0 )
        return el > arr[i-1];
    return true;
}
print(arr.every(is_monotonic));     // true
arr[3] = -1;
print(arr);                         // 0,1,2,-1,4,5,6,7
print(arr.every(is_monotonic));     // false
```

<hr />
## FFArray.prototype.some()

The `some()` method tests whether **at least one** element in the array
passes the test implemented by the `callbackFn` function.
If any element **does** pass the test, the method returns early with
`true`.

### Syntax
```js
some(callbackFn(element, index, array))
some(callbackFn(element, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each element of the array.
The function's parameters are `element` (the current element being
tested), `index` (the index it corresponds to in the array), and
`array` (the array itself).
The function should return either `true` or `false`.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`true` or `false`.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i;
print(arr);                         // 0,1,2,3,4,5,6,7
print(arr.some((el) => el <= 0));   // true
print(arr.some((el) => el < 0));    // false
```

<hr />
## FFArray.prototype.forEach()

The `forEach()` method calls the `callbackFn` function for each element
of the array. It has the same functionality as calling the code below,
but it's slightly faster.
Note that you **cannot** modify `element` directly, since it is passed
as a value.

```js
for ( let i = 0; i < arr.length; i++ )
    callbackFn(arr[i], i, arr);
```

### Syntax
```js
forEach(callbackFn(element, index, array))
forEach(callbackFn(element, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each element of the array.
The function's parameters are `element` (the current element being
tested), `index` (the index it corresponds to in the array), and
`array` (the array itself).

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
`undefined`.

### Examples
```js
const arr = new Int32FFArray(8);
arr.forEach((el, i, arr) => arr[i] = i);
print(arr);                         // 0,1,2,3,4,5,6,7
arr.forEach((el, i, arr) => el = 4);
print(arr);                         // 0,1,2,3,4,5,6,7
// Note that the previous call to `forEach()` did not modify the array.
arr.forEach((el, i, arr) => arr[i] = i+2);
print(arr);                         // 2,3,4,5,6,7,8,9
function is_four(el, i, arr) {
    const not_str = (el != 4) ? "not " : "";
    print(`element [${i}] is ${el}, which is ${not_str}four`);
}
arr.forEach(is_four);
element [0] is 2, which is not four
element [1] is 3, which is not four
element [2] is 4, which is four
element [3] is 5, which is not four
element [4] is 6, which is not four
element [5] is 7, which is not four
element [6] is 8, which is not four
element [7] is 9, which is not four
```

<hr />
## FFArray.prototype.map()

The `map()` method creates a new `FFArray` (of the same time as the
source array) and calls the `callbackFn` on each element of the source
array, storing the result in the corresponding element in the new
array.

### Syntax
```js
map(callbackFn(element, index, array))
map(callbackFn(element, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each element of the array.
The function's parameters are `element` (the current element being
tested), `index` (the index it corresponds to in the array), and
`array` (the array itself).
The function should return a value to be stored in the new array.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
The new array.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i;
print(arr);                         // 0,1,2,3,4,5,6,7
const map = arr.map((el) => el * el);
print(map instanceof Int32FFArray); // true
print(arr);                         // 0,1,2,3,4,5,6,7
print(map);                         // 0,1,4,9,16,25,36,49
```

<hr />
## FFArray.prototype.find()

The `find()` method returns a value of an element in the array, if it
satisfies the provided `callbackFn` testing function.
Otherwise `undefined` is returned.

### Syntax
```js
find(callbackFn(element, index, array))
find(callbackFn(element, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each element of the array.
The function's parameters are `element` (the current element being
tested), `index` (the index it corresponds to in the array), and
`array` (the array itself).
The function should return either `true` or `false`.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
A value in the array if an element passes the test; otherwise, `undefined`.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i+2;
print(arr);                         // 2,3,4,5,6,7,8,9
print(arr.find((el) => el == 1));   // undefined
print(arr.find((el) => el == 4));   // 4
```

<hr />
## FFArray.prototype.findIndex()

The `findIndex()` method returns the index of a value of an element in
the array, if it satisfies the provided `callbackFn` testing function.
Otherwise `-1` is returned.

### Syntax
```js
findIndex(callbackFn(element, index, array))
findIndex(callbackFn(element, index, array), thisArg)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each element of the array.
The function's parameters are `element` (the current element being
tested), `index` (the index it corresponds to in the array), and
`array` (the array itself).
The function should return either `true` or `false`.

`thisArg` (optional) is a value to use as `this` when executing
`callbackFn`.

### Return value
The index of a value in the array if an element passes the test; otherwise, `-1`.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i+2;
print(arr);                         // 2,3,4,5,6,7,8,9
print(arr.findIndex((el) => el == 1)); // -1
print(arr.findIndex((el) => el == 4)); // 2
```

<hr />
## FFArray.prototype.indexOf()

The `indexOf()` method returns the first index at which a given
element `searchElement` can be found in the array (starting from the
optional `fromIndex` argument), or `-1` if it is not present.

### Syntax
```js
indexOf(searchElement)
indexOf(searchElement, fromIndex)
```

### Parameters
`searchElement` is the element to search for in the array.

`fromIndex` (optional) specifies which index to start the search from.
If this value is omitted, `fromIndex` is `0`.

**Note**: the `fromIndex` parameter can be a negative value.
In that case, the value wraps around from the last index.

### Return value
The first index of the element in the array; `-1` if not found.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i+2;
print(arr);                         // 2,3,4,5,6,7,8,9
print(arr.indexOf(1));              // -1
print(arr.indexOf(4));              // 2
print(arr.indexOf(4, 1));           // 2
print(arr.indexOf(4, 2));           // 2
print(arr.indexOf(4, 3));           // -1
print(arr.fill(4));                 // 4,4,4,4,4,4,4,4
print(arr.indexOf(4));              // 0
```

<hr />
## FFArray.prototype.lastIndexOf()

The `lastIndexOf()` method returns the last index at which a given
element `searchElement` can be found in the array (starting from the
optional `fromIndex` argument), or `-1` if it is not present.

### Syntax
```js
lastIndexOf(searchElement)
lastIndexOf(searchElement, fromIndex)
```

### Parameters
`searchElement` is the element to search for in the array.

`fromIndex` (optional) specifies which index to start the search from.
If this value is omitted, `fromIndex` is `0`.

**Note**: the `fromIndex` parameter can be a negative value.
In that case, the value wraps around from the last index.

### Return value
The last index of the element in the array; `-1` if not found.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i+2;
print(arr);                         // 2,3,4,5,6,7,8,9
print(arr.lastIndexOf(1));          // -1
print(arr.lastIndexOf(4));          // 2
print(arr.lastIndexOf(4, 1));       // -1
print(arr.lastIndexOf(4, 2));       // 2
print(arr.lastIndexOf(4, 3));       // 2
print(arr.fill(4));                 // 4,4,4,4,4,4,4,4
print(arr.lastIndexOf(4));          // 7
```

<hr />
## FFArray.prototype.includes()

The `includes()` method determines whether an array includes a certain
element `searchElement` (starting from the optional `fromIndex`
argument), returning `true` or `false` as appropriate.

### Syntax
```js
includes(searchElement)
includes(searchElement, fromIndex)
```

### Parameters
`searchElement` is the element to search for in the array.

`fromIndex` (optional) specifies which index to start the search from.
If this value is omitted, `fromIndex` is `0`.

**Note**: the `fromIndex` parameter can be a negative value.
In that case, the value wraps around from the last index.

### Return value
`true` or `false`.

### Examples
```js
const arr = new Int32FFArray(8);
for ( let i = 0; i < 8; i++ ) arr[i] = i+2;
print(arr);                         // 2,3,4,5,6,7,8,9
print(arr.includes(1));             // false
print(arr.includes(2));             // true
```

<hr />
## FFArray.prototype.reduce()

The `reduce()` method, much like `forEach()`, calls the `callbackFn`
function for each element of the array. The difference here is an extra
argument `accumulator` being passed to `callbackFn`, which is actually
just the return value from the previous call to the function.

### Syntax
```js
reduce(callbackFn(accumulator, element, index, array))
reduce(callbackFn(accumulator, element, index, array), initialValue)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each element of the array.
The function's parameters are `accumulator` (the return value from the
previous call to the function), `element` (the current element being
tested), `index` (the index it corresponds to in the array), and
`array` (the array itself).
The function should return an updated `accumulator`.

`initialValue` (optional) is the value to be passed to the first call
to `callbackFn`.
If this value is omitted, `initialValue` is the first element from the
array, and `callbackFn` starts being called from the second element of
the array.

### Return value
The `accumulator`.

### Examples
```js
// populate arr with ASCII chars from the following string
const str = "apfelstrudel";
const arr = new Int8FFArray(str.length);
for ( let i = 0; i < str.length; i++ ) arr[i] = str.charCodeAt(i);
// ASCII representation of the string:
print(arr); // 97,112,102,101,108,115,116,114,117,100,101,108
// call reduce() to get sum of all elements
let sum = arr.reduce((acc, el) => acc + el);
print(sum); // 1291 (sum of all elements)
// find extreme values (accumulator is [ smallest, largest ], where
// smallest and largest are arrays with [ value, index ]).
function find_extremes(acc, el, i) {
    // first iteration, return initial value
    if ( acc === null )
        return [ [ el, i ], [ el, i ] ];
    // subsequente iterations, update accumulator with largest and
    // smallest values
    if ( acc[0][0] > el )
        acc[0] = [ el, i ];
    if ( acc[1][0] < el )
        acc[1] = [ el, i ];
    return acc;
}
// note the use of initialValue being set to null!
e = arr.reduce(find_extremes, null);
e[0][0] = String.fromCharCode(e[0][0]);
e[1][0] = String.fromCharCode(e[1][0]);
print(`the smallest letter '${e[0][0]}' is at index ${e[0][1]}`);
// the smallest letter 'a' is at index 0
print(`the largest letter '${e[1][0]}' is at index ${e[1][1]}`);
// the largest letter 'u' is at index 8
```

<hr />
## FFArray.prototype.reduceRight()

The `reduceRight()` method does the same thing as the `reduce()`
method, but it runs through the array from right-to-left instead
of left-to-right.

The `reduceRight()` method, much like `forEach()`, calls the
`callbackFn` function for each element of the array (starting with the
last element). The difference here is an extra argument `accumulator`
being passed to `callbackFn`, which is actually just the return value
from the previous call to the function.

### Syntax
```js
reduceRight(callbackFn(accumulator, element, index, array))
reduceRight(callbackFn(accumulator, element, index, array), initialValue)
```

### Parameters
`callbackFn` is a function (`inline`, `arrow`, or normal) that is
called for each element of the array, starting from the last element
and going down to the first element.
The function's parameters are `accumulator` (the return value from the
previous call to the function), `element` (the current element being
tested), `index` (the index it corresponds to in the array), and
`array` (the array itself).
The function should return an updated `accumulator`.

`initialValue` (optional) is the value to be passed to the first call
to `callbackFn`.
If this value is omitted, `initialValue` is the last element from the
array, and `callbackFn` starts being called from the penultimate
element of the array.

### Return value
The `accumulator`.

### Examples
```js
// populate arr with ASCII chars from the following string
const str = "apfelstrudel";
const arr = new Int8FFArray(str.length);
for ( let i = 0; i < str.length; i++ ) arr[i] = str.charCodeAt(i);
// ASCII representation of the string:
print(arr); // 97,112,102,101,108,115,116,114,117,100,101,108
// call reduceRight() to get sum of all elements
let sum = arr.reduceRight((acc, el) => acc + el);
print(sum); // 1291 (sum of all elements)
```

<hr />
## FFArray.prototype.values()

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
const arr = new Int32FFArray(4);
for ( let i = 0; i < 4; i++ ) arr[i] = i+2;
print(arr);                         // 2,3,4,5
for ( const val of arr.values() ) print(val);
// 2
// 3
// 4
// 5
```

<hr />
## FFArray.prototype.keys()

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
const arr = new Int32FFArray(4);
for ( let i = 0; i < 4; i++ ) arr[i] = i+2;
print(arr);                         // 2,3,4,5
for ( const key of arr.keys() ) print(key);
// 0
// 1
// 2
// 3
```

<hr />
## FFArray.prototype.entries()

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
const arr = new Int32FFArray(4);
for ( let i = 0; i < 4; i++ ) arr[i] = i+2;
print(arr);                         // 2,3,4,5
for ( const entry of arr.entries() ) print(entry);
// 0,2
// 1,3
// 2,4
// 3,5
```
