+++
title = "The life of a Web Component - Declarative State"
description = "With custom tags, it is possible to use HTML to declare and decompose complex app states. In this post, I try to show a viable approach to do this."
date = 2021-01-30
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/js_logo_with_html.jpg", class="center-images with-lists" }
+++

What if custom tags could be used for the application state?

For instance, consider a simple todo app that gets rendered like this:

```HTML
<html><body>

<todo-app>
<ol>
    <li>Sleep better, don't be tired.</li>
    <li>Replace a tire</li>
    <li>Write a tiresome article</li>
    <li>?????</li>
    <li>Profit</li>
    <li>Nah, forget profit, just write something</li>
</ol>
</todo-app>

</body></html>
```

Just a simple list of todos, declared and visible both in the browser and in code, a typical day in HTML.

Then each of those `<li>` items in the todo app could have some state associated. Here is a configuration that might fit it:

- Creation date
- Tags/Category
- Cost

This is on top of what HTML already elegantly declares:

- Item content ("Replace a tire" etc.)
- Item order (what is the sequence of items)

It would be cool if they could be referenced by some id as well. In HTML, this "id" is just their node element. It is unique from the moment it exists in the DOM (but there is also the "id" attribute only in case a human readable id is needed). 

One possible state representation for the Todo Item could be done in JS using a normal object:

```javascript
function createItemState(creationDate, categories, cost) {
    return (
    { creationDate
    , categories
    , cost
    });
}
```

Which would then be used at the bigger app state structure:

```javascript
const todoAppState = {
    todoItems: new Map([
        [ "Sleep better, don't be tired"
        , createItemState(Date.now(), ["lifestyle"], 0)
        ],
        [ "Replace a tire"
        , createItemState(Date.now(), ["chores"], 9001)
        ]
        // ...
    ])
// some other app state here...
};
```

There are infinite other ways to map this state in JS. This is just to lay out the mapping to HTML.


![The yellow JavaScript logo, with HTML5 badges masking the letters J and S](/images/js_logo_with_html.jpg "On the internet nobody knows you're an HTML!")

Bringing the above examples from JavaScript into HTML can be done by using a custom element for each state "unit". Something like this:

```html
<todo-app-state>
    <todo-items>
        <item-state>
            <creation-date>2021-01-31</creation-date>
            <category-list>["lifestyle"]</category-list>
            <cost-of-doing>0</cost-of-doing>
        </item-state>

        <item-state>
            <creation-date>2020-10-10</creation-date>
            <category-list>["chores"]</category-list>
            <cost-of-doing>9001</cost-of-doing>
        </item-state>

        <!-- ... other items here ... -->
    </todo-items>
</todo-app-state>
```

It has the potential to become involved. A common strategy to break state complexity down is to think of it as the flow of actions that transform it, instead of thinking of it as the content it holds.

In that view, the above only becomes:

```html
<todo-app-state>
    <todo-items>
    <!-- contents will be generated by the actions -->
        <item-state>
            <creation-date> Don't care </creation-date>
            <category-list> Whatever </category-list>
            <cost-of-doing> Meh </cost-of-doing>
        </item-state>
    <!-- ^ no need to think more than one ^ -->
    </todo-items>
</todo-app-state>
```

Since HTML provides sequence, a list of state modifying actions can then be defined with it:

```HTML
<todo-app-state>

    <actions-list>
       <create-item>Sleep better, don't be tired.</create-item>
       <create-item>Get out of bed.</create-item>
       <delete-item>Get out of bed.</delete-item>
    </actions-list>

    <todo-items>
    <!-- ^ This will be populated through the actions above ^ -->
    </todo-items>
</todo-app-state>
```

The `<todo-items>` inner state is populated by running through the sequence of items on the `<actions-list>` element. This is just bringing into declarative HTML a popular state handling mechanism - a sequence of state transformations.

_That is ugly looks like XML, I don't want that in my code_

Indeed, that is why reversing the Shadow DOM visibility is handy. It makes for the perfect trash bin to dump this state. Letting the app be just plain pure HTML.

