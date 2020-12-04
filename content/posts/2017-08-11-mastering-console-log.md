+++
title = "Mastering console.log()"
description = "Working with the developer tools most used console function"
date = 2017-08-11
extra = { place = "Lisboa", author = "Hugo Daniel" }
+++

Using `console.log()` to debug JavaScript, a dynamic weakly-typed interpreted language, feels like drinking beers on a lazy summer sunday afternoon.

It is easy and you do it without thinking too much on how you could probably be more productive doing something else.

Truth is that in all the other days of the week you don't avoid spraying your code with the [`debugger`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) keyword and let the developer tools stop and show you the execution context at that exact location.

```
function yourCodeThatCouldBeWorking() {
  const x = 1337;
  const y = parseInt(window.prompt('Y value:'));
  debugger; // <- hello
  return (x / y);
}

```

But lazy summer sunday afternoons are on to get us, and `console.log()` is our friend for the mood.

## console.log() basic mode

The most basic usage of `console.log` is to just pass it a string. You can step this up a bit by following the string with JS objects and/or strings. Like this:

```
const v1 = { x: 123, y: 321 };
console.log("Vector v1: (", v1.x, ",", v1.y, ")");
// or just:
console.log("Vector v1:", v1);
```

Try it in your developer tools console (Ctrl Shift i, or in mac Cmd Shift i).

This is a particularly simple and helpful way to properly debug JavaScript. Specially if your code is creating code or functions in runtime, making it hard to setup breakpoints in the debugger window.

But who needs breakpoints when we have `console.log` ? :)

## Colorful console.log() composer mode

Besides its simplicity, my next favourite thing in `console.log` is that it also allows you to pass a format string to be replaced with what you want:

```
const v1 = { x: 123, y: 321 };
console.log("v1 (%i, %i)", v1.x, v1.y);
```

There are a handful of other [string substitutions](https://developer.mozilla.org/en-US/docs/Web/API/console#Using_string_substitutions) you can use.

While apparently this is not a big improvement over the simplest mode, it can be used to do a few things that would not be so easy otherwise.

**Colors in console.log**

You can style your output with CSS through the %c substitution:

```
const v1 = { x: 123, y: 321 };
console.log( "%c[Vector 1] %c(%i, %i)%c\nin object %o"
           , "background: #242; color: #bada55"
           , "background: #424; color: #c0ffee"
           , v1.x, v1.y
           , "" //<- clears style
           , v1
           );
```

**Dynamically create your output**

You can also compose the log format string with code and pass it the args as needed.
Suppose you are logging messages that can have a varying number of attributes:

```
const someMsg =
  { type: "WORKER_ERROR"
  , action: "division"
  , args: [123, 0]
  };

function logMessage(msg) {
  let logFmt = "%c[%s]%c - %c%s%c";
  let logArgs =
    [ "background: #242; color: #bada55"
    , msg.type
    , ""
    , "background: #424; color: #c0ffee"
    , msg.action
    , ""
    ];
  if (msg.action === "division") {
    logFmt += ": %i / %i";
    logArgs.push(msg.args[0]);
    logArgs.push(msg.args[1]);
  } else {
    logFmt += " with args %o";
    logArgs.push(msg.args);
  }
  // finally print it:
  console.log(logFmt, ...logArgs);
}

logMessage(someMsg);
```

## Measuring console.log()

Another thing to keep in mind when using `console.log` is that it is not free. It does come with a performance hit, how much exactly ? Lets measure it like we did for [requestAnimationFrame()](@/posts/2016-09-23-how-fast-is-nothing.md):

For this test I am going to print just 32 simple console.log messages. I know that this is not a lot, it actually is nothing when compared to using console.log on mousemove events or any other fast firing event, but it should be enough to test.

```
performance.mark("Before");
// print 32 lines
for(let i = 0; i < 32; i++)
  console.log("One of the simplest console.log() possible", i);
performance.mark("After");
performance.measure("console.log", "Before", "After");
const totalTime = performance.getEntriesByType("measure")[0].duration;
console.log("console.log() in %ims", totalTime);
performance.clearMarks();
performance.clearMeasures();
```

In my Firefox Developer Edition (56.0b1) console it prints

```
"console.log() in 15ms"
```

15 milliseconds is _a lot_ of time in a computer perspective, specially since we are just printing 32 messages, it is about 0.45ms per message.

To keep it in perspective here is the time it takes to parse a huge 128KB JSON string:

```
function jsonParseAndMeasure(jsonStr) {
  performance.mark("jsonStart");
  const json = JSON.parse(jsonStr);
  performance.mark("jsonEnd");
  performance.measure("JSON.parse", "jsonStart", "jsonEnd");
  const totalTime = performance.getEntriesByType("measure")[0].duration;
  console.log("JSON.parse in %ims", totalTime);
  performance.clearMarks();
  performance.clearMeasures();
}

jsonParseAndMeasure("HUGE JSON STRING HERE");
```

For a 128KB JSON string it prints:

```
"JSON.parse in 0ms"
```

Hmm... maybe that is not enough, lets increase it to a 2MB JSON string:

```
"JSON.parse in 0ms"
```

Ok... what about a 50MB JSON string ?

```
"JSON.parse in 17ms"
```

Thats more like it. About the same time it took console.log to print 32 simple messages. There are a few attenuating factors for this in production, but it is good to keep this in mind when leaving those debugging messages in your production code ;)

## Buffering console.log()

There is an alternative if you have your reasons to use `console.log` in production code: buffering.

Instead of printing each message as it comes, lets place them in an array and dump it in a single `console.log` call every second or so.

```
let buffer = [];
// use a log function instead of directly calling console.log:
function log(str, args) {
  buffer.push({ str, args });
}

function printBuffer() {
  // start by copying the buffer and clearing it
  const buf = buffer.slice(0);
  buffer = [];
  // dump the buffer in a single console.log call
  if (buf.length > 0) {
    let logStr = "";
    let logArgs = [];
    buf.map(msg => {
      logStr += "%s, %o\n";
      logArgs.push(msg.str);
      logArgs.push(msg.args);
    });
    console.log(logStr, ...logArgs);
  }
  setTimeout(printBuffer, 1000); // run every 1000ms
}

printBuffer(); // <- start it
```

That should save you some performance complaints. I hope it helps :)
