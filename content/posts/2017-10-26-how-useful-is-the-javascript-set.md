+++
title = "How useful is the JavaScript Set"
description = "Working, playing and measuring the JavaScript Set data structure"
date = 2017-10-25
extra = { place = "Lisboa", author = "Hugo Daniel" }
+++

In most languages Set's have a clear strong use case: fast union, intersection and difference operations; unfortunately in JavaScript these operations are not readily defined so as an exercise I am going to raise some questions and try to answer them in this post.

All code is run on Firefox Developer Edition 57.0b11 (64-bit) in macOS.

## Initialization

Most of this post will be used to compare [Set()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) with [Array()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) for some common operations. To initialize a Set() I will be constructing it with an Array.

```js
const set1 = new Set([1,2,3,4,5,6]);

set1.has(5);
// true

set1;
// Set [ 1, 2, 3, 4, 5, 6 ]
```

## Uniqueness

Without the common set operations defined the JavaScript Set() can be seen as a glorified container that only stores unique elements. When you put a repeated element it actually replaces the existing one.

This is quite useful for primitive values.

```js
set1.add(5);
set1.add(5);
set1.add(5);
set1;
// Set [ 1, 2, 3, 4, 5, 6 ]
```

Unlike Arrays the value will not be repeated when you add it to a Set.

For object values this is not that simple as Set uses references for those values;

```js
const set2 = new Set([{ value: 1}, { value: 2}]);
let obj1 = { value: 2 };
set2.add(obj1);
set2;
// Set [{ value: 1}, { value: 2}, { value: 2 }]
```

The reference is used as the key in the Set, if we change `obj1.value` above to something else and add it to the Set, JavaScript will see it as a repeated element and replace the existing reference in the Set.

```js
obj1.value = "foo";
set2.add(obj1); // obj1 is already in the set
set2;
// Set [{ value: 1}, { value: 2}, { value: "foo" }]
```

Now just to compare with Arrays, here is a naive implementation to create an array with n values and then filter the unique values in it.

```js
const n = 100000;
// create an array with 'n' random numbers:
const initialArray = new Array();
for (let i = 0; i < n; i++) {
	const number = Math.round(Math.random()*n);
	initialArray.push(number);
}
// naively filter the unique values into a new array
const uniqueArray = new Array();
performance.mark("UniqueArrayBefore");
for (let i = 0; i < initialArray.length; i++) {
	const value = initialArray[i];
	if (uniqueArray.indexOf(value) === -1) {
		uniqueArray.push(value);
	}
}
performance.mark("UniqueArrayAfter");
performance.measure("uniqueArray", "UniqueArrayBefore", "UniqueArrayAfter");
const arrayTotalTime = performance.getEntriesByName("uniqueArray")[0].duration;
console.log(arrayTotalTime, uniqueArray.length);
// 171.08500000000004 63235
```

It takes 171 milliseconds to filter ~64k unique values in a 100k elments array. Not bad.

Now lets compare this naive implementation to just using Set():

```js
performance.mark("UniqueSetBefore");
let uniqueSet = new Set(initialArray); // easy!
performance.mark("UniqueSetAfter");
performance.measure("uniqueSet", "UniqueSetBefore", "UniqueSetAfter");
const setTotalTime = performance.getEntriesByName("uniqueSet")[0].duration;
console.log(setTotalTime, uniqueSet.size);
// 0.8699999999998909 63235
```

That is FAST! ~0.9ms with the same initial 100k array. The good part is that Set does not get worse with the number of elements in it.

This is basic JS and the killer feature of Set()'s. Use them when you need a container of unique elements and/or to filter unique elements in any iterable container.

## Presence

Checking if an element is present is also easy in a Set and arguably an operation quite common for containers like these.

```js
set1.has(5);
// true
set1.has(1337);
// false
```

Arrays also have a presence function called `indexOf`: it returns the index of the element or -1 if it is not present.

To compare `Array.indexOf()` to `Set.has()` here is a quick test that runs 10000 indexOf's (in array) and has's (in Set) for an Array and Set of 100 elements:

