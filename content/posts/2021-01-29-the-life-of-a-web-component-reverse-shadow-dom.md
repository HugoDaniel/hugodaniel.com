+++
title = "The life of a Web Component - Reversing the Shadow DOM visibility"
description = "Shadow DOM displays its contents by default while hidding the original tag children. Can this be reversed? What kind of possibilities does it offer us if it does?"
date = 2021-01-29
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/html5_mask.png", class="center-images with-lists" }
+++


The other day I was thinking about what do HTML tags give us out of the box and made this list:

1. **Hierarchy**
```html
<luke-im-your-father>

	<nooo-thats-impossible></nooo-thats-impossible>

</luke-im-your-father>
```

2. **Sequence**
```html
<p>I’d use one for parts</p>
<p>If I ever have twins</p>	
```

3. **Meaning**
```html
<q cite="https://en.wikipedia.org/wiki/Meaning_(philosophy)">
A relationship between two sorts of things:
signs and the kinds of things they intend, express or signify
</q>
```

4. **Functionality**
```html
<video controls width="250">

    <source src="/media/cc0-videos/flower.webm"
            type="video/webm">

    <source src="/media/cc0-videos/flower.mp4"
            type="video/mp4">

    Sorry, your browser doesn't support embedded videos.
</video>
```

This list is by no means exhaustive. There are likely many more things that HTML tags give us (like headaches, reactjs, and some money at the end of the month if we are lucky).

With the Shadow DOM it is possible to compose all of the features above and hide them away inside custom tags.

I want to use Shadow DOM like a rug that I can sweep tags under it. A particular DOM root that cannot be seen and that is under the control of a tag.

5. **Encapsulation**
```html
<nevermind-the-backend-this-is-where-the-dragons-are>

<!-- there is nothing to see here because this tag has a Shadow root -->

</nevermind-the-backend-this-is-where-the-dragons-are>
```

This DOM root inception made me wonder: _"What is the default visibility behavior of the Shadow DOM? could it be reversed?"_

![The HTML5 badge with an amazing purple eye mask](/images/html5_mask.png "Shadow DOM is such a cool name, but wait until you see its fabulous mask!")

## Hmm, that sounds stupid, but how would it work?

When a Web Component has no shadow root, it will happily render all its children:

```html
<html><body>

<simple-web-component>
    <p>Hello world! I am not inside the shadow root.</p>
</simple-web-component>

<script>

customElements.define("simple-web-component",
// What follows is the the <simple-web-component> code:
class extends HTMLElement {
    initialize() {
      // Nothing for now... just a simple component
    }

    // Call initialize when added to a parent node
    connectedCallback() { this.initialize(); }
});

</script>

</body></html>
```

The code above creates the functionality for the `<simple-web-component>` tag. Which gets rendered as expected:

![A portion of a browser window, showing the following text in black letters "Hello world! I am not inside the shadow root", in a white background.](/images/no-shadow-dom.png "In direct sunlight")

However, this is not how it behaves when a shadow root is added to it.

### Adding a bare shadow root

The code inside the `<script>` tag needs to be slightly adjusted to add a shadow root.

```javascript
customElements.define("simple-web-component",

// The <simple-web-component> code:
class extends HTMLElement {
    
    root = this.attachShadow({mode: 'open'})
    
    initialize() {
        const p = document.createElement("p");
        p.textContent = "In the shadow!";
        this.root.append(p);
    }

    // Call initialize when added to a parent node
    connectedCallback() { this.initialize(); }
});

```

