+++
title = "Minimal Color Swatches"
description = "A look into the color relations that went into creating a simple color palette generator."
date = 2022-02-03
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/minimal_color_swatches.png", class="center-images with-lists" }
+++

Recently I gained a boost of motivation that made me want to look into colors and drawing tools again.

I hate choosing colors, and it is tough for me to find good mixes of related colors that look well together and have multiple use cases. 

For this reason, I have long been cultivating an attraction towards color pickers, the idea that software can help me choose colors and give me good working sets of matching colors.

[Naomi Danielle](https://twitter.com/ndchristie) gave an [excellent explanation](https://twitter.com/ndchristie/status/1382134093731794948) of making minimal and exciting color palettes a while back. At that time, I had not enough energy or motivation to pursue this idea, so it went into the bucket list until now.

This blog post explains my rudimentary interpretation of the idea behind it and provides simple examples of its inner workings. The final objective is the implementation of it all as a simple color palette generator, which is [available here](https://svelte.dev/repl/d92223f84088414da98cce78f3ab382a?version=3.46.3).

![13 color diamonds displayed in a grid. All the colors are related to the one present in the central diamond ](/images/final_palette.png)

## Don't pick me.

Pick a color. This color will be the root color for a minimal palette of 12 other colors. 

For example purposes, I am going to roll with #69b9d9.

![A square with a blue color](/images/color_picked.png "#69b9d9")

To ease the creation of the 12 variations, I will use HSL (Hue, Saturation, Lightness), a common RGB alternative that allows varying the color lightness and saturation directly.

## Hairy Gray. 

Each color in the palette will have its light, which means that light will not be uniform across all colors, allowing artists to use darker tones and lighter tones consistently if they stick to the palette.

Taking the base color chosen, start by deciding which is the brightest and darkest tone possible (I am going with a max of +25 Lightness and -25 for the darker one, but roll your own).

Then create a gradient by splitting the difference into five tones each way.

<video controls muted loop preload width="100%">
  <source src="/videos/gradient_light.webm" type="video/webm">
  <source src="/videos/gradient_light.mp4" type="video/mp4">
</video>

Now create a relationship between these color variations by zig-zagging them and filling the two missing spots of the final palette layout. 

<video controls muted loop preload width="100%">
  <source src="/videos/zig_zag_light.webm" type="video/webm">
  <source src="/videos/zig_zag_light.mp4" type="video/mp4">
</video>

Zig-zagging the lightness creates visual ways to establish relations between them. 

## No more can be absorbed

As with lightness, the palette must provide an excellent range of color saturation. I replicated the lightness logic to get the color saturation range as an initial approach.

Using the same Zig Zag logic for saturation produces the following effect.

<video controls muted loop preload width="100%">
  <source src="/videos/zig_zag_saturation.webm" type="video/webm">
  <source src="/videos/zig_zag_saturation.mp4" type="video/mp4">
</video>

However, after playing around with the final palette of colors, I found that this produced a high emphasis on the light colors and a lower focus on the darker shades. Coinciding the saturation highs and lows with the light did not make a balanced final result to my eyes.

After showing it to a couple of friends, I opted to rearrange the saturation in an alternating fashion, highs-lows-highs from the base color outward.

<video controls muted loop preload width="100%">
  <source src="/videos/checker_saturation.webm" type="video/webm">
  <source src="/videos/checker_saturation.mp4" type="video/mp4">
</video>

## Hue is a lovely city

For Hue, the logic is denser. I have failed to formalize it in a good way in this palette generator. The idea is to shift the base color 118º in one direction and 34º in the other—these values I took from the Danielle example.

<video controls muted loop preload width="100%">
  <source src="/videos/hue_diff.webm" type="video/webm">
  <source src="/videos/hue_diff.mp4" type="video/mp4">
</video>

Then the relations for all the palette diamonds involve dividing by two and sometimes by four. These relations are present in the `hueValues()` function [in the code](https://svelte.dev/repl/d92223f84088414da98cce78f3ab382a?version=3.46.3). They are fickle and sometimes jump, but the overall result is good enough.


## At the end of the night

The final palette uses this lightness, saturation, and hue palettes.

![4 palettes: lightness palette + saturation palette + hue palette with arrows to indicate that mixing them produces the final palette ](/images/swatches_mix.png "H+S+L")

Using the system color-picker, we can make these colors act alive.

<video controls muted loop preload width="100%">
  <source src="/videos/swatches_final.webm" type="video/webm">
  <source src="/videos/swatches_final.mp4" type="video/mp4">
</video>

[Try it out](https://svelte.dev/repl/d92223f84088414da98cce78f3ab382a?version=3.46.3).


## Final words

Creating this palette generator was my first [Svelte](https://svelte.dev/) project.

Svelte is a lean front-end framework with an excellent initial community in Portugal.
Their help and patience were paramount as I routinely bombed their Discord channel with questions and bugs.

<img src=/images/svelte_portugal.svg width=96 alt="Svelte Portugal Discord group logo"/>

If you would like to get involved, [here is an invitation link](https://discord.gg/fCT57QzmJV).

