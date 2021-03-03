+++
title = "High-level WebGL. Low-level tags."
description = "This article introduces shader-canvas, a graphics framework that is the fruit of my Web Components experimentations and WebGL experience. It describes the motivations behind it and the idea that triggered its development."
date = 2021-03-03
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/webgl-logo.png", class="center-images with-lists" }
+++

When people think about the WebGL API, they focus on one of the famous libraries
that use it. Typically ["three.js"](https://threejs.org) or
["Babylon"](https://www.babylonjs.com). There's barely any motivation
to use the WebGL API directly. But the WebGL API is still just as important to
know as it provides creative ways to place colors in browser pages.

The [WebGL spec](https://www.khronos.org/registry/webgl/specs/latest/1.0/#1) even starts by saying:

_Given the many use cases of 3D graphics, WebGL chooses the approach of providing
flexible primitives that can be applied to any use case. Libraries can provide
an API on top of WebGL that is more tailored to specific areas, thus adding a
convenience layer to WebGL that can accelerate and simplify development. However,
because of its OpenGL ES 2.0 heritage, it should be straightforward for
developers familiar with modern desktop OpenGL or OpenGL ES 2.0 development to
transition to WebGL development._

WebGL was made closer to OpenGL ES 2.0 (a C/C++-oriented framework) than closer
to its sibling web APIs.  

For a front-end developer, programing directly in WebGL feels like juggling
many unseen global variables while struggling to understand why functions take
those strange byte arguments.

![Three colored COVID face masks on top of each other](/images/maskontop.png)

## Graphics frameworks that work on top of graphics frameworks

Fortunately, there are a lot of frameworks that simplify our life when dealing
with the WebGL API. The most recent web-trend of these use threejs and tries to
bring back some helpful [VRML](https://en.wikipedia.org/wiki/VRML)-like concepts through tags/components. For React,
there is ["react-three-fiber"](https://github.com/pmndrs/react-three-fiber).
For Web Components, the ["a-frame"](https://aframe.io), and recently
["troisjs"](https://troisjs.github.io) for Vue, among many others.

These frameworks provide the same sort of standard graphical decomposition.
They use _"cameras"_ pointed into a _"scene"_ of _"objects"_ with _"materials"_
and _"transformations"_ applied to them.

## Why use WebGL directly?

Using the WebGL API directly, at the very least, helps you understand how it
works and consequently how those trendy high-level graphics frameworks get to
deploy their concepts. It is not for the faint of heart. WebGL is a low-level
API that inherits a lot of stuff from OpenGL ES, inheriting a lot from OpenGL,
inheriting a lot from the 90s. Oh, the 90s, the dark ages of API design.

All that taken into consideration, there are some **real** benefits for the
enthusiastic programmer:

- **Learn an abstraction of GPU graphics and primitives:** in WebGL, there are
  no _"cameras"_ or even a _"scene"_ with _"materials"_. Instead, you get to use
  _"buffers"_ and _"programs"_, and _"vertex array objects"_ in _"shader"_ code
  written with a specific syntax.
- **Focus on shaders:** WebGL is all about the code that runs ultra fast in the
  GPU, using specific techniques to leverage high-performance parallel runs.
- **Immediate mode API:** Learning how to use an immediate mode graphics API is
  cool to understand how it is biased towards baking things in initialization
  to reduce the draw calls that get executed at runtime.

If you are willing to go down that rabbit hole, [start here](https://www.khronos.org/webgl/wiki/Getting_Started)
and proceed with the excellent [WebGL 2 Fundamentals](https://webgl2fundamentals.org).

## Abstract the frustration away

With WebGL, even simple things take quite a bit of code. A simple image is
never "simple". It can require pages of code in setup and initialization and a
whole WebGL global state system that needs to be maintained.

![A tree with COVID masks as leafs](/images/masksontree.png)

As a result, 10 years ago, back in the early days of WebGL (which today has
its 10th anniversary!), a few libraries showed up that used a thin abstraction
layer on top of it and tried to deal with the boilerplate JS code.
[lightgl.js](https://github.com/evanw/lightgl.js/) is one of these notorious
libs.

Writing and maintaining the WebGL boilerplate can be quite a traumatic
experience for the aspiring front-end developer. There are many formulations
of its concepts that have evolved through these 10 years.

## Being declarative without losing the WebGL domain

The new graphics frameworks bring into the declarative space the primitives
that threejs handle in code. They do it subtly by bridging DOM libraries
(React, Vue, or even bare Web Components) and standard high-level graphics
primitives.

HTML tags are excellent in providing sequence and hierarchy in a declarative
way. Their structure is an easy match for scene graphs.
[VRML](https://en.wikipedia.org/wiki/VRML) was onto something, and now we know
it.

What if this declarative tag-oriented approach could be used in the WebGL
domain primitives instead of the typical camera/scene graph representation?

## Meet [`<shader-canvas>`](/projects/shader-canvas)

In my life quest of making different drawing tools and apps, I find myself
leaning more towards using buffers and GLSL programs than with "cameras" and
nodes.

I am not a graphics programmer by trade and tend to start thinking about
shader code and how data will flow with it before any other graphical
abstraction. This was a strong motivation to create a low-level WebGL
abstraction that could be easily visible and declared with tags.

![A cube defined by its edges, each edge is a rainbow](/images/rainbowcube.png)

The idea is simple and two-fold:

1. Create an HTML tag for each WebGL function.
2. Have HTML tags to contain the instances of WebGL primitives.

After experimenting for a while with Web Components, I have come up with the
library's initial version.

<a class="project-button" href="/projects/shader-canvas">The shader-canvas project site.</a>

It purposely has no graphics or fluffy examples to watch at this stage. It is
a proof-of-concept and the base of my future work.

## Closing thoughts

Before I started doing [shader-canvas](/projects/shader-canvas), I repeatedly wrote the same WebGL code
with small nuances. I looked for inspiration in other libraries in how to
decompose graphical problems. The part that intrigued me most was the balance
between the WebGL API's low-level aspects and its high-level compositions. It
should be possible to target a lower-mid-level of abstraction.

Today is the 10th anniversary of WebGL. It felt appropriate to write about it
and introduce [shader-canvas](/projects/shader-canvas) together with some of
the motivation behind it.

[Shader-canvas](/projects/shader-canvas) is a graphics framework that uses HTML
tags to perform the WebGL
API calls and manage its primitives. It does not have a camera or a scene.
Instead, there is a set of tags to declare most of the recurrent WebGL code
that I found myself writing over and over.

<hr></hr>

Shader canvas is the product of Web Components explorations that I have been
writting about. Check out [the whole series](/posts/the-life-of-a-web-component-series/).
