+++
title = "Infinite grid with just one square"
description = "Creating an infinite grid of squares drawing multiple instances of the same single shape. Exploring a bit of what WebGL 2 provides."
date = 2021-03-24
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/infinite_square_grid.png", class="center-images with-lists" }
+++

Around 2017, I took up more seriously the "Grid Generator" project.
A Web App to explore the possibilities of an infinite grid of squares.
Driven primarily out of curiosity, I wondered if even I could create something cool with an endless grid of customizable squares?

I spent almost two years on it. Two years of trial and error iterations in code, UI, product orientation, business, and failing hard at all those things and so many others. "This time will be different."

![A square grid with some squares painted in random colors](/images/square_grid.png "This grid is infinite.")

## WebGL 2 flex its wings.

To do an infinite grid in WebGL 1, I used many buffers and sluggish texture updates at each frame (and vast texture atlases).
The shaders code was a mess. Memory usage was like a rocket while at use.
It also did not benefit from my rusty elementary math and miscalculations,
breaking at most of the device's pixel ratios and CPU usage abuse wrapped in leaky abstractions.

The plan now is to change the part that needs to be improved: _the WebGL version._

## Single, in shape

WebGL focuses on triangles. A square is nothing more than two triangles glued together.

There are a couple of primitives to describe triangles with WebGL. The _"triangle fan"_ has excellent properties that I like to use. It allows triangle meshes to be represented by adding vertices on top of a root vertice. It is not only fast to process a triangle fan mesh, but it also can save a lot of space by avoiding vertices to be repeatedly declared per triangle.

<video autoplay="autoplay" muted loop preload width="100%" playsinline>
  <source src="/videos/triangle_fan.webm" type="video/webm">
  <source src="/videos/triangle_fan2.mp4" type="video/mp4">
</video>


On top of it, a **triangle fan** works well together with a **line stripe**.
I can create an outline for the shape using the same mesh of points, no need to provide an extra mesh of points just for it.

<video autoplay="autoplay" muted loop preload width="100%" playsinline>
  <source src="/videos/line_stripe.webm" type="video/webm">
  <source src="/videos/line_stripe.mp4" type="video/mp4">
</video>

There it is, a square and its outline all alone in the world.

## Take a square, for instance.

WebGL 2 brings [instanced drawing](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/drawElementsInstanced) mode for the mesh masses.

The process to use instanced elements is as follows:

1. Define a bunch of unique vertices (_4 vertices for a square_).
1. Define a single element by specifying the vertice indexes that make it up (_vertex 1, vertex 2, vertex 3, and so on_).
1. Say how many occurrences of that element to render (_draw 5000000 instances of this square!!_)

A square would have _4_ vertices total, _1_ triangle fan element, and _1_ instance of it for a single one.

Using instances of a simple mesh can be faster to draw (fewer draw calls per frame).
More importantly, the seed mesh can be changed to any shape, effectively giving infinite grids of any tileable form (or non-tileable if its your thing).

## Infinity is a long way, especially towards the end.

An infinite grid needs to have at least enough squares to fill the whole screen, plus padding of one row and one column to accommodate the grid's panning.

The exact number depends on both the square size and screen size. With a 16x16 pixels sized square, at least ~8300 instances are needed to cover a 1920x1080 pixels canvas ((1920 / 16) * (1080 / 16) + padding[1920 /16 +1080/16]).

A common approach to make it look infinite is to adjust its x and y position to be `size - pan % size`  when moving the grid.

I tried many variations of this _modulo and division_ approaches in the past "with varying degrees of success" (read: failure ☠️).
Either precision errors started showing in some grid transformations (zooming, rotation, etc.)🔥, or subtle flickering would appear because of minor miscalculations ؇ that would then get emphasized with the conversion between the JavaScript 64bit floats and the GPU 32bit floats, or 🙈 squares would disappear.

So nothing unusual, just another day with my code 🤯.

Scrap all that. In the end, the best approach for an infinite grid that these two neurons could muster is more straightforward than those modulo and margin square adjustments.
It goes like this:

