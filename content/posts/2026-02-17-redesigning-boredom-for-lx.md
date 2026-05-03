+++
title = "The LLM experience of boreDOM"
description = "My LLM first approach of a simple JS framework"
date = 2026-02-17
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/ergonomics.png", class="center-images with-lists", modules = [] }
+++

**TL;DR**

> I talk about the changes made to bring [LLM Experience design](/posts/why-llms-keep-editing-the-wrong-file/) to `boreDOM`, my testbed zero-build JS runtime that collapses HTML, CSS, JS and state into a single HTML file so models can locate the source of an effect in place.

![I'm a machine and so are you](/images/machines_of_code.png)

## What does a codebase look like if its primary author is a machine?

If a codebase is mostly written by a machine, do our usual frontend instincts still hold? What do we need to change to make that workflow reliable? And how much can we min-max an LLM’s strengths if we stop designing exclusively for human cognition?

I walked this path, looking for answers, adapting and changing [`boreDOM`](/pages/boreDOM/) a minimal JS framework (with no bundler or package manager) I keep evolving as I learn where LLM workflows actually break.

With little JS `boreDOM` tries to make components reusable and allow them to be layed out in triplets: 

```html
<style data-component="my-thing"> <!-- regular CSS here --> </style>
<template data-component="my-thing"> <!-- regular HTML here --> </template>
<script type="text/boredom" data-component="my-thing">
<!-- Component JS here -->
</script>
```

HTML is HTML, style is CSS, and code is JS. These units of triplets can then be placed in a single file index.html or in multiple files through some existing bundler (I use vite when I am hand-rolling them).

Working with LLMs pushed me to over-emphasize a single source of truth. The goal started moving slowly from "syntactic clarity for humans" and more into "operational clarity" by making it cheap to discover where an effect originates, and safe to change it coherently.

The rest of this post is about that shift from human-readable structure to machine-editable traceability in `boreDOM`.

### boreDOM

For boredom the [previous LX (LLM-Experience) guides](/posts/why-llms-keep-editing-the-wrong-file/) translated into the following design principles:

1. Single place of truth: UI structure + style + behavior live together.
1. Instrumented runtime, everything is machine parseable.
1. Constrained surface area, fewer ways to do the same thing and a limited number of composable things.
1. No build-time indirection, what the model edits is what the browser runs.
1. The whole framework is included in the single file of the app, as if the LLM made it, unmaintainable for humans, but a bit better for deep agentic loops, so long we don't hit their other problems (lost in the middle, etc...).

From here on I'll describe the specific ergonomics I added to boreDOM to make that LX workflow real.

## Ergonomics for LLMs

To enforce these principles, `boreDOM` relies on specific mechanics designed for autonomous agentic loops. This is a more technical part, but maybe it can also be applied while vibecoding too.

![Pencil ergonomics for my weird hands](/images/ergonomics.png)

### A. Let LLMs self-correct without humans in the loop

I want to give the LLM parseable and deterministic feedback so that it can self-heal in a loop.

**CLI Validator**

`boreDOM` includes a custom CLI linter validator. Actually I don't see it as a linter and more like a context injection engine made specifically to signal the LLM the best practices and idiomatic approaches it needs. It guardrails the semantic boreDOM approaches as well as tries to prevent introducing things that could impair reusability of components and offline usage (introducing Google Fonts, hallucinating directive names, going around components logic and update loop with `innerHTML` and others, etc...).

The CLI tool validator outputs structured actionable errors that forms a lint-fix loop (validate -> fix -> validate again).

It can produce warnings for `boreDOM` specific things, such as when LLMs should be using `data-dispatch` but instead go and write `data-action`. Or errors for generic things like when a `setInterval`/`addEventListener` is used but not cleaned up.

Every warning/error includes a suggestion string, a plain English fix instruction, and sometimes an example of corrected code.

The validator tries to re-prompt LLMs with suggestions in its output:

```
> W001: Found data-action="submit" (boreDOM uses data-dispatch) (line 42:7) Suggestion: Rename to data-dispatch="..." (click) or data-dispatch-<event> for other events.
  Example: data-dispatch="submit"`
```

Having a custom made linter validator improved at lot the success rate of single prompts with boreDOM.

**Dynamic Import Debug via #sourceURL**

When `boreDOM` encounters a `<script data-component="some-component">` it will extract the script text from it and dynamically import it with `import(url)`.

The `url` is a temporary URL object from a Blob that has `//# sourceURL=...` appended to it. The object URL is revoked immediately after the import resolves.

The [`#sourceURL`](https://developer.chrome.com/docs/devtools/javascript/source-maps#sourceurl) allows LLMs to pin point lines for each component script. It produces relative line numbers and points the dev tools to a fictitious URL `boredom://default/some-component.js`, which is something that LLMs can easily disambiguate.  

Each component's script is a lazily-evaluated ES module that only gets imported once and can produce a parseable correction signal when an LLM generates a boreDOM component that breaks.

This way when the model breaks a component, the console points to `boredom://...:linenumber`, so it can patch the right script block without guessing offsets.

**Structured Logs for regex**

Every `console.error` and `console.warn` in `boreDOM` follows the exact same shape:

```javascript
console.error("[BOREDOM:ERROR]", JSON.stringify({
  component: "component-name",
  message: err.message,
  stack: err.stack,
  code: "SCRIPT_LOAD_FAILED",
  loc: "boredom://default/some-component.js:12",
  context: { source: "script_load" }  // or "state_parse", "_update", etc...
}));
```

The idea here is that errors come out in a structured JSON that an LLM can regex out of a log dump.

An LLM reading console output can grep for `"[BOREDOM:ERROR]"`, parse the JSON, and immediately know which component, what failed, and where in the lifecycle.

### B. Make the default behavior match LLM expectations

Making the runtime transient and fluid towards what LLMs are trying to output is a good way to avoid fighting the weights or going against their training and instead try to leverage their thinking skills. I ended up gifting `boreDOM` with the following things.

**Declarative bindings**

LLMs trained on React/Vue/Svelte default to thinking of bindings as two-way. When they see `data-value="local.name"` on an `<input>`, they assume typing in the input automatically updates `local.name`, unfortunately that's not how it works in vanilla DOM, `data-value` is just an attribute the runtime reads to push state down and without an explicit event listener typing in the `<inpute>` does nothing to state.

In `boreDOM` these values are compiled with `new Function`s, in a set of constraints that make it safe-ish for the `boreDOM` strict conditions that it uses it. This way it allow LLMs to write:

```
<input data-value="local.name" />
<p data-text="local.name"></p>
```

And it just works, state flows down.

**Pre-registered event delegation**

Instead of requiring per-element addEventListener calls, `boreDOM` pre-registers all 16 supported events (yep, only 16 events are supported) on each component host on setup. 

Most UI apps use ~16 events, explicitly naming them and limiting prevents hallucinated event types and lifecycle leaks.

These can be extended in CONSTANTS.Events if needed.

```javascript
CONSTANTS.Events.forEach((event) => {
  this.addEventListener(event, (e) =>
    dispatchComponentEvent(this, e, actionType),
    { capture: useCapture }
  );
});
```

The LLM just writes `data-dispatch="doThing"` in the HTML and `on("doThing", ...)` in the script. No need to keep track of what `addEventListeners` need to be cleared.

**Automatic re-rendering via proxies**

Both state (global) and local (component) are wrapped in a `Proxy`: 

```javascript
const proxy = new Proxy(target, {
  set(obj, prop, value) {
    if (Object.is(oldValue, value)) return true;
    obj[prop] = value;

    scheduleUpdate();
    
    return true;
  },
  get(obj, prop) {
    // Deep wraps, so state.projects[0].name = "x" triggers a re-render too:
    return createReactiveState(obj[prop], callback, cache);
  },
});
```

LLMs just write `local.count += 1` and the UI updates. There is a `WeakMap` cache to prevent infinite proxy wrapping.

boreDOM deliberately uses deep proxies and constrained event delegation to reduce syntactic friction for LLMs. I want re-renders to happen automatically, remove them from being explicit in the syntax and into runtime behavior. Again this is the shift from designing for operation instead of for syntax. Think of it as removing hooks from React and instead focusing on the way a LLM will be writing the intentions. 

This does introduce risks such as recursive mutations that can trigger render loops, or unsupported DOM events that won't fire.

These are intentional constraints designed to reduce surface area for generation and prevent common lifecycle errors, at the cost of flexibility.

With LLMs I tend to see syntax as a solved problem, so my natural approach is to shift explicitness from boilerplate in authored code to consistency behaviours in runtime that LLMs can inspect and produce at will.

### C. Flatten the abstractions

**Flat destructurable API**

The component init function receives everything in one flat object:

```javascript
const createInitContext = (component) => ({
  on: (name, fn) => registerAction(...),
  onMount: (fn) => registerHook(...),
  onUpdate: (fn) => registerHook(...),
  onCleanup: (fn) => registerHook(...),
  self: component,
  ...createComponentContext(component),  // { state, local, refs }
});
```

This way LLMs can destructure exactly what they need: `({ state, local, on, onMount }) => { ... }` without having to keep extra context about class inheritances or import paths. The entire API surface is flat 7 names: on, onMount, onUpdate, onCleanup, state, local and refs (and the ref for the component itself).


**Components triplets in a single place**

As I've shown at the start, the architectural format itself is an LLM ergonomy thing, where HTML, CSS and JS are defined per component in the same place with the same tags. In the end everything lives in one file, but this is just an optional final flattening (things can be in split files if it gets too big).

LLMs love this when there are semantic anchors across the domain concepts. In boredom this is achieve with the `data-component` in style, template, and script tags.

## The tradeoffs

My idea is to optimize for a single author + LLM collaborator model. I mean a very specific single author: me. All of this seems terrible for human teams of many engineers trying to tackle complex products.

![Code is made of words](/images/tumbling_cog.png)

Systems become unmaintainable without modular boundaries and clear APIs. With `boreDOM` you lose strict cross-file type checking, fault isolation, refactoring safety, dependency management, and all of the bundler advantages (tree shaking, code splitting, asset hashing, preloading, etc...).

This isn't an attempt to replace React, Vue, Svelte, or even trying to overhaul existing frontend architectures.

## Conclusion

I tried exploring a different category, runtimes designed for environments where code is frequently written, read and refactored by LLMs. 

In these contexts, I am flipping common knowledge by betting that immediacy, traceability, and low causal distance matter more for AI-driven iteration than strict modular boundaries and build optimizations .

`boreDOM` isn't meant to be a maintainable codebase for big engineering teams. It's an architecture for high-velocity, AI-assisted prototyping and it treats code as "disposable" or "constantly mutable" rather than a permanent monument.

Current LLMs are still 'DX-native', they are trained on the very spaghetti of indirection I'm trying to solve. This inconsistency isn't a failure of the rearchitecture I am proponing but more like a symptom of the existing training gap.

Maybe in the future they will have that capability of determinism and provide for greater experiments.

For now, this is exploratory work. The architectural patterns are strong enough to justify continued experimentation.

I believe that in the future we will be spending more time designing the environment where the code writes itself, as a sort of protocol of intuition between us and our partner that has a 256k context window and zero intuition.

If you want to experiment with this architecture yourself, or just want to see how an LLM handles a zero-build framework, you can check out the [boreDOM landing page](/pages/boreDOM/).

`npx @mr_hugo/boredom init`

Feed it to Claude or Cursor, and let me know if it fails awesomely or brilliantly.
