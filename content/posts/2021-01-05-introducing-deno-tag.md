+++
title = "Introducing the <deno> tag"
description = "After trying out Deno I got passionate about it. This post introduces my first Deno module, a simple preprocessor for HTML files that runs Deno where the new `<deno>` tag is specified. How useful can a simple file preprocessor be? What can it help build?"
date = 2021-01-06
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/deno_tag_logo.png", class="center-images with-lists" }
+++

Deno is gaining traction. A TypeScript runtime based on the Rust language and the V8 engine commonly associated with Node.js, or seen as the "new Node.js". After trying it out, I feel that Deno is much more than that. 

Deno is a new thing. A new thing that gets it right and manages to improve even the few parts that were already top-notch in Node.js/JS.

![Deno with the pixel sunglasses from the "Deal With It" meme](/images/deno_deal_with_it.png "Deal with it")


## How cool is Deno?

Technicalities apart, the heart of Deno resides in the URL. It is how modules get referenced, and your work gets exposed to the world—giving you the flexibility to distribute it as you please (in your super-private VPN org, maybe?).

Having the URL as the core is a driving force for a few base design decisions.
Naming things as closely as possible to what they are is a very nice improvement to the already great JavaScript module system. No more extension assumptions when importing modules. 

This means that `import Rabbit from "magic"` no longer works: where is "magic" located? is it a `.js` ? a `.ts`? a folder with a default `index.js` export? Some 3rd party "package" in your packages cache? Which version? or is it any other kind of file that your chosen bundler decides to import for you?

Deno also carefully shares a set of API's with the browser, allowing lazy devs like me to compound the knowledge of [standard JavaScript browser API's](https://deno.land/manual/runtime/web_platform_apis), bringing it to places outside the browser.

The [security model](https://deno.land/manual@v1.6.3/runtime/permission_apis#permission-descriptors) granularity resembles the [OpenBSD pledge](https://man.openbsd.org/man2/pledge.2) approach. It forces the module execution into a restricted-service operating mode set by each permission specific flag and allowances. If your module tries to do something that was not whitelisted, it will throw an exception.

The Deno [style guide for contributors](https://deno.land/manual/contributing/style_guide) is a great read and can serve as a base for the code style guide in companies that lack it. The included linter rules (`deno lint`) already do a great job at enforcing a part of these guidelines.

If you are now starting a new project or trying to refresh some old codebase, then Deno might give you that fresh edge that your project needs.

## Deno as a preprocessor of HTML

One of the things that attracted me initially to Deno was that it includes with its single binary `deno` the ability to bundle dependencies and run tests. No more Webpack. No more Jest. Think of it as TypeScript with batteries included - btw, why doesn't `tsc` resolve imports and outputs bundles? Because it's a "compiler" and not a "linker"... yeah, whatever.

With Deno, I get in its single binary, a simple API, and a set of tools to use from the Command Line Interface.

Now, what if it would be possible to run Deno from within an HTML file?

Yes, like PHP but with Deno munching TypeScript. 

![Deno logo next to the PHP logo with a rainbow heart in between](/images/deno_spectrum.png "Its a spectrum...")


## Nevermind the `<?php>` here's the `<deno>` tag

The [deno_tag](https://github.com/HugoDaniel/deno_tag/) is my first Deno module. I have been using it in the simple drawing web app I am building (Shape The Pixel).

The idea is that you can include a `<deno>` tag in your project's HTML files and then preprocess them into regular HTML files.

_What does this new tag do?_

It runs the `deno` command on the specified file and replaces the `<deno>` tag with its output.

Here is an example, suppose you have this file called `advanced_logic.ts` with this content:

```typescript
console.log("PHP is the best computer language ever invented!");
```

Just an example. The `<deno>` tag would transform something like this:

```html
<html>
<head><title>Super Advanced Concepts Inc. Like Alien Magic Actually.</title></head>
<body>
<p><deno run="advanced_logic.ts" /></p>
</body>
</html>
```

Into this:

```html
<html>
<head><title>Super Advanced Concepts Inc. Like Alien Magic Actually.</title></head>
<body>
<p>PHP is the best computer language ever invented!</p>
</body>
</html>
```

It runs something similar to `deno run advanced_logic.ts` and pipes the execution's output directly into the location of the `<deno>` tags. 

The tag can handle other attributes besides `run`. It can also bundle your modules with `<deno bundle="my_app.ts" />`. Perfect for including within `<script>` tags and having the HTML file include a bundle of your code and its imports.

```html
<html>
<head><title>Super Advanced Concepts Inc. Like Alien Magic Actually.</title></head>
<body>
<script>
<deno bundle="my_app.ts" />
</script>
</body>
</html>
```

Just call the `deno_tag` CLI on your build scripts or release playbooks to have the HTML files ready to go.

### The possibilities are endless

Preprocess your static assets?
Bundle the SVG's into a single string?
Call mom?
Ping the coffee machine?

The `<deno>` tag is here for the rescue!

_Why not use PHP?_

I love PHP and use it whenever appropriate. It is my favorite backend language for the web. The [PHP "include"](https://www.php.net/manual/en/function.include.php) logic is great and resembles this somehow (`<?PHP include "something.php"; ?>`). However, I tend to like to work closer to front-end development, and keeping these HTML/Web parts in TypeScript is the wave to surf these days 🏄‍♂️.

_Why not use /bin/sh?_

I don't know why 🤷‍♂️.

## Conclusion

The [`README.md`](https://github.com/HugoDaniel/deno_tag/) file in the deno_tag repository includes a couple more examples and a more detailed description of its parts. [Check it out](https://github.com/HugoDaniel/deno_tag/).

This is also available as a _deno.land/x_ third-party module [here](https://deno.land/x/deno_tag).

![Deno logo between two angle brackets](/images/deno_tag_logo.png "deno_tag ftw!")
