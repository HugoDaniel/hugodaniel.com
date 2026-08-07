+++
title = "wgslender: My WGSL Toolchain"
description = "One Engine for WGSL"
date = 2026-08-07
draft = true
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/hugo_dog.jpg", class = "narrow-media", modules = [] }
+++

In this post I am introducing wgslender, the WGSL toolchain that I have been using locally and that has been growing along side some demoscene work.

I have been on this for about 8 months now. It has grown out of the pains of doing the "tangatos" 8K demo for Revision, as well as the more recent "impulsos" full demo.

I won't go deep into the technicalities and instead try to angle this on the idea and motivation side.

## multics

Wgslender packs a lot of stuff, it can do:

- minification
- validation (compilation like)
- reflection
- type-inference
- linter
- lsp
- CLI tool
- binary shader generation

Yes, thats it. A toolchain that does all that, and that can run everywhere. Everywhere as in, you do not need to setup a WebGPU context and build a shader module to get those compiler errors or get insights. It can run equally well in the CLI or in the browse or in your code, and has an LSP for in-editor insights and navigation. 

### Why everything at once?

I've found that in my workflows these things tend to live together or quite close to each other, and a lot of customizations and nuances that arise from usage could benefit all of these at once.

In wgslender there is one parser that all of them walk with the same identical lexer->initialization->parser flow. Also I want to perform combined operations, things like `minifyAndReflect` that share not only the same parser but also the analysis, ensuring that we get a stable report by construction not by rederiving it after the mangling.

Sharing code paths is a powerful design for this particular toolchain grounded in trees traversal, it allows for interchangeable operations and a really powerful LSP that can reparse incrementally without having to go through the whole parsing loop again.

### The LSP

The language server is not glued with spit on top of the tool but part of its design from the start. It shares the same memory AST/CST and splices and can perform the same passes in the interchangeable pipeline as the other tools.

It is a simple solution that can give me the minification overview while the shader is being written, saving me from having to rerun the CLI tool whenever i'm in doubt on how much a block of code would cost (in bytes, space).

It shares the same correctness and validation ground as the other tools, the output is consistent with what the validator compiler does, the types being shown are the same as the typechecker, etc... you get the idea. 

Oh yeah, and it runs in the browser, avoiding me from having to context switch to the CLI to do the minification and reflection and analysis while working in a WebGPU context.

### The CLI tool

In the command line, wgslender provides a thin shell over the shared library, allow you to run each of the parts individually but also customize them through flags.


```glsl
// example.wgsl
fn main() {
    let unused_var = 1.0;
    let x = 3.14159265;
}
```

In need of ESLint style of linting output? easy:

`wgslender lint --format stylish example.wgsl`

and you get:

```
example.wgsl
  1:4     warning  'main' is declared but never used  W0001
  2:9     warning  'unused_var' is declared but never used  W0001
  3:9     warning  'x' is declared but never used  W0001
```

## The best part

Use the CLI  and run `wgslender validate` (or the LSP, or the lib in your code, all the same):

Compilation errors and validation in the CLI without having to setup a WebGPU context and create ShaderModules. This my friends is a life-saver for me!

All offline, without a `navigator.gpu` or a browser forcing us into weird async round-trips at specific points of execution.

This means that you get to see those `let x: i32 = 1.0;` errors at the speach of touch.

_`error: cannot initialize 'x' with type 'abstract-float' (expected 'i32')`_

Not only that but also does the [WGSL uniformity analysis](https://www.w3.org/TR/WGSL/#uniformity). Calling `workgroupBarrier();` from within an `if` condition that varies at each invocation? _`error: barrier function must only be called from uniform control flow`_.

It dramatically reduces the kind of stuff that you would find out about when the browser's WebGPU implementation rejected your shader at `device.createShaderModule()` and then force you to go through the async `getCompilationInfo()` to get the diagnostics.

## The second best part

When coding WGSL I tend to keep an open tab at the WGSL builtins page, why? [click on it and find out](https://www.w3.org/TR/WGSL/#builtin-functions).

Its a lot of sand for my truck, dozens of builtins, most with several overloads over generic `T/vecN<T>` shapes, nuances on uniformity in texture accesses, etc... so I keep it open and context-switch a lot into it.

This is also part of wgslender, the LSP shares the same code paths as the validator, and are always in sync, with a documentation view layer over data that pops the with a helpful text whenever you are working with builtins, either by completing as you type or just as you hover them to see what signature they have. Does not substitute the spec, but it reduces the switching when you only need a quick overview to keep interacting with the code.

## The weird part: binary shaders

One common complain with WebGPU is that it does not support binary shaders, and by that it is typically meant that it does not support already compiled shader modules. It is a valid point, however shader compilation tends to be quite fast in WebGPU implementations, like really fast, because the weight is commonly defered to the pipeline creation, and that is much trickier to pass around as binary.

Leaving runtime performance aside, and focusing on the WGSL aspect only for the web in size-constrained scenarios, `wgslender` can produce a binary tiny self-contained .wasm module whose only job is to regenerate the WGSL source text at runtime. You can't feed it directly to WebGPU because there is no support for that, but WASM is a generic computation machine that can be leveraged to work as a bundler for big shaders.

This means the shader text is [mangled](https://en.wikipedia.org/wiki/Byte-pair_encoding) inside a binary wasm, and then demangled when executed. For small shaders (~5KB) it does not compensate, you are better off with traditional minification+gzip, but for big shaders there  are gainz to be had. Unless you don't care about this at all ahah.

See the Benchmark if you are interested in more data around this idea.

