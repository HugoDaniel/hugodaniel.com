+++
title = "WGSL limits you won't find in the spec"
description = "Hunting for the unknown WebGPU shader limits"
date = 2025-09-23
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

Welcome back, in my [last post](/posts/webgpu-shader-limits/) I did an
evaluation of the WebGPU shader limits that we are told about in the
[WGSL spec](https://www.w3.org/TR/WGSL/#limits).

For this post I want to take a look at the limits we have when writing a WGSL
shader that cannot be found in the spec.

Some of this stuff I have been playing around for no reason besides maybe
eventually finding a creative angle for them or not. While some of it are just
new findings.

In retrospective this feels a bit like off-road terrain that nobody cares about,
these are limits after all, so fasten the seatbelt and lets take a ride.

### Setup

I'm running macOS 15.6.1 in an intel mac. with an Intel and AMD gpu. The
reported adapter vendor is _"Intel"_ and architecture is _"gen-9"_.

All code is run in a webworker in an offline canvas, with a WebGPU DSL that I
have been cooking that allows macros to define all parts of the WebGPU plumbing
(more on that in the next posts).

### 1 - The main unknown practical limit

When composing a big WGSL shader the main limit we have to consider is _how big
can a JS string be?_

After all, WebGPU is somewhat tied to JS from a portability angle. The
[string length section of MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length)
puts it nicely:

> The language specification requires strings to have a maximum length of
> 2<sup>53</sup> - 1 elements, which is the upper limit for precise integers.
> However, a string with this length needs 16384TiB of storage, which cannot fit
> in any reasonable device's memory, so implementations tend to lower the
> threshold, which allows the string's length to be conveniently stored in a
> 32-bit integer.
>
> - In V8 (used by Chrome and Node), the maximum length is 2<sup>29</sup> - 24
>   (~1GiB). On 32-bit systems, the maximum length is 2<sup>28</sup> - 16
>   (~512MiB).
> - In Firefox, the maximum length is 2<sup>30</sup> - 2 (~2GiB)...
> - In Safari, the maximum length is 2<sup>31</sup> - 1 (~4GiB).

It's nice to see Safari upping the limits.

That MDN article is very interesting, with theory and code examples on how to
get to these limits. For my purposes I am going to assume that we are dealing
with a safe limit of `512MiB`.

Thats a big shader!

I don't expect to hit this limit on my tests because I am using `JSON.stringify`
on the shader string to send it together with metadata to my DSL engine WebGPU
player. That `stringify()` function alone will act as a memory barrier for such
mega large strings in some scenarios.

Within this constraint, what other limits are waiting for us?

### 2 - Express your self syntax errors

How big can an expression be in WGSL? lets find out:

```wgsl
// How big can we make this turn out to be?

var result: f32 = 0.0 + 1.0 + 2.0 + 3.0 + 4.0 + ... + ???;
```

For this test I created a small harness to expand the expression up to _"n"_
sums.

The results turned out to be consistent in both Safari and Chrome:

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 512</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“reached maximum expression depth of 512”</div>
    <div class="limit"><strong>Limit hit:</strong> 512 </div>
  </div>

<div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 512</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“reached max expression depth of 512”</div>
    <div class="limit"><strong>Limit hit:</strong> 512 </div>
  </div>
</div>

Surprisingly consistent, even the error message is almost exactly the same.

### 3 - This is not LISP

What if we create the expression like this instead:

```wgsl
// How many parenthesis can we push here?

var result: f32 = 0.0 + (1.0 + (2.0 + (3.0 + (4.0 + ... + ??? )))))...);
```

And again the results turned out to be consistent in both Safari and Chrome:

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 127</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“maximum parser recursive depth reached”</div>
    <div class="limit"><strong>Limit hit:</strong> 127 </div>
  </div>

<div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 127</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“maximum parser recursive depth reached”</div>
    <div class="limit"><strong>Limit hit:</strong> 127 </div>
  </div>
</div>

This time even the error message is exactly the same.

### 4 - Brackets? what brackets?

Now that we know these limits, lets try to create two of these, but chained
together, what could possibly go wrong?

```wgsl
var result1: f32 = 0.0 + 1.0 + 2.0 + 3.0 + 4.0 + ... + 511.0;

// and lets place result1 here:
var result2: f32 = result1 + 1.0 + 2.0 + 3.0 + 4.0 + ... + 511.0;
```

The results are surprising, but on the other end of the surprise:

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">No message, it seems to hang the tab, things stop responding. </div>
    <div class="limit"><strong>Limit hit:</strong> None, a timeout of 5 minutes was reached.</div>
  </div>

<div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge ok">Compile: no error</span>
      <span class="badge err">Pipeline: Breaks with a big C++ error message.</span>
    </div>
    <div class="msg">“ShaderModuleMTL: Unable to create library object: program_source:33:271: fatal error: bracket nesting level exceeded maximum of 256...”</div>
    <div class="limit"><strong>Limit hit:</strong> 1 (Breaks at the first reference of the maximum expression) </div>
  </div>
</div>

Chrome error message is intriguing. You can see it all if you want by clicking
down below.

<details>
  <summary>View Detailed Chrome Error Message</summary>
  <code class="error-content">
    ShaderModuleMTL: Unable to create library object: program_source:33:271: fatal error: bracket nesting level exceeded maximum of 256
program_source:33:271: note: use -fbracket-depth=N to increase maximum nesting level
 from produced MSL shader below:

    #ifdef __clang__
    #pragma clang diagnostic ignored "-Wall"
    #endif

    #pragma METAL fp math_mode(relaxed) #include <metal_stdlib> using namespace
    metal;

    template<typename T, size_t N> struct tint_array { const constant T&
    operator[](size_t i) const constant { return elements[i]; } device T&
    operator[](size_t i) device { return elements[i]; } const device T&
    operator[](size_t i) const device { return elements[i]; } thread T&
    operator[](size_t i) thread { return elements[i]; } const thread T&
    operator[](size_t i) const thread { return elements[i]; } threadgroup T&
    operator[](size_t i) threadgroup { return elements[i]; } const threadgroup T&
    operator[](size_t i) const threadgroup { return elements[i]; } T elements[N]; };

    struct tint_struct { device tint_array<float, 1>* tint_member; const constant
    tint_array<uint4, 1>* tint_member_1; };

    struct tint_struct_1 { uint tint_member_2; };

    float v() { float v_1 = 129795.0f; float v_2 =
    (((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((v_1 +
    1.0f) + 2.0f) + 3.0f) + 4.0f) + 5.0f) + 6.0f) + 7.0f) + 8.0f) + 9.0f) + 10.0f) +
    11.0f) + 12.0f) + 13.0f) + 14.0f) + 15.0f) + 16.0f) + 17.0f) + 18.0f) + 19.0f) +
    20.0f) + 21.0f) + 22.0f) + 23.0f) + 24.0f) + 25.0f) + 26.0f) + 27.0f) + 28.0f) +
    29.0f) + 30.0f) + 31.0f) + 32.0f) + 33.0f) + 34.0f) + 35.0f) + 36.0f) + 37.0f) +
    38.0f) + 39.0f) + 40.0f) + 41.0f) + 42.0f) + 43.0f) + 44.0f) + 45.0f) + 46.0f) +
    47.0f) + 48.0f) + 49.0f) + 50.0f) + 51.0f) + 52.0f) + 53.0f) + 54.0f) + 55.0f) +
    56.0f) + 57.0f) + 58.0f) + 59.0f) + 60.0f) + 61.0f) + 62.0f) + 63.0f) + 64.0f) +
    65.0f) + 66.0f) + 67.0f) + 68.0f) + 69.0f) + 70.0f) + 71.0f) + 72.0f) + 73.0f) +
    74.0f) + 75.0f) + 76.0f) + 77.0f) + 78.0f) + 79.0f) + 80.0f) + 81.0f) + 82.0f) +
    83.0f) + 84.0f) + 85.0f) + 86.0f) + 87.0f) + 88.0f) + 89.0f) + 90.0f) + 91.0f) +
    92.0f) + 93.0f) + 94.0f) + 95.0f) + 96.0f) + 97.0f) + 98.0f) + 99.0f) +
    100.0f) + 101.0f) + 102.0f) + 103.0f) + 104.0f) + 105.0f) + 106.0f) + 107.0f) +
    108.0f) + 109.0f) + 110.0f) + 111.0f) + 112.0f) + 113.0f) + 114.0f) + 115.0f) +
    116.0f) + 117.0f) + 118.0f) + 119.0f) + 120.0f) + 121.0f) + 122.0f) + 123.0f) +
    124.0f) + 125.0f) + 126.0f) + 127.0f) + 128.0f) + 129.0f) + 130.0f) + 131.0f) +
    132.0f) + 133.0f) + 134.0f) + 135.0f) + 136.0f) + 137.0f) + 138.0f) + 139.0f) +
    140.0f) + 141.0f) + 142.0f) + 143.0f) + 144.0f) + 145.0f) + 146.0f) + 147.0f) +
    148.0f) + 149.0f) + 150.0f) + 151.0f) + 152.0f) + 153.0f) + 154.0f) + 155.0f) +
    156.0f) + 157.0f) + 158.0f) + 159.0f) + 160.0f) + 161.0f) + 162.0f) + 163.0f) +
    164.0f) + 165.0f) + 166.0f) + 167.0f) + 168.0f) + 169.0f) + 170.0f) + 171.0f) +
    172.0f) + 173.0f) + 174.0f) + 175.0f) + 176.0f) + 177.0f) + 178.0f) + 179.0f) +
    180.0f) + 181.0f) + 182.0f) + 183.0f) + 184.0f) + 185.0f) + 186.0f) + 187.0f) +
    188.0f) + 189.0f) + 190.0f) + 191.0f) + 192.0f) + 193.0f) + 194.0f) + 195.0f) +
    196.0f) + 197.0f) + 198.0f) + 199.0f) + 200.0f) + 201.0f) + 202.0f) + 203.0f) +
    204.0f) + 205.0f) + 206.0f) + 207.0f) + 208.0f) + 209.0f) + 210.0f) + 211.0f) +
    212.0f) + 213.0f) + 214.0f) + 215.0f) + 216.0f) + 217.0f) + 218.0f) + 219.0f) +
    220.0f) + 221.0f) + 222.0f) + 223.0f) + 224.0f) + 225.0f) + 226.0f) + 227.0f) +
    228.0f) + 229.0f) + 230.0f) + 231.0f) + 232.0f) + 233.0f) + 234.0f) + 235.0f) +
    236.0f) + 237.0f) + 238.0f) + 239.0f) + 240.0f) + 241.0f) + 242.0f) + 243.0f) +
    244.0f) + 245.0f) + 246.0f) + 247.0f) + 248.0f) + 249.0f) + 250.0f) + 251.0f) +
    252.0f) + 253.0f) + 254.0f) + 255.0f) + 256.0f) + 257.0f) + 258.0f) + 259.0f) +
    260.0f) + 261.0f) + 262.0f) + 263.0f) + 264.0f) + 265.0f) + 266.0f) + 267.0f) +
    268.0f) + 269.0f) + 270.0f) + 271.0f) + 272.0f) + 273.0f) + 274.0f) + 275.0f) +
    276.0f) + 277.0f) + 278.0f) + 279.0f) + 280.0f) + 281.0f) + 282.0f) + 283.0f) +
    284.0f) + 285.0f) + 286.0f) + 287.0f) + 288.0f) + 289.0f) + 290.0f) + 291.0f) +
    292.0f) + 293.0f) + 294.0f) + 295.0f) + 296.0f) + 297.0f) + 298.0f) + 299.0f) +
    300.0f) + 301.0f) + 302.0f) + 303.0f) + 304.0f) + 305.0f) + 306.0f) + 307.0f) +
    308.0f) + 309.0f) + 310.0f) + 311.0f) + 312.0f) + 313.0f) + 314.0f) + 315.0f) +
    316.0f) + 317.0f) + 318.0f) + 319.0f) + 320.0f) + 321.0f) + 322.0f) + 323.0f) +
    324.0f) + 325.0f) + 326.0f) + 327.0f) + 328.0f) + 329.0f) + 330.0f) + 331.0f) +
    332.0f) + 333.0f) + 334.0f) + 335.0f) + 336.0f) + 337.0f) + 338.0f) + 339.0f) +
    340.0f) + 341.0f) + 342.0f) + 343.0f) + 344.0f) + 345.0f) + 346.0f) + 347.0f) +
    348.0f) + 349.0f) + 350.0f) + 351.0f) + 352.0f) + 353.0f) + 354.0f) + 355.0f) +
    356.0f) + 357.0f) + 358.0f) + 359.0f) + 360.0f) + 361.0f) + 362.0f) + 363.0f) +
    364.0f) + 365.0f) + 366.0f) + 367.0f) + 368.0f) + 369.0f) + 370.0f) + 371.0f) +
    372.0f) + 373.0f) + 374.0f) + 375.0f) + 376.0f) + 377.0f) + 378.0f) + 379.0f) +
    380.0f) + 381.0f) + 382.0f) + 383.0f) + 384.0f) + 385.0f) + 386.0f) + 387.0f) +
    388.0f) + 389.0f) + 390.0f) + 391.0f) + 392.0f) + 393.0f) + 394.0f) + 395.0f) +
    396.0f) + 397.0f) + 398.0f) + 399.0f) + 400.0f) + 401.0f) + 402.0f) + 403.0f) +
    404.0f) + 405.0f) + 406.0f) + 407.0f) + 408.0f) + 409.0f) + 410.0f) + 411.0f) +
    412.0f) + 413.0f) + 414.0f) + 415.0f) + 416.0f) + 417.0f) + 418.0f) + 419.0f) +
    420.0f) + 421.0f) + 422.0f) + 423.0f) + 424.0f) + 425.0f) + 426.0f) + 427.0f) +
    428.0f) + 429.0f) + 430.0f) + 431.0f) + 432.0f) + 433.0f) + 434.0f) + 435.0f) +
    436.0f) + 437.0f) + 438.0f) + 439.0f) + 440.0f) + 441.0f) + 442.0f) + 443.0f) +
    444.0f) + 445.0f) + 446.0f) + 447.0f) + 448.0f) + 449.0f) + 450.0f) + 451.0f) +
    452.0f) + 453.0f) + 454.0f) + 455.0f) + 456.0f) + 457.0f) + 458.0f) + 459.0f) +
    460.0f) + 461.0f) + 462.0f) + 463.0f) + 464.0f) + 465.0f) + 466.0f) + 467.0f) +
    468.0f) + 469.0f) + 470.0f) + 471.0f) + 472.0f) + 473.0f) + 474.0f) + 475.0f) +
    476.0f) + 477.0f) + 478.0f) + 479.0f) + 480.0f) + 481.0f) + 482.0f) + 483.0f) +
    484.0f) + 485.0f) + 486.0f) + 487.0f) + 488.0f) + 489.0f) + 490.0f) + 491.0f) +
    492.0f) + 493.0f) + 494.0f) + 495.0f) + 496.0f) + 497.0f) + 498.0f) + 499.0f) +
    500.0f) + 501.0f) + 502.0f) + 503.0f) + 504.0f) + 505.0f) + 506.0f) + 507.0f) +
    508.0f) + 509.0f); return v_2; }

    void v_3(uint3 v_4, tint_struct v_5) { uint const v_6 =
    (tint_struct_1{.tint_member_2=((_v_5.tint_member_1)[0u].x / 4u)}.tint_member_2 -
    1u); device float_ const v_7 = (&(*v_5.tint_member)[min(uint(0), v_6)]); (*v_7)
    = v(); }

