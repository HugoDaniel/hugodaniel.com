+++
title = "The life of a Web Component - as a variable bucket"
description = "I explore tag creation in this post. How can Web Components be used to create dynamic tags? And what use are they? As an example, I try to make a simple style container that uses them."
date = 2021-01-28
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/HTML5_badge_tag.png", class="center-images with-lists" }
+++


JavaScript(JS) allows object classes to be anonymous. No need to bind your class to an identifier. Just write `class { ... },` and it is good to go. 

Prefix a regular <abbr title="JavaScript">JS</abbr> object `{ ... }` with `class` and have an anonymous class defined. 



![Three HTML5 badges in a row inside angle brackets like an html tag name. The first one has the normal orientation. The second one is upside down. The third one has a random orientation.](/images/HTML5_badge_tag.png "Let those tags roll!")


Nothing special here, they are in fact normal <abbr title="JavaScript">JS</abbr> objects. The big extra is that anonymous classes, just like normal classes, can use the <abbr title="JavaScript">JS</abbr> `extends` syntax to easily carry other objects and acumulate them.

```javascript
class SomeContext {
	name = "What do Web Components have to do with this?"
}

let withExtraContext = new (class extends SomeContext {
	displayName() {
        alert(this.name);
    }
})

withExtraContext.displayName()
```

It is possible to pick our favorite class and create other unique classes from it that are, in fact, just copies with nothing else added to them. Unique copies of class declarations. Here is an example:

```javascript
class VeryComplicatedClass {
  foo = "bar"
}

let MyUniqueCopy = (class extends VeryComplicatedClass {})

console.log(
  MyUniqueCopy instanceof VeryComplicatedClass
); // prints false

let anOriginalInstance = new VeryComplicatedClass(); 
let myUniqueCopyInstance = new MyUniqueCopy();

console.log(
  anOriginalInstance instanceof VeryComplicatedlass,
  myUniqueCopyInstance instanceof MyUniqueCopy
); // prints true, true

```

But what do Web Components have to do with all of this?

## It is awesome

The global `customElements` registry only allows a class to be associated with a single tag. Once a class has a corresponding tag-name set to it, it is no longer possible to set another-tag-name.

It makes sense. Why associate two tag names to the same class anyway? I don't know, but I still want to be able to do that nevertheless :)

```javascript
class Awesomeness extends HTMLElement {}

customElements.define("awesome-tag", Awesomeness);
// ^ all good, ready to use <awesome-tag> all over the HTML code.

customElements.define("i-want-to-be-awesome-too", Awesomeness);
// ^ No, you don't. This will throw an error.
```


![The error text: "Uncaught DOMException: CustomElementRegistry.define: 'i-want-to-be-awesome-too' and 'awesome-tag' have the same constructor"](/images/customElementsError.png "Nope")

Anonymous classes provide a simple way to avoid this limitation. By extending the Web Component class and using the unique copy of its declaration as a different tag-name. Like so:

```javascript
class Awesomeness extends HTMLElement {}

customElements.define("awesome-tag", Awesomeness);
// ^ all good, like before

customElements.define("i-can-be-awesome-too", class extends Awesomeness {});
// ^ yay \o/

customElements.define("me-too", class extends Awesomeness {});
// ^ party!

customElements.define("lets-all-be-awesome", class extends Awesomeness {});
// ^ ok, you get the idea
```

I am using multiple tag names for the same class. :)

The above allows the tags `<awesome-tag>`, `<i-can-be-awesome-too>`, `<me-too>` and `<lets-all-be-awesome>` to be used in <abbr title="HyperText Markup Language">HTML</abbr> and all of them will share the same functionality (because they all have `Awesomeness`).

_But since they all have the same functionality, why couldn't I use a single tag name?_

That is an excellent question. Having multiple tag names for the same class is the first step I found in dynamic HTML tags that can have any name and be defined only after.

## My head is too big for hats and too small to understand

This section is the part where I am going to create dynamic tag names with anonymous classes.

![The HTML5 badge with a handrawn hat on the top of it.](/images/html5_hat.png "My mother said it was cool")


Since I can't explain this well, let me try to do it with an example: a style container.

### Style container

Nowadays, there is a big wave of these CSS-In-JS-In-HTML-In-React-In-Vue-In-IOS-In-CSS-In-... approaches. People get upset with each other because of those styled-components vs. styled-system vs. styled-tailwind-my-head-is-bigger-than-yours arguments.

I don't like any of them, plain <abbr title="Cascading Style Sheets">CSS</abbr> is still king in my small street, but that doesn't mean that I can't try to add yet another styling approach to the mix. After all, this is such a pleasant hill to die at.

### StyleContainer

This new <abbr title="Cascading Style Sheets">CSS</abbr> framework is going to be made by just two classes. A container class and a class for the children.

