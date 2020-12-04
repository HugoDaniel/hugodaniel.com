+++
title = "Introducing Grid Generator Version 0"
description = "What features does it have? What to expect in the next versions?"
date = 2018-07-05
extra = { place = "Lagoa", author = "Hugo Daniel", social_img = "/images/pattern.png" }
+++

The purpose of this post is to introduce my personal project: Grid Generator. This is the first post about it since it went online on the 1st of July 2018.

## What problem does it solve?

I have always struggled with design tools. In particular those that came to see the light of the day during the 90's (Adobe I am looking at you).

These design tools are clearly targeted at "pros" and "specialists" (like most of the computer "stuff" from/during the 90's). You are not expected to be able to work with them if you are not a specialist or if you did not take at least a course on these tools.

Being trained in software development made me look at the works produced by designers with wonder and amazement. I want to be able to at least produce geometric clean shapes that fit well together.

Unfortunately making even simple shapes in the current design software offer is a daunting task for me.

That was my motivation behind Grid Generator: Create simple shapes, easily pick colors, and paint them in a grid, making patterns or more complex shapes.

I also wanted to bring time into play. Time is an important factor to consider and to work with in Grid Generator.

## What to expect?

A square grid. In this version, and in the upcoming near versions, Grid Generator only supports a base square grid.

Think of it as pixel art with configurable pixels. Where your moves are being recorded.

![Simple house with squares, triangles, and a rounded square](/images/grid1.png)

![The same with the grid hidden](/images/grid2.png)

### Shape editor

In a square grid the base shape is the square. If you click on the '+' button bellow left, it opens the "Shape Editor". Here you are presented with a grid made of lines and circles. This is where you customize your square. The intersections are automatically calculated to help you create your shapes. You as an artist/designer only need to connect the dots and build your shape.

![Just connect the dots](/images/shape_editor.png)

You can pile many shapes on top of each other and change their colors.

![Several sub-shapes on the same shape](/images/shape_editor_pile.png)

Time is an important aspect, you can go back to any previous state of your shapes and re-edit them from there.

![Several sub-shapes on the same shape](/images/shape_editor_travel.png)

After your shape is created you can start painting with it.

![Paint your new shape on the main grid](/images/shape_editor_paint.png)

Or create other color variations of it on the '+' button to the right.

![Create several color variations for your shape](/images/shape_editor_colors.png)


### Tile Patterns

I have asked in reddit about software to create tile patterns. A few answers came up but none quite filled my taste. I used this as a motivation to implement automatic tile patterns in Grid Generator.

In the menu just click on the "pattern" icon, and then on the "grid". A blue frame shows up where you can paint inside and everything gets repeated outside.

![The pattern frame](/images/grid_pattern.png)

You can drag the corners of the blue frame to adjust your pattern to your drawing and create different patterns with white spaces.

![A triangular pattern](/images/grid_pattern_tri.png)


### Replay your art

After having created something cool you can publish it to share with your friends. Publishing an artwork makes it publicly available in its own page.

In there you will see a big "play" button that will replay your creative process until the final state is reached.

[Check it out.](https://gridgenerator.com/p/13)

### Remix it

You can pick any state of the art being replayed and remix your own version from there on. You can easily create your variations by clicking on the remix button ("Change It" on the bottom).

![Remix other works and create variations](/images/remix_grid.png)

### Export

Exporting is currently the only paid feature of Grid Generator. My logic to make this a paid feature was that you can support the further development of this app if you are producing anything of value with it.

In the future I am planning to make this a free feature by adding other sources of revenue like instant product creations with your art (bags, t-shirts, etc...) and even selling packs of specially crafted grids.

After paying you can export your work as SVG. SVG is a vector format that is very prone to rounding errors and aliasing, so I also implemented exporting your works as high-res PNG's that solve these issues.

Another possibility you have is to export your creative process as GIF or MP4, saving you the hard work of screen recording and editing.

## Upcoming features

The next version (v1) will mostly see UI/UX improvements (imo those are critically needed) and some small features with these, like:

- Possibility to clear your shapes in the shape editor
- Rough onboarding
- Slightly better menus and pages
- Facebook login

After these I am planning some major stuff like:

- Stroke support in shapes
- Background images in shapes
- Layers
- Color picker enhancements
- Triangular grids and shapes
- Custom base grid editor (create any kind of base grid)

Try it and if you feel inspired tell me which features you would like to see most.

[https://gridgenerator.com](https://gridgenerator.com)

## Conclusion

In its current state Grid Generator is very raw. I did a lot of compromises to get here but the idea is very close to its initial inception in my head from a couple of years ago. Along the way I had the help and feedback of amazing people. I have some upcoming posts planned on them. They helped a lot of this feel way less lonely and in some points I think they believed more in it than me :)

Alas [everything is open source](https://github.com/HugoDaniel/gridgenerator) and I am going to start using GitHub bells and whistles in its further development.

