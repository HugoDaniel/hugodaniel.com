+++
title = "R.I.P. Rest In Prompt"
description = "Architecture designed for machine collaboration"
date = 2026-02-16
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/rip_prompt.png", class="center-images with-lists", modules = [] }
+++

**TL;DR**

> LLMs tend to mislocalize when there are multiple sources of truth, so they can fail even while generating "correct" code. This post explores what frontend architecture looks like when the primary collaborator is an LLM. I call this LLM Experience (LX): optimizing for discoverability, traceability, and machine-readable runtime feedback over human-centric modularity.

![Rest In Prompt](/images/rip_prompt.png)

### "Make the button more blue"

Think about it, changing a button color in a modern framework such as React, can be a task that spans component code, provider tree traversals, theme tokens, CSS vars, and build-time layers.

This is mostly a lookup problem and not so much a "thinking" problem because in this scenario to change a color we would have to trace through the following:

1. Where is the value defined?
1. What layer owns it?
1. What overrides it?
1. What runtime state mutates it?
1. What token maps to it?

We humans solve this lookup problem using the Dev tools inspector, jumping definitions and class names, toggling states and modifying live styles with a bit of intuition and experience.

For an LLM it's also a lookup problem, but with the failure caveat that it can pick the wrong thing and still produce a plausible looking patch.

Humans debug this by inspecting computed styles and jumping definitions. LLMs don't have that interactive loop, so they often edit Button.tsx, see no effect, then "fix it" by adding inline styles or duplicate tokens... and now the codebase has two competing truths.

An LLM will give us a fast answer and make it look effortless by confidently editing `Button.tsx`. But its retrieval might have caught the wrong files, maybe the real color is coming from the theme provider, and produce a slightly off result because even a 1M-token model will fail if you include the wrong stuff.

Things made for humans that humans struggle with are amplified now. Stuff we consider midly annoying can be a reliability killer for models.

## Where prompts go to die

I keep on inventing small things, functions, frameworks, tools, widgets. Things for fun.

There is a massive blocker nowadays in all of these, that is if you try to invent a new language, or library, or framework, then LLMs will have to look at it from their existing training.

![It is already blue!](/images/btn_more_blue.jpg)

You need to be prepared for LLMs to make moves that only make sense inside ecosystems they've seen billions of times. If its a new JS frontend framework, then LLMs would do things like randomly inject tailwind classes, setup a bundler and package manager, or assume the occasional React pattern of `useEffect` where dependencies are laied in an array and cleanup function is the one being returned.

This is a hard situation we are now at. Anything slightly offset from the mainstream will be fighting the weights of LLMs.

My attempts at prompt-engineering around these didn't help and only made it clear that the problem would need another angle besides prompts.

I then shifted towards re-architecturing things for discoverability.

### Our clean code is a context tax

These machines are only deterministic in a very broad and abstract statistical way. If the codebase doesn't make it easy to locate the source of behavior, I find that models will confidently edit the wrong place or rewrite parts of the system into something they recognize. 

I was forcing these machines to use my new tool the way they use mainstream stacks (Webpack, file splitting, npm, Tailwind, Redux, etc.). But my tool still lived inside the same broad architectural assumptions, only without the cultural momentum those ecosystems have.

So I stopped trying to out-prompt the model, and started reshaping the architecture around how LLMs actually approach code.

![The price is different for LLMs and for Humans](/images/clean_tax.png)

## Developer Experience (DX) vs LLM Experience (LX)

My way into the LLM-experience experience was to avoid the common tactic of making use of the context window to artificially cram awareness into it through prompts.

There is some psychology game here. What is implicit for humans in a codebase, but needs to be explicit for machines?

### DX 

Developer Experience (DX) is the set of design choices we've converged on to help human teams build and maintain software over time. It assumes humans have limited short-term memory and need strong boundaries to keep complexity tame.

It assumes syntax is hard to manage, that code layout and configuration needs to be extremely versatile and layered through to cater for many possible scenarios so that it does not become too "opinionated" or too strict (which can be good things too). 

We humans like to have our logic split in small sections, divide and conquer, remove the noise around, avoid goto, premature-optimization is the root of all evil, do one thing and do it well, and uni-uni-uni-uni-unix problems to infinity.

Be it files, components, objects, functions, blocks of { code }, if's for's, relationships, life choices, whatever. 

### LX