The purpose of the children's class will be to hold a bunch of CSS inline style parts. It starts by reading its `textContent` and place it as a style part of itself.

```javascript
class StyleChild extends HTMLElement {
    parts = []

    initialize() {
        this.parts = [this.textContent]
    }
	
    // Initialize when added to a parent node
    connectedCallback() { this.initialize() }
}
```

For the `StyleContainer`, I want it to read its children tag names and create a new Web Component for each tag.

```javascript
class StyleContainer extends HTMLElement {
    initialize() {

        for (const child of this.children) {

            const childName = child.tagName.toLocaleLowerCase();

            // Make the child become a new Web Component
            // if it was not yet made one. 
            if (!customElements.get(childName)) {

                customElements.define(childName, class extends StyleChild {});

            }
        }
    }
    // Initialize when added to a parent node
    connectedCallback() { this.initialize() }
}
```

_What does this do?_

It reads the children's tag names (whatever they are) and turns them into a Web Component (provided they are [valid Web Component tag names](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)).

_Does it even work?_

Yes! <cite>Because element definition can occur at any time, a non-custom element could be created, and then later become a custom element after an appropriate definition is registered. We call this process "upgrading" the element, from a normal element into a custom element.</cite> (says the spec)

_But I mean, what? Why? WTF?_

Yeah, I don't know, but it gets better.

### `<style-container>`

The above code allows HTML to be written with some sort of <abbr title="HyperText Markup Language">HTML</abbr> variable buckets.

```html
<body>
	<button>Spank me</button>

	<style-container>
		<super-border>
			border: 5px dashed mediumseagreen;
			box-shadow: 0 0 0 3px;
		</super-border>

		<fancy-background>
			background: #563f0e;
		</fancy-background>

		<a-cool-font>
			font-family: Marcellus, serif;
			font-size: 3em;
			text-shadow: 0 2px #fff;
		</a-cool-font>
	</style-container>
</body>
```

When the `StyleContainer` gets `define`d at the `customElements` registry (with the `"style-container"` tag name), the above code run its logic. It looks for the children and creates tags `<super-border>`, `<fancy-background>` and `<a-cool-font>`.

These tag names can have the semantic value of a variable. <abbr title="HyperText Markup Language">HTML</abbr> variables. Or any other semantic value or purpose that might be fit. Anonymous classes create dynamic tag names, where you place whatever name you want in the HTML. After that, it is up to the intended implementation/framework/idea to give them meaning and flow.

### "References" said the referee

The HTML code can then reference these dynamic tags.

They can be used to compose more complex styles. With a composer Web Component, lets say... the `<import-style>` Web Component (not yet defined):

```html
<body>
	<button>Spank me</button>

	<style-container>
		<magic-button>
			<import-style src="super-border"></import-style>
			<import-style src="fancy-background"></import-style>

			padding: 2rem;
			text-transform: uppercase;
			pointer: cursor;
		</magic-button>

		<super-border>
			border: 5px dashed mediumseagreen;
			box-shadow: 0 0 0 3px;
		</super-border>

		<fancy-background>
			background: #563f0e;
		</fancy-background>

		<a-cool-font>
			font-family: Marcellus, serif;
			font-size: 3em;
			text-shadow: 0 2px #fff;
		</a-cool-font>
	</style-container>
</body>
```

Or use the dynamic tags as plain references outside of the `<style-container>`:

```html
<body>
	<button styled-by="magic-button">Spank me</button>

...
```

Where the `StyleContainer` would do something like: 

```javascript
document.querySelectorAll("[styled-by~='magic-button']")
```

And apply the contents of the `magic-button` tag to the inline `style` attribute to the nodes found.


_How does this differ from plain HTML?_

It is another way to write it. Maybe it is better than placing "id"'s in common tags, perhaps it goes against the pure HTML semantic values, or perhaps it is just a shitty idea. I have no strong opinion. It is just an idea.

_Couldn't I just use CSS?_

Yes.

_Why all of this, then?_

I don't know the answer to this. I like the approach of giving logic a declarative front. HTML is good at that. It is declarative and also dynamic through Web Components. How much logic should go into it, or what kind of logic is something that might be cool to find out. I do think <abbr title="Cascading Style Sheets">CSS</abbr> styles definitely should not :D (we already have the `class` attribute and CSS vars).

## Conclusion

I presented a small example of Web Components to create dynamic tag names. I think that having the possibility to declare a new tag name under a given parent has some cool opportunities. I don't know what can be possible or what this might entail, but still, it is something that we can do with Web Components and maybe use to break logic into easily identifiable small parts.

<hr>

This post is the Part 2 of a series I am writting called <cite>"The Life of a Web Component"</cite>.

Here it if you want to read it: [Part 1 - Initialization](/posts/the-life-of-a-web-component/).