kernel void
dawn_entry_point_687474703a2f2f6c6f63616c686f737420687474703a2f2f6c6f63616c686f7374(uint3
v_9 [[thread_position_in_grid]], device tint_array<float, 1>* v_10
[[buffer(0)]], const constant tint_array<uint4, 1>* v_11 [[buffer(30)]]) {
tint_struct const v_12 = tint_struct{.tint_member=v_10, .tint_member_1=v_11};
v_3(v_9, v_12); }

- While initializing [ComputePipeline "someComputation"]
  </code>

</details>

My take on this is that since WebGPU is running on top of Metal (my case, i'm on
a mac), WGSL gets compiled to the Metal Shading Language (MSL), and the MSL
compiler has a bracket issue.

The bracket issue seems to be happening because the compiler is stuffing
parenthesis in the second expression. It seems smart enough to recognize that
the first expression can be calculated in compile time, and dumps the result of
it instantly in `v_1`. However the second expression is crippled by parenthesis
way beyond its limit to process them (maybe to guarantee some execution order
when transpiling? why wasn't it smart enough to go full compile time here as
well?).

And Safari oh well, better luck next time I guess.

### 5 - Still expressions

Digging into this a bit further. How many maxed expressions that do not depend
on each other can we place in a function?

My approach to test this while avoiding the nasty bracket error from the
previous test is to accumulate the result in a temporary variable. Then see how
many of these accumulations we can get away with.

