+++
title = "Shader Canvas"
description = "A graphics framework for specialists"
template = "project.html"
date = 2021-02-16
extra = { github = "https://github.com/HugoDaniel/shader_canvas", docs = "https://doc.deno.land/https/deno.land/x/glsl_variables@v1.0.2/parser.ts", author = "Hugo Daniel", social_img = "/images/deno_tag_logo.png", class="center-images with-lists" }
+++

```html
<shader-canvas>
<!--
  Shader canvas starts with this tag
  Its children tags defines what will
  be rendered.

  It can use multiple graphical API
  backends.
-->
  <webgl-canvas>
<!--
  Start the WebGl backend
  (the only one supported for now)

  Inside this element, each tag
  corresponds to its low level
  WebGL function.
-->

    <draw-calls>
<!--
  List the actions to perform when
  drawing. Each tag matches the
  corresponding WebGL function.
-->
      <clear-color red="0" green="0" blue="0" alpha="1"></clear-color>
<!--
  The <clear-color> matches the
  WebGL "clearColor()" function

  There is one of these for each
  WebGL function.
-->
      <clear-flags mask="COLOR_BUFFER_BIT"></clear-flags>
<!--
  The <clear-flags> matches the
  WebGL "clearFlags()" function

  Each tag has attributes according
  to the names given to the function
  arguments in the WebGL spec.
-->

      <use-program src="simple-triangle">
<!-- 
  Likewise <use-program> matches the
  "useProgram()" function.
  The "src" attribute can reference
  the tag name that defines the
  WebGL program to use.

  In this case <use-program> will
  look for the <simple-triangle>
  program, defined bellow.
-->
        <draw-vao src="triangle-vao"></draw-vao>
<!--
  Any tag inside <use-program>
  has the program bound to it.

  Here, <draw-vao> is calling the
  WebGL draw function for the
  Vertex Array Object defined
  bellow at the tag <triangle-vao>.
  (VAO stands for Vertex Array Object).
-->
      </use-program>
    </draw-calls>


<!--
  Besides the <draw-calls> the 
  <webgl-canvas> can have 4 containers:
   - <webgl-programs>
      * every child will be a program
   - <webgl-buffers>
      * every child will be a buffer
   - <webgl-textures>
      * every child will be a texture
   - <webgl-vertex-array-objects>
      * every child will be a
        vertex-array-object

  Their direct children tag names can
  be used as a reference in the "src"
  attribute of other tags.
-->
    <webgl-programs>
<!--
  Inside the <webgl-programs> container
  you can define the WebGL programs
  by specifying a unique tag name to
  each program.
-->
      <simple-triangle>
<!--
  Here starts the program
  "simple-triangle". Any name could
  be set.
-->
        <vertex-shader>
<!--
  A WebGL program has a vertex-shader
  and a fragment-shader.
-->
          <code>
            #version 300 es
            in vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
          </code>
        </vertex-shader>
        <fragment-shader>
          <code>
            #version 300 es
            precision highp float;
            out vec4 outColor;
    
            void main() {
              outColor = vec4(1, 0, 1, 1);
            }
          </code>
        </fragment-shader>
      </simple-triangle>
    </webgl-programs>

    <webgl-vertex-array-objects>
<!-- 
  <webgl-vertex-array-objects> works
  like <webgl-programs>: you can put
  any name here as a child tag,
  provided it is unique.

  Other tags can then reference this
  name in their "src" attributes.
-->
      <triangle-vao>
<!-- 
  Here a Vertex Array Object
  called "triangle-vao" is being
  defined.
-->
        <bind-buffer src="triangle-vertices">
<!--
  <bind-buffer> corresponds to the
  WebGL function "bindBuffer()"

  It is referencing the tag 
  "triangle-vertices" which is
  a buffer defined bellow
  in <webgl-buffers>
-->
          <vertex-attrib-pointer variable="a_position" size="2">
          </vertex-attrib-pointer>
<!--
  Any child of <bind-buffer> will
  have the referenced buffer bound.

  Here the <vertex-attrib-pointer>
  will use the "vertexAttribPointer()"
  function for the buffer set at the
  <triangle-vertices> tag.
-->
        </bind-buffer>
      </triangle-vao>
    </webgl-vertex-array-objects>

<!--
  <webgl-buffers> is a container like
  <webgl-vertex-array-objects> and 
  <webl-programs>.

  It is used to set buffers and their
  data. In WebGL the buffers data is
  separated from their meaning and usage.

  <webgl-vertex-array-objects>,
  <webgl-programs> and <webgl-textures>
  can provide meaning and use the
  buffers declared here.
-->
    <webgl-buffers>
      <triangle-vertices>
        <buffer-data src="#trianglePoints"></buffer-data>
<!--
  The tag <buffer-data> is equivalent
  to the "bufferData" WebGL function.

  The "src" attribute can also be an
  element query string (used in the
  "querySelector" function), as well as
  a url that can point to the data to load.
--> 
      </triangle-vertices>
    </webgl-buffers>

  </webgl-canvas>
</shader-canvas>

<!-- The data for the buffer -->
<div id="trianglePoints">[-0.7, 0, 0, 0.5, 0.7, 0]</div>
```