LLM Experience (LX) is a different target, it comprises the set of choices that make a codebase easier for an LLM to read, locate the cause of an effect, modify safely, and validate via feedback.
It assumes that syntax is super easy and that the hard part is finding the correct source of truth and changing it without breaking invariants.

Humans navigate complexity using amazing implicit knowledge and spatial awareness, we go through folders, naming conventions, import strategies, design patterns, source-to-source compilation, like it was easy and benefitial.

LLMs however are more into navigating complexity using contiguous text and local coherence. We both can do both things, but some are better at some. 

_"I have updated index.ts, index.ts and index.ts. If you want I can also patch index.ts and index.ts next."_

Their sense of place has been improving and will hopefully make a lot of this obsolete soon.

**LX in one sentence:** reduce ambiguity about where truth lives, and make runtime feedback point back to the exact edit location.

## Design for LX

There is an apparent tension between DX and LX, where DX adds indirection to make systems scalable the LX removes indirection to make edits reliable.

In the end of the day both LX and DX are trying to reach the same outcome and goal. Both are trying managing the reliability of changes, just through different layers of abstraction.   


<table>
    <thead>
        <tr>
            <th>Feature</th>
            <th>Developer Experience (DX)</th>
            <th>LLM Experience (LX)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><strong>Primary Goal</strong></td>
            <td>Minimize cognitive load for humans.</td>
            <td>Maximize context density/traceability for AI.</td>
        </tr>
        <tr>
            <td><strong>Structure</strong></td>
            <td>Modular, split files, deep hierarchies.</td>
            <td>Co-located sources of truth, shallow hops (often single-file artifacts).</td>
        </tr>
        <tr>
            <td><strong>Logic</strong></td>
            <td>Abstractions (Hooks, Providers, HOCs).</td>
            <td>Explicit, linear, and "in-place" logic.</td>
        </tr>
        <tr>
            <td><strong>Feedback</strong></td>
            <td>Human-readable error messages.</td>
            <td>Machine-parseable JSON logs/signals.</td>
        </tr>
    </tbody>
</table>

In LLM Experience, you collide and reduce the sources of truth, so that it is easier to find the places a behavior could be hiding.

This means bringing structure, style, state, and behavior close together, to try to reduce the casual distance of moving parts, while producing fewer valid ways to do the same thing, to try to constraint the surface area.

Errors and traces are structured to try to instrument runtime feedback for machines.

Essentially LX is an attempt to make it hard to edit the wrong thing in the wrong way, by architecturing to provide a predictable runtime behavior and deterministic logs and feedback above code semiotics.

It's a shift from syntactic explicitness to operational explicitness.


![LLLLLLLLLLLLLMMMMMMMMXXXXXXXX](/images/devx_llmx.png)

### You might already be LXing

Take a look at your current source code, and try to answer these:

- Can I locate any UI effect in <= 2 hops?
- Is there a single authoritative source for tokens?
- Do runtime logs point to an exact edit location?
- Can an LLM run validate -> fix without guessing line offsets?
- If an agent deletes this component and regenerates it from scratch, will it break the rest of the app?
- Can this logic be validated without a complex mocking setup?
- Can I find every occurrence of a feature using a single regex, or is the logic smeared across layers?

Anyway you get the idea, LX is about information density, trying to provide the highest ratio of reasoning per token possible, so that the model doesn't drift away easily.

## LX patterns you can use

- One authoritative place for tokens/theme/state mutations
- Shallow hops: an on-screen effect should be reachable in ≤2 jumps
- Stable identifiers that show up in markup and logs
- Machine-parseable errors (JSON envelopes with code, component, loc)
- Constrained surface area: fewer sanctioned ways to wire events/state
- A validator loop (validate -> fix -> validate) that doesn't require human intuition

## Conclusion

LLMs strive with less ambiguity. When a UI effect has many plausible owners, models can confidently patch the wrong one and then compensate by duplicating logic. LX is my attempt to design against that failure mode by collapsing sources of truth, reduce indirection, and make runtime feedback machine-readable and location-specific.

In the [next post](/posts/redesigning-boredom-for-lx/) I'll show the concrete mechanics I used to make this real in my testbed JS framework [`boreDOM`](/pages/boreDOM/). Where I introduced a CLI validator that drives validate->fix loops, `#sourceURL` mapping so console errors point to the exact block to edit, structured JSON logs, and a constrained event/state surface that reduces generation drift.
