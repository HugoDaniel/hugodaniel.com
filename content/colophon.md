+++
title = "Colophon"
description = "How this site is built, hosted, and identified."
date = 2026-05-22
extra = { place = "Amadora", author = "Hugo Daniel" }
+++

A small, opinionated stack. Mostly built from open-source pieces I trust and have read.

## Generator

- [Zola](https://www.getzola.org/) — single static binary, Rust. Compiles every post to plain HTML so the server's only job is to serve files.
- Markdown source, syntax highlighting via the "boron" theme.
- Client-side search powered by an elasticlunr index built at compile time.

## Hosting

- [OpenBSD](https://www.openbsd.org) on a small VPS.
- [httpd(8)](https://man.openbsd.org/httpd.8) serves the static files.
- [relayd(8)](https://man.openbsd.org/relayd.8) terminates TLS in front of it and injects security-relevant response headers.
- TLS via Let's Encrypt, full chain.
- Deploys are an `rsync` from my laptop after `make publish`.

## Identity

- All outbound communication can be verified by the PGP key with fingerprint `E49D 556A D099 3482 CA78 B6E8 C181 88F9 E2A4 C0AD`. Subkeys live on a YubiKey 5; the primary requires a physical touch to sign anything.
- Discover the key via WKD: `gpg --locate-external-keys mail@hugodaniel.com`.
- Both UIDs (`mail@`, `hello@`) are verified on [keys.openpgp.org](https://keys.openpgp.org).
- The Atom feed at `/atom.xml` ships with a detached signature at [/atom.xml.asc](/atom.xml.asc). Anyone can verify it was built by this key.
- See [/pgp/](/pgp/) for the long version.

## Alternate access

- Onion mirror (Tor v3): [gbbodsjshg2lrktc3vpcobn5i3qcuhtab5nkzjxaiip3yj5s3rlws7ad.onion](http://gbbodsjshg2lrktc3vpcobn5i3qcuhtab5nkzjxaiip3yj5s3rlws7ad.onion/)
- If you visit the clearnet site in Tor Browser, the `Onion-Location` header should redirect you automatically.
- Gemini capsule: `gemini://hugodaniel.com/` — a hand-curated slice, latest five posts converted to gemtext. Try [Lagrange](https://gmi.skyjake.fi/lagrange/) or [amfora](https://github.com/makew0rld/amfora).

## Things you can poke at

- [/.well-known/security.txt](/.well-known/security.txt) — security contact, PGP fingerprint
- [/humans.txt](/humans.txt) — credits and stack
- [/llms.txt](/llms.txt) — site map for crawlers and language models
- [/atom.xml](/atom.xml) — full feed
- [/pgp.asc](/pgp.asc) — public key

## License

Content is published under [EUPL 1.2](https://eupl.eu).