```js
const size = 100; // the Array and Set size
const a = new Array();
for (let i = 0; i < size; i++) {
	a.push(Math.round(Math.random()*size));
}
const s = new Set(a);

const ops = 10000;
let indexAll = 0;
performance.mark("Array Before");
for (let i = 0; i < ops; i++) {
	indexAll += a.indexOf(Math.round(Math.random()*size));
	// ^ just to do some operation
}
performance.mark("Array After");
performance.measure("Array.indexOf()", "Array Before", "Array After");
const arrayTotalTime = performance.getEntriesByName("Array.indexOf()")[0].duration;

let setValue = false;
performance.mark("Set Before");
for (let i = 0; i < ops; i++) {
	setValue += s.has(Math.round(Math.random()*size));
	// ^ same as above just to do some operation
}
performance.mark("Set After");
performance.measure("Set.has()", "Set Before", "Set After");
const setTotalTime = performance.getEntriesByName("Set.has()")[0].duration;

console.log(setValue, indexAll);
console.log("SET: ", setTotalTime, "ARRAY: ", arrayTotalTime);
// SET:  17.68499999999767 ARRAY:  20.924999999995634
```

A slight difference. Multiple executions give values that are coherent with these (not an outlier).
`Set.has()` is faster than the `Array.indexOf()` even for small Arrays.

The difference of execution just gets bigger as the size of the containers increase.

```js
// size = 1000;
// SET:  21.014999999999418 ARRAY:  54.00500000000102
// size = 10000;
// SET:  17.44499999999971 ARRAY:  398.505000000001
// size = 100000;
// SET:  19.770000000004075 ARRAY:  3779.524999999994
```

`Set.has()` execution time doesn't seem to differ with the set size. The JS spec tells us why:

