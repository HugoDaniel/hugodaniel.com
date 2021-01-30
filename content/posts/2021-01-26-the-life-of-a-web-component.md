+++
title = "The life of a Web Component - Initialization"
description = "This post is a quick write-up on some of my learnings in experimenting with Web Components. It focuses mostly on the small subset of their life-cycle methods that deal with initialization."
date = 2021-01-26
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/html5_components.png", class="center-images with-lists" }
+++


I've been playing around with Web Components lately. They are quite an exciting thing with a vast range of use cases and possibilities. Web Components provide a very flexible API to explore non-standard approaches and Frankenstein contraptions. I know I will :)

[MDN has an excellent intro to Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components). It explains the three main parts of Web Components in some detail (custom tags, shadow root, and template slots). I recommend you start with MDN if you are looking to take your first steps into this tech.


![Three HTML5 badges in a row. The first one has the normal orientation. The second one is upside down. The third one has a random orientation.](/images/html5_components.png "They said it would be easy")

Here is a quick explanation if, like me, you are coming from a text-book framework (react, vue, svelte, etc…) and have not done anything too serious with them:

* Web Components are JavaScript classes, and they work through Object-Oriented Programming by extending the known HTML tags (or more commonly the HTMLElement)

* You can define new HTML tags with Web Components by associating your component object class with a tag name. This happens by using the global `customElements.define(“blink-tag-never-dies”, class MakeItBlink extends HTMLElement {})` (creates the `<blink-tag-never-dies>`)

* You can spray the HTML code with tags before they are defined. The browser is smart and can delay their display or progressively enhance them (if they extend a known element, like a button or something).

* Web Components have their DOM root (called the "shadow dom") that provides encapsulation for style and hierarchy.

* Web Components can have multiple templates and multiple parts inside each template using the `<slot>` tag.

* A class can only have a single tag associated with it.

Their life-cycle methods are nuanced and happen at different stages than the common text-book frameworks typically present us with their components.

## Just being alive

Here is a small subset of the life-cycle of a Web Component:
* Component creation in memory.
  
  The Web Component's life starts here, where the `constructor()` of the class gets called. It happens once per instance/tag occurrence and gets called instantly when a `document.createElement("")` is done for the custom tag defined for it.

* An existing DOM element receives the component as a child.
  
  Runs the Web Component `connectedCallback()` class method, which can occur multiple times during a Web Component life. Special attention is needed here because the `connectedCallback()` is triggered whenever `appendChild(myComponentInstance)` is called (even if it does not move the web component from its existing parent).

* If the Web Component uses `<slot>` elements, they fire a `slotchange` event when they receive children or their hierarchy changes (which happens at least once after the `connectedCallback()`)

  However, only hierarchy changes inside the slot trigger this event. Something more advanced is needed if you need a notification for changes on the textContent of a child.

After playing for a while with Web Components, here are some personal considerations about their initialization methods.

## A super constructor does nothing at all.

The Web Components spec is clear about [what a `constructor()` can do](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance). The limitations are many and entirely optional. It is a guideline when they say, <cite>"The element must not gain any attributes or children, as this violates the expectations of consumers who use the createElement or createElementNS methods.".</cite> It is entirely up to us to abide or not.

Since I'm not too fond of code and rules, I tend to skip adding a constructor in most of my Web Components. I ask myself: "do I need an event listener? Can it be delegated elsewhere? Do I need shadow root encapsulation? What am I going to cook for dinner? If food were Web Components would it need to be constructed?".

Anyway, delegating logic to the caller/parent is the long-honored approach of the lazy dev. Moving some logic to the component or code above usually makes things easier to remove while keeping it more uncomplicated down the hierarchy.

In this regard, the basic Web Component creation template would be something like:

```javascript
class ImAWebComponent extends HTMLElement {
// no constructor()
}
```

That's it, no constructor. No need to keep up with the Web Components spec rules and the browser will use the `HTMLElement` standard constructor.

## All these notifications keep distracting me.

Like the constructor approach above, it is better to keep the Web Component disconnected. That means that it is preferable to avoid using the `connectedCallback()` method when possible.

Why? Because this particular method can be called multiple times throughout the life of a Web Component. Should it be responsible for the initialization of the Web Component? What happens if the components move around after being already initialized? Can the component code handle being "initialized" multiple times on top of each other? Why is this Web Component alive? (why are we all?) Will it have fun during its life-time? Will this Web Component spend its life under its parent's home?

For most autonomous Web Components I find it better to design them with no DOM attachment flow in mind. That means that the simple Web Component template remains the same:

```javascript
class ImAWebComponent extends HTMLElement {
// no constructor()
// no connectedCallback()
}
```

Then use a life flow that I am more comfortable with, say something like:
```javascript
class ImAWebComponent extends HTMLElement {
// no constructor()
// no connectedCallback()

initialize() {
// some initialization logic here
}

update() {
// refresh stuff and keep things revised
}
...
```

The idea here is to use whatever suits you better as the life-cycle-flow of your components. Web Components have a somewhat low-level API that molds quickly to the kinkiest desires. You can make them work closer to how you like to decompose problems or instead go wild and be creative. 

You can avoid classes altogether and use a pure-functional approach that ultimately nails down to the Web Component class like some IO trash-can. Or keep using Object-Oriented Programming and spawn a vast forest of hierarchical extensions. Or use another language, why stick to JavaScript if Web Components are just HTML that can be executed by your favorite language WebView in a declarative way? All good, everything is possible here.

```javascript
addEventListener("load",
  () => document.querySelectorAll("my-tag")
                .forEach(tag => tag.initialize()))
```

Calling the `initialize()` or `update()` functions can then happen at any moment, controllable by the app. In a `render()` function? Once at the "load" event? How to use it will largely depend on what kind of component this is and its context.

## Web Components can use other Web Components.

As expected, a Web Component can use another Web Component. However, the browser is not always smart enough to delay its creation until the `customElements` global registry defines the tag for the Web Component that it depends.

A common approach is to use the `customElements.whenDefined("my-tag")`, which returns a Promise when the tag is defined. Put a bunch of these in a `Promise.all` array if the Web Component uses other Web Component tags inside it.

```javascript
class MyComponent extends HTMLElement {
  whenLoaded = Promise.all(
    [
      customElements.whenDefined("dom-loop"),
      customElements.whenDefined("redux-for-blink-tags"),
    ],
  );

  initialize() {
	this.whenLoaded.then(() => {
    // Runs after the `whenLoaded` promise resolves
    });
  }
}
```

The above pattern guarantees that the "dom-loop" and "redux-for-blink-tags" are availabe inside the initialization promise.

## Conclusion

I am having fun playing with Web Components and believe that they provide a fertile ground for experimentation. This post is just a quick intro to a subset of their life-cycle methods and the provided functionality included in browsers that don't need extra JS to exist. I will write about my further investigations with Web Components in the following days.

<hr>

This post is Part 1 of a series I am writting called <cite>"The Life of a Web Component"</cite>.

The other parts are:
- [Part 2 - As a variable bucket](/posts/the-life-of-a-web-component-as-var/).
- [Part 3 - Reversing the Shadow DOM](/posts/the-life-of-a-web-component-reverse-shadow-dom/).
- [Part 4 - Declarative State](/posts/the-life-of-a-web-component-state-in-shadow/).