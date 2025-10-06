+++
title = "WebGPU and the price of compiling WGSL"
description = "Introducing a WebGPU info and timing tool"
date = 2025-10-07
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/webgpudiagnostics.webp", class="center-images with-lists" }
+++

Welcome, in the previous two posts I went looking for the WGSL limits (both
[in the spec](/posts/webgpu-shader-limits/), and also
[out of it](/posts/webgpu-shader-unknown-limits/)).

In this post I want to introduce a simple WebGPU app where you can create WGSL
shaders by dragging some sliders to increase their complexity.

The idea is that compilation time and complexity can be known for the compute
and rendering pipelines as well as in their different stages (vertex and
fragment).

This is important to me because I wanted to know how much it costs to increase
the shader complexity and where it might be worth to start considering using
buffers/textures for some of it.

### How long does it take to compile a 3Megabyte vertex shader?

Easy to know, here is the single result of the cold timings in Chrome
(140.0.7339.215) from my Intel MacBook Pro (2019):

![Timings for a 3Megabyte vertex shader](/images/vertexshadertimings.webp)

### How about a 30Megabyte vertex shader??

![Error compiling vertex shader](/images/vertexshadererror.webp)

It errors. Ah!

![WebGPU logo with a stopwatch](/images/webgpudiagnostics.webp)

## The tool

