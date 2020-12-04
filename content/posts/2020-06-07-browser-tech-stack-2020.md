+++
title = "From Rust to Svelte, what tech stack will I use"
description = "It is 2020 and we have a great set of cool tech to play with on the web"
date = 2020-06-07
extra = { place = "Amadora", author = "Hugo Daniel" }
+++

**TL;DR** Here is a template for your new web app project: [Svelte + TypeScript + Parcel + Rust](https://github.com/HugoDaniel/svelte-template)

The web is a big open platform that keeps evolving with the URL at its core.

We have a lot of tech and frameworks at our disposal to chose when starting a new web app in 2020.

There certainly is a lot of mud to crawl into, from an all-in vanilla JS approach up until an all-out React with a 100+ dependencies approach.

Among these there are a few cool things that strike my attention:

## [Svelte](https://svelte.dev)

Their component approach and state handling is fresh.

They lean towards using standards like CSS Variables and JS imports in an HTML first compiled approach.

The Svelte compiler outputs very lean JS code. Which comes in stark contrast with the current frontend bundle trends.

Perhaps in the future browsers will provide us higher-level components that can pack together HTML+JS+CSS in a way that is at least as elegant as Svelte does.

## [Parcel](https://parceljs.org)

Most bundlers configuration is typically write-once and write-only. It is a pain to maintain and properly configure a bundle.

Parcel does it right by providing sane defaults that don't need configuration upfront. (A bit like the [fish shell](https://fishshell.com/docs/current/design.html) )

**Why is a bundler needed if Svelte already has a compiler ?**

A bundler like Parcel provides the extra goodies of allowing us to import strange files directly in our `.svelte` components.

Stuff like TypeScript and even Rust become a breeze to work with.

Perhaps in the future bundlers won't be needed. Perhaps even text files won't be needed to code. Unfortunately we need them in our current state of things.

## [TypeScript](https://www.typescriptlang.org)

This language has been evolving fast. For now types are the way to go and TypeScript does a great job at typifying JavaScript and preventing those nasty null errors where you least expect(ed) them.

Perhaps in the future startups will again push towards dynamic languages as a way to bring faster products to market and the "Move fast, break things" will make sense again. But for now static is the way to go.

## [Rust](https://www.rust-lang.org)

Rust has a lot of good things. It appeals the front-end crowd as much as the backend people and the language is leveraging those windows of opportunity much better than any other language or community.

Wasm bindgen is a bliss of fresh air, it even works very well with TypeScript.

## [WebAssembly](https://webassembly.org)

This is a total game changer for the next years. As a compile target it will allow near native performance and open the door for a lot of programming languages to be used on the web.

A new era of web apps is coming thanks to Web Assembly. It is hard to forsee what exactly will this be.

There are nevertheless a few cool extensions already being worked on for it:

- [WASI](https://github.com/WebAssembly/WASI)
- [128-bit SIMD](https://github.com/WebAssembly/simd)
- [Threads](https://github.com/WebAssembly/threads)
- [Ref. Types](https://github.com/WebAssembly/reference-types)
- [Multiple value returns and block parameters](https://github.com/WebAssembly/multi-value)
- [Bulk Memory Operations](https://github.com/webassembly/bulk-memory-operations)
- [Non-trapping float-to-int convertions](https://github.com/WebAssembly/nontrapping-float-to-int-conversions)
- [Sign-extension ops](https://github.com/WebAssembly/sign-extension-ops)
- [Exception handling](https://github.com/WebAssembly/exception-handling)
- [Extended name section](https://github.com/WebAssembly/extended-name-section)
- [Multi-memory](https://github.com/WebAssembly/multi-memory)
- [Garbage Collection](https://github.com/WebAssembly/gc)

Web development is going to be a very different beast in a few moments in time. Lets enjoy the ride.

## Conclusion

I have fetched some ideas from a few repos and forked them into a ready to use template you can start your projects with.

[Check it out.](https://github.com/HugoDaniel/svelte-template)
