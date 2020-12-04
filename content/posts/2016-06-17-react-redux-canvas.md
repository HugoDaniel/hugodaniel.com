+++
title = "React - Redux - Canvas"
description = "Three approaches on drawing on the canvas with React and Redux"
date = 2016-06-17
extra = { place = "Lisboa", author = "Hugo Daniel" }
+++

Painting stuff on a `<canvas>` is easy, call [HTMLCanvasElement.getContext()](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext) to get the [CanvasRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) and then use its functions to express yourself.

Doing an animation is also easy, call [window.requestAnimationFrame()](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to tell the browser that you want to do an animation, and on it use the [CanvasRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) to animate as you see fit (tipically clearing the part of the drawing that changed and painting the new version of it).

```
var canvasElem = document.getElementById("canvas");
var w = window.innerWidth;
var h = window.innerHeight;
var rectSize = 256;
// set the canvas size
canvasElem.setAttribute("width", w);
canvasElem.setAttribute("height", h);
// get the context
var ctx = canvasElem.getContext("2d");
// the animation loop
function animation(t) {
  window.requestAnimationFrame(animation);
  var time = t*0.001;
  var cost = (Math.cos(time) + 1) / 2;
  var sint = (Math.sin(time) + 1) / 2;
  var rc = rectSize*cost;
  var rs = rectSize*sint;
  var color = `rgb(${Math.round(cost*255)},
               ${Math.round(sint*255)},
               255)`;
  ctx.fillStyle = color;
  // a simple rectangle
  ctx.fillRect(rc, rs, rc, rs);
  };
window.requestAnimationFrame(animation);
```

## Then came React

[React](https://facebook.github.io/react/) lets us use composable components of code and html elements to do our web apps of the future. To keep things running nicely it defines a common lifecycle for each component. The most simple version of it is that it "mounts" the component on the renderer and updates it when input changes.

The most used React DOM renderer is their official ["react-dom"](https://www.npmjs.com/package/react-dom), it uses minimal stateless virtual DOM elements (called ReactElements) for your components and pushes them to the real DOM when appropriate.

A common approach of using only [React](https://facebook.github.io/react/) to paint on a `<canvas>` is to render the element and fetch the context when it is mounted. Here is an example of a basic canvas component:

```
export default class Canvas extends Component {
  componentDidMount() {
    let canvas = findDOMNode(this.refs.canvas),
        ctx = canvas.getContext("2d");
    this.props.onContext(ctx);
  }
  render() {
    const { width, height } = this.props;
    const canvasCx = `Canvas ${this.props.className}`;
    return (
      <canvas className={canvasCx} ref="canvas"
              width={width + "px"} height={height + "px"}
              style={ { display: "block" } }
      />
    );
  };
}
Canvas.propTypes =
  { width:     PropTypes.number.isRequired
  , height:    PropTypes.number.isRequired
  , onContext: PropTypes.func.isRequired
  };
```

To increase reusability the context is passed to the parent component where it can be used by its developer sprawling moisture of creative juices.

Here is an example of a component that draws a simple grid using the Canvas component defined above.

```
import React, { Component, PropTypes } from "react";
import { findDOMNode }                 from "react-dom";
import Canvas                          from "./Canvas.jsx";

export default class GridCanvas extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { ctx: null }
  };
  _renderGrid() {
    const { color, lineWidth, squareSize
          , offsetX, offsetY
          , width, height
          } = this.props;
    const { ctx } = this.state;
    // adjust for vertical screens:
    const limit = Math.max(width, height);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    // draw the horizontal lines
    for( let y = offsetY % squareSize; y < limit; y += squareSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    // draw the vertical lines
    for( var x = offsetX % squareSize; x < limit; x += squareSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }
  render() {
    const { width, height, cursor, color } = this.props;
    const { ctx } = this.state;
    if( ctx ) {
      // canvas render commands go here
      ctx.clearRect(0, 0, width, height);
      this._renderGrid();
    }
    return (
      <Canvas className={ `GridCanvas ${this.props.className}` }
              width={width} height={height}
              onContext={ ctx => this.setState( { ctx } ) }
      />
    );
  };
}
GridCanvas.propTypes =
  { color:      PropTypes.string
  // ^ color for the stroke of the outline of the grid
  , lineWidth:  PropTypes.number
  // ^ the width, in pixels, for the grid line
  , offsetX:    PropTypes.number
  , offsetY:    PropTypes.number
  , cursor:     PropTypes.string
  // ^ the mouse cursor to use when mouse is over the grid
  , squareSize: PropTypes.number
  , width:      PropTypes.number.isRequired
  , height:     PropTypes.number.isRequired
  };
GridCanvas.defaultProps =
  { cursor: "default"
  };
```

The [CanvasRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) is kept in the state and then used in render() to clear and draw the shapes. This way the code is run in sync with the [React DOM flow](https://facebook.github.io/react/docs/component-specs.html).

This works very well if you intend to draw single frame art, however since it is coping with [React lifecycle flow](https://facebook.github.io/react/docs/component-specs.html) it might not be the best approach if you intend to have 60fps animations because the [React](https://facebook.github.io/react/index.html) logic will be running alongside your context drawing code in those precious 16ms of the frame.

You can try to optimize your [React](https://facebook.github.io/react/index.html) UI with [shouldComponentUpdate](https://facebook.github.io/react/docs/component-specs.html#updating-shouldcomponentupdate) and you should. But it is still going to contend when your UI hasn't changed and all you want to do is to update the `<canvas>` with a master piece of an animation.

## React, but only partially

Luckily [React](https://facebook.github.io/react/index.html) is not intrusive and ["react-dom"](https://www.npmjs.com/package/react-dom) is intended to be used along standard HTML/JS code. This allows developers to only use [React](https://facebook.github.io/react/index.html) on certain parts of their website, the aspiring artist can then use it for most of the parts of the app and keep the `<canvas>` outside of its logic.

```html
<!doctype html>
<html>
  <head> <title>React and Canvas</title> </head>
  <body>
    <div id="react-root">
      <!-- react goes here -->
    </div>
    <canvas id="animation"></canvas/>
    <script src="https://fb.me/react-15.0.1.js"></script>
    <script src="https://fb.me/react-dom-15.0.1.js"></script>
    <script>
      var animNode = document.getElementById("animation");
      var ctx = animNode.getContext("2d");
      function loop(t) {
        window.requestAnimationFrame(loop);
        // draw something on the canvas
      }
      window.requestAnimationFrame(loop);
      // React renders on the "react-root" node
      ReactDOM.render(<MyApp />, document.getElementById("react-root"));
    </script>
  </body>
</html>
```

All is good if you don't intend to make the `<canvas>` high-speed animation interact with the [React](https://facebook.github.io/react/index.html) part of the code.

If you want to communicate between the `<canvas>` and [React](https://facebook.github.io/react/index.html) then you will have to adopt some interaction strategy (e.g. passing a callback as a prop; using plain JS events; etc...).

However if you have been through the trenches, your battle proven developer experience is probably telling you that this is an optimization trade-off that will quickly grow into a pessimization.

State will most likely start to accumulate outside and inside of both parts as communication starts becoming more intricate and managing it will give you with many scars to heal.

## Redux will make good for all our sins

[Redux](http://redux.js.org/) defines a unidirectional flow of data on your application. It uses a single store to hold the application state and allows it to be updated by a pure function that computes the next state based on the actions dispatched by the app. They call the pure function a "reducer" and you can have as many of them in your app as you want.

This is within the spirit of pure components: something that always produces the same output if fed with the same input. When used with [React](https://facebook.github.io/react/index.html) it opens the door to simpler optimized components with predictable state.

Unfortunately the [CanvasRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) is not pure, its functions rely on a bunch of inner state that can change outside of their scope. This makes it hard to master and to manage (on the other side it has sprawled a counteless number of JS libs to work with it).

It also makes it difficult to integrate with [Redux](http://redux.js.org/) which by design expects pure actions and state. It is useless to keep the [CanvasRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D) in the store and update it with a reducer because its drawing functions will change it outside the pure flow of [Redux](http://redux.js.org/) actions.

To make things a bit worse, high-performance canvas applications [are encouraged](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas) to follow a set of destructive/impure practices which are hard to follow if using React/Redux.

## Introducing [redux-canvas](https://github.com/HugoDaniel/redux-canvas)

What if along with the [Redux](http://redux.js.org/) actions that update an app pure state we could issue painting actions to be performed in the impure canvas context ?

This is what [redux-canvas](https://github.com/HugoDaniel/redux-canvas) is meant to do. It allows you to keep your UI running purely with well defined components and their respective lifecycles, while giving you a shortcut to call functions on registered canvas contexts.

It is a [Redux](http://redux.js.org/) middleware that works by keeping a [Map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) of [CanvasRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)'s that persist between redux actions, and then it passes the Map() to the functions you specify when dispatching the action.
These functions are called within a requestAnimationFrame().

This way your impure code will be playing together with the pure code without messing with it. You can keep your UI pure while playing with canvas as you see fit (perhaps even trying to keep it pure as well).

In the next post I will write some usage examples with animations and also create a few helper functions to ease the usage of [redux-canvas](https://github.com/HugoDaniel/redux-canvas).

Meanwhile checkout my take on [console.log()](@/posts/2017-08-11-mastering-console-log.md), a quick look into [ImmutableJS](@/posts/2017-10-03-in-loving-memory-of-immutable.md) and my performance measurements on [JavaScript Set](@/posts/2017-10-26-how-useful-is-the-javascript-set.md).
