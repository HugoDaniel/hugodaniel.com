+++
title = "PNGine: a WebGPU shader portability engine"
description = "Introducing PNGine, a minimal engine that bundles WebGPU shaders and pipelines into portable PNG files."
date = 2025-12-31
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/pngine.png", class="center-images with-lists", modules = ["modules/pngine-demo.js"] }
+++

I've been working on a minimal shader portability engine since mid-2024. It was
used by me and my friend icid to create a demo for the Inércia demoparty 2025
that happened in Almada in early December.

The demo failed spectacularly.

We couldn't show it during the competition because it crashed the browser tab on
the machine running the demos. Shortly after, we found it also didn't work on
most computers and devices. At one point it even stopped working on my own
machine.

After the party we spent a few days thinking over what went wrong. That led me
to fix and redesign parts of the engine, optimize loose ends I'd left for
"future me or some capable LLM," and finally write this post before the story
repeats itself.

<video controls muted loop preload width="100%">
  <source src="/videos/pngine.webm" type="video/webm">
  <source src="/videos/pngine.mp4" type="video/mp4">
</video>

## What PNGine Is

Bundle WebGPU shaders and pipeline configuration into a single portable file.
Run it anywhere with a small viewer.

That's it. One file containing your render passes, compute shaders, buffers,
textures, bind groups, etc. Hand it to a viewer on any platform with WebGPU
support, and it can be played.

The file can be a PNG. The PNG format allows custom binary chunks after the
image data, working roughly like a .zip that holds things in it but in this case
it shows a picture by default (the png image).

Embed your WebGPU bundle in the PNG, and suddenly images can move if you have a
viewer that can look for the WebGPU bundle in them. It feels a bit like magic.

But PNGine also works with plain .zip files if you prefer. The PNG thing is just
the flashy option.

## What This Is Not

**Not an animation format.** For that, use Rive or Lottie.

**Not a new vector format.** For that, use SVG or something like that.

**Not a design tool.** For that, use Figma or Sketch.

**Not a rendering engine.** You write the shaders. PNGine just packages and runs
them. Maybe it should have been called DIYengine.

**Not a way to make any PNG move.** The image is just a container. Most of my
files are actually .zip.

## How Small?

Self-contained PNGs with embedded WebGPU information and executor:

A triangle: **~13 KB** (500 bytes bytecode + tailored executor).

A rotating 3D cube with depth buffer: **~14 KB**.

A full boids flocking simulation with compute shaders: **~20 KB**.

Embedding the WebGPU information and its executor in the .png guarantees that
they are self contained. No need to be fighting mismatching players/viewers
versions bugs that can only play certain payloads in certain ways.

A PNG holds everything that it needs to be played as it was intended when it got
bundled by the creator of the visuals being shown. Everything except the tiny
extractor you need to have to read these extra chunks.

## How?