The `<simple-web-component>` class now has a `root` attribute [set with its shadow root](https://developer.mozilla.org/en-US/docs/Web/API/Element/attachShadow). Then a simple `<p>In the shadow!</p>` is placed inside it by the `initialize()` function.

This simple shadow root will affect the display of the component.

The previous `<p>Hello world! I am not inside the shadow root.</p>` will no longer be shown since it is outside the shadow root, and now only the shadow root contents are being displayed.

![A portion of a browser window, showing the following text in black letters "In the shadow!" in a white background.](/images/with-shadow-dom.png "Shaded")

However, the inspector tools shows how the tag is really juggling the shadow dom:

![The hierarchy of tags as seen by the inspector tools. Under the "simple-web-component" tag, there is a "#shadow-root" tag with a single "p" tag with the text "In the shadow!". Also, under the "simple-web-component" another "p" tag can be seen with the content "Hello world! I am not inside the shadow root."](/images/shadow-dom-inspector.png "This shadow is not for everyone")


Looking at the above hierarchy it is worth noting that the original `<p>Hello World!..</p>` is still there, but _why is it not visible?_

Once a shadow root is added to a tag, it becomes the thing that will get rendered. Shadow DOM is the authority, everything else is discarded, and only the stuff inside the shadow root gets displayed.

_Why?_

Because the idea was that whatever children a custom tag would have could get rendered with ninja tricks inside the shadow. Thus giving the impression that the custom tag was getting its input from its visible children and then performing hidden layout and style foojitsu on that input (such tricks would occur inside the shadow dom - hidden from the written HTML).

Nobody cares. In fact, let me revert this logic.

## You wouldn't download a car

The first step to revert the Shadow DOM is to copy all the custom components' children into its shadow root.

This will allow HTML to be rendered as expected while maintaining the Shadow DOM's encapsulation features.

Luckily the Web Components spec provides just the feature for this, through the `<slot>` tag.

### I'm such a `<slot>` 

This tag is used mainly in HTML `<template>`'s. It is the way that `<template>`'s have to tell which parts can be set by outsiders. Typically `<slot>`'s have a name attribute to be used after as the reference to where the content will go. (You can see an [example of it here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot#attributes), but it is not necessary, I won't be using it.)

The cool thing is that if there is no `name` specified on the `<slot>`, then it becomes the default `<slot>` where all unspecified content will go in.

This is perfect. It means that if a `<slot>` is placed inside the shadow root (without a `name="..."` attribute), then all of the custom element children will automatically be copied into it.

```html
<html><body>

<simple-web-component>
    <p>Hello world! I am not inside the shadow root.</p>
</simple-web-component>

<script>
customElements.define("simple-web-component",

// The <simple-web-component> code:
class extends HTMLElement {
    
    root = this.attachShadow({mode: 'open'})
    
    initialize() {
        const p = document.createElement("p");
        p.textContent = "In the shadow!";

        this.root.append(
          p,
          document.createElement("slot")
        );
    }

    // Call initialize when added to a parent node
    connectedCallback() { this.initialize(); }
});
</script>

</body></html>
```

The Shadow Root above will contain a single `<slot>` tag. This makes the `<p>Hello world! I am not inside the shadow root.</p>` show up when the tag is rendered.

![A portion of a browser window, showing two lines of text. The first one has the phrase "In the shadow!" and the second line has the phrase "Hello world! I am not inside the shadow root.". Both of them have black letters on a white background.](/images/with-slot.png "Both visible")

## Don't ask, don't tell

The second step to revert the Shadow DOM display is to only show the children of the element.

Hide everything that is outside the `<slot>`. Only the tag's original children must be visible, while all the other shadow root contents must be hidden.

To achieve it, the following CSS is added to the Shadow DOM:
```css
:not(slot) {
    display: none;
}
```

The common practice is to create a `<style>` tag, place the above content inside it and then append the `<style>` tag to the Shadow DOM:

```javascript
    initialize() {
        const p = document.createElement("p");
        p.textContent = "In the shadow!";

        const style = document.createElement("style");
        style.textContent = `
        :not(slot) {
          display: none;
        }`;

        this.root.append(
          style,
          p,
          document.createElement("slot")
        );
    }
```

And just like that, the actual behavior of the Shadow DOM is reversed. The Shadow DOM contents are hidden by default, while the original custom tag children get rendered by default.

![A portion of a browser window, showing one line of text with the phrase "Hello world! I am not inside the shadow root.". This text line has black letters on a white background.](/images/reversed-shadow-dom.png "Only the child paragraph is visible")

No "In the shadow!" text is visible.

## Conclusion

It is possible to sweep all kinds of useless thrash under the Shadow DOM.

However, it might require reversing the Shadow DOM's visibility (which is rendered by default).

To achieve it, a full copy of the custom element original children is made into the Shadow DOM (through the default `<slot>` tag). The next step is to hide everything inside the Shadow DOM that does not belong to the original children.

With these two moves, the element's original children become visible while leaving all the other shadow DOM contents invisible.
 
<hr>

This post is Part 3 of a series I am writing called <cite>"The Life of a Web Component"</cite>.

The previous parts are:
- [Part 1 - Initialization](/posts/the-life-of-a-web-component/).
- [Part 2 - As a variable bucket](/posts/the-life-of-a-web-component-as-var/).