```wgsl
var tmp: f32 = 0.0;

tmp += 0.0 + 1.0 + 2.0 + 3.0 + 4.0 + ... + 511.0;
tmp += 0.0 + 1.0 + 2.0 + 3.0 + 4.0 + ... + 511.0;
...
tmp += 0.0 + 1.0 + 2.0 + 3.0 + 4.0 + ... + 511.0;
```

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">No message, it seems to hang the tab, things stop responding.</div>
    <div class="limit"><strong>Limit hit:</strong> Just having a big expression, even if not used, makes the timeout of 5 minutes be reached.</div>
  </div>

<div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 3019</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“Instance dropped error in getCompilationInfo”</div>
    <div class="limit"><strong>Limit hit:</strong> 3019 (tab blinks and WebGPU breaks with “A valid external Instance reference no longer exists”) </div>
  </div>
</div>

A small remark about Chrome is that for higher limits (>4000), the whole macOS
screen blinks dark and browser starts reporting that WebGPU is not supported.

For Safari if you are interested here is the minimal shader that breaks it.

<details>
  <summary>Minimal shader that breaks Safari</summary>
  <code class="error-content">

    @group(0) @binding(0) var<storage, read_write> output: array<f32>;

    fn someFunction() -> f32 {
      var tmp: f32 = 0.0;
    var result0: f32 = 0.0  + 1.0  + 2.0  + 3.0  + 4.0  + 5.0  + 6.0  + 7.0  + 8.0  + 9.0  + 10.0  + 11.0  + 12.0  + 13.0  + 14.0  + 15.0  + 16.0  + 17.0  + 18.0  + 19.0  + 20.0  + 21.0  + 22.0  + 23.0  + 24.0  + 25.0  + 26.0  + 27.0  + 28.0  + 29.0  + 30.0  + 31.0  + 32.0  + 33.0  + 34.0  + 35.0  + 36.0  + 37.0  + 38.0  + 39.0  + 40.0  + 41.0  + 42.0  + 43.0  + 44.0  + 45.0  + 46.0  + 47.0  + 48.0  + 49.0  + 50.0  + 51.0  + 52.0  + 53.0  + 54.0  + 55.0  + 56.0  + 57.0  + 58.0  + 59.0  + 60.0  + 61.0  + 62.0  + 63.0  + 64.0  + 65.0  + 66.0  + 67.0  + 68.0  + 69.0  + 70.0  + 71.0  + 72.0  + 73.0  + 74.0  + 75.0  + 76.0  + 77.0  + 78.0  + 79.0  + 80.0  + 81.0  + 82.0  + 83.0  + 84.0  + 85.0  + 86.0  + 87.0  + 88.0  + 89.0  + 90.0  + 91.0  + 92.0  + 93.0  + 94.0  + 95.0  + 96.0  + 97.0  + 98.0  + 99.0  + 100.0  + 101.0  + 102.0  + 103.0  + 104.0  + 105.0  + 106.0  + 107.0  + 108.0  + 109.0  + 110.0  + 111.0  + 112.0  + 113.0  + 114.0  + 115.0  + 116.0  + 117.0  + 118.0  + 119.0  + 120.0  + 121.0  + 122.0  + 123.0  + 124.0  + 125.0  + 126.0  + 127.0  + 128.0  + 129.0  + 130.0  + 131.0  + 132.0  + 133.0  + 134.0  + 135.0  + 136.0  + 137.0  + 138.0  + 139.0  + 140.0  + 141.0  + 142.0  + 143.0  + 144.0  + 145.0  + 146.0  + 147.0  + 148.0  + 149.0  + 150.0  + 151.0  + 152.0  + 153.0  + 154.0  + 155.0  + 156.0  + 157.0  + 158.0  + 159.0  + 160.0  + 161.0  + 162.0  + 163.0  + 164.0  + 165.0  + 166.0  + 167.0  + 168.0  + 169.0  + 170.0  + 171.0  + 172.0  + 173.0  + 174.0  + 175.0  + 176.0  + 177.0  + 178.0  + 179.0  + 180.0  + 181.0  + 182.0  + 183.0  + 184.0  + 185.0  + 186.0  + 187.0  + 188.0  + 189.0  + 190.0  + 191.0  + 192.0  + 193.0  + 194.0  + 195.0  + 196.0  + 197.0  + 198.0  + 199.0  + 200.0  + 201.0  + 202.0  + 203.0  + 204.0  + 205.0  + 206.0  + 207.0  + 208.0  + 209.0  + 210.0  + 211.0  + 212.0  + 213.0  + 214.0  + 215.0  + 216.0  + 217.0  + 218.0  + 219.0  + 220.0  + 221.0  + 222.0  + 223.0  + 224.0  + 225.0  + 226.0  + 227.0  + 228.0  + 229.0  + 230.0  + 231.0  + 232.0  + 233.0  + 234.0  + 235.0  + 236.0  + 237.0  + 238.0  + 239.0  + 240.0  + 241.0  + 242.0  + 243.0  + 244.0  + 245.0  + 246.0  + 247.0  + 248.0  + 249.0  + 250.0  + 251.0  + 252.0  + 253.0  + 254.0  + 255.0  + 256.0  + 257.0  + 258.0  + 259.0  + 260.0  + 261.0  + 262.0  + 263.0  + 264.0  + 265.0  + 266.0  + 267.0  + 268.0  + 269.0  + 270.0  + 271.0  + 272.0  + 273.0  + 274.0  + 275.0  + 276.0  + 277.0  + 278.0  + 279.0  + 280.0  + 281.0  + 282.0  + 283.0  + 284.0  + 285.0  + 286.0  + 287.0  + 288.0  + 289.0  + 290.0  + 291.0  + 292.0  + 293.0  + 294.0  + 295.0  + 296.0  + 297.0  + 298.0  + 299.0  + 300.0  + 301.0  + 302.0  + 303.0  + 304.0  + 305.0  + 306.0  + 307.0  + 308.0  + 309.0  + 310.0  + 311.0  + 312.0  + 313.0  + 314.0  + 315.0  + 316.0  + 317.0  + 318.0  + 319.0  + 320.0  + 321.0  + 322.0  + 323.0  + 324.0  + 325.0  + 326.0  + 327.0  + 328.0  + 329.0  + 330.0  + 331.0  + 332.0  + 333.0  + 334.0  + 335.0  + 336.0  + 337.0  + 338.0  + 339.0  + 340.0  + 341.0  + 342.0  + 343.0  + 344.0  + 345.0  + 346.0  + 347.0  + 348.0  + 349.0  + 350.0  + 351.0  + 352.0  + 353.0  + 354.0  + 355.0  + 356.0  + 357.0  + 358.0  + 359.0  + 360.0  + 361.0  + 362.0  + 363.0  + 364.0  + 365.0  + 366.0  + 367.0  + 368.0  + 369.0  + 370.0  + 371.0  + 372.0  + 373.0  + 374.0  + 375.0  + 376.0  + 377.0  + 378.0  + 379.0  + 380.0  + 381.0  + 382.0  + 383.0  + 384.0  + 385.0  + 386.0  + 387.0  + 388.0  + 389.0  + 390.0  + 391.0  + 392.0  + 393.0  + 394.0  + 395.0  + 396.0  + 397.0  + 398.0  + 399.0  + 400.0  + 401.0  + 402.0  + 403.0  + 404.0  + 405.0  + 406.0  + 407.0  + 408.0  + 409.0  + 410.0  + 411.0  + 412.0  + 413.0  + 414.0  + 415.0  + 416.0  + 417.0  + 418.0  + 419.0  + 420.0  + 421.0  + 422.0  + 423.0  + 424.0  + 425.0  + 426.0  + 427.0  + 428.0  + 429.0  + 430.0  + 431.0  + 432.0  + 433.0  + 434.0  + 435.0  + 436.0  + 437.0  + 438.0  + 439.0  + 440.0  + 441.0  + 442.0  + 443.0  + 444.0  + 445.0  + 446.0  + 447.0  + 448.0  + 449.0  + 450.0  + 451.0  + 452.0  + 453.0  + 454.0  + 455.0  + 456.0  + 457.0  + 458.0  + 459.0  + 460.0  + 461.0  + 462.0  + 463.0  + 464.0  + 465.0  + 466.0  + 467.0  + 468.0  + 469.0  + 470.0  + 471.0  + 472.0  + 473.0  + 474.0  + 475.0  + 476.0  + 477.0  + 478.0  + 479.0  + 480.0  + 481.0  + 482.0  + 483.0  + 484.0  + 485.0  + 486.0  + 487.0  + 488.0  + 489.0  + 490.0  + 491.0  + 492.0  + 493.0  + 494.0  + 495.0  + 496.0  + 497.0  + 498.0  + 499.0  + 500.0  + 501.0  + 502.0  + 503.0  + 504.0  + 505.0  + 506.0  + 507.0  + 508.0  + 509.0;

      return tmp;
    }

    @compute @workgroup_size(1)
    fn computeMain(@builtin(global_invocation_id) id: vec3<u32>) {
      output[0] = someFunction();
    }

