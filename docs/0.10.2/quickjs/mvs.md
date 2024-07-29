---
layout: page
title: MV and MVRef
permalink: /docs/0.10.2/quickjs/mvs/
---

# MV and MVRef

`MV` and `MVRef` are a simple representation of a
`[ horizontal, vertical ]` motion vector.
There are actually two different types of `MV`s (constant and object)
and one `MVRef`.
They can be equal to `null`, which means this is a non-existent motion
vector (this comes in handy with `MVArray`s and `MV2DArray`s).
They behave differently depending on how they are instantiated.

## MV Constant
The first `MV` type is the simplest.
It is created by calling the `MV()` function.
It is a `constant`, which means that once created it cannot be changed.
The `horizontal` and `vertical` elements may be accessed independently,
but not assigned to.
It is meant mostly to be used as an argument to functions since it's
faster to create and uses less memory.
```js
let mv = MV(1,2);
print(mv);                          // [1,2]
print(mv[0]);                       // 1
print(mv[1]);                       // 2
print(mv[2]);
// RangeError: out-of-bound numeric index
mv[0] = 3;
// MV() cannot be changed, create it with "new MV(xxx)" instead
```

## MV Object
The second `MV` type is an object.
It is created by calling the `new MV()` constructor.

The `MV` object has a bunch of methods which will be described further
down in this page.

```js
let mv = new MV(1,2);
print(mv);                          // [1,2]
print(mv[0]);                       // 1
print(mv[1]);                       // 2
print(mv[2]);
// RangeError: out-of-bound numeric index
mv[0] = 3;
print(mv);                          // [3,2]
```

## MVRef
The `MVRef` is an object that references an `MV` object.
Whatever changes are made to the `MVRef` object will be reflected on
the source `MV` object as well (and vice-versa).
Be careful not to play around with an `MVRef` once the `MV` object it
was created from has run out of its scope. You will write into
unallocated memory and the program will segfault.

The `MVRef` object shares the same methods as the `MV` object, which
will be described further down in this page.

```js
let mv = new MV(1,2);
let mvref = new MVRef(mv);
print(mv);                          // [1,2]
print(mvref);                       // [1,2]
mvref[0] = 3;
print(mv);                          // [3,2]
print(mvref);                       // [3,2]
```

<hr />
## MV Constant function

The `MV()` function is used to create a new `MV` constant.
The arguments passed to the function should either be omitted (in which
case the motion vector is `[0,0]`), set to `null`, specified as an `MV`
constant, an `MV` object, or an `MVRef` object, specified as an array
with two elements, or specified in terms of its horizontal and vertical
components.

### Syntax
```js
MV()
MV(null)
MV(mv)
MV(horizontal, vertical)
MV([ horizontal, vertical ])
```

### Parameters
`mv` (optional) must be either an `MV` constant, an `MV` object, or an `MVRef` object.

`horizontal` (optional) is the horizontal component of the motion vector.

`vertical` (optional) is the vertical component of the motion vector.

### Return value
The new `MV` constant.

### Examples
```js
let mv = MV(1,2);
let mvobj = new MV(3,2);
let mvref = new MVRef(mvobj);
print(mv);                          // [1,2]
print(mvobj);                       // [3,2]
print(mvref);                       // [3,2]
print(MV());                        // [0,0]
print(MV(null));                    // null
print(MV(mv));                      // [1,2]
print(MV(mvobj));                   // [3,2]
print(MV(mvref));                   // [3,2]
print(MV(1,3));                     // [1,3]
print(MV(1,2) instanceof MV);       // false
print(MV([1,3]));                   // [1,3]
```

<hr />
## MV Constructor

The `new MV()` constructor is used to create a new `MV` object.
The arguments passed to the constructor should either be omitted (in
which case the motion vector is `[0,0]`), set to `null`, specified as
an `MV` constant, an `MV` object, or an `MVRef` object, specified as an
array with two elements, or specified in terms of its horizontal and
vertical components.

### Syntax
```js
new MV()
new MV(null)
new MV(mv)
new MV(horizontal, vertical)
new MV([ horizontal, vertical ])
```

### Parameters
`mv` (optional) must be either an `MV` constant, an `MV` object, or an `MVRef` object.

