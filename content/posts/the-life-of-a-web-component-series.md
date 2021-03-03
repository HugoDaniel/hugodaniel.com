+++
title = "The life of a Web Component"
description = "This is the list of articles I have written while exploring Web Components. It details the possibilities of uncommon practices and puts them in use in shader-canvas, an abstraction of the WebGL API done with Web Components."
date = 2021-03-02
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/html5-muscle.png", class="center-images with-lists" }
+++

## [1 - Initialization](/posts/the-life-of-a-web-component/)

This post is the first in the series. It talks about avoiding the Web
Components constructor, events and life-cycle methods while rolling your
approach.

## [2 - As a variable bucket](/posts/the-life-of-a-web-component-as-var/)

In this post I was trying to automatically declare new tags as they get
written in the DOM. Here I introduce container elements, which allow their
child tags to have any name by assuming that they will all be using the same
Web Component class.

## [3 - Reversing Shadow DOM visibility](/posts/the-life-of-a-web-component-reverse-shadow-dom/)

Once a Shadow DOM is used the browser assumes it to be the source of truth and
the holder of the content that is going to be displayed. What if it was the
other way around? In this post the child tags of a Web Component get displayed
by default while the Shadow DOM is used to keep hidden state.

## [4 - Declarative State](/posts/the-life-of-a-web-component-state-in-shadow/)

This post uses the variable buckets from part 2 to declare complex app state.

## [5 - Getting tested](/posts/the-life-of-a-web-component-tests/)

Trying to test Web Components without any bigger knowledge of its related
best-practices. Just thoughts about trying it out and seeing where it goes.

## [shader-canvas](/projects/shader-canvas/)

A graphics framework that makes use of the Web Component techniques in this
series.