## One tag per low-level function 


A declarative syntax for graphics API's has several benefits and disadvantages.

### Benefits

- Easy to debug
  * The state and its setup are always available in the DOM
- Emphasis on the initialization phase
  * Graphics APIs are typically inclined towards Command-like
    and Factory-like usage patterns. <br>
    `<shader-canvas>` makes these stand-out even more.
- Frame drawing is tuned to what is declared.
  * A specialized drawing function is created at initialization
    by reading the low-level declaration in the DOM.

### Disadvantages

- Hard for beginners
  * Requires good knowledge of the graphics API structure to get
  started.
- Can become verbose.
  * Lots of tags are hard to manage without good collapsing and
  grouping features. <br>
  `<shader-canvas>` tries to tackle this by providing containers
  and a way to reference their contents.
- New tags to learn
  * `<shader-canvas>` introduces one tag per WebGL function, on
  top of these, it adds < 10 new tags that try to remove a lot
  of the imperative nature of the WebGL API.

## Compose and create

With `<shader-canvas>`, you can also create your own beautiful
abstractions and compositions with low-level graphics tags.

You can create your tags and split the graphics API into
composable parts.

As an example, you might want to redo the triangle from the code 
with something like this:


```html
<shader-canvas>
  <buffer-2d variable="vertex2d">
    [-0.7,   0,
        0, 0.5,
      0.7,   0]
  </buffer-2d>
  <vertex-code>
    #version 300 es
    void main() {
      gl_Position = vertex2d;
    }
  </vertex-code>
  <fragment-code>
    #version 300 es
    precision highp float;
    out vec4 outColor;

    void main() {
      outColor = vec4(1, 0, 1, 1);
    }
  </fragment-code>
</shader-canvas>
```

You can create these three new tags, or any other tag and abstraction
, as parts of the WebGL API.

To do so `<shader-canvas>` provides the `<new-parts>` special container.
Each child of the `<new-parts>` tag represents a part of the low level
graphics API.

For the three new tags above (`<buffer-2d>`, `<vertex-code>` and `<fragment-code>`),
the `<new-parts>` would look like this:

```html
<!--
Create new tags to be used when
composing parts of the graphics backend

Name each child tag as you want.

When they are used, their contents
will be merged with the graphics backend.
-->
<new-parts>
  <buffer-2d>
<!--
  Any name can be set, here "buffer-2d"
  was chosen.

  Inside each <new-parts> child you setup
  the "blueprint" of what it will do and
  define at the graphics backend when
  the tag is used.
-->
      <webgl-buffers>
<!--
  The buffers declared will be merged with
  the existing <webgl-canvas> buffers.
-->
        <vertices-2d>
          <buffer-data data-src="textContent"></buffer-data>
<!--
  Attributes from the tag being created
  can be placed into its blueprint through
  the data-attributes.

  Here the `data-src` is setting the "src"
  of the <buffer-data> to be the
  "textContent" of the <buffer-2d> instance.
-->
        </vertices-2d>
      </webgl-buffers>

      <webgl-program-part>
<!--
  Shaders can also be created from parts.
  The code from the <vertex-shader> inside
  a <webgl-program-part> can be composed with
  any shader program whenever the <buffer-2d>
  element is declared in them.
-->
        <vertex-shader>
         <code>
           in vec4 vertex2d;
         </code>
        </vertex-shader>
      </webgl-program-part>

      <webgl-vertex-array-objects>
        <vao-2d>
          <bind-buffer src="vertices-2d">
            <vertex-attrib-pointer data-variable="variable" size="2">
            </vertex-attrib-pointer>
          </bind-buffer>
        </vao-2d>
      </webgl-vertex-array-objects>

<!--
  Draw calls can also be composed
  and merged.
-->
      <draw-calls>
        <viewport-transform x="0" y="0"></viewport-transform>
        <clear-color red="0" green="0" blue="0" alpha="1"></clear-color>
        <clear-flags mask="COLOR_BUFFER_BIT"></clear-flags>
        <use-program src="program-2d">
          <draw-vao src="vao-2d"></draw-vao>
        </use-program>
      </draw-calls>
  </buffer-2d>

  <vertex-code>
      <webgl-programs>
        <program-2d>
<!--
  Creates a new program
  called "program-2d".
-->
          <buffer-2d></buffer-2d>
<!--
  Using the tag inside a WebGL container
  will make it merge the specific contents
  that the tag might have for that container.

  Here <buffer-2d> will merge its 
  <webgl-program-part> into this
  shader.
-->
          <vertex-shader>
            <code data-textContent="textContent"></code>
          </vertex-shader>
        </program-2d>
      </webgl-programs>
  </vertex-code>

  <fragment-code>
      <webgl-programs>
        <program-2d>
<!--
  Also creates a program called
  "program-2d".

  Collisions are deep merged.
-->
          <buffer-2d></buffer-2d>
          <fragment-shader>
            <code data-textContent="textContent"></code>
          </fragment-shader>
        </program-2d>
      </webgl-programs>
  </fragment-code>
</new-parts>

<!--
  Congrats, three new tags to use!
-->
```

`<shader-canvas>` uses no dependencies and has ~80KB of JavaScript (~15KB minified and gzipped).

