+++
title = "Cleaning up for Shape The Pixel"
description = "Taking a look back into the work that was done for Grid Generator and rethink how much of it will actually go into 'Shape The Pixel'. Most technical parts remain the same but there are also a lot of things that will be removed because of the new product shift."
date = 2020-12-11
extra = { place = "Lisboa", author = "Hugo Daniel", social_img = "/images/NerdyCliddy.png",modules = ["modules/cliddy.js", "cliddy-mascot.js"] }
+++

Moving from Grid Generator into the first version of *Shape The Pixel* is going to involve the effort of cleaning and pruning the parts that are slightly outside of its intended focus of drawing shapes.

This implies product changes that will propagate into technical decisions.

## What is going away?

Things that were done in Grid Generator and that are going to be removed in *Shape The Pixel*:

- Login/Register (Login with e-mail and social networks)
- Payments (Payment logic and Braintree integration)
- Business Logic ("when to allow a customer to do what?" - in *Shape The Pixel* there are no customers, the app always does everything)
- Billing (Invoices and Chargebee integration)
- Most UI components (all JSX is going away and it is going to be done with plain HTML and Web Components)
- Developer dependencies (the Grid Generator frontend code only had two dependencies, both are going away: inferno and xxhashjs - others might come in)
- Split repositories (db code, auth server code, video generator, and frontend code)
- Most WebWorkers are going to be removed for the sake of simplicity

## What is going to be new?

Things that are going to be new in *Shape The Pixel*:
- Cliddy (an assistant)
- UI (redone and centered on Cliddy)
- Shape/Grid drawing mode (new UI with a new logic that sits closer to the creative process)

## The more things change...

Most things will remain the same, which means these will still work or will only carry small changes:

- Infinite grid
- Shape - the customizable "pixels" editor
- Replay your work
- MP4 export
- Share your work with a link

## One more thing

Also, expect a couple of surprises on top of these to be announced here on this blog. Alongside a couple of posts detailing some of these points a bit more.


<div style="width: 100%; display: flex; justify-content: center;">
<cliddy-mascot face="8)" touched-face="8D"></cliddy-mascot>
</div>
 
This is part of a new approach to a drawing tool that is going to be called *Shape The Pixel*. Read more about its initial creation ideas [here](/posts/from-gridgenerator-to-shape-the-pixel/). Send me an e-mail if you liked what you read or have any questions/suggestions 🤓