</code>
</details>

### 6 - Amount of functions possible

Now what about the amount of functions we can have in a module (private space)?

Lets see how far this harness can go:

```typescript
const fs = [];
for (let i = 0; i < n; i++) {
  fs.push(`fn funfunfun${i}(a: f32) -> f32 { return a + ${i}.0; }`);
}
```

It will produce a bunch of cuntions with a single argument `a` just for the
purpose of them doing something on something.

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“RangeError: out of memory” in JS because I am using `JSON.stringify()` to send the shader to my DSL engine WebGPU player along with metadata.</div>
    <div class="limit"><strong>Limit hit:</strong> over 5 million.</div>
  </div>

<div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge err">Compile: error above 55719</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">“Instance dropped error in getCompilationInfo” and sometimes WebGPU starts reporting device does not have WebGPU support.</div>
    <div class="limit"><strong>Limit hit:</strong> 55719 (Breaks at the first reference of the maximum expression) </div>
  </div>
</div>

Safari is impressive here. Crunching through millions of these without a
problem. Chrome tab crashes at much lower values than this (probably due to the
`stringify` function, but just assuming here).

### 6 - Function call depth

How many functions can we call inside each other in WGSL?

Lets see how many of this we can create and call the last one before something
breaks:

```wgsl
// How deep can the stack go?

fn levelN() -> f32 { return levelN_minus1(); }
fn levelN_minus1() -> f32 { return levelN_minus2(); }
...
fn levelN_minus${n - 1}() -> f32 { return 1337.0; }
```

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge err">Pipeline: Error above 1159</span>
    </div>
    <div class="msg">No message. A PipelineError exception is thrown right before the tab crashes.</div>
    <div class="limit"><strong>Limit hit:</strong> 1159 </div>
  </div>