From a design perspective, the WebGPU instructions got moved into a full
declarative space. Things are described in a Domain Specific Language that
follows the spec but declares the whole WebGPU non-iteratively, abstract enough
so that it can be decomposed into a payload that can be run in the browser or in
your favorite native WebGPU implementation (
[dawn](https://github.com/google/dawn), [wgpu](https://github.com/gfx-rs/wgpu),
any compatible web browser, etc...).

The DSL compiles to a custom bytecode, which DEFLATE-compresses into the PNG.
The compiler builds a tailored WASM executor containing only the parts your
shader needs to run—typically 12-18 KB. Together they're small enough to inline
in HTML or use as a favicon.

## The DSL

The user facing part of PNGine uses a domain-specific language that maps
directly to WebGPU. The rule is simple: every `device.create*()` function
becomes a `#macro`:

```
device.createBuffer(...)         →  #buffer name { ... }
device.createTexture(...)        →  #texture name { ... }
device.createRenderPipeline(...) →  #renderPipeline name { ... }
```

The "create" disappears, "#" takes its place, and you give it a name to
reference elsewhere. What goes inside `{ }` are the function arguments, written
as `name=value`. The names come directly from the WebGPU spec—I didn't invent
them.

Here's a minimal triangle:

```
#shaderModule code {
  code="
    @vertex fn vs(@builtin(vertex_index) i: u32) -> @builtin(position) vec4f {
      var pos = array<vec2f, 3>(
        vec2f(0.0, 0.5),
        vec2f(-0.5, -0.5),
        vec2f(0.5, -0.5)
      );
      return vec4f(pos[i], 0.0, 1.0);
    }

    @fragment fn fs() -> @location(0) vec4f {
      return vec4f(1.0, 0.5, 0.0, 1.0);
    }
  "
}

#renderPipeline pipeline {
  layout=auto
  vertex={ module=code entryPoint=vs }
  fragment={ module=code entryPoint=fs targets=[{ format=preferredCanvasFormat }] }
}

#renderPass pass {
  colorAttachments=[{
    view=contextCurrentTexture
    clearValue=[0 0 0 1]
    loadOp=clear
    storeOp=store
  }]
  pipeline=pipeline
  draw=3
}

#frame main {
  perform=[pass]
}
```

Compile it: `pngine triangle.pngine -o triangle.png`

That's your ~500 byte triangle, embedded in a PNG alongside a WASM executor
ready to show it.

## Shape Generators

Writing vertex data by hand is tedious. So the compiler can generate it:

```
#data cubeVertices {
  cube={ format=[position4 color4 uv2] }
  // ^ a cube!
}

#buffer vertexBuffer {
  size=cubeVertices
  usage=[VERTEX]
  mappedAtCreation=cubeVertices
  // ^ names can be used as references to WebGPU parameters
  // The compiler understands and takes care of everything beforehand
}
```

This generates a unit cube with 36 vertices at compile time. The `format=`
specifies what attributes each vertex has: position, color, normals, UVs. No
more copying vertex arrays from tutorials.

Available shapes: `cube`, `plane`. More coming.

## Built-in Uniforms

For animation, you need time and canvas dimensions. Instead of wiring that up
yourself:

```
#buffer uniforms {
  size=16
  usage=[UNIFORM COPY_DST]
}

#queue writeTime {
  writeBuffer={
    buffer=uniforms
    bufferOffset=0
    data=pngineInputs
  }
}

#frame main {
  perform=[writeTime renderPass]
}
```

The `pngineInputs` identifier gives you 16 bytes every frame: time (f32), width
(f32), height (f32), aspect ratio (f32). Your shader just reads them.

This is the only builtin identifier of the engine. All custom uniforms can be
set using your data as initialization and are available in the viewer API to be
written to.

<video controls muted loop preload width="100%">
  <source src="/videos/balls.webm" type="video/webm">
  <source src="/videos/balls.mp4" type="video/mp4">
</video>

## The Architecture

```
┌─────────────────┐
│  DSL Source     │  Human-readable .pngine file
└────────┬────────┘
         │ compile
         ▼
┌─────────────────┐
│  PNGB Bytecode  │  ~500 bytes to ~8 KB
└────────┬────────┘
         │ embed
         ▼
┌─────────────────┐
│  PNG File       │  Image + bytecode + tailored executor
└────────┬────────┘
         │ load
         ▼
┌─────────────────┐
│  WASM Executor  │  ~15 KB, interprets bytecode
└────────┬────────┘
         │ calls
         ▼
┌─────────────────┐
│  WebGPU         │  Your GPU does the work
└─────────────────┘
```

The compiler does the heavy lifting. It parses the DSL, resolves references,
validates everything, and emits compact bytecode. The executor is deliberately
simple—it just reads opcodes and calls WebGPU functions. No surprises.

## WGSL shader strings

The shader strings are compressed in the PNG. They are validated and minified
through [miniray](/posts/miniray/). Miniray also provides special reflection
data on them which allows variables to be mapped before and after minification,
and accessed in a natural way through the viewer API, with all the memory
layouts and offsets already baked in.

## The Interpreter Trade-off

The WASM interpreter is bundled inside the PNG by default. The compiler analyzes
your DSL and builds a tailored executor containing only the parts you need
(render, compute, animation, etc.). This keeps each file self-contained—no
external WASM file to host or fetch and no complex viewer.

This has consequences:

**The bad:** If you have multiple PNGine canvases on one page, each loads its
own interpreter. The size accumulates, sure it's small, slowly but steadily.

**The ugly:** If I fix a bug in the interpreter, you need to recompile your
PNGine files. I can't just push a fix and have everyone benefit.

**The good:** If it works, it works. Future updates won't break it. You test it
where it needs to run, and that exact version ships with your file.

This trade-off made the interpreter a critical piece. It has to be tiny, fast,
and unsurprising. All complexity lives in the compiler, who does the heavy
lifting.

## The Viewer

A small amount of JavaScript loads and runs PNGine files executors with their
payloads:

```javascript
import { destroy, draw, play, pngine } from "pngine";

// Load from PNG into a canvas
const p = await pngine("shader.png", {
  canvas: document.getElementById("canvas"),
});

// Option 1: Let it animate
play(p);

// Option 2: Control it yourself
draw(p, { time: audioContext.currentTime });
draw(p, { time: videoElement.currentTime });
draw(p, { time: slider.value });

// Cleanup when done
destroy(p);
```

At its core, PNGine is stateless: `draw(p, { time })` renders one frame at a
specific time. You control when frames render.

But because "give me an animation loop" is so common, convenience functions
exist: `play(p)`, `pause(p)`, `stop(p)`, `seek(p, time)`. Use them or don't.
Hook it to WebAudio, a scroll position, a MIDI clock, or plain
requestAnimationFrame. Your call.

## Try It Yourself

<div class="pngine-demo">
  <div class="pngine-source">
    <img src="/images/pngine_logo.png" alt="PNGine Logo - a static PNG containing a shader">
    <p>This PNG contains a WebGPU shader. It looks static, but inside there's bytecode waiting to run.</p>
    <a href="/images/pngine_logo.png" download class="pngine-download">Download pngine_logo.png</a>
  </div>

<div id="pngine-drop-zone" class="pngine-drop-zone">
    <canvas id="pngine-demo-canvas" width="400" height="400"></canvas>
    <div class="pngine-drop-overlay">
      <p>Drop the PNG here to see it animate</p>
      <p class="hint">or click to select file</p>
    </div>
    <input type="file" id="pngine-file-input" accept=".png" hidden>
  </div>

<p id="pngine-demo-hint" class="pngine-hint">Drop the PNG above to watch it come to life.</p>
</div>

<style>
.pngine-demo { margin: 2rem 0; }
.pngine-source { text-align: center; margin-bottom: 1.5rem; }
.pngine-source img { max-width: 200px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.pngine-source p { margin: 0.75rem 0; color: #666; }
.pngine-download { display: inline-block; margin-top: 0.5rem; padding: 0.5rem 1rem; background: #C75D3A; color: white; text-decoration: none; border-radius: 4px; font-weight: 500; }
.pngine-download:hover { background: #a84d2f; }
.pngine-drop-zone { position: relative; width: 100%; max-width: 400px; aspect-ratio: 1; margin: 0 auto; border: 2px dashed #aaa; border-radius: 8px; overflow: hidden; background: #f9f9f9; }
.pngine-drop-zone.dragover { border-color: #C75D3A; background: rgba(199,93,58,0.1); }
.pngine-drop-zone canvas { width: 100%; height: 100%; display: block; }
.pngine-drop-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(255,255,255,0.95); cursor: pointer; }
.pngine-drop-overlay p { margin: 0.25rem 0; }
.pngine-drop-overlay .hint { font-size: 0.85em; color: #666; }
.pngine-hint { text-align: center; color: #666; margin-top: 1rem; font-style: italic; }
@media (prefers-color-scheme: dark) {
  .pngine-source p { color: #aaa; }
  .pngine-drop-zone { background: #2a2a2a; border-color: #555; }
  .pngine-drop-zone.dragover { background: rgba(199,93,58,0.2); }
  .pngine-drop-overlay { background: rgba(30,30,30,0.95); }
  .pngine-drop-overlay .hint { color: #888; }
  .pngine-hint { color: #888; }
}
</style>

## The CLI

The command-line tool compiles, validates, and inspects:

```bash
# Compile to PNG with embedded bytecode and executor (default)
pngine shader.pngine -o shader.png

# Smaller PNG without executor (needs shared pngine.wasm at runtime)
pngine shader.pngine --no-executor -o shader.png

# Render an actual frame (not just embed)
pngine shader.pngine --frame -s 1920x1080 -o preview.png

# Validate and see what GPU calls it makes
pngine check shader.png --verbose
```

The `--verbose` flag on check shows every GPU call the bytecode will make. Good
for debugging why your shader isn't doing what you expect.

## How to Use It

Currently PNGine only supports web browsers. iOS and Android viewers are coming
soon™ (when we decide on making a demo for them and see if they crash ahah).

```bash
npm install pngine
```

Create a `.pngine` file with your shaders and pipeline setup. Compile it:

```bash
npx pngine myshader.pngine -o myshader.png
```

Load it in your page:

```javascript
import { play, pngine } from "pngine";

const p = await pngine("myshader.png", {
  canvas: document.getElementById("canvas"),
});
play(p);
```

That's it. Your shader is now a PNG that plays anywhere WebGPU runs.

## Target Users

Like all things I do for fun, this is a Public Domain (CC0) project.

I built it for myself, to spend more time writing WGSL shaders and less time on
boilerplate. I'm exploring scenarios where I can make mini creative tools for
future Inércia demos, maybe resurrect old projects in this rendering approach.

If you like shaders and want a fun way to package and share them without big
limitations on expressiveness, maybe PNGine won't be a total waste of your time.

## Next Inércia

Will this crash the demoparty competition machine again? Probably. But at least
now I can run `pngine check demo.png --verbose` and see exactly what GPU calls
it makes before I embarrass myself.

I am still working on the proper site for this with one of those fancy landing
pages. The source is on [GitHub](https://github.com/HugoDaniel/pngine). The
Inércia demo that failed is somewhere in my shame folder.

See you at the next demoparty.
