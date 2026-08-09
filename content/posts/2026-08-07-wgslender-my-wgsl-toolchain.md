+++
title = "wgslender: My WGSL Toolchain"
description = "Many tools on one WGSL core"
date = 2026-08-09
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/wgslender.png", class = "narrow-media", modules = [] }
+++

In this post I am introducing wgslender, the WGSL toolchain that I have been using locally and that has been growing along side some demoscene work.

I have been on this for about 8 months now. It has grown out of the pains of doing the ["tangatos" 8K demo for Revision](https://youtu.be/yRE5YmymLHk?si=HFF4rkntiYxYBzS6&t=207), as well as the more recent ["impulsos" full demo](https://youtu.be/BN2nOPabcho?si=jfFUksbO48o5ywIX).

I will try to angle this on the idea and motivation side, wgslender comes from having spent countless hours writing shaders and then running the minifier in the terminal to check what causes size increases while rethinking compression approaches and what to reuse in the demos and also in the tooling. In a world where every function is weighted in byte costs, reusability is king.

!["wgslender logo is a simple W"](/images/wgslender.png)

### The method of production is itself part of what makes each thing what it is

wgslender was built with heavy LLM assistance, while the demos are handmade, because after all the massage is still the medium.

## Multics

Wgslender packs a lot of stuff, it can do:

- minification
- validation (type-inference, and compilation like)
- reflection
- linter
- binary shader string generation

While running in:
- LSP
- CLI tool
- Browser (wasm/js)
- Your code (as a lib)

Yes, thats it. A toolchain that does all that, and that can run everywhere. Everywhere as in, you do not need WebGPU at all to get compiler errors or get insights. It can run equally well in the CLI or in the browse or in your code, and has an LSP for in-editor insights and navigation. 

### Why everything at once?

I've found that in my workflows these things tend to live together or quite close to each other, and a lot of customizations and nuances that arise from usage could benefit all of these at once.

In wgslender there is one parser that all of them walk with the same identical lexer->parser->analysis flow. Also I want to perform combined operations, things like `minifyAndReflect` that share not only the same parser but also the analysis, ensuring that we get a stable report by construction not by rederiving it after the mangling.

Sharing code paths is a powerful design for this particular toolchain grounded in trees traversal, it allows for interchangeable operations and a really powerful LSP that can reparse incrementally without having to go through the whole parsing loop again.

### The LSP

<div style="text-align:center">
<video autoplay="autoplay" muted loop playsinline preload="auto" style="max-width:100%;width:440px">
  <source src="/videos/wgslenderlsp.webm" type="video/webm">
  <source src="/videos/wgslenderlsp.mp4" type="video/mp4">
</video>
</div>

The language server is not glued with spit on top of the tool but part of its design from the start. It operates on the same in-memory AST/CST as every other tool, the parser keeps a lossless syntax tree next to the AST so the LSP doesn't reparse the shader from scratch as you type (it reparses just the region where the edit landed in and splices the new subtree into the existing trees). It fallsback to a full reparse when edits that don't fit this fast track shape, using the same parser. What comes out is the same module every other tool consumes and with the same pipeline passes run over it: the squiggles are the validator diagnostics, the byte costs are the minifier estimator, computed on the tree that was just spliced. 

<div style="text-align:center">
<video autoplay="autoplay" muted loop playsinline preload="auto" style="max-width:100%;width:440px">
  <source src="/videos/wgslenderlsp-def.webm" type="video/webm">
  <source src="/videos/wgslenderlsp-def.mp4" type="video/mp4">
</video>
</div>

It is a simple solution that can give me the minification overview while the shader is being written, saving me from having to rerun the CLI tool whenever i'm in doubt on how much a block of code would cost (in bytes, space).

It shares the same correctness and validation ground as the other tools, the output is consistent with what the validator compiler does, the types being shown are the same as the typechecker, etc... you get the idea. 

Oh yeah, and it runs in the browser, avoiding me from having to context switch to the CLI to do the minification and reflection and analysis while working in a WebGPU context.

<div style="text-align:center">
<video autoplay="autoplay" muted loop playsinline preload="auto" style="max-width:100%;width:440px">
  <source src="/videos/wgslenderlsp-browser.webm" type="video/webm">
  <source src="/videos/wgslenderlsp-browser.mp4" type="video/mp4">
</video>
</div>

## The best part

Use the CLI and run `wgslender validate` (or the LSP, or the lib in your code, all the same):

Compilation errors and validation in the CLI without having to acquire a WebGPU device and create a ShaderModule. This my friends is a life-saver for me!

All offline, without a `navigator.gpu` or a browser forcing us into weird async round-trips at specific points of execution.

This means that you get to see those `let x: i32 = 1.0;` errors at the speed of typing.

_`typeerr.wgsl:2:9: error: cannot initialize 'x' with type 'abstract-float' (expected 'i32') [E0200]`_

Not only that but also does the [WGSL uniformity analysis](https://www.w3.org/TR/WGSL/#uniformity). Calling `workgroupBarrier();` from within an `if` condition that varies at each invocation? _`error: barrier function must only be called from uniform control flow [E0701]`_.

It dramatically reduces the kind of stuff you would otherwise discover through WebGPU shader compilation or pipeline diagnostics.

Go ahead, you don't even need to install it, fire up your terminal and `npx wgslender validate shader.wgsl`.

## The second best part

When coding WGSL I tend to keep an open tab at the WGSL builtins page, why? [click on it and find out](https://www.w3.org/TR/WGSL/#builtin-functions).

It's a lot for my head, or as we say in Portugal, its a lot of sand for my truck, dozens of builtins, most with several overloads over generic `T/vecN<T>` shapes, plus all the little nuances around textures, uniformity, etc... so I keep it open and context-switch into it a lot.

This is another place where the wgslender shared machinery pays off since the validator already needs structured knowledge of WGSL builtins and their signatures, the LSP then reuses exactly that same data for hover information and documentation.

As you type it suggests builtins and shows you their available signatures as you hover, it does not substitute the spec but it reduces the switching when we only need a quick overview to keep interactin with the code.

## The weird part: binary shaders

One common complain with WebGPU is that it does not support binary shaders, and by that it is typically meant that it does not support already compiled shader modules. It is a valid point, however shader module creation tends to be quite fast in WebGPU implementations, like really fast, with substantial backend work potentially happening later during pipeline creation, and that is much trickier to pass around as binary.

Leaving runtime performance aside, and focusing on the WGSL aspect only for the web in size-constrained scenarios, `wgslender` can produce a binary tiny self-contained .wasm module whose only job is to regenerate the WGSL source text at runtime. You can't feed it directly to WebGPU because there is no support for that, but WASM is a generic computation machine that can be leveraged to work as a bundler for big shaders.

This means the shader text is [encoded](https://en.wikipedia.org/wiki/Byte-pair_encoding) inside a binary wasm, and then decoded when executed. For small shaders (~5KB) it does not compensate, you are better off with traditional minification+gzip, but for big shaders there  are gainz to be had. Unless you don't care about this at all ahah.

[See the Benchmark](https://github.com/HugoDaniel/wgslender/blob/main/BENCHMARK.md) if you are interested in more data around this idea of having a binary representation of the source text, which is something much simpler than a precompiled shader binary.

## The long tail

The focus of wgslender is to make the life easy of those that still enjoy hand rolling shaders.

It has a long tail and a big surface of bugs and improvements that keeps getting worked on, for instance, the reflection is oriented towards auto-binding efforts of external tools, it computes uniform references accross the function calls of the entry points, so that it is possible to automate what each entry point actually needs bound, and the JSON output is anotated with stableId's that survive quick edits.

The linter gives you 30 rules to enforce certain shader styles, with auto-fixing support. You can finally auto-solve things like `prefer-let-over-var` if its something that annoys you, or `no-redundant-casts` to avoid `f32(x)` when `x` is already a float, among many other taste guidelines.

Many other things and personal niceties, such as "did you mean?" error messages, `use of undeclared identifier 'velocty'; did you mean 'velocity'?` and lots of other stuff.

## Conclusion

This toolchain exists because of demos and the demoscene, its principles of reusability and lean design are the same that I have been learning and perfecting with demos.

In tangatos every composed cat shape and tangram were reusing the same triangle drawing function, while in `wgslender` the same parser and analysis get reused across its tools driven by my fuzzy workflow of having to know how many bytes is such a piece of code costing me or trying to reduce the browser/spec context switching.

The linter minifier rules invoke the same minifier size heuristics and code reachability analysis, and this 2nd order reusability is the driving engine of this toolchain kit that tries to compound by enriching each tool with the skills of each other one.

Maybe we could do even more things that could reuse the parser+analysis trees in the future.

Anyway, this is opinionated and has very rough edges, fruits of pushing this from specific real use cases, if you try it tell me where it breaks and how we can make this better, it needs love in a lot of its surface.

You can [try it out](https://hugodaniel.com/pages/wgslender)!

- [rust](https://crates.io/crates/wgslender)
- [go](https://pkg.go.dev/github.com/HugoDaniel/wgslender/packages/go/wgslender)
- [js](https://www.npmjs.com/package/wgslender)
- [code](https://github.com/HugoDaniel/wgslender)

and the highly configurable [vscode extension](https://marketplace.visualstudio.com/items?itemName=hugodaniel.wgslender-vscode).

