+++
title = "WebGPU shader limits"
description = "The only limits are the ones you set yourself (or so they said)."
date = 2025-09-16
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/cryingwebgpu.webp", class="center-images with-lists" }
+++

<style>
  .result-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;margin:12px 0 16px}
  .result-card{border:1px solid var(--border,rgba(0,0,0,.12));border-radius:12px;padding:12px;background:var(--elev,#fff);
    box-shadow:0 1px 3px rgba(0,0,0,.06)}
  .result-card h4{margin:0 0 6px;font-size:1rem;line-height:1.2}
  .kv{display:flex;gap:8px;flex-wrap:wrap;margin:6px 0}
  .badge{display:inline-block;padding:2px 8px;border-radius:9999px;font-size:.82em;font-weight:600;border:1px solid transparent}
  .ok{background:#e6ffed;color:#0f6b2b;border-color:#b6efc5}
  .err{background:#ffe8e8;color:#9b1c1c;border-color:#f3b0b0}
  .na{background:#f1f5f9;color:#334155;border-color:#cbd5e1}
  .limit{font-family:ui-monospace,SFMono-Regular,Menlo,monospace; margin-top: 1rem;}
  .msg{margin-top:6px;font-style:italic;opacity:.9}
</style>

Limits can be a fun thing to look out for when exploring unconventional ways to
use something in a safe, consensual, way.

A while ago I got in my mind that it would be cool to try to dump data directly
in the shader code string. Engrave the data in the code instead of going with
the common approach of providing it through some external mechanism (textures,
buffers, etc). This manipulation of the code string would happen before it being
compiled and by making use of some sort of pre-processor that could update the
shader code in unusual ways. A lispic meta shader code as a service or something
like that.

That road led me to over-engineer a demoscene engine that still grabs my
attention to this day and hopefully will bring its first fruits in
[Inercia 2025](https://2025.inercia.pt/en/) or 2026. But this will be the
subject for a future post.

In the meanwhile there were some learnings that I found that might be cool
enough to be worth of your attention. All code is WGSL shader code.

### By the book limits

Querying the WebGPU device is the regular way to know about some of the limits
of the adapter/device we have running. It gives developers the device reported
maximum values for certain things like the maximum storage buffer binding size
and maximum invocations per workgroup etc.

These queried limits are the ones that change between devices, and naturally do
not cover all the limits that we are bound to. For instance a lot of the limits
come from WebGPU and WGSL specs and these are often the minimum limits that the
implementations must support.

For this blog post I am interested in the WGSL shader code limits, which the
spec lays out in a nice table:

!["WGSL Limits from the spec"](/images/WGSL_limits.png)
<small>(image from the
[WGSL 9 Sep 2025 spec limits section](https://www.w3.org/TR/WGSL/#limits))
</small>

To explore these, lets start with a simple shader code, the triangle.

### You can’t spell Triskel without TRI.

The simple WGSL triangle can be done with the vertex code:

```wgsl
@vertex
fn vertexMain(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {

  // A static array with the coordinates of this triangle
  var pos = array<vec2f, 3>(
    vec2(0.5, 0.5), vec2(-0.5, -0.5), vec2(0.5, -0.5),
  );

  return vec4f(pos[VertexIndex], 0.0, 1.0);
}
```

How many vertices can we fit into that `var pos = array<vec2f, 3>` array?

The last row of the WGSL limits table tells us that the minimum supported value
that WebGPU has to guarantee for the _"Maximum number of elements in value
constructor expression of array type "_ is 2047.

In order to test this, lets introduce a bit of JS in this shader module string
to extend the last vertex to guarantee that the array is filled n times:

```typescript
const preprocessWGSL = (n: number) => `
@vertex
fn vertexMain(
  @builtin(vertex_index) VertexIndex : u32
) -> @builtin(position) vec4f {

    var pos = array<vec2f, ${n}>(
    ${
  "vec2(0.0, 0.5), vec2(-0.5, -0.5), " +
  // Extend this vertex:
  "vec2(0.5, -0.5), ".repeat(n - 2).slice(0, -2)
});

  return vec4f(pos[VertexIndex], 0.0, 1.0);
}`;
```

### Procedural generation of limits

Now I want to replicate this kind of logic of declaring a super big thing in the
WGSL code to check the other limits of that spec table.

The idea is to do this in three steps:

1. Create a shader module with the offending code, and check for compilation
   errors. If it passes:
2. Create a WebGPU pipeline with the offending code, and check if it doesn't
   throw. If it passes:
3. Go to 1. but increase the number up until a value is found that breaks
   either 1. or 2.

#### Create shader and pipeline

I am testing both the `createShaderModule()` and the pipeline creation, since
some things are only checked when the pipeline is created
(binding layout, workgroup effective storage limits, etc).

I am expecting that the `createShaderModule()` compilation info is more about
syntax and tipification. While pipeline creation more about storage or byte limit
errors.

#### Setup

All values provided are for my machine, which is an intel macos with an Intel
and AMD gpu. The reported adapter vendor is _"Intel"_ and architecture is
_"gen-9"_.

All code is run in a webworker in an offline canvas.

Lets go bottom up through the WGSL table limits and do this!

### Maximum number of elements in value constructor expression of array

The table says it WGSL should support at least 2047 elements.

Using the code above and recipe I get the following in my intel apple macbook:

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge err">Compile: error at 2048</span>
      <span class="badge na">Pipeline: —</span>
    </div>
    <div class="msg">“constant array cannot have more than 2047 elements”</div>
    <div class="limit"><strong>Limit hit:</strong> 2047 (WGSL floor)</div>
  </div>

  <div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge ok">Compile: OK until 2047</span>
      <span class="badge err">Pipeline: error at 2048</span>
    </div>
    <div class="msg">Stalls for about 10 seconds and then pipeline throws with a long
    message with C++ code. Browser is irresponsive with much bigger limits.</div>
    <div class="limit"><strong>Limit hit:</strong> 2047 (WGSL floor)</div>
  </div>
</div>

<!--
- Safari Tech Preview (227)
  - Compilation error: <span style="color: green;">Yes</span> | Pipeline error:
    <span style="color: green;">Yes</span>
  - Message: _"constant array cannot have more than 2047 elements"_
- Google Chrome (140.0.7339.133)
  - Compilation error: <span style="color: brown;">No</span> | Pipeline error:
    <span style="color: brown;">Throws a bunch of C++ code.</span>
  - Message: Stalls for about 10 seconds and then pipeline throws with a long
    message with C++ code. Browser is irresponsive with much bigger limits.
  - Limit before error: 2047 (same as the minimum in the WGSL table).
-->

### Maximum combined byte-size of all variables instantiated in the workgroup address...

The WGSL table says we should be able to have at least 16384 bytes.

This value is the same as the one communicated by the hardware device limits at
`maxComputeWorkgroupStorageSize`.

To test this up, I created a simple compute shader with another really big
array. I am not sure if it is necessary to include a barrier to prevent some
sort of memory layout optimization or dead code elimination here, so I added it
nevertheless.

```wgsl
// output, this is just to enforce the usage of the workgroup data
@group(0) @binding(0) var<storage, read_write> output: array<f32>;

// the ${n} here is coming from the JS preprocessor
var<workgroup> sharedData: array<f32, ${n}>;

@compute @workgroup_size(64)
fn computeMain(@builtin(local_invocation_id) localId: vec3<u32>) {
  let idx = localId.x;

  // fill it up! (the ${n} here is coming from the JS preprocessor)
  if (idx < ${n}) {
    sharedData[idx] = f32(idx);
  }
  workgroupBarrier();

  // compiler might be smart to just ignore the variable if not used, so
  // lets use it here just to avoid dead code elimination:
  if (idx == 0) {
    var sum = 0.0;
    // the ${n} here is coming from the JS preprocessor
    for (var i = 0u; i < ${n}; i++) {
      sum += sharedData[i];
    }
    output[0] = sum;
  }
}
```

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge err">Pipeline: error above 16384</span>
    </div>
    <div class="msg">“The combined byte size of all variables in the workgroup address
    space exceeds 16384 bytes”</div>
    <div class="limit"><strong>Limit hit:</strong> 16384 (WGSL floor)</div>
  </div>

  <div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge err">Pipeline: error at 2048</span>
    </div>
    <div class="msg">“The total use of workgroup storage (16400 bytes) is larger than
    the maximum allowed (16384 bytes). This adapter supports a higher
    maxComputeWorkgroupStorageSize of 32768, which can be specified in
    requiredLimits when calling requestDevice(). Limits differ by hardware, so
    always check the adapter limits prior to requesting a higher limit.”</div>
    <div class="limit"><strong>Limit hit:</strong> 16384 (WGSL floor)</div>
  </div>
</div>
<!--
- Safari Tech Preview (227)
  - Compilation error: <span style="color: brown;">No</span> | Pipeline error:
    <span style="color: green;">Yes</span>
  - Message: _"The combined byte size of all variables in the workgroup address
    space exceeds 16384 bytes"_
- Google Chrome (140.0.7339.133)
  - Compilation error: <span style="color: brown;">No</span> | Pipeline error:
    <span style="color: green;">Yes</span>
  - Message: _"The total use of workgroup storage (16400 bytes) is larger than
    the maximum allowed (16384 bytes). This adapter supports a higher
    maxComputeWorkgroupStorageSize of 32768, which can be specified in
    requiredLimits when calling requestDevice(). Limits differ by hardware, so
    always check the adapter limits prior to requesting a higher limit."_
  - Limit before error: 16384 (same as the minimum in the WGSL table).
-->

We could try to increase the hardware limits by requesting a bit more from the
device, but I am just looking at what happens at the limit for creative
purposes.

Lets move on to the next row of the WGSL spec limits table.

### Maximum combined byte-size of all variables instantiated in the function address...

The spec says that we should have 8192 bytes. The thing here is that function
space variables are unique to each invocation, they are not shared, so no need
for the barrier as above.

Also this limit is not communicated by the hardware device when querying for
limits, so lets see.

```wgsl
@group(0) @binding(0) var<storage, read_write> output: array<f32>;

fn someFunctionWithLocalMemory() -> f32 {
  // Same thing as before, ${n} is the JS preprocessor input:
  var localMem: array<f32, ${n}>;
  
  // ${n} is the JS preprocessor
  for (var i = 0u; i < ${n}; i++) {
    localMem[i] = f32(i);
  }
  
  var sum = 0.0;
  // ${n} is the JS preprocessor
  for (var i = 0u; i < ${n}; i++) {
    sum += localMem[i];
  }
  
  return sum;
}

@compute @workgroup_size(1)
fn computeMain() {
  output[0] = someFunctionWithLocalMemory();
}
```

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge err">Pipeline: error above 8192</span>
    </div>
    <div class="msg">“The combined byte size of all variables in this function exceeds
    8192 bytes”</div>
    <div class="limit"><strong>Limit hit:</strong> 8192 (WGSL floor)</div>
  </div>

  <div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge ok">Pipeline: no error</span>
    </div>
    <div class="msg">No message, the limit is never reached, at 262144bytes the
    compilation fails with the message _“array count (65536) must be less than
    65536”_, which is not a limit I could find in the spec.</div>
    <div class="limit"><strong>Limit hit:</strong> 262145 - Array count got to 65536 and I was using f32 (4 bytes)</div>
  </div>
</div>

<!--
- Safari Tech Preview (227)
  - Compilation error: <span style="color: red;">No</span> | Pipeline error:
    <span style="color: green;">Yes</span>
  - Message: _"The combined byte size of all variables in this function exceeds
    8192 bytes"_
  - Limit before error: 8192 (same as the minimum in the WGSL table).
- Google Chrome (140.0.7339.133)
  - Compilation error: <span style="color: red;">No</span> | Pipeline error:
    <span style="color: green;">No</span>
  - Message: No message, the limit is never reached, at 262144bytes the
    compilation fails with the message _"array count (65536) must be less than
    65536"_, which is not a limit I could find in the spec.
  - Limit before error: 262144, because array count got to 65536 and I was using
    elements with 4 bytes (f32).

-->

This ceiling of 65536 elements seems to be a practical limit of the toolchain
(Chrome, or maybe even driver). This is ok since the groundfloor established by
the spec is way below it.

### Maximum combined byte-size of all variables instantiated in the _private_ address space

The private address space is cool for module-scope variables that are unique for
each invocation but persist accross function calls within it.

The limit in the spec table is again 8192 bytes, to test this I will declare a
big array as `var<private>` (which is the default when declaring variables in
the module scope) and see how big it can be. Again this is not a limit exposed
through the WebGPU API hardware device limits.

```wgsl
@group(0) @binding(0) var<storage, read_write> output: array<f32>;

// Same as before, a big array:
var<private> privateData: array<f32, ${n}>;

@compute @workgroup_size(1)
fn computeMain() {

  // Initialize it, the ${n} is set by this test shader preprocessor
  for (var i = 0u; i < ${n}; i++) {
    privateData[i] = f32(i);
  }
  
  var sum = 0.0;
  // Use all the data to avoid it being optimized away, like above
  // the ${n} is set by this test shader preprocessor
  for (var i = 0u; i < ${n}; i++) {
    sum += privateData[i];
  }
  
  output[0] = sum;
}
```

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge err">Pipeline: error above 8192</span>
    </div>
    <div class="msg">“The combined byte size of all variables in the private address
    space exceeds 8192 bytes”</div>
    <div class="limit"><strong>Limit hit:</strong> 8192 (WGSL floor)</div>
  </div>

  <div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge ok">Pipeline: no error</span>
    </div>
    <div class="msg">Same as previous test. This specific limit is never reached, however at 262144bytes the
    compilation fails with the message _“array count (65536) must be less than
    65536”_.</div>
    <div class="limit"><strong>Limit hit:</strong> 262145 - Array count got to 65536 and I was using f32 (4 bytes)</div>
  </div>
</div>

<!--
- Safari Tech Preview (227)
  - Compilation error: <span style="color: red;">No</span> | Pipeline error:
    <span style="color: green;">Yes</span>
  - Message: _"The combined byte size of all variables in the private address
    space exceeds 8192 bytes"_
  - Limit before error: 8192 (same as the minimum in the WGSL table).
- Google Chrome (140.0.7339.133)
  - Compilation error: <span style="color: red;">No</span> | Pipeline error:
    <span style="color: green;">No</span>
  - Message: Same as in the previous test. This specific limit is never reached,
    however at 262144bytes the compilation fails with the message _"array count
    (65536) must be less than 65536"_.
  - Limit before error: 262144, because array count got to 65536 and I was using
    elements with 4 bytes (f32).
-->

And lets move on to the next one.

### Maximum number of case selector values in a switch statement

This is an interesting one, it certainly did not cross my mind to explore the
amount of case selector values. WGSL switch's must always carry a default case,
which always counts as 1 regardless if it is empty or not.

Im going with just single values per case, since my purpose is to hit my
desired limit and not so much to test the switch case implementation nuances:

```wgsl
@group(0) @binding(0) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let testValue = i32(id.x) % ${numCases};
  var result: f32 = -1.0;
  
  switch testValue {
${cases.join("\n")}
    default: {
      result = 999.0;
    }
  }
  
  output[0] = result;
}
```

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 1023</span>
      <span class="badge na">Pipeline -</span>
    </div>
    <div class="msg">“switch statement cannot have more than 1023 case selector
    values”</div>
    <div class="limit"><strong>Limit hit:</strong> 1023 (WGSL floor)</div>
  </div>

  <div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 16383</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“switch statement has 16384 case selectors, max is 16383”</div>
    <div class="limit"><strong>Limit hit:</strong> 16383 </div>
  </div>
</div>

<!--
- Safari Tech Preview (227)
  - Compilation error: <span style="color: green;">YES</span> | Pipeline error:
    <span style="color: green;">YES</span>
  - Message: _"switch statement cannot have more than 1023 case selector
    values"_
  - Limit before error: 1023 (same as the minimum in the WGSL table).
- Google Chrome (140.0.7339.133)
  - Compilation error: <span style="color: green;">YES</span> | Pipeline error:
    <span style="color: green;">YES</span>
  - Message: _"switch statement has 16384 case selectors, max is 16383"_
  - Limit before error: 16383.
-->

### Maximum number of parameters for a function

This is a cool way for a preprocessor to pass down extra data in the shader
string code. The spec says that we have at least 255 arguments for each
function, so lets create a preprocessor that uses structs and see how WebGPU
behaves.

```wgsl
@group(0) @binding(0) var<storage, read_write> output: array<f32>;

struct MyStruct {
  value: f32,
  flag: bool
}

fn someFunction(${
    Array.from({ length: n }, (_, i) => `s${i}: MyStruct`).join(", ")
  }) -> f32 {
  var sum = 0.0;
  ${Array.from({ length: n }, (_, i) => `sum += s${i}.value;`).join("\n      ")}
  return sum;
}

@compute @workgroup_size(1)
fn main() {
  let s = MyStruct(1.0, true);
  output[0] = someFunction(${Array.from({ length: n }, () => "s").join(", ")});
    }
```

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 255</span>
      <span class="badge na">Pipeline -</span>
    </div>
    <div class="msg">“function cannot have more than 255 parameters”</div>
    <div class="limit"><strong>Limit hit:</strong> 255 (WGSL floor)</div>
  </div>

  <div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 255</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“function declares 256 parameters, maximum is 255”</div>
    <div class="limit"><strong>Limit hit:</strong> 255 (WGSL floor)</div>
  </div>
</div>

<!--
- Safari Tech Preview (227)
  - Compilation error: <span style="color: green;">YES</span> | Pipeline error:
    <span style="color: green;">YES</span>
  - Message: _"function cannot have more than 255 parameters"_
  - Limit before error: 255 (same as the minimum in the WGSL table).
- Google Chrome (140.0.7339.133)
  - Compilation error: <span style="color: green;">YES</span> | Pipeline error:
    <span style="color: green;">YES</span>
  - Message: _"function declares 256 parameters, maximum is 255"_
  - Limit before error: 255 (same as the minimum in the WGSL table).
-->

This limit seems to be per function, and structs are treated as just another
param. It could maybe be used creatively as a way to dump extra data into a
shader code string when other limits are reached. Though I imagine the
compilation time would become a factor at some point.

### Maximum nesting depth of brace-enclosed statements in a function

To test this limit I want to dump a lot of nested if's in the shader string
code. Specs says we can have at least 127 nested block statements.

Here is the full code for it, including the `#computePipeline` from the WebGPU
engine I am working at, where I moved the WebGPU spec to a fully declarative
preprocessor (more about this next post).

```typescript
export const limitsNestedIfShaderModule = (depth: number) => {
  let opening = "";
  let closing = "";
  let indent = "";

  // Create a bunch of nested ifs
  for (let i = 0; i < depth; i++) {
    opening += `${indent}if (${i}.0 < ${depth}.0) {\n`;
    indent += "  ";
    closing = `${indent}output[0] = ${i}.0;\n` + closing;
    if (i < depth - 1) {
      closing = "  ".repeat(depth - i - 1) + "}\n" + closing;
    } else {
      closing = indent.slice(0, -2) + "}\n" + closing;
    }
  }

  const shaderCode = `
#computePipeline someComputation {
  layout=auto
  compute={
    entryPoint=computeMain
    module=code 
  }
}

#shaderModule code {
  code="
@group(0) @binding(0) var<storage, read_write> output: array<f32>;

@compute @workgroup_size(1)
fn computeMain() {
${opening}${closing}
}

"}
  `;

  return shaderCode;
};
```

(As a way to treat shader code as data, I did bring the WebGPU spec to a
declarative space as a high-level abstraction preprocessor for the demoscene
engine I'm working at.)

The results are in:

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 127</span>
      <span class="badge na">Pipeline -</span>
    </div>
    <div class="msg">“maximum parser recursive depth reached”</div>
    <div class="limit"><strong>Limit hit:</strong> 127 (WGSL floor)</div>
  </div>

  <div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 63</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“statement nesting depth / chaining length exceeds limit of 127”</div>
    <div class="limit"><strong>Limit hit:</strong> 64 (below the WGSL floor)</div>
  </div>
</div>

<!--
- Safari Tech Preview (227)
  - Compilation error: <span style="color: green;">YES</span> | Pipeline error:
    <span style="color: green;">YES</span>
  - Message: _"maximum parser recursive depth reached"_
  - Limit before error: 127 (same as spec, which is 127).
- Google Chrome (140.0.7339.133)
  - Compilation error: <span style="color: green;">YES</span> | Pipeline error:
    <span style="color: green;">YES</span>
  - Message: _"statement nesting depth / chaining length exceeds limit of 127"_
  - Limit before error: 63 (**LESS** as the minimum in the WGSL table, which is
    127).
-->

Now this is strange. Safari is doing the right thing, _"brace-enclosed
statements"_ include the function block and beyond. However Chrome appears to be
doing something entirely different, maybe counting closing braces as well? Not
really sure what is happening here.

This got me wondering about the behaviour of nested composite types, which is
coming right next.

### Maximum nesting depth of a composite type

Spec says the limit is 15. I am going to generate a big nested array like this:

```wgsl
array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<array<f32, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>, 2>
```

My idea here is to push the nesting limit of a composite type in a single expression.

These are the results:

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 15</span>
      <span class="badge na">Pipeline -</span>
    </div>
    <div class="msg">“composite type may not be nested more than 15 levels”</div>
    <div class="limit"><strong>Limit hit:</strong> 15 (WGSL floor)</div>
  </div>

  <div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 29</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">Chrome lets it go big until it hits another limits such as: “array
    byte size (0x100000000) must not exceed 0xffffffff bytes”</div>
    <div class="limit"><strong>Limit hit:</strong> 29 for f32 (above WGSL floor)</div>
  </div>
</div>

<!--
- Safari Tech Preview (227)
  - Compilation error: <span style="color: green;">YES</span> | Pipeline error:
    <span style="color: green;">YES</span>
  - Message: _"composite type may not be nested more than 15 levels"_
  - Limit before error: 15 (same as spec, which is 15).
- Google Chrome (140.0.7339.133)
  - Compilation error: <span style="color: brown;">YES</span> | Pipeline error:
    <span style="color: green;">YES</span>
  - Message: Chrome lets it go big until it hits another limits such as: _"array
    byte size (0x100000000) must not exceed 0xffffffff bytes"_
  - Limit before error: 29 for f32.
-->

This suggests that Chrome maybeeee is not be explicitly checking nesting depth
at all (just maybe) and just letting us hit whatever other limit might be in
their parsing stack. This is again ok because the groundfloor established by the
spec is also fullfilled.

### Maximum number of members in a structure type

The final limit that I think might be potentially interesting to test as a
shader developer is the maximum number of members in a struct.

The spec says we can have capacity for at least 1023 members in a struct.

```wgsl
@group(0) @binding(0) var<storage, read_write> output: array<f32>;

// Preprocessor creates n members for this struct:
struct BigStruct {
${members}
}

// Create and use them here to avoid them from being optimized:
@compute @workgroup_size(1)
fn computeMain() {
  var s = BigStruct(${initValues});
  
  ${sumLoop}
  output[0] = result;
}
```

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 1023</span>
      <span class="badge na">Pipeline -</span>
    </div>
    <div class="msg">“struct cannot have more than 1023 members”</div>
    <div class="limit"><strong>Limit hit:</strong> 1023 (WGSL floor)</div>
  </div>

  <div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 16383</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“'struct BigStruct' has 16384 members, maximum is 16383”</div>
    <div class="limit"><strong>Limit hit:</strong> 16383 (above WGSL floor)</div>
  </div>
</div>


Chrome is generous here and goes well beyond the minimum provided.

### A table of it all

These results fit well within my expectations, Safari as always is more strict
and spec oriented, while Chrome goes above the limits in some fronts while
sometimes having a less polished failure mode.

| Limit (WGSL spec)                          | Spec min | Safari TP 227     | Chrome 140                                           |
| ------------------------------------------ | -------: | ----------------- | ---------------------------------------------------- |
| Array constructor elements                 |     2047 | Errs >2047 (2047) | Compiles; Pipelines breaks at 2048; UI may stall     |
| Workgroup storage bytes (`var<workgroup>`) |    16384 | Errs in pipeline  | Pipeline Error; suggests `requiredLimits` 32768      |
| Function local bytes (function stack)      |     8192 | Errs in pipeline  | No limit reached; compiles up to “array count” 65536 |
| Private addr space bytes (`var<private>`)  |     8192 | Errs in pipeline  | No limit reached; same as above                      |
| Case selectors in a `switch`               |     1023 | Errs >1023        | Errs >16383                                          |
| Function parameters                        |      255 | Errs >255         | Errs >255                                            |
| Struct members                             |     1023 | Errs >1023        | Errs >16383                                          |
| Nested brace-enclosed statements           |      127 | Errs >127         | **Errs >63** (below spec min **127**)                |
| Nested composite types                     |       15 | Errs >15          | Errs >29 fails with a different limit                |

### Conclusion

I think that there are at least two takeaways I can safely make from poking at
WGSL spec limits:

1. **The spec minimums are good guidelines**. Safari Technology Preview enforces
   them very strictly, which makes it great to validate what the _portable
   floor_ actually is.

2. **Browsers may go beyond the minimums**. Chrome lets you stretch several rows
   (struct members, switch cases, local/private bytes) way past the spec floor,
   but you’ll sometimes trip different internal limits first (like array-element
   counts) or see pipeline-time failures rather than neat compile errors.

If you’re considering “engraving” data into the shader source for creative or
preprocessing reasons my advice so far would be:

- **Treat spec minimums as the baseline**, and friendlier ceilins as mere
  nice-to-haves.
- **Probe limits first**, one approach could be to probe ceilings on
  startup and cache these results.
- **Standard data paths are the way to go**, storage buffers and textures are
  our friends, this approach of code-embedded payloads is a fun technique, but
  not a substitute for stable I/O.

All of these were run with a preprocessor demo player that I am working on for
fun, if you are curious I'll share a follow-up shortly and ideally a WebGPU demo
at [Inercia 2025](https://2025.inercia.pt/en/).
