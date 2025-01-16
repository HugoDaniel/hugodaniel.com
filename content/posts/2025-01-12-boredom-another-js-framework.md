+++
title = "boreDOM another boring JS framework"
description = "Everything you never needed."
date = 2025-01-12
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/bored1.png", class="center-images with-lists" }
+++

Being bored can drive you crazy. In my case it took me on a trip to create
another JS framework. As if the world even needed more of that. In this post I
present the thought process behind "boreDOM" a novel JS framework for everyone.

The main motivator was to have a simple framework to manipulate the DOM which
could naturally fit the scenario where the HTML is defined in .html files, CSS
in .css files and JS in .js files.

This way most HTML for a given app would already exist and would not need to be
created through JS. In most common JS frameworks the HTML is typically created
through JS. I wanted to avoid that and reuse as much existing html nodes as
possible with a small JS footprint.

### The idea

The main idea is to use `<template>` elements whose content could then be
stamped all over the place as needed. In order to do that each `boreDOM`
template element registers a custom element tag.

```html
<template data-component="stamp-this">
  <p>yay</p>
</template>

<stamp-this></stamp-this>
<stamp-this></stamp-this>
<stamp-this></stamp-this>
```

The framework reads the `data-component` attribute and registers the associated
tag. Then it is up to the regular browser mechanics when we use it in places.

### The logic

To provide some logic to the components, a matching .js file can be set with a
`<script>` tag:

```html
<template data-component="magic-button">
  <button>Press for magic</button>
</template>
<script src="magic-button.js" type="module"></script>
```

This file is a regular .js file that is going to be imported dynamically and
associated with the corresponding component. It should export a function that is
run when the component is connected to the DOM, and return a function that is
called when the component is to be rendered/updated.

```js
// In magic-button.js
import { webComponent } from "./boreDOM.min.js";

export const MagicButton = webComponent(() => {
  // on connect

  return (() => {
    // on render
  });
});
```

There are some helper attributes that these functions receive. Here is `on` for
handling custom events:

```html
<magic-button></magic-button>

<template data-component="magic-button">
  <button onclick="dispatch('magic')">Press for magic</button>
</template>
<script src="magic-button.js" type="module"></script>
```

```js
// In magic-button.js
import { webComponent } from "./boreDOM.min.js";

export const MagicButton = webComponent(({ on }) => {
  on("magic", () => {
    document.body.style.background = `#${Math.random().toString(16).slice(-6)}`;
  });

  return (() => {
    // on render
  });
});
```

### A simple counter

Slots are also supported and are available through the `.slots` attribute in
each registered tag Element, as well as passed as an option in the init and
render functions. Here is a simple counter:

```html
<h1>Simple counter</h1>

<simple-counter></simple-counter>

<template data-component="simple-counter">
  <slot name="counter">Some value</slot>

  <button onclick="dispatch('increase')">
    Increase
  </button>

  <button onclick="dispatch('decrease')">
    Decrease
  </button>
</template>
<script src="./simple-counter.js" type="module"></script>
```

```js
// in simple-counter.js
import { webComponent } from "./boreDOM.min.js";

export const SimpleCounter = webComponent(({ on }) => {
  on("increase", ({ state: mutableState }) => {
    mutableState.value += 1;
  });
  on("decrease", ({ state: mutableState }) => {
    mutableState.value -= 1;
  });

  return (({ state, self }) => {
    // Set the value of the slot:
    self.slots.counter = `${state.value}`;
  });
});
```

Finally it all starts with the app state, which is passed to the starting
boreDOM function, in main.js:

```js
// in main.js
import { inflictBoreDOM } from "./boreDOM.min.js";

inflictBoreDOM({ value: 0 });
```

This ensures that the render function is fine-grained and called whenever the
corresponding state that it needs is updated.

### Some particularities

There are a few other things it brings as well:

- References to elements (through `data-ref=""` attributes).
- Shadow-dom support (through the `shadowrootmode="open/closed"` attribute in
  the `<template>`).
- `aria-*` attributes that you set in the `<template>` are passed down to the
  tag.
- Same for `role=*`.
- Dynamically create components in JS through `makeComponent` in the init/render
  function argument object.
- Batches renders in a `requestAnimationFrame()`.
- Components are JS by default, types are provided and can be used with JSDoc to
  type-check.
- Small but comprehensive
  [test suit](https://github.com/HugoDaniel/boreDOM/blob/main/tests/dom.test.ts).

Nothing here is ground-breaking, but make up for a small and versatile framework
that fit my needs for the future. I'll be adapting and bringing in further
projects with this little toy.

!["A bored square"](/images/bored1.png)

A small caveat about component JS code being imported dynamically is that it
makes it hard to have a bundler or anything non-standard at that point. If you
need to make use of such tech and/or import packages that are not immediately
available through a valid standard URL then it is best to make use of it before
laying the UI components.

### Conclusion

If you find any of this useful at all drop me note, I'll be super happy that
this is found in any way useful by anyone other than me. There is a somewhat
ranty webpage for this framework that you can check out too:

[boreDOM](/pages/boreDOM).
