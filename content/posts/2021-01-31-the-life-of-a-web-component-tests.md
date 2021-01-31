+++
title = "The life of a Web Component - Getting Tested"
description = "Testing Web Components is a torny road. In this post I assemble three techniques that solved the majority of the situations I found in testing them."
date = 2021-01-31
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/html_bugs.png", class="center-images with-lists" }
+++

In this post, I present what is by far the 2nd best way to test Web Components. I say this because there must be at least one way better than the one I am presenting. Also, I don't know of any other way to test them since I have just started playing with Web Components. So yeah, 2nd best, by (infinitely) far.

## Where to test a Web Component?

First, a starting note:

The techniques I am going to show are not thought for <abbr title="Command Line Interface">CLI</abbr> usage. They are meant for the browser. Where Web Components run and are used.

_There is no way that my CircleCI pipes are going to run a browser instance!_

This is a problem. Maybe for CI, it could be possible to separate the logic parts from the Web Components into contained JS modules with their own separate unit tests in <abbr title="Command Line Interface">CLI</abbr>.

![The HTML5 badge next to three vertical checkboxes. The first two checkboxes have a cross.](/images/html5_tests.png "HTML testing")


## Testing Web Components with $FRAMEWORK

<blockquote>

Hello $FRAMEWORK,<br>

I hope you are well. <br>We are currently reinforcing our team in the most diverse areas. Your profile has captured my attention, and I believe it might fit our current projects' frame. Would you be interested in considering a new professional opportunity that entails intense Shadow DOM manipulation and active HTML modifications in a very dynamic environment?
<br>
<br>
Grateful for your attention,<br>
Hugo
</blockquote>


