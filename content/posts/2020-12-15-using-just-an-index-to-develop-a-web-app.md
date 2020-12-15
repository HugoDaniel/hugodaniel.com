+++
title = "The Zen of index.html"
description = "Web development has become a very complex field with many branches and tools to master. In this article, I suggest doing the inverse and use just a simple `index.html` file to manage all of the web app development scripts and assets. This might seem radical but does it make life more complex than using all those front-end tools we have become accustomed to?"
date = 2020-12-15
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/html5-muscle.png",modules = [], class="center-images with-lists" }
+++



Using an `index.html` as the single management file for the app.

![HTML5 badge with a hammer, ready to do some damage](/images/html5-hammer.png "That is one big hammer!")

_"It might work for small things, but I wouldn't use it for something big."_
Said someone about something.

These are some of the things that an `index.html` typically does:

- Sets the title for the current page
- Defines the content and assets
- Defines content to be used as a template
- Loads styles
- Runs scripts and resolves modules dependencies

Which are already quite good, but there are many more goodies to be found among the things that a simple `index.html` allows to do such as:

- Set a [manifest file](https://developer.mozilla.org/en-US/docs/Web/Manifest) for offline usage of the page items
- Using the [Web API](https://developer.mozilla.org/en-US/docs/Web/API)'s on the scripts (navigation, web components, 3d, audio, network access, etc...)
- [Preload](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) content and assets
- Content [syndication](https://en.wikipedia.org/wiki/Web_syndication)
- Social networks [meta information](https://ogp.me)

In fact, everything that any modern complex Web App does can be fit into a single `index.html` file.

It is mostly a matter of managing the complexity and growth of files, assets, components, etc...

We have developed a wide range of very complex tools to help us with that. Front-end development has become so complex that it is hard for any single person to master it.

How much harder would life be if a single `index.html` was used to drive all of the development instead of all those Create-React-App/Babel/WebPack/npm/yarn/d/sass/styled-components/optimizers? 

I don't know how to answer this but will try to shed some light on a simpler, more "naked" approach for web app development.

To start **there are at least two problems** with using a single `index.html` as the only management file for the app:

- No TypeScript support (or any other transpiler language, only JS, GLSL, and WebASM supported)
- No way to easily manage 3rd party dependencies dependencies (dependencies)

These two will be the subject of my next post. For now, I am going to lay the ground for a simple `index.html`-only approach.

## A common structure for most apps

The common structure I plan to follow for is something like this:

```html
<head>
<!-- Page meta -->
<!-- <link>'s go here after the meta stuff -->
<!-- <script type="module">'s go here -->
</head>
<body> <!-- Feature flags as class strings in body -->
  <!-- Modals go here -->
  <main>
    <!-- The content being shown goes here -->
  </main>
  <!-- <template>'s go here -->
  <!-- <script>'s go here at the end -->
</body>
```

This structure makes some compromises but overall is enough for most complex apps. It is not that different from a normal HTML page 🧐.

JavaScript modules are being loaded at the `<head>`, which is ok because module scripts are deferred by default and do not block the parsing of the rest of the document. They could go anywhere, I prefer to keep the `<body>` for the main logic and more immediate scripts.

With this in mind, here are 3 common things to a web app that can be done in such a simple structure without much effort:

1. Global loading state (full-screen loading)
2. Routing (what to show according to the URL being rendered)
3. Place common HTML parts/assets without repeating them (templating/components)

## Global Loading page

A loading page that fills the whole screen is something that most web apps have, some even distract us with cool animations while loading.
 
In the above structure, the loading page goes into the modal area. Right before the `<main>` content. This allows heavy content like `<canvas>`, `<img>` to be placed as `<main>` children and fully load (shaders, image data, etc) behind it, before clearing the loading state and showing them to our friends.

```html
...
<body>
  <div id="loading">Loading</div>
  <main>
  ...
```

The whole visible space gets covered with that loading `<div>` which is then removed when all the things that the app needs for a good first run are ready.

Having the loading upfront on the `index.html` without needing any JS to first show it also helps our karma score in the bots&spiders purgatory that purge the web we all love into useful cinder blocks.

## Routing

No lib is going to be used for routing. Routing s going to consist of simple manipulations of the browser history with `popstate` and `pushstate`. The basic approach is:

1. Read the current route from the window location
1. Clone its corresponding `<template>` into the `<main>` tag
1. Inside it adjust the relevant `<a>`'s and other link navigation tags to perform a `pushState` instead of their default behavior
	* Filters can be applied to only consider `<a>`'s that have relative paths, or that do not have the `rel=nofollow` attribute
1. `onpopstate` clone the correspnoding `<template>` into the `<main>` tag

This is intended only for web apps as an effort to reduce the amount of JS and leverage the features already at hand. For anything similar to regular pages the browser behavior is more than good enough, no need for JS there.

This approach should work well if the web app uses less than 20 or 15 possible routing patterns. Most web apps likely average at some number under 10. This simple approach should be more than enough. There is no need in my foreseeable use cases to use anything more complex like the DOM or any big library to manage routes.

I will evolve this into a very simple routing/templating library to be announced soon(ish). For reference, here is some code that I did for a template engine in one of the many Grid iterations: [old routing code](/scripts/meander.js).

I appreciate the browser's approach of associating page state with history, however, for a web app I find it simpler and more manageable to keep these two things separate:

 - Routing seen as pure functions of navigation only transformations
 - App state in its own separate tarpit.

## HTML Templating

Stamping and repeating a common HTML structure in a couple of places is a frequent routine that most web apps do. Be it for menu entries, list items, or even whole parts like sidebars or modal and toast elements. Finding a common HTML structure and repeat it when needed with small adjustments is a stapled practice.

HTML templating has many technicalities and possibilities. Most JS frameworks commonly solve it in their own way with different degrees of justifiable complexity.

Web browsers already provide a very flexible and complex way to do templating through the Web Components suite of technologies. For most of my cases plain HTML will be prefered and written directly at that `index.html`. For the other cases where DRY speaks louder a simple static "copy/paste" tag will suffice, a small prototype of this could be something like:


```js
customElements.define("template-content", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" })
        .appendChild(
          document.getElementById(
            this.getAttribute('from-id')
          ).content.cloneNode(true))
  }
});
```

This small code defines a new WebComponent tag `<template-content>`, this tag reads an element id from its `from-id` attribute, then gets the corresponding element on the DOM for that id, clones it, and replaces itself with it.

This is useful because it provides a quick way to stamp HTML/SVG content on the document. Helpful to replicate SVG elements, lists, and node sub-trees on the client-side.

```html
<nav>
	<button onclick="tool('undo')">
		<template-content from-id="tools-button-content" />
		<template-content from-id="tools-undo" />
	</button>
	<button onclick="tool('draw')">
		<template-content from-id="tools-button-content" />
		<template-content from-id="tools-draw" />
	</button>
</nav>

<template id="tools-button-content">
<!-- Some complex content here -->
</template>
<template id="tools-draw">
<!-- Some other complex content here -->
</template>
```


## Conclusion

Keeping a single `index.html` might be just enough for a simpler naked approach to app development. If there is no need for big dependencies, versioning tracking files, transpilers, and all that, this could very well be good enough. It works directly on top of what browsers already provide and hints at a simpler, leaner, style of development.

It does not have TypeScript support and it also does not automatically resolve dependencies and bundles them.

These are two open problems with this approach that I plan to show a possible solution that is on par in simplicity with this one. That will be the subject of my next technical post (likely to come out next week). Stay tuned.


