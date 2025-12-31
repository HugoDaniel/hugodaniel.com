+++
title = "New year ultrathink"
description = ""
date = 2025-12-16
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/pngine.webp", class="center-images with-lists" }
draft = true
+++

I've been working in a minimal shader portable engine since mid-2024. It was
used by me and my friend icid to create a demo for the Inércia demoparty 2025
that happened in Almada in early December.

### Target users

This is not a commercial project. It is licensed as Public Domain (CC0), and is
intended to be useful to me, to allow me to code more of what I like (WGSL
shaders and WebGPU pipelines) and less of other things. I am also exploring
scenarios where I can use this to make mini creative tools in the pursuit of
doing cool effects for further Inércia demos. Perhaps even try to resurrect old
projects in this rendering approach.

If you like to do shaders, and are looking for fun creative ways to show and
deliver them without big limitations in expressiveness, then maybe PNGine won't
be a total waste of your time.

### Motivation

This year Inércia demo failed spectaculary. We were not able to show the demo
during the competition because it crashed the browser tab in the machine being
used to run the demos. Shortly after that we found that it also didn't work most
computers and devices. Then at one point it even stopped working in my machine.

After the party we spent a few days thinking over what went wrong, which led me
to fix and redesign some parts of the engine, and optimize a lot of loose ends
that were left to be done by the future me or some capable LLM.

Now here I am presenting it before the story repeats all over again.

### PNGine

Bundle WebGPU shaders and any kind of WebGPU setup in a single portable place.

The goal: Be able to run any kind of WebGPU setup in any platform with a single
file and a viewer.

This means, bundling pipeline configurations, buffers, render passes, textures,
layouts, shader modules, everything you can do in WebGPU with any possible
asset. In a single place that can then be read by a viewer in your preferred
platform.

Then came the png. The PNG file format allows for multiple binary chunks to be
described after the image it holds. This is roughly like a .zip that shows an
image by default.

Having support for bundling in pngs brings its wow factor. Specially when
dealing with shaders since you can effectively make the .png image move or
interact with it. It feels a bit like magic that with a few instructions you can
extract the extra binary chunks from the .png and declare and initialize the
WebGPU plumbing in a way that it stars playing. Replace the image placeholder
with an appropriately sized canvas and it is wow time.

After playing with this with a few simple examples and seeing how friends
reacted led me to pngine: an engine with PNG on the name.

### Inside the PNG

PNG files are typically images, they include the picture that you are seeing:

// TODO Imagem de uma foto

What most people don't know is that they can be extended with binary data, they
are called "chunks":

// TODO Imagem de uma foto

This is supported by PNG images, in fact a few supported formats do this to
carry over extra information, such as the APNG format that does animations in a
similar style to GIF.

PNGine uses this to carry over some shaders and webgpu information. It works
with PNGs by looking for these extra WebGPU chunks but it can also work with ZIP
files just fine.

### What this is not

PNGine is not an animation format. For that use Rive, Lottie, etc. PNGine is
also not a design tool. For that use Figma, Sketch, etc.

It is also not a rendering engine. That part you do it yourself. Maybe this
should have been called DIYengine.

It is also not a way to make PNG images move. That only happens in very specific
conditions. PNG's are just used as containers here. I tend to prefer Zip files.

### The DSL

PNGine is a textual description of the whole WebGPU canvas. A Domain Specific
Language that brings WebGPU into a fully declarative space. Designed so that it
can run seamlessly in multiple platforms and WebGPU backends. This DSL is
intended to be human-readable and writable, but my initial idea is to have the
DSL be machine generated in the near future by the use of an easier template
system.

The DSL goes like this: have a unique #macro for every function in the WebGPU
Device.

i.e. instead of `device.createBuffer(...)` you have `#buffer ref { ... }`