Running the tests in the browser is essential when testing Web Components. A Web Component can be a low-level piece of logic tightly bound to a particular DOM configuration. Some parts of the Web Component might be hard to test, particularly the Shadow DOM modifications (it's a DOM root designed intentionally to provide encapsulation).

Most things happen asynchronously with Web Components. Either through/after a particular event or because it is a composed Web Component that only shows its intended behavior after a series of `connectedCallback()`'s,`#shadow-root` manipulations, or other strange browser behaviours happening. Anything goes. You gotta love browserland.

## Eierschalensollbruchstellenverursacher

There is another problem when testing Web Components:

1. Your tests might not be running independently from each other

A workaround is needed just to guarantee one of the basic tenents of (Unit|Integration|Regression|End-To-End|Functional|Performance|Who|Invented|This|Shit)-tests.

_But why can't I have independent Web Components tests?_

The [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) (the global var that browsers have where we define our custom tag names) has no `delete()` method. Once you associate a Web Component to a tag there is there is no way to remove that association. This means that when the first test in the test suit determines a Web Component tag, it will be available for the other tests in that suit (within the same browser session).

The tests should ideally all be independent of each other, running automatically, in parallel if needed. If the first test fries a global var that further tests will depend on, they will break.

Worse still, if your fellow developer introduces a new test that happens to depend on a given state of that global var, then other tests might break it inadvertently by merely manipulating the global var.

All this means that if a Web Component depends on a declaration flow or on a name tag definition, it might introduce flaky tests when they are run together.

This is not a big deal if Web Components do not depend/use other Web Components *and* they map 1-1 to a given tag.

Unfortunately, this might be a limiting factor for some use cases. It is a limiting factor for the techniques I have been showing in this series.

![Three emojiis diagonally - world, dynamite, mind blown](/images/global_var.png "One Global Var per day...")

_Looks like they were unable to keep the 10x programmers away from the Web Components spec._

They certainly Got Shit Done. This is indeed a global var object with no way to remove the stuff placed in it.

Fear not. There are a couple of ways to circumvent this and other problems.

## The gloves won't fit OJ

The laziest way I found to run Web Components tests in the browser was to have a single `test.html` file that I open with the browser.

This single `test.html` file includes the test suits for each Web Component I want to test. The `*.test.js` files with the tests for each Web Component.

This `test.html` has no real dependencies. It is just a `.html` file that I can open directly in the browser without running a development server. Some tools can be used to make it auto-refresh and do parallel runs if necessary. But I just want to run tests for now.

The $FRAMEWORKs I used are Mocha and Chai, two old JS testing tools that provide bundles ready to be used directly in the browser:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset=utf-8>
  <title>Web Components Tests</title>

  <!-- Include the Mocha and Chai code bundles -->
  <link rel=stylesheet href=https://unpkg.com/mocha/mocha.css>
  <script src=https://unpkg.com/chai/chai.js></script>
  <script src=https://unpkg.com/mocha/mocha.js></script>
</head>

<body>
  <!-- Test results will show up inside this #mocha <div> -->
  <div id=mocha></div>

  <!-- This is where my Web Components will be placed at during testing -->
  <div id=domTestArea style="display: none;">
  <!--                  ^ no need to show them -->
  </div>
  
  <!-- Initialize the Mocha framework -->
  <script class=mocha-init>
    mocha.setup("bdd");
    // Leak checking is important with Web Components
    // Always include a list of global vars to ignore (empty for now)
    mocha.global([]);
    mocha.checkLeaks();
    // Make "assert" available in all `.test.js` files 
    const { assert } = mocha.chai;
  </script>
  
  <!-- Put the Web Components testing files here -->
  <script src=my-partner-is-a-web-component.test.js></script>
  <script src=i-should-go-out-more-web-component.test.js></script>

  <!-- Automatically start the Mocha framework -->
  <script class=mocha-exec>mocha.run();</script>

  <!--
    Some global initialization code:
      - create global testing helpers 
      - setup the App runtime parts
  -->
  <script type=module>
	// App initiliazation code goes here... I'll get to it 
  </script>

</body></html>
```

The code above is a straightforward Mocha and Chai browser-only setup for Web Components.

![The HTML5 badge in the middle of a lot of colored PacMan ghosts.](/images/html_bugs.png "Who is afraid of the Shadow DOM?")



## Tests initialization

Before any tests can be written, I like to do a standard global initialization of the whole thing. This mostly consists of importing the App module where the Web Components are declared and some global utility functions.


```html
  <!--
    Some global initialization code:
      - create global testing helpers 
      - setup the App runtime parts
  -->
  <script type=module>
	import { MyApp } from "../build/app-bundle.js";    
  </script>
```

The above creates the globally available things: The `MyApp` object of the app that will be using or wrapping the Web Components. This is optional. If the Web Components are just stand-alone, there will be no need for this. This is also a good place to create single tags with `customElements.define()` (if this is not done by the `MyApp` bundle).

When using Mocha it is necessary to also include the intended globals in the leaks ignore array:

```html
  <!-- Initialize the Mocha framework -->
  <script class=mocha-init>
    mocha.setup("bdd");
    // Leak checking is necessary with Web Components
    // Always include a list of global vars to ignore


    mocha.global(["MyApp"]);
    <!--          ^^^^^^^  -->

    mocha.checkLeaks();
    // Make "assert" available in all `.test.js` files 
    const { assert } = mocha.chai;
  </script>
```

_Yeah, but how are the Web Component tests gonna be done?_


## Suit up

I will break the Web Component tests into three parts that build on each other by adding extra complexity.

You decide if a given test needs all of these three features or just the first one.

The following code runs in its own dedicated test file, say an `i-should-go-out-more-web-component.test.js` with the Web Component tests with that name.

![A worm bug emoji in the middle of a target.](/images/bug_target.png "Please don't kill me!")

### 1 - Place the tags in #domTestArea and get the class

The basic test template to run the Web Component tests in the `#domTestArea` can be something like this:

```javascript
describe("<i-should-go-out-more>", function () {
  
    // Clear the #domTestArea between each test
    beforeEach(() => domTestArea.innerHTML = "");

    it("can do simple stuff with DOM tags", (done) => {
  
    })
})
```

Inside the test, I can use things in however I want (AAA pattern, or just fetuccine/spaghetti), but it is essential to at least do these things:

1. Put a Web Component tag in the #domTestArea
2. Get the Web Component class instance on that tag
3. Do some assertions


```javascript
describe("<i-should-go-out-more>", function () {
  
    const simpleTag = () => `
    <i-should-go-out-more>Some content</i-shoud-go-out-more>
    `;

    // Clear the #domTestArea between each test
    beforeEach(() => domTestArea.innerHTML = "");

    it("can do simple stuff with DOM tags", (done) => {
        // 1. Put a Web Component tag in the #domTestArea
        domTestArea.innerHTML = simpleTag();

        // 2. Get the Web Component class instance on that tag
        const instance = document.querySelector("i-should-go-out-more");
  
        // 3. Do some assertions
        // (here is where the test happens)
        assert(instance.parsedLines > 0, "Should parse content lines\n");
        
        // Async by default
        done();
    })
})
```

A note of attention is needed, if the original `MyApp` global var does not define a unique the Web Component tag (and its dependencies), and the `customElements` is part of the test then it might be needed to produce a new dynamic tag per test to work-around the global var problem:

```javascript
    const simpleTag = (testId) => `
    <i-should-go-out-more-${testId}>
        Some content
    </i-shoud-go-out-more-${testId}>`;
```

### 2 - Shadow DOM inspection

If a Shadow DOM is being used, it will be the root of what the Web Component renders. There might be a need to test its contents to see if the Web Component is doing the expected DOM output.

However, Shadow DOM can be manipulated throughout a Web Component's life in many different situations and ways.

One way to abstract the Web Component's inner workings from the test is to use a Mutation Observer for the root. The assertions are then placed inside the observer.

```javascript
describe("<i-should-go-out-more>", function () {
  
    const simpleTag = () => `
    <i-should-go-out-more>Some content</i-shoud-go-out-more>
    `;

    // Clear the #domTestArea between each test
    beforeEach(() => domTestArea.innerHTML = "");

    it("can do simple stuff with DOM tags", (done) => {
        // 1. Put a Web Component tag in the #domTestArea
        domTestArea.innerHTML = simpleTag();

        // 2. Get the Web Component class instance on that tag
        const instance = document.querySelector("i-should-go-out-more");
        // 2.1 Get the Shadow Root
        const root = instance.shadowRoot;
        // 2.2 Create a Mutation Observer for it
        const observer = new MutationObserver(async () => {  
        
            // 3. Do some assertions when the shadowRoot exists
            // (here is where the test happens)
            assert(instance.somethingShadowy, "Should have this property\n");
            // Async because nobody knows when
            // the shadow root observer might trigger 
            done();
        });

        // Shadow DOM is being changed asynchronously
        // "childList" is enough to observe its changes
        observer.observe(root, {
            childList: true,
        });
    })
})
```


## 3 - waitFor meeee

Testing Web Components is mostly an async task, tests will often need to wait a beat or a few milliseconds for things to be connected and children/attributes processed.

If this is the case for the Web Component being tested then it is importante to make sure that there is some kind of `waitFor` function available (either by the testing framework or place this in the `<script>` that initializes the `MyApp` and all utility functions):

```javascript
    // A very rough example of a `waitFor` function that
    // delays execution until a provided condition
    // becomes true (or a timeout is reached)
    async function waitFor(condition, timeout = 200) {
      // I don't want to comment this. It is just a quick and dirty approach
      // Give preference to your testing framework tools for this
      // I couldn't find anything similar for Mocha, so yeah:
      const activePoll = () => {
        return new Promise((resolve, reject) => {
          let timeoutId;
          const intervalId = setInterval(function () {
            if (condition()) {
              clearTimeout(timeoutId)
              clearInterval(intervalId)
              resolve(true);
            }
          }, 20);
          timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            reject()
          }, timeout)
        })
      }
      try {
        await activePoll();
        return true;
      } catch (e) {
        return false;
      }
    }
    globalThis.waitFor = waitFor;
```

With this function, I can wait for a given condition to happen before running the test assertions.

```javascript
describe("<i-should-go-out-more>", function () {
  
    const simpleTag = () => `
    <i-should-go-out-more>Some content</i-shoud-go-out-more>
    `;

    // Clear the #domTestArea between each test
    beforeEach(() => domTestArea.innerHTML = "");

    it("can do simple stuff with DOM tags", (done) => {
        // 1. Put a Web Component tag in the #domTestArea
        domTestArea.innerHTML = simpleTag();

        // 2. Get the Web Component class instance on that tag
        const instance = document.querySelector("i-should-go-out-more");
        // 2.1 Get the Shadow Root
        const root = instance.shadowRoot;
        // 2.2 Create a Mutation Observer for it
        const observer = new MutationObserver(async () => {  
        
            // 2.3 Wait for content
            const contents = [...instance.contentMap.values()];
            const contentCreated = await waitFor(
               () => contents.filter((c) => c !== null).length > 0
            );

            // 3. Do some assertions for the content above
            assert(contentCreated.includes("cool stuff"));
            
            done();
        });

        observer.observe(root, {
            childList: true,
        });
    })
})
```

## Conclusion

Testing Web Components is not fun. There is also not that much space to be creative here. Web Components have a lot of particularities that need to be considered. In this post, I presented three techniques to handle Web Component tests and their eventual awkward flow.

Having a commonplace (`#domTestArea`) to dump Web Components during testing and using some sort of `async waitFor()` inside a Mutation Observer on the `#shadow-root` looks like too much hassle. It feels that all of this should not be needed. I found that these three techniques solve most problems I often encountered when testing Web Components. I don't like these hacks but *they work* in general. Generally.

<hr>

This post is Part 5 of a series I am writing called <cite>"The Life of a Web Component"</cite>.

The previous parts are:
- [Part 1 - Initialization](/posts/the-life-of-a-web-component/).
- [Part 2 - As a variable bucket](/posts/the-life-of-a-web-component-as-var/).
- [Part 3 - Reversing Shadow DOM visibility](/posts/the-life-of-a-web-component-reverse-shadow-dom/).
- [Part 4 - Declarative State](/posts/the-life-of-a-web-component-state-in-shadow/).