`horizontal` (optional) is the horizontal component of the motion vector.

`vertical` (optional) is the vertical component of the motion vector.

### Return value
The new `MV` object.

### Examples
```js
let mv = MV(1,2);
let mvobj = new MV(3,2);
let mvref = new MVRef(mvobj);
print(mv);                          // [1,2]
print(mvobj);                       // [3,2]
print(mvref);                       // [3,2]
print(new MV());                    // [0,0]
print(new MV(null));                // null
print(new MV(mv));                  // [1,2]
print(new MV(mvobj));               // [3,2]
print(new MV(mvref));               // [3,2]
print(new MV(1,3));                 // [1,3]
print(new MV(1,2) instanceof MV);   // true
print(new MV([1,3]));               // [1,3]
```

<hr />
## MVRef Constructor

The `new MVRef()` constructor is used to create a new `MVRef` object.
The arguments passed to the constructor should be either an `MV` object
(note: not an `MV` constant) or an `MVRef` object.

### Syntax
```js
new MVRef(mv)
```

### Parameters
`mv` must be either an `MV` object or an `MVRef` object.

### Return value
The new `MVRef` object.

### Examples
```js
let mvobj = new MV(3,2);
let mvref = new MVRef(mvobj);
print(mvobj);                       // [3,2]
print(mvref);                       // [3,2]
print(mvobj instanceof MV);         // true
print(mvobj instanceof MVRef);      // false
print(mvref instanceof MV);         // false
print(mvref instanceof MVRef);      // true
```

<hr />
## MV.prototype.toString()

The `toString()` method returns a string representing the specified
motion vector.

### Syntax
```js
toString()
```

### Return value
The string representation.

### Examples
```js
const mv = new MV(1,3);
print(mv.toString());               // [1,3]
```

<hr />
## MV.prototype.magnitude()

The `magnitude()` method returns the magnitude of the motion vector.
The magnitude of a vector `(x,y)` is equivalent to `sqrt(x*x+y*y)`.

### Syntax
```js
magnitude()
```

### Return value
The magnitude of the motion vector as a floating point number.

### Examples
```js
let mv = new MV(2,3);
print(mv.magnitude()); // 3.605551275463989
```

<hr />
## MV.prototype.magnitude_sq()

The `magnitude_sq()` method returns the square of the magnitude of the
motion vector.
The magnitude of a vector `(x,y)` is equivalent to `sqrt(x*x+y*y)`, so
the square of the magnitude is `x*x+y*y`.
This method is faster than `magnitude()` since there is no need to
calculate the square root.

### Syntax
```js
magnitude_sq()
```

### Return value
The square of the magnitude of the motion vector as an integer.

### Examples
```js
let mv = new MV(2,3);
print(mv.magnitude_sq()); // 13
```

<hr />
## MV.prototype.swap_hv()

The `swap_hv()` method swaps the horizontal and vertical elements of
the motion vector **in-place**.

### Syntax
```js
swap_hv()
```

### Return value
The modified motion vector.

### Examples
```js
let mv = new MV(2,3);
print(mv);           // [2,3]
print(mv.swap_hv()); // [3,2]
```

<hr />
## MV.prototype.clear()

The `clear()` method zeroes the horizontal and vertical elements of the
motion vector **in-place**.

### Syntax
```js
clear()
```

### Return value
The modified motion vector.

### Examples
```js
let mv = new MV(2,3);
print(mv);         // [2,3]
print(mv.clear()); // [0,0]
```

<hr />
## MV.prototype.mathOp()

There is no real `mathOp()` method in the `MV` prototype.
Instead, there are a bunch of math operation methods, listed below:
```js
add()
sub()
mul()
div()
assign()
```
The arguments passed to the methods above should either be omitted (in
which case the argument is `[0,0]`), set to `null`, specified as an
`MV` constant, an `MV` object, or an `MVRef` object, specified as an
array with two elements, or specified in terms of its horizontal and
vertical components.

The operations do exactly what the names mean. `add()` will add the
argument to the motion vector, `sub()` will subtract, `mul()` will
multiply, `div()` will divide (rounding to nearest), and `assign()`
will assign (just copy).