```html
<html><body>

<todo-app>
  #shadow-root
      <actions-list>
          <create-item category="lifestyle">
              Sleep better, don't be tired.
          </create-item>
          <create-item>Get out of bed.</create-item>
          <delete-item>Get out of bed.</delete-item>
          <create-item category="chores" cost="9001">
              Replace a tire.
          </create-item>
      </actions-list>

      <todo-items>
          <item-state>
            <creation-date>2021-01-31</creation-date>
            <category-list>["lifestyle"]</category-list>
            <cost-of-doing>0</cost-of-doing>
          </item-state>

          <item-state>
            <creation-date>2021-01-31</creation-date>
            <category-list>["chores"]</category-list>
            <cost-of-doing>9001</cost-of-doing>
          </item-state> 
      </todo-items>
      <style>
          :not(slot) {
             display: none;
          }
      </style>
      <slot>⮑</slot>

<ol>
    <li>Replace a tire.</li>
    <li>Sleep better, don't be tired.</li>
</ol>
</todo-app>

</body></html>
```

![The HTML5 badge broken in two, in the middle an imagem of two monkeys grooming hair.](/images/html5_code_monkeys.png "HTML code monkeys")

In a way, a tag with the Shadow DOM visibility reversed and state will emit no real HTML. Only the HTML provided by its children gets linked to being shown at the `<slot>`, nothing else is visually added, things are kept under the Shadow DOM, waiting to be revealed in a late-night debugging session.

If I need to know the app's current state, I open the developer tools, expand its `#shadow-root`, and there it is, in full glory with the actions that created it.

The partitioning and separation that I present here is just one possible example among the infinite possibilities in declarative state presentation.

## Big conclusion that is more like a rant than a conclusion

Thinking about the state is paramount when building a complex app. It is an effort particularly hard for me because I do not like to think that much and prefer to just chill. Functional programming intellectuals have long been shouting that state management is actually a somewhat solved problem.

They argue that it is much better to have no state and just bounce a couple of vars around, transforming them with a sequence of actions. I think that is what they mean with their jargon.

The Lisps yoga gurus shove their variables with a bunch of parentheses, define's and recursive logic. Haskell Scientologists are a bit more refined and seem to prefer "Monads" with "syntactic sugar" or whatever.

![An image of a UFO in the sky beaming lambdas. Bellow the image the letters "Eat Haskell Motherfuckers".](/images/eat_haskell.png "Healthy alien diet")


When considering state management techniques, we front-end devs are clearly the peasants. The low-life form resigned to pick up the elite's crumbs and glue them together with spit in a global variable with a name that looks like it is something serious and functional, say "redux".

The story doesn't end there because even within the front-end mambo, there are differences. In particular, the vanilla crowd is the underrepresented minority. Why use plain HTML and CSS when you can throw a ton of JS and do all of it with the latest cool frameworks? In fact, forget JS, lets use <s>Haxe</s>, <s>CoffeScript</s>, <s>Flow</s>, <s>Babel</s>, TypeScript.

### Nobody ever made it to Fortune 500 with that tech.

HTML deserves a bit more attention. It has to be possible to define a complex app state with something that gives us a declarative hierarchy with an exact sequence that binds semantics with functionality.

When breaking complicated things into manageable parts, I typically think about the following questions:

1. What kind of "buckets" can the information be split into?
1. How are the items in those buckets going to be referenced in the app?
1. Will those "buckets" work for 0, 1, and n items? (sometimes n*n*n*...*n?)
1. How is information going to flow into them and out of them?
1. Why are all the hipsters, brogrammers, and rockstars moving from JS into Swift?

Can HTML custom tags provide an acceptable abstraction to those questions? I don't know. I don't even want to have to think about a complex app. Complexity is just simplicity waiting to be born.

However, Web Components can provide a way to declare a state that can easily be removed after. Which is more than good enough for me :)

<hr>

This post is Part 4 of a series I am writing called <cite>"The Life of a Web Component"</cite>.

The previous parts are:
- [Part 1 - Initialization](/posts/the-life-of-a-web-component/).
- [Part 2 - As a variable bucket](/posts/the-life-of-a-web-component-as-var/).
- [Part 3 - Reversing Shadow DOM visibility](/posts/the-life-of-a-web-component-reverse-shadow-dom/).
- [Part 5 - Get Tested](/posts/the-life-of-a-web-component-tests/).
