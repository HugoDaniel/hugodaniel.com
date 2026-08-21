+++
title = "Declarative WebGPU with S-expressions"
description = "Bringing SJON to pngine"
date = 2026-08-16
draft = true
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/hugo_dog.jpg", class = "narrow-media", modules = [] }
+++

```clojure
(shader-module :name code :code """
@vertex
fn vertexMain(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {
  var pos = array<vec2f, 3>(
    vec2(0.0, 0.5),
    vec2(-0.5, -0.5),
    vec2(0.5, -0.5)
  );
  return vec4f(pos[VertexIndex], 0.0, 1.0);
}

@fragment
fn fragMain() -> @location(0) vec4f {
  return vec4(1.0, 0.0, 0.0, 1.0);
}
""")

(render-pipeline :name pipeline
  :layout auto
  (vertex :module code :entry vertexMain)
  (fragment :module code :entry fragMain
    (target :format preferred-canvas-format))
  (primitive :topology triangle-list))

(render-pass :name trianglePass
  (color-attachment :view context-current-texture
    :clear-value [0 0 0 0] :load-op clear :store-op store)
  :pipeline pipeline
  (draw :vertex-count 3))

(frame :name main :perform [trianglePass])
```

This is a simple red triangle done in WebGPU using S-expressions for the plumbing that match 1:1 with the [WebGPU spec](https://www.w3.org/TR/webgpu/).

## But why?

Back in another life, I used to [do Haskell](https://hackage.haskell.org/user/HugoGomes), mostly graphics and weird ideas. Haskell shaped a lot of my software engineer career and approach.

Because of it I find the WebGPU spec a lovely piece of design and architecture, in my mind it is implicitly composed of two blocks:

1. Things that describe what exists (like the immutable pipelines, layouts, buffers and textures configs)
2. Things that describe what should happen in a sequence (like sequential impure pieces you bundle to be run in a queue)
 
Haskell is a whole general purpose language that reifies effects as values, but if you pay attention on this angle you might find that this is a thing that shows in a lot of other places in the software world too: an immutable description of what exists, plus an ordered list of steps over it, with a thin seam between the two.

In pngine `frame` is the only place order matters, and each name in `:perform` refers to a pass declared elsewhere in the file:

```clojure
(frame :name main :perform [
  update-uniforms
  update-textures
  sdf-pass
  post-processing
])
```

<!-- Bret Victor way back then even made a drawing app UI on top of these two concepts. -->

<!-- [![A UI app with Data as a declarative block, and Steps as a sequence of instructions also being declared](/images/bret-victor-ui-app.webp)](https://www.youtube.com/watch?v=ef2jpjTEB5U) -->

## Deterministic tooling for the age of probabilistic tools

I have currently three tools that give you checkable inputs ahead of execution:

- **SJON:** a generic S-expression data language with a schema-driven validation engine.
- **wgslender:** WGSL shader language reflection and validation without a WebGPU context, it can run anywhere.
- **pngine:** WebGPU workload in a single file, uses SJON to have S-expressions that match 1:1 with the WebGPU spec.

In all of these a document is checkable ahead of execution, errors are carefully crafted to point direction and possible intents.

They all share a similarity with what WASM does with their [WAT file format](https://developer.mozilla.org/en-US/docs/WebAssembly/Guides/Understanding_the_text_format), you can read and write it, it is easily debuggable, but it kinda leans more into being a target representation than the source of the thing, unless you enjoy writing low level things like me, then it works fine as a source too, a very consistent one (S-expressions prefix notation).

The rest of this post is about pngine and its WebGPU language and engine-agnostic representation.