A simple tool, along the lines of the awesome
[WebGPU report](https://webgpureport.org/), but not as exhaustive.

**You can find it here:**
[WebGPU Diagnostics (and compilation benchmark) tool](/pages/webgpu-diagnostics/).

My intention was to compose it of 3 major parts:

1. A simple sample (a rotating triangle).
1. Shader complexity sliders and timings (compilation, adapter request and
   pipeline creation).
1. Device and adapter info (features, and announced limits)

### Rotating triangle

The rotating triangle is made from the 3 initial shaders. A compute shader
outputs vertices, then a vertex shader transforms them, and finally a fragment
shader paints it.

<video id="triangleVideo" src="/videos/rotating-triangle.mp4" controls style="width: 100%"></video>

I think of this as a kind of "hello world" for WebGPU but also as a simple
program that performs the happy path of the fastest rendering possible (or close
to it).

The idea along the app is that this triangle **never changes**. It always
remains the same as the shader complexity increases.

### Shader complexity sliders

Shader complexity can be increased at each pipeline stage. This includes
separating the vertex shader from the fragment shader into different modules, to
allow testing how much they differ (if they do at all).

![Image of the shader sliders in the WebGPU Diagnostics tool](/images/sliders.webp)

The shader string is created before compilation starts. This is done in a
WebWorker thread to keep the UI responsive (as much as possible) as memory and
string traversal time increases.

I wanted to make these sliders biased towards complexity. A small change in them
has to make the shader size increase by quite a bit. Making them purposefully
unbalanced to ensure that device limits can be checked.

### What WGSL code the sliders generate?

They are split into three categories:

1. Number of functions - dump n functions with 1 `f32` argument each that return
   the single variable declared in the body.
1. Number of statements - for each function in 1., creates n statements that
   just do a simple assignment.
1. Expression depth - for each statement in 2. expands it to have n sums.

So if we set them all to 8 (8 functions, each with 8 statements, each with 8
sums), it produces a 5Kilobyte file.

You can check the generator code
[here](https://github.com/HugoDaniel/webgpu-diagnostics/blob/main/src/generator.js).

<details>
  <summary>Or click here to see the output produced with the three sliders at value 8</summary>
  <code class="error-content">
  <pre>

struct Vertex { position: vec3f, color: vec3f, }

struct Params { angle: f32, }

// Storage buffer that will hold our generated vertices @group(0) @binding(0)
var<storage, read_write> vertices: array<Vertex, 3>; @group(0) @binding(1)
var<uniform> params: Params;

fn function0(a: f32) -> f32 { var tmp: f32 = 0.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; return
a + tmp; }

fn function1(a: f32) -> f32 { var tmp: f32 = 0.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; return
a + tmp; }

fn function2(a: f32) -> f32 { var tmp: f32 = 0.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; return
a + tmp; }

fn function3(a: f32) -> f32 { var tmp: f32 = 0.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; return
a + tmp; }

fn function4(a: f32) -> f32 { var tmp: f32 = 0.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; return
a + tmp; }

fn function5(a: f32) -> f32 { var tmp: f32 = 0.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; return
a + tmp; }

fn function6(a: f32) -> f32 { var tmp: f32 = 0.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; return
a + tmp; }

fn function7(a: f32) -> f32 { var tmp: f32 = 0.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp +=
0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; tmp += 0.0+1.0+2.0+3.0+4.0+5.0+6.0+7.0; return
a + tmp; }

// Compute shader that generates a triangle's vertices @compute
@workgroup_size(1) fn compute_main(@builtin(global_invocation_id) global_id:
vec3u) { var accum: f32 = 0.0; accum += function0(8.0); accum += function1(8.0);
accum += function2(8.0); accum += function3(8.0); accum += function4(8.0); accum
+= function5(8.0); accum += function6(8.0); accum += function7(8.0);

// Generate 3 vertices for a triangle // We only need one invocation for this
simple example if (global_id.x == 0) { let angle = params.angle + accum *
0.0001; let cos_angle = cos(angle); let sin_angle = sin(angle); let
base_positions = array<vec2f, 3>( vec2f(0.0, 0.5), vec2f(-0.5, -0.8), vec2f(0.5,
-0.5) );

      let top = vec2f(
          base_positions[0].x * cos_angle - base_positions[0].y * sin_angle,
          base_positions[0].x * sin_angle + base_positions[0].y * cos_angle,
      );
      let left = vec2f(
          base_positions[1].x * cos_angle - base_positions[1].y * sin_angle,
          base_positions[1].x * sin_angle + base_positions[1].y * cos_angle,
      );
      let right = vec2f(
          base_positions[2].x * cos_angle - base_positions[2].y * sin_angle,
          base_positions[2].x * sin_angle + base_positions[2].y * cos_angle,
      );

      let depth = clamp(accum * 0.001, -0.5, 0.5);

      // Top vertex (red)
      vertices[0].position = vec3f(top, depth);
      vertices[0].color = vec3f(1.0, 0.0, 0.0);
      
      // Bottom-left vertex (green)
      vertices[1].position = vec3f(left, depth);
      vertices[1].color = vec3f(0.0, 1.0, 0.0);
      
      // Bottom-right vertex (blue)
      vertices[2].position = vec3f(right, depth);
      vertices[2].color = vec3f(0.0, 0.0, 1.0);

} }

</pre>
</code>

</details>

### Device and adapter info

The features and limits is a nice thing to have in these kind of tools. They are
not used, just communicated. A lot of them I don't know what they do, so I
included a link to the corresponding WebGPU spec chapter.

An important part here is that I wanted to separate the _adapter_ limits from
the _device_ limits. These can be different, and knowing these differences might
be important when we are aiming for the upper end of the lot.

In WebGPU the adapter limits can be seen as the announced values of what might
exist, while the device limits can be seen as what we have to work with.

These can be requested through the
[requiredLimits](https://developer.mozilla.org/en-US/docs/Web/API/GPUAdapter/requestDevice#requiredlimits)
on creation.

## Extra motivation

Another important part of motivation for doing this was to use
[boreDOM](https://hugodaniel.com/pages/boreDOM/). A minimal JS framework that I
created as a fun project that tries to do what major JS frameworks do but with a
different approach just because why not? (no bundling, no compilation, no
minification, and small size).

It was fun and cool to see that it works without bundling/compilation while
handling WebGPU's complexity.

## Conclusion

Go ahead, play with it a bit [here](/pages/webgpu-diagnostics/) and let me know
how your device and browser reacts to massive shaders.

I found that there is a significant difference between cold and warm compilation
times. This cold vs warm timing distinction could be interesting to explore
further, and maybe it could even be leveraged/exploited to hide extremely
complex shaders by splitting them in many small pipelines (just a wild
hypothesis at this point i guess).

This post wraps the WGSL limits endeavour. For the next ones I might be
introducing a rendering engine I am working that tries to perform with rendering
the same spirit as boreDOM has to JS frameworks. Thanks for reading all of this
and stay tuned!
