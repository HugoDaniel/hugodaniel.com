+++
title = "I was banned from Claude for scaffolding a CLAUDE.md file"
description = ""
date = 2026-01-22
extra = { place = "Amadora", author = "Hugo Daniel", social_img = "/images/claude_code_logo.png", class="center-images with-lists", modules = [] }
+++

```
API Error: 400 {
  "error": {
    "type": "invalid_request_error",
    "message":"This organization has been disabled."
  },
  ...
}
```

One minute I'm a €220/month "Max 20x" AI _"power user"_ (is this even a thing?).
The next, I am a disabled non-person "organization". 


Like a lot of my peers I was using claude code CLI regularly and trying to understand how far I could go with it on my personal projects. Going wild, with ideas and approaches to code I can now try and validate at a very fast pace. Run it inside `tmux` and let it do the work while I went on to do something else. 

Until in one of these sessions I got presented with that response.

!["Ban hammer was fast!"](/images/claude_ban.jpg)

## Organizations of late capitalism, unite! 

My account was banned! no warning and no feedback, just that message saying that my request was invalid because I am a disabled organization.

I wasn't even doing anything groundbreaking, in fact, I was asking it to tune a tool I use to do project scaffolding.

Yes you read that right: project scaffolding! Probably one of the most boring things you can think of doing!

## The quine is the quine

So I asked claude to update my scaffolding tool so that it would include a CLAUDE.md file in there with baked instructions for a particular homemade framework (*cof* [boreDOM](https://hugodaniel.com/posts/boredom-another-js-framework/) *cof*).

I was playing like a "human-in-the-loop" middleware for these LLM tools. Like watching one instance of Claude try to "boss around" another instance of itself, and the platform's security guards mistook it for a riot.

To help understand this, there are three main characters in this story:

- Claude A 
- Claude B
- A disabled organization (me)

The loop was like this:

1. The disabled organization asked Claude A to update the scaffold tool with a cool CLAUDE.md 
2. The disabled organization went on and started a new project with the tool, opened a claude in there (Claude B) and asked for a complex task to be done
3. Whenever Claude B made a mistake, the disabled organization would go to Claude A, paste the error, and say something like "hey, Claude B made this error"
4. goto I

The loop repeated until the disabled organization was told it was a disabled organization.

Banned!

## STOP! YOU ARE WRONG

I just wanted a standard context file for new projects.

At one point Claude A got somewhat annoyed with Claude B, and started shoutting! writting in en-US instead of en-GB, that is: ALL CAPS.

I went on to check the file, and it was getting littered with these kind of instructions to make Claude B do something instead of what it would try to do.

My guess is that this likely tripped the "Prompt Injection" heuristics that the non-disabled organization has. 

I would love to see the face of that AI when it saw its own "system prompt" language being echoed back to it.

Or I don't know. This is all just a guess from me.

!["That hole is red. That hole is me."](/images/claude_code_logo.png)

## "It’s not just bad support; it’s automated exclusion."

So I went running to read their docs. What was going on here?

Made an appeal, which was a link to a google docs form, with a textbox where I tried to convince some Claude C in the multi-trillion-quadrillion dollar non-disabled organization that I was not only a human but also a well-intended one.

I got no reply. Not even an automatic response. 0 comms.

So I wrote to their support, this time I wrote the text with the help of an LLM from another non-disabled organization.

I got no reply. Not even an automatic response. 

And to wonder that people complain about civil servants, eh, wait until you have to deal with one of these expensive machines!

After a couple of days I got an e-mail:

### Credit note from Anthropic, PBC for invoice #...

Yes, the only e-mail I got was a credit note giving my money back.

It's like they're saying "We don't want to talk to you anymore, here is some hush money". But hey guys, it is not a conversation if it is one-way only, and here I am talking to a wall.

I didn't even get to have a "It's not you, it's us." I just got a credit note.

## Ahaha I'm so happy!

I'm glad this happened with this particular non-disabled-organization. Because if this by chance had happened with the other non-disabled-organization that also provides such tools... then I would be out of e-mail, photos, documents, and phone OS.

AI moderation is currently a "black box" that prioritizes safety over accuracy to an extreme degree.

If you are automating prompts that look like system instructions (i.e. scaffolding context files), you are walking on a minefield.

## Conclusion

I got my €220 back (ouch that's a lot of money for this kind of service, thanks capitalism). I have reframed the whole scaffolding project, and reverted all the code Claude did there.

Soon I will re-release [boreDOM](https://hugodaniel.com/pages/boreDOM/) with a new angle and approach, without the help of Claude. I am trying to turn it into a JS framework for LLMs (llm first, or even llm only, it now has no API). To produce and iterate on those single.html files that these tools are now bringing to the world.

If you want to take a look at the CLAUDE.md that Claude A was making Claude B run with, I commited it and it is available [here](https://github.com/HugoDaniel/boreDOM/blob/9a0802af16f5a1ff177799404c34ce5444345915/boreDOMCLI/cli.js#L129).

Again to wrap this up: this whole post is just my hypothesis. Claude was not doing anything other than iterating on this file at the moment I got the ban. And I haven't heard from them about this anymore (or ever).

_"you got to understand that these organizations have a lot of users..."_