1. Set up an [orthographic viewport projection](https://en.wikipedia.org/wiki/Orthographic_projection) transformation.
1. When it moves/zooms, place the squares in it at the positions they would typically be at (i.e., no modulo or tricks or transformations, start at the top left index for the current viewport transformation and fill the screen with squares).
1. Only place the number of squares needed to fill the viewport.

Here is a rough sketch:

<video autoplay="autoplay" muted loop preload width="100%" playsinline>
  <source src="/videos/ortho_projection.webm" type="video/webm">
  <source src="/videos/ortho_projection.mp4" type="video/mp4">
</video>

It is easy(er), and the GPU can do these calculations at lightning speed.

## Pick me up before I go.

In the streets of graphics programming, selecting the grid element below the mouse pointer or at the touch position is sometimes called "picking". You "pick" the shape by mousing over it or touching it with those beautiful fingers.

The typical "simple" approach to perform this involves doing the intersections with the shape and the mouse position with JavaScript (thus in the CPU). Calculating this intersection is a specialized function for each figure. Doing it in a square grid is "very easy" when all the squares always align with the x/y axis and have the same size.

However, I want to explore a standard "picking" technique that works with any shape.
A global picking method compatible with anything I can throw at it.

It goes like this:

1. Draw the grid into multiple targets, the screen, and an array in GPU memory.
1. On the screen, paint the shapes as expected (their colors, etc.). On the array in memory, "paint" only the shape ids.
1. When the mouse moves/interacts, get the shape id by reading the pixel at the current mouse position from the shape ids array.

<video autoplay="autoplay" muted loop preload width="100%">
  <source src="/videos/mrt.webm" type="video/webm">
  <source src="/videos/mrt.mp4" type="video/mp4">
</video>

This way, it is possible to get the shape id at each screen pixel, and when the mouse moves over a pixel or a finger touches the screen, the code looks for the shape id in the array of shape ids instead.

### Jargon

This technique is sometimes named "single-pass picking" and makes use of WebGL MRT ([Multiple-Render-Targets](https://www.khronos.org/registry/webgl/specs/latest/2.0/#3.7.11) - the screen and the array) and PBOs ([Pixel-Buffer-Objects](https://www.khronos.org/registry/OpenGL/specs/es/3.0/es_spec_3.0.pdf#subsection.3.7.1) - arrays to use as if they were a screen).

### Benefits

It can work with any shape, with no need for special intersection functions.

### Drawbacks

- It is much slower than using specialized intersection functions.
- It requires extra memory for the arrays, and they need additional copies to leave the GPU and reach the CPU.
- It can introduce "pipeline stalls" (WebGL is primarily a "write-only" API, intended to write colors to the screen/arrays - things can get complicated when reading these values back from WebGL).

### Optimizations

Many optimizations can limit these drawbacks. Here is my favorite optimization of them all:

- Do nothing. Avoid work at all costs.

That is a 100% optimization right there. It beats "doing it faster" every time. Some even apply this to life in general with great success.

For this particular case of shape picking, it can be fruitful to avoid doing any work at all for the most part.
Reading pixels from the screen/array is expensive and complicated.
In WebGL, this requires at least one [flush](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/flush) and one [sync](https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext/fenceSync) outside of the frame boundaries (besides the array copy).

These are not only hard to perform but also carry severe performance costs. They are not a good fit for every mouse move or frame.

The case of the grid is a curious one: interacting with its elements happens when the grid is stopped, if someone is interacting with a grid element then they are not moving/zooming the grid.
A grid changes when there is a panning or zooming action. Besides those two actions, it stays the same. The shape ids are at the same position all the time (even if their contents change, the ids remain at the same place provided no translation or zooming is going on).

Interacting with grid elements only happens after the pan/zoom action finishes, which is the perfect place to "hide" the flush/sync/copy operation. Once right after the panning/zooming ends, WebGL renders the shape id's to multiple targets, flushes/syncs, and copies the array to the CPU, where it stays static forever (at least until some following pan/zoom operation finishes). Interacting with the grid is then only about reading this array for shape ids, with no need for WebGL or position updates.

## What is next for `<shader_canvas>`?

You can read the code for this at the [Shader Canvas repository](https://github.com/HugoDaniel/shader_canvas/tree/main/examples/6-infinite-grid) (still in progress).

[Shader Canvas](/projects/shader-canvas/) is my low-level framework for graphics programming. It consists of HTML tags that perform each WebGL function, bringing the API into a declarative space.

I am working on its second iteration after the first release. I will evolve and use this framework for my next drawing web app called "Shape The Pixel".
The road ahead for `<shader_canvas>` is like this in my head, things are going to change for sure:

1. Release `<shader_canvas>` proof of concept ([occured in 2021-03-03](https://hugodaniel.com/posts/high-level-webgl-low-level-tags/))
1. The first iteration of the proof of concept with a focus on its modules (in [2021-03-15](https://github.com/HugoDaniel/shader_canvas/blob/main/CHANGELOG.md))
1. A second iteration of the proof of concept with a focus on framebuffers and texture arrays/atlas (_ongoing_)
1. A third iteration of the proof of concept with a focus on animation and transform feedbacks (to be done)
1. Version 2.0.0 release:
  - Change it into a simple "compiler."
  - Provide the first support for the Metal graphics framework.
  - It will only happen when the "Shape The Pixel" web app is released, and the [deno_tag](https://hugodaniel.com/posts/introducing-deno-tag/) and the [GLSL parser](https://deno.land/x/glsl_variables@v1.0.2) get some planned updates - they are all connected 🤫.
  - _Demos and examples will only show up here at this 2.0 stage_

### Conclusion

<video autoplay="autoplay" muted loop preload width="100%">
  <source src="/videos/sq_grid.webm" type="video/webm">
  <source src="/videos/sq_grid.mp4" type="video/mp4">
</video>

Drawing an infinite grid in WebGL 2 can be done using its instance drawing functions to avoid repeating vertices and multiple-render-targets for picking.
Read the pixels only once when the grid panning/zooming operation finishes to avoid WebGL pipeline stalls.
Using these two WebGL graphics techniques allows for infinite grids of custom shapes so that shape updates happen (mostly) only at the single seed mesh/shape level.

<video autoplay="autoplay" muted loop preload width="100%">
  <source src="/videos/tris.webm" type="video/webm">
  <source src="/videos/tris.mp4" type="video/mp4">
</video>