_"Set objects must be implemented using either hash tables or other mechanisms that, on average, provide access times that are sublinear on the number of elements in the collection."_ [[\*]](http://www.ecma-international.org/ecma-262/6.0/#sec-set-objects)

It does not even bother heating your CPU as my browser probably implements this to be O(shiznit(n)) for a large enough n (I will not go into detail here so I will leave the measurement as an exercise for you as it is always important/necessary to measure Big-O behaviours).

## Insertion speed

Right now Sets seem really cool, how about we check how fast is the add() method in comparison to an array push(), like we did in the [Immutable.List vs Array article](@/posts/2017-10-03-in-loving-memory-of-immutable.md) ?

The code is simple, two loops, one for Array.push() and another for Set.add().

```js
const s = new Set();
const a = new Array();
const ammount = 100000;
performance.mark("ArrayBefore");
for (let i = 0; i < ammount; i++) {
	a.push(i);
}
performance.mark("ArrayAfter");
performance.measure("Array.push", "ArrayBefore", "ArrayAfter");

performance.mark("SetBefore");
for (let i = 0; i < ammount; i++) {
	s.add(i);
}
performance.mark("SetAfter");
performance.measure("Set.add", "SetBefore", "SetAfter");
const arrayTime = performance.getEntriesByName("Array.push")[0].duration;
const setTime = performance.getEntriesByName("Set.add")[0].duration;
console.log(`Array.push in ${arrayTime}ms; Set.add in ${setTime}ms;`);
// Array.push in 4.054999999993015ms; Set.add in 20.915000000037253ms;
```

Ah! Arrays are much faster (5x) in insertion than Sets. If you are an experience developer this is not really surprising at all, but still it is nice to check.
Be aware that insertion speed grows linearly in Arrays and non-linearly in Sets:

```js
// ammount = 100000;
// Array.push in 4.054999999993015ms; Set.add in 20.915000000037253ms;
// ammount = 1000000;
// Array.push in 17.175000000046566ms; Set.add in 417.03999999992084ms;
// ^ ~4x more than prev.               ^ ~20x more than prev.
// ammount = 10000000;
// Array.push in 349.8299999999581ms; Set.add in 3902.625ms;
// ^ ~20x more than prev.             ^ ~10x more than prev.
```

We could continue, but JavaScript numbers are [64 bit double precision floating point values](https://en.wikipedia.org/wiki/Double-precision_floating-point_format). Which means that for integer values they will use 52bits of storage for the significand. Which in turn means that for the next ammount (100000000) I would need 650MB of memory just to store the numbers + the overhead of the Array and Set data structures.

Another exercise for the reader :D

If you are doing a cheap fast logger, then Array is a better choice than Set since it inserts much faster. Set add() is probably implemented to have a better [O(some BS here)](https://en.wikipedia.org/wiki/Big_O_notation) than the Array push() and it will likely not be much slower than 10x the previous running order. But their measured absolute value is way slower and this is what really matters, always measure your code if you care about performance because overhead can creep in the most unexpected places (I am not sure if this is the case, but still...).

## Iteration speed

If you are wondering how Set performs in the need to iterate through its elements, wonder no further.

Again the two cycles, this time using for..of to go through the Set items.

```js
const s = new Set();
const a = new Array();
const ammount = 100000;
let sum = 0;
for (let i = 0; i < ammount; i++) {
	a.push(i);
}
performance.mark("ArrayBefore");
for (let i = 0; i < a.length; i++) {
	sum += a[i];
}
performance.mark("ArrayAfter");
performance.measure("Array.for", "ArrayBefore", "ArrayAfter");

for (let i = 0; i < ammount; i++) {
	s.add(i);
}
console.log(sum);
sum = 0;
performance.mark("SetBefore");
for (let item of s) { // <- here
	sum += item;
}
performance.mark("SetAfter");
performance.measure("Set.for", "SetBefore", "SetAfter");
const arrayTime = performance.getEntriesByName("Array.for")[0].duration;
const setTime = performance.getEntriesByName("Set.for")[0].duration;
console.log(sum);
console.log(`Array.for in ${arrayTime}ms; Set.for in ${setTime}ms;`);
// Array.for in 4.44999999999709ms; Set.for in 9.239999999997963ms;
```

No surprises here. Array sequential values are faster to iterate than Set values (which iterates in insertion order).

```js
// ammount = 100000;
// Array.for in 4.44999999999709ms; Set.for in 9.239999999997963ms;
// ammount = 1000000;
// Array.for in 9.044999999998254ms; Set.for in 55.14499999998952ms;
// ammount = 10000000;
// Array.for in 74.47000000000116ms; Set.for in 180.13999999999942ms;
```

Arrays are faster for sequential iteration of lots of data.
Converting the Set to an Array is not going to help here because [`Array.from`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) iterates through the argument to perform the convertion.

Just deal with it :)

## Set operations

![A pic I took more than a decade ago. Paulo, one of the best hackers I have met. [Nikon FM2 50mm1.2f, Kodak E100G film, double exposure](@/posts/2017-10-25-Lisbon-as-an-inspiration-for-my-project.md).](/images/paulo_coding.jpg)

We saw that Set construction and presence checking are extremely fast operations when compared to their Array counterparts. With this in mind the set operations can be easily and naively done.

### Union

```js
const union = new Set([...set1, ...set2]);
```

Creates a new set with the _unique_ values on set1 and set2 (no repeated values). If you don't care about uniqueness then just use Arrays and [`concat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) them.

### Difference

```js
const diff = new Set([...set1].filter(x => !set2.has(x)));
```

### Intersection

```js
const intersected = new Set([...set1].filter(x => set2.has(x)));
```

Simple as long as you remember that for objects they work with references instead of values.

## Conclusion

- Use Set() when unique values matter
- Set.has() is much faster than Array.indexOf()
- Array.push() is much faster than Set.add()
- Arrays are faster to iterate sequentially
- Union, Difference, Intersection are easy to implement with Set

Set's are a big part of my project [Grid Generator](https://gridgenerator.com). Keeping these small concepts close to the heart can help you leverage Sets to achieve very good performance even in mobile devices.

I hope this post was valuable in any way to you. If you are interested [here is my take on console.log()](@/posts/2017-08-11-mastering-console-log.md) and also a [look into Immutable](@/posts/2017-10-03-in-loving-memory-of-immutable.md).
