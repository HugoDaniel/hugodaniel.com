+++
title = "vi is not vim"
description = "A few hints to get started using nvi, a lean and clean terminal based editor"
date = 2017-08-12
extra = { place = "Lisboa", author = "Hugo Daniel" }
+++

When dinossaurs ruled the earth there was a young kid that had just installed Red Hat Linux 5 on his computer.<br/>
Fascinated with the "OS for the elite" he was about to experience a devouring frustration.
The kind that gives rise to dark divinities that come to haunt you in your sleep for years to come:

Trying to exit vim.

After a few unsuccessful atempts the computer _power switch_ was the only option left. Like that the dream of a promising carreer in elite-land was shattered for that young boy.

That young boy was me.

## High tech editor, low tech coder

My stubbornness always took the best part of my reason and vim was my editor for years to come. Since rough starts are the perfect driver for a good love story I then ditched it to take a stroll in netbeans land. <br/>After a while a pardon was due and got back to it again. Then I ditched it again for Visual Studio. <br/>Got back to it again. And so on.

Code editors today try to do everything and a pair of boots. Even vim, known for its minimalist looks, is very prone to config-pr0n worthy of the most wild and nasty fantasies.

## I'll show you mine if you show me yours

At one point I got myself in the middle of a config discussion between developers. They were arguing about good .vimrc config options and plugins for vim.

I decided to participate and show my ~60 lines .vimrc file. They laughed. It was so small. Almost useless.

That got me thinking:

**What do i _really_ need in a code editor ?**