There are also similar methods that operate only on the horizontal or
vertical elements of the motion vector. These methods have either
`_h` (horizontal) or `_v` (vertical) appended to the method names.
These methods take only one argument (the `horizontal` or `vertical`
element).
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
mathOp()
mathOp(null)
mathOp(mv)
mathOp(horizontal, vertical)
mathOp_h(horizontal)
mathOp_v(vertical)
```

### Parameters
`mv` (optional) must be either an `MV` constant, an `MV` object, or an `MVRef` object.

`horizontal` (optional for `mathOp()`, mandatory for `mathOp_h()` and `mathOp_v()`)
is the horizontal component of the motion vector.

`vertical` (optional for `mathOp()`, mandatory for `mathOp_h()` and `mathOp_v()`)
is the vertical component of the motion vector.

### Return value
The modified motion vector.

### Examples
```js
let mv12  = MV(1,2);
let mvobj = new MV(3,2);
let mvref = new MVRef(mvobj);
print(mv12);             // [1,2]
print(mvobj);            // [3,2]
print(mvref);            // [3,2]
// good luck keeping track of the value of the motion vector!
let mv = new MV(1,1);
print(mv);               // [1,1]
print("add");            // add
print(mv.add());         // [1,1]
print(mv.add(null));     // [1,1]
print(mv.add(mv12));     // [2,3]
print(mv.add(mvobj));    // [5,5]
print(mv.add(mvref));    // [8,7]
print(mv.add(0,1));      // [8,8]
print(mv.add(1,0));      // [9,8]
print(mv.add_h(1));      // [10,8]
print(mv.add_v(1));      // [10,9]
print("sub");            // sub
print(mv.sub());         // [10,9]
print(mv.sub(null));     // [10,9]
print(mv.sub(mv12));     // [9,7]
print(mv.sub(mvobj));    // [6,5]
print(mv.sub(mvref));    // [3,3]
print(mv.sub(0,1));      // [3,2]
print(mv.sub(1,0));      // [2,2]
print(mv.sub_h(1));      // [1,2]
print(mv.sub_v(1));      // [1,1]
print("mul");            // mul
print(mv.mul(null));     // [1,1]
print(mv.mul(mv12));     // [1,2]
print(mv.mul(mvobj));    // [3,4]
print(mv.mul(mvref));    // [9,8]
print(mv.mul(2,2));      // [18,16]
print(mv.mul_h(2));      // [36,16]
print(mv.mul_v(2));      // [36,32]
print("div");            // div
print(mv.div(null));     // [36,32]
print(mv.div(mv12));     // [36,16]
print(mv.div(mvobj));    // [12,8]
print(mv.div(mvref));    // [4,4]
print(mv.div(2,2));      // [2,2]
print(mv.div_h(2));      // [1,2]
print(mv.div_v(2));      // [1,1]
print("assign");         // assign
print(mv.assign(mv12));  // [1,2]
print(mv.assign(mvobj)); // [3,2]
print(mv.assign(mvref)); // [3,2]
print(mv.assign_h(0));   // [0,2]
print(mv.assign_v(0));   // [0,0]
// multiply by zero returns zero
mv = new MV(mv12);
print(mv);               // [1,2]
print(mv.mul());         // [0,0]
// divide by zero returns zero
mv = new MV(mv12);
print(mv);               // [1,2]
print(mv.div());         // [0,0]
// the null argument is only allowed when assigning
print(mv.assign(null));  // null
```

<hr />
## MV.prototype.compareOp()

There is no real `compareOp()` method in the `MV` prototype.
Instead, there are two comparison methods, named `compare_eq()` and
`compare_neq()`.

The arguments passed to the methods above should either be omitted (in
which case the argument is `[0,0]`), set to `null`, specified as an
`MV` constant, an `MV` object, or an `MVRef` object, specified as an
array with two elements, or specified in terms of its horizontal and
vertical components.

The `compare_eq()` method will test for equality (`==`) for both motion
vectors, whereas the `compare_neq()` method will test for inequality
(`!=`).

There are also similar methods that operate only on the horizontal or
vertical elements of the motion vector. These methods take only one
argument (the `horizontal` or `vertical` element), and have either
`_h` (horizontal) or `_v` (vertical) appended to the method names.
They are listed below:
```js
compare_eq_h()
compare_neq_h()
compare_eq_v()
compare_neq_v()
```

### Syntax
```js
compareOp()
compareOp(null)
compareOp(mv)
compareOp(horizontal, vertical)
compareOp_h(horizontal)
compareOp_v(vertical)
```

### Parameters
`mv` (optional) must be either an `MV` constant, an `MV` object, or an `MVRef` object.

`horizontal` (optional for `compareOp()`, mandatory for `compareOp_h()` and `compareOp_v()`)
is the horizontal component of the motion vector.

`vertical` (optional for `compareOp()`, mandatory for `compareOp_h()` and `compareOp_v()`)
is the vertical component of the motion vector.

### Return value
`true` or `false`.

### Examples
```js
let mv12  = MV(1,2);
let mvnul = MV(null);
let mvobj = new MV(3,2);
let mvref = new MVRef(mvobj);
print(mv12);                    // [1,2]
print(mvobj);                   // [3,2]
print(mvref);                   // [3,2]
let mv = new MV(1,2);
print(mv);                      // [1,2]
print(mv.compare_eq());         // false
print(mv.compare_eq(null));     // false
print(mv.compare_eq(mvnul));    // false
print(mv.compare_eq(mv12));     // true
print(mv.compare_eq(mvobj));    // false
print(mv.compare_eq(mvref));    // false
print(mv.compare_eq(1,2));      // true
print(mv.compare_eq_h(1));      // true
print(mv.compare_eq_h(2));      // false
print(mv.compare_eq_v(1));      // false
print(mv.compare_eq_v(2));      // true
print(mv.compare_neq());        // true
print(mv.compare_neq(null));    // true
print(mv.compare_neq(mvnul));   // true
print(mv.compare_neq(mv12));    // false
print(mv.compare_neq(mvobj));   // true
print(mv.compare_neq(mvref));   // true
print(mv.compare_neq(1,2));     // false
print(mv.compare_neq_h(1));     // false
print(mv.compare_neq_h(2));     // true
print(mv.compare_neq_v(1));     // true
print(mv.compare_neq_v(2));     // false
mv.assign(null);
print(mv);                      // null
print(mv.compare_eq());         // false
print(mv.compare_eq(null));     // true
print(mv.compare_eq(mvnul));    // true
print(mv.compare_eq(mv12));     // false
print(mv.compare_eq(mvobj));    // false
print(mv.compare_eq(mvref));    // false
print(mv.compare_eq(1,2));      // false
print(mv.compare_eq_h(1));      // false
print(mv.compare_eq_h(2));      // false
print(mv.compare_eq_v(1));      // false
print(mv.compare_eq_v(2));      // false
print(mv.compare_neq());        // true
print(mv.compare_neq(null));    // false
print(mv.compare_neq(mvnul));   // false
print(mv.compare_neq(mv12));    // true
print(mv.compare_neq(mvobj));   // true
print(mv.compare_neq(mvref));   // true
print(mv.compare_neq(1,2));     // true
print(mv.compare_neq_h(1));     // true
print(mv.compare_neq_h(2));     // true
print(mv.compare_neq_v(1));     // true
print(mv.compare_neq_v(2));     // true
mv.assign(0, 0);
print(mv);                      // [0,0]
print(mv.compare_eq());         // true
print(mv.compare_eq(null));     // false
print(mv.compare_eq(mvnul));    // false
print(mv.compare_eq(mv12));     // false
print(mv.compare_eq(mvobj));    // false
print(mv.compare_eq(mvref));    // false
print(mv.compare_eq(1,2));      // false
print(mv.compare_eq_h(0));      // true
print(mv.compare_eq_h(1));      // false
print(mv.compare_eq_v(0));      // true
print(mv.compare_eq_v(1));      // false
print(mv.compare_neq());        // false
print(mv.compare_neq(null));    // true
print(mv.compare_neq(mvnul));   // true
print(mv.compare_neq(mv12));    // true
print(mv.compare_neq(mvobj));   // true
print(mv.compare_neq(mvref));   // true
print(mv.compare_neq(1,2));     // true
print(mv.compare_neq_h(0));     // false
print(mv.compare_neq_h(1));     // true
print(mv.compare_neq_v(0));     // false
print(mv.compare_neq_v(1));     // true
```