<div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge err">Pipeline: Error above 4100</span>
    </div>
    <div class="msg">“A valid external Instance reference no longer exists.” And an `OperationError` with msg: “Instance dropped in popErrorScope”</div>
    <div class="limit"><strong>Limit hit:</strong> 4100 </div>
  </div>
</div>

Chrome supports a much higher function call depth than Safari. But a 1159 call
depth seems a very reasonable limit to play with.

### 7 - Function statements limit

How many statements can a function have? Lets find out:

```wgsl
fn massiveFunction() -> f32 {
  var a = 0.0;
  a = 1.0;
  a = 2.0;
  // Not expressions, but individual statements
  ...
  return a;
}
```

<div class="result-grid">
  <div class="result-card">
    <h4>Safari Technology Preview 227</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge na">Pipeline: -</span>
    </div>
    <div class="msg">JavaScript error in my `JSON.stringify()` function, well above 16 million statements.</div>
    <div class="limit"><strong>Limit hit:</strong> No limit </div>
  </div>

<div class="result-card">
    <h4>Chrome 140.0.7339.133</h4>
    <div class="kv">
      <span class="badge na">Compile: -</span>
      <span class="badge err">Pipeline: Error above 49767</span>
    </div>
    <div class="msg">“Instance dropped error in getCompilationInfo”</div>
    <div class="limit"><strong>Limit hit:</strong> 49767 </div>
  </div>
</div>

Chrome feels somewhat flaky here, this limit is the lowest I got it to break,
but sometimes it got higher values without a stress.