After giving a hard thought on my usage/preferences and some possible optimizations I took a look into the market of code editors and decided to **upgrade from vim to vi** (by vi I mean [nvi 1.81.6, still maintained and developed here](http://repo.or.cz/nvi.git) ).

The rest of this blog post is about some nvi parts (vi, not vim), in particular some parts that are percieved as limitations. I will run through them and try to provide arguments that favor them and reasons to use them. Have your salt and pepper at hand before reading further.

## Minimal config file (.exrc)

The nvi config file is named .exrc, here is my current setup:

```
set showmode
set showmatch
set ruler
set shiftwidth=2
set tabstop=2
set verbose
set leftright
set cedit=\
set filec=\
```

9 lines only. No maintenance. No BS.

These options are mostly similar to those in .vimrc, a special note for cedit and filec, these have a =\\\<TAB> (the \<TAB> is the actual tab character there after the \\).
The **cedit** property sets the character to trigger command expansion in the vi command colon mode. The **filec** sets the the character for file name expansion (auto-complete) when opening a new file inside vi (e.g. with :e).

All of these are well documented in the man page.

```
$ man nvi
```

## No unicode support

There are some vi implementations that support multibyte characters like [nvi2](https://github.com/lichray/nvi2). But for this blog post I am assuming your vi is plain [nvi](https://sites.google.com/a/bostic.com/keithbostic/vi/).

No multibyte, wide-char, wtf-8, extended codepoints. Although those are very important to learn and master I do prefer to keep code in plain strict single-byte ASCII (UTF-8 supersedes it).

**Why ?**

It keeps the language coherent with the programming reserved words (more than logic constructs, _while_, _for_, _if_, are english words).

It makes it perfectly visible when an accidental wide-char is inserted (particularly helpful if you are using a keyboard layout that does not use the US key-mapping). This is good to make sure your code is available to read on every system, regardless of locale (it even works if someone opens the code you wrote in an editor that is set to default to UTF-8 encoding).

Another good thing is that it works with a wider variety of fonts. Some monospace terminal fonts can't correctly display all UTF-8 characters.

**But I sometimes need to write documents with strange characters**

That is one of the scenarios where I would use another text editor. nvi is strictly a code/config editor.

## No syntax highlighting

This is another personal preference. It has been a long time since I had to worry about syntax when producing code. If you still struggle with syntax then please use syntax highlighting, it will help those special words stand out.
Otherwise why not give it a try without syntax highlighting for a while (a few weeks to be slightly above the habituation threshold) and measure how you perform ?

It does help to keep your functions small and easy to read.

Comments are shown with their true weight and your commented code is promoted to the same importance as your production code.

Your focus will be in semantics and it is easier to get into it without the syntax aggressively jumping at your face.

## Fast undo

Like in vim the undo in vi is very convenient but has a slightly different way of operating. Instead of pressing _u_ multiple times to go through the various undo levels and then ctrl-r to redo, in vi you do it by pressing _u_ once to undo and the '**.**' to go through the various undo levels.

To redo you press _u_ twice (undo the undo) and then '**.**' to go through the multiple redo levels.

I think this is slightly more coherent and it also makes use of the '**.**' (repeat action) operator in an arguably more logical way.

Like in vim, you can use the _U_ command to restore a line to the state it was before the cursor was placed on top of it (undoing all the chances since that time).

## No visual mode

There is no visual mode in vi (visual mode as in pressing the _v_ command and using your movement keys to select an area of text).

At first this might seem like a big handicap, but vi shares a few commands with vim that once mastered can make you more productive than using the visual mode.

**Marks _m\<insert letter here\>_**

You can setup marks in text, if you type _mx_ it will define the mark x at the current cursor position. Typically these are used to move quickly through the file and go to certain marked positions. For that the ' command is used followed by the mark character name (moves to the line) or with the ` command (moves to the exact cursor position of the mark). To move to mark x do 'x (assuming you did _mx_ in some place before).

Marks can also be used with other common commands like yank, delete, etc..., so instead of using the visual mode you can yank or delete to a a mark set at some position.<br/>
To do that use the _t_ or _f_ commands, like ytx (I read it as: *y*ank *t*o _x_), it will yank all lines up to (but not including) the line at mark x. To include it use the _f_ as in yfx.

## No tabs

Tabs was a feature that I used a lot in vim, unfortunately they only work with vim, so if you want to run a shell command or have a terminal to read compiler output you will need to use them with some other kind of tab system.

On my journey to the limits of usefulness I found myself using vim tabs together with tmux tabs and terminal (osx) tabs.

After those crazy days (months ?) I finally decided to ditch all tabs and stick to a single tool for that purpose, one that is versatile enough to cover my use cases for tabs.

**Do one thing and do it well**

[Tmux](https://github.com/tmux/tmux/wiki) is my current tool of choice, nowadays I don't use terminal tabs or text editor tabs. I leave that work for tmux, an amazing productivity tool that allows me to work fullscreen in zen mode with the code.

**Panes in vi**

Like in vim you can split your window with panes, these are useful to use another section of code as a quick reference or to do some quick yank/past in vi between files/sections.

The pane system in vi works slightly different from vim. To vertically split the window you can also use the :vs, but to horizontally split the window :sp won't work. In vi the command to horizontally split a window is the :E, as in Edit (the same as :e but horizontally split).

To switch between panes ctrl-w will immediately move your cursor to the next window pane. Instead of pressing twice like vim you only need to press it once. This is hard to get used to at first but it is also hard to live without once used to it.

![My nvi with tmux on macos](/images/nvi_tmux_macos.png)

## No macros

One feature that I consistently used in vim was macros (vim _q_ command). It was easy to create bundles of commands and run them to do your repeated text tasks or grunt work. Very useful when replicating huge data files or setting up a [big JSON test file](@/posts/2017-08-11-mastering-console-log.md).

In vi you can also use the power of macros through buffers.

**Buff it up**

Buffers are easy to use, you can prefix your common text manipulation commands (dd, yy, etc...) to a named buffer. To do that start the command with "\<buffer name> where \<buffer name> is any letter from a-z.

Here are some examples:

- **To delete 4 lines and place them into buffer a** "a4dd

- **To paste buffer _a_ to the current cursor position** "ap

- **To view all your buffers go to ex mode (:) and do** :di b

**Who needs macros when you have buffers**

Write a few commands to be executed in your file, place then in a buffer and tell vi that you want to execute the buffer:

```
2)
4dd
G
```

Line by line:

1. move two lines down

2. delete 4 lines

3. go to the end of the file

Put these into a buffer named _c_ with <i>"c3yy</i> (yank 3 lines into buffer _c_), and whenever you want to run it just do _@ c_. Undo _u_ also works nicely with buffered commands.

## Upgrading from vim to vi

There are some cool benefits in using vi like how fast it is and how it handles huge files without a problem.

nvi also performs well in [this benchmark of editors](https://github.com/jhallen/joes-sandbox/blob/master/editor-perf/readme.md)

The case for vi is like any other editor: a matter of getting used to it and keep perfecting your skills through it for what it really matters: writting great code.

## Conclusion

Use what you are more confortable with. There are tradeoffs in every editor (even the mighty visual studio code does not allow you to work without syntax highlighting on...) and today nvi fits nicely with my way of working and approach.

I hope this post to be used as a initial reference and motivation to those that are looking for a more minimalistic way of doing things. I don't intend it to start flame wars.

You know all of these are just my opinions :)
