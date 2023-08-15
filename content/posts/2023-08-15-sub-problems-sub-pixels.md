+++
title = "The art of the (sub-)pixel"
description = "A look into sub-pixels and why they can be useful to have."
date = 2023-08-15
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/pixel_family.png", class="center-images with-lists" }
+++

This post is the first in a series of posts about some challenges to think about when developing a motion design app.

It is meant to think a bit about pixel representations in drawing/animation apps, or just bring some insights if you are not into that.

Although not related, this post also coincides with the release of LottieLab, the motion app I have been working on, please support us [on ProductHunt](https://www.producthunt.com/posts/lottielab). Check it out.

### The art of the pixel 

![Four squares, that represent a family of pixels](/images/pixel_family.png "Support this (sub)pixel family!")

Imagine doing a drawing web app and thinking about how to represent pixels in it.

Implementing pixels as integers can be tempting when doing a design animation tool. After all, most creators avoid partial pixels with a fractional value, often called sub-pixel values, and generally consider it a good practice to prevent sub-pixels overall. 

On top of this, our screens have a fixed integer resolution. Full HD is 1920 pixels wide per 1080 pixels tall. It is not 1920.7 per 1080.3333 or any other decimal limit.

Then, in the pixel abstraction stack we tend to generally think of pixels as square entities that live on our screens and can have color.

![Four images, each representing the hardware RGB pixels of four kinds of displays (TV CRT, PC CRT, XO-1 LCD and LCD). None of them have square pixel geometry.](/images/geometry_pixel.jpg "Pixel geometry at some point")

Integers are easy to work with and reason, especially when compared with floating point values, where [`0.1 + 0.2 != 0.3`](https://0.30000000000000004.com), and [precision](https://en.wikipedia.org/wiki/Double-precision_floating-point_format#Precision_limitations_on_integer_values) can be a problem in some edge cases here and there.

Even in a language like JavaScript, where standard numbers are all 64-bit floats, it is not uncommon to resort to flooring and multiplying/dividing with a fixed 10-based power to provide a fixed resolution—peace in a world of eventual chaos.

Within this, thinking of pixels as integers feels "right". After all, they are squares with colors. A shape can be positioned in either one pixel or the other. Right?

### NP-Hard (P is for Pixel) 

My best take on this is that "it depends". Pixels can be thought more or less as we want depending on how low-level or high-level in the hardware/software abstraction we want to be.

As a web developer, the lowest I go typically starts at the graphics backend in use (HTML5 Canvas? WebGL? SVG? regular ImageData bitmap?), and then goes all the way up to the app requirements. It depends.

If we take something low-level, like WebGL, there is no actual "square pixel" for a developer to directly manipulate.
WebGL cares about clip-space coordinates, which are just a square with dimensions ranging from -1.0 to 1.0. A notion of pixels then can be mapped here, but from a programmer's perspective, they are on top of floating point square dimensions. 

![](/images/clipspace.png "Clipspace coordinates")

Besides not caring about resolutions, clipspace doesn't care about aspect ratio or the end device they are at.

Our main problem is how to place stuff from -1.0 to 1.0, because that is what we have available as coordinates.

![](/images/clipspace_monitor.png "Clipspace coordinates in a monitor")

For WebGL the task of going from clipspace to hardware colors is an implementation problem, us users don't have to deal with it too much.

We only have to think about how we are going to place stuff from -1.0 to 1.0.

![](/images/clipspace_phone.png "Clipspace coordinates in a phone")

Then it is up to the developer to define an abstraction that works on top of clipspace and can represent pixels as close as possible (or not, if we so want to).

### Empty the clip

For instance, imagine an 8x8 pixel screen. The clip-space naive representation of pixels would be something like this:

![Clipspace coordinates square, split in 8x8 grid of smaller squares, with the top left square marked in red](/images/clipspace_pixel.png "A pixel in clipspace coordinates")

It would start at the left-most x position (-1.0) and since there are 8 pixels, it would extend 0.25 to the left (up to x=-0.75).

All good, but all good the same if in this representation we want to have a pixel somewhere in between:

![Clipspace coordinates square, split in 8x8 grid of smaller squares, but the top left square is misplaced between the first and second position](/images/clipspace_pixel2.png "A misplaced pixel in clipspace coordinates")

It is easily possible to define other positions, it is up to us. Sub-pixels? all good here. They just start in a different floating point position.

Then all of this, at some point, raises the question of pixel centers and offset starting positions, and pixel snapping, etc. For another post, maybe.

### But my motion design app is so special that it will only have integer pixels

Going with only integer pixels is fine, especially for apps with more of a pixel-art vibe or geometric approach with hard grids. 

If not, be prepared to find workarounds for a few situations.

Here are a couple of situations that sub-pixels can be a super useful representation to have at hand:

#### Rotate a square, and snap another into it

When snapping to a rotated shape, the position of the snapped shape can be more precise when put in a sub-pixel.

<video controls muted loop preload width="100%">
  <source src="/videos/snap_square.webm" type="video/webm">
  <source src="/videos/snap_square.mp4" type="video/mp4">
</video>
<small>Video taken from Lottielab web app</small>

Sub-pixel precision is also a good thing to have when doing transformation stack operations, like scaling a group, etc.

<video controls muted loop preload width="100%">
  <source src="/videos/scale_group.webm" type="video/webm">
  <source src="/videos/scale_group.mp4" type="video/mp4">
</video>
<small>Video taken from Lottielab web app</small>

When doing smooth animations, like tweening the shape from one position to another, using sub-pixel floating values can make 
super smooth animations.

<video controls muted loop preload width="100%">
  <source src="/videos/tweening.webm" type="video/webm">
  <source src="/videos/tweening.mp4" type="video/mp4">
</video>
<small>Video taken from Lottielab web app</small>


In the end, it all goes to the screen, and...

### Wear sunscreen 

Screens can implement the notion of a pixel in many different ways, and if we look close enough, they are rarely "square" per se. While true that they end up mapped as square "device pixels", they might also not correspond to the actual pixels your code is manipulating (because of hardware to software nuances like the device pixel ratio or so many other weird things like the Apple notch rounded edges abstraction, etc).

If we go high-level enough, the pixel representation can get weird quickly. CSS defines a pixel as a ["visual angle unit"](https://drafts.csswg.org/css-values/#absolute-lengths) and CSS pixels are described as an [angular measure.](https://drafts.csswg.org/css-values/#reference-pixel).

![CSS Pixel changes with distance](https://drafts.csswg.org/css-values/images/pixel1.png "In CSS pixels must become larger if the viewing distance increases")


## Final words

I like to keep things "simple" and stick to floating point pixel values and then provide some usability aid to ensure that shapes get placed in integers most of the time while helping out creators work in these muddy waters.

Be wild and free those pixels!