The "create" goes away, and "#" shows in its place. So
"device.createTexture(...)" becomes `#texture ref { ... }`, and
"device.createRenderPipeline(...)" becomes `#renderPipeline ref {...}` and so
on...

The `ref` is used to reference that created item elsewhere when needed. What
goes inside `{...}` is the arguments of that function. These are named, kinda
like Swift, name=value. The `name` comes directly from the WebGPU spec argument
name, I did not invent any names here (with very few exceptions).

### The interpreter

The DSL with the textual description is then compiled into a specific set of
binary instructions. These instructions are then interpreted, by a small piece
of code that just calls the respective WebGPU function with the arguments
provided in the DSL.

The instructions that the DSL compiler generates are intentionally made so that
the interpreter can be really simple and stateless.

This interpreter is bundled together with the instructions in the .png (or .zip
if you prefer).

Having the interpreter being bundled in the payload file is a trade-off.

- The bad thing about it is that you don't share it if you have more than one
  pngine canvas running on the same page, meaning that its size accumulates with
  every simultaneous pngine file you might have at the same time being
  displayed.
- The ugly part about it is that if there is some fix for the runtime, the
  pngine files need to be rebuilt, you can't just push the fix up and hope for
  everybody to update. You have to also rebuild the pngine files with it.
- The good thing is that if it works it works, future updates won't break it,
  you test it where you need it to run and it will be bundled with the file.

All of the above made the interpreter become a critical part of PNGine. It is
very small, it is very fast, and runs a very specific set of instructions with
no surprises. The heavy work is left for the DSL compiler. The compiler has all
the muscle, it needs to figure out how to decompose a full WebGPU declaration
into the very thin set of opcodes that the interpreter supports.

Having the interpreter bundled with the payload in the same file also helps in
having a very simple pngine viewer. There is no need to carry interpreter logic
around, it comes with the payload of what you are viewing.

### The viewer

A small amount of code is needed to view pngine files. If you have a .png with
those special pngine chunk along side the image, then you can pass it through
the viewer and view what the WebGPU bundle has to show.

The viewer is the pngine API you get to use. It is stateless. This means that
there is no "play()", "stop()" or "pause()" functions. There is no notion of
timeline or events. The main function is the "draw()". It draws the pngine
payload being viewed. It does not animate it. It just draws it, with the
specified inputs it needs.

i.e. pngine.draw(2.5); // draws the payload frame at time=2.5 seconds

You get to hook it with whatever animation system you use. That can be WebAudio
clock, a webpage scroll, some microphone input, or just plain old
requestAnimationFrame.

PNGine is a declarative, stateless way to bring your shaders to the world.

### The CLI

PNGine main command line interface tool brings in a few useful subcommands to
help inspect and create .png's from DSL files. It is used to develop and analyze
png files and its shaders and instructions via the terminal.

### Example

Tangram example.

### How to use it?

Currently PNGine only supports the web viewer. Soon iOS will be added and
shortly after that Android.

If you have a web page and want to try out PNGine, then using (p)npm is all you
need:

`pnpm install pngine`

After that, do this `pnpm run pngine init`, it will create a simple example
.pngine DSL file that you can use to create a demo .png.

Once you have the png, import the viewer in your code and load the png in it.

// TODO

## Conclusion

...

Core API: Stateless draw(time)

const player = await PNGine.load(canvas, 'shader.png');

// YOU control the loop - we just render player.draw(audioContext.currentTime);
player.draw(videoElement.currentTime); player.draw(midiClock.time);
player.draw(slider.value);

Convenience: play({ clock })

// Simple case: RAF clock (default) player.play();

// Audio sync player.play({ clock: clocks.audio(audioElement) });

// Video sync player.play({ clock: clocks.video(videoElement) });

// Manual (for scrubbing UI) const clock = clocks.manual(); player.play({ clock
}); slider.oninput = () => clock.seek(slider.value);

The PNG contains declarative animation data. Platforms implement imperative
event handling using the pure DrawState return value.